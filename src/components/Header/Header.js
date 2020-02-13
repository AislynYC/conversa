import React, {Fragment} from "react";
import {FormattedMessage} from "react-intl";
import {Link} from "react-router-dom";

import LangBtn from "../LangBtn/LangBtn.js";
import PresentBtn from "../PresentBtn/PresentBtn.js";
import logo from "../../img/conversa.png";
import "./style.css";

import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";

const SignBtn = withStyles({
  root: {
    color: "white",
    margin: "0 0 0 10px",
    letterSpacing: "3px",
    fontSize: "1.1em"
  }
})(Button);

const Header = props => {
  console.log(props);

  return (
    <div className="header">
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
      <LangBtn locale={props.locale} setLocale={props.setLocale} />
      {props.match.url.includes("/edit") ? (
        <PresentBtn />
      ) : (
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
      )}
    </div>
  );
};
export default Header;
