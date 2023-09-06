"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ToggleTheme({
  ...props
}: React.ComponentPropsWithoutRef<"button"> & { children?: React.ReactNode }) {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      {...props}
    >
      <Sun className="block dark:hidden" size="1.25rem" />
      <Moon className="hidden dark:block" size="1.25rem" />
    </Button>
  );
}
