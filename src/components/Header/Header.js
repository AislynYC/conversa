import React from "react";
import LangBtn from "../LangBtn/LangBtn.js";
import PresentBtn from "../PresentBtn/PresentBtn.js";
import logo from "../../img/conversa.png";
import "./style.css";
const Header = props => {
  return (
    <div className="header">
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
      <LangBtn locale={props.locale} setLocale={props.setLocale} />
      <PresentBtn />
    </div>
  );
};
export default Header;
