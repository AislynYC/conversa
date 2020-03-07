import React, {useState} from "react";
import {Link} from "react-router-dom";
import {useFirestore} from "react-redux-firebase";
import {FormattedMessage} from "react-intl";

import {writeDbUser, writeDbInvt} from "../../lib/writeDb";
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
  const db = useFirestore();
  const userId = props.userId;
  const projId = props.projId;
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
      sldItemCover = <HeadingCover {...props} sldItem={item} sldIndex={index} />;
    } else if (item.sldType === "multiple-choice") {
      sldItemCover = <MultiCover {...props} sldItem={item} sldIndex={index} />;
    } else if (item.sldType === "open-ended") {
      sldItemCover = <OpenCover {...props} sldItem={item} sldIndex={index} />;
    } else if (item.sldType === "tag-cloud") {
      sldItemCover = <CloudCover {...props} sldItem={item} sldIndex={index} />;
    }

    return (
      <div
        className={sldClass}
        key={index}
        onMouseEnter={() => setHovered(index)}
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