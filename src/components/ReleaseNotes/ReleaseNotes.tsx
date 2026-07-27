import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Sparkles, X } from "lucide-react";
import { type MouseEvent, useRef, useState } from "react";
import SectionCard from "src/components/SectionCard";
import { useReleaseNotes } from "src/hooks";
import { versionHistory } from "src/lib/version-history";
import type { SectionStore } from "src/types";
import Button, { ButtonVariant } from "../Button";
import { LittleButton } from "../LittleButton";
import { ChangedSectionPreviewCard } from "./ChangedSectionPreviewCard";
import { SavedSchedulesDiff } from "./SavedSchedulesDiff";
import { SectionButton } from "./SectionButton";

type ReleaseNotesProps = {
  store: SectionStore;
};
export function ReleaseNotes({ store }: ReleaseNotesProps) {
  const { shouldOpen, open, close } = useReleaseNotes();
  const { semester, comments, filename, sectionsDiff, sectionsById } = store;

  const popupRef = useRef<HTMLDivElement>(null);
  function handleClick(e: MouseEvent) {
    if (!popupRef.current) return;
    if (!(e.target instanceof Node)) return;
    if (popupRef.current.contains(e.target)) return;

    close();
  }

  return (
    <>
      <LittleButton onClick={open}>
        <Sparkles className="h-3 w-3" />
        <span className="hidden md:block">Release notes</span>
      </LittleButton>
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
                  <div className="flex items-center justify-between gap-2">
                    <h1 className="text-xl">
                      What{"'"}s new in {semester}
                    </h1>
                    <Button variant={ButtonVariant.Basic} onClick={close}>
                      <X />
                    </Button>
                  </div>
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

                {sectionsDiff ? (
                  <>
                    <div className="flex shrink-0 flex-col gap-2">
                      <p>
                        Sections added ({sectionsDiff.sectionsAdded.length})
                      </p>
                      {sectionsDiff.sectionsAdded.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {sectionsDiff.sectionsAdded.map((s) => {
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
                      <p>
                        Sections removed ({sectionsDiff.sectionsRemoved.length})
                      </p>
                      {sectionsDiff.sectionsRemoved.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {sectionsDiff.sectionsRemoved.map((s) => (
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
                      <p>
                        Sections changed (
                        {sectionsDiff.previousSectionsChanged.length})
                      </p>
                      {sectionsDiff.previousSectionsChanged.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {sectionsDiff.previousSectionsChanged.map((s) => {
                            const newSection = sectionsById.get(s.id);

                            return (
                              <SectionButton
                                key={s.id}
                                sectionId={s.id}
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
                  </>
                ) : (
                  <div>No diff to the last one</div>
                )}

                <p className="shrink-0 pt-1">
                  (hover on section to see detail)
                </p>

                <LegacyVersions />
              </div>

              <SavedSchedulesDiff
                sectionsRemoved={sectionsDiff?.sectionsRemoved ?? []}
                previousSectionsChanged={
                  sectionsDiff?.previousSectionsChanged ?? []
                }
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function LegacyVersions() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex w-full shrink-0 flex-col gap-2">
      <Button
        variant={ButtonVariant.Basic}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center"
      >
        {open ? (
          <>
            <ChevronUp />
            hide
          </>
        ) : (
          <>
            <ChevronDown />
            view
          </>
        )}{" "}
        legacy versions
      </Button>
      {open &&
        versionHistory.map(([version, details]) => (
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
  );
}
