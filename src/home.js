import React, {Fragment} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";

import Header from "./components/Header/Header";

const Home = props => {
  return (
    <Fragment>
      <Header {...props} locale={props.locale} setLocale={props.setLocale} />
    </Fragment>
  );
};

export default Home;
