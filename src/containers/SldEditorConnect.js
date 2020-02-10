import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";

import SldEditor from "./SldEditor.js";

let mapStateToProps = (state, props) => {
  let projDataArray = state.firestore.ordered[`${props.userId}-projects`];
  let projInvitation = state.firestore.ordered.invitation;

  if (
    projDataArray !== undefined &&
    projDataArray.length !== 0 &&
    projInvitation !== undefined
  ) {
    const projResponded = projInvitation.find(item => item.id === props.projId);
    return {
      firestore: state.firestore,
      curSldIndex: projDataArray[0].curSldIndex,
      slds: projDataArray[0].slds,
      respondedAudi: projResponded.respondedAudi,
      reaction: projResponded.reaction
    };
  } else {
    return {
      firestore: undefined,
      curSldIndex: undefined,
      slds: undefined,
      respondedAudi: undefined,
      reaction: undefined
    };
  }
};

export default compose(
  firestoreConnect(props => [
    {
      collection: "users",
      doc: `${props.userId}`,
      subcollections: [{collection: "projects"}],
      storeAs: `${props.userId}-projects`
    }
  ]),
  firestoreConnect(() => [
    {
      collection: "invitation"
    }
  ]),
  connect(mapStateToProps)
)(SldEditor);
