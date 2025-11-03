import { cn } from "@/lib/utils";
import React from "react";

export const Tile = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn("bg-card border border-border rounded-lg p-4", className)}
    >
      {children}
    </div>
  );
};
