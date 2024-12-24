
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCgzoJhoooBTCK5mBR87u53YQ1Fz_5mifM",
  authDomain: "reactchat-88bfe.firebaseapp.com",
  projectId: "reactchat-88bfe",
  storageBucket: "reactchat-88bfe.appspot.com",
  messagingSenderId: "39799931160",
  appId: "1:39799931160:web:5e86033c9974630b445e6d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);