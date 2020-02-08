import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";

import AudiView from "./AudiView.js";

let mapStateToProps = (state, props) => {
  console.log("state", state, "props", props);

  let projDataArray = state.firestore.ordered[`${props.userId}-projects`];
  console.log("projDataArray", projDataArray);
  if (projDataArray !== undefined && projDataArray.length !== 0) {
    const projData = projDataArray.find(item => (item.id = props.projId));
    console.log(projData);
    return {
      firestore: state.firestore,
      curSldIndex: projData.curSldIndex,
      slds: projData.slds
    };
  }
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
  connect(mapStateToProps)
)(AudiView);
