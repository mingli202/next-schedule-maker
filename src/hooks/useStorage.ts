import { useCallback, useEffect, useRef, useState } from "react";

function useStorage<T>(
  defaultValue: T,
  key: string,
  storage: Storage | undefined,
) {
  const keyRef = useRef(`${key}winter2026`);
  const storageRef = useRef(storage);
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => {
    const data = storageRef.current?.getItem(keyRef.current);

    if (data) {
      try {
        setState(JSON.parse(data));
      } catch {}
    }
  }, []);

  const update = useCallback((newValue: T) => {
    storageRef.current?.setItem(keyRef.current, JSON.stringify(newValue));
    setState(newValue);
  }, []);

  return [state, update] as const;
}

export const useSessionStorage = <T>(defaultValue: T, key: string) =>
  useStorage(defaultValue, key, sessionStorage);

export const useLocalStorage = <T>(defaultValue: T, key: string) =>
  useStorage(defaultValue, key, localStorage);
