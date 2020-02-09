import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";

import AudiView from "./AudiView.js";
import {chooseOpt} from "../ducks/audiViewReducers.js";
let mapStateToProps = (state, props) => {
  let projDataArray = state.firestore.ordered[`${props.userId}-projects`];
  if (projDataArray !== undefined && projDataArray.length !== 0) {
    const projData = projDataArray.find(item => (item.id = props.projId));
    return {
      firestore: state.firestore,
      curSldIndex: projData.curSldIndex,
      slds: projData.slds,
      selOptIndex: state.audiView.selOptIndex
    };
  } else {
    return {
      firestore: undefined,
      curSldIndex: undefined,
      slds: undefined,
      selOptIndex: undefined
    };
  }
};

let mapDispatchToProps = dispatch => {
  return {
    chooseOpt: e => dispatch(chooseOpt(e))
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
