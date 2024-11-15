import firebase from 'firebase/app';
import 'firebase/functions';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';

let config = JSON.parse(atob(process.env.REACT_APP_FIREBASE_CONFIG));

firebase.initializeApp(config);
if( !firebase.apps.length ){
  firebase.initializeApp(config);
}

/*
if (process.env.NODE_ENV === 'development') {
  firebase.functions().useFunctionsEmulator('http://localhost:5001')
}
*/

const db = firebase.firestore();
const dbTimestamp = firebase.firestore.FieldValue.serverTimestamp;
const auth = firebase.auth();

export {
  firebase,
  db,
  dbTimestamp,
  auth,
};