import React, {Fragment} from "react";
import {useFirestore} from "react-redux-firebase";

const AudiView = props => {
  const db = useFirestore();

  return (
    <Fragment>
      {props.curSldIndex === undefined ? (
        <span>Loading</span>
      ) : (
        <div>
          <div>{props.slds[props.curSldIndex].qContent}</div>
          <ul>
            {props.slds[props.curSldIndex].opts.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </Fragment>
  );
};
export default AudiView;
