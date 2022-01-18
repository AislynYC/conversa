import React from "react";
import Enzyme, {shallow} from "enzyme";
import CurSld from "./CurSld";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({adapter: new Adapter()});

const mockSlds = [
  {
    hasQRCode: true,
    heading: "TestHeading 測試標題",
    id: 1583380834131,
    lastEdited: 1583652738079,
    openEndedRes: [],
    opts: ["", "", ""],
    qContent: "",
    resType: "bar-chart",
    result: ["", "", ""],
    sldType: "heading-page",
    subHeading: "",
    tagNum: 1,
    tagRes: {}
  },
  {
    hasQRCode: false,
    heading: "TestHeading 測試標題",
    id: 1583380855588,
    lastEdited: 1583652738080,
    openEndedRes: [],
    opts: ["testOpt1 測試選項１", "testOpt2 測試選項２", "testOpt3 測試選項 ３"],
    qContent: "test question 測試問題",
    resType: "bar-chart",
    result: ["2", "7", "10"],
    sldType: "multiple-choice",
    subHeading: "",
    tagNum: 1,
    tagRes: {}
  }
];

const mockRespondedAudi = {
  1583380834131: [],
  1583380855588: ["043ab6f1-f8da-4188-890e-afab4487772c"],
  1583380867834: [
    "12444937-ef1c-413b-a1da-65be1947b678",
    "dd03c865-af76-4c72-8650-e27e036779d3"
  ]
};

const mockInvolvedAudi = [
  "043ab6f1-f8da-4188-890e-afab4487772c",
  "12444937-ef1c-413b-a1da-65be1947b678",
  "dd03c865-af76-4c72-8650-e27e036779d3"
];

const headingProps = {
  projId: "OJwi11d8aVOTKn6tP0A3",
  curSldIndex: 0,
  slds: mockSlds,
  respondedAudi: mockRespondedAudi,
  involvedAudi: mockInvolvedAudi,
  isFullscreen: true
};

const multiChoiceProps = {
  projId: "OJwi11d8aVOTKn6tP0A3",
  curSldIndex: 1,
  slds: mockSlds,
  respondedAudi: mockRespondedAudi,
  involvedAudi: mockInvolvedAudi,
  isFullscreen: false
};

// Test for slide type: Heading-Page
describe("<CurSld />", () => {
  const wrapper = shallow(<CurSld {...headingProps} />);
  it("match snapshot", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("must have member info", () => {
    expect(wrapper.find(".member-info").children()).toHaveLength(2);
    expect(
      wrapper
        .find(".member-info")
        .childAt(1)
        .text()
    ).toEqual("3");
  });
});

// Test for slide type: Multi-Choice
describe("<CurSld />", () => {
  const wrapper = shallow(<CurSld {...multiChoiceProps} />);
  it("match snapshot", () => {
    expect(wrapper).toMatchSnapshot();
  });
  it("must have correct member info", () => {
    expect(wrapper.find(".member-info").children()).toHaveLength(3);
    expect(
      wrapper
        .find(".member-info")
        .childAt(2)
        .text()
    ).toEqual("3");
  });

  it("must have correct hand-raised info", () => {
    expect(
      wrapper
        .find(".hand-group")
        .childAt(1)
        .text()
    ).toEqual("1");
  });
});
