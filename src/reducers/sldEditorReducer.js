// Actions
const SHOW_OVERLAY = "SHOW_OVERLAY";
const CLOSE_OVERLAY = "CLOSE_OVERLAY";

// Action Creators
export function showOverlay(overlayName, arg) {
  return {
    type: SHOW_OVERLAY,
    overlayName: overlayName,
    arg: arg
  };
}

export function closeOverlay(overlayName) {
  return {
    type: CLOSE_OVERLAY,
    overlayName: overlayName
  };
}
const initState = {
  confirmDelOverlayClass: "overlay"
};

// Reducer
export function sldEditorReducer(state = initState, action) {
  switch (action.type) {
    case "SHOW_OVERLAY":
      if (action.overlayName === "confirmDel") {
        return {
          ...state,
          confirmDelOverlayClass: "overlay overlay-show",
          delSldIndex: action.arg
        };
      } else {
        return state;
      }

    case "CLOSE_OVERLAY":
      if (action.overlayName === "confirmDel") {
        return {...state, confirmDelOverlayClass: "overlay"};
      } else {
        return state;
      }

    default:
      return state;
  }
}
