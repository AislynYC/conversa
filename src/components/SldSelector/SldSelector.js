import React from "react";
import "./style.css";
class SldSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slds: [
        {
          sldNo: "1",
          qContent: "Question content for test 1",
          qType: "Question type for test 1",
          resContent: "Result content for test 1",
          resType: "Result type for test 1"
        },
        {
          sldNo: "2",
          qContent: "Question content for test 2",
          qType: "Question type for test 2",
          resContent: "Result content for test 2",
          resType: "Result type for test 2"
        },
        {
          sldNo: "3",
          qContent: "Question content for test 3",
          qType: "Question type for test 3",
          resContent: "Result content for test 3",
          resType: "Result type for test 3"
        }
      ]
    };
  }

  render() {
    let sldsItems = this.state.slds.map((item, index) => {
      let sldNo = index + 1;
      return (
        <div className="sld-item">
          <div>{sldNo}</div>
          <div className="sld">
            <div>{item.qContent}</div>
            <div>{item.resContent}</div>
          </div>
        </div>
      );
    });
    return <div id="sld-selector">{sldsItems}</div>;
  }
}
export default SldSelector;
