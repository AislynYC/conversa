import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";

import SldEditor from "./SldEditor.js";
import {showOverlay, closeOverlay} from "../ducks/sldEditorReducer";

let mapStateToProps = (state, props) => {
  console.log("map", props);
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
      reaction: projResponded.reaction,
      confirmDelOverlayClass: state.sldEditor.confirmDelOverlayClass,
      delSldIndex: state.sldEditor.delSldIndex
    };
  } else {
    return {
      firestore: undefined,
      curSldIndex: undefined,
      slds: undefined,
      respondedAudi: undefined,
      reaction: undefined,
      confirmDelOverlayClass: state.sldEditor.confirmDelOverlayClass,
      delSldIndex: state.sldEditor.delSldIndex
    };
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
