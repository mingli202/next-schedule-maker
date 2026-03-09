import { useCallback, useEffect, useRef } from "react";

/**
 * Custom hook that returns a debounced version of the given function that gets called after the given debounceTime
 * */
export function useDebounce(fn: () => void, debounceTime: number) {
  const t = useRef<number>(null);
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const debouncedFunction = useCallback(() => {
    if (t.current) {
      window.clearTimeout(t.current);
    }
    t.current = window.setTimeout(fnRef.current, debounceTime);
  }, [debounceTime]);

  useEffect(() => {
    return () => {
      if (t.current) {
        window.clearTimeout(t.current);
      }
    };
  }, []);

  return debouncedFunction;
}
