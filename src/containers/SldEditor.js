import React, {useEffect, useRef, Fragment, useState} from "react";
import {Router, Switch, Route, Link} from "react-router-dom";
import {useFirestore} from "react-redux-firebase";
import {createBrowserHistory} from "history";
import {FormattedMessage} from "react-intl";
import Chart from "react-google-charts";
import {
  isChrome,
  isFirefox,
  isSafari,
  isIE,
  isEdge,
  isOpera
} from "../lib/BrowserDetection";
import QRCode from "qrcode.react";
import "./style.css";

// FontAwesome Setting
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faLaughSquint} from "@fortawesome/free-regular-svg-icons";
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {faCopy} from "@fortawesome/free-solid-svg-icons";
library.add(faLaughSquint, faTrashAlt, faCopy);

import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CloseIcon from "@material-ui/icons/Close";
const history = createBrowserHistory();

const SldEditor = props => {
  const db = useFirestore();

  const userId = props.userId;
  const projId = props.projId;

  const keyDownHandler = e => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      nextSld();
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      lastSld();
    }
  };

  const selectSld = selIndex => {
    if (selIndex !== props.curSldIndex) {
      return db
        .collection("users")
        .doc(userId)
        .collection("projects")
        .doc(projId)
        .update({curSldIndex: selIndex})
        .then(() => {
          if (selIndex === 0) {
            history.push(`${props.match.url}`);
          } else {
            history.push(`${props.match.url}/${selIndex}`);
          }
        });
    }
  };

  const nextSld = () => {
    if (props.curSldIndex < props.slds.length - 1) {
      return db
        .collection("users")
        .doc(userId)
        .collection("projects")
        .doc(projId)
        .update({curSldIndex: props.curSldIndex + 1})
        .then(() => {
          if (!document.fullscreenElement) {
            history.push(`${props.match.url}/${props.curSldIndex + 1}`);
          }
        });
    }
  };

  const lastSld = () => {
    if (props.curSldIndex > 0) {
      db.collection("users")
        .doc(userId)
        .collection("projects")
        .doc(projId)
        .update({curSldIndex: props.curSldIndex - 1})
        .then(() => {
          if (!document.fullscreenElement) {
            if (props.curSldIndex - 1 === 0) {
              history.push(`${props.match.url}`);
            } else {
              history.push(`${props.match.url}/${props.curSldIndex - 1}`);
            }
          }
        });
    }
  };

  const fullScreenClicking = () => {
    console.log("fullscreen Clicking", props.slds, props.curSldIndex);
    if (props.slds !== undefined && props.curSldIndex !== undefined) {
      nextSld();
    }
  };

  useEffect(() => {
    const ifFullscreen = () => {
      if (document.fullscreenElement) {
        document.addEventListener("click", fullScreenClicking);
      } else {
        document.removeEventListener("click", fullScreenClicking);
      }
    };
    document.addEventListener("fullscreenchange", ifFullscreen);

    return () => {
      document.removeEventListener("fullscreenchange", ifFullscreen);
      document.removeEventListener("click", fullScreenClicking);
    };
  });

  useEffect(() => {
    let url = props.match.url;
    // Each time enter this page, the UseEffect function will check the URL path

    if (/^[/]\d$/.test(url.substr(url.length - 2, 2))) {
      // if the URL path contained page number info, this will update the curSldIndex according to the URL path
      history.push(`${props.match.url}/${parseInt(url.charAt(url.length - 1))}`);
      db.collection("users")
        .doc(userId)
        .collection("projects")
        .doc(projId)
        .update({
          curSldIndex: parseInt(url.charAt(url.length - 1))
        });
    } else {
      // if the URL path does not contained page number info, this will update the curSldIndex to 0 (i.e. the first page)
      history.push(`${props.match.url}`);
      db.collection("users")
        .doc(userId)
        .collection("projects")
        .doc(projId)
        .update({
          curSldIndex: 0
        });
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [keyDownHandler]);

  return (
    <Router basename={process.env.PUBLIC_URL} history={history}>
      <div className="container">
        <div id="sld-selector">
          <SldsItems {...props} selectSld={selectSld} />
          <AddSldBtn {...props} selectSld={selectSld} />
        </div>
        <Switch>
          <SldPage {...props} />
        </Switch>
      </div>
      <DelSld {...props} selectSld={selectSld} />
    </Router>
  );
};
export default SldEditor;

const SldsItems = props => {
  const db = useFirestore();
  let [hovered, setHovered] = useState(null);

  if (!props.slds) {
    return <div>Loading</div>;
  }

  return props.slds.map((item, index) => {
    let path = null;
    let sldClass = null;

    // Compose path according to slide index
    index === 0 ? (path = `${props.match.url}`) : (path = `${props.match.url}/${index}`);

    // Highlight current selected slide by different class name according to db curSldIndex
    if (index === parseInt(props.curSldIndex)) {
      sldClass = "sld-item sld-item-selected";
    } else {
      sldClass = "sld-item";
    }

    let optionLi = null;
    if (item.opts) {
      optionLi = item.opts.map((opt, index) => {
        return <li key={index}>{opt}</li>;
      });
    }

    let copyBtnClass = "sld-copy-btn hide-tool";
    let delBtnClass = "trash-bin sld-item-del hide-tool";
    if (index === hovered) {
      copyBtnClass = "sld-copy-btn";
      delBtnClass = "trash-bin sld-item-del";
    }

    return (
      <div
        className={sldClass}
        key={index}
        onMouseOver={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}>
        <div className="sld-item-title">
          <div>{index + 1}</div>
          <FontAwesomeIcon icon={["fas", "copy"]} className={copyBtnClass} />
          <FontAwesomeIcon
            icon={["fas", "trash-alt"]}
            className={delBtnClass}
            onClick={() => props.showOverlay("confirmDel", index)}
          />
        </div>

        <Link to={path}>
          <div
            className="sld"
            onClick={() => {
              props.selectSld(index);
            }}>
            {item.sldType === "multiple-choice" ? (
              <div className="sld-item-content">
                <div className="qus-div">{item.qContent}</div>
                <ul className="opt-ul">{optionLi}</ul>
              </div>
            ) : (
              <div className="sld-item-content heading-render-container">
                <div className="heading-render">{item.heading}</div>
              </div>
            )}
          </div>
        </Link>
      </div>
    );
  });
};

const SldPage = props => {
  if (!props.slds) {
    return <div>Loading</div>;
  }

  return props.slds.map((sld, index) => {
    let path = null;
    index === 0
      ? (path = {exact: true, path: `${props.match.url}`})
      : (path = {path: `${props.match.url}/${index}`});

    return (
      <Route {...path} key={index}>
        <SldPageRoute {...props} sld={sld} />
        {sld.sldType === "multiple-choice" ? (
          <QusForm {...props} sld={sld} sldIndex={index} />
        ) : (
          <HeadingSld {...props} sld={sld} sldIndex={index} />
        )}
      </Route>
    );
  });
};

const SldPageRoute = props => {
  let optsArray = props.slds[props.curSldIndex].opts;
  let resultArray = props.slds[props.curSldIndex].result;
  let optResult = null;
  const colors = [
    "#00b894",
    "#ffeaa7",
    "#fab1a0",
    "#0984e3",
    "#00cec9",
    "#ff7675",
    "#6c5ce7",
    "#b2bec3",
    "#fd79a8",
    "#badc58",
    "#686de0",
    "#f0932b",
    "#22a6b3",
    "#f8c291",
    "#60a3bc",
    "#b71540",
    "#0a3d62",
    "#D6A2E8",
    "#1B9CFC",
    "#EAB543"
  ];

  if (optsArray !== "") {
    optResult = props.slds[props.curSldIndex].opts.map((opt, index) => {
      let result = resultArray[index] !== "" ? resultArray[index] : 0;
      return [`${opt}`, result, colors[index], result];
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

  let options = {
    legend: {position: "none"},
    chartArea: {width: "80%", height: "70%"},
    bar: {groupWidth: "68%"},
    animation: {
      duration: 1000,
      easing: "out"
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

  // To make sure the chart will be drawn only when there is an option exists
  let chart = null;
  if (optsArray !== "") {
    chart = (
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="100%"
        data={data}
        options={options}
      />
    );
  }
  return (
    <div className="center">
      <div id="current-sld-container">
        <div id="current-sld-border">
          <div id="current-sld">
            {props.slds[props.curSldIndex].sldType === "multiple-choice" ? (
              <Fragment>
                <div className="qus-div">{props.slds[props.curSldIndex].qContent}</div>
                {chart}
              </Fragment>
            ) : (
              <div className="heading-render-container">
                <div className="heading-render">
                  {props.slds[props.curSldIndex].heading}
                </div>
                <div className="qr-code">
                  <QRCode
                    value={`https://conversa-a419b.firebaseapp.com/audi/${props.projId}`}
                    size={250}
                  />
                </div>
                <div className="reaction-icons">
                  <FontAwesomeIcon icon={["far", "laugh-squint"]} />
                  <span className="reaction-count">{props.reaction.laugh}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ControlPanel {...props} />
    </div>
  );
};

const AddSldBtn = props => {
  const db = useFirestore();
  const userId = props.userId;
  const projId = props.projId;
  const addSld = () => {
    const t = Date.now();
    db.collection("users")
      .doc(userId)
      .collection("projects")
      .doc(projId)
      .update({
        lastEdited: t,
        slds: [
          ...props.slds,
          {
            id: t,
            qContent: "",
            sldType: "",
            opts: "",
            resType: "",
            result: "",
            heading: ""
          }
        ]
      })
      .then(() => {
        // change selection focus to the new created slide
        props.selectSld(props.slds.length);
        // Add a responded audi container to the new slide
        props.respondedAudi[t] = [];
        db.collection("invitation")
          .doc(projId)
          .update({respondedAudi: props.respondedAudi});
      });
  };
  return (
    <button id="add-sld-btn" onClick={addSld}>
      <FormattedMessage id="edit.add-sld" />
    </button>
  );
};

const DelSld = props => {
  const db = useFirestore();

  const deleteSld = index => {
    props.slds.splice(index, 1);

    db.collection("users")
      .doc(props.userId)
      .collection("projects")
      .doc(props.projId)
      .update({
        lastEdited: Date.now(),
        slds: props.slds
      })
      .then(() => {
        props.closeOverlay("confirmDel");
        // change selection focus to the last slide of the removed slide
        props.selectSld(index - 1);
      });
  };
  return (
    <div className={props.confirmDelOverlayClass}>
      <Card id="confirm-del">
        <CardContent>
          <div className="overlay-card-title">
            <FormattedMessage id="edit.confirm-del-sld" />
            <CloseIcon
              className="closeX"
              onClick={() => props.closeOverlay("confirmDel")}
            />
          </div>

          <div className="confirm-del-btns">
            <Button
              value="true"
              variant="contained"
              id="del-btn"
              onClick={() => deleteSld(props.delSldIndex)}>
              <FormattedMessage id="edit.del-sld" />
            </Button>
            <Button
              value="false"
              variant="contained"
              id="cancel-del-btn"
              onClick={() => props.closeOverlay("confirmDel")}>
              <FormattedMessage id="edit.cancel-del-sld" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Geneal Focus Back setting
const UseFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    htmlElRef.current.focus();
  };

  return [htmlElRef, setFocus];
};

const QusForm = props => {
  return (
    <form id="qus-form" className="edit-panel">
      <QusInput {...props} />
      <label htmlFor="opt-input">
        <FormattedMessage id="edit.opt-label" />
      </label>
      <div className="input-group">
        <OptInputs {...props} />
      </div>
      <AddOptBtn {...props} />
    </form>
  );
};

const QusInput = props => {
  const db = useFirestore();
  const userId = props.userId;
  const projId = props.projId;
  const [inputValue, setInputValue] = useState("");
  const [isOnComposition, setIsOnComposition] = useState(false);
  const [isInnerChangeFromOnChange, setIsInnerChangeFromOnChange] = useState(false);

  useEffect(() => {
    setInputValue(props.sld.qContent);
  }, []);

  const setInnerValue = (value, props) => {
    let newSlds = props.slds.map((sld, index) => {
      if (index === props.sldIndex) {
        sld.lastEdited = Date.now();
        sld.qContent = value;
      }
      return sld;
    });

    db.collection("users")
      .doc(userId)
      .collection("projects")
      .doc(projId)
      .update({
        lastEdited: Date.now(),
        slds: newSlds
      });
  };

  const handleChange = e => {
    // Flow check
    if (!(e.target instanceof HTMLInputElement)) return;

    if (isInnerChangeFromOnChange) {
      setInputValue(e.target.value);
      setInnerValue(e.target.value, props);
      setIsInnerChangeFromOnChange(false);
      return;
    }

    // when is on composition, change inputValue only
    // when not in composition change inputValue and innerValue both
    if (!isOnComposition) {
      setInputValue(e.target.value);
      setInnerValue(e.target.value, props);
    } else {
      setInputValue(e.target.value);
    }
  };

  const handleComposition = e => {
    // Flow check
    if (!(e.target instanceof HTMLInputElement)) return;

    if (e.type === "compositionend") {
      // Chrome is ok for only setState innerValue
      // Opera, IE and Edge is like Chrome
      if (isChrome || isIE || isEdge || isOpera) {
        setInnerValue(e.target.value, props);
      }

      // Firefox need to setState inputValue again...
      if (isFirefox) {
        setInputValue(e.target.value);
        setInnerValue(e.target.value, props);
      }

      // Safari think e.target.value in composition event is keyboard char,
      //  but it will fired another change after compositionend
      if (isSafari) {
        // do change in the next change event
        setIsInnerChangeFromOnChange(true);
      }
      setIsOnComposition(false);
    } else {
      setIsOnComposition(false);
    }
  };

  return (
    <div className="input-group">
      <label htmlFor="qus-input" id="qus-input-group">
        <FormattedMessage id="edit.qus-label" />
        <input
          type="text"
          id="qus-input"
          className="input"
          value={inputValue}
          onChange={e => handleChange(e)}
          onCompositionUpdate={e => handleComposition(e)}
          onCompositionEnd={e => handleComposition(e)}
          onCompositionStart={e => handleComposition(e)}
        />
      </label>
    </div>
  );
};

const OptInputs = props => {
  const db = useFirestore();
  const userId = props.userId;
  const projId = props.projId;
  const editOpt = (e, optIndex) => {
    let newSlds = props.slds.map((sld, index) => {
      if (index === props.sldIndex) {
        sld.lastEdited = Date.now();
        sld.opts[optIndex] = e.target.value;
      }
      return sld;
    });

    db.collection("users")
      .doc(userId)
      .collection("projects")
      .doc(projId)
      .update({
        lastEdited: Date.now(),
        slds: newSlds
      });
  };

  let optInputs = null;
  if (props.sld.opts !== "") {
    optInputs = props.sld.opts.map((opt, index) => {
      return (
        <OptInput {...props} key={index} opt={opt} optIndex={index} editOpt={editOpt} />
      );
    });
  }

  return <div id="opt-inputs">{optInputs}</div>;
};

const OptInput = props => {
  const db = useFirestore();
  const userId = props.userId;
  const projId = props.projId;
  const [inputValue, setInputValue] = useState("");
  const [isOnComposition, setIsOnComposition] = useState(false);
  const [isInnerChangeFromOnChange, setIsInnerChangeFromOnChange] = useState(false);

  useEffect(() => {
    setInputValue(props.opt);
  }, []);

  const setInnerValue = (value, props) => {
    let newSlds = props.slds.map((sld, index) => {
      if (index === props.sldIndex) {
        sld.lastEdited = Date.now();
        sld.opts[props.optIndex] = value;
      }
      return sld;
    });

    db.collection("users")
      .doc(userId)
      .collection("projects")
      .doc(projId)
      .update({
        lastEdited: Date.now(),
        slds: newSlds
      });
  };

  const handleChange = e => {
    // Flow check
    if (!(e.target instanceof HTMLInputElement)) return;

    if (isInnerChangeFromOnChange) {
      setInputValue(e.target.value);
      setInnerValue(e.target.value, props);
      setIsInnerChangeFromOnChange(false);
      return;
    }

    // when is on composition, change inputValue only
    // when not in composition change inputValue and innerValue both
    if (!isOnComposition) {
      setInputValue(e.target.value);
      setInnerValue(e.target.value, props);
    } else {
      setInputValue(e.target.value);
    }
  };

  const handleComposition = e => {
    // Flow check
    if (!(e.target instanceof HTMLInputElement)) return;

    if (e.type === "compositionend") {
      // Chrome is ok for only setState innerValue
      // Opera, IE and Edge is like Chrome
      if (isChrome || isIE || isEdge || isOpera) {
        setInnerValue(e.target.value, props);
      }

      // Firefox need to setState inputValue again...
      if (isFirefox) {
        setInputValue(e.target.value);
        setInnerValue(e.target.value, props);
      }

      // Safari think e.target.value in composition event is keyboard char,
      //  but it will fired another change after compositionend
      if (isSafari) {
        // do change in the next change event
        setIsInnerChangeFromOnChange(true);
      }
      setIsOnComposition(false);
    } else {
      setIsOnComposition(false);
    }
  };
  return (
    <div className="opt-input-group">
      <input
        type="text"
        id={"opt-input" + props.optIndex}
        className="opt-input input"
        value={inputValue}
        onChange={e => handleChange(e)}
        onCompositionUpdate={e => handleComposition(e)}
        onCompositionEnd={e => handleComposition(e)}
        onCompositionStart={e => handleComposition(e)}
      />
      <DelOptBtn {...props} optIndex={props.optIndex} />
    </div>
  );
};

const DelOptBtn = props => {
  const db = useFirestore();
  const userId = props.userId;
  const projId = props.projId;
  const deleteOpt = () => {
    let newSlds = props.slds.map((sld, index) => {
      if (index === props.sldIndex) {
        sld.lastEdited = Date.now();
        sld.opts.splice(props.optIndex, 1);
        sld.result.splice(props.optIndex, 1);
      }
      return sld;
    });

    db.collection("users")
      .doc(userId)
      .collection("projects")
      .doc(projId)
      .update({
        lastEdited: Date.now(),
        slds: newSlds
      });
  };
  return (
    <div className="delete-opt-btn" onClick={deleteOpt}>
      ✖
    </div>
  );
};

const AddOptBtn = props => {
  const db = useFirestore();
  const userId = props.userId;
  const projId = props.projId;
  const addOption = e => {
    e.preventDefault();

    let newSlds = props.slds.map((sld, index) => {
      if (index === props.sldIndex) {
        sld.lastEdited = Date.now();
        sld.opts !== "" ? sld.opts.push("") : (sld.opts = [""]);
        sld.result !== "" ? sld.result.push("") : (sld.result = [""]);
      }
      return sld;
    });

    db.collection("users")
      .doc(userId)
      .collection("projects")
      .doc(projId)
      .update({
        lastEdited: Date.now(),
        slds: newSlds
      });
  };

  return (
    <Button
      id="add-opt-btn"
      onClick={e => {
        addOption(e);
      }}>
      <AddIcon />
      <FormattedMessage id="edit.add-opt" />
    </Button>
  );
};

const ControlPanel = props => {
  const db = useFirestore();
  const userId = props.userId;
  const projId = props.projId;
  const changeSldType = e => {
    let newSlds = props.slds.map((sld, index) => {
      if (index === props.curSldIndex) {
        sld.lastEdited = Date.now();
        sld.sldType = e.target.value;
      }
      return sld;
    });

    db.collection("users")
      .doc(userId)
      .collection("projects")
      .doc(projId)
      .update({
        lastEdited: Date.now(),
        slds: newSlds
      });
  };

  return (
    <div id="control-panel">
      <div className="control-label">
        <FormattedMessage id="edit.sld-type" />
      </div>
      <form name="sld-type-form" id="sld-type-form">
        <label className="sld-type-group">
          <input
            type="radio"
            name="sld-type-group"
            value="heading-page"
            checked={props.sld.sldType === "heading-page"}
            onChange={e => {
              changeSldType(e);
            }}
          />
          <FormattedMessage id="edit.heading-page" />
        </label>
        <label className="sld-type-group">
          <input
            type="radio"
            name="sld-type-group"
            value="multiple-choice"
            checked={props.sld.sldType === "multiple-choice"}
            onChange={e => {
              changeSldType(e);
            }}
          />
          <FormattedMessage id="edit.multiple-choice" />
        </label>
      </form>
    </div>
  );
};

const HeadingSld = props => {
  const db = useFirestore();
  const userId = props.userId;
  const projId = props.projId;
  const [inputRefHeading, setInputHeadingFocus] = UseFocus();
  useEffect(() => {
    setInputHeadingFocus();
  }, [props.sld.heading]);

  const editHeading = (e, props) => {
    let newSlds = props.slds.map((sld, index) => {
      if (index === props.sldIndex) {
        sld.lastEdited = Date.now();
        sld.heading = e.target.value;
      }
      return sld;
    });

    db.collection("users")
      .doc(userId)
      .collection("projects")
      .doc(projId)
      .update({
        lastEdited: Date.now(),
        slds: newSlds
      });
  };
  return (
    <div className="edit-panel">
      <label htmlFor="heading-input" id="heading-input-group">
        <FormattedMessage id="edit.heading-label" />
        <input
          type="text"
          id="heading-input"
          className="input"
          ref={inputRefHeading}
          value={props.sld.heading}
          onChange={e => {
            editHeading(e, props);
          }}
        />
      </label>
    </div>
  );
};
