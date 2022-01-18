// Actions
const SHOW_OVERLAY = "SHOW_OVERLAY";
const CLOSE_OVERLAY = "CLOSE_OVERLAY";
const ON_LOADING = "ON_LOADING";

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

export function onLoading(isLoading) {
  return {
    type: ON_LOADING,
    isLoading: isLoading
  };
}

const initState = {
  confirmDelOverlayClass: "overlay",
  newProjOverlayClass: "overlay",
  isLoading: false
};

// Reducer
export function projectsReducer(state = initState, action) {
  switch (action.type) {
    case "SHOW_OVERLAY":
      if (action.overlayName === "newProj") {
        return {...state, newProjOverlayClass: "overlay overlay-show"};
      } else if (action.overlayName === "confirmDel") {
        return {
          ...state,
          confirmDelOverlayClass: "overlay overlay-show",
          delProjId: action.arg
        };
      } else {
        return state;
      }

    case "CLOSE_OVERLAY":
      if (action.overlayName === "newProj") {
        return {...state, newProjOverlayClass: "overlay"};
      } else if (action.overlayName === "confirmDel") {
        return {...state, confirmDelOverlayClass: "overlay"};
      } else {
        return state;
      }

    case "ON_LOADING":
      if (action.isLoading === true) {
        return {...state, isLoading: true};
      } else {
        return {...state, isLoading: false};
      }

    default:
      return state;
  }
}
