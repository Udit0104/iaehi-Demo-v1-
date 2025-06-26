import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useLanguage } from "../../contexts/LanguageContext";

export default function RadioGroups(props) {
  const { onChange, menuItems, mt = 1, mr = 1, ml = 1 } = props;
  const { language, t } = useLanguage();

  return (
    <FormControl sx={{ mt: mt, mr: mr, ml: ml }}>
      <FormLabel id="demo-row-radio-buttons-group-label">{t.gender}</FormLabel>
      <RadioGroup
        defaultValue={menuItems[0].id}
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        onChange={onChange}
      >
        {menuItems.map((e) => (
          <FormControlLabel
            key={e.id}
            value={e.id}
            control={<Radio />}
            label={language === "hi" && e.titleHindi ? e.titleHindi : e.title}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
