import React, {useState} from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import {createStore} from "redux";
import {IntlProvider} from "react-intl";
import en from "../i18n/en.js";
import zh from "../i18n/zh.js";
import Header from "../components/Header/Header.js";
import SldEditor from "../components/SldEditor/SldEditor.js";
import "./reset.css";
import "./style.css";

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
      <SldEditor redux={redux} />
    </IntlProvider>
  );
};

let redux = {
  store: null,
  reducer: function(state, action) {
    switch (action.type) {
      case "SelectSld":
        if (action.selected === false) {
          return {
            slds: state.slds.map(sld => {
              // return sld.id === action.selectedId?{...sld, selected: true}:{...sld, selected: false};
              if (sld.id === action.selectedId) {
                sld.selected = true;
                return sld;
              } else {
                sld.selected = false;
                return sld;
              }
            })
          };
        } else {
          return state;
        }
      default:
        return state;
    }
  }
};

redux.store = createStore(redux.reducer, {
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
});
ReactDOM.render(<Root />, document.getElementById("root"));
