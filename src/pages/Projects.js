import React, {Fragment, useState, useEffect} from "react";
import {FormattedMessage} from "react-intl";
import {useFirestore} from "react-redux-firebase";

import Header from "../containers/Header/Header";
import Loading from "../components/Loading/Loading";
import {writeDbUser, writeDbInvt} from "../lib/writeDb";
import ProjNameEditor from "../components/ProjNameEditor/ProjNameEditor";
import "./projects.css";

import "../lib/icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";

const ProjManager = props => {
  let userData = null;
  if (props.projects === undefined || props.auth === undefined) {
    return <Loading {...props} />;
  }
  if (props.auth.isLoaded === true && props.auth.isEmpty === true) {
    props.history.push("/");
  } else {
    // User is signed in.
    userData = {
      displayName: props.auth.displayName,
      email: props.auth.email
    };
  }

  return (
    <Fragment>
      <Header {...props} locale={props.locale} setLocale={props.setLocale} />
      <div className="container proj-container">
        <div className="proj-wrap">
          <ToolBar {...props} userData={userData} />
          <ProjList {...props} />
        </div>
      </div>
      <NewProj {...props} />
      <DelProj {...props} />
    </Fragment>
  );
};

export default ProjManager;

const ToolBar = props => {
  const newProjName = () => {
    props.showOverlay("newProj", null);
  };

  return (
    <div className="tool-bar">
      <Button variant="contained" onClick={newProjName} id="add-proj-btn">
        <AddIcon id="add-project-icon" />
        <div className="btn-text">
          <FormattedMessage id="projects.add-presentation" />
        </div>
      </Button>
      <span className="greeting-msg">
        {props.userData !== null
          ? props.userData.displayName !== null
            ? `${props.userData.displayName}`
            : `${props.userData.email}`
          : ""}

        <FormattedMessage id="projects.greeting" />
      </span>
    </div>
  );
};

const ProjList = props => {
  const handleEditTimeDesc = lastEdited => {
    const curTime = new Date();
    const editTime = new Date(lastEdited);
    const timeDiff = curTime.getTime() - editTime.getTime();

    const min = 60 * 1000;
    const hour = min * 60;
    const day = hour * 24;
    const week = day * 7;

    const weekPasted = Math.floor(timeDiff / week);
    const dayPasted = Math.floor(timeDiff / day);
    const hourPasted = Math.floor(timeDiff / hour);
    const minPasted = Math.floor(timeDiff / min);

    if (weekPasted > 0) {
      return new Date(lastEdited).toDateString();
    } else {
      if (dayPasted < 7 && dayPasted > 0) {
        return (
          <Fragment>
            {dayPasted} <FormattedMessage id="projects.days-ago" />
          </Fragment>
        );
      } else {
        if (hourPasted < 24 && hourPasted > 0) {
          return (
            <Fragment>
              {hourPasted} <FormattedMessage id="projects.hours-ago" />
            </Fragment>
          );
        } else {
          return (
            <Fragment>
              {minPasted} <FormattedMessage id="projects.mins-ago" />
            </Fragment>
          );
        }
      }
    }
  };

  // ordered by created time
  let orderedProjs = props.projects.sort((a, b) => {
    return b.created - a.created;
  });
  let projects =
    orderedProjs.length !== 0 ? (
      orderedProjs.map(proj => {
        let createdDate = new Date(proj.created).toDateString();
        let lastEditedDate = handleEditTimeDesc(proj.lastEdited);
        return (
          <ProjRow
            key={proj.id}
            {...props}
            proj={proj}
            createdDate={createdDate}
            lastEditedDate={lastEditedDate}
          />
        );
      })
    ) : (
      <h4>
        <FormattedMessage id="projects.no-project" />
      </h4>
    );

  return (
    <div id="proj-list-card">
      <div className="row row-header">
        <div className="col-name col-header">
          <FormattedMessage id="projects.presentation-name" />
        </div>
        <div className="col col-header">
          <FormattedMessage id="projects.presentation-created" />
        </div>
        <div className="col col-header">
          <FormattedMessage id="projects.presentation-last-edited" />
        </div>
        <div className="col col-header empty-col"></div>
      </div>
      <div className="proj-list">{projects}</div>
    </div>
  );
};

