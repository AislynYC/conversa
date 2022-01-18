import React from "react";
import "./style.css";

const Succulent = () => {
  return (
    <div className="wrapper home-succulent">
      <div className="home-succulent-box">
        <div className="home-stem"></div>
        <div className="home-leaf home-leaf01"></div>
        <div className="home-leaf home-leaf02">
          <div className="home-leaf02-green"></div>
        </div>
        <div className="home-leaf home-leaf03">
          <div className="home-leaf03-light"></div>
        </div>
      </div>
    </div>
  );
};

export default Succulent;
