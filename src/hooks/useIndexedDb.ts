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
  const abortController = useRef(new AbortController());

  const [value, setValue] = useState<IndexedDbRecordWithoutKey<T> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    indexedDbGet(storeNameRef.current, keyRef.current).then((res) => {
      setValue(res);

      if (onLoadRef.current) {
        onLoadRef.current(res);
      }
    });

    return () => {
      abortController.current.abort();
    };
  }, []);

  const update = useCallback(
    (
      newValue:
        | (IndexedDbRecordWithoutKey<T> | null)
        | ((
            prev: IndexedDbRecordWithoutKey<T> | null,
          ) => IndexedDbRecordWithoutKey<T> | null),
    ) => {
      setValue((prev) => {
        const nextValue = isFunction(newValue) ? newValue(prev) : newValue;

        if (nextValue == null) {
          indexedDbDelete(
            storeNameRef.current,
            keyRef.current,
            abortController.current.signal,
          ).catch((e) => setError(e));
        } else {
          indexedDbSet(
            storeNameRef.current,
            keyRef.current,
            nextValue,
            abortController.current.signal,
          ).catch((e) => setError(e));
        }

        return nextValue;
      });
    },
    [],
  );

  const remove = useCallback(() => update(null), [update]);

  return { value, update, remove, error } as const;
}