const ProjRow = props => {
  const db = useFirestore();
  const [moreToolClass, setMoreToolClass] = useState("more-tool-bar hide");
  const showMoreTool = () => {
    setMoreToolClass("more-tool-bar");
  };
  const hideMoreTool = () => {
    setMoreToolClass("more-tool-bar hide");
  };

  const copyProj = projId => {
    const t = Date.now();
    // deep copy the copy target object
    let copyTarget = JSON.parse(
      JSON.stringify(props.projects.find(proj => proj.id === projId))
    );
    copyTarget.created = t;
    copyTarget.lastEdited = t;
    copyTarget.curSldIndex = 0;
    delete copyTarget.id;

    let copyTag = null;
    props.locale.includes("zh") ? (copyTag = " - 複製") : (copyTag = " - copy");
    copyTarget.name = copyTarget.name + copyTag;

    copyTarget.slds.forEach(sld => {
      sld.result = sld.result.map(() => "");
      sld.openEndedRes = [];
      sld.tagRes = {};
    });

    writeDbUser(db, props.auth.uid, null, "addProjDoc", copyTarget, res => {
      const sldIdArray = copyTarget.slds.map(sld => sld.id);
      let RespondedAudiObj = {};
      sldIdArray.forEach(sldId => {
        RespondedAudiObj[sldId] = [];
      });

      writeDbInvt(
        db,
        res.id,
        "setInvtDoc",
        {
          owner: props.auth.uid,
          projId: res.id,
          reaction: {laugh: 0},
          respondedAudi: RespondedAudiObj,
          involvedAudi: []
        },
        null
      );
    });
  };

  return (
    <div className="row">
      <div className="col-name">
        <ProjNameEditor {...props} proj={props.proj} />
      </div>
      <div className="col">{props.createdDate}</div>
      <div className="col">{props.lastEditedDate}</div>
      <div className="col proj-tool-col">
        <FontAwesomeIcon
          icon={["fas", "copy"]}
          className="copy-btn"
          onClick={() => copyProj(props.proj.id)}
        />
        <FontAwesomeIcon
          icon={["fas", "trash-alt"]}
          className="trash-bin"
          onClick={() => props.showOverlay("confirmDel", props.proj.id)}
        />
      </div>
      <div className="more-col">
        <FontAwesomeIcon
          icon={["fas", "ellipsis-h"]}
          className="more-icon"
          onClick={showMoreTool}
        />
      </div>

      <div className={moreToolClass}>
        <FontAwesomeIcon
          icon={["fas", "copy"]}
          className="copy-btn"
          onClick={() => copyProj(props.proj.id)}
        />
        <FontAwesomeIcon
          icon={["fas", "trash-alt"]}
          className="trash-bin"
          onClick={() => props.showOverlay("confirmDel", props.proj.id)}
        />
        <FontAwesomeIcon
          icon={["fas", "times"]}
          className="more-close-icon"
          onClick={hideMoreTool}
        />
      </div>
    </div>
  );
};

