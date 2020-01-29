import React from "react";
import "./style.css";

class CurrentSld extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sldNo: "1",
      qContent: "Question content for test 1",
      qType: "Question type for test 1",
      resContent: "Result content for test 1",
      resType: "Result type for test 1"
    };
  }
  render() {
    return (
      <div id="current-sld-border">
        <div id="current-sld">For Testing</div>
      </div>
    );
  }
}
export default CurrentSld;
