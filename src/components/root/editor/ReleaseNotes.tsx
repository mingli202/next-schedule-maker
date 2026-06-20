import { AnimatePresence, motion } from "framer-motion";
import { type MouseEvent, useRef } from "react";
import type { SectionStore } from "src/types";
import type { Section } from "src/types/generated";
import { SavedSchedulesDiff } from "./SavedSchedulesDiff";

// TODO: show the actual diff
const SectionButton = ({ section }: { section: Section }) => {
  return (
    // <Tooltip>
    //   <TooltipTrigger asChild>
    <p className="bg-secondary/50 ring-secondary rounded-sm px-2 py-1 ring">
      {section.id}
    </p>
    //   </TooltipTrigger>
    //   <TooltipContent>
    //     <div>Hello world</div>
    //   </TooltipContent>
    // </Tooltip>
  );
};

type ReleaseNotesProps = {
  shouldOpen: boolean;
  close: () => void;
  store: SectionStore;
};
export default function ReleaseNotes({
  shouldOpen,
  close,
  store,
}: ReleaseNotesProps) {
  const { semester, comments, filename, sectionsDiff, sectionsById } = store;
  const { sectionsAdded, previousSectionsChanged, sectionsRemoved } =
    sectionsDiff;

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
          className="bg-background/50 fixed top-0 left-0 z-9999 flex h-screen w-screen items-center justify-center backdrop-blur-md backdrop-filter"
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
          <div className="flex h-9/10 w-9/10 gap-2" ref={popupRef}>
            <div className="bg-background ring-secondary flex basis-3/5 flex-col gap-6 rounded-md p-14 ring-2">
              <div className="flex flex-col gap-2">
                <h1 className="text-xl">
                  What{"'"}s new in {semester}
                </h1>
                <p>{filename} update</p>
              </div>
              <div className="flex flex-col gap-2">
                {comments.map((comment, i) => (
                  <p key={`${comment}-${i.toString()}`}>{comment}</p>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <p>Sections added ({sectionsAdded.length})</p>
                {sectionsAdded.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {sectionsAdded.map((s) => {
                      const section = sectionsById.get(s);
                      if (!section) {
                        return null;
                      }
                      return <SectionButton key={s} section={section} />;
                    })}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <p>Sections removed ({sectionsRemoved.length})</p>
                {sectionsRemoved.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {sectionsRemoved.map((s) => (
                      <SectionButton key={s.id} section={s} />
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <p>Sections changed ({previousSectionsChanged.length})</p>
                {previousSectionsChanged.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {previousSectionsChanged.map((s) => (
                      <SectionButton key={s.id} section={s} />
                    ))}
                  </div>
                ) : null}
              </div>

              {/* <p>(click on section to see detail)</p> */}
            </div>
            <SavedSchedulesDiff
              sectionsRemoved={sectionsRemoved}
              previousSectionsChanged={previousSectionsChanged}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
