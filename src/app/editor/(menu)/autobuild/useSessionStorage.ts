import { useEffect, useState } from "react";

function useSessionStorage<T>(defaultValue: T, key: string) {
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => {
    const data = sessionStorage.getItem(key + "Winter2025");

    if (data) {
      setState(JSON.parse(data));
    }
  }, [key]);

  function update(newValue: T) {
    sessionStorage.setItem(key + "Winter2025", JSON.stringify(newValue));
    setState(newValue);
  }

  return [state, update] as const;
}

export default useSessionStorage;
