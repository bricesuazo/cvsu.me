"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { Database } from "@kabsu.me/supabase/types";
import { Button } from "@kabsu.me/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@kabsu.me/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@kabsu.me/ui/form";
import { Textarea } from "@kabsu.me/ui/textarea";

import { api } from "~/lib/trpc/client";
import { Icons } from "./icons";

const Schema = z.object({
  post_id: z.string().min(1),
  content: z.string().min(1, { message: "Post cannot be empty." }),
});
export default function UpdatePost({
  open,
  setOpen,
  post,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  post: Database["public"]["Tables"]["posts"]["Row"];
}) {
  const updatePostMutation = api.posts.update.useMutation();

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: {
      content: post.content,
      post_id: post.id,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        content: post.content,
        post_id: post.id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function onSubmit(values: z.infer<typeof Schema>) {
    if (!form.formState.isDirty) return;

    await updatePostMutation.mutateAsync(values);
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Update Post</DialogTitle>
              <DialogDescription>
                This action will update your post.
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What's on your mind?" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be visible to your followers.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting || !form.formState.isDirty
                }
              >
                {form.formState.isSubmitting && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Post
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
