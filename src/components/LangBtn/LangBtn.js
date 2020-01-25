import React from "react";
import "./style.css";

class LangBtn extends React.Component {
  constructor(props) {
    super(props);
    let targetLang;
    if (props.locale.includes("zh")) {
      targetLang = "En";
    } else {
      targetLang = "中";
    }
    this.state = {
      targetLang: targetLang
    };
  }

  toggleLang = () => {
    if (this.state.targetLang === "En") {
      this.props.setLocale("en");
    } else {
      this.props.setLocale("zh-Hant");
    }
  };

  render() {
    return (
      <button id="lang-btn" onClick={this.toggleLang}>
        {this.state.targetLang}
      </button>
    );
  }
}

export default LangBtn;
