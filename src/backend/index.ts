import { Database, User } from "@/lib/schemas/database";
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { get, getDatabase, ref } from "firebase/database";

const config = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};

const app = initializeApp(config);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

class Base {}

class Save extends Base {}

class SavedSchedule extends Base {
  private _data: Save[];
  private _textColor: string;
  private _id: number;
}

class Db extends Base {
  private _schema = Database;
  private _db;

  constructor() {
    super();
    this._db = getDatabase(app);
  }

  public async users(): Promise<Record<string, User>> {
    const snapshot = await get(ref(this._db, "users"));

    if (!snapshot.exists()) {
      return {};
    }

    const users = this._schema.shape.users.parse(snapshot.val());

    return users;
  }

  public async users(uid: string): Promise<User | null> {
    const snapshot = await get(ref(this._db, `users/${uid}`));

    if (!snapshot.exists()) {
      return null;
    }

    return User.parse(snapshot.val());
  }
}

export { app, db, provider };
