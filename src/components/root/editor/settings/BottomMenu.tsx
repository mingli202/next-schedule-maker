import { AnimatePresence, type Variants, motion } from "framer-motion";
import { useState } from "react";
import { Button } from "src/components";
import { Link, useSearch } from "@tanstack/react-router";
import download from "src/lib/download";
import { useSectionStore } from "src/lib/store/section";

export function BottomMenu() {
  const [expand, setExpand] = useState(false);

  const { sectionsById } = useSectionStore();
  const sections = useSearch({
    from: "/editor/settings",
    select: (s) => s.sections,
  });

  const buttonVariants: Variants = {
    initial: {
      x: "100%",
      opacity: 0,
    },
    animate: {
      x: "0%",
      opacity: 1,
    },
  };

  return (
    <div className="bg-background flex w-full shrink-0 items-center justify-between gap-2 p-2">
      <Link
        to="/editor/settings"
        title="reset everything"
        search={{ sections: [] }}
      >
        <Button variant="basic">Reset URL</Button>
      </Link>

      <div className="flex shrink-0 items-center gap-4">
        <AnimatePresence>
          {expand === true && (
            <motion.div
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              exit="initial"
              title="download current schedule as Excel"
              onClick={() => {
                download(sections, sectionsById);
              }}
              key="download"
            >
              <Button
                variant="basic"
                className="rounded-none p-0"
                disableBgEffect
              >
                <FontAwesomeIcon icon={faFileDownload} className="h-4" />
              </Button>
            </motion.div>
          )}

          {expand === true && (
            <motion.div
              initial="initial"
              animate="animate"
              exit="initial"
              variants={buttonVariants}
              title="home"
              key="home"
            >
              <Link href={path}>
                <Button
                  variant="basic"
                  className="rounded-none p-0"
                  disableBgEffect
                >
                  <FontAwesomeIcon icon={faHome} className="h-4" />
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          variant="basic"
          className="rounded-none p-0"
          onClick={() => setExpand(!expand)}
          disableBgEffect
        >
          <FontAwesomeIcon icon={faList} className="h-4" />
        </Button>
      </div>
    </div>
  );
}
