import React, { useState } from "react";
import Style from "./Result.module.css";
import Typography from "@material-ui/core/Typography";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import Button from "./ReUsable/ButtonComp";
import axios from "axios";
import { url } from "./Data/apiData";

function Result(props) {
  const { setMsg } = props;
  const data = useLocation(); 
  const finalResult = data.state.score;
  const [firstName, lastName] = data.state.username.split(" ");
  const username =
    firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [showFeedback, setShowFeedback] = useState(true);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const onClickHandle = () => {
    navigate("/");
    setMsg(true);
  };

  const handleFeedback = (isHappy) => {
    // Combine all user data from navigation state
    const userData = {
      ...data.state, // includes username, email, department, subdepartment, ageGroup, gender, score, result, language
      isHappyWithResult: isHappy,
      timestamp: new Date().toISOString(),
    };
    console.log(userData);
    
    axios
      .post(`${url}/users`, userData)
      .then(() => {
        setFeedbackSubmitted(true);
        setTimeout(() => {
          setShowFeedback(false);
        }, 1500);
      })
      .catch((err) => {
        console.error("Error submitting feedback:", err);
        setFeedbackSubmitted(true);
        setTimeout(() => {
          setShowFeedback(false);
        }, 1500);
      });
  };

  return (
    <>
      <div className={Style.enterpageContainer}>
        <Typography
          style={{ color: "#fff", padding: "2rem" }}
          variant="h3"
          gutterBottom
        >
          {t.thankYou} <span style={{ color: "#001f3f" }}>{username}</span>{" "}
          {t.forYourTime}
        </Typography>
        <Typography
          style={{ color: "#fff", padding: "2rem" }}
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
                  style={{ color: "#fff", padding: "1rem" }}
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
          style={{ color: "#fff", padding: "2rem" }}
          variant="h5"
          gutterBottom
        >
          {t.backToHome}{" "}
          <span onClick={onClickHandle} className={Style.spanStyle}>
            {t.home}
          </span>
        </Typography>
      </div>
      {/* <img className={Style.pic} src="/Images/thankyou.png" alt="Thank you" /> */}
    </>
  );
}

export default Result;
