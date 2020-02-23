import React, {Fragment, useState} from "react";
import {connect} from "react-redux";
import {FormattedMessage} from "react-intl";
import {Link} from "react-router-dom";

import LangBtn from "../LangBtn/LangBtn.js";
import PresentBtn from "../PresentBtn/PresentBtn.js";
import ProjNameEditor from "../ProjNameEditor/ProjNameEditor";
import logo from "../../img/conversa-s.png";
import "./style.css";

// FontAwesome Setting
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faBars} from "@fortawesome/free-solid-svg-icons";
library.add(faBars);
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
  console.log("header", props);
  const logOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("signOut success");
        props.history.push("/login");
      });
  };

  const [menuClass, setMenuClass] = useState("menu");

  const toggleMenu = () => {
    if (menuClass === "menu") {
      setMenuClass("menu show");
    } else {
      setMenuClass("menu");
    }
  };

  let linkBtns = null;
  let menuBtns = null;
  let editProjName = null;

  if (props.auth.isLoaded === false) {
  } else if (props.auth.isLoaded === true && props.auth.isEmpty === true) {
    linkBtns = (
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
    menuBtns = linkBtns;
  } else {
    if (props.match.url.includes("/edit/")) {
      linkBtns = (
        <Fragment>
          <Button
            variant="contained"
            id="my-presentation-btn"
            onClick={() => {
              props.history.push(`/pm/${props.auth.uid}`);
            }}>
            <FormattedMessage id="home.my-presentation" />
          </Button>
          <PresentBtn />
        </Fragment>
      );
      if (props.editProj !== undefined)
        editProjName = <ProjNameEditor {...props} proj={props.editProj} />;
    } else if (props.match.url.includes("/pm/")) {
      linkBtns = (
        <SignBtn onClick={logOut}>
          <FormattedMessage id="home.log-out" />
        </SignBtn>
      );
    } else {
      linkBtns = (
        <Fragment>
          <Button
            variant="contained"
            id="my-presentation-btn"
            onClick={() => {
              props.history.push(`/pm/${props.auth.uid}`);
            }}>
            <FormattedMessage id="home.my-presentation" />
          </Button>
          <SignBtn onClick={logOut}>
            <FormattedMessage id="home.log-out" />
          </SignBtn>
        </Fragment>
      );

      menuBtns = (
        <Fragment>
          <SignBtn
            onClick={() => {
              props.history.push(`/pm/${props.auth.uid}`);
            }}>
            <FormattedMessage id="home.my-presentation" />
          </SignBtn>
          <SignBtn onClick={logOut}>
            <FormattedMessage id="home.log-out" />
          </SignBtn>
        </Fragment>
      );
    }
  }

  return (
    <Fragment>
      <div className="header">
        <div className="logo-wrap">
          <Link to="/">
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>
          </Link>
          {editProjName}
        </div>
        <div className="header-tools">
          <LangBtn locale={props.locale} setLocale={props.setLocale} />
          <div>{linkBtns}</div>
        </div>
        <div className="menu-btn" onClick={toggleMenu}>
          <FontAwesomeIcon icon={["fas", "bars"]} />
        </div>
      </div>
      <div className={menuClass}>
        <LangBtn locale={props.locale} setLocale={props.setLocale} />
        <div className="menu-links">{menuBtns}</div>
      </div>
    </Fragment>
  );
};

let mapStateToProps = (state, props) => {
  let projDataArray = state.firestore.ordered[`${props.match.params.userId}-projects`];
  if (projDataArray !== undefined && projDataArray.length !== 0) {
    let projObj = projDataArray.find(proj => proj.id === props.match.params.projId);
    return {
      firestore: state.firestore,
      auth: state.firebase.auth,
      editProj: projObj
    };
  } else {
    return {
      firestore: state.firestore,
      auth: state.firebase.auth,
      editProj: undefined
    };
  }
};

export default connect(mapStateToProps)(Header);
