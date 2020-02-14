import React, {Fragment, useState} from "react";
import {connect} from "react-redux";
import {FormattedMessage} from "react-intl";
import {Link} from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Header from "../components/Header/Header";
import "./style.css";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "../config/fbConfig";

// Configure FirebaseUI.
const uiConfig = {
  signInFlow: "popup",
  signInSuccessUrl: "/",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID
  ]
};

const LogInScreen = props => {
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
      .signInWithEmailAndPassword(userEmail, userPassword)
      .then(() => {
        console.log("login success");
        props.history.push("/");
      })
      .catch(function(error) {
        console.log("login error", error.code, error.message);
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
