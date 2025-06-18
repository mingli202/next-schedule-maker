import { useLayoutEffect, useState } from "react";
import { SemesterNames } from "../util/semesterNames";
import { RecordValues } from "../util";

export function useSessionStorage<T>(
  defaultValue: T,
  key: RecordValues<typeof SemesterNames.SessionStorage>,
) {
  const [state, setState] = useState<T>(defaultValue);

  useLayoutEffect(() => {
    const data = sessionStorage.getItem(key);

    if (data) {
      setState(JSON.parse(data));
    }
  }, [key]);

  function update(newValue: T) {
    sessionStorage.setItem(key, JSON.stringify(newValue));
    setState(newValue);
  }

  return [state, update] as const;
}

export function useLocalStorage<T>(
  defaultValue: T,
  key: RecordValues<typeof SemesterNames.LocalStorage>,
) {
  const [state, setState] = useState<T>(defaultValue);

  useLayoutEffect(() => {
    const data = localStorage.getItem(key);

    if (data) {
      setState(JSON.parse(data));
    }
  }, [key]);

  function update(newValue: T) {
    localStorage.setItem(key, JSON.stringify(newValue));
    setState(newValue);
  }

  return [state, update] as const;
}
