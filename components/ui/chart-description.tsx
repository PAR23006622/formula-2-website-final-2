"use client";

import { cn } from "@/lib/utils";

interface ChartDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function ChartDescription({ className, ...props }: ChartDescriptionProps) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}