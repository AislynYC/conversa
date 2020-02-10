import React, {Fragment, useEffect} from "react";
import {useFirestore} from "react-redux-firebase";
import {FormattedMessage} from "react-intl";

import "./AudiView.css";

const AudiView = props => {
  console.log(props);
  //get uuid
  const _uuid = () => {
    let d = Date.now();
    if (typeof performance !== "undefined" && typeof performance.now === "function") {
      d += performance.now(); //use high-precision timer if available
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  };

  useEffect(() => {
    if (!localStorage.getItem("audiId")) {
      localStorage.setItem("audiId", _uuid());
    }
    props.getAudiId();
  }, []);

  return (
    <Fragment>
      {props.curSldIndex === undefined ? <span>Loading</span> : <Poll {...props} />}
    </Fragment>
  );
};
export default AudiView;

const Poll = props => {
  console.log(props.respondedAudi, props.slds, props.curSldIndex);
  const db = useFirestore();

  // useEffect(() => {
  // if (!props.respondedAudi) {
  //   console.log("ya");
  //   let newResObj = {};
  //   let sldsIdArray = props.slds.map(sld => sld.id);
  //   for (i = 0; i < sldsIdArray.length; i++) {
  //     return (newResObj.sldsIdArray[i] = []);
  //   }
  //   db.collection("invitation")
  //     .doc(props.projId)
  //     .update({respondedAudi: newResObj});
  // }
  //   if (props.respondedAudi[props.slds[props.curSldIndex].id] === undefined) {
  //     console.log("yo");
  //     props.respondedAudi[props.slds[props.curSldIndex].id] = [];
  //     db.collection("invitation")
  //       .doc(props.projId)
  //       .update({respondedAudi: props.respondedAudi});
  //   }
  // });

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

    props.respondedAudi[props.slds[props.curSldIndex].id].push(props.audiId);

    db.collection("invitation")
      .doc(props.projId)
      .update({respondedAudi: props.respondedAudi});
  };

  return (
    <div className="poll">
      {props.slds[props.curSldIndex].sldType === "multiple-choice" ? (
        props.slds[props.curSldIndex].opts !== "" ? (
          props.respondedAudi[props.slds[props.curSldIndex].id].includes(props.audiId) ? (
            <Wait {...props} />
          ) : (
            <Fragment>
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
            </Fragment>
          )
        ) : (
          <Wait {...props} />
        )
      ) : (
        <div>{props.slds[props.curSldIndex].heading}</div>
      )}
    </div>
  );
};

const Wait = props => {
  return (
    <div className="wait">
      <FormattedMessage id="audi.wait" />
    </div>
  );
};
