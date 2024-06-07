import { useEffect, useState } from "react";

function useSessionStorage<T>(defaultValue: T, key: string) {
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => {
    const data = sessionStorage.getItem(key + "Fall");

    if (data) {
      setState(JSON.parse(data));
    }
  }, [key]);

  function update(newValue: T) {
    sessionStorage.setItem(key + "Fall", JSON.stringify(newValue));
    setState(newValue);
  }

  return [state, update] as const;
}

export default useSessionStorage;
