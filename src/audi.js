import React, {Fragment, useEffect} from "react";
import {useSelector} from "react-redux";
import {useFirestore} from "react-redux-firebase";

const Audi = props => {
  const firestore = useFirestore();
  const listenerSettings = {
    collection: "users",
    doc: "PLdhrvmiHZQJZVTsh9X0",
    subcollections: [{collection: "projects"}],
    storeAs: "PLdhrvmiHZQJZVTsh9X0_projects"
    // orderBy: ["createdAt", "asc"],
    // limit: 10
  };

  useEffect(() => {
    firestore.setListener(listenerSettings);
    return function cleanup() {
      firestore.unsetListener(listenerSettings);
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
        </div>
      )}
    </Fragment>
  );
};
export default Audi;
