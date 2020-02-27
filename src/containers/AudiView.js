import React, {Fragment, useEffect, useState} from "react";
import {useFirestore} from "react-redux-firebase";
import {FormattedMessage} from "react-intl";
import {Link} from "react-router-dom";
import logo from "../img/conversa.png";
import logoC from "../img/logoC_nb.png";
import "./audiView.css";
// FontAwesome Setting
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faLaughSquint} from "@fortawesome/free-regular-svg-icons";
import {faHeart} from "@fortawesome/free-solid-svg-icons";
library.add(faLaughSquint, faHeart);

import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import TextField from "@material-ui/core/TextField";
import {withStyles} from "@material-ui/core/styles";
import {lightGreen} from "@material-ui/core/colors";
const GreenRadio = withStyles({
  root: {
    "&$checked": {
      color: lightGreen[600]
    }
  },
  checked: {}
})(props => <Radio color="default" {...props} />);

const ResInput = withStyles({
  root: {
    width: "100%",
    margin: "5% 0",
    "& label.Mui-focused": {
      color: "#dcf3e7",
      fontSize: "1.5rem"
    },
    "& .MuiOutlinedInput-root": {
      fontSize: "1.5rem",
      "& fieldset": {
        borderColor: "#dcf3e7"
      },
      "&.Mui-focused fieldset": {
        borderColor: "#dcf3e7"
      }
    }
  }
})(TextField);

const AudiView = props => {
  const db = useFirestore();
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

  if (props.involvedAudi !== undefined && props.audiId !== undefined) {
    if (!props.involvedAudi.includes(props.audiId)) {
      props.involvedAudi.push(props.audiId);
      db.collection("invitation")
        .doc(props.projId)
        .update({involvedAudi: props.involvedAudi});
    }
  }
  return (
    <div className="audi-container">
      <div className="poll">
        <div className="poll-logo">
          <img src={logo} alt="logo" />
        </div>
        {props.curSldIndex === undefined ? <span>Loading</span> : <Poll {...props} />}
      </div>
    </div>
  );
};
export default AudiView;

const Poll = props => {
  let audiInput = null;

  // To determine which slide type to be shown in audi view
  if (props.slds[props.curSldIndex].sldType === "heading-page") {
    audiInput = <HeadingInput {...props} />;
  } else if (
    props.respondedAudi[props.slds[props.curSldIndex].id].includes(props.audiId)
  ) {
    if (props.curSldIndex === props.slds.length - 1) {
      audiInput = <Ending {...props} />;
    } else {
      audiInput = <Wait {...props} />;
    }
  } else {
    if (props.slds[props.curSldIndex].sldType === "multiple-choice") {
      if (props.slds[props.curSldIndex].opts !== "") {
        audiInput = <MultiSelInputs {...props} />;
      } else {
        audiInput = <Wait {...props} />;
      }
    } else if (props.slds[props.curSldIndex].sldType === "open-ended") {
      audiInput = <OpenEndedInput {...props} />;
    } else if (props.slds[props.curSldIndex].sldType === "tag-cloud") {
      audiInput = <TagCloudInput {...props} />;
    }
  }

  return <Fragment>{audiInput}</Fragment>;
};

const HeadingInput = props => {
  const db = useFirestore();
  const addReaction = type => {
    var invtDocRef = db.collection("invitation").doc(props.projId);

    return db
      .runTransaction(function(transaction) {
        // This code may get re-run multiple times if there are conflicts.
        return transaction.get(invtDocRef).then(function(invtDoc) {
          if (!invtDoc.exists) {
            throw "Document does not exist!";
          }
          let invtData = invtDoc.data();
          invtData.reaction[type]++;
          transaction.update(invtDocRef, {reaction: invtData.reaction});
        });
      })
      .then(function() {
        console.log("Transaction successfully committed!");
      })
      .catch(function(error) {
        console.log("Transaction failed: ", error);
      });
  };
  return (
    <div className="heading-container">
      <div className="heading">{props.slds[props.curSldIndex].heading}</div>
      <Button
        variant="contained"
        size="large"
        className="reaction-icons"
        id="reaction-laugh"
        onClick={() => addReaction("laugh")}>
        <FontAwesomeIcon icon={["far", "laugh-squint"]} size="2x" />
      </Button>
    </div>
  );
};

