import React, {Fragment, useMemo} from 'react';
import Loading from '../../../Loading';
import Chart from 'react-google-charts';
import {
  dataOptions,
  defaultBarSetting,
  fullscreenBarSetting,
  defaultPieSetting,
  fullscreenPieSetting,
  fixedBarOptions,
  fixedPieOptions,
} from './configs';
import './index.css';

const getPieColorArray = (opts, colors) => {
  // build color array structure for pie chart
  return Array.isArray(opts) && opts.map((_, index) => ({color: colors[index]}));
};

const MultiSelect = (props) => {
  const {slds, curSldIndex, colors, isFullscreen} = props;
  const {opts, result, resType, qContent} = slds[curSldIndex];

  const pieColors = useMemo(() => getPieColorArray(opts, colors), [opts, colors]);

  let data = [dataOptions].concat(
    opts !== ''
      ? opts.map((opt, index) => {
          let optResult = result[index] !== '' ? result[index] : 0;
          return [`${opt}`, optResult, colors[index], optResult];
        })
      : null
  );

  const barSetting = useMemo(
    () => (isFullscreen ? fullscreenBarSetting : defaultBarSetting),
    [isFullscreen]
  );

  const pieSetting = useMemo(
    () => (isFullscreen ? fullscreenPieSetting : defaultPieSetting),
    [isFullscreen]
  );

  const barOptions = useMemo(
    () => ({
      ...fixedBarOptions,
      chartArea: {
        ...fixedBarOptions.chartArea,
        height: barSetting.height,
        bottom: barSetting.bottom,
      },
      hAxis: {
        textStyle: {
          fontSize: barSetting.hAxisFontSize,
        },
      },
      annotations: {
        textStyle: {
          ...fixedBarOptions.annotations.textStyle,
          fontSize: barSetting.annotationsFontSize,
        },
      },
    }),
    [barSetting]
  );

  const pieOptions = useMemo(
    () => ({
      ...fixedPieOptions,
      slices: pieColors,
      legend: {
        ...fixedPieOptions.legend,
        textStyle: {
          fontSize: pieSetting.legendFontSize,
        },
      },
      pieSliceTextStyle: {
        ...fixedPieOptions.pieSliceTextStyle,
        fontSize: pieSetting.pieSliceFontSize,
      },
    }),
    [pieSetting, pieColors]
  );

  return (
    <Fragment>
      <div className="qus-div">{qContent}</div>
      {/* To make sure the chart will be drawn only when there is an option exists*/}
      {opts !== '' && resType === 'bar-chart' && (
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="100%"
          data={data}
          options={barOptions}
          loader={<Loading {...props} />}
        />
      )}
      {opts !== '' && resType === 'pie-chart' && (
        <Chart
          chartType="PieChart"
          width="100%"
          height="100%"
          data={data}
          options={pieOptions}
          loader={<Loading {...props} />}
        />
      )}
    </Fragment>
  );
};

export default MultiSelect;
