import React, {Fragment} from "react";

import Header from "./components/Header/Header";

const Home = props => {
  return (
    <Fragment>
      <Header {...props} locale={props.locale} setLocale={props.setLocale} />
    </Fragment>
  );
};

export default Home;
