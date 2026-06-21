import { useCallback, useEffect, useState } from "react";
import { useSectionStore } from "src/lib/store/section";

export function useReleaseNotes() {
  const store = useSectionStore();

  const key = "last-seen-version";
  const currentVersion = store.filename;
  const [shouldOpen, setShouldOpen] = useState<boolean>(false);

  useEffect(() => {
    const storedVersion = localStorage.getItem(key);

    if (storedVersion === null || storedVersion !== currentVersion) {
      setShouldOpen(true);
    }
  }, [currentVersion]);

  const close = useCallback(() => {
    setShouldOpen(false);
    localStorage.setItem(key, currentVersion);
  }, [currentVersion]);

  const open = useCallback(() => {
    setShouldOpen(true);
  }, []);

  return { shouldOpen, open, close } as const;
}
