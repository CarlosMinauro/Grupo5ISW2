import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface InputProps extends Omit<TextFieldProps, 'variant'> {
  customErrorMessage?: string;
}

const Input: React.FC<InputProps> = ({ customErrorMessage, ...rest }) => {
  const hasError = !!customErrorMessage;
  return (
    <TextField
      {...rest}
      error={hasError}
      helperText={customErrorMessage || rest.helperText}
      variant="outlined"
    />
  );
};

export default Input; 