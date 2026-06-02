let db: IDBDatabase | null = null;

/**
 * Get connection to the local database
 * */
export async function getDb() {
  if (typeof window === "undefined") {
    return;
  }

  const req = indexedDB.open("asf");

  const promise: Promise<IDBDatabase | null> = new Promise(
    (resolve, reject) => {
      const t = setTimeout(() => resolve(null), 1000);

      req.onsuccess = () => {
        clearTimeout(t);
        resolve(req.result);
      };

      req.onerror = () => {
        clearTimeout(t);
        reject();
      };
    },
  );

  const r = await promise.catch(() => null);

  if (r !== null) {
    db = r;
  }
}
