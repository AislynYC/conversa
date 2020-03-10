import React, {Fragment, useState, useEffect} from "react";
import {FormattedMessage} from "react-intl";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Loading from "../Loading/Loading";
import colors from "../../lib/colors";
import "./curSld.css";

// for each slide types
import Chart from "react-google-charts";
import ReactWordcloud from "react-wordcloud";
import QRCode from "qrcode.react";

const CurSld = props => {
  let curSldType = props.slds[props.curSldIndex].sldType;
  let sldRespondedAudi = props.respondedAudi[props.slds[props.curSldIndex].id];
  let [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const monitorFullscreen = () => {
      if (document.fullscreenElement) {
        setIsFullscreen(true);
      } else {
        setIsFullscreen(false);
      }
    };

    document.addEventListener("fullscreenchange", monitorFullscreen);

    return () => {
      document.removeEventListener("fullscreenchange", monitorFullscreen);
    };
  });

  const clickFullscreen = () => {
    if (
      isFullscreen === true &&
      props.slds !== undefined &&
      props.curSldIndex !== undefined
    ) {
      props.switchNextSld();
    }
  };

  let sldContent = null;
  if (curSldType === "heading-page") {
    sldContent = <Headings {...props} isFullscreen={isFullscreen} />;
  } else if (curSldType === "multiple-choice") {
    sldContent = <MultiSel {...props} colors={colors} isFullscreen={isFullscreen} />;
  } else if (curSldType === "open-ended") {
    sldContent = <OpenEnded {...props} isFullscreen={isFullscreen} />;
  } else if (curSldType === "tag-cloud") {
    sldContent = <TagCloud {...props} isFullscreen={isFullscreen} />;
  }

  let handRaised = null;

  if (curSldType !== "heading-page") {
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
          <a className="prev" onClick={props.switchPrevSld}>
            &#10094;
          </a>
          <a className="next" onClick={props.switchNextSld}>
            &#10095;
          </a>
        </div>
      </div>
    </div>
  );
};

export default CurSld;

const Headings = props => {
  let curSld = props.slds[props.curSldIndex];
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
  if (curSld.hasQRCode) {
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
                "https://firebasestorage.googleapis.com/v0/b/conversa-a419b.appspot.com/o/logoC_nb.png?alt=media&token=444f79ff-ef6f-4bfd-a379-316da82b2be2",
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
    headingContainer = <div className="sub-heading-render">{curSld.subHeading}</div>;
  }
  const [reactionClass, setReactionClass] = useState("reaction-icon");
  useEffect(() => {
    setReactionClass("reaction-icon scale");
    const timer = setTimeout(() => {
      setReactionClass("reaction-icon");
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [props.reaction.laugh]);
  return (
    <div className="heading-render-container">
      <div className="heading-render">{curSld.heading}</div>
      <Fragment>{headingContainer}</Fragment>
      <div className="reaction-icons">
        <FontAwesomeIcon icon={["fas", "heart"]} className={reactionClass} />
        <span className="reaction-count">{props.reaction.laugh}</span>
      </div>
    </div>
  );
};

const MultiSel = props => {
  let curSld = props.slds[props.curSldIndex];
  let optsArray = curSld.opts;
  let resultArray = curSld.result;
  let resultType = curSld.resType;
  let optResult = null;
  let pieColors = null;

  // build color array structure for pie chart
  if (optsArray !== "") {
    pieColors = optsArray.map((opt, index) => {
      return {color: props.colors[index]};
    });
  }

  if (optsArray !== "") {
    optResult = optsArray.map((opt, index) => {
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

  let barVar = {
    height: "75%",
    hAxisFontSize: 18,
    annotationsFontSize: 18
  };

  let pieVar = {
    legendFontSize: 16,
    pieSliceFontSize: 16
  };

  if (props.isFullscreen === true) {
    barVar = {
      height: "70%",
      hAxisFontSize: 36,
      annotationsFontSize: 36
    };
    pieVar = {
      legendFontSize: 28,
      pieSliceFontSize: 36
    };
  }

  let barOptions = {
    legend: {position: "none"},
    height: "100%",
    chartArea: {width: "80%", height: barVar.height},
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
        fontSize: barVar.hAxisFontSize
      }
    },
    annotations: {
      textStyle: {
        fontSize: barVar.annotationsFontSize,
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
        fontSize: pieVar.legendFontSize
      }
    },
    pieSliceText: "value",
    pieSliceTextStyle: {
      color: "#333",
      fontSize: pieVar.pieSliceFontSize
    }
  };

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
          options={barOptions}
          loader={<Loading {...props} />}
        />
      );
    } else if (resultType === "pie-chart") {
      chart = (
        <Chart
          chartType="PieChart"
          width="100%"
          height="100%"
          data={data}
          options={pieOptions}
          loader={<Loading {...props} />}
        />
      );
    }
  }

  return (
    <Fragment>
      <div className="qus-div">{curSld.qContent}</div>
      {chart}
    </Fragment>
  );
};

const OpenEnded = props => {
  let curSld = props.slds[props.curSldIndex];
  let openEndedResContent = null;

  if (curSld.openEndedRes !== [] && curSld.openEndedRes !== undefined) {
    openEndedResContent = curSld.openEndedRes.map((item, index) => {
      return (
        <div className="open-ended-item" key={index} title={item}>
          <p>{item}</p>
        </div>
      );
    });
  }
  return (
    <Fragment>
      <div className="qus-div">{curSld.qContent}</div>
      <div id="open-sld-content">{openEndedResContent}</div>
    </Fragment>
  );
};

const TagCloud = props => {
  let curSld = props.slds[props.curSldIndex];
  let tagResArray = Object.entries(curSld.tagRes);
  let cloudData = tagResArray.map(item => {
    return {text: item[0].toString(), value: item[1]};
  });
  let cloudVar = {
    fontSizes: [20, 60]
  };
  if (props.isFullscreen) {
    cloudVar = {
      fontSizes: [30, 100]
    };
  }
  let cloudOptions = {
    colors: colors,
    enableTooltip: true,
    deterministic: true,
    fontFamily: "Noto Sans TC",
    fontSizes: cloudVar.fontSizes,
    fontStyle: "normal",
    fontWeight: "normal",
    padding: 1,
    rotations: 3,
    rotationAngles: [0, 0],
    scale: "log",
    spiral: "archimedean",
    transitionDuration: 1000
  };

  return (
    <Fragment>
      <div className="qus-div">{curSld.qContent}</div>
      <div id="cloud-sld-content">
        <ReactWordcloud options={cloudOptions} words={cloudData} />
      </div>
    </Fragment>
  );
};

export {Headings, MultiSel, OpenEnded, TagCloud};
