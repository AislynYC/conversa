// Actions
const GET_AUDIID = "GET_AUDIID";

// Action Creators

export function getAudiId() {
  return {
    type: GET_AUDIID
  };
}

const initState = {};
// Reducer
export function audiViewReducer(state = initState, action) {
  switch (action.type) {
    case "GET_AUDIID":
      return {...state, audiId: localStorage.getItem("audiId")};

    default:
      return state;
  }
}
