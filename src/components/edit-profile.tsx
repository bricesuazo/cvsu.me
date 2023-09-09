"use client";

import { User as UserFromDB } from "@/db/schema";
import { PenSquare } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { updateBio } from "@/actions/user";
import { Icons } from "./icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { AlertDialogHeader } from "./ui/alert-dialog";
import { useEffect, useState } from "react";
import { User as UserFromClerk } from "@clerk/nextjs/server";
import { Input } from "./ui/input";

export default function EditProfile({
  userFromDB,
  userFromClerk,
}: {
  userFromDB: UserFromDB;
  userFromClerk: UserFromClerk;
}) {
  const form = useForm<{
    bio: string;
    firstName: string;
    lastName: string;
    username: string;
  }>({
    defaultValues: {
      bio: userFromDB.bio ?? "",
      firstName: userFromClerk.firstName ?? "",
      lastName: userFromClerk.lastName ?? "",
      username: userFromClerk.username ?? "",
    },
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      form.setValue("bio", userFromDB.bio ?? "");
      form.setValue("firstName", userFromClerk.firstName ?? "");
      form.setValue("lastName", userFromClerk.lastName ?? "");
      form.setValue("username", userFromClerk.username ?? "");
    }
  }, [open, userFromDB, userFromClerk, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <PenSquare size="1rem" className="mr-2" />
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <AlertDialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Tell us about yourself. This will be shown on your profile.
          </DialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            className="space-y-2"
            onSubmit={form.handleSubmit(async (data) => {
              await updateBio({
                user_id: userFromDB.id,
                bio: data.bio,
              });
              setOpen(false);
            })}
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Username<span className="text-red-500"> *</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Brice" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-x-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      First Name<span className="text-red-500"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Brice" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Last Name<span className="text-red-500"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Suazo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Bio
                    {/* <span className="text-red-500"> *</span> */}
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about yourself" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-x-2">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}