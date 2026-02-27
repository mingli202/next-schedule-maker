import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const isProd = import.meta.env.PROD;

const config = isProd
  ? {
      apiKey: import.meta.env.apiKey,
      authDomain: import.meta.env.authDomain,
      databaseURL: import.meta.env.databaseURL,
      projectId: import.meta.env.projectId,
      storageBucket: import.meta.env.storageBucket,
      messagingSenderId: import.meta.env.messagingSenderId,
      appId: import.meta.env.appId,
      measurementId: import.meta.env.measurementId,
    }
  : {
      apiKey: import.meta.env.DEV_apiKey,
      authDomain: import.meta.env.DEV_authDomain,
      databaseURL: import.meta.env.DEV_databaseURL,
      projectId: import.meta.env.DEV_projectId,
      storageBucket: import.meta.env.DEV_storageBucket,
      messagingSenderId: import.meta.env.DEV_messagingSenderId,
      appId: import.meta.env.DEV_appId,
    };

const app = initializeApp(config);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

export { app, db, provider };
