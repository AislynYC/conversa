import React, {useEffect, useRef, Fragment, useState} from "react";
import {FormattedMessage} from "react-intl";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Loading from "../components/Loading/Loading";
import colors from "../lib/colors";

// for each slide types
import Chart from "react-google-charts";
import ReactWordcloud from "react-wordcloud";
import QRCode from "qrcode.react";

const CurSld = props => {
  const clickFullscreen = () => {
    if (
      props.isFullscreen === true &&
      props.slds !== undefined &&
      props.curSldIndex !== undefined
    ) {
      props.nextSld();
    }
  };

  let sldContent = null;
  if (props.slds[props.curSldIndex].sldType === "heading-page") {
    sldContent = <Headings {...props} />;
  } else if (props.slds[props.curSldIndex].sldType === "multiple-choice") {
    sldContent = <MultiSel {...props} colors={colors} />;
  } else if (props.slds[props.curSldIndex].sldType === "open-ended") {
    sldContent = <OpenEnded {...props} />;
  } else if (props.slds[props.curSldIndex].sldType === "tag-cloud") {
    sldContent = <TagCloud {...props} />;
  }

  let handRaised = null;
  const sldRespondedAudi = props.respondedAudi[props.slds[props.curSldIndex].id];
  if (props.slds[props.curSldIndex].sldType !== "heading-page") {
    handRaised = (
      <div className="hand-group">
        <FontAwesomeIcon icon={["fas", "hand-paper"]} id="hand-icon" />
        {sldRespondedAudi ? sldRespondedAudi.length : "0"}
      </div>
    );
  } else {
    handRaised = "";
  }

  return (
    <div id="current-sld-container">
      <div id="current-sld-border">
        <div id="current-sld" onClick={clickFullscreen}>
          {sldContent}
          <div className="member-info">
            {handRaised}
            <FontAwesomeIcon icon={["fas", "user"]} id="member-icon" />
            {props.involvedAudi.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurSld;

const Headings = props => {
  let headingContainer = null;
  let scanToJoinClass = "scan-to-join";
  let qrCodeSize = 230;
  let qrCodeImgSize = {height: 45, width: 45};

  /* different QRCode size depends on fullscreen or not */
  if (props.isFullscreen) {
    scanToJoinClass = "fullscreenFontSize scan-to-join";
    qrCodeSize = 500;
    qrCodeImgSize = {height: 100, width: 100};
  }

  // for switching two types (QRCode or sub-heading) of heading slide
  if (props.slds[props.curSldIndex].hasQRCode) {
    headingContainer = (
      <div className="qr-code">
        <Fragment>
          <div className={scanToJoinClass}>
            <FormattedMessage id="edit.scan-to-join" />
            <FontAwesomeIcon icon={["far", "hand-point-right"]} size="lg" />
          </div>
          <QRCode
            value={`https://conversa-a419b.firebaseapp.com/audi/${props.projId}`}
            size={qrCodeSize}
            imageSettings={{
              src:
                "https://lh3.googleusercontent.com/ZgZLV4rnkakeFPtT14X_lz3BdDpv8kEQ6bzWvXgHw-Wj_WYqiPNSqkq2oUBBRMQiQePrmDmO6WBrRq7_bqFsQBvnTd1_vh4BVg7opHZRsvYUTRrgoL59qyzcflYMnmHy0NzjtngT4A=w400",
              x: null,
              y: null,
              height: qrCodeImgSize.height,
              width: qrCodeImgSize.width,
              excavate: true
            }}
          />
        </Fragment>
      </div>
    );
  } else {
    headingContainer = (
      <div className="sub-heading-render">{props.slds[props.curSldIndex].subHeading}</div>
    );
  }

  return (
    <div className="heading-render-container">
      <div className="heading-render">{props.slds[props.curSldIndex].heading}</div>
      <Fragment>{headingContainer}</Fragment>
    </div>
  );
};

const MultiSel = props => {
  let optsArray = props.slds[props.curSldIndex].opts;
  let resultArray = props.slds[props.curSldIndex].result;
  let resultType = props.slds[props.curSldIndex].resType;
  let optResult = null;
  let pieColors = null;
  if (optsArray !== "") {
    pieColors = props.slds[props.curSldIndex].opts.map((opt, index) => {
      return {color: props.colors[index]};
    });
  }

  if (optsArray !== "") {
    optResult = props.slds[props.curSldIndex].opts.map((opt, index) => {
      let result = resultArray[index] !== "" ? resultArray[index] : 0;
      return [`${opt}`, result, props.colors[index], result];
    });
  } else {
    optResult = null;
  }

  let data = [
    [
      "Options",
      "Result",
      {role: "style"},
      {
        sourceColumn: 0,
        role: "annotation",
        type: "string",
        calc: "stringify"
      }
    ]
  ].concat(optResult);

  let barOptions = {
    legend: {position: "none"},
    height: "100%",
    chartArea: {width: "80%", height: "75%"},
    bar: {groupWidth: "68%"},
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    },
    vAxis: {
      gridlines: {count: 0},
      minorGridlines: {count: 0},
      ticks: []
    },
    hAxis: {
      textStyle: {
        fontSize: 20
      }
    },
    annotations: {
      textStyle: {
        fontSize: 20,
        bold: true
      }
    }
  };

  let pieOptions = {
    slices: pieColors,
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    },
    is3D: false,
    pieHole: 0,
    legend: {
      position: "labeled",
      textStyle: {
        fontSize: 16
      }
    },
    pieSliceText: "value",
    pieSliceTextStyle: {
      color: "#333",
      fontSize: 16
    }
  };

  if (props.isFullscreen === true) {
    barOptions = {
      legend: {position: "none"},
      chartArea: {width: "80%", height: "70%"},
      bar: {groupWidth: "68%"},
      animation: {
        duration: 1000,
        easing: "out",
        startup: true
      },
      vAxis: {
        gridlines: {count: 0},
        minorGridlines: {count: 0},
        ticks: []
      },
      hAxis: {
        textStyle: {
          fontSize: 36
        }
      },
      annotations: {
        textStyle: {
          fontSize: 36,
          bold: true
        }
      }
    };
    pieOptions = {
      slices: pieColors,
      animation: {
        duration: 1000,
        easing: "out",
        startup: true
      },
      is3D: false,
      pieHole: 0,
      legend: {
        position: "labeled",
        textStyle: {
          fontSize: 36
        }
      },
      pieSliceText: "value",
      pieSliceTextStyle: {
        color: "#333",
        fontSize: 36
      }
    };
  }

  // To make sure the chart will be drawn only when there is an option exists
  let chart = null;
  if (optsArray !== "") {
    if (resultType === "bar-chart") {
      chart = (
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="100%"
          data={data}
          loader={<Loading {...props} />}
          options={barOptions}
        />
      );
    } else if (resultType === "pie-chart") {
      chart = (
        <Chart
          width="100%"
          height="100%"
          chartType="PieChart"
          loader={<Loading {...props} />}
          data={data}
          options={pieOptions}
        />
      );
    }
  }

  return (
    <Fragment>
      <div className="qus-div">{props.slds[props.curSldIndex].qContent}</div>
      {chart}
    </Fragment>
  );
};

const OpenEnded = props => {
  let openEndedResContent = null;

  if (
    props.slds[props.curSldIndex].openEndedRes !== [] &&
    props.slds[props.curSldIndex].openEndedRes !== undefined
  ) {
    openEndedResContent = props.slds[props.curSldIndex].openEndedRes.map(
      (item, index) => {
        return (
          <div className="open-ended-item" key={index} title={item}>
            <p>{item}</p>
          </div>
        );
      }
    );
  }
  return (
    <Fragment>
      <div className="qus-div">{props.slds[props.curSldIndex].qContent}</div>
      <div id="open-sld-content">{openEndedResContent}</div>
    </Fragment>
  );
};

const TagCloud = props => {
  let tagCloudContent = null;
  let tagResArray = Object.entries(props.slds[props.curSldIndex].tagRes);
  let cloudData = tagResArray.map(item => {
    return {text: item[0].toString(), value: item[1]};
  });
  let cloudOptions = {
    colors: colors,
    enableTooltip: true,
    deterministic: true,
    fontFamily: "Noto Sans TC",
    fontSizes: [20, 60],
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 1,
    rotations: 3,
    rotationAngles: [0, 0],
    scale: "log",
    spiral: "archimedean",
    transitionDuration: 1000
  };
  if (props.isFullscreen === true) {
    cloudOptions = {
      colors: colors,
      enableTooltip: true,
      deterministic: true,
      fontFamily: "Noto Sans TC",
      fontSizes: [30, 100],
      fontStyle: "normal",
      fontWeight: "normal",
      padding: 1,
      rotations: 3,
      rotationAngles: [0, 0],
      scale: "log",
      spiral: "archimedean",
      transitionDuration: 1000
    };
  }
  tagCloudContent = <ReactWordcloud options={cloudOptions} words={cloudData} />;
  return (
    <Fragment>
      <div className="qus-div">{props.slds[props.curSldIndex].qContent}</div>
      <div id="cloud-sld-content">{tagCloudContent}</div>
    </Fragment>
  );
};
