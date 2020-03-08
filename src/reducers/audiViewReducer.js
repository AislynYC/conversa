// Actions
const GET_AUDIID = "GET_AUDIID";
const SET_IS_LOADING = "SET_IS_LOADING";

// Action Creators

export function getAudiId() {
  return {
    type: GET_AUDIID
  };
}

export function setIsLoading(boolean) {
  return {
    type: SET_IS_LOADING,
    boolean: boolean
  };
}

const initState = {};
// Reducer
export function audiViewReducer(state = initState, action) {
  switch (action.type) {
    case "GET_AUDIID":
      return {...state, audiId: localStorage.getItem("audiId")};

    case "SET_IS_LOADING":
      if (action.boolean) {
        return {...state, isLoading: true};
      } else {
        return {...state, isLoading: false};
      }

    default:
      return state;
  }
}
