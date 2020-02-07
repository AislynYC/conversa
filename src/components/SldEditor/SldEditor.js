import React, {useEffect, useRef} from "react";
import {Router, Switch, Route, Link} from "react-router-dom";
import {useFirestore} from "react-redux-firebase";
import {createBrowserHistory} from "history";
import {FormattedMessage} from "react-intl";
import "./style.css";
const history = createBrowserHistory();

const SldEditor = props => {
  console.log("fir", props);
  const db = useFirestore();
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
        .doc("PLdhrvmiHZQJZVTsh9X0")
        .collection("projects")
        .doc("96vfuLFEfKavi0trtngb")
        .update({curSldIndex: selIndex})
        .then(() => {
          if (selIndex === 0) {
            history.push("/edit");
          } else {
            history.push(`/edit/${selIndex}`);
          }
        });
    }
  };

  const nextSld = (curSldIndex, sldsLength) => {
    if (curSldIndex < sldsLength - 1) {
      return db
        .collection("users")
        .doc("PLdhrvmiHZQJZVTsh9X0")
        .collection("projects")
        .doc("96vfuLFEfKavi0trtngb")
        .update({curSldIndex: curSldIndex + 1})
        .then(() => {
          if (!document.fullscreenElement) {
            history.push(`/edit/${curSldIndex + 1}`);
          }
        });
    }
  };

  const lastSld = curSldIndex => {
    if (curSldIndex > 0) {
      db.collection("users")
        .doc("PLdhrvmiHZQJZVTsh9X0")
        .collection("projects")
        .doc("96vfuLFEfKavi0trtngb")
        .update({curSldIndex: curSldIndex - 1})
        .then(() => {
          if (!document.fullscreenElement) {
            if (curSldIndex - 1 === 0) {
              history.push("/edit");
            } else {
              history.push(`/edit/${curSldIndex - 1}`);
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
    console.log("useEffect");
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [keyDownHandler]);

  useEffect(() => {
    const ifFullscreen = () => {
      if (document.fullscreenElement) {
        console.log("fullscreen In");
        document.addEventListener("click", fullScreenClicking);
      } else {
        console.log("fullscreen Out");
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
  console.log(props);
  if (!props.slds) {
    return <div>Loading</div>;
  }
  return props.slds.map((item, index) => {
    let path = null;
    let sldClass = null;
    index === 0
      ? (path = `${props.history.location.pathname}`)
      : (path = `${props.history.location.pathname}/${index}`);
    index === props.curSldIndex
      ? (sldClass = "sld-item sld-item-selected")
      : (sldClass = "sld-item");

    return (
      <div className={sldClass} key={index}>
        <div>{index + 1}</div>
        <Link to={path}>
          <div
            className="sld"
            onClick={() => {
              props.selectSld(index);
            }}>
            <div>{item.qContent}</div>
            <div>{item.opts}</div>
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
      ? (path = {exact: true, path: `${props.history.location.pathname}`})
      : (path = {path: `${props.history.location.pathname}/${index}`});

    return (
      <Route {...path} key={index}>
        <SldPageRoute {...props} sld={sld} />
        <QusForm {...props} sld={sld} sldIndex={index} />
      </Route>
    );
  });
};

const SldPageRoute = props => {
  let optionLi = props.slds[props.curSldIndex].opts.map((opt, index) => {
    return <li key={index}>{opt}</li>;
  });
  console.log(props.slds[props.curSldIndex].opts);
  return (
    <div className="center">
      <div id="current-sld-container">
        <div id="current-sld-border">
          <div id="current-sld">
            <div>{props.slds[props.curSldIndex].qContent}</div>
            <ul>{optionLi}</ul>
          </div>
        </div>
      </div>
      <div id="control-panel"></div>
    </div>
  );
};

const AddSldBtn = props => {
  const db = useFirestore();
  const addSld = () => {
    db.collection("users")
      .doc("PLdhrvmiHZQJZVTsh9X0")
      .collection("projects")
      .doc("96vfuLFEfKavi0trtngb")
      .update({
        lastEdited: Date.now(),
        slds: [
          ...props.slds,
          {
            id: Date.now(),
            qContent: "",
            qType: "",
            opts: "",
            resType: ""
          }
        ]
      })
      .then(() => {
        props.selectSld(props.slds.length);
      });
  };
  return (
    <button id="add-sld-btn" onClick={addSld}>
      <FormattedMessage id="app.add-sld" />
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
    <form id="qus-form">
      <QusInput {...props} />
      <label htmlFor="opt-input">
        <FormattedMessage id="app.opt-label" />
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
      .doc("PLdhrvmiHZQJZVTsh9X0")
      .collection("projects")
      .doc("96vfuLFEfKavi0trtngb")
      .update({
        lastEdited: Date.now(),
        slds: newSlds
      });
  };

  return (
    <div className="input-group">
      <label htmlFor="qus-input" id="qus-input-group">
        <FormattedMessage id="app.qus-label" />
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
  const editOpt = (e, optIndex) => {
    let newSlds = props.slds.map((sld, index) => {
      if (index === props.sldIndex) {
        sld.lastEdited = Date.now();
        sld.opts[optIndex] = e.target.value;
      }
      return sld;
    });

    db.collection("users")
      .doc("PLdhrvmiHZQJZVTsh9X0")
      .collection("projects")
      .doc("96vfuLFEfKavi0trtngb")
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
  const deleteOpt = () => {
    let newSlds = props.slds.map((sld, index) => {
      if (index === props.sldIndex) {
        sld.lastEdited = Date.now();
        sld.opts.splice(props.optIndex, 1);
      }
      return sld;
    });

    db.collection("users")
      .doc("PLdhrvmiHZQJZVTsh9X0")
      .collection("projects")
      .doc("96vfuLFEfKavi0trtngb")
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
  const addOption = e => {
    e.preventDefault();
    console.log(props.slds);

    let newSlds = props.slds.map((sld, index) => {
      if (index === props.sldIndex) {
        sld.lastEdited = Date.now();
        sld.opts !== "" ? sld.opts.push("") : (sld.opts = [""]);
      }
      return sld;
    });

    db.collection("users")
      .doc("PLdhrvmiHZQJZVTsh9X0")
      .collection("projects")
      .doc("96vfuLFEfKavi0trtngb")
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
      <FormattedMessage id="app.add-opt" />
    </button>
  );
};
