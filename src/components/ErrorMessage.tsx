import React from "react";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage = ({
  message,
  className = "",
}: ErrorMessageProps) => {
  return (
    <div className={`text-center mb-6 ${className}`}>
      <p className="text-red-400">{message}</p>
    </div>
  );
};
