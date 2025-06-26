import React, { useState, useEffect } from "react";
import {} from "react-router-dom";
import { ageGroups, genderGroups } from "./Data/variables";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Style from "./FormDialog.module.css";
import ButtonComp from "./ReUsable/ButtonComp";
import InputComp from "./ReUsable/InputComp";
import SelectionComp from "./ReUsable/SelectionComp";
import RadioGroup from "./ReUsable/RadioGroup";
import IconButton from "@mui/material/IconButton/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import logo from "../Images/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "./Data/apiData";
import { useLanguage } from "../contexts/LanguageContext";

// const theme = createTheme({
//   palette: {
//     mode: "light",
//     primary: {
//       main: "#ffc815",
//     },
//   },
// });
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#001f3f",
    },
    background: {
      default: "#001f3f", // True dark blue background
    },
  },
});


export default function FormDialog({
  open,
  onClose,
  title,
  setMsg,
  setUserData,
}) {
  const [data, setData] = useState("");
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [nameValidation, setNameValidation] = useState(false);
  const [emailValidation, setEmailValidation] = useState(false);
  const [departmentValue, setDepartmentValue] = useState("");
  const [subdepartment, setSubdepartment] = useState("");
  const [ageGroupValue, setAgeGroupValue] = useState("");
  const [gender, setGender] = useState(null);
  const [error, setError] = useState(false);
  const [roles, setRoles] = useState([]);
  const [roleValue, setRoleValue] = useState("");
  const [departments, setDepartments] = useState([]);
  const [subdepartmentOptions, setSubdepartmentOptions] = useState([]);
  const { t, language } = useLanguage();

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${url}/users`)
      .then((res) => {
        if (isMounted) {
          const emails = res.data.map((e) => e.email);
          setData(emails);
          setError(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.log(err);
          setError(true);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  //  useEffect(() => {
  //   axios.get("http://localhost:5000/api/roles")
  //     .then(res => {
  //       setRoles(res.data);
  //       if (res.data.length > 0) setRoleValue("");
  //     })
  //     .catch(err => {
  //       console.error("Failed to fetch roles", err);
  //     });
  // }, []);

  useEffect(() => {
    // Fetch departments from backend
    axios.get(`${url}/api/departments`)
      .then(res => {
        setDepartments(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch departments", err);
      });
  }, []);

  // Update subdepartment options when department changes
  useEffect(() => {
    const selected = departments.find(dep => dep._id === departmentValue);
    if (selected && Array.isArray(selected.subdepartments)) {
      setSubdepartmentOptions(selected.subdepartments.map((sub, idx) => ({
        id: idx,
        title: sub
      })));
    } else {
      setSubdepartmentOptions([]);
    }
    setSubdepartment(""); // Reset subdepartment when department changes
  }, [departmentValue, departments]);

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const userNameHandle = (e) => {
    const input = e.target.value;
    if (input === null || input.length < 3) {
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

  const handleDepartmentChange = (event) => {
    setDepartmentValue(event.target.value);
  };

  const handleAgeGroupChange = (event) => {
    setAgeGroupValue(event.target.value);
  };

  const genderHandle = (event) => {
    setGender(event.target.value);
  };

  const handleFinalSubmit = () => {
    let dep, gen, age;
    let roleName;
    departments.forEach((e) => {
      if (e._id === departmentValue) {
        dep = language === "hi" && e.titleHindi ? e.titleHindi : e.title;
      }
    });
    ageGroups.forEach((e) => {
      if (e.id == ageGroupValue) {
        age = language === "hi" && e.titleHindi ? e.titleHindi : e.title;
      }
    });
    genderGroups.forEach((e) => {
      if (e.id == gender) {
        gen = language === "hi" && e.titleHindi ? e.titleHindi : e.title;
      }
    });

     const selectedRole = roles.find(role => role._id === roleValue);
      roleName = selectedRole
        ? (language === "hi" && selectedRole.nameHindi ? selectedRole.nameHindi : selectedRole.name)
        : "";


    const subdep = subdepartmentOptions.find(opt => opt.id === subdepartment)?.title || "";
    setUserData({
      username: username,
      email: email,
      department: dep,
      subdepartment: subdep,
      ageGroup: age,
      gender: gen,
      language: language,
      role: roleName
    });
    sessionStorage.setItem("loggedin", 1);
    sessionStorage.setItem("admin", 0);
    setMsg(false);
    navigate("/question");
    onClose();
  };

  const submitHandle = async () => {
    if (!error) {
      if (data.includes(email)) {
        alert(
          language === "hi"
            ? t.alreadySubmitted
            : "Answers are already submitted from this email ID!"
        );
      } else {
        handleFinalSubmit();
      }
    } else alert(t.networkError);
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
              <img className={Style.logo} src={logo} />
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
              error={nameValidation}
              label={<>{t.name} <span style={{color: "red"}}>*</span></>}
              type="text"
              onChange={userNameHandle}
              helperText={t.nameLengthError}
            />
            <InputComp
              id="email"
              error={emailValidation}
              label={<>{t.email} <span style={{color: "red"}}>*</span></>}
              type="email"
              onChange={emailHandle}
              helperText={t.invalidEmailError}
            />
            <SelectionComp
              value={departmentValue}
              onChange={handleDepartmentChange}
              menuItems={departments.map(dep => ({
                id: dep._id,
                title: language === "hi" && dep.titleHindi ? dep.titleHindi : dep.title
              }))}
              label={<>{t.departments} <span style={{color: "red"}}>*</span></>}
            />
            <SelectionComp
              value={ageGroupValue}
              onChange={handleAgeGroupChange}
              menuItems={ageGroups}
              label={<>{t.ageGroups} <span style={{color: "red"}}>*</span></>}
            />
            <InputComp
              id="role"
              label={<>Role <span style={{color: "red"}}>*</span></>}
              type="text"
              value={roleValue}
              onChange={e => setRoleValue(e.target.value)}
            />

           {/* Show subdepartment only if options exist */}
          {subdepartmentOptions.length > 0 && (
            <SelectionComp
              value={subdepartment}
              onChange={e => setSubdepartment(e.target.value)}
              menuItems={subdepartmentOptions}
              label="Subdepartment (optional)"
            />
          )}
            <RadioGroup
              value={gender}
              onChange={genderHandle}
              menuItems={genderGroups}
              label={<>{t.gender} <span style={{color: "red"}}>*</span></>}
            />
            {/* Note below all fields */}
            <div style={{ marginTop: 16, color: "#d32f2f", fontSize: 14 }}>
              All fields marked <span style={{color: "red"}}>*</span> are compulsory.
            </div>
          </DialogContent>
          <DialogActions className={Style.dialogActionsBlue}>
            <ButtonComp
              disabled={
                departmentValue === "" ||
                ageGroupValue === "" ||
                username === null ||
                email === null ||
                nameValidation ||
                emailValidation
              }
              title={t.submit}
              onClick={submitHandle}
              style={{
                color:"#0a1a75"
              }}
            />
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </>
  );
}
