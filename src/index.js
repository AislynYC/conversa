import React, {useState} from "react";
import ReactDOM from "react-dom";
import {createStore} from "redux";
import {Provider} from "react-redux";
import {IntlProvider} from "react-intl";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {ReactReduxFirebaseProvider} from "react-redux-firebase";
import {createFirestoreInstance} from "redux-firestore";
import fbConfig from "./config/fbConfig";

import en from "./i18n/en.js";
import zh from "./i18n/zh.js";
import rootReducer from "./reducers/rootReducer";
import Home from "./pages/Home";
import Edit from "./pages/Edit";
import InviteConnect from "./pages/InviteConnect";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import ProjectsConnect from "./pages/ProjectsConnect";
import NotFound from "./components/NotFound/NotFound";
import "./reset.css";
import "./style.css";

const Root = () => {
  const [locale, setLocale] = useState(navigator.language);
  let messages;
  locale.includes("zh") ? (messages = zh) : (messages = en);

  return (
    <IntlProvider locale={locale} key={locale} defaultLocale="en" messages={messages}>
      <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
          <Router>
            <Switch>
              <Route
                exact
                path="/"
                render={props => (
                  <Home {...props} locale={locale} setLocale={setLocale} />
                )}
              />
              <Route
                path="/login"
                render={props => (
                  <LogIn {...props} locale={locale} setLocale={setLocale} />
                )}
              />
              <Route
                path="/signup"
                render={props => (
                  <SignUp {...props} locale={locale} setLocale={setLocale} />
                )}
              />
              <Route
                path="/edit/:userId/:projId"
                render={props => (
                  <Edit {...props} locale={locale} setLocale={setLocale} />
                )}
              />
              <Route
                path="/audi/:projId"
                render={props => <InviteConnect {...props} />}
              />
              <Route
                path="/pm/:userId"
                render={props => (
                  <ProjectsConnect {...props} locale={locale} setLocale={setLocale} />
                )}
              />
              <Route path="/*" component={NotFound} />
            </Switch>
          </Router>
        </ReactReduxFirebaseProvider>
      </Provider>
    </IntlProvider>
  );
};

/* eslint-disable no-underscore-dangle */
let store = createStore(
  rootReducer,
  // for Redux devTool
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
/* eslint-enable */

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
