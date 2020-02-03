import React, {useState} from "react";
import ReactDOM from "react-dom";
import {createStore} from "redux";
import {Provider} from "react-redux";
import {IntlProvider} from "react-intl";
import en from "./i18n/en.js";
import zh from "./i18n/zh.js";
import rootReducer from "./ducks/rootReducer";
import Header from "./components/Header/Header";
import SldEditorContainer from "./containers/SldEditorContainer";
import "./reset.css";
import "./style.css";

import {ReactReduxFirebaseProvider} from "react-redux-firebase";
import {createFirestoreInstance} from "redux-firestore";
import fbConfig from "./config/fbConfig";

const Root = () => {
  const [locale, setLocale] = useState(navigator.language);
  let messages;
  locale.includes("zh") ? (messages = zh) : (messages = en);

  return (
    <IntlProvider locale={locale} key={locale} defaultLocale="en" messages={messages}>
      <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
          <Header locale={locale} setLocale={setLocale} />
          <SldEditorContainer />
        </ReactReduxFirebaseProvider>
      </Provider>
    </IntlProvider>
  );
};

let store = createStore(rootReducer);

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
