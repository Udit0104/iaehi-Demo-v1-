// filepath: /c:/Users/uditv/OneDrive/Desktop/iaehi/frontend/src/Components/LoginForm.js
import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Style from "./FormDialog.module.css";
import ButtonComp from "./ReUsable/ButtonComp";
import InputComp from "./ReUsable/InputComp";
import IconButton from "@mui/material/IconButton/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import logo from "../Images/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { url } from "./Data/apiData";
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffc815",
    },
  },
  typography: {
    subtitle1: {
      fontSize: 3,
    },
  },
});

export default function LoginForm({ open, onClose, title }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const navigate = useNavigate();

  const userNameHandle = (e) => {
    setUsername(e.target.value.toLowerCase());
  };
  const passwordHandle = (e) => {
    setPassword(e.target.value);
  };

  const submitHandle = () => {
    axios
      .post(`${url}/admin/login`, { username, password }) // Use your backend URL
      .then((res) => {
        sessionStorage.setItem("admin", "1");
        sessionStorage.setItem("role", res.data.role);
        sessionStorage.setItem("department", res.data.department);
        navigate("/chart");
        onClose();
      })
      .catch((err) => {
        setErrorMessage(true);
      });
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Dialog
          maxWidth="sm"
          fullWidth
          className={Style.dialog}
          open={open}
          onClose={onClose}
        >
          <div className={Style.dialogTitle}>
            <DialogTitle className={Style.dialogTitle}>
              <img className={Style.logo} src={logo} alt="logo" />
              {title}
            </DialogTitle>
            <IconButton
              onClick={onClose}
              style={{ color: "#ffc815", marginRight: "10px" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
          <DialogContent>
            <InputComp
              id="name"
              label="Name"
              type="text"
              onChange={userNameHandle}
            />
            <InputComp
              id="password"
              label="Password"
              type="password"
              onChange={passwordHandle}
            />
            {errorMessage && (
              <Typography variant="subtitle1">
                <span style={{ color: "red" }}>{`* `}</span> Username and
                password are not matched
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <ButtonComp title="SUBMIT" onClick={submitHandle} />
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </>
  );
}