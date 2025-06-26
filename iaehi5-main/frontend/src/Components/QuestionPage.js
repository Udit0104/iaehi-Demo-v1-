import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Options from "./Options";
import ArrowForward from "@material-ui/icons/ArrowForwardIosOutlined";
import Style from "./questionPage.module.css";
import Loader from "./ReUsable/Loader";
import * as variables from "./Data/variables";
import PercentageBar from "./PercentageBar";
import axios from "axios";
import Error from "./ReUsable/Error";
import ButtonComp from "./ReUsable/ButtonComp";
import { url } from "./Data/apiData";
import { useLanguage } from "../contexts/LanguageContext";

function QuestionPage(props) {
  const { setMsg, userData } = props;
  const [isBackButtonClicked, setBackbuttonPress] = useState(false);
  const [incrementVal, setIncrementVal] = useState(0);
  const [finalAns, setFinalAns] = useState([]);
  const [value, setValue] = useState(null);
  const [loggedin, setLoggedin] = useState(0);
  const [imageRefresh, setImageRefresh] = useState(true);
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  useEffect(() => {
    ///////////////////

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", onBackButtonEvent);

    //logic for showing popup warning on page refresh

    window.onbeforeunload = function () {
      sessionStorage.clear();
    };
    ///////////////////

    const val = sessionStorage.getItem("loggedin");
    setLoggedin(val);
    setImageRefresh(true);
    if (
      variables.queBank.length !== 0 &&
      variables.queBank.length === finalAns.length
    ) {
      let score = finalCalc(finalAns);
      let result;
      if (score > variables.level2) {
        result = variables.cond1;
      } else if (score > variables.level3 && score <= variables.level2) {
        result = variables.cond2;
      } else if (score <= variables.level3 && score > variables.level4) {
        result = variables.cond3;
      } else {
        result = variables.cond4;
      }

      const ansObjArr = {};
      finalAns.forEach((e, i) => {
        ansObjArr[`q${i + 1}`] = e;
      });
      const data = {
        ...userData,
        score,
        result,
        language,
      };
      navigate("/result", { state: data }); // Pass all user data to Result page
    }

    ////////////// return function by useEffect /////////

    return () => {
      window.removeEventListener("popstate", onBackButtonEvent);
      window.onbeforeunload = null;
    };
  }, [finalAns]);

  const onBackButtonEvent = (e) => {
    e.preventDefault();
    if (!isBackButtonClicked) {
      if (
        window.confirm("Data will be lost if you leave the page, are you sure?")
      ) {
        setBackbuttonPress(true);
        setMsg(true);
        navigate("/");
        sessionStorage.setItem("loggedin", "0");
      } else {
        window.history.pushState(null, null, window.location.pathname);
        setBackbuttonPress(false);
      }
    }
  };

  const finalCalc = (finalAns) => {
    const finalArr = finalAns.map((item, idx) => {
      const q = variables.queBank[idx];
      const reverse = q && q.reverseScoring;
      // Normal scoring: a=0, b=5, c=15, d=20
      // Reverse scoring: a=20, b=15, c=5, d=0
      switch (item) {
        case "opta":
          return reverse ? 20 : 0;
        case "optb":
          return reverse ? 15 : 5;
        case "optc":
          return reverse ? 5 : 15;
        default:
          return reverse ? 0 : 20;
      }
    });
    let sum = finalArr.reduce((acc, item) => acc + item, 0);
    return sum;
  };
  const nextQueHandle = () => {
    setFinalAns((prev) => [...prev, value]);
    setImageRefresh(false);
    if (variables.queBank) {
      setIncrementVal((prevState) => prevState + 1);
    }
    setValue(null);
  };

  const submitHandle = () => {
    // finalAns.push(value);
    setFinalAns((prev) => [...prev, value]);
  };

  return loggedin === "1" ? (
    <>
      <PercentageBar completed={incrementVal} queBank={variables.queBank} />
      <div className={Style.headerDiv}>
        <div className={Style.container}>
        <div className={Style.containerItem}>
          {/* Question */}
          <div className={Style.questionDiv}>
            <Typography style={{ color: "black" }} variant="h6" gutterBottom>
              {variables.queBank ? (
                language === "hi" &&
                variables.queBank[incrementVal].queHindi ? (
                  variables.queBank[incrementVal].queHindi
                ) : (
                  variables.queBank[incrementVal].que
                )
              ) : (
                <Loader />
              )}
            </Typography>
          </div>
          {/* Options component */}
          {variables.queBank ? (
            <Options
              value={value}
              setValue={setValue}
              {...variables.queBank[incrementVal]}
              language={language}
            />
          ) : null}

          {/* Buttons */}
          <div className={Style.btnsDiv}>
            {value && incrementVal === variables.queBank.length - 1 && (
              <ButtonComp title={t.submit} onClick={submitHandle} />
            )}
            {value && incrementVal !== variables.queBank.length - 1 && (
              <ButtonComp
                title={t.next}
                onClick={nextQueHandle}
                endIcon={<ArrowForward />}
              />
            )}
          </div>
        </div>
      </div>
      
      </div>
      
    </>
  ) : (
    <Error setMsg={setMsg} />
  );
}

export default QuestionPage;
