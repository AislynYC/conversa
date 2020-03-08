import React from "react";
import {FormattedMessage} from "react-intl";
import Button from "@material-ui/core/Button";
import "./style.css";
const PresentBtn = () => {
  let present = () => {
    const el = document.getElementById("current-sld");
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  };
  return (
    <Button variant="contained" onClick={present} id="present-btn">
      <FormattedMessage id="edit.present" />
    </Button>
  );
};
export default PresentBtn;