const MultiSelInputs = props => {
  const db = useFirestore();
  const [selOptIndex, setSelOptIndex] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [isRadioDisabled, setIsRadioDisabled] = useState(false);

  useEffect(() => {
    setSelOptIndex(null);
  }, [props.curSldIndex]);

  useEffect(() => {
    setIsSubmitDisabled(false);
    setIsRadioDisabled(false);
  }, [props.curSldIndex]);

  useEffect(() => {
    if (selOptIndex === null) {
      setIsSubmitDisabled(true);
    } else {
      setIsSubmitDisabled(false);
    }
  }, [selOptIndex]);

  const submitMultiChoice = () => {
    setIsSubmitDisabled(true);
    setIsRadioDisabled(true);
    respondPoll();
  };

  const respondPoll = () => {
    const projDocRef = db
      .collection("users")
      .doc(props.userId)
      .collection("projects")
      .doc(props.projId);

    const invtDocRef = db.collection("invitation").doc(props.projId);
    return db
      .runTransaction(function(transaction) {
        // This code may get re-run multiple times if there are conflicts.
        // If conflicts, below transaction.get will re-run and get newest data from db
        return Promise.all([
          transaction.get(projDocRef),
          transaction.get(invtDocRef)
        ]).then(function(docs) {
          // Promise.all return an array includes documents from transaction.get
          let projDoc = docs[0];
          let invtDoc = docs[1];

          if (!projDoc.exists || !invtDoc.exists) {
            throw "Document does not exist!";
          }

          let projData = projDoc.data();
          let invtData = invtDoc.data();
          // Plus 1 vote to sld.rsult of projData which was gotten from transaction
          let newSlds = projData.slds.map((sld, index) => {
            if (index === props.curSldIndex) {
              if (sld.result[selOptIndex] === "") {
                sld.result[selOptIndex] = 1;
              } else {
                sld.result[selOptIndex]++;
              }
            }
            return sld;
          });

          // Update transaction for respondedAudi in collection invitation
          transaction.update(projDocRef, {slds: newSlds});
          // Push current audi ID to invtData which was gotten from transaction
          invtData.respondedAudi[projData.slds[props.curSldIndex].id].push(props.audiId);
          // Update transaction for respondedAudi in collection invitation
          transaction.update(invtDocRef, {
            respondedAudi: invtData.respondedAudi
          });
        });
      })
      .then(function() {
        console.log("Transaction successfully committed!");
      })
      .catch(function(error) {
        console.log("Transaction failed: ", error);
      });
  };

  return (
    <Fragment>
      <div>{props.slds[props.curSldIndex].qContent}</div>
      <form name="poll-form" id="poll-form">
        {props.slds[props.curSldIndex].opts.map((item, index) => (
          <label className="res-group" key={index}>
            <GreenRadio
              type="radio"
              name="res-group"
              value={index}
              disabled={isRadioDisabled}
              checked={selOptIndex === index}
              onChange={() => setSelOptIndex(index)}
              inputProps={{"aria-label": index}}
            />
            <div className="opts"> {item} </div>
          </label>
        ))}
        <Button
          variant="contained"
          id="submit-btn"
          disabled={isSubmitDisabled}
          onClick={submitMultiChoice}>
          <FormattedMessage id="audi.submit" />
        </Button>
      </form>
    </Fragment>
  );
};

