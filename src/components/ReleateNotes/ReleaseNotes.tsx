import { AnimatePresence, motion } from "framer-motion";
import { type MouseEvent, useRef } from "react";
import SectionCard from "src/components/SectionCard";
import type { SectionStore } from "src/types";
import { ChangedSectionPreviewCard } from "./ChangedSectionPreviewCard";
import { SavedSchedulesDiff } from "./SavedSchedulesDiff";
import { SectionButton } from "./SectionButton";

type ReleaseNotesProps = {
  shouldOpen: boolean;
  close: () => void;
  store: SectionStore;
};
export function ReleaseNotes({ shouldOpen, close, store }: ReleaseNotesProps) {
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
          className="bg-background/50 fixed top-0 left-0 z-40 flex h-screen w-screen items-start justify-center overflow-x-hidden overflow-y-auto py-4 backdrop-blur-md backdrop-filter md:items-center md:overflow-hidden md:py-0"
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
            className="flex w-9/10 gap-2 max-md:flex-col md:h-9/10"
            ref={popupRef}
          >
            <div className="bg-background ring-secondary flex flex-col gap-4 overflow-x-hidden rounded-md p-10 ring-2 max-md:max-h-[65vh] max-md:overflow-y-auto md:basis-3/5 md:gap-6 md:p-14">
              <div className="flex shrink-0 flex-col gap-2">
                <h1 className="text-xl">
                  What{"'"}s new in {semester}
                </h1>
                <p className="flex items-baseline gap-1">
                  <span className="truncate">{filename}</span>
                  <span className="shrink-0">update</span>
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                {comments.map((comment, i) => (
                  <p key={`${comment}-${i.toString()}`}>{comment}</p>
                ))}
              </div>

              <div className="flex shrink-0 flex-col gap-2">
                <p>Sections added ({sectionsAdded.length})</p>
                {sectionsAdded.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {sectionsAdded.map((s) => {
                      const section = sectionsById.get(s);
                      if (!section) {
                        return null;
                      }
                      return (
                        <SectionButton
                          key={s}
                          sectionId={section.id}
                          content={<SectionCard section={section} />}
                        />
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <div className="flex shrink-0 flex-col gap-2">
                <p>Sections removed ({sectionsRemoved.length})</p>
                {sectionsRemoved.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {sectionsRemoved.map((s) => (
                      <SectionButton
                        key={s.id}
                        sectionId={s.id}
                        content={<SectionCard section={s} />}
                      />
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex shrink-0 flex-col gap-2">
                <p>Sections changed ({previousSectionsChanged.length})</p>
                {previousSectionsChanged.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {previousSectionsChanged.map((s) => {
                      const newSection = sectionsById.get(s.id);
                      const section = newSection ?? s;

                      return (
                        <SectionButton
                          key={s.id}
                          sectionId={section.id}
                          content={
                            newSection ? (
                              <ChangedSectionPreviewCard
                                oldSection={s}
                                newSection={newSection}
                              />
                            ) : (
                              <SectionCard section={s} />
                            )
                          }
                        />
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <p className="shrink-0 pt-1">(hover on section to see detail)</p>
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
