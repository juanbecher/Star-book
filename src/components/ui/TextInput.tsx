import React from "react";
import { Input } from "./Input";
import { Textarea } from "./TextArea";
import { cn } from "@/lib/utils";

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
}

export const TextInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  fullWidth = true,
  multiline = false,
  rows = 4,
  className,
  ...props
}: TextInputProps) => {
  const inputClasses = cn(fullWidth && "w-full", className);

  if (multiline) {
    return (
      <div className={cn("w-full", !fullWidth && "inline-block")}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium mb-2">
            {label}
          </label>
        )}
        <Textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={inputClasses}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      </div>
    );
  }

  return (
    <div className={cn("w-full", !fullWidth && "inline-block")}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <Input
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClasses}
        {...props}
      />
    </div>
  );
};
