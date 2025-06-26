import React from "react";
import Style from "./Error.module.css";
import Typography from "@material-ui/core/Typography";
import { useNavigate } from "react-router-dom";

function Error(props) {
  const { setMsg , errMsg=`Somthing went wrong! Please go to ` } = props;
  const navigate = useNavigate();
  const onClickHandle = () => {
    navigate("/");
    setMsg(true);
  };
  return (
    <>
      <div className={Style.container}>
        <Typography
          style={{ color: "#fff", padding: "2rem" }}
          variant="h5"
          gutterBottom
        >
          {errMsg} {" "}
          <span onClick={onClickHandle} className={Style.spanStyle}>
            home
          </span>
        </Typography>
      </div>
      <img className={Style.pic} src={`/Images/wentwrong.png`} />
    </>
  );
}

export default Error;
