import React, {useState} from "react";
import "./style.css";

const Loading = () => {
  const [stemClass, setStemClass] = useState("stem");

  const rain = () => {
    setStemClass("stem rain");

    setTimeout(function() {
      setStemClass("stem");
    }, 1200);
  };

  return (
    <div className="wrapper" onClick={rain}>
      <div className="box">
        <div className={stemClass}>
          <div className="leaf leaf01">
            <div className="line"></div>
          </div>
          <div className="leaf leaf02">
            <div className="line"></div>
          </div>
          <div className="leaf leaf03">
            <div className="line"></div>
          </div>
        </div>
        <div className="pot"></div>
        <div className="pot-top"></div>
      </div>
    </div>
  );
};

export default Loading;
