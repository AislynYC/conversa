import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {useFirestore} from "react-redux-firebase";
import {FormattedMessage} from "react-intl";

import {writeDbUser, writeDbInvt} from "../../lib/writeDb";
import Loading from "../../components/Loading/Loading";
import "../../lib/icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";

const SldSelector = props => {
  return (
    <div id="sld-selector">
      <SldsItems {...props} />
      <AddSldBtn {...props} />
    </div>
  );
};
export default SldSelector;

const SldsItems = props => {
  return props.slds.map((item, index) => {
    return <SldItem key={index} {...props} sldItem={item} sldIndex={index} />;
  });
};

const SldItem = props => {
  const db = useFirestore();
  const userId = props.userId;
  const projId = props.projId;
  let path = null;
  let sldClass = null;
  let [hovered, setHovered] = useState(null);

  const copySld = index => {
    let newSld = {...props.slds[index]};
    let t = Date.now();
    newSld.id = t;
    newSld.lastEdited = t;
    newSld.result = props.slds[index].result.map(item => (item = ""));
    newSld.openEndedRes = [];
    newSld.tagRes = {};
    props.slds.splice(index + 1, 0, newSld);

    writeDbUser(
      db,
      userId,
      projId,
      "updateProjDoc",
      {lastEdited: t, slds: props.slds},
      () => {
        // Add a responded audi container to the new slide
        props.respondedAudi[t] = [];
        writeDbInvt(
          db,
          projId,
          "updateInvtDoc",
          {respondedAudi: props.respondedAudi},
          null
        );
      }
    );
  };

  const moveUp = index => {
    let newSlds = props.slds.slice(0);
    let t = Date.now();
    if (index > 0) {
      let movingSld = newSlds.splice(index, 1)[0];
      newSlds.splice(index - 1, 0, movingSld);
      writeDbUser(
        db,
        userId,
        projId,
        "updateProjDoc",
        {lastEdited: t, slds: newSlds},
        null
      );
    }
  };
  const moveDown = index => {
    let newSlds = props.slds.slice(0);
    let t = Date.now();
    if (index < newSlds.length - 1) {
      let movingSld = newSlds.splice(index, 1)[0];
      newSlds.splice(index + 1, 0, movingSld);
      writeDbUser(
        db,
        userId,
        projId,
        "updateProjDoc",
        {lastEdited: t, slds: newSlds},
        null
      );
    }
  };

  // Compose path according to slide index
  props.sldIndex === 0
    ? (path = `${props.match.url}`)
    : (path = `${props.match.url}/${props.sldIndex}`);

  // Highlight current selected slide by different class name according to db curSldIndex
  if (props.sldIndex === parseInt(props.curSldIndex)) {
    sldClass = "sld-item sld-item-selected";
  } else {
    sldClass = "sld-item";
  }

  const [classes, setClasses] = useState({
    copyBtnClass: "sld-copy-btn hide-tool mobile-hide-tool",
    delBtnClass: "trash-bin sld-item-del hide-tool mobile-hide-tool",
    moveBtnClass: "sld-move-btn hide-tool mobile-hide-tool",
    emptyClass: "empty-tool-space"
  });

  useEffect(() => {
    if (props.sldIndex === hovered && window.innerWidth > 720) {
      setClasses({
        copyBtnClass: "sld-copy-btn",
        delBtnClass: "trash-bin sld-item-del",
        moveBtnClass: "sld-move-btn",
        emptyClass: "empty-tool-space hide-tool"
      });
    } else {
      setClasses({
        copyBtnClass: "sld-copy-btn hide-tool mobile-hide-tool",
        delBtnClass: "trash-bin sld-item-del hide-tool mobile-hide-tool",
        moveBtnClass: "sld-move-btn hide-tool mobile-hide-tool",
        emptyClass: "empty-tool-space"
      });
    }
  }, [hovered]);

  const toggleItemTool = () => {
    if (classes.emptyClass === "empty-tool-space") {
      setClasses({
        copyBtnClass: "sld-copy-btn",
        delBtnClass: "trash-bin sld-item-del",
        moveBtnClass: "sld-move-btn",
        emptyClass: "empty-tool-space hide-tool mobile-hide-tool"
      });
    } else {
      setClasses({
        copyBtnClass: "sld-copy-btn hide-tool mobile-hide-tool",
        delBtnClass: "trash-bin sld-item-del hide-tool mobile-hide-tool",
        moveBtnClass: "sld-move-btn hide-tool mobile-hide-tool",
        emptyClass: "empty-tool-space"
      });
    }
  };

  let sldItemCover = null;
  if (props.sldItem.sldType === "heading-page") {
    sldItemCover = <HeadingCover {...props} />;
  } else if (props.sldItem.sldType === "multiple-choice") {
    sldItemCover = <MultiCover {...props} />;
  } else if (props.sldItem.sldType === "open-ended") {
    sldItemCover = <OpenCover {...props} />;
  } else if (props.sldItem.sldType === "tag-cloud") {
    sldItemCover = <CloudCover {...props} />;
  }
  return (
    <div
      className={sldClass}
      key={props.sldIndex}
      onMouseEnter={() => setHovered(props.sldIndex)}
      onMouseLeave={() => setHovered(null)}>
      <div className="sld-item-title">
        <div>{props.sldIndex + 1}</div>
        <FontAwesomeIcon
          icon={["fas", "copy"]}
          className={classes.copyBtnClass}
          onClick={() => copySld(props.sldIndex)}
        />
        <FontAwesomeIcon
          icon={["fas", "trash-alt"]}
          className={classes.delBtnClass}
          onClick={() => props.showOverlay("confirmDel", props.sldIndex)}
        />
      </div>

      <Link to={path} className="sld-item-link">
        <div
          className="sld"
          onClick={() => {
            props.selectSld(props.sldIndex);
            props.showMobileControl();
          }}>
          {sldItemCover}
        </div>
      </Link>
      <div className={classes.emptyClass}></div>
      <div className="sld-item-tools">
        <FontAwesomeIcon
          icon={["fas", "wrench"]}
          className="item-tool-switch"
          onClick={toggleItemTool}
        />
        <FontAwesomeIcon
          icon={["fas", "long-arrow-alt-up"]}
          className={classes.moveBtnClass}
          onClick={() => moveUp(props.sldIndex)}
        />
        <FontAwesomeIcon
          icon={["fas", "long-arrow-alt-down"]}
          className={classes.moveBtnClass}
          onClick={() => moveDown(props.sldIndex)}
        />
      </div>
    </div>
  );
};

