import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React from "react";

export default function DatePicker(props) {
  const { name, label, value, onChange } = props;
  const convertToDefaultPara = (name, value) => ({
    target :{
        name,
        value
    }
});
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        inputVariant="outlined"
        label={label}
        format="dd / MM / yyyy"
        name={name}
        value={value}
        onChange={date => onChange(convertToDefaultPara(name,date))}
      />
    </MuiPickersUtilsProvider>
  );
}
