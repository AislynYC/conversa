import {connect} from "react-redux";
import SldEditor from "../components/SldEditor/SldEditor.js";
import {selectSld, nextSld, lastSld} from "../ducks/sldEditorReducers.js";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";

let mapStateToProps = state => {
  console.log(state);
  // 目前只選第一個 user 的第一個 project ，之後記得改成變數！！
  // currentSldId: state.sldEditor.currentSldId,
  // slds: state.sldEditor.slds
  let data = state.firestore.ordered["PLdhrvmiHZQJZVTsh9X0-projects"];
  if (data) {
    return {
      currentSldId: data[0].currentSldId,
      slds: data[0].slds
    };
  } else {
    return {
      currentSldId: undefined,
      slds: undefined
    };
  }
};
let mapDispatchToProps = dispatch => {
  return {
    selectSld: (selected, selectedId) => dispatch(selectSld(selected, selectedId)),
    nextSld: currentSldIndex => dispatch(nextSld(currentSldIndex)),
    lastSld: currentSldIndex => dispatch(lastSld(currentSldIndex))
  };
};
export default compose(
  firestoreConnect(() => [
    {
      collection: "users",
      doc: "PLdhrvmiHZQJZVTsh9X0",
      subcollections: [{collection: "projects"}],
      storeAs: "PLdhrvmiHZQJZVTsh9X0-projects"
    }
  ]),
  connect(mapStateToProps, mapDispatchToProps)
)(SldEditor);
