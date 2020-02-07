import React, {Fragment} from "react";

import Header from "./components/Header/Header";
import SldEditorContainer from "./containers/SldEditorContainer";

const Edit = props => {
  console.log(props);
  return (
    <Fragment>
      <Header locale={props.locale} setLocale={props.setLocale} />
      <SldEditorContainer {...props} />
    </Fragment>
  );
};
export default Edit;
