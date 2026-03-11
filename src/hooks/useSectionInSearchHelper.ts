import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";
import { getNextAvailableColorIndex } from "src/lib/colors";
import isValidAdditionToSchedule from "src/lib/schedule/isValidAdditionToSchedule";
import { useSectionStore } from "src/lib/store/section";

export function useSectionInSearchHelper(sectionId: number) {
  const navigate = useNavigate({ from: "/editor" });

  const savedSections = useSearch({
    from: "/editor",
    select: (p) => p.sections,
  });

  const { sectionsById } = useSectionStore();

  const section = sectionsById[`${sectionId}`];
  const sections = savedSections.map((s) => sectionsById[`${s.sectionId}`]);

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
