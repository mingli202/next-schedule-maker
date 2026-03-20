import { useCallback, useRef, useState } from "react";

// biome-ignore lint/suspicious/noExplicitAny: idk man
const isFunction = (val: any): val is (...args: any) => any =>
  typeof val === "function";

function useStorage<T>(
  defaultValue: T,
  key: string,
  getStorage: () => Storage | undefined,
) {
  const keyRef = useRef(key);
  const storageRef = useRef(getStorage());
  const defaultValueRef = useRef(defaultValue);

  const [state, setState] = useState<T>(() => {
    const storage = storageRef.current;
    if (typeof window === "undefined" || !storage) {
      return defaultValue;
    }

    const data = storageRef.current?.getItem(keyRef.current);

    if (data) {
      return JSON.parse(data);
    }

    return defaultValue;
  });

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

  return [state, update, remove] as const;
}

const getSessionStorage = () =>
  typeof sessionStorage === "undefined" ? undefined : sessionStorage;

const getLocalStorage = () =>
  typeof localStorage === "undefined" ? undefined : localStorage;

export const useSessionStorage = <T>(defaultValue: T, key: string) =>
  useStorage(defaultValue, key, getSessionStorage);

export const useLocalStorage = <T>(defaultValue: T, key: string) =>
  useStorage(defaultValue, key, getLocalStorage);
