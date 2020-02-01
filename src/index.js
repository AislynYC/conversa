import React, {useState} from "react";
import ReactDOM from "react-dom";
import {createStore} from "redux";
import {Provider} from "react-redux";
import {IntlProvider} from "react-intl";
import en from "./i18n/en.js";
import zh from "./i18n/zh.js";
import Header from "./components/Header/Header.js";
import SldEditorContainer from "./containers/SldEditorContainer.js";
import "./reset.css";
import "./style.css";

import reducer from "./ducks/widgets";

const Root = () => {
  const [locale, setLocale] = useState(navigator.language);
  let messages;
  locale.includes("zh") ? (messages = zh) : (messages = en);

  return (
    <IntlProvider locale={locale} key={locale} defaultLocale="en" messages={messages}>
      <Provider store={store}>
        <Header locale={locale} setLocale={setLocale} />
        <SldEditorContainer />
      </Provider>
    </IntlProvider>
  );
};

let store = createStore(reducer, {
  currentSldId: "01",
  slds: [
    {
      id: "01",
      qContent: "Question content for test 1",
      qType: "Question type for test 1",
      resContent: "Result content for test 1",
      resType: "Result type for test 1"
    },
    {
      id: "02",
      qContent: "Question content for test 2",
      qType: "Question type for test 2",
      resContent: "Result content for test 2",
      resType: "Result type for test 2"
    },
    {
      id: "03",
      qContent: "Question content for test 3",
      qType: "Question type for test 3",
      resContent: "Result content for test 3",
      resType: "Result type for test 3"
    }
  ]
});

ReactDOM.render(<Root />, document.getElementById("root"));
