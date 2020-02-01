import React from "react";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import "./style.css";
class SldEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let slds = this.props.slds;
    let sldsItems = slds.map((item, index) => {
      let path = null;
      if (index === 0) {
        path = "/";
      } else {
        path = "/" + item.id;
      }
      return (
        <div className="sld-item" key={index + 1}>
          <div>{index + 1}</div>
          <Link to={path}>
            <div
              className="sld"
              onClick={() => {
                this.props.selectSld(item.selected, item.id);
              }}>
              <div>{item.qContent}</div>
              <div>{item.resContent}</div>
            </div>
          </Link>
        </div>
      );
    });

    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="container">
          <div id="sld-selector">{sldsItems}</div>
          <Switch>
            <SldPage slds={slds} />
          </Switch>
        </div>
      </Router>
    );
  }
}

const SldPage = props => {
  let currentSldObj = props.slds.find(sld => sld.selected === true);

  return props.slds.map((sld, index) => {
    let path = null;
    if (index === 0) {
      path = {exact: true, path: "/"};
    } else {
      path = {path: "/" + sld.id};
    }
    return (
      <Route {...path} key={sld.id}>
        <div className="center">
          <div id="current-sld-border">
            <div id="current-sld">
              <div>{currentSldObj.qContent}</div>
              <div>{currentSldObj.resContent}</div>
            </div>
          </div>
          <div id="content-editor">test</div>
        </div>
        <div id="control-panel"></div>
      </Route>
    );
  });
};
export default SldEditor;
