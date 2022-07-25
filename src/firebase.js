import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
// import { getStorage, ref } from "firebase/storage";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
  sendPasswordResetEmail,
} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCklk6P2MflW6j2tNAD3JA50e0FfnLbRsg",
  authDomain: "dynamic-dashboard-589b5.firebaseapp.com",
  projectId: "dynamic-dashboard-589b5",
  storageBucket: "dynamic-dashboard-589b5.appspot.com",
  messagingSenderId: "55435738790",
  appId: "1:55435738790:web:00873afd166fe4864e3e67",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const users = collection(db, "Users");

export {
  app,
  db,
  users,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
  sendPasswordResetEmail
};
