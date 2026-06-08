import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import {
  type MouseEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components";

const versionHistory = [
  [
    "Fall 2026 June 5, v1",
    [
      "Generated schedules and sections search result performance optmization",
      "Remade the entire app in a better framework to setup the stage for upcoming features",
      "Upcoming feature: auto parse the pdf so you don't have to wait for me to update ts",
      "Upcoming feature: section add/delete/edit so you can correct inaccurate information and have it reflected on your machine",
      "Upcoming feature: a mobile app?? 😭😭😭",
    ],
  ],
  [
    "Winter 2026 December 11, v1",
    [
      "Updated with the latest Winter2026 December 11 pdf.",
      "Very busy with finals so might not fix every bug :(",
    ],
  ],
  [
    "Fall 2025 June 17, v1",
    [
      "Updated with the latest June 17 pdf.",
      "Schedules might be broken, double check your schedules.",
    ],
  ],
  [
    "Fall 2025 June 6, v1",
    [
      "Updated with the latest June 6 pdf.",
      "Career Programs are gone.",
      "Should have much less wrong sections overall.",
    ],
  ],
  [
    "Fall 2025 June 3, v1",
    [
      "Report sections that have wrong info by clicking the warning icon at the bottom left of a section in the search results",
    ],
  ],
] as const;

export default function ReleaseNotes() {
  const key = "last-seen-version";
  const currentVersion = versionHistory[0][0];
  const [seenReleaseNotes, setSeenReleaseNotes] = useState<string | null>(
    currentVersion,
  );

  const popupRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    setSeenReleaseNotes(localStorage.getItem(key));

    const s = new Set(versionHistory.map((v) => v[0]));
    if (s.size !== versionHistory.length) {
      throw new Error("Has duplicate version name");
    }
  }, []);

  const close = useCallback(() => {
    setSeenReleaseNotes(currentVersion);
    localStorage.setItem(key, currentVersion);
  }, [currentVersion]);

  function handleClick(e: MouseEvent) {
    if (!popupRef.current) return;
    if (!(e.target instanceof Node)) return;
    if (popupRef.current.contains(e.target)) return;

    close();
  }

  return (
    <AnimatePresence>
      {seenReleaseNotes === currentVersion ? null : (
        <motion.div
          className="bot-0 bg-background/50 absolute top-0 z-9999 flex h-screen w-screen items-center justify-center backdrop-blur-md backdrop-filter"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          onClick={handleClick}
        >
          <div
            className="border-primary bg-background flex w-[min(35rem,80%)] flex-col gap-2 rounded-md border-4 border-solid p-2 md:gap-4 md:p-4"
            ref={popupRef}
          >
            <div>
              <div className="flex items-center justify-between gap-2 text-xl md:text-2xl">
                <h1>What{"'"}s new in Fall 2026</h1>
                <Button variant="basic" className="p-0" onClick={close}>
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                </Button>
              </div>
            </div>

            {versionHistory.map(([version, details]) => (
              <ul
                className="bg-secondary/50 list-outside list-disc rounded-sm p-2 [&>li]:ml-6"
                key={version}
              >
                <p>
                  {version} {currentVersion === version ? "(Latest)" : null}
                </p>
                {details.map((detail, i) => (
                  <li key={i.toString() + detail}>{detail}</li>
                ))}
              </ul>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
