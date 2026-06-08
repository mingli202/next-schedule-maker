import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { getNextAvailableColorIndex } from "src/lib/colors";
import isValidAdditionToSchedule from "src/lib/schedule/isValidAdditionToSchedule";
import { useSectionStore } from "src/lib/store/section";

export function useSectionInSearchHelper(sectionId: string) {
  const navigate = useNavigate({ from: "/editor" });

  const savedSections = useSearch({
    from: "/editor",
    select: (p) => p.sections,
  });

  const { sectionsById } = useSectionStore();

  const section = sectionsById.get(sectionId);
  const sections = useMemo(
    () =>
      savedSections
        .map((s) => sectionsById.get(s.sectionId))
        .filter((s) => !!s),
    [savedSections, sectionsById],
  );

  const isSectionIncluded = useCallback(
    () => savedSections.some((s) => s.sectionId === section?.id),
    [savedSections, section],
  );

  const canAddSection = useCallback(() => {
    if (!section) {
      return false;
    }

    return isValidAdditionToSchedule(section, sections);
  }, [section, sections]);

  const addSection = useCallback(() => {
    if (!section) {
      return;
    }

    if (canAddSection()) {
      navigate({
        to: ".",
        search: (prev) => ({
          ...prev,
          sections: [
            ...prev.sections,
            {
              sectionId: section.id,
              colorIndex: getNextAvailableColorIndex(prev.sections),
            },
          ],
        }),
      });
    }
  }, [section, navigate, canAddSection]);

  const removeSection = useCallback(() => {
    navigate({
      to: ".",
      search: (prev) => ({
        ...prev,
        sections: prev.sections.filter(
          (section) => section.sectionId !== sectionId,
        ),
      }),
    });
  }, [sectionId, navigate]);

  return {
    addSection,
    isSectionIncluded,
    canAddSection,
    removeSection,
  } as const;
}
