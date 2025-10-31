import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
  minHeight?: string;
  className?: string;
}

export const Loading = ({
  message,
  minHeight = "min-h-[400px]",
  className = "",
}: LoadingProps) => {
  return (
    <div
      className={`flex justify-center items-center ${minHeight} ${className}`}
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        {message && <p className="text-slate-400">{message}</p>}
      </div>
    </div>
  );
};
