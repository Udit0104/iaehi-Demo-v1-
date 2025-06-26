import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const LanguageToggle = () => {
  const { language, changeLanguage } = useLanguage();

  const theme = createTheme({
    palette: {
      primary: {
        main: "#ffc815",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <ButtonGroup
        variant="contained"
        aria-label="language selection button group"
      >
        <Button
          onClick={() => changeLanguage("en")}
          variant={language === "en" ? "contained" : "outlined"}
          sx={{
            bgcolor: language === "en" ? "#ffc815" : "transparent",
            color: language === "en" ? "black" : "#ffc815",
            borderColor: "#ffc815",
            "&:hover": {
              bgcolor:
                language === "en" ? "#e5b413" : "rgba(255, 200, 21, 0.1)",
            },
          }}
        >
          English
        </Button>
        <Button
          onClick={() => changeLanguage("hi")}
          variant={language === "hi" ? "contained" : "outlined"}
          sx={{
            bgcolor: language === "hi" ? "#ffc815" : "transparent",
            color: language === "hi" ? "black" : "#ffc815",
            borderColor: "#ffc815",
            "&:hover": {
              bgcolor:
                language === "hi" ? "#e5b413" : "rgba(255, 200, 21, 0.1)",
            },
          }}
        >
          हिंदी
        </Button>
      </ButtonGroup>
    </ThemeProvider>
  );
};

export default LanguageToggle;
