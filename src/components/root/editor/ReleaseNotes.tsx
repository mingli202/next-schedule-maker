import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { type MouseEvent, useRef } from "react";
import { versionHistory } from "src/lib/version-history";
import { Button } from "@/components";

type ReleaseNotesProps = {
  shouldOpen: boolean;
  close: () => void;
  semester: string;
};
export default function ReleaseNotes({
  shouldOpen,
  close,
  semester,
}: ReleaseNotesProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  function handleClick(e: MouseEvent) {
    if (!popupRef.current) return;
    if (!(e.target instanceof Node)) return;
    if (popupRef.current.contains(e.target)) return;

    close();
  }

  return (
    <AnimatePresence>
      {shouldOpen ? (
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
            className="border-primary bg-background flex max-h-9/10 w-[min(35rem,80%)] flex-col gap-2 rounded-md border-4 border-solid p-2 md:gap-4 md:p-4"
            ref={popupRef}
          >
            <div className="flex items-center justify-between gap-2 text-xl md:text-2xl">
              <h1>
                What{"'"}s new in {semester}
              </h1>
              <Button variant="basic" className="p-0" onClick={close}>
                <X className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </div>

            <div className="flex flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto">
              {versionHistory.map(([version, details]) => (
                <ul
                  className="bg-secondary/50 shrink-0 list-outside list-disc rounded-sm p-2 [&>li]:ml-6"
                  key={version}
                >
                  <p>{version}</p>
                  {details.map((detail, i) => (
                    <li key={i.toString() + detail}>{detail}</li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
