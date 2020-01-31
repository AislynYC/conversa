import React, {useState} from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import {createStore} from "redux";
import {provider, connect} from "react-redux";
import {IntlProvider} from "react-intl";
import Header from "./components/Header/Header.js";
import SldEditor from "./components/SldEditor/SldEditor.js";
import "./reset.css";
import "./style.css";

class PEF extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Header locale={locale} setLocale={setLocale} />
        <SldEditor redux={redux} />
      </div>
    );
  }
}

let store;

store = createStore(redux.reducer, {
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
