import React, { useState, useEffect } from "react";
import Style from "./Details.module.css";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import Button from "./ReUsable/ButtonComp";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import {url} from './Data/apiData'

export default function Details() {
  const [data, setData] = useState("");
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [nameValidation, setNameValidation] = useState(false);
  const [emailValidation, setEmailValidation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(url).then((res) => {
      const emails = res.data.map((e) => e.email);
      setData(emails);
    });
  }, []);
  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
  const userNameHandle = (e) => {
    const input = e.target.value;
    if (input === null || input === "") {
      setNameValidation(true);
    } else {
      setNameValidation(false);
      setUsername(input);
    }
  };
  const emailHandle = (e) => {
    const input = e.target.value;
    const validated = validateEmail(input);
    if (input === null || input === "" || !validated) {
      setEmailValidation(true);
    } else {
      setEmailValidation(false);
      setEmail(input);
    }
  };

  const submitHandle = () => {
    if (data.includes(email)) {
      alert("Answers are already submitted from this email ID!");
    } else {
      navigate("/question", {
        state: {
          username: username,
          email: email,
        },
      });
      sessionStorage.setItem("loggedin", 1);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <div className={Style.Container}>
        <Typography
          style={{ color: "#fff", padding: "2rem" }}
          variant="h4"
          gutterBottom
        >
          Please provide below details
        </Typography>
        <div className={Style.formGroup}>
          <input
            type="text"
            className={Style.formField}
            placeholder="Name"
            name="name"
            id="name"
            onChange={userNameHandle}
            required
          />
          <label htmlFor="name" className={Style.formLabel}>
            Name
          </label>
          {nameValidation && (
            <div className={Style.alertMsg}>
              <span style={{ color: "red" }}>{`* `}</span>Name can't be blank
            </div>
          )}
        </div>
        <div className={Style.formGroup}>
          <input
            type="text"
            className={Style.formField}
            placeholder="Email"
            name="email"
            id="email"
            onChange={emailHandle}
            required
          />
          <label htmlFor="email" className={Style.formLabel}>
            Email
          </label>
          {emailValidation && (
            <div className={Style.alertMsg}>
              <span style={{ color: "red" }}>{`* `}</span>Invalid email Id
            </div>
          )}
        </div>
        {!emailValidation && !nameValidation && username && email && (
          <div style={{ margin: "3rem" }}>
            <Button title="Submit" onClick={submitHandle} />
          </div>
        )}
      </div>
    </Box>
  );
}
