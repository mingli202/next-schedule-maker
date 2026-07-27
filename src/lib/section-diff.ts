import type {
  DayTime,
  LecLab,
  Section,
  SectionsDiff,
} from "src/types/generated";

/**
 * Gets the diff between the old and new sections_by_id
 * */
export function getSectionsDiff(
  old_sections_by_id: Map<string, Section>,
  new_sections_by_id: Map<string, Section>,
): SectionsDiff {
  const sectionsAdded: string[] = [];
  const sectionsRemoved: Section[] = [];
  const previousSectionsChanged: Section[] = [];

  for (const [id, oldSection] of old_sections_by_id.entries()) {
    const newSection = new_sections_by_id.get(id);

    if (!newSection) {
      sectionsRemoved.push(oldSection);
    } else if (!isEqual(oldSection, newSection)) {
      previousSectionsChanged.push(oldSection);
    }
  }

  for (const id of new_sections_by_id.keys()) {
    if (!old_sections_by_id.has(id)) {
      sectionsAdded.push(id);
    }
  }

  return {
    previousSectionsChanged,
    sectionsAdded,
    sectionsRemoved,
  };
}

/**
 * Checks whether the given old and new sections are the same after removing
 * the teacher's rating
 * */
function isEqual(oldSection: Section, newSection: Section): boolean {
  return (
    oldSection.id === newSection.id &&
    oldSection.course === newSection.course &&
    // oldSection.section === newSection.section && // covered by id
    oldSection.domain === newSection.domain &&
    // oldSection.code === newSection.course && // covered by id
    oldSection.title === newSection.title &&
    isArrayEqual(oldSection.leclabs, newSection.leclabs, isLeclabEqual) &&
    oldSection.more === newSection.more
  );
}

/**
 * Whether the two given leclabs are equal
 * */
function isLeclabEqual(oldLeclab: LecLab, newlecLab: LecLab): boolean {
  return (
    oldLeclab.title === newlecLab.title &&
    oldLeclab.type === newlecLab.type &&
    oldLeclab.prof === newlecLab.prof &&
    isArrayEqual(oldLeclab.dayTimes, newlecLab.dayTimes, isDayTimeEqual)
  );
}

/**
 * Whether the two given daytimes are equal
 * */
function isDayTimeEqual(oldDayTime: DayTime, newDayTime: DayTime): boolean {
  return (
    oldDayTime.day === newDayTime.day &&
    oldDayTime.startTimeHhmm === newDayTime.startTimeHhmm &&
    oldDayTime.endTimeHhmm === newDayTime.endTimeHhmm
  );
}

/**
 * Wether two arrays are equal
 * */
function isArrayEqual<T>(
  arrA: T[],
  arrB: T[],
  isEqualFn: (a: T, b: T) => boolean,
): boolean {
  if (arrA.length !== arrB.length) {
    return false;
  }

  for (let i = 0; i < arrA.length; i++) {
    if (!isEqualFn(arrA[i], arrB[i])) {
      return false;
    }
  }

  return true;
}
