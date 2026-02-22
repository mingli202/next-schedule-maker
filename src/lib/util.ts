import type { SectionResponse } from "@/client";

export function capitalize(s: string): string {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}

export function getSectionFromSortedListWithId(
  sectionId: number,
  sortedSections: SectionResponse[],
): SectionResponse | null {
  let l = 0;
  let r = sortedSections.length - 1;

  while (l < r) {
    const mid = Math.floor((l + r) / 2);
    const section = sortedSections[mid];

    if (sectionId < section.id) {
      r = mid - 1;
    } else if (sectionId > section.id) {
      l = mid + 1;
    } else {
      return section;
    }
  }

  return null;
}
