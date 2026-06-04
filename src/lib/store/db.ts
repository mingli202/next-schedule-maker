import type { SavedSection } from "src/types/schedule";

const DB_NAME = "schedule-maker";
const DB_VERSION = 2;
const GENERATED_SCHEDULES_CACHE_STORE = "generated-schedules-cache";

type GeneratedSchedulesCacheRecord = {
  key: string;
  schedules: SavedSection[][];
  updatedAt: number;
};

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
    const t = setTimeout(() => {
      console.error("Opening database timed out");
      resolve(null);
    }, 5000);

    req.onupgradeneeded = () => {
      const nextDb = req.result;

      if (!nextDb.objectStoreNames.contains(GENERATED_SCHEDULES_CACHE_STORE)) {
        nextDb.createObjectStore(GENERATED_SCHEDULES_CACHE_STORE, {
          keyPath: "key",
        });
      }
    };

    req.onsuccess = () => {
      clearTimeout(t);
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

function getGeneratedSchedulesStore(
  database: IDBDatabase,
  mode: IDBTransactionMode,
) {
  if (!database.objectStoreNames.contains(GENERATED_SCHEDULES_CACHE_STORE)) {
    console.error("Generated schedules cache store does not exist");
    return null;
  }

  return database
    .transaction(GENERATED_SCHEDULES_CACHE_STORE, mode)
    .objectStore(GENERATED_SCHEDULES_CACHE_STORE);
}

export async function getGeneratedSchedulesCache(key: string) {
  const database = await getDb();

  if (!database) {
    return null;
  }

  const store = getGeneratedSchedulesStore(database, "readonly");

  if (!store) {
    return null;
  }

  return new Promise<SavedSection[][] | null>((resolve) => {
    const req = store.get(key);

    req.onsuccess = () => {
      const result = req.result as GeneratedSchedulesCacheRecord | undefined;
      resolve(result?.schedules ?? null);
    };

    req.onerror = () => {
      console.error("Could not read generated schedules cache");
      resolve(null);
    };
  });
}

export async function setGeneratedSchedulesCache(
  key: string,
  schedules: SavedSection[][],
  abortSignal?: AbortSignal,
) {
  const database = await getDb();

  if (!database) {
    return false;
  }

  const store = getGeneratedSchedulesStore(database, "readwrite");

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
      key,
      schedules,
      updatedAt: Date.now(),
    } satisfies GeneratedSchedulesCacheRecord);

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

      console.error("Could not write generated schedules cache");
      resolve(false);
    };

    transaction.onabort = () => {
      console.error("Writing generated schedules cache was aborted");
      resolve(false);
    };
  });
}

export async function deleteGeneratedSchedulesCache(
  key: string,
  abortSignal?: AbortSignal,
) {
  const database = await getDb();

  if (!database) {
    return false;
  }

  const store = getGeneratedSchedulesStore(database, "readwrite");

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

      console.error("Could not delete generated schedules cache");
      resolve(false);
    };

    transaction.onabort = () => {
      console.error("Deleting generated schedules cache was aborted");
      resolve(false);
    };
  });
}
