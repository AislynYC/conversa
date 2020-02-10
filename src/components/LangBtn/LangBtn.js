import React from "react";
import Button from "@material-ui/core/Button";
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
      <Button variant="contained" size="small" id="lang-btn" onClick={this.toggleLang}>
        {this.state.targetLang}
      </Button>
    );
  }
}

export default LangBtn;
