import firebase from "../config/fbConfig";

const initState = {isAuthReady: false};

// Reducer
export function authReducer(state = initState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
