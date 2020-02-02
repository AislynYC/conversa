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

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import {createFirestoreInstance} from "redux-firestore";
import {ReactReduxFirebaseProvider} from "react-redux-firebase";

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
const firebaseConfig = {
  apiKey: "AIzaSyDCtYWOFUFUJqhQTk0InJTOPsgp26KOcA0",
  authDomain: "conversa-a419b.firebaseapp.com",
  databaseURL: "https://conversa-a419b.firebaseio.com",
  projectId: "conversa-a419b",
  storageBucket: "conversa-a419b.appspot.com",
  messagingSenderId: "1016180568273",
  appId: "1:1016180568273:web:3e2f51982044a3990d15f0",
  measurementId: "G-G8R1TS3R41"
};

// react-redux-firebase config
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true
};

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

ReactDOM.render(<Root />, document.getElementById("root"));
