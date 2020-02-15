// Actions
const SELECT_SLD = "SELECT_SLD";

// Action Creators
export function selectSld(selectedId) {
  return {
    type: SELECT_SLD,
    selectedId: selectedId
  };
}

const initState = {};
// Reducer
export function sldEditorReducer(state = initState, action) {
  switch (action.type) {
    case "SELECT_SLD":
      if (action.selectedId !== state.currentSldId) {
        return {...state, currentSldId: action.selectedId};
      } else {
        return state;
      }

    default:
      return state;
  }
}
