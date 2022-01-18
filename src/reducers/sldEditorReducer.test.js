import {sldEditorReducer} from "./sldEditorReducer";

describe("sldEditorReducer", () => {
  let SldEditorReducer;
  beforeEach(() => {
    jest.resetModules();
    SldEditorReducer = sldEditorReducer;
  });

  describe("type:SHOW_OVERLAY", () => {
    it("should change overlay class show", () => {
      const state = {
        confirmDelOverlayClass: "overlay",
        delSldIndex: ""
      };
      const result = SldEditorReducer(state, {
        type: "SHOW_OVERLAY",
        overlayName: "confirmDel",
        arg: 3
      });
      expect(result).toEqual({
        ...state,
        confirmDelOverlayClass: "overlay overlay-show",
        delSldIndex: 3
      });
    });
  });

  describe("type:CLOSE_OVERLAY", () => {
    it("should change overlay class to close", () => {
      const state = {
        confirmDelOverlayClass: "overlay overlay-show",
        delSldIndex: 3
      };
      const result = SldEditorReducer(state, {
        type: "CLOSE_OVERLAY",
        overlayName: "confirmDel"
      });
      expect(result).toEqual({
        ...state,
        confirmDelOverlayClass: "overlay"
      });
    });
  });
});
