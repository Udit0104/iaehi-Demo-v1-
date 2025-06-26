import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from "@material-ui/core";
import React from "react";

export default function Select(props) {
  const { name, label, value, onChange, options } = props;
  return (
    <FormControl className="left-align-text" variant="outlined">
      <InputLabel id="label-select-department">{label}</InputLabel>
      <MuiSelect lable={label} name={name} value={value} onChange={onChange}>
        <MenuItem value="">None</MenuItem>
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.title}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}
