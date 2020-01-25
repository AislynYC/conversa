import React, {useState} from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import {IntlProvider} from "react-intl";
import en from "../i18n/en.js";
import zh from "../i18n/zh.js";
import Header from "../components/Header/Header.js";
import CurrentSld from "../components/CurrentSld/CurrentSld.js";

const Root = () => {
  const [locale, setLocale] = useState(navigator.language);
  let messages;

  if (locale.includes("zh")) {
    messages = zh;
  } else {
    messages = en;
  }
  return (
    <IntlProvider locale={locale} key={locale} defaultLocale="en" messages={messages}>
      <Header locale={locale} setLocale={setLocale} />
      <CurrentSld />
    </IntlProvider>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));
