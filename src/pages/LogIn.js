import React, {Fragment, useState} from "react";
import {connect} from "react-redux";
import {FormattedMessage} from "react-intl";
import {Link} from "react-router-dom";
import {useFirestore} from "react-redux-firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import Header from "../containers/Header/Header";
import firebase from "../config/fbConfig";
import {createNewUser} from "../lib/createNewUser";
import "./sign.css";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const LogInScreen = props => {
  const [userEmail, setUserEmail] = useState("test@test.com");
  const [userPassword, setUserPassword] = useState("123456");
  const [errMsg, setErrMsg] = useState(null);
  const db = useFirestore();

  // Configure FirebaseUI.
  const uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: authResult => {
        const t = Date.now();
        if (authResult.additionalUserInfo.isNewUser === true) {
          createNewUser(db, t, authResult.user.uid, props);
        } else {
          props.history.push(`/pm/${authResult.user.uid}`);
        }
        return false;
      }
    }
  };
  const handleChange = (e, type) => {
    if (type === "email") {
      setUserEmail(e.target.value);
    } else if (type === "password") {
      setUserPassword(e.target.value);
    }
  };
  const handleSubmit = e => {
    e.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(userEmail, userPassword)
      .then(res => {
        props.history.push(`/pm/${res.user.uid}`);
      })
      .catch(function(error) {
        if (error.code === "auth/invalid-email") {
          setErrMsg(<FormattedMessage id="log-in.invalid-email" />);
        } else if (error.code === "auth/wrong-password") {
          setErrMsg(<FormattedMessage id="log-in.wrong-password" />);
        } else if (error.code === "auth/user-not-found") {
          setErrMsg(<FormattedMessage id="log-in.user-not-found" />);
        }
      });
  };

  return (
    <div className="entry-screen">
      <h2>
        <FormattedMessage id="log-in.welcome" />
      </h2>
      <p>
        <FormattedMessage id="log-in.instruction" />
      </p>
      <form name="log-in" id="log-in-form" className="entry-form">
        <TextField
          required
          id="email-input"
          label="E-mail"
          type="text"
          value={userEmail}
          onChange={e => handleChange(e, "email")}
        />
        <div className="empty-divider"></div>
        <TextField
          required
          id="password-input"
          label="Password"
          type="password"
          value={userPassword}
          onChange={e => handleChange(e, "password")}
        />
        <div className="err-msg">{errMsg}</div>
        <Button
          type="submit"
          variant="contained"
          id="entry-btn"
          onClick={e => handleSubmit(e)}>
          <FormattedMessage id="log-in.log-in" />
        </Button>
      </form>
      <Link to="/signup">
        <div className="switch-link">
          <FormattedMessage id="log-in.go-to-signup" />
        </div>
      </Link>
      <div className="entry-divider">
        <div className="divider-line"></div>
        <p>
          <FormattedMessage id="log-in.3rd-log-in" />
        </p>
        <div className="divider-line"></div>
      </div>

      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
};
const LogIn = props => {
  return (
    <Fragment>
      <Header {...props} locale={props.locale} setLocale={props.setLocale} />
      <div className="entry-page">
        <Card className="sign-card">
          <CardContent>
            <LogInScreen {...props} />
          </CardContent>
        </Card>
      </div>
    </Fragment>
  );
};

let mapStateToProps = (state, props) => {
  return {
    firestore: state.firestore,
    auth: state.firebase.auth
  };
};

export default connect(mapStateToProps)(LogIn);
