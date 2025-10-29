import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

interface LoadingProps {
  message?: string;
  minHeight?: string;
  className?: string;
}

export const Loading = ({
  message = "Loading...",
  minHeight = "min-h-[400px]",
  className = "",
}: LoadingProps) => {
  return (
    <div
      className={`flex justify-center items-center ${minHeight} ${className}`}
    >
      <div className="flex flex-col items-center gap-4">
        <CircularProgress />
        <p className="text-slate-400">{message}</p>
      </div>
    </div>
  );
};
