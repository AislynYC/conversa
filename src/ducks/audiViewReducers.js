// Actions
const CHOOSE_OPT = "CHOOSE_OPT";

// Action Creators
export function chooseOpt(e) {
  return {
    type: CHOOSE_OPT,
    e: e
  };
}

const initState = {};
// Reducer
export function audiViewReducers(state = initState, action) {
  switch (action.type) {
    case "CHOOSE_OPT":
      return {...state, selOptIndex: action.e.target.value};

    default:
      return state;
  }
}
