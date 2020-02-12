import React from "react";
import "./style.css";

import MenuItem from "@material-ui/core/MenuItem";
import {withStyles} from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import InputBase from "@material-ui/core/InputBase";
import {lightGreen} from "@material-ui/core/colors";

const CustomInput = withStyles(theme => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3)
    }
  },
  input: {
    color: lightGreen[50],
    fontSize: "0.9em",
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"])
  }
}))(InputBase);
class LangBtn extends React.Component {
  constructor(props) {
    super(props);

    let selLang;
    if (props.locale.includes("zh")) {
      selLang = "正體中文";
    } else {
      selLang = "English";
    }
    this.state = {
      selLang: selLang
    };
  }

  toggleLang = targetLang => {
    if (targetLang === "English") {
      this.props.setLocale("en");
    } else {
      this.props.setLocale("zh-Hant");
    }
  };

  handleChange = e => {
    let targetLang = e.target.value;
    this.setState(() => ({
      selLang: targetLang
    }));
    this.toggleLang(targetLang);
  };
  render() {
    return (
      <Select
        variant="standard"
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={this.state.selLang}
        input={<CustomInput />}
        onChange={e => this.handleChange(e)}>
        <MenuItem value="English">English</MenuItem>
        <MenuItem value="正體中文">正體中文</MenuItem>
      </Select>
    );
  }
}

export default LangBtn;
