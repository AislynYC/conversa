import React, {Fragment} from "react";
import {connect} from "react-redux";

import Header from "./components/Header/Header";
import firebase from "./config/fbConfig";
import Button from "@material-ui/core/Button";

const ProjManager = props => {
  console.log("Auth", props.auth);
  if (props.auth.isLoaded === false) {
  } else if (props.auth.isLoaded === true && props.auth.isEmpty === true) {
    console.log("No user", props.auth);
  } else {
  }
  return (
    <Fragment>
      <Header {...props} locale={props.locale} setLocale={props.setLocale} />
      <div className="container">
        <ToolBar {...props} />
        <ProjList {...props} />
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

export default connect(mapStateToProps)(ProjManager);

const ToolBar = props => {
  return (
    <div className="tool-bar">
      <Button>My Presentation</Button>
      <div></div>
    </div>
  );
};

const ProjList = props => {
  return <Fragment>projects</Fragment>;
};
