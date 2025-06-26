import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useLanguage } from "../../contexts/LanguageContext";

function SelectionComp(props) {
  const {
    label,
    menuItems,
    required,
    error,
    onChange,
    value,
    mt = 1,
    mr = 1,
  } = props;
  const { language } = useLanguage();

  return (
    <FormControl
      sx={{ mt: mt, mr: mr, minWidth: 180 }}
      size="small"
      required={required}
    >
      <InputLabel id="demo-select-small">{label}</InputLabel>
      <Select
        error={error}
        labelId="demo-select-small"
        id="demo-select-small"
        displayEmpty
        value={value}
        label={label}
        onChange={onChange}
      >
        {menuItems &&
          menuItems.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {language === "hi" && item.titleHindi
                ? item.titleHindi
                : item.title}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}

export default SelectionComp;
