import TextField, { TextFieldProps } from "@mui/material/TextField";

export const TextInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  fullWidth = true,
  variant = "outlined",
  ...props
}: TextFieldProps) => {
  return (
    <TextField
      id={id}
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      fullWidth={fullWidth}
      variant={variant}
      {...props}
    />
  );
};
