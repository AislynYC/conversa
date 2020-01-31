// Actions
const SELECT_SLD = "SELECT_SLD";

// Action Creators
export function selectSld(selected, selectedId) {
  return {
    type: SELECT_SLD,
    selected: selected,
    selectedId: selectedId
  };
}

// Reducer
export default function reducer(state = null, action) {
  switch (action.type) {
    case "SELECT_SLD":
      if (action.selected === false) {
        return {
          slds: state.slds.map(sld => {
            return sld.id === action.selectedId
              ? {...sld, selected: true}
              : {...sld, selected: false};
          })
        };
      } else {
        return state;
      }
    default:
      return state;
  }
}
