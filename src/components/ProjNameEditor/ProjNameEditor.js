import React, {Fragment, useState} from "react";
import {FormattedMessage} from "react-intl";
import {Link} from "react-router-dom";
import {useFirestore} from "react-redux-firebase";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faPencilAlt} from "@fortawesome/free-solid-svg-icons";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
library.add(faPencilAlt, faCheck, faTimes);

import Input from "@material-ui/core/Input";
import {withStyles} from "@material-ui/core/styles";
const EditInput = withStyles({
  root: {
    width: "90%"
  }
})(Input);

const ProjNameEditor = props => {
  const db = useFirestore();
  const [isEditing, setIsEditing] = useState(false);
  const [editProjId, setEditProjId] = useState(null);
  const [editInput, setEditInput] = useState("");
  const openEditField = projId => {
    let editingProjObj = null;
    if (props.match.url.includes("/pm/")) {
      editingProjObj = props.projects.find(proj => proj.id === projId.toString());
    } else {
      editingProjObj = props.proj;
    }
    setIsEditing(true);
    setEditProjId(projId);
    setEditInput(editingProjObj.name);
  };

  const handleChange = e => {
    setEditInput(e.target.value);
  };

  const editProjName = () => {
    if (editInput !== "") {
      db.collection("users")
        .doc(props.auth.uid)
        .collection("projects")
        .doc(editProjId)
        .update({
          lastEdited: Date.now(),
          name: editInput
        })
        .then(() => {
          setIsEditing(false);
        });
    } else {
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  let projName = null;

  console.log(props.proj);
  if (props.match.url.includes("/pm/")) {
    projName = (
      <Link to={`/edit/${props.auth.uid}/${props.proj.id}`} className="project-name">
        {props.proj.name}
      </Link>
    );
  } else {
    projName = <div className="sldEditor-proj-name">{props.proj.name}</div>;
  }

  return (
    <Fragment>
      {isEditing && editProjId === props.proj.id ? (
        <div className="proj-name-edit-wrap">
          <FormattedMessage id="projects.edit-proj-name">
            {placeholder => (
              <EditInput
                id="edit-input"
                value={editInput}
                placeholder={placeholder}
                inputProps={{"aria-label": "description"}}
                onChange={e => handleChange(e)}
              />
            )}
          </FormattedMessage>

          <FontAwesomeIcon
            icon={["fas", "check"]}
            className="check-icon"
            onClick={editProjName}
          />
          <FontAwesomeIcon
            icon={["fas", "times"]}
            className="cancel-icon"
            onClick={cancelEdit}
          />
        </div>
      ) : (
        <div className="proj-name-edit-wrap">
          {projName}
          <FontAwesomeIcon
            icon={["fas", "pencil-alt"]}
            className="edit-icon"
            onClick={() => openEditField(props.proj.id)}
          />
        </div>
      )}
    </Fragment>
  );
};

export default ProjNameEditor;