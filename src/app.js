import React from "react";
import {FormattedMessage} from "react-intl";
import "./style.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    let targetLang;
    if (props.locale.includes("zh")) {
      targetLang = "En";
    } else {
      targetLang = "中文";
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
      <div className="App">
        <header className="App-header">
          <div>
            <button onClick={this.toggleLang}>{this.state.targetLang}</button>
          </div>
          <div>
            <FormattedMessage id="app.learn" values={{name: "React"}} />
          </div>
        </header>
      </div>
    );
  }
}

export default App;
