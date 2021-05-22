export const dataOptions = [
  'Options',
  'Result',
  {role: 'style'},
  {
    sourceColumn: 0,
    role: 'annotation',
    type: 'string',
    calc: 'stringify',
  },
];

export const defaultBarSetting = {
  height: '75%',
  hAxisFontSize: 18,
  annotationsFontSize: 18,
  bottom: 50,
};

export const fullscreenBarSetting = {
  height: '70%',
  hAxisFontSize: 30,
  annotationsFontSize: 30,
  bottom: 110,
};

export const defaultPieSetting = {
  legendFontSize: 16,
  pieSliceFontSize: 16,
};

export const fullscreenPieSetting = {
  legendFontSize: 26,
  pieSliceFontSize: 36,
};

export const fixedBarOptions = {
  legend: {position: 'none'},
  height: '100%',
  bar: {groupWidth: '68%'},
  animation: {
    duration: 1000,
    easing: 'out',
    startup: true,
  },
  vAxis: {
    gridlines: {count: 0},
    minorGridlines: {count: 0},
    ticks: [],
  },
  chartArea: {
    width: '80%',
  },
  annotations: {
    textStyle: {
      bold: true,
    },
  },
};

export const fixedPieOptions = {
  width: '100%',
  chartArea: {width: '80%'},
  animation: {
    duration: 1000,
    easing: 'out',
    startup: true,
  },
  is3D: false,
  pieHole: 0,
  pieSliceText: 'value',
  legend: {
    position: 'labeled',
  },
  pieSliceTextStyle: {
    color: '#333',
  },
};
