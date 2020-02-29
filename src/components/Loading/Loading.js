import React from "react";
import "./style.css";

const Loading = props => {
  console.log(props);
  let loadingCircle = null;
  if (props.match.url.includes("/audi/")) {
    console.log("ya");
    loadingCircle = <div className="loading-circle"></div>;
  }
  return (
    <div className="wrapper">
      <div className="succulent-box">
        {loadingCircle}
        <div className="stem"></div>
        <div className="leaf leaf01"></div>
        <div className="leaf leaf02">
          <div className="leaf02-green"></div>
        </div>
        <div className="leaf leaf03">
          <div className="leaf03-light"></div>
        </div>
        <div className="pot"></div>
        <div className="pot-top"></div>
      </div>
    </div>
  );
};

export default Loading;
