import React, {useEffect, useRef, Fragment, useState} from "react";
import {Router, Switch, Route, Link} from "react-router-dom";
import {useFirestore} from "react-redux-firebase";
import {FormattedMessage} from "react-intl";
import ZhInput from "../components/ZhInput/ZhInput";

import "../lib/icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import AddIcon from "@material-ui/icons/Add";
import SwitchBtn from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
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

const EditPanel = props => {
  let editor = null;
  let sldType = props.sld.sldType;

  if (sldType === "multiple-choice") {
    editor = <MultiSelEditor {...props} />;
  } else if (sldType === "heading-page") {
    editor = <HeadingSldEditor {...props} />;
  } else if (sldType === "open-ended") {
    editor = <OpenEndedEditor {...props} />;
  } else if (sldType === "tag-cloud") {
    editor = <TagCloudEditor {...props} />;
  }
  return <Fragment>{editor}</Fragment>;
};

export default EditPanel;

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
