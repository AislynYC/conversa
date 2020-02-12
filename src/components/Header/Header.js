import React, {Fragment} from "react";
import {FormattedMessage} from "react-intl";

import LangBtn from "../LangBtn/LangBtn.js";
import PresentBtn from "../PresentBtn/PresentBtn.js";
import logo from "../../img/conversa.png";
import "./style.css";

import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";
import {lightGreen} from "@material-ui/core/colors";
const SignBtn = withStyles({
  root: {
    color: lightGreen[50],
    margin: "0 0 0 10px",
    letterSpacing: "3px"
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
          <SignBtn>
            <FormattedMessage id="home.logIn" />
          </SignBtn>
          <SignBtn>
            <FormattedMessage id="home.signUp" />
          </SignBtn>
        </Fragment>
      )}
    </div>
  );
};
export default Header;
