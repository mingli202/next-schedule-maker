import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const config = {
  apiKey: "AIzaSyAG8LJPNXNgDKnfopB-c1CVX-Uew4uRyqU",
  authDomain: "schedule-maker-8675b.firebaseapp.com",
  databaseURL: "https://schedule-maker-8675b-default-rtdb.firebaseio.com",
  projectId: "schedule-maker-8675b",
  storageBucket: "schedule-maker-8675b.appspot.com",
  messagingSenderId: "198447247334",
  appId: "1:198447247334:web:314fe11a846b7f973cf027",
  measurementId: "G-VHKK3NNF8T",
};

// const configTest = {
//   apiKey: "AIzaSyBebC8tFESpxnqmNf1kGUXIzfn6VakoW7Y",
//   authDomain: "schedule-maker-test.firebaseapp.com",
//   projectId: "schedule-maker-test",
//   storageBucket: "schedule-maker-test.appspot.com",
//   messagingSenderId: "244310264983",
//   appId: "1:244310264983:web:52aa1bc16ccefc94156dd2",
// };

const app = initializeApp(config);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

export { app, db, provider };
