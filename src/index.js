import React, {useState} from "react";
import ReactDOM from "react-dom";
import {createStore} from "redux";
import {Provider} from "react-redux";
import {IntlProvider} from "react-intl";
import {BrowserRouter as Router, Route} from "react-router-dom";
import {ReactReduxFirebaseProvider} from "react-redux-firebase";
import {createFirestoreInstance} from "redux-firestore";
import fbConfig from "./config/fbConfig";

import en from "./i18n/en.js";
import zh from "./i18n/zh.js";
import rootReducer from "./ducks/rootReducer";
import Home from "./home";
import Edit from "./edit";
import InviteConnect from "./containers/InviteConnect";
import "./reset.css";
import "./style.css";
import SignUp from "./containers/SignUp";
import LogIn from "./containers/LogIn";
import ProjectsConnect from "./containers/ProjectsConnect";

const Root = () => {
  const [locale, setLocale] = useState(navigator.language);
  let messages;
  locale.includes("zh") ? (messages = zh) : (messages = en);

  return (
    <IntlProvider locale={locale} key={locale} defaultLocale="en" messages={messages}>
      <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
          <Router>
            <Route
              exact
              path="/"
              render={props => <Home {...props} locale={locale} setLocale={setLocale} />}
            />
            <Route
              path="/login"
              render={props => <LogIn {...props} locale={locale} setLocale={setLocale} />}
            />
            <Route
              path="/signup"
              render={props => (
                <SignUp {...props} locale={locale} setLocale={setLocale} />
              )}
            />
            <Route
              path="/edit/:userId/:projId"
              render={props => <Edit {...props} locale={locale} setLocale={setLocale} />}
            />
            <Route path="/audi/:projId" render={props => <InviteConnect {...props} />} />
            <Route
              path="/pm/:userId"
              render={props => (
                <ProjectsConnect {...props} locale={locale} setLocale={setLocale} />
              )}
            />
          </Router>
        </ReactReduxFirebaseProvider>
      </Provider>
    </IntlProvider>
  );
};

let store = createStore(
  rootReducer,
  // for Redux DevTool extension
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// react-redux-firebase config
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true
};

const rrfProps = {
  firebase: fbConfig,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
};

ReactDOM.render(<Root />, document.getElementById("root"));
