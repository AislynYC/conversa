import React, {Fragment, useEffect} from "react";
import {useSelector} from "react-redux";
import {useFirestore} from "react-redux-firebase";

const Audi = props => {
  const db = useFirestore();
  const listenerSettings = {
    collection: "users",
    doc: "PLdhrvmiHZQJZVTsh9X0",
    subcollections: [{collection: "projects"}],
    storeAs: "PLdhrvmiHZQJZVTsh9X0_projects"
    // orderBy: ["createdAt", "asc"],
    // limit: 10
  };

  useEffect(() => {
    db.setListener(listenerSettings);
    return function cleanup() {
      db.unsetListener(listenerSettings);
    };
  }, []);

  const projData = useSelector(state => {
    if (Object.keys(state.firestore.ordered).length !== 0) {
      return state.firestore.ordered["PLdhrvmiHZQJZVTsh9X0_projects"][0];
    }
  });
  console.log(projData);

  return (
    <Fragment>
      {projData === undefined ? (
        <span>Loading</span>
      ) : (
        <div>
          <div>{projData.slds[projData.curSldIndex].qContent}</div>
          <ul>
            {projData.slds[projData.curSldIndex].opts.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </Fragment>
  );
};
export default Audi;
