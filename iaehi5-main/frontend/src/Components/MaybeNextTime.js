import React from "react";
import Style from "./MaybeNextTime.module.css";
import Typography from "@material-ui/core/Typography";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

function MaybeNextTime() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const onClickHandle = () => navigate("/");

  return (
    <>
      <div className={Style.container}>
        <Typography
          style={{ color: "#fff", padding: "2rem" }}
          variant="h3"
          gutterBottom
        >
          {t.seeYouSoon}
        </Typography>
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
      <img className={Style.pic} src={`/Images/seeyousoon.png`} />
    </>
  );
}

export default MaybeNextTime;
