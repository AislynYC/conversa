import React from "react";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import "./style.css";
class SldEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let sldsItems = this.props.slds.map((item, index) => {
      let path = null;
      index === 0 ? (path = "/") : (path = "/" + item.id);

      return (
        <div className="sld-item" key={index + 1}>
          <div>{index + 1}</div>
          <Link to={path}>
            <div
              className="sld"
              onClick={() => {
                this.props.selectSld(item.id);
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
            <SldPage {...this.props} />
          </Switch>
        </div>
      </Router>
    );
  }
}

const SldPage = props => {
  let currentSldObj = props.slds.find(sld => sld.id === props.currentSldId);

  return props.slds.map((sld, index) => {
    let path = null;
    index === 0 ? (path = {exact: true, path: "/"}) : (path = {path: "/" + sld.id});

    return (
      <Route {...path} key={sld.id}>
        <div className="center">
          <div id="current-sld-border">
            <div id="current-sld">
              <div>{currentSldObj.qContent}</div>
              <div>{currentSldObj.resContent}</div>
            </div>
          </div>
          <div id="content-editor"></div>
        </div>
        <div id="control-panel"></div>
      </Route>
    );
  });
};
export default SldEditor;
