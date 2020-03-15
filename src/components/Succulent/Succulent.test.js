import React from "react";
import renderer from "react-test-renderer";
import Succulent from "./Succulent.js";

test("Snapshot Testing for Succulent Component", () => {
  const succulent = renderer.create(<Succulent />).toJSON();
  expect(succulent).toMatchSnapshot();
});
