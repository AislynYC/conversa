// Actions
const SELECT_SLD = "SELECT_SLD";

// Action Creators
export function selectSld(selectedId) {
  return {
    type: SELECT_SLD,
    selectedId: selectedId
  };
}

// Reducer
export default function reducer(state = null, action) {
  switch (action.type) {
    case "SELECT_SLD":
      if (action.selectedId !== state.currentSldId) {
        return {
          currentSldId: action.selectedId,
          slds: state.slds
        };
      } else {
        return state;
      }
    default:
      return state;
  }
}
