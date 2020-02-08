import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";

import SldEditor from "./SldEditor.js";
import AudiViewConnect from "./AudiViewConnect";
import {selectSld} from "../ducks/sldEditorReducers.js";

let mapStateToProps = (state, props) => {
  let data = state.firestore.ordered[`${props.userId}-projects`];
  if (data) {
    return {
      firestore: state.firestore,
      // localCurSldId: state.sldEditor.curSldIndex,
      curSldIndex: data[0].curSldIndex,
      slds: data[0].slds
    };
  } else {
    return {
      firestore: undefined,
      curSldIndex: undefined,
      slds: undefined
    };
  }
};
let mapDispatchToProps = dispatch => {
  return {
    selectSld: selectedId => dispatch(selectSld(selectedId))
  };
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

  connect(mapStateToProps, mapDispatchToProps)
)(SldEditor);
