import {connect} from "react-redux";
import SldEditor from "./SldEditor.js";
import {selectSld} from "../ducks/sldEditorReducers.js";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";

let mapStateToProps = state => {
  // 目前只選第一個 user 的第一個 project ，之後記得改成變數！！

  let data = state.firestore.ordered["PLdhrvmiHZQJZVTsh9X0-projects"];
  if (data) {
    return {
      firestore: state.firestore,
      // localCurSldId: state.sldEditor.curSldIndex,
      curSldIndex: data[0].curSldIndex,
      slds: data[0].slds
    };
  } else {
    return {
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