const OpenEndedInput = props => {
  const db = useFirestore();
  const [resInputValue, setResInputValue] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  useEffect(() => {
    setIsSubmitDisabled(false);
  }, [props.curSldIndex]);

  useEffect(() => {
    if (resInputValue === null) {
      setIsSubmitDisabled(true);
    } else {
      setIsSubmitDisabled(false);
    }
  }, [resInputValue]);

  const submitOpenEnded = resInputValue => {
    setIsSubmitDisabled(true);
    respondOpenEnded(resInputValue);
  };

  const respondOpenEnded = resInputValue => {
    const projDocRef = db
      .collection("users")
      .doc(props.userId)
      .collection("projects")
      .doc(props.projId);

    const invtDocRef = db.collection("invitation").doc(props.projId);
    return db
      .runTransaction(function(transaction) {
        // This code may get re-run multiple times if there are conflicts.
        // If conflicts, below transaction.get will re-run and get newest data from db
        return Promise.all([
          transaction.get(projDocRef),
          transaction.get(invtDocRef)
        ]).then(function(docs) {
          // Promise.all return an array includes documents from transaction.get
          let projDoc = docs[0];
          let invtDoc = docs[1];

          if (!projDoc.exists || !invtDoc.exists) {
            throw "Document does not exist!";
          }

          let projData = projDoc.data();
          let invtData = invtDoc.data();
          // Plus 1 vote to sld.rsult of projData which was gotten from transaction
          let newSlds = projData.slds.map((sld, index) => {
            if (index === props.curSldIndex) {
              sld.openEndedRes.push(resInputValue);
            }
            return sld;
          });

          // Update transaction for respondedAudi in collection invitation
          transaction.update(projDocRef, {slds: newSlds});
          // Push current audi ID to invtData which was gotten from transaction
          invtData.respondedAudi[projData.slds[props.curSldIndex].id].push(props.audiId);
          // Update transaction for respondedAudi in collection invitation
          transaction.update(invtDocRef, {
            respondedAudi: invtData.respondedAudi
          });
        });
      })
      .then(function() {
        console.log("Transaction successfully committed!");
      })
      .catch(function(error) {
        console.log("Transaction failed: ", error);
      });
  };
  const charLimit = 60;
  const [textAllowed, setTextAllowed] = useState(charLimit);
  const checkTextAllowed = value => {
    setTextAllowed(charLimit - value.length);
  };

  return (
    <Fragment>
      <div className="q-content">{props.slds[props.curSldIndex].qContent}</div>
      <form name="poll-form" id="poll-form">
        <div className="open-input-area">
          <FormattedMessage
            id="audi.open-ended-input"
            defaultMessage="Please insert your response here">
            {placeholder => (
              <textarea
                id="res-input"
                value={resInputValue}
                placeholder={placeholder}
                rows="10"
                maxLength={charLimit.toString()}
                onChange={e => {
                  setResInputValue(e.target.value);
                  checkTextAllowed(e.target.value);
                }}
              />
            )}
          </FormattedMessage>
          <div id="audi-text-count">{textAllowed}</div>
        </div>
        <Button
          variant="contained"
          id="submit-btn"
          disabled={isSubmitDisabled}
          onClick={() => submitOpenEnded(resInputValue)}>
          <FormattedMessage id="audi.submit" />
        </Button>
      </form>
    </Fragment>
  );
};

