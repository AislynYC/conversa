// Actions
const SELECT_SLD = "SELECT_SLD";
const NEXT_SLD = "NEXT_SLD";
const LAST_SLD = "LAST_SLD";

// Action Creators
export function selectSld(selectedId) {
  return {
    type: SELECT_SLD,
    selectedId: selectedId
  };
}

export function nextSld(currentSldIndex) {
  return {
    type: NEXT_SLD,
    currentSldIndex: currentSldIndex
  };
}

export function lastSld(currentSldIndex) {
  return {
    type: LAST_SLD,
    currentSldIndex: currentSldIndex
  };
}

// Reducer
export default function reducer(state = null, action) {
  switch (action.type) {
    case "SELECT_SLD":
      if (action.selectedId !== state.currentSldId) {
        return {...state, currentSldId: action.selectedId};
      } else {
        return state;
      }
    case "NEXT_SLD":
      if (action.currentSldIndex + 1 < state.slds.length) {
        let currentSldObj = state.slds[action.currentSldIndex + 1];
        return {...state, currentSldId: currentSldObj.id};
      } else {
        return state;
      }
    case "LAST_SLD":
      if (action.currentSldIndex > 0) {
        let currentSldObj = state.slds[action.currentSldIndex - 1];
        return {...state, currentSldId: currentSldObj.id};
      } else {
        return state;
      }
    default:
      return state;
  }
}
