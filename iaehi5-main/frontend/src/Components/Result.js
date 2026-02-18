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

  // Safely extract data from location state
  const finalResult = data.state?.score;
  const dbId = data.state?.dbId;
  const fullUsername = data.state?.username || "Guest";
  
  // Format username
  const [firstName] = fullUsername.split(" ");
  const username = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

  // Create a unique key for LocalStorage based on the database ID or username
  const storageKey = `feedback_submitted_${dbId || fullUsername}`;

  // Initialize showFeedback based on whether the key exists in LocalStorage
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
    // 1. Immediately update UI state
    setFeedbackSubmitted(true);

    if (!dbId) {
      console.error("No database ID found to update.");
      setTimeout(() => setShowFeedback(false), 1500);
      return;
    }

    // 2. Make the PATCH request
    axios
      .patch(`${url}/users/${dbId}`, { isHappyWithResult: isHappy })
      .then(() => {
        // 3. Save to LocalStorage so refresh doesn't bring the buttons back
        localStorage.setItem(storageKey, "true");

        setTimeout(() => {
          setShowFeedback(false);
        }, 1500);
      })
      .catch((err) => {
        console.error("Error updating feedback:", err);
        // Hide anyway to prevent double-submitting on error
        setTimeout(() => {
          setShowFeedback(false);
        }, 1500);
      });
  };

  return (
    <>
      <div className={Style.enterpageContainer}>
        <Typography
          style={{ color: "#121111", padding: "2rem" }}
          variant="h3"
          gutterBottom
        >
          {t.thankYou} <span style={{ color: "#001f3f" }}>{username}</span>{" "}
          {t.forYourTime}
        </Typography>
        
        <Typography
          style={{ color: "#121111", padding: "2rem" }}
          variant="h4"
          gutterBottom
        >
          {finalResult >= 91 ? t.veryHappyMessage : t.lessHappyMessage}
        </Typography>

        {showFeedback && (
          <div className={Style.feedbackContainer}>
            {!feedbackSubmitted ? (
              <>
                <Typography
                  style={{ color: "#121111", padding: "1rem" }}
                  variant="h5"
                  gutterBottom
                >
                  {t.happyWithResult}
                </Typography>
                <div className={Style.feedbackButtons}>
                  <Button title={t.yes} onClick={() => handleFeedback(true)} />
                  <Button title={t.no} onClick={() => handleFeedback(false)} />
                </div>
              </>
            ) : (
              <Typography
                style={{ color: "#001f3f", padding: "1rem" }}
                variant="h5"
                gutterBottom
              >
                {t.feedbackThanks}
              </Typography>
            )}
          </div>
        )}

        <Typography
          style={{ color: "#121111", padding: "2rem" }}
          variant="h5"
          gutterBottom
        >
          {t.backToHome}{" "}
          <span onClick={onClickHandle} className={Style.spanStyle}>
            {t.home}
          </span>
        </Typography>
      </div>
    </>
  );
}

export default Result;