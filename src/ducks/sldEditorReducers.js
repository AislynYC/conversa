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

const initState = {
  currentSldId: "01",
  slds: [
    {
      id: "01",
      qContent: "Question content for test 1",
      qType: "Question type for test 1",
      resContent: "Result content for test 1",
      resType: "Result type for test 1"
    },
    {
      id: "02",
      qContent: "Question content for test 2",
      qType: "Question type for test 2",
      resContent: "Result content for test 2",
      resType: "Result type for test 2"
    },
    {
      id: "03",
      qContent: "Question content for test 3",
      qType: "Question type for test 3",
      resContent: "Result content for test 3",
      resType: "Result type for test 3"
    }
  ]
};
// Reducer
export function sldEditorReducers(state = initState, action) {
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
