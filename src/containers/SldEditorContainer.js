import {connect} from "react-redux";
import SldEditor from "../components/SldEditor/SldEditor.js";
import {selectSld, nextSld, lastSld} from "../ducks/sldEditorReducers.js";

let mapStateToProps = state => {
  return {
    currentSldId: state.sldEditor.currentSldId,
    slds: state.sldEditor.slds
  };
};
let mapDispatchToProps = dispatch => {
  return {
    selectSld: (selected, selectedId) => dispatch(selectSld(selected, selectedId)),
    nextSld: currentSldIndex => dispatch(nextSld(currentSldIndex)),
    lastSld: currentSldIndex => dispatch(lastSld(currentSldIndex))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SldEditor);
