import React from "react";
import Style from "./Loader.module.css";

function Loader() {
  return (
    <div className={Style.container}>
      <div className={Style.IdsRoller}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <span className={Style.text}>Loding...</span>
    </div>
  );
}

export default Loader;
