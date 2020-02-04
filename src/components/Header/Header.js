import React from "react";
import LangBtn from "../LangBtn/LangBtn.js";
import PresentBtn from "../PresentBtn/PresentBtn.js";
import "./style.css";
const Header = props => {
  return (
    <div className="header">
      <div className="logo">CONVERSA</div>
      <LangBtn locale={props.locale} setLocale={props.setLocale} />
      <PresentBtn />
    </div>
  );
};
export default Header;
