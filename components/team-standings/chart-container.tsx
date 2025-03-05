"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChartContainerProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export function ChartContainer({ 
  title, 
  description, 
  children,
  className = ""
}: ChartContainerProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-[#1f2937] rounded-3xl p-6 border shadow-sm hover:shadow-[0_0_15px_rgba(0,144,208,0.3)] transition-shadow duration-200 dark:border-gray-800",
        className
      )}
    >
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">
          {description}
        </p>
      </div>
      <div className="h-[400px]">
        {children}
      </div>
    </div>
  );
}