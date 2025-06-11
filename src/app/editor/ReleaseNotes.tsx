"use client";

import { Button } from "@/ui";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { useLayoutEffect, useState } from "react";

const versionHistory = [
  [
    "Fall2025 June 3, v2",
    [
      "Users can correct wrong sections locally by holding the warning icon at the bottom left of a section in the search results.",
    ],
  ],
  [
    "Fall2025 June 3, v1",
    [
      "Report sections that have wrong info by clicking the warning icon at the bottom left of a section in the search results",
    ],
  ],
] as const;

export default function ReleaseNotes() {
  const currentVersion = versionHistory[0][0];
  const [seenReleaseNotes, setSeenReleaseNotes] = useState<string | null>(
    "seen",
  );

  useLayoutEffect(() => {
    setSeenReleaseNotes(localStorage.getItem(currentVersion));

    for (const [version] of versionHistory) {
      if (version !== currentVersion) {
        localStorage.removeItem(version);
      }
    }
  }, []);

  return (
    <AnimatePresence>
      {seenReleaseNotes ? null : (
        <motion.div
          className="bot-0 absolute top-0 z-[9999] flex h-[100vh] w-[100vw] items-center justify-center bg-bgPrimary/50 backdrop-blur-md backdrop-filter"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
        >
          <div className="flex w-[min(35rem,80%)] flex-col gap-2 rounded-md border-[4px] border-solid border-primary bg-bgPrimary p-2 md:gap-4 md:p-4">
            <div>
              <div className="flex items-center justify-between gap-2 text-xl md:text-2xl">
                <h1>What{"'"}s new in Fall2025</h1>
                <Button
                  variant="basic"
                  className="p-0"
                  onClick={() => {
                    setSeenReleaseNotes("seen");
                    localStorage.setItem(currentVersion, "seen");
                  }}
                >
                  <FontAwesomeIcon
                    icon={faClose}
                    className="h-[1.25rem] w-[1.25rem] md:h-[1.5rem] md:w-[1.5rem]"
                  />
                </Button>
              </div>
            </div>

            {versionHistory.map(([version, details]) => (
              <ul
                className="list-disc rounded-sm bg-bgSecondary p-2 [&>li]:ml-3"
                key={version}
              >
                <p>
                  {version} {currentVersion === version ? "(Latest)" : null}
                </p>
                {details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
