import {combineReducers} from "redux";
// import {firebaseReducer} from "react-redux-firebase";
import {firestoreReducer} from "redux-firestore";
import {sldEditorReducers} from "./sldEditorReducers.js";

const rootReducer = combineReducers({
  // firebase: firebaseReducer,
  firestore: firestoreReducer,
  sldEditor: sldEditorReducers
});

export default rootReducer;
