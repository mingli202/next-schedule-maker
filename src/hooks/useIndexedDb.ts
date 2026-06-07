import { useCallback, useEffect, useRef, useState } from "react";
import { indexedDbDelete, indexedDbGet, indexedDbSet } from "src/lib/store/db";
import { isFunction } from "src/lib/utils";
import type {
  IndexedDbRecord,
  IndexedDbRecordWithoutKey,
  IndexedDbStoreName,
} from "src/types/indexedDb";

/**
 * Load/save data in indexedDb
 * */
export function useIndexedDb<T extends IndexedDbStoreName>(
  storeName: T,
  key: string,
  onLoad?: (v: IndexedDbRecord<T> | null) => void,
) {
  const keyRef = useRef(key);
  const storeNameRef = useRef(storeName);
  const onLoadRef = useRef(onLoad);
  const writeQueueRef = useRef<Promise<unknown>>(Promise.resolve());

  const [value, setValue] = useState<IndexedDbRecordWithoutKey<T> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    indexedDbGet(storeNameRef.current, keyRef.current).then((res) => {
      if (cancelled) {
        return;
      }

      setValue(res);

      if (onLoadRef.current) {
        onLoadRef.current(res);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const set = useCallback(
    (
      newValue:
        | (IndexedDbRecordWithoutKey<T> | null)
        | ((
            prev: IndexedDbRecordWithoutKey<T> | null,
          ) => IndexedDbRecordWithoutKey<T> | null),
    ) => {
      setValue((prev) => {
        const nextValue = isFunction(newValue) ? newValue(prev) : newValue;

        writeQueueRef.current = writeQueueRef.current
          .then(() => {
            if (nextValue == null) {
              return indexedDbDelete(storeNameRef.current, keyRef.current);
            }

            return indexedDbSet(
              storeNameRef.current,
              keyRef.current,
              nextValue,
            );
          })
          .catch((e) => {
            setError(String(e));
          });

        return nextValue;
      });
    },
    [],
  );

  const deleteStore = useCallback(() => set(null), [set]);

  return { value, set, deleteStore, error } as const;
}
