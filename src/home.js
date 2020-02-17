import React, {Fragment} from "react";
import {connect} from "react-redux";

import Header from "./components/Header/Header";
import firebase from "./config/fbConfig";

const Home = props => {
  console.log("Auth", props.auth);
  if (props.auth.isLoaded === false) {
  } else if (props.auth.isLoaded === true && props.auth.isEmpty === true) {
    console.log("No user", props.auth);
  } else {
    if (firebase.auth().currentUser === null) {
      // After user signed out and redirect to this page, auth.isLoaded & auth.isEmpty are still remain sign in status for a while
      // so currentUser need to be confirmed first before loading this page
      console.log("user is signed out", props.auth);
    } else {
      // User is signed in.
      var displayName = props.auth.displayName;
      var email = props.auth.email;
      var emailVerified = props.auth.emailVerified;
      var photoURL = props.auth.photoURL;
      var uid = props.auth.uid;
      var phoneNumber = props.auth.phoneNumber;
      var providerData = props.auth.providerData;
      firebase
        .auth()
        .currentUser.getIdToken()
        .then(function(accessToken) {
          console.log("Signed in");

          let userData = JSON.stringify(
            {
              displayName: displayName,
              email: email,
              emailVerified: emailVerified,
              phoneNumber: phoneNumber,
              photoURL: photoURL,
              uid: uid,
              accessToken: accessToken,
              providerData: providerData
            },
            null,
            "  "
          );
          console.log(userData);
        });
    }
  }

  return (
    <Fragment>
      <Header {...props} locale={props.locale} setLocale={props.setLocale} />
      <div>Home Page</div>
    </Fragment>
  );
};

let mapStateToProps = (state, props) => {
  return {
    firestore: state.firestore,
    auth: state.firebase.auth
  };
};

export default connect(mapStateToProps)(Home);
