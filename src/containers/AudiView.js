import React, {Fragment} from "react";
import {useFirestore} from "react-redux-firebase";
import {FormattedMessage} from "react-intl";

import "./AudiView.css";

const AudiView = props => {
  return (
    <Fragment>
      {props.curSldIndex === undefined ? <span>Loading</span> : <Poll {...props} />}
    </Fragment>
  );
};
export default AudiView;

const Poll = props => {
  const db = useFirestore();
  const respondPoll = e => {
    e.preventDefault();
    let newSlds = props.slds.map((sld, index) => {
      if (index === props.curSldIndex) {
        if (sld.result[props.selOptIndex] === "") {
          sld.result[props.selOptIndex] = 1;
        } else {
          sld.result[props.selOptIndex]++;
        }
      }
      return sld;
    });
    db.collection("users")
      .doc(props.userId)
      .collection("projects")
      .doc(props.projId)
      .update({slds: newSlds});
  };
  return (
    <div className="poll">
      <div>{props.slds[props.curSldIndex].qContent}</div>
      <form
        name="poll-form"
        id="poll-form"
        onSubmit={e => {
          respondPoll(e);
        }}>
        {props.slds[props.curSldIndex].opts.map((item, index) => (
          <label className="res-group" key={index}>
            <input
              type="radio"
              name="res-group"
              value={index}
              onChange={props.chooseOpt}
            />
            {item}
          </label>
        ))}
        <button className="submit-btn" type="submit">
          <FormattedMessage id="audi.submit" />
        </button>
      </form>
    </div>
  );
};
