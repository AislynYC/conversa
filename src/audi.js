import React, {Fragment} from "react";
import {useFirestore} from "react-redux-firebase";

const Audi = props => {
  const db = useFirestore();

  db.collection("users")
    .doc("PLdhrvmiHZQJZVTsh9X0")
    .collection("projects")
    .doc("96vfuLFEfKavi0trtngb")
    .get()
    .then(doc => console.log(doc.data()));

  return <Fragment>test</Fragment>;
};
export default Audi;
