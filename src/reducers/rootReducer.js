import {combineReducers} from "redux";
import {firebaseReducer} from "react-redux-firebase";
import {firestoreReducer} from "redux-firestore";
import {sldEditorReducer} from "./sldEditorReducer.js";
import {audiViewReducer} from "./audiViewReducer";
import {projectsReducer} from "./projectsReducer";

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  sldEditor: sldEditorReducer,
  audiView: audiViewReducer,
  projManager: projectsReducer
});

export default rootReducer;
