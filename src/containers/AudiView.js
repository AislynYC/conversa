import React, {Fragment} from "react";
import {useFirestore} from "react-redux-firebase";

const AudiView = props => {
  const db = useFirestore();

  return (
    <Fragment>
      {props.curSldIndex === undefined ? (
        <span>Loading</span>
      ) : (
        <div className="quest">
          <div>{props.slds[props.curSldIndex].qContent}</div>
          <ul>
            {props.slds[props.curSldIndex].opts.map((item, index) => (
              <div className="res-group" key={index}>
                <input type="radio" name="res-group" value={index} />
                <li key={index}>{item}</li>
              </div>
            ))}
          </ul>
        </div>
      )}
    </Fragment>
  );
};
export default AudiView;
