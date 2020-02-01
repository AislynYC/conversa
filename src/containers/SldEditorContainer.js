import {connect} from "react-redux";
import SldEditor from "../components/SldEditor/SldEditor.js";
import {selectSld} from "../ducks/widgets.js";
let mapStateToProps = state => {
  return {slds: state.slds};
};
let mapDispatchToProps = dispatch => {
  return {
    selectSld: (selected, selectedId) => dispatch(selectSld(selected, selectedId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SldEditor);