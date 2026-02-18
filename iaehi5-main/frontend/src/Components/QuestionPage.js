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
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", onBackButtonEvent);

    window.onbeforeunload = function () {
      sessionStorage.clear();
    };

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

      // Prepare data with default feedback set to true
      const dataToSave = {
        ...userData,
        score,
        result,
        language,
        isHappyWithResult: true, // Default true in case they don't give feedback
        timestamp: new Date().toISOString(),
      };

      // POST to database immediately
      axios
        .post(`${url}/users`, dataToSave)
        .then((response) => {
          // Extract the database ID (using _id for MongoDB or id)
          const dbId = response.data._id || response.data.id;
          
          // Pass data and dbId to Result page
          navigate("/result", { state: { ...dataToSave, dbId } });
        })
        .catch((err) => {
          console.error("Error saving initial data:", err);
          // Fallback navigation so user isn't stuck if the request fails
          navigate("/result", { state: dataToSave }); 
        });
    }

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
    setFinalAns((prev) => [...prev, value]);
  };

  return loggedin === "1" ? (
    <>
      <PercentageBar completed={incrementVal} queBank={variables.queBank} />
      <div className={Style.headerDiv}>
        <div className={Style.container}>
          <div className={Style.containerItem}>
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
            {variables.queBank ? (
              <Options
                value={value}
                setValue={setValue}
                {...variables.queBank[incrementVal]}
                language={language}
              />
            ) : null}

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