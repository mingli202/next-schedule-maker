import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";
import { getNextAvailableColorIndex } from "src/lib/colors";
import isValidAdditionToSchedule from "src/lib/schedule/isValidAdditionToSchedule";
import { useSection, useSections } from "./useSection";

export function useSectionInSearchHelper(sectionId: number) {
  const navigate = useNavigate({ from: "/editor" });

  const savedSections = useSearch({
    from: "/editor",
    select: (p) => p.sections,
  });

  const { data: section } = useSection(sectionId);

  const { data: sections, isPending } = useSections(
    savedSections.map((section) => section.sectionId),
  );

  const isSectionIncluded = useCallback(
    () => savedSections.some((s) => s.sectionId === section?.id),
    [savedSections, section],
  );

  const canAddSection = useCallback(() => {
    if (!section || isPending) {
      return false;
    }

    return isValidAdditionToSchedule(section, sections);
  }, [section, sections, isPending]);

  const addSection = useCallback(() => {
    if (!section || isPending) {
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
  }, [section, navigate, canAddSection, isPending]);

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
