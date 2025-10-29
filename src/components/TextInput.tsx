import TextField from "@mui/material/TextField";
import React from "react";

interface TextInputProps {
  id?: string;
  label: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  fullWidth?: boolean;
  variant?: "outlined" | "filled" | "standard";
}

export const TextInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  fullWidth = true,
  variant = "outlined",
}: TextInputProps) => {
  return (
    <TextField
      id={id}
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      fullWidth={fullWidth}
      variant={variant}
    />
  );
};
