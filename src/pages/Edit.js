import React, {Fragment} from "react";

import SldEditorConnect from "../containers/SldEditor/SldEditorConnect";

const Edit = props => {
  let userId = props.match.params.userId;
  let projId = props.match.params.projId;

  return (
    <Fragment>
      <SldEditorConnect
        {...props}
        userId={userId}
        projId={projId}
        locale={props.locale}
        setLocale={props.setLocale}
      />
    </Fragment>
  );
};

export default Edit;