const AddSldBtn = props => {
  const db = useFirestore();
  const userId = props.userId;
  const projId = props.projId;
  const addSld = () => {
    const t = Date.now();
    writeDbUser(
      db,
      userId,
      projId,
      "updateProjDoc",
      {
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
      },
      () => {
        // change selection focus to the new created slide
        props.selectSld(props.slds.length);
        // Add a responded audi container to the new slide
        props.respondedAudi[t] = [];
        writeDbInvt(
          db,
          projId,
          "updateInvtDoc",
          {respondedAudi: props.respondedAudi},
          null
        );
      }
    );
  };
  return (
    <Button variant="contained" id="add-sld-btn" onClick={addSld}>
      <AddIcon />
      <FormattedMessage id="edit.add-sld" />
    </Button>
  );
};

const HeadingCover = props => {
  return (
    <div className="sld-item-content heading-render-container">
      <div className="sld-item-header">{props.sldItem.heading}</div>
      {props.sldItem.hasQRCode ? (
        <FontAwesomeIcon icon={["fas", "qrcode"]} className="sld-item-icon" />
      ) : null}
      <div className="sld-item-text">
        <FormattedMessage id="edit.heading-page" />
      </div>
    </div>
  );
};
const MultiCover = props => {
  return (
    <div className="sld-item-content">
      <div className="sld-item-header">{props.sldItem.qContent}</div>
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
};

const OpenCover = props => {
  return (
    <div className="sld-item-content">
      <div className="sld-item-header">{props.sldItem.qContent}</div>
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
};

const CloudCover = props => {
  return (
    <div className="sld-item-content">
      <div className="sld-item-header">{props.sldItem.qContent}</div>
      <div className="sld-item-type">
        <FontAwesomeIcon icon={["fas", "cloud"]} className="sld-item-icon" />
        <div className="sld-item-text">
          <FormattedMessage id="edit.tag-cloud" />
        </div>
      </div>
    </div>
  );
};
