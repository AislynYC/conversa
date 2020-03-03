import React, {useEffect, useRef, Fragment, useState} from "react";
import {Router, Switch, Route, Link} from "react-router-dom";
import {useFirestore} from "react-redux-firebase";
import {createBrowserHistory} from "history";
import {FormattedMessage} from "react-intl";

import Loading from "../components/Loading/Loading";
import ProjNameEditor from "../components/ProjNameEditor/ProjNameEditor";
import "./sldEditor.css";
import ZhInput from "../components/ZhInput/ZhInput";
import Header from "../components/Header/Header";
import CurSld from "./CurSld";
import "../lib/icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

// Material UI
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CloseIcon from "@material-ui/icons/Close";
import SwitchBtn from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import {withStyles} from "@material-ui/core/styles";
const ResNumInput = withStyles({
  root: {
    width: "25%",
    margin: "5% 0",
    "& label.Mui-focused": {
      color: "rgba(75, 143, 107, 0.726)"
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#bbb"
      },
      "&.Mui-focused fieldset": {
        borderColor: "rgba(75, 143, 107, 0.726)"
      }
    }
  }
})(TextField);
const history = createBrowserHistory();

const SldEditor = props => {
  if (props.firestore === undefined) {
    return <Loading {...props} />;
  }
  if (props.auth.isLoaded === true && props.auth.isEmpty === true) {
    props.history.push("/");
  } else {
  }
  const db = useFirestore();
  const userId = props.userId;
  const projId = props.projId;

  const keydownHandler = e => {
    if (e.target.tagName !== "INPUT") {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        nextSld();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        lastSld();
      }
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

  useEffect(() => {
    let url = props.location.pathname;
    let urlSplitArr = url.split("/");
    // Each time enter this page, the UseEffect function will check the URL path
    if (/^\d{1,2}$/.test(urlSplitArr[urlSplitArr.length - 1])) {
      // if the URL path contained page number info, this will update the curSldIndex according to the URL path
      history.push(`${props.match.url}/${parseInt(urlSplitArr[urlSplitArr.length - 1])}`);
      db.collection("users")
        .doc(userId)
        .collection("projects")
        .doc(projId)
        .update({
          curSldIndex: parseInt(urlSplitArr[urlSplitArr.length - 1])
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
    document.addEventListener("keydown", keydownHandler);
    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  }, [keydownHandler]);

  const [previewClass, setPreviewClass] = useState("preview-container hide");
  const showPreview = () => {
    setPreviewClass("preview-container");
  };
  const hidePreview = () => {
    setPreviewClass("preview-container hide");
  };

  const [mobileControlClass, setMobileControlClass] = useState(
    "center-wrap mobile-control-panel"
  );
  const showMobileControl = () => {
    setMobileControlClass("center-wrap mobile-control-panel show");
  };

  const hideMobileControl = () => {
    setMobileControlClass("center-wrap mobile-control-panel");
  };

  return (
    <Fragment>
      <Header
        {...props}
        locale={props.locale}
        setLocale={props.setLocale}
        showPreview={showPreview}
      />
      <Router basename={process.env.PUBLIC_URL} history={history}>
        <div className="container">
          <div className="mobile-proj-name-editor">
            <ProjNameEditor {...props} proj={props.editProj} />
          </div>
          <div id="sld-selector">
            <SldsItems
              {...props}
              selectSld={selectSld}
              showMobileControl={showMobileControl}
            />
            <AddSldBtn {...props} selectSld={selectSld} />
          </div>
          <Switch>
            <SldPage
              {...props}
              isFullscreen={isFullscreen}
              nextSld={nextSld}
              mobileControlClass={mobileControlClass}
              hideMobileControl={hideMobileControl}
            />
          </Switch>
        </div>
        <DelSld {...props} selectSld={selectSld} />
      </Router>
      <div className={previewClass}>
        <FontAwesomeIcon
          icon={["fas", "times"]}
          id="preview-close-btn"
          onClick={hidePreview}
        />
        <CurSld {...props} isFullscreen={isFullscreen} nextSld={nextSld} />
      </div>
    </Fragment>
  );
};
export default SldEditor;

const SldsItems = props => {
  const db = useFirestore();
  const userId = props.userId;
  const projId = props.projId;
  let [hovered, setHovered] = useState(null);

  const copySld = index => {
    let newSld = {...props.slds[index]};
    let t = Date.now();
    newSld.id = t;
    newSld.lastEdited = t;
    newSld.result = props.slds[index].result.map(item => {
      if (item !== "") {
        item = "";
      }
      return item;
    });
    props.slds.splice(index + 1, 0, newSld);

    // console.log(props.slds[index], props.slds[index + 1]);
    db.collection("users")
      .doc(userId)
      .collection("projects")
      .doc(projId)
      .update({lastEdited: t, slds: props.slds})
      .then(() => {
        // Add a responded audi container to the new slide
        props.respondedAudi[t] = [];
        db.collection("invitation")
          .doc(projId)
          .update({respondedAudi: props.respondedAudi});
      });
  };

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

    let copyBtnClass = "sld-copy-btn hide-tool";
    let delBtnClass = "trash-bin sld-item-del hide-tool";
    if (index === hovered) {
      copyBtnClass = "sld-copy-btn";
      delBtnClass = "trash-bin sld-item-del";
    }

    let sldItemCover = null;
    if (item.sldType === "heading-page") {
      sldItemCover = (
        <div className="sld-item-content heading-render-container">
          <div className="sld-item-header">{item.heading}</div>
          {item.hasQRCode ? (
            <FontAwesomeIcon icon={["fas", "qrcode"]} className="sld-item-icon" />
          ) : null}
          <div className="sld-item-text">
            <FormattedMessage id="edit.heading-page" />
          </div>
        </div>
      );
    } else if (item.sldType === "multiple-choice") {
      sldItemCover = (
        <div className="sld-item-content">
          <div className="sld-item-header">{item.qContent}</div>
          <div className="sld-item-type">
            <FontAwesomeIcon
              icon={["far", "chart-bar"]}
              className="sld-item-icon"
              size="lg"
            />
            <div className="sld-item-text">
              <FormattedMessage id="edit.multiple-selection" />
            </div>
          </div>
        </div>
      );
    } else if (item.sldType === "open-ended") {
      sldItemCover = (
        <div className="sld-item-content">
          <div className="sld-item-header">{item.qContent}</div>
          <div className="sld-item-type">
            <FontAwesomeIcon
              icon={["far", "comment-dots"]}
              className="sld-item-icon"
              size="sm"
            />
            <div className="sld-item-text">
              <FormattedMessage id="edit.open-ended" />
            </div>
          </div>
        </div>
      );
    } else if (item.sldType === "tag-cloud") {
      sldItemCover = (
        <div className="sld-item-content">
          <div className="sld-item-header">{item.qContent}</div>
          <div className="sld-item-type">
            <FontAwesomeIcon icon={["fas", "cloud"]} className="sld-item-icon" />
            <div className="sld-item-text">
              <FormattedMessage id="edit.tag-cloud" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={sldClass}
        key={index}
        onMouseOver={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}>
        <div className="sld-item-title">
          <div>{index + 1}</div>
          <FontAwesomeIcon
            icon={["fas", "copy"]}
            className={copyBtnClass}
            onClick={() => copySld(index)}
          />
          <FontAwesomeIcon
            icon={["fas", "trash-alt"]}
            className={delBtnClass}
            onClick={() => props.showOverlay("confirmDel", index)}
          />
        </div>

        <Link to={path} className="sld-item-link">
          <div
            className="sld"
            onClick={() => {
              props.selectSld(index);
              props.showMobileControl();
            }}>
            {sldItemCover}
          </div>
        </Link>
      </div>
    );
  });
};

const SldPage = props => {
  return props.slds.map((sld, index) => {
    let path = null;
    index === 0
      ? (path = {exact: true, path: `${props.match.url}`})
      : (path = {path: `${props.match.url}/${index}`});

    let editor = null;
    if (sld.sldType === "multiple-choice") {
      editor = <MultiSelEditor {...props} sld={sld} sldIndex={index} />;
    } else if (sld.sldType === "heading-page") {
      editor = <HeadingSldEditor {...props} sld={sld} sldIndex={index} />;
    } else if (sld.sldType === "open-ended") {
      editor = <OpenEndedEditor {...props} sld={sld} sldIndex={index} />;
    } else if (sld.sldType === "tag-cloud") {
      editor = <TagCloudEditor {...props} sld={sld} sldIndex={index} />;
    }

    return (
      <Route {...path} key={index}>
        <div className={props.mobileControlClass}>
          <div className="center">
            <CurSld
              {...props}
              isFullscreen={props.isFullscreen}
              nextSld={props.nextSld}
            />
            <ControlPanel
              {...props}
              sld={sld}
              editor={editor}
              hideMobileControl={props.hideMobileControl}
            />
          </div>
        </div>
        {editor}
      </Route>
    );
  });
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
            sldType: "heading-page",
            opts: [""],
            resType: "bar-chart",
            result: [""],
            heading: "",
            subHeading: "",
            hasQRCode: false,
            openEndedRes: [],
            tagNum: 1,
            tagRes: {}
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
    <Button variant="contained" id="add-sld-btn" onClick={addSld}>
      <AddIcon />
      <FormattedMessage id="edit.add-sld" />
    </Button>
  );
};

const DelSld = props => {
  const db = useFirestore();

  const deleteSld = index => {
    // use splice to delete the slide of the index parameter
    if (props.slds.length > 1) {
      let newSelected = null;
      if (index === 0) {
        newSelected = 0;
      } else {
        newSelected = index - 1;
      }
      props.slds.splice(index, 1);
      db.collection("users")
        .doc(props.userId)
        .collection("projects")
        .doc(props.projId)
        .update({
          curSldIndex: newSelected,
          lastEdited: Date.now(),
          slds: props.slds
        })
        .then(() => {
          props.closeOverlay("confirmDel");
          // change selection focus to the last slide of the removed slide
          props.selectSld(newSelected);
        });
    } else {
      alert(
        "Your presentation shall have at least one slide. 您的簡報必須有至少一張投影片。"
      );
      props.closeOverlay("confirmDel");
    }
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

const MultiSelEditor = props => {
  const db = useFirestore();
  const userId = props.userId;
  const projId = props.projId;

  const changeDiagramType = e => {
    let newSlds = props.slds.map((sld, index) => {
      if (index === props.curSldIndex) {
        sld.lastEdited = Date.now();
        sld.resType = e.target.value;
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
      <div className="diagram-type-selector">
        <div className="diagram-label">
          <FormattedMessage id="edit.diagram-type" />
        </div>
        <form name="diagram-type-form" className="diagram-type-form">
          <label className="diagram-type-group">
            <input
              type="radio"
              name="diagram-type-group"
              value="bar-chart"
              checked={props.sld.resType === "bar-chart"}
              onChange={e => {
                changeDiagramType(e);
              }}
            />
            <div>
              <FontAwesomeIcon
                icon={["far", "chart-bar"]}
                className="diagram-type-icon"
              />
              <div>
                <FormattedMessage id="edit.bar-chart" />
              </div>
            </div>
          </label>
          <label className="diagram-type-group">
            <input
              type="radio"
              name="diagram-type-group"
              value="pie-chart"
              checked={props.sld.resType === "pie-chart"}
              onChange={e => {
                changeDiagramType(e);
              }}
            />
            <div>
              <FontAwesomeIcon
                icon={["fas", "chart-pie"]}
                className="diagram-type-icon"
              />
              <div>
                <FormattedMessage id="edit.pie-chart" />
              </div>
            </div>
          </label>
        </form>
      </div>
      <QusInput {...props} />
      <label htmlFor="opt-input" className="edit-panel-label">
        <div>
          <FormattedMessage id="edit.opt-label" />
          <span className="help-tip">
            <FontAwesomeIcon icon={["far", "question-circle"]} className="qus-icon" />
            <p>
              <FormattedMessage id="edit.multi-choice-opt-tip" />
            </p>
          </span>
        </div>
      </label>

      <div className="input-group">
        <OptInputs {...props} />
      </div>
      <AddOptBtn {...props} />
    </div>
  );
};

const OpenEndedEditor = props => {
  return (
    <div className="edit-panel">
      <QusInput {...props} />
    </div>
  );
};

const TagCloudEditor = props => {
  const db = useFirestore();
  const userId = props.userId;
  const projId = props.projId;

  const editTagNum = value => {
    let newSlds = props.slds.map((sld, index) => {
      if (index === props.sldIndex) {
        sld.lastEdited = Date.now();
        sld.tagNum = value;
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
      <QusInput {...props} />
      <label htmlFor="opt-input" className="edit-panel-label">
        <FormattedMessage id="edit.cloud-opt-label" />
      </label>
      <ResNumInput
        id="outlined-number"
        type="number"
        InputLabelProps={{
          shrink: true
        }}
        inputProps={{
          min: "1",
          max: "5"
        }}
        variant="outlined"
        value={props.sld.tagNum}
        onChange={e => editTagNum(e.target.value)}
      />
    </div>
  );
};

const QusInput = props => {
  const db = useFirestore();
  const userId = props.userId;
  const projId = props.projId;

  const editQus = (value, props) => {
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

  return (
    <div className="input-group">
      <label htmlFor="qus-input" id="qus-input-group">
        <div className="edit-panel-label">
          <FormattedMessage id="edit.qus-label" />
        </div>
        <FormattedMessage id="edit.qus-input-placeholder" defaultMessage="Question">
          {placeholder => (
            <ZhInput
              {...props}
              id="qus-input"
              maxLength="50"
              placeholder={placeholder}
              curValue={props.sld.qContent}
              useInnerValue={editQus}
            />
          )}
        </FormattedMessage>
      </label>
    </div>
  );
};

const OptInputs = props => {
  // Get current rendering length
  const optsLength = useRef(props.sld.opts.length);
  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    // If current rendering length is different with the length in db
    // then force input value update
    if (optsLength.current !== props.sld.opts.length) {
      setForceUpdate(true);
      // after force update, set the current rendering length with db length
      optsLength.current = props.sld.opts.length;
    } else {
      setForceUpdate(false);
    }
  });

  let optInputs = null;
  if (props.sld.opts !== "") {
    optInputs = props.sld.opts.map((opt, index) => {
      return (
        <OptInput
          {...props}
          key={index}
          opt={opt}
          optIndex={index}
          forceUpdate={forceUpdate}
        />
      );
    });
  }

  return <div id="opt-inputs">{optInputs}</div>;
};

const OptInput = props => {
  const db = useFirestore();
  const userId = props.userId;
  const projId = props.projId;

  const editOpt = (value, props) => {
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

  return (
    <div className="opt-input-group">
      <FormattedMessage id="edit.option-placeholder" defaultMessage="option">
        {placeholder => (
          <ZhInput
            {...props}
            id={"opt-input" + props.optIndex}
            placeholder={`${placeholder} ${props.optIndex + 1}`}
            curValue={props.opt}
            maxLength="28"
            useInnerValue={editOpt}
          />
        )}
      </FormattedMessage>
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
        if (sld.opts.length > 1) {
          sld.lastEdited = Date.now();
          sld.opts.splice(props.optIndex, 1);
          sld.result.splice(props.optIndex, 1);
        } else {
          alert(
            "Multiple-choice slide type shall have at least one option. 選擇題投影片類型必須有至少一個選項。"
          );
        }
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

  let curSldType = null;
  if (props.sld.sldType === "heading-page") {
    curSldType = <FormattedMessage id="edit.heading-page" />;
  } else if (props.sld.sldType === "multiple-choice") {
    curSldType = <FormattedMessage id="edit.multiple-choice" />;
  } else if (props.sld.sldType === "open-ended") {
    curSldType = <FormattedMessage id="edit.open-ended" />;
  } else if (props.sld.sldType === "tag-cloud") {
    curSldType = <FormattedMessage id="edit.tag-cloud" />;
  }

  const [sldTypeFormClass, setSldTypeFormClass] = useState("sld-type-form");
  const toggleSldTypeForm = () => {
    if (sldTypeFormClass === "sld-type-form") {
      setSldTypeFormClass("sld-type-form show");
    } else {
      setSldTypeFormClass("sld-type-form");
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  };
  return (
    <div className="control-panel">
      <Button variant="contained" id="finish-btn" onClick={props.hideMobileControl}>
        <FormattedMessage id="edit.finish-editing" />
      </Button>
      <div className="control-label">
        <FormattedMessage id="edit.sld-type" />
      </div>
      <div
        className="current-sld-type"
        onClick={() => {
          toggleSldTypeForm();
          toggleExpanded();
        }}>
        <FormattedMessage id="edit.current-sld-type" />
        <span>{curSldType}</span>
        <div>
          <FormattedMessage id="edit.expand-to-edit" />
          {isExpanded ? (
            <FontAwesomeIcon icon={["fas", "chevron-up"]} />
          ) : (
            <FontAwesomeIcon icon={["fas", "chevron-down"]} />
          )}
        </div>
      </div>
      <form name="sld-type-form" className={sldTypeFormClass}>
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
          <div className="sld-type-w-chart">
            <FontAwesomeIcon icon={["fas", "qrcode"]} className="sld-type-icon" />
            <div>
              <FormattedMessage id="edit.heading-page" />
            </div>
          </div>
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
          <div className="sld-type-w-chart">
            <FontAwesomeIcon icon={["far", "chart-bar"]} className="sld-type-icon" />
            <div>
              <FormattedMessage id="edit.multiple-choice" />
            </div>
          </div>
        </label>
        <label className="sld-type-group">
          <input
            type="radio"
            name="sld-type-group"
            value="open-ended"
            checked={props.sld.sldType === "open-ended"}
            onChange={e => {
              changeSldType(e);
            }}
          />
          <div className="sld-type-w-chart">
            <FontAwesomeIcon icon={["far", "comment-dots"]} className="sld-type-icon" />
            <div>
              <FormattedMessage id="edit.open-ended" />
            </div>
          </div>
        </label>
        <label className="sld-type-group">
          <input
            type="radio"
            name="sld-type-group"
            value="tag-cloud"
            checked={props.sld.sldType === "tag-cloud"}
            onChange={e => {
              changeSldType(e);
            }}
          />
          <div className="sld-type-w-chart">
            <FontAwesomeIcon icon={["fas", "cloud"]} className="sld-type-icon" />
            <div>
              <FormattedMessage id="edit.tag-cloud" />
            </div>
          </div>
        </label>
      </form>
      <div className="middle-editor">{props.editor}</div>
    </div>
  );
};

const HeadingSldEditor = props => {
  const db = useFirestore();
  const userId = props.userId;
  const projId = props.projId;

  const editHeading = (value, props) => {
    let newSlds = props.slds.map((sld, index) => {
      if (index === props.sldIndex) {
        sld.lastEdited = Date.now();
        sld.heading = value;
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

  const editSubHeading = (value, props) => {
    let newSlds = props.slds.map((sld, index) => {
      if (index === props.sldIndex) {
        sld.lastEdited = Date.now();
        sld.subHeading = value;
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

  const switchQRCode = () => {
    let newSlds = props.slds.map((sld, index) => {
      if (index === props.sldIndex) {
        sld.lastEdited = Date.now();
        if (sld.hasQRCode) {
          sld.hasQRCode = false;
        } else {
          sld.hasQRCode = true;
        }
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
        <div className="heading-label">
          <FormattedMessage id="edit.heading-label" />
        </div>
        <ZhInput
          {...props}
          id="heading-input"
          curValue={props.sld.heading}
          maxLength="50"
          useInnerValue={editHeading}
        />
      </label>
      <label htmlFor="QRCode-switch" id="hQRCode-switch-group">
        <div className="edit-panel-label">
          <FormattedMessage id="edit.QRCode-switch-label" />
          <span className="help-tip">
            <FontAwesomeIcon icon={["far", "question-circle"]} className="qus-icon" />
            <p>
              <FormattedMessage id="edit.QRCode-switch-tip" />
            </p>
          </span>
        </div>

        <SwitchBtn
          checked={props.sld.hasQRCode === true}
          onChange={switchQRCode}
          value={props.sld.hasQRCode}
          color="primary"
          inputProps={{"aria-label": "primary checkbox"}}
        />
      </label>
      {props.slds[props.curSldIndex].hasQRCode === false ? (
        <label htmlFor="heading-input" id="heading-input-group">
          <div className="edit-panel-label">
            <FormattedMessage id="edit.sub-heading-label" />
          </div>
          <ZhInput
            {...props}
            maxLength="20"
            id="sub-heading-input"
            curValue={props.sld.subHeading}
            useInnerValue={editSubHeading}
          />
        </label>
      ) : (
        ""
      )}
    </div>
  );
};
