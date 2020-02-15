// Actions
const CHOOSE_OPT = "CHOOSE_OPT";
const GET_AUDIID = "GET_AUDIID";

// Action Creators
export function chooseOpt(e) {
  return {
    type: CHOOSE_OPT,
    e: e
  };
}

export function getAudiId() {
  return {
    type: GET_AUDIID
  };
}

const initState = {};
// Reducer
export function audiViewReducer(state = initState, action) {
  switch (action.type) {
    case "CHOOSE_OPT":
      return {...state, selOptIndex: action.e.target.value};

    case "GET_AUDIID":
      return {...state, audiId: localStorage.getItem("audiId")};

    default:
      return state;
  }
}
