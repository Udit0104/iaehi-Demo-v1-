import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Button from "./ReUsable/ButtonComp";
import Style from "./EnterPage.module.css";
import pic from "../Images/areYouReady.jpg";
import FormDialog from "./FormDialog";
import { useLanguage } from "../contexts/LanguageContext";

export default function EnterPage(props) {
  const { setMsg, setUserData } = props;
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    sessionStorage.setItem("loggedin", "0");
  });

  const agreeHandle = () => {
    setOpenForm(true);
  };

  const handleClose = () => {
    setOpenForm(false);
  };

  const nextTimeHandle = () => {
    navigate("/nexttime");
  };

  return (
    <>
      {openForm && (
        <FormDialog
          setUserData={setUserData}
          setMsg={setMsg}
          title={t.aboutYou}
          open={openForm}
          onClose={handleClose}
        />
      )}
      <div className={Style.enterpageContainer}>
        <Typography
          style={{ color: "#001f3f", padding: "2rem" }}
          variant="h3"
          gutterBottom
        >
          {t.readyForQuiz}
        </Typography>
        <div className={Style.btnsDiv} style={{ display: "flex", justifyContent: "center" }}>
          <Button title={t.yesOfCourse} onClick={agreeHandle} />
        </div>
      </div>
      <img className={Style.pic} alt="" src={pic} />
    </>
  );
}
