import {
  FormControl,
  FormControlLabel,
  Checkbox as MuiCheckbox,
} from "@material-ui/core";
import React from "react";

export default function Checkbox(props) {
  const { name, label, value, onChange } = props;
  const convertToDefaultPara = (name, value) => ({
      target :{
          name,
          value
      }
  });
  return (
    <FormControl>
      <FormControlLabel
        control={
          <MuiCheckbox
            name={name}
            checked={value}
            onChange={e=>onChange(convertToDefaultPara(name, e.target.checked))}
            color="primary"
          />
        }
        label={label}
      />
    </FormControl>
  );
}
