import React from "react";
import {FormattedMessage} from "react-intl";
import "./style.css";

function App({setLocale}) {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <button onClick={() => setLocale("en")}>英文</button>
          <button onClick={() => setLocale("zh-Hant")}>中文</button>
        </div>
        <div>
          <FormattedMessage id="app.learn" values={{name: "React"}} />
        </div>
      </header>
    </div>
  );
}

export default App;
