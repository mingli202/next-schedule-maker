import type { RecordValues } from "src/types";
import {
  type IndexedDbRecord,
  type IndexedDbRecordWithoutKey,
  IndexedDbSchema,
  type IndexedDbStoreName,
} from "src/types/indexedDb";
import type { SavedSection } from "src/types/schedule";
import type { z } from "zod";
import { IndexedDbKey } from "../storageKeys";

const DB_NAME = "schedule-maker";
const DB_VERSION = 2;

let db: IDBDatabase | null = null;
let openingDb: Promise<IDBDatabase | null> | null = null;

/**
 * Get connection to the local database
 * */
export async function getDb() {
  if (typeof window === "undefined" || typeof indexedDB === "undefined") {
    return;
  }

  if (db !== null) {
    return db;
  }

  if (openingDb !== null) {
    return openingDb;
  }

  const req = indexedDB.open(DB_NAME, DB_VERSION);

  openingDb = new Promise((resolve) => {
    let timeOut = false;

    const t = setTimeout(() => {
      timeOut = true;
      console.error("Opening database timed out");
      resolve(null);
    }, 5000);

    req.onupgradeneeded = () => {
      const nextDb = req.result;

      for (const store of Object.values(IndexedDbKey)) {
        if (!nextDb.objectStoreNames.contains(store)) {
          nextDb.createObjectStore(store, {
            keyPath: "key",
          });
        }
      }
    };

    req.onsuccess = () => {
      clearTimeout(t);

      if (timeOut) {
        return req.result.close();
      }

      resolve(req.result);
    };

    req.onerror = () => {
      clearTimeout(t);
      console.error("Could not open database");
      resolve(null);
    };
  });

  db = await openingDb;
  openingDb = null;

  return db;
}

/**
 * Gets the store associated with the given database in the given mode with the given storeName
 * */
function getStore(
  database: IDBDatabase,
  mode: IDBTransactionMode,
  storeName: RecordValues<typeof IndexedDbKey>,
) {
  if (!database.objectStoreNames.contains(storeName)) {
    console.error(`IndexedDB store does not exist: ${storeName}`);
    return null;
  }

  return database.transaction(storeName, mode).objectStore(storeName);
}

/**
 * Gets the value at the given key of the given store
 * */
export async function indexedDbGet<T extends IndexedDbStoreName>(
  storeName: T,
  key: string,
): Promise<IndexedDbRecord<T> | null> {
  const database = await getDb();

  if (!database) {
    return null;
  }

  const store = getStore(database, "readonly", storeName);

  if (!store) {
    return null;
  }

  const schema = IndexedDbSchema[storeName];

  return new Promise<z.infer<typeof schema> | null>((resolve) => {
    const req = store.get(key);

    req.onsuccess = () => {
      const result = schema.safeParse(req.result);

      if (result.success) {
        resolve(result.data as IndexedDbRecord<T>);
      } else {
        resolve(null);
      }
    };

    req.onerror = () => {
      console.error(`Could not read IndexedDB store: ${storeName}`);
      resolve(null);
    };
  });
}

/**
 * Sets the value at the given key of the given store with the given value
 * */
export async function indexedDbSet<T extends IndexedDbStoreName>(
  storeName: T,
  key: string,
  value: IndexedDbRecordWithoutKey<T>,
  abortSignal?: AbortSignal,
) {
  const database = await getDb();

  if (!database) {
    return false;
  }

  const store = getStore(database, "readwrite", storeName);

  if (!store) {
    return false;
  }

  return new Promise<boolean>((resolve) => {
    const transaction = store.transaction;

    if (abortSignal?.aborted) {
      transaction.abort();
      resolve(false);
      return;
    }

    let abortfn: (() => void) | undefined;
    if (abortSignal) {
      abortfn = () => transaction.abort();
      abortSignal.addEventListener("abort", abortfn);
    }

    store.put({
      ...value,
      key,
      updatedAt: Date.now(),
    });

    transaction.oncomplete = () => {
      if (abortfn) {
        abortSignal?.removeEventListener("abort", abortfn);
      }

      resolve(true);
    };

    transaction.onerror = () => {
      if (abortfn) {
        abortSignal?.removeEventListener("abort", abortfn);
      }

      console.error(`Could not write IndexedDB store: ${storeName}`);
      resolve(false);
    };

    transaction.onabort = () => {
      console.error(`Writing IndexedDB store was aborted: ${storeName}`);
      resolve(false);
    };
  });
}

/**
 * Deletes the value at the given key of the given store
 * */
export async function indexedDbDelete<T extends IndexedDbStoreName>(
  storeName: T,
  key: string,
  abortSignal?: AbortSignal,
) {
  const database = await getDb();

  if (!database) {
    return false;
  }

  const store = getStore(database, "readwrite", storeName);

  if (!store) {
    return false;
  }

  return new Promise<boolean>((resolve) => {
    const transaction = store.transaction;

    if (abortSignal?.aborted) {
      transaction.abort();
      resolve(false);
      return;
    }

    let abortfn: (() => void) | undefined;
    if (abortSignal) {
      abortfn = () => transaction.abort();
      abortSignal.addEventListener("abort", abortfn);
    }

    store.delete(key);

    transaction.oncomplete = () => {
      if (abortfn) {
        abortSignal?.removeEventListener("abort", abortfn);
      }

      resolve(true);
    };

    transaction.onerror = () => {
      if (abortfn) {
        abortSignal?.removeEventListener("abort", abortfn);
      }

      console.error(`Could not delete IndexedDB store record: ${storeName}`);
      resolve(false);
    };

    transaction.onabort = () => {
      console.error(
        `Deleting IndexedDB store record was aborted: ${storeName}`,
      );
      resolve(false);
    };
  });
}

/**
 * Gets the generated schedules cache
 * */
export async function getGeneratedSchedulesCache(key: string) {
  return indexedDbGet(IndexedDbKey.GENERATED_SCHEDULES_CACHE_STORE, key);
}

export async function setGeneratedSchedulesCache(
  key: string,
  schedules: Array<Array<SavedSection>>,
  abortSignal?: AbortSignal,
) {
  return indexedDbSet(
    IndexedDbKey.GENERATED_SCHEDULES_CACHE_STORE,
    key,
    {
      schedules,
    },
    abortSignal,
  );
}

export async function deleteGeneratedSchedulesCache(
  key: string,
  abortSignal?: AbortSignal,
) {
  return indexedDbDelete(
    IndexedDbKey.GENERATED_SCHEDULES_CACHE_STORE,
    key,
    abortSignal,
  );
}
