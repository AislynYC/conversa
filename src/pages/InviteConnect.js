import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";

import AudiViewConnect from "./AudiViewConnect";

let mapStateToProps = (state, props) => {
  let invitationArray = state.firestore.ordered.invitation;

  if (invitationArray !== undefined) {
    const inviteObj = invitationArray.find(item => {
      return item.id === props.match.params.projId;
    });
    if (inviteObj !== undefined) {
      return {
        userId: inviteObj.owner,
        projId: inviteObj.projId
      };
    } else {
      return {
        userId: undefined,
        projId: undefined
      };
    }
  } else {
    return {
      userId: undefined,
      projId: undefined
    };
  }
};

export default compose(
  firestoreConnect(() => [
    {
      collection: "invitation"
    }
  ]),
  connect(mapStateToProps)
)(AudiViewConnect);
