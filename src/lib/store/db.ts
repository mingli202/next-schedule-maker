let db: IDBDatabase | null = null;

/**
 * Get connection to the local database
 * */
export async function getDb() {
  if (typeof window === "undefined") {
    return;
  }

  if (db !== null) {
    return db;
  }

  const req = indexedDB.open("asf");

  const promise: Promise<IDBDatabase | null> = new Promise((resolve) => {
    const t = setTimeout(() => {
      console.error("Opening database timed out");
      resolve(null);
    }, 1000);

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

  const r = await promise.catch(() => null);

  if (r !== null) {
    db = r;
  }

  return db;
}
