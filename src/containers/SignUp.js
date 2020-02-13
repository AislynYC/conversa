import React, {Fragment} from "react";
import {FormattedMessage} from "react-intl";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {makeStyles} from "@material-ui/core/styles";
import Header from "../components/Header/Header";
import "./style.css";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "../config/fbConfig";

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: "/signedIn",
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID
  ]
};

class SignInScreen extends React.Component {
  render() {
    return (
      <div className="sign-in-screen">
        <h2>
          <FormattedMessage id="Sign-up.welcome" />
        </h2>
        <p>
          <FormattedMessage id="Sign-up.instruction" />
        </p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
    );
  }
}
const SignUp = props => {
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
            <SignInScreen />
          </CardContent>
        </Card>
      </div>
    </Fragment>
  );
};
export default SignUp;
