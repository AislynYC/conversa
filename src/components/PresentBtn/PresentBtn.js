import React from "react";
import {FormattedMessage} from "react-intl";
import "./style.css";
class PresentBtn extends React.Component {
  constructor(props) {
    super(props);
  }

  present = () => {
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

  render() {
    return (
      <button onClick={this.present} id="present-btn">
        <FormattedMessage id="app.present" />
      </button>
    );
  }
}
export default PresentBtn;
