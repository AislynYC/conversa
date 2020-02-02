// Actions
const SELECT_SLD = "SELECT_SLD";
const NEXT_SLD = "NEXT_SLD";

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
        console.log("ya");
        return {...state, currentSldId: currentSldObj.id};
      } else {
        console.log("yo");
        return state;
      }

    default:
      return state;
  }
}
