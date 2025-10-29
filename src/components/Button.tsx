import MuiButton from "@mui/material/Button";
import type { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

export interface ButtonProps extends MuiButtonProps {
  loading?: boolean;
}

export const Button = ({
  loading = false,
  disabled,
  children,
  startIcon,
  className,
  variant = "contained",
  size = "small",
  color = "primary",
  ...props
}: ButtonProps) => {
  return (
    <MuiButton
      variant={variant}
      size={size}
      color={color}
      disabled={disabled || loading}
      startIcon={
        loading ? <CircularProgress size={16} color="inherit" /> : startIcon
      }
      className={className}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
