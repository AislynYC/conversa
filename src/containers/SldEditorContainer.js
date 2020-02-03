import {connect} from "react-redux";
import SldEditor from "../components/SldEditor/SldEditor.js";
import {selectSld, nextSld, lastSld, addSld} from "../ducks/sldEditorReducers.js";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";

let mapStateToProps = state => {
  console.log(state);
  return {
    currentSldId: state.sldEditor.currentSldId,
    slds: state.sldEditor.slds
  };
};
let mapDispatchToProps = dispatch => {
  return {
    selectSld: (selected, selectedId) => dispatch(selectSld(selected, selectedId)),
    nextSld: currentSldIndex => dispatch(nextSld(currentSldIndex)),
    lastSld: currentSldIndex => dispatch(lastSld(currentSldIndex)),
    addSld: db => {
      dispatch(addSld(db));
    }
  };
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(() => [
    {
      collection: "users",
      doc: "PLdhrvmiHZQJZVTsh9X0",
      subcollections: [{collection: "projects"}],
      storeAs: "PLdhrvmiHZQJZVTsh9X0-projects"
    }
  ])
)(SldEditor);
