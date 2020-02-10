import React, {useEffect, useRef, Fragment} from "react";
import {Router, Switch, Route, Link} from "react-router-dom";
import {useFirestore} from "react-redux-firebase";
import {createBrowserHistory} from "history";
import {FormattedMessage} from "react-intl";

import "./sldEditor.css";

// FontAwesome Setting
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faLaughSquint} from "@fortawesome/free-regular-svg-icons";
library.add(faLaughSquint);

const history = createBrowserHistory();

const SldEditor = props => {
  const db = useFirestore();
  const userId = props.match.params.userId;
  const projId = props.match.params.projId;
  const keyDownHandler = e => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      nextSld(props.curSldIndex, props.slds.length);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      lastSld(props.curSldIndex);
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

  const nextSld = (curSldIndex, sldsLength) => {
    if (curSldIndex < sldsLength - 1) {
      return db
        .collection("users")
        .doc(userId)
        .collection("projects")
        .doc(projId)
        .update({curSldIndex: curSldIndex + 1})
        .then(() => {
          if (!document.fullscreenElement) {
            history.push(`${props.match.url}/${curSldIndex + 1}`);
          }
        });
    }
  };

  const lastSld = curSldIndex => {
    if (curSldIndex > 0) {
      db.collection("users")
        .doc(userId)
        .collection("projects")
        .doc(projId)
        .update({curSldIndex: curSldIndex - 1})
        .then(() => {
          if (!document.fullscreenElement) {
            if (curSldIndex - 1 === 0) {
              history.push(`${props.match.url}`);
            } else {
              history.push(`${props.match.url}/${curSldIndex - 1}`);
            }
          }
        });
    }
  };

  const fullScreenClicking = () => {
    nextSld(props.curSldIndex, props.slds.length);
  };

  const ifFullscreen = () => {
    if (document.fullscreenElement) {
      document.addEventListener("click", fullScreenClicking);
    } else {
      document.removeEventListener("click", fullScreenClicking);
    }
  };

  useEffect(() => {
    // console.log("useEffect");
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [keyDownHandler]);

  useEffect(() => {
    const ifFullscreen = () => {
      if (document.fullscreenElement) {
        // console.log("fullscreen In");
        document.addEventListener("click", fullScreenClicking);
      } else {
        // console.log("fullscreen Out");
      }
    };
    document.addEventListener("fullscreenchange", ifFullscreen);

    return () => {
      document.removeEventListener("fullscreenchange", ifFullscreen);
      document.removeEventListener("click", fullScreenClicking);
    };
  }, [fullScreenClicking]);

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
    </Router>
  );
};
export default SldEditor;

const SldsItems = props => {
  if (!props.slds) {
    return <div>Loading</div>;
  }
  return props.slds.map((item, index) => {
    let path = null;
    let sldClass = null;
    index === 0 ? (path = `${props.match.url}`) : (path = `${props.match.url}/${index}`);
    index === props.curSldIndex
      ? (sldClass = "sld-item sld-item-selected")
      : (sldClass = "sld-item");
    let optionLi = null;
    if (item.opts) {
      optionLi = item.opts.map((opt, index) => {
        return <li key={index}>{opt}</li>;
      });
    }

    return (
      <div className={sldClass} key={index}>
        <div>{index + 1}</div>
        <Link to={path}>
          <div
            className="sld"
            onClick={() => {
              props.selectSld(index);
            }}>
            {item.sldType === "multiple-choice" ? (
              <Fragment>
                <div className="qus-div">{item.qContent}</div>
                <ul className="opt-ul">{optionLi}</ul>
              </Fragment>
            ) : (
              <div className="heading-container">
                <div className="heading">{item.heading}</div>
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
  let resultArray = props.sld.result;
  let optionLi = null;
  if (optsArray) {
    optionLi = props.slds[props.curSldIndex].opts.map((opt, index) => {
      return (
        <li key={index}>
          {opt}
          <span className="result">
            {resultArray[index] !== "" ? resultArray[index] : 0}
          </span>
        </li>
      );
    });
  }

  return (
    <div className="center">
      <div id="current-sld-container">
        <div id="current-sld-border">
          <div id="current-sld">
            {props.sld.sldType === "multiple-choice" ? (
              <Fragment>
                <div className="qus-div">{props.slds[props.curSldIndex].qContent}</div>
                <ul className="opt-ul">{optionLi}</ul>
              </Fragment>
            ) : (
              <div className="heading-container">
                <div className="heading">{props.sld.heading}</div>
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
  const userId = props.match.params.userId;
  const projId = props.match.params.projId;
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
        props.selectSld(props.slds.length);
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
  const userId = props.match.params.userId;
  const projId = props.match.params.projId;
  const [input1Ref, setInput1Focus] = UseFocus();
  useEffect(() => {
    setInput1Focus();
  }, [props.sld.qContent]);

  const editQus = (e, props) => {
    let newSlds = props.slds.map((sld, index) => {
      if (index === props.sldIndex) {
        sld.lastEdited = Date.now();
        sld.qContent = e.target.value;
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
        <FormattedMessage id="edit.qus-label" />
        <input
          type="text"
          id="qus-input"
          className="input"
          ref={input1Ref}
          value={props.sld.qContent}
          onChange={e => {
            editQus(e, props);
          }}
        />
      </label>
    </div>
  );
};

const OptInputs = props => {
  const db = useFirestore();
  const userId = props.match.params.userId;
  const projId = props.match.params.projId;
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
  const [inputRef, setInputFocus] = UseFocus();
  let optValue = props.opt;
  useEffect(() => {
    setInputFocus();
  }, [optValue]);
  return (
    <div className="opt-input-group">
      <input
        type="text"
        id={"opt-input" + props.optIndex}
        className="opt-input input"
        ref={inputRef}
        value={optValue}
        onChange={e => {
          props.editOpt(e, props.optIndex);
        }}
      />
      <DelOptBtn {...props} optIndex={props.optIndex} />
    </div>
  );
};

const DelOptBtn = props => {
  const db = useFirestore();
  const userId = props.match.params.userId;
  const projId = props.match.params.projId;
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
  const userId = props.match.params.userId;
  const projId = props.match.params.projId;
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
    <button
      onClick={e => {
        addOption(e);
      }}>
      <FormattedMessage id="edit.add-opt" />
    </button>
  );
};

const ControlPanel = props => {
  const db = useFirestore();
  const userId = props.match.params.userId;
  const projId = props.match.params.projId;
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
  const userId = props.match.params.userId;
  const projId = props.match.params.projId;
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
