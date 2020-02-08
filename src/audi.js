import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";

import AudiViewConnect from "./containers/AudiViewConnect";

let mapStateToProps = (state, props) => {
  let invitationArray = state.firestore.ordered.invitation;

  if (invitationArray !== undefined) {
    const inviteObj = invitationArray.find(item => {
      return item.inviteCode === props.match.params.invtCode;
    });
    if (inviteObj !== undefined) {
      return {
        userId: inviteObj.owner,
        projId: inviteObj.projId
      };
    }
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
