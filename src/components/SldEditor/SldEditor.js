import React from "react";
import "./style.css";
class SldEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slds: [
        {
          id: "01",
          qContent: "Question content for test 1",
          qType: "Question type for test 1",
          resContent: "Result content for test 1",
          resType: "Result type for test 1",
          selected: true
        },
        {
          id: "02",
          qContent: "Question content for test 2",
          qType: "Question type for test 2",
          resContent: "Result content for test 2",
          resType: "Result type for test 2",
          selected: false
        },
        {
          id: "03",
          qContent: "Question content for test 3",
          qType: "Question type for test 3",
          resContent: "Result content for test 3",
          resType: "Result type for test 3",
          selected: false
        }
      ]
    };
  }

  selectSld = (e, selected, selectedId) => {
    if (selected === false) {
      this.setState(
        prevState => ({
          slds: prevState.slds.map(sld => {
            return sld.id === selectedId
              ? {...sld, selected: true}
              : {...sld, selected: false};
          })
        }),
        () => console.log(this.state.slds)
      );
    }
  };

  render() {
    let sldsItems = this.state.slds.map((item, index) => {
      return (
        <div className="sld-item" key={index + 1}>
          <div>{index + 1}</div>
          <div
            className="sld"
            onClick={e => {
              this.selectSld(e, item.selected, item.id);
            }}>
            <div>{item.qContent}</div>
            <div>{item.resContent}</div>
          </div>
        </div>
      );
    });

    let currentSldObj = this.state.slds.find(sld => {
      return sld.selected === true;
    });
    console.log(currentSldObj);
    let currentSld = (
      <div id="current-sld">
        <div>{currentSldObj.qContent}</div>
        <div>{currentSldObj.resContent}</div>
      </div>
    );

    return (
      <div className="container">
        <div id="sld-selector">{sldsItems}</div>
        <div className="center">
          <div id="current-sld-border">{currentSld}</div>
          <div id="content-editor">test</div>
        </div>
        <div id="control-panel"></div>
      </div>
    );
  }
}
export default SldEditor;
