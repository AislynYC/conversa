import React, {useState} from "react";
import {useFirestore} from "react-redux-firebase";
import {FormattedMessage} from "react-intl";

import {writeDbUser} from "../../lib/writeDb";

import "../../lib/icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Button from "@material-ui/core/Button";

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

    writeDbUser(
      db,
      userId,
      projId,
      "updateProjDoc",
      {lastEdited: Date.now(), slds: newSlds},
      null
    );
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

export default ControlPanel;
