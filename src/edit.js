import React, {Fragment} from "react";

import Header from "./components/Header/Header";
import SldEditorConnect from "./containers/SldEditorConnect";

const Edit = props => {
  let userId = props.match.params.userId;
  let projId = props.match.params.projId;

  return (
    <Fragment>
      <Header {...props} locale={props.locale} setLocale={props.setLocale} />
      <SldEditorConnect {...props} userId={userId} projId={projId} />
    </Fragment>
  );
};

export default Edit;
