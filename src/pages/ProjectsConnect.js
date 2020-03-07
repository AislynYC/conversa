import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";

import ProjManager from "./Projects";
import {showOverlay} from "../reducers/projectsReducer";
import {closeOverlay} from "../reducers/projectsReducer";
import {onLoading} from "../reducers/projectsReducer";

let mapStateToProps = (state, props) => {
  let projDataArray = state.firestore.ordered[`${props.match.params.userId}-projects`];

  if (projDataArray !== undefined && state.firebase.auth !== undefined) {
    return {
      firestore: state.firestore,
      auth: state.firebase.auth,
      projects: projDataArray,
      newProjOverlayClass: state.projManager.newProjOverlayClass,
      confirmDelOverlayClass: state.projManager.confirmDelOverlayClass,
      delProjId: state.projManager.delProjId,
      isLoading: state.projManager.isLoading
    };
  } else {
    return {
      firestore: undefined,
      auth: undefined,
      projects: undefined,
      newProjOverlayClass: state.projManager.newProjOverlayClass,
      confirmDelOverlayClass: state.projManager.confirmDelOverlayClass,
      delProjId: state.projManager.delProjId,
      isLoading: state.projManager.isLoading
    };
  }
};

let mapDispatchToProps = dispatch => {
  return {
    showOverlay: (overlayName, arg) => dispatch(showOverlay(overlayName, arg)),
    closeOverlay: overlayName => dispatch(closeOverlay(overlayName)),
    onLoading: isLoading => dispatch(onLoading(isLoading))
  };
};

export default compose(
  firestoreConnect(props => {
    return [
      {
        collection: "users",
        doc: `${props.match.params.userId}`,
        subcollections: [{collection: "projects"}],
        storeAs: `${props.match.params.userId}-projects`
      }
    ];
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(ProjManager);
