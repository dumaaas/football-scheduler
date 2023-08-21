import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBFdbNHzbWR6iu7ohPY722f4Lf8-3n7Gp4",
  authDomain: "football-scheduler-cde0c.firebaseapp.com",
  projectId: "football-scheduler-cde0c",
  storageBucket: "football-scheduler-cde0c.appspot.com",
  messagingSenderId: "971538102811",
  appId: "1:971538102811:web:3e5cad1123476e7b7356be",
  measurementId: "G-8FPM9714NN",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };
