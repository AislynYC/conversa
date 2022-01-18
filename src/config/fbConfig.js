import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDCtYWOFUFUJqhQTk0InJTOPsgp26KOcA0", 
  authDomain: "conversa-a419b.firebaseapp.com",
  databaseURL: "https://conversa-a419b.firebaseio.com",
  projectId: "conversa-a419b",
  storageBucket: "conversa-a419b.appspot.com",
  messagingSenderId: "1016180568273",
  appId: "1:1016180568273:web:3e2f51982044a3990d15f0",
  measurementId: "G-G8R1TS3R41",
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

new firebase.auth.GoogleAuthProvider();
new firebase.auth.FacebookAuthProvider();

export default firebase;
