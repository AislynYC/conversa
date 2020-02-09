import {combineReducers} from "redux";
// import {firebaseReducer} from "react-redux-firebase";
import {firestoreReducer} from "redux-firestore";
import {sldEditorReducers} from "./sldEditorReducers.js";
import {audiViewReducers} from "./audiViewReducers";

const rootReducer = combineReducers({
  // firebase: firebaseReducer,
  firestore: firestoreReducer,
  sldEditor: sldEditorReducers,
  audiView: audiViewReducers
});

export default rootReducer;
