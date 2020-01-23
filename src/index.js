import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import "./style.css";
import {IntlProvider} from "react-intl";

const Root = () => {
  const locale = navigator.language;
  return (
    <IntlProvider locale={locale} key={locale} defaultLocale="en">
      <App />
    </IntlProvider>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));
