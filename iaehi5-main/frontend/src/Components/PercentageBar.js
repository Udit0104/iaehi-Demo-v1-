import React from "react";
import Style from "./PercentageBar.module.css";

function PercentageBar({ completed, queBank }) {
  return (
    <div className={Style.container}>
      {queBank.map((item, ind) => (
        <div
          className={`${Style.containerItem} ${
            completed >= ind ? Style.filled : ""
          }`}
          key={item.id}
        ></div>
      ))}
    </div>
  );
}

export default PercentageBar;
