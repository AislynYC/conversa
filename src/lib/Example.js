export const exampleSlds = [
  {
    heading: "Welcome to Conversa Example",
    subHeading: "",
    hasQRCode: true,
    id: 1,
    opts: [""],
    qContent: "",
    resType: "bar-chart",
    result: [""],
    sldType: "heading-page",
    openEndedRes: [],
    tagNum: 1,
    tagRes: {}
  },
  {
    heading: "Regular Quarter Meeting of Q1 & Q2",
    subHeading: "2020-7-10",
    hasQRCode: false,
    id: 2,
    opts: [""],
    qContent: "",
    resType: "bar-chart",
    result: [""],
    sldType: "heading-page",
    openEndedRes: [],
    tagNum: 1,
    tagRes: {}
  },
  {
    heading: "",
    subHeading: "",
    hasQRCode: true,
    id: 3,
    opts: [
      "Department Communication",
      "New Facility",
      "New Process Improvement",
      "Product Quality"
    ],
    qContent: "What should we focus on next quarter?",
    resType: "bar-chart",
    result: [1, 3, 2, 5],
    sldType: "multiple-choice",
    openEndedRes: [],
    tagNum: 1,
    tagRes: {}
  },
  {
    heading: "My Points for next quarter",
    subHeading: "According to review meeting of last quarter...",
    hasQRCode: false,
    id: 4,
    opts: [""],
    qContent: "",
    resType: "bar-chart",
    result: [""],
    sldType: "heading-page",
    openEndedRes: [],
    tagNum: 1,
    tagRes: {}
  },
  {
    heading: "",
    subHeading: "",
    hasQRCode: true,
    id: 5,
    opts: [""],
    qContent: "What words come to mind after hearing this presentation?",
    resType: "bar-chart",
    result: [""],
    sldType: "tag-cloud",
    openEndedRes: [],
    tagNum: 3,
    tagRes: {Excellent: 3, "Good Idea": 1, Improvement: 3, Fighting: 1, Quality: 2}
  },
  {
    heading: "",
    subHeading: "",
    hasQRCode: true,
    id: 6,
    opts: [""],
    qContent: "Do you have any question?",
    resType: "bar-chart",
    result: [""],
    sldType: "open-ended",
    openEndedRes: [
      "What is the schedule of moving to new facility?",
      "When should we have the next quarter review meeting?",
      "Who will responsible for the quality improvement project?",
      "Will someone responsible for tracking all action items today?",
      "When will we sign this meeting minutes?"
    ],
    tagNum: 1,
    tagRes: {}
  }
];

export const exampleRes = {
  reaction: {laugh: 9},
  respondedAudi: {
    1: [],
    2: [],
    3: [
      "involved1",
      "involved2",
      "involved3",
      "involved4",
      "involved5",
      "involved6",
      "involved7",
      "involved8",
      "involved9",
      "involved10",
      "involved11"
    ],
    4: [],
    5: [
      "involved1",
      "involved2",
      "involved5",
      "involved6",
      "involved9",
      "involved10",
      "involved11"
    ],
    6: ["involved7", "involved8", "involved9", "involved10", "involved11"]
  },
  involvedAudi: [
    "involved1",
    "involved2",
    "involved3",
    "involved4",
    "involved5",
    "involved6",
    "involved7",
    "involved8",
    "involved9",
    "involved10",
    "involved11"
  ]
};
