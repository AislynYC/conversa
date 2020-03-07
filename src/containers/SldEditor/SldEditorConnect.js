import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";

import SldEditor from "./SldEditor.js";
import {showOverlay, closeOverlay} from "../../reducers/sldEditorReducer";

let mapStateToProps = (state, props) => {
  let projDataArray = state.firestore.ordered[`${props.userId}-projects`];
  let projInvitation = state.firestore.ordered.invitation;
  let transitionState = {
    firestore: undefined,
    auth: undefined,
    curSldIndex: undefined,
    slds: undefined,
    respondedAudi: undefined,
    reaction: undefined,
    involvedAudi: undefined,
    editProj: undefined,
    confirmDelOverlayClass: state.sldEditor.confirmDelOverlayClass,
    delSldIndex: state.sldEditor.delSldIndex
  };

  if (
    projDataArray !== undefined &&
    projDataArray.length !== 0 &&
    projInvitation !== undefined
  ) {
    let projResponded = projInvitation.find(item => item.id === props.projId);
    if (projResponded !== undefined) {
      let projData = projDataArray.find(proj => proj.id === props.projId);
      return {
        firestore: state.firestore,
        auth: state.firebase.auth,
        curSldIndex: projData.curSldIndex,
        slds: projData.slds,
        respondedAudi: projResponded.respondedAudi,
        reaction: projResponded.reaction,
        involvedAudi: projResponded.involvedAudi,
        editProj: projData,
        confirmDelOverlayClass: state.sldEditor.confirmDelOverlayClass,
        delSldIndex: state.sldEditor.delSldIndex
      };
    } else {
      return transitionState;
    }
  } else {
    return transitionState;
  }
};

let mapDispatchToProps = dispatch => {
  return {
    showOverlay: (overlayName, arg) => dispatch(showOverlay(overlayName, arg)),
    closeOverlay: overlayName => dispatch(closeOverlay(overlayName))
  };
};
export default compose(
  firestoreConnect(props => [
    {
      collection: "users",
      doc: `${props.match.params.userId}`,
      subcollections: [{collection: "projects"}],
      storeAs: `${props.match.params.userId}-projects`
    }
  ]),
  firestoreConnect(() => [
    {
      collection: "invitation"
    }
  ]),
  connect(mapStateToProps, mapDispatchToProps)
)(SldEditor);
