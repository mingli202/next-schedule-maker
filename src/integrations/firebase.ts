import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const isProd = import.meta.env.PROD;

const config = isProd
  ? {
      apiKey: import.meta.env.VITE_apiKey,
      authDomain: import.meta.env.VITE_authDomain,
      databaseURL: import.meta.env.VITE_databaseURL,
      projectId: import.meta.env.VITE_projectId,
      storageBucket: import.meta.env.VITE_storageBucket,
      messagingSenderId: import.meta.env.VITE_messagingSenderId,
      appId: import.meta.env.VITE_appId,
      measurementId: import.meta.env.VITE_measurementId,
    }
  : {
      apiKey: import.meta.env.VITE_DEV_apiKey,
      authDomain: import.meta.env.VITE_DEV_authDomain,
      databaseURL: import.meta.env.VITE_DEV_databaseURL,
      projectId: import.meta.env.VITE_DEV_projectId,
      storageBucket: import.meta.env.VITE_DEV_storageBucket,
      messagingSenderId: import.meta.env.VITE_DEV_messagingSenderId,
      appId: import.meta.env.VITE_DEV_appId,
    };

const app = initializeApp(config);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

export { app, db, provider };
