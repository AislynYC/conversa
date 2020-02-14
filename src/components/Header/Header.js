import React, {Fragment, useEffect} from "react";
import {connect} from "react-redux";
import {FormattedMessage} from "react-intl";
import {Link} from "react-router-dom";

import LangBtn from "../LangBtn/LangBtn.js";
import PresentBtn from "../PresentBtn/PresentBtn.js";
import logo from "../../img/conversa.png";
import "./style.css";

import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";
import firebase from "../../config/fbConfig";

const SignBtn = withStyles({
  root: {
    color: "white",
    margin: "0 0 0 10px",
    letterSpacing: "3px",
    fontSize: "1.03em"
  }
})(Button);

const Header = props => {
  const logOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("signOut success");
        props.history.push("/");
      });
  };

  let toolBar = null;

  if (props.auth.isLoaded === false) {
  } else if (props.auth.isLoaded === true && props.auth.isEmpty === true) {
    toolBar = (
      <Fragment>
        <Link to="/login">
          <SignBtn>
            <FormattedMessage id="home.logIn" />
          </SignBtn>
        </Link>

        <Link to="/signup">
          <SignBtn>
            <FormattedMessage id="home.signUp" />
          </SignBtn>
        </Link>
      </Fragment>
    );
  } else {
    toolBar = (
      <Fragment>
        <Button variant="contained" id="my-presentation-btn">
          <FormattedMessage id="home.my-presentation" />
        </Button>
        <SignBtn onClick={logOut}>
          <FormattedMessage id="home.log-out" />
        </SignBtn>
      </Fragment>
    );
  }

  return (
    <div className="header">
      <div className="logo-wrap">
        <Link to="/">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
        </Link>
      </div>
      <LangBtn locale={props.locale} setLocale={props.setLocale} />
      {props.match.url.includes("/edit") ? (
        <PresentBtn />
      ) : (
        <Fragment>{toolBar}</Fragment>
      )}
    </div>
  );
};

let mapStateToProps = (state, props) => {
  return {
    firestore: state.firestore,
    auth: state.firebase.auth
  };
};

export default connect(mapStateToProps)(Header);
