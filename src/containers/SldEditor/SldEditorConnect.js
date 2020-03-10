import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";
import SldEditor from "./SldEditor.js";
import {showOverlay, closeOverlay} from "../../reducers/sldEditorReducer";

let mapStateToProps = (state, props) => {
  let projDataArray = state.firestore.ordered[`${props.userId}-projects`];
  let projInvitation = state.firestore.ordered.invitation;
  let transitionState = {
    firestore: state.firestore,
    auth: state.firebase.auth,
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
    //Make sure data is correctly loaded & check user auth
    projDataArray !== undefined &&
    projInvitation !== undefined &&
    state.firebase.auth
  ) {
    let projResponded = projInvitation.find(item => item.id === props.projId);
    if (projResponded !== undefined) {
      // Prevent open failure when open new project immediately after creation
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
      transitionState.slds = null;
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
