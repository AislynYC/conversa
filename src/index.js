import React, {useState} from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import {IntlProvider} from "react-intl";
import en from "./i18n/en.js";
import zh from "./i18n/zh.js";
import "./style.css";
import LangBtn from "./LangBtn.js";

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
      <LangBtn locale={locale} setLocale={setLocale} />
    </IntlProvider>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));
