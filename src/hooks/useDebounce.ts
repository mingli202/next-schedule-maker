import { useCallback, useRef } from "react";

/**
 * Custom hook that returns a debounced version of the given function that gets called after the given debounceTime
 * */
export function useDebounce(fn: () => void, debounceTime: number) {
  const t = useRef<number>(null);

  const debouncedFunction = useCallback(() => {
    if (t.current) {
      window.clearTimeout(t.current);
    }
    t.current = window.setTimeout(fn, debounceTime);
  }, [fn, debounceTime]);

  return debouncedFunction;
}
