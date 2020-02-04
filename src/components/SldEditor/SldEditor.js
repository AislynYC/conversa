import React, {useEffect} from "react";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import {useFirestore} from "react-redux-firebase";
import "./style.css";
const SldEditor = props => {
  const keyDownHandler = e => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      nextSld(props.curSldIndex, props.slds.length);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      lastSld(props.curSldIndex);
    }
  };

  const fullScreenClicking = () => {
    nextSld(props.curSldIndex, props.slds.length);
  };

  const db = useFirestore();
  const selectSld = selIndex => {
    if (selIndex !== props.curSldIndex) {
      return db
        .collection("users")
        .doc("PLdhrvmiHZQJZVTsh9X0")
        .collection("projects")
        .doc("96vfuLFEfKavi0trtngb")
        .update({curSldIndex: selIndex});
    }
  };

  const nextSld = (curSldIndex, sldsLength) => {
    if (curSldIndex < sldsLength - 1) {
      return db
        .collection("users")
        .doc("PLdhrvmiHZQJZVTsh9X0")
        .collection("projects")
        .doc("96vfuLFEfKavi0trtngb")
        .update({curSldIndex: curSldIndex + 1});
    }
  };

  const lastSld = curSldIndex => {
    if (curSldIndex > 0) {
      return db
        .collection("users")
        .doc("PLdhrvmiHZQJZVTsh9X0")
        .collection("projects")
        .doc("96vfuLFEfKavi0trtngb")
        .update({curSldIndex: curSldIndex - 1});
    }
  };

  const ifFullscreen = () => {
    if (document.fullscreenElement) {
      document.addEventListener("click", fullScreenClicking);
    } else {
      document.removeEventListener("click", fullScreenClicking);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);
    // document.addEventListener("fullscreenchange", ifFullscreen);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      // document.removeEventListener("fullscreenchange", ifFullscreen);
    };
  }, [keyDownHandler]);

  // useEffect(() => {
  //   const ifFullscreen = () => {
  //     if (document.fullscreenElement) {
  //       document.addEventListener("click", fullScreenClicking);
  //     } else {
  //       document.removeEventListener("click", fullScreenClicking);
  //     }
  //   };
  //   document.addEventListener("fullscreenchange", ifFullscreen);

  //   return () => document.removeEventListener("fullscreenchange", ifFullscreen);
  // }, [ifFullscreen]);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="container">
        <div id="sld-selector">
          <SldsItems {...props} selectSld={selectSld} />
          <AddSldBtn {...props} />
        </div>
        <Switch>
          <SldPage {...props} />
        </Switch>
      </div>
    </Router>
  );
};

const SldsItems = props => {
  if (!props.slds) {
    return <div>Loading</div>;
  }
  return props.slds.map((item, index) => {
    let path = null;
    let sldClass = null;
    index === 0 ? (path = "/") : (path = "/" + item.id);
    index === props.curSldIndex
      ? (sldClass = "sld-item sld-item-selected")
      : (sldClass = "sld-item");

    return (
      <div className={sldClass} key={index + 1}>
        <div>{index + 1}</div>
        <Link to={path}>
          <div
            className="sld"
            onClick={() => {
              props.selectSld(index);
            }}>
            <div>{item.qContent}</div>
            <div>{item.resContent}</div>
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
  let curSldObj = props.slds[props.curSldIndex];

  return props.slds.map((sld, index) => {
    let path = null;
    index === 0 ? (path = {exact: true, path: "/"}) : (path = {path: "/" + sld.id});

    return (
      <Route {...path} key={sld.id}>
        <div className="center">
          <div id="current-sld-container">
            <div id="current-sld-border">
              <div id="current-sld">
                <div>{curSldObj.qContent}</div>
                <div>{curSldObj.resContent}</div>
              </div>
            </div>
          </div>
          <div id="content-editor"></div>
        </div>
        <div id="control-panel"></div>
      </Route>
    );
  });
};

const AddSldBtn = props => {
  const db = useFirestore();
  const addSld = () => {
    return db
      .collection("users")
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
            resContent: "",
            resType: ""
          }
        ]
      })
      .then(console.log("success"));
  };
  return (
    <button id="add-sld-btn" onClick={addSld}>
      Add Slide
    </button>
  );
};
export default SldEditor;
