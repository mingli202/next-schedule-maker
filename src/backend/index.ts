import {
  ReportSchema,
  SavedScheduleDataSchema,
  SavedScheduleSchema,
  TableNames,
  UserSchema,
} from "@/lib/schemas/database";
import { None, Option, Some } from "@/lib/util/option";
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { get, getDatabase, ref } from "firebase/database";
import { z } from "zod/v4";

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
const _db = getDatabase(app);
const provider = new GoogleAuthProvider();

abstract class Table<T> {
  #name: TableNames;
  get name() {
    return this.#name;
  }

  #schema: z.ZodType<z.output<T>>;
  get schema() {
    return this.#schema;
  }

  constructor(name: TableNames, schema: z.ZodType<z.output<T>>) {
    this.#name = name;
    this.#schema = schema;
  }

  async get(primaryKey: string): Promise<Option<T>> {
    const snapshot = await get(ref(_db, `${this.#name}/${primaryKey}`));

    if (snapshot.exists()) {
      return new Some(this.#schema.parse(snapshot.val()) as T);
    }

    return new None();
  }
}

class Users extends Table<UserSchema> {
  constructor() {
    super("users", UserSchema);
  }
}
class Reports extends Table<ReportSchema> {
  constructor() {
    super("reports", ReportSchema);
  }
}
class SavedSchedules extends Table<SavedScheduleSchema> {
  constructor() {
    super("savedSchedules", SavedScheduleSchema);
  }
}
class SavedScheduleData extends Table<SavedScheduleDataSchema> {
  constructor() {
    super("savedScheduleData", SavedScheduleDataSchema);
  }
}

const db: Record<TableNames, Table<unknown>> = {
  users: new Users(),
  reports: new Reports(),
  savedSchedules: new SavedSchedules(),
  savedScheduleData: new SavedScheduleData(),
} as const;

export { app, provider, db };
