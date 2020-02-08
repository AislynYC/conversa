import React, {Fragment, useEffect} from "react";
import {useSelector} from "react-redux";
import {useFirestore} from "react-redux-firebase";

const AudiView = props => {
  console.log("view", props);
  const db = useFirestore();
  const invtCode = props.match.params.invtCode;
  //   let projData = null;

  //   db.collection("invitation")
  //     .where("inviteCode", "==", invtCode)
  //     .get()
  //     .then(querySnapshot => {
  //       querySnapshot.forEach(doc => {
  //         let data = doc.data();
  //         test(data);
  //       });
  //     })
  //     .catch(function(error) {
  //       console.log("Error getting documents: ", error);
  //     });

  //   const test = data => {
  //     return (projData = data);
  //   };
  //   const listenerSettings = {
  //     collection: "users",
  //     doc: userId,
  //     subcollections: [{collection: "projects"}],
  //     storeAs: userId + "_projects"
  //     orderBy: ["createdAt", "asc"],
  //     limit: 10
  //   };

  //   useEffect(() => {
  //     db.setListener(listenerSettings);
  //     return function cleanup() {
  //       db.unsetListener(listenerSettings);
  //     };
  //   });

  //   useEffect(() => {
  //     let listenerSettings = {};
  //     async function lala() {
  //       let invitations = await db
  //         .collection("invitation")
  //         .where("inviteCode", "==", invtCode)
  //         .get();
  //       invitations.forEach(doc => {
  //         let data = doc.data();
  //         listenerSettings = {
  //           collection: "users",
  //           doc: data.owner,
  //           subcollections: [{collection: "projects"}],
  //           storeAs: data.owner + "_projects"
  //           // orderBy: ["createdAt", "asc"],
  //           // limit: 10
  //         };
  //         userId = data.owner;
  //         console.log("lala end", data, userId, listenerSettings);
  //       });
  //       db.setListener(listenerSettings);
  //     }

  //     lala();
  //     return function cleanup() {
  //       db.unsetListener(listenerSettings);
  //     };
  //   });

  //   const projData = useSelector(state => {
  //     if (Object.keys(state.firestore.ordered).length !== 0) {
  //       console.log(state.firestore.ordered);
  //       const tmp = userId + "_projects";
  //       console.log("useSelector", tmp);
  //       return state.firestore.ordered[tmp][0];
  //     }
  //   });

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
