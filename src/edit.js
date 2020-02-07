import React, {Fragment} from "react";

import Header from "./components/Header/Header";
import SldEditorConnect from "./containers/SldEditorConnect";

const Edit = props => {
  console.log(props);
  return (
    <Fragment>
      <Header locale={props.locale} setLocale={props.setLocale} />
      <SldEditorConnect {...props} />
    </Fragment>
  );
};
export default Edit;