const TagCloudInput = props => {
  const db = useFirestore();
  const charLimit = 20;
  const [resInputValue, setResInputValue] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [textAllowed, setTextAllowed] = useState([]);

  useEffect(() => {
    for (let i = 0; i < props.slds[props.curSldIndex].tagNum; i++) {
      textAllowed.push(charLimit);
      setTextAllowed(textAllowed);
    }
  }, []);
  useEffect(() => {
    setIsSubmitDisabled(false);
  }, [props.curSldIndex]);

  useEffect(() => {
    if (resInputValue.length === 0) {
      setIsSubmitDisabled(true);
    } else {
      setIsSubmitDisabled(false);
    }
  }, [resInputValue]);

  const handleChange = (value, i) => {
    let newResInputValue = resInputValue.slice(0);
    newResInputValue[i] = value;
    setResInputValue(newResInputValue);
  };

  const checkTextAllowed = (value, i) => {
    let newTextAllowed = textAllowed.slice(0);
    newTextAllowed[i] = charLimit - value.length;
    setTextAllowed(newTextAllowed);
  };

  let resInputs = [];
  for (let i = 0; i < props.slds[props.curSldIndex].tagNum; i++) {
    resInputs.push(
      <div className="cloud-res-input-group" key={i}>
        <input
          className="cloud-res-input"
          value={resInputValue[i] ? resInputValue[i] : ""}
          maxLength={charLimit.toString()}
          onChange={e => {
            handleChange(e.target.value, i);
            checkTextAllowed(e.target.value, i);
          }}
        />
        <div className="tag-text-count">{textAllowed[i]}</div>
      </div>
    );
  }

  const submitTagCloud = resInputValue => {
    setIsSubmitDisabled(true);
    respondTagCloud(resInputValue);
  };

  const respondTagCloud = resInputValue => {
    const projDocRef = db
      .collection("users")
      .doc(props.userId)
      .collection("projects")
      .doc(props.projId);

    const invtDocRef = db.collection("invitation").doc(props.projId);
    return db
      .runTransaction(function(transaction) {
        // This code may get re-run multiple times if there are conflicts.
        // If conflicts, below transaction.get will re-run and get newest data from db
        return Promise.all([
          transaction.get(projDocRef),
          transaction.get(invtDocRef)
        ]).then(function(docs) {
          // Promise.all return an array includes documents from transaction.get
          let projDoc = docs[0];
          let invtDoc = docs[1];

          if (!projDoc.exists || !invtDoc.exists) {
            throw "Document does not exist!";
          }

          let projData = projDoc.data();
          let invtData = invtDoc.data();
          // Plus 1 vote to sld.result of projData which was gotten from transaction
          let newSlds = projData.slds.map((sld, index) => {
            if (index === props.curSldIndex) {
              resInputValue.forEach(item => {
                if (sld.tagRes[item]) {
                  sld.tagRes[item] = sld.tagRes[item] + 1;
                  console.log(sld.tagRes[item]);
                } else {
                  sld.tagRes[item] = 1;
                }
              });
            }
            return sld;
          });

          // Update transaction for respondedAudi in collection invitation
          transaction.update(projDocRef, {slds: newSlds});
          // Push current audi ID to invtData which was gotten from transaction
          invtData.respondedAudi[projData.slds[props.curSldIndex].id].push(props.audiId);
          // Update transaction for respondedAudi in collection invitation
          transaction.update(invtDocRef, {
            respondedAudi: invtData.respondedAudi
          });
        });
      })
      .then(function() {
        console.log("Transaction successfully committed!");
      })
      .catch(function(error) {
        console.log("Transaction failed: ", error);
      });
  };
  return (
    <Fragment>
      <div className="q-content">{props.slds[props.curSldIndex].qContent}</div>
      <form name="poll-form" id="poll-form">
        <div className="cloud-input-area">
          <FormattedMessage
            id="audi.tag-cloud-input"
            defaultMessage="Please insert your response here"
          />
          {resInputs}
        </div>
        <Button
          variant="contained"
          id="submit-btn"
          disabled={isSubmitDisabled}
          onClick={() => submitTagCloud(resInputValue)}>
          <FormattedMessage id="audi.submit" />
        </Button>
      </form>
    </Fragment>
  );
};

const Wait = () => {
  return (
    <div className="poll-container">
      <div className="wait-img">
        <img src={logoC} />
      </div>
      <div className="wait-msg">
        <FormattedMessage id="audi.wait" />
      </div>
    </div>
  );
};

const Ending = () => {
  return (
    <div className="poll-container">
      <div className="wait-img">
        <div className="end-circle">
          <FontAwesomeIcon icon={["fas", "heart"]} size="2x" />
        </div>
      </div>
      <div className="wait-msg">
        <FormattedMessage id="audi.ending" />
      </div>
      <Link to="/">
        <Button variant="contained" id="go-to-home">
          <FormattedMessage id="audi.go-to-home" />
        </Button>
      </Link>
    </div>
  );
};
