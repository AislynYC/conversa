import React, {Fragment} from "react";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import AudiView from "./containers/AudiView";

const Audi = props => {
  console.log(props);
  return (
    <Router>
      <Route component={AudiView} />
    </Router>
  );
};
export default Audi;