const NewProj = props => {
  const db = useFirestore();
  const [newProjName, setNewProjName] = useState("");
  const handleChange = e => {
    setNewProjName(e.target.value);
  };

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  useEffect(() => {
    setIsSubmitDisabled(false);
  }, []);

  const submitNewProj = e => {
    setIsSubmitDisabled(true);
    addProj(e);
  };

  const addProj = e => {
    e.preventDefault();

    if (newProjName !== "" && newProjName !== " ") {
      const t = Date.now();
      writeDbUser(
        db,
        props.auth.uid,
        null,
        "addProjDoc",
        {
          name: newProjName,
          created: t,
          lastEdited: t,
          curSldIndex: 0,
          slds: [
            {
              heading: "",
              subHeading: "",
              hasQRCode: true,
              id: t,
              opts: [""],
              qContent: "",
              resType: "bar-chart",
              result: [""],
              sldType: "heading-page",
              openEndedRes: [],
              tagNum: 1,
              tagRes: {}
            }
          ]
        },
        res => {
          let initRespondedAudi = {};
          initRespondedAudi[t] = [];

          writeDbInvt(
            db,
            res.id,
            "setInvtDoc",
            {
              owner: props.auth.uid,
              projId: res.id,
              reaction: {laugh: 0},
              respondedAudi: initRespondedAudi,
              involvedAudi: []
            },
            () => {
              props.closeOverlay("newProj");
              setIsSubmitDisabled(false);
              setNewProjName("");
            }
          );
        }
      );
    }
  };

  if (props.isLoading === true) {
    return <Loading {...props} />;
  }

  return (
    <div className={props.newProjOverlayClass}>
      <Card id="new-proj-card">
        <CardContent>
          <div className="overlay-card-title">
            <FormattedMessage id="projects.create-new-project" />
            <CloseIcon className="closeX" onClick={() => props.closeOverlay("newProj")} />
          </div>

          <form name="new-proj" id="new-proj-form">
            <div>
              <FormattedMessage id="projects.new-project-label" />
            </div>
            <TextField
              required
              id="new-proj-name-input"
              type="text"
              value={newProjName}
              onChange={e => handleChange(e)}
            />
            <div id="create-proj-btns">
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitDisabled}
                id="new-proj-submit-btn"
                onClick={e => submitNewProj(e)}>
                <FormattedMessage id="projects.create-project-btn" />
              </Button>
              <Button
                variant="contained"
                id="new-proj-cancel-btn"
                disabled={isSubmitDisabled}
                onClick={() => {
                  props.closeOverlay("newProj");
                  setNewProjName("");
                }}>
                <FormattedMessage id="projects.cancel-new-project" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const DelProj = props => {
  const db = useFirestore();
  if (props.isLoading === true) {
    return <Loading {...props} />;
  }

  const deleteProj = () => {
    props.onLoading(true);

    writeDbUser(db, props.auth.uid, props.delProjId, "delProjDoc", null, () => {
      writeDbInvt(db, props.delProjId, "delInvtDoc", null, () => {
        props.onLoading(false);
        props.closeOverlay("confirmDel");
      });
    });
  };

  let [deletingProjName, setDeletingProjName] = useState(null);

  useEffect(() => {
    if (props.delProjId !== undefined && props.projects !== undefined) {
      let deletingProj = props.projects.find(proj => proj.id === props.delProjId);
      if (deletingProj !== undefined) {
        setDeletingProjName(deletingProj.name);
      }
    }
  }, [props.delProjId]);

  return (
    <div className={props.confirmDelOverlayClass}>
      <Card id="confirm-del-card">
        <CardContent>
          <div className="overlay-card-title">
            <FormattedMessage id="projects.confirm-del-proj" />
            <CloseIcon
              className="closeX"
              onClick={() => props.closeOverlay("confirmDel")}
            />
          </div>
          {props.delProjId !== undefined ? (
            <div className="deleting-proj-alert">
              <span>
                <FormattedMessage id="projects.del-proj-name" />
              </span>
              <span className="deleting-proj-name">{deletingProjName}</span>
            </div>
          ) : (
            <Fragment></Fragment>
          )}

          <div id="confirm-del-btns">
            <Button
              value="true"
              variant="contained"
              id="del-btn"
              onClick={() => deleteProj()}>
              <FormattedMessage id="projects.del-proj" />
            </Button>
            <Button
              value="false"
              variant="contained"
              id="cancel-del-btn"
              onClick={() => props.closeOverlay("confirmDel")}>
              <FormattedMessage id="projects.cancel-del-project" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
