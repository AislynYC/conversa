import {connect} from "react-redux";
import SldEditor from "../components/SldEditor/SldEditor.js";
import {selectSld} from "../ducks/widgets.js";
import {nextSld} from "../ducks/widgets.js";
import {lastSld} from "../ducks/widgets.js";

let mapStateToProps = state => {
  return {currentSldId: state.currentSldId, slds: state.slds};
};
let mapDispatchToProps = dispatch => {
  return {
    selectSld: (selected, selectedId) => dispatch(selectSld(selected, selectedId)),
    nextSld: currentSldIndex => dispatch(nextSld(currentSldIndex)),
    lastSld: currentSldIndex => dispatch(lastSld(currentSldIndex))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SldEditor);
