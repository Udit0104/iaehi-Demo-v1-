import React from "react";
import TextField from "@mui/material/TextField";

function InputComp(props) {
  const { id, label, type, required, error, helperText,onChange } = props;
  return (
    <TextField
      required={required}
      margin="dense"
      id={id}
      label={label}
      type={type}
      fullWidth
      variant="outlined"
      error={error}
      helperText={error && helperText}
      onChange ={onChange}
    />
  );
}

export default InputComp;
