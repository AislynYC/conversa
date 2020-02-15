import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";

import AudiView from "./AudiView.js";
import {chooseOpt} from "../ducks/audiViewReducer";
import {getAudiId} from "../ducks/audiViewReducer";

let mapStateToProps = (state, props) => {
  let projDataArray = state.firestore.ordered[`${props.userId}-projects`];
  let projInvitation = state.firestore.ordered.invitation;
  if (
    projDataArray !== undefined &&
    projDataArray.length !== 0 &&
    projInvitation !== undefined
  ) {
    const projData = projDataArray.find(item => item.id === props.projId);
    const projResponded = projInvitation.find(item => item.id === props.projId);
    return {
      firestore: state.firestore,
      curSldIndex: projData.curSldIndex,
      slds: projData.slds,
      selOptIndex: state.audiView.selOptIndex,
      audiId: state.audiView.audiId,
      respondedAudi: projResponded.respondedAudi,
      reaction: projResponded.reaction
    };
  } else {
    return {
      firestore: undefined,
      curSldIndex: undefined,
      slds: undefined,
      selOptIndex: undefined,
      audiId: undefined,
      respondedAudi: undefined,
      reaction: undefined
    };
  }
};

let mapDispatchToProps = dispatch => {
  return {
    chooseOpt: e => dispatch(chooseOpt(e)),
    getAudiId: () => dispatch(getAudiId())
  };
};

export default compose(
  firestoreConnect(props => {
    return [
      {
        collection: "users",
        doc: `${props.userId}`,
        subcollections: [{collection: "projects"}],
        storeAs: `${props.userId}-projects`
      }
    ];
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(AudiView);
