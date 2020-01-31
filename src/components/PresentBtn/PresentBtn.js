import React from "react";
import {FormattedMessage} from "react-intl";
import "./style.css";
const PresentBtn = () => {
  let present = () => {
    const elem = document.getElementById("current-sld");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  };

  return (
    <button onClick={present} id="present-btn">
      <FormattedMessage id="app.present" />
    </button>
  );
};
export default PresentBtn;
