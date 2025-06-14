import { useEffect, useState } from "react";

export function useSessionStorage<T>(defaultValue: T, key: string) {
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => {
    const data = sessionStorage.getItem(key + "fall2025");

    if (data) {
      setState(JSON.parse(data));
    }
  }, [key]);

  function update(newValue: T) {
    sessionStorage.setItem(key + "fall2025", JSON.stringify(newValue));
    setState(newValue);
  }

  return [state, update] as const;
}

export function useLocalStorage<T>(defaultValue: T, key: string) {
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => {
    const data = localStorage.getItem(key + "fall2025");

    if (data) {
      setState(JSON.parse(data));
    }
  }, [key]);

  function update(newValue: T) {
    sessionStorage.setItem(key + "fall2025", JSON.stringify(newValue));
    setState(newValue);
  }

  return [state, update] as const;
}
