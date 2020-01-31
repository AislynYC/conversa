import React from "react";
import "./style.css";
class SldEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let slds = this.props.slds;
    let sldsItems = slds.map((item, index) => {
      return (
        <div className="sld-item" key={index + 1}>
          <div>{index + 1}</div>
          <div
            className="sld"
            onClick={() => {
              this.props.selectSld(item.selected, item.id);
            }}>
            <div>{item.qContent}</div>
            <div>{item.resContent}</div>
          </div>
        </div>
      );
    });

    let currentSldObj = slds.find(sld => sld.selected === true);

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
