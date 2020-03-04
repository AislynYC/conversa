export const writeDBUser = (
  db,
  userDocId,
  projDocId,
  writingType,
  writingData,
  callback
) => {
  const userDocRef = db.collection("users").doc(userDocId);

  const projCollRef = db
    .collection("users")
    .doc(userDocId)
    .collection("projects");

  let projDocRef = null;
  if (projDocId !== null) {
    projDocRef = db
      .collection("users")
      .doc(userDocId)
      .collection("projects")
      .doc(projDocId);
  }

  if (writingType === "setUserDoc") {
    return userDocRef.set(writingData).then(callback);
  } else if (writingType === "updateProjDoc") {
    return projDocRef.update(writingData).then(callback);
  } else if (writingType === "addProjColl") {
    return projCollRef.add(writingData).then(callback);
  } else if (writingType === "delProjDoc") {
    return projDocRef.delete().then(callback);
  }
};

export const writeDBInvt = (db, projDocId, writingType, writingData, callback) => {
  const invtDocRef = db.collection("invitation").doc(projDocId);

  if (writingType === "updateInvtDoc") {
    return invtDocRef.update(writingData).then(callback);
  } else if (writingType === "setInvtDoc") {
    return invtDocRef.set(writingData).then(callback);
  } else if (writingType === "delInvtDoc") {
    return invtDocRef.delete().then(callback);
  }
};
