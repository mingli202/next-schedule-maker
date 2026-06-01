import { useCallback, useEffect, useRef, useState } from "react";

// biome-ignore lint/suspicious/noExplicitAny: idk man
const isFunction = (val: any): val is (...args: any) => any =>
  typeof val === "function";

/**
 * Helper hook for getting data from local or session storage
 * */
function useStorage<T>(
  defaultValue: T,
  key: string,
  getStorage: () => Storage | undefined,
  onLoad?: (v: T) => void,
) {
  const keyRef = useRef(key);
  const storageRef = useRef(getStorage());
  const defaultValueRef = useRef(defaultValue);
  const onLoadRef = useRef(onLoad);

  const [state, setState] = useState<T>(defaultValue);

  const update = useCallback((newValue: T | ((prev: T) => T)) => {
    setState((prev) => {
      const nextValue = isFunction(newValue) ? newValue(prev) : newValue;
      storageRef.current?.setItem(keyRef.current, JSON.stringify(nextValue));
      return nextValue;
    });
  }, []);

  const remove = useCallback(() => {
    storageRef.current?.removeItem(keyRef.current);
    setState(defaultValueRef.current);
  }, []);

  useEffect(() => {
    const storage = storageRef.current;
    if (typeof window === "undefined" || !storage) {
      return;
    }

    const data = storageRef.current?.getItem(keyRef.current);

    if (!data) {
      return;
    }

    try {
      const parsedData = JSON.parse(data);
      if (onLoadRef.current) {
        onLoadRef.current(parsedData);
      }

      setState(parsedData);
    } catch {
      storageRef.current?.removeItem(keyRef.current);
    }
  }, []);

  return [state, update, remove] as const;
}

const getSessionStorage = () =>
  typeof sessionStorage === "undefined" ? undefined : sessionStorage;

const getLocalStorage = () =>
  typeof localStorage === "undefined" ? undefined : localStorage;

/**
 * Gets the value stored at the given key in session storage
 * */
export const useSessionStorage = <T>(
  defaultValue: T,
  key: string,
  onLoad?: (v: T) => void,
) => useStorage(defaultValue, key, getSessionStorage, onLoad);

/**
 * Gets the value stored at the given key in local storage
 * */
export const useLocalStorage = <T>(
  defaultValue: T,
  key: string,
  onLoad?: (v: T) => void,
) => useStorage(defaultValue, key, getLocalStorage, onLoad);
