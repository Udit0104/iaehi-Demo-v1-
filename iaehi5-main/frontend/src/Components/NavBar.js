import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import LoginForm from "./LoginForm";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton/IconButton";
import Style from "./NavBar.module.css";
import logo from "../Images/logo.png";
// import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "../contexts/LanguageContext";

function appBarLabel(agree, adminClickHandle, logoutHandle, msg, navigate, t) {
  return (
    <Toolbar className={Style.navDiv}>
      <Typography
        style={{ display: "flex" }}
        variant="h6"
        noWrap
        component="div"
        sx={{ flexGrow: 1 }}
      >
        <img className={Style.logo} src={logo} alt="iaeHi" />
      </Typography>

      {/* <LanguageToggle /> */}

      {msg &&
        (sessionStorage.getItem("admin") !== "1" ? (
          <Button
            onClick={agree}
            color="inherit"
            style={{ marginLeft: "1rem" }}
          >
            {t.leadersView}
          </Button>
        ) : (
          <>
            <Typography onClick={() => navigate("/")}>
              {" "}
              <span className={Style.spanHover}>{t.home}</span>
            </Typography>
            <Typography onClick={() => navigate("/chart")}>
              {" "}
              <span className={Style.spanHover}>{t.summary}</span>
            </Typography>
            <IconButton
              onClick={logoutHandle}
              style={{
                color: "#ffc815",
                marginLeft: "5px",
                paddingRight: "0",
              }}
            >
              <LogoutIcon />
            </IconButton>
          </>
        ))}
    </Toolbar>
  );
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
  },
});

export default function NavBar(props) {
  const { msg } = props;
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // sessionStorage.setItem("loggedin", "0");
  });

  const agreeHandle = () => {
    setOpenForm(true);
  };

  const handleClose = () => {
    setOpenForm(false);
  };

  const adminClickHandle = () => {
    navigate("/chart");
  };

  const logoutHandle = () => {
    sessionStorage.setItem("admin", "0");
    navigate("/");
  };

  return (
    <>
      {openForm && (
        <LoginForm title="Login" open={openForm} onClose={handleClose} />
      )}
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <ThemeProvider theme={darkTheme}>
          <AppBar
            position="static"
            style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
            color="primary"
            elevation={3}
          >
            {appBarLabel(
              agreeHandle,
              adminClickHandle,
              logoutHandle,
              msg,
              navigate,
              t
            )}
          </AppBar>
        </ThemeProvider>
      </Stack>
    </>
  );
}
