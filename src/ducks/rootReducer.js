import {combineReducers} from "redux";
import {firebaseReducer} from "react-redux-firebase";
import {firestoreReducer} from "redux-firestore";
import {sldEditorReducers} from "./sldEditorReducers.js";
import {audiViewReducers} from "./audiViewReducers";
import {authReducer} from "./authReducer";

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  auth: authReducer,
  sldEditor: sldEditorReducers,
  audiView: audiViewReducers
});

export default rootReducer;
