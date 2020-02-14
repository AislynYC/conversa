import React, {Fragment, useState} from "react";
import {FormattedMessage} from "react-intl";
import {Link} from "react-router-dom";
import {useFirestore} from "react-redux-firebase";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Header from "../components/Header/Header";
import "./style.css";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "../config/fbConfig";
import {connect} from "react-redux";

// Configure FirebaseUI.
const uiConfig = {
  signInFlow: "popup",
  signInSuccessUrl: "/",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID
  ]
};

const SignInScreen = props => {
  const db = useFirestore();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

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
      .createUserWithEmailAndPassword(userEmail, userPassword)
      .then(res => {
        return db
          .collection("users")
          .doc(res.user.uid)
          .set({createdTime: Date.now()});
      })
      .then(() => {
        console.log("signUp success");
        props.history.push("/");
      })
      .catch(error => {
        console.log("signUp error", error.code, error.message);
      });
  };

  return (
    <div className="entry-screen">
      <h2>
        <FormattedMessage id="sign-up.welcome" />
      </h2>
      <p>
        <FormattedMessage id="sign-up.instruction" />
      </p>
      <form name="sign-up" id="sign-up-form" className="entry-form">
        <TextField
          required
          id="email-input"
          label="E-mail"
          type="text"
          value={userEmail}
          onChange={e => handleChange(e, "email")}
        />
        <TextField
          required
          id="password-input"
          label="Password"
          type="password"
          value={userPassword}
          onChange={e => handleChange(e, "password")}
        />
        <Button
          type="submit"
          variant="contained"
          id="entry-btn"
          onClick={e => handleSubmit(e)}>
          <FormattedMessage id="sign-up.create-account" />
        </Button>
      </form>
      <Link to="/login">
        <div className="switch-link">
          <FormattedMessage id="sign-up.go-to-login" />
        </div>
      </Link>
      <div className="entry-divider">
        <div className="divider-line"></div>
        <p>
          <FormattedMessage id="sign-up.3rd-sign-up" />
        </p>
        <div className="divider-line"></div>
      </div>

      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
};
const SignUp = props => {
  console.log(props);
  const useStyles = makeStyles({
    root: {
      minWidth: 400,
      padding: "30px"
    }
  });
  const classes = useStyles();
  return (
    <Fragment>
      <Header {...props} locale={props.locale} setLocale={props.setLocale} />
      <div className="entry-page">
        <Card className={classes.root}>
          <CardContent>
            <SignInScreen {...props} />
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

export default connect(mapStateToProps)(SignUp);
