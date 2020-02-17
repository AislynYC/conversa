import React, {Fragment, useState} from "react";
import {FormattedMessage} from "react-intl";
import {useFirestore} from "react-redux-firebase";
import {Link} from "react-router-dom";

import Header from "./components/Header/Header";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";

// FontAwesome Setting
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";
library.add(faTrashAlt);

import "./reset.css";
import "./style.css";

const ProjManager = props => {
  console.log(props);

  if (props.auth === undefined) {
    return <div>Loading</div>;
  }
  if (props.auth.isLoaded === false) {
  } else if (props.auth.isLoaded === true && props.auth.isEmpty === true) {
    console.log("No user", props.auth);
  } else {
  }

  return (
    <Fragment>
      <Header {...props} locale={props.locale} setLocale={props.setLocale} />
      <div className="container">
        <div className="proj-wrap">
          <ToolBar {...props} />
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
      <Button variant="contained" onClick={newProjName}>
        <AddIcon />
        <FormattedMessage id="projects.add-presentation" />
      </Button>
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
      return new Date(proj.lastEdited).toDateString();
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

  let projects = props.projects.map(proj => {
    let createdDate = new Date(proj.created).toDateString();
    let lastEditedDate = handleEditTimeDesc(proj.lastEdited);
    return (
      <div className="row" key={proj.id}>
        <div className="col">
          <Link to={`/edit/${props.auth.uid}/${proj.id}`} className="project-name">
            {proj.name}
          </Link>
        </div>
        <div className="col">{createdDate}</div>
        <div className="col">{lastEditedDate}</div>
        <div className="col proj-tool-col">
          <FontAwesomeIcon
            icon={["fas", "trash-alt"]}
            className="trash-bin"
            onClick={() => props.showOverlay("confirmDel", proj.id)}
          />
        </div>
      </div>
    );
  });

  return (
    <Card id="proj-list-card">
      <CardContent>
        <div className="row">
          <div className="col col-header">
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
      </CardContent>
    </Card>
  );
};

const NewProj = props => {
  const db = useFirestore();
  const [newProjName, setNewProjName] = useState("");
  const handleChange = e => {
    setNewProjName(e.target.value);
  };

  const addProj = e => {
    e.preventDefault();

    if (newProjName !== "" && newProjName !== " ") {
      db.collection("users")
        .doc(props.auth.uid)
        .collection("projects")
        .add({
          name: newProjName,
          created: Date.now(),
          lastEdited: Date.now(),
          curSldIndex: 0,
          slds: [
            {
              heading: "",
              id: Date.now(),
              opts: "",
              qContent: "",
              resType: "",
              result: "",
              sldType: "heading-page"
            }
          ]
        })
        .then(res => {
          db.collection("invitation")
            .doc(res.id)
            .set({
              owner: props.auth.uid,
              projId: res.id,
              reaction: {laugh: 0},
              respondedAudi: {}
            })
            .then(() => props.closeOverlay("newProj"));
        });
    }
  };

  if (props.isLoading === true) {
    return <div>Loading</div>;
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
                id="new-proj-submit-btn"
                onClick={e => addProj(e)}>
                <FormattedMessage id="projects.create-project-btn" />
              </Button>
              <Button
                variant="contained"
                id="new-proj-cancel-btn"
                onClick={() => props.closeOverlay("newProj")}>
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
    return <div>Loading</div>;
  }

  const deleteProj = () => {
    props.onLoading(true);
    db.collection("users")
      .doc(props.auth.uid)
      .collection("projects")
      .doc(props.delProjId)
      .delete()
      .then(() => {
        db.collection("invitation")
          .doc(props.delProjId)
          .delete()
          .then(() => {
            props.onLoading(false);
            props.closeOverlay("confirmDel");
          });
      });
  };
  return (
    <div className={props.confirmDelOverlayClass}>
      <Card id="confirm-del">
        <CardContent>
          <div className="overlay-card-title">
            <FormattedMessage id="projects.confirm-del-proj" />
            <CloseIcon
              className="closeX"
              onClick={() => props.closeOverlay("confirmDel")}
            />
          </div>

          <div id="confirm-del-btns">
            <Button
              value="true"
              variant="contained"
              id="del-btn"
              onClick={e => deleteProj(e)}>
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
