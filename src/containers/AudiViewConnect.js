import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";

import AudiView from "./AudiView.js";
import {getAudiId} from "../ducks/audiViewReducer";
import {setIsLoading} from "../ducks/audiViewReducer";

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
      respondedAudi: projResponded.respondedAudi,
      reaction: projResponded.reaction,
      involvedAudi: projResponded.involvedAudi,
      audiId: state.audiView.audiId,
      isLoading: state.audiView.isLoading
    };
  } else {
    return {
      firestore: undefined,
      curSldIndex: undefined,
      slds: undefined,
      respondedAudi: undefined,
      reaction: undefined,
      involvedAudi: undefined,
      audiId: state.audiView.audiId,
      isLoading: state.audiView.isLoading
    };
  }
};

let mapDispatchToProps = dispatch => {
  return {
    getAudiId: () => dispatch(getAudiId()),
    setIsLoading: boolean => dispatch(setIsLoading(boolean))
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
