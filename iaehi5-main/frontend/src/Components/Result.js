import React, { useState } from "react";
import Style from "./Result.module.css";
import Typography from "@material-ui/core/Typography";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import Button from "./ReUsable/ButtonComp";
import axios from "axios";
import { url } from "./Data/apiData";

function Result(props) {
  const { setMsg } = props;
  const data = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const finalResult = data.state?.score;
  const dbId = data.state?.dbId;
  const fullUsername = data.state?.username || "Guest";
  
  const [firstName] = fullUsername.split(" ");
  const username = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

  const storageKey = `feedback_submitted_${dbId || fullUsername}`;

  const [showFeedback, setShowFeedback] = useState(() => {
    const alreadySubmitted = localStorage.getItem(storageKey);
    return alreadySubmitted !== "true";
  });
  
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const onClickHandle = () => {
    navigate("/");
    setMsg(true);
  };

  const handleFeedback = (isHappy) => {
    setFeedbackSubmitted(true);
    if (!dbId) {
      setTimeout(() => setShowFeedback(false), 1500);
      return;
    }

    axios
      .patch(`${url}/users/${dbId}`, { isHappyWithResult: isHappy })
      .then(() => {
        localStorage.setItem(storageKey, "true");
        setTimeout(() => setShowFeedback(false), 1500);
      })
      .catch((err) => {
        console.error("Error updating feedback:", err);
        setTimeout(() => setShowFeedback(false), 1500);
      });
  };

  return (
    <div className={Style.enterpageContainer}>
      {/* Heading with subtle laugh emoji */}
      <Typography variant="h2" className={Style.mainTitle}>
        {t.happinessLevel || "Your Happiness Level"} <span className={Style.emoji}>😊</span>
      </Typography>
      <div className={Style.headerDivider}></div>

      <Typography
        style={{ color: "#121111", padding: "1rem" }}
        variant="h3"
        className={Style.subHeading}
      >
        {t.thankYou} <span style={{ color: "#001f3f", fontWeight: 600 }}>{username}</span>{" "}
        {t.forYourTime}
      </Typography>
      
      <Typography
        style={{ color: "#444", padding: "1rem" }}
        variant="h4"
        className={Style.messageText}
      >
        {finalResult >= 91 ? t.veryHappyMessage : t.lessHappyMessage}
      </Typography>

      {showFeedback && (
        <div className={Style.feedbackContainer}>
          {!feedbackSubmitted ? (
            <>
              <Typography style={{ color: "#121111" }} variant="h5" gutterBottom>
                {t.happyWithResult}
              </Typography>
              <div className={Style.feedbackButtons}>
                <Button title={t.yes} onClick={() => handleFeedback(true)} />
                <Button title={t.no} onClick={() => handleFeedback(false)} />
              </div>
            </>
          ) : (
            <Typography style={{ color: "#001f3f" }} variant="h5">
              {t.feedbackThanks}
            </Typography>
          )}
        </div>
      )}

      <Typography variant="h5" className={Style.footerText}>
        {t.backToHome}{" "}
        <span onClick={onClickHandle} className={Style.spanStyle}>
          {t.home}
        </span>
      </Typography>
    </div>
  );
}

export default Result;