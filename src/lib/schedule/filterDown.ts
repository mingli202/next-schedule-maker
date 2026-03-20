import type { SectionResponse } from "src/client";
import type { SectionStore } from "src/types";
import type { SavedSection, SearchSectionParams } from "src/types/schedule";
import { Iter } from "../iter";
import isValidAdditionToSchedule from "./isValidAdditionToSchedule";

const includes = (str: string, substring: string) =>
  str.toLowerCase().includes(substring.toLowerCase());

const startsWith = (str: string, substring: string) =>
  str.toLowerCase().startsWith(substring.toLowerCase());

const normalizeTime = (value: string) => {
  const digits = value.replace(/[:h]/g, "");
  if (!digits.match(/^\d{3,4}$/)) return undefined;
  return digits.length === 3 ? `0${digits}` : digits;
};

/**
 * Section where there exsist one leclab.prof that includes the given prof
 * */
const filterByProfessor = (iter: Iter<SectionResponse>, prof: string) =>
  prof.trim() === ""
    ? iter
    : iter.filter((section) =>
        section.leclabs.some((leclab) => includes(leclab.prof, prof)),
      );

/**
 * Section where every prof of every leclab has a higher avg than minRating
 *
 * Section where there does not exist a leclab such that
 * leclab.rating is undefined or
 * leclab.rating.status is not found or
 * leclab.avg is less than the minRating allowed
 * */
const filterByMinRating = (iter: Iter<SectionResponse>, minRating: number) =>
  iter.filter(
    (section) =>
      !section.leclabs.some(
        (leclab) =>
          !leclab.rating ||
          leclab.rating.status !== "found" ||
          leclab.rating.avg < minRating,
      ),
  );

/**
 * Section where every prof of every leclab has a lower avg than maxRating
 *
 * Section where there does not exist a leclab such that
 * leclab.rating is undefined or
 * leclab.rating.status is not found or
 * leclab.avg is more than the maxRating allowed
 * */
const filterByMaxRating = (iter: Iter<SectionResponse>, maxRating: number) =>
  iter.filter(
    (section) =>
      !section.leclabs.some(
        (leclab) =>
          !leclab.rating ||
          leclab.rating.status !== "found" ||
          leclab.rating.avg > maxRating,
      ),
  );

/**
 * Section whery every prof of every leclab has a higher score than minScore
 *
 * Section where there does not exist a leclab such that
 * leclab.rating is undefined or
 * leclab.rating.status is not found or
 * leclab.score is less than the minScore allowed
 * */
const filterByMinScore = (iter: Iter<SectionResponse>, minScore: number) =>
  iter.filter(
    (section) =>
      !section.leclabs.some(
        (leclab) =>
          !leclab.rating ||
          leclab.rating.status !== "found" ||
          leclab.rating.score < minScore,
      ),
  );

/**
 * Section whery every prof of every leclab has a lower score than maxScore
 *
 * Section where there does not exist a leclab such that
 * leclab.rating is undefined or
 * leclab.rating.status is not found or
 * leclab.score is more than the maxScore allowed
 * */
const filterByMaxScore = (iter: Iter<SectionResponse>, maxScore: number) =>
  iter.filter(
    (section) =>
      !section.leclabs.some(
        (leclab) =>
          !leclab.rating ||
          leclab.rating.status !== "found" ||
          leclab.rating.score > maxScore,
      ),
  );

/**
 * Section where Section.code includes the given code
 * */
const filterByCode = (iter: Iter<SectionResponse>, code: string) =>
  code.trim() === ""
    ? iter
    : iter.filter((section) => includes(section.code, code));

/**
 * Section where every dayTime of every leclab starts after timeStart
 *
 * Section where there does not exist a leclab such that
 * there exist a dayTime such that
 * dayTime.startTimeHhmm is less than the given timeStart
 * */
const filterByTimeStart = (iter: Iter<SectionResponse>, timeStart: string) => {
  const normalized = normalizeTime(timeStart);
  if (!normalized) return iter;

  return iter.filter(
    (section) =>
      !section.leclabs.some((leclab) =>
        leclab.dayTimes.some((dayTime) => dayTime.startTimeHhmm < normalized),
      ),
  );
};

/**
 * Section where every dayTime of every leclab ends before timeEnd
 *
 * Section where there does not exist a leclab such that
 * there exist a dayTime such that
 * dayTime.endTimeHhmm is more than the given timeEnd
 * */
const filterByTimeEnd = (iter: Iter<SectionResponse>, timeEnd: string) => {
  const normalized = normalizeTime(timeEnd);
  if (!normalized) return iter;

  return iter.filter(
    (section) =>
      !section.leclabs.some((leclab) =>
        leclab.dayTimes.some((dayTime) => dayTime.endTimeHhmm > normalized),
      ),
  );
};

/**
 * Blended sections
 * */
const filterByBlended = (iter: Iter<SectionResponse>) =>
  iter.filter((section) => section.more.startsWith("BLENDED"));

/**
 * Honours sections
 * */
const filterByHonours = (iter: Iter<SectionResponse>) =>
  iter.filter((section) => section.more.startsWith("For Honours"));

/**
 * Section with titles that starts with
 * */
const filterByTitle = (iter: Iter<SectionResponse>, title: string) =>
  title.trim() === ""
    ? iter
    : iter.filter((section) => startsWith(section.title, title));

/**
 * Sections with course that starts with
 * */
const filterByCourse = (iter: Iter<SectionResponse>, course: string) =>
  course.trim() === ""
    ? iter
    : iter.filter((section) => startsWith(section.course, course));

/**
 * Sections with domain that starts with
 * */
const filterByDomain = (iter: Iter<SectionResponse>, domain: string) =>
  domain.trim() === ""
    ? iter
    : iter.filter((section) => startsWith(section.domain, domain));

/**
 * Section where there are no leclab that has a day listed in daysOff
 *
 * Section where there does not exist a leclab such that
 * there exist a dayTime such that
 * any day dayTime.day is in daysOff
 * */
const filterByDaysOff = (iter: Iter<SectionResponse>, daysOff: string) =>
  iter.filter(
    (section) =>
      !section.leclabs.some((leclab) =>
        leclab.dayTimes.some((dayTime) =>
          daysOff.split("").some((day) => dayTime.day.includes(day)),
        ),
      ),
  );

const timeReg = /^(\d{1,2}[:h]?\d{2})(-| ?to ?)(\d{2}[:h]?\d{2})$/;
const codeReg = /^\d{3}(-| )?[0-9A-Z]{0,3}(-| )?\w{0,2}$/g;
const domainReg = /^[A-Z]{2,} *[A-Z ]*$/g;
const dayReg = /^[MTWRF]+ *[MTWRF ]*$/g;

/**
 * Filter from a general query q by matching various patterns.
 * */
const filterByQuery = (
  iter: Iter<SectionResponse>,
  q: string,
  professors: string[],
) => {
  const keywords = q.split(/, */);
  let tmp = iter;

  for (const keyword of keywords) {
    const timeMatch = keyword.match(timeReg);
    // check if time
    if (timeMatch) {
      tmp = filterByTimeStart(tmp, timeMatch[1]);
      tmp = filterByTimeEnd(tmp, timeMatch[3]);
    }

    // check if daysOff
    else if (keyword.match(dayReg)) {
      for (const k of keyword.split(" ")) {
        tmp = filterByDaysOff(tmp, k);
      }
    }
    // check if code
    else if (keyword.match(codeReg)) {
      for (const k of keyword.split(" ")) {
        tmp = filterByCode(tmp, k);
      }
    }
    // check if rating
    else if (keyword.startsWith("r>")) {
      const minRating = parseInt(keyword.replace("r>", ""), 10);
      if (!Number.isNaN(minRating)) {
        tmp = filterByMinRating(tmp, minRating);
      }
    } else if (keyword.startsWith("r<")) {
      const maxRating = parseInt(keyword.replace("r<", ""), 10);
      if (!Number.isNaN(maxRating)) {
        tmp = filterByMaxRating(tmp, maxRating);
      }
    }
    // check if score
    else if (keyword.startsWith("s>")) {
      const minScore = parseInt(keyword.replace("s>", ""), 10);
      if (!Number.isNaN(minScore)) {
        tmp = filterByMinScore(tmp, minScore);
      }
    } else if (keyword.startsWith("s<")) {
      const maxScore = parseInt(keyword.replace("s<", ""), 10);
      if (!Number.isNaN(maxScore)) {
        tmp = filterByMaxScore(tmp, maxScore);
      }
    }

    // check if domain name
    else if (keyword.match(domainReg)) {
      for (const k of keyword.split(" ")) {
        tmp = filterByDomain(tmp, k);
      }
    }
    // check if honours or blended
    else if (keyword.toLowerCase() === "blended") {
      tmp = filterByBlended(tmp);
    } else if (keyword.toLowerCase() === "honours") {
      tmp = filterByHonours(tmp);
    }

    // check if user meant to search a professors
    // Will match if at least one professor is 66% matched
    else if (
      keyword
        .split(" ")
        .some((keyword) =>
          professors.some((prof) =>
            prof
              .split(",")
              .some(
                (p) =>
                  p.toLowerCase().includes(keyword.toLowerCase()) &&
                  keyword.length > p.length * (2 / 3),
              ),
          ),
        )
    ) {
      for (const k of keyword.split(" ")) {
        tmp = filterByProfessor(tmp, k);
      }
    }
    // if nothing then search title
    else {
      tmp = tmp.filter((section) =>
        keyword
          .split(" ")
          .filter((s) => s.trim() !== "")
          .every((k) => includes(section.title, k.trim().toLowerCase())),
      );
    }
  }

  return tmp;
};

export function filterDown(
  sectionStore: SectionStore,
  search: SearchSectionParams & { sections: SavedSection[] | undefined },
): SectionResponse[] {
  const {
    q,
    course,
    domain,
    code,
    title,
    prof,
    ratingMin,
    ratingMax,
    scoreMin,
    scoreMax,
    daysOff,
    timeStart,
    timeEnd,
    blended,
    honours,
    sections,
  } = search;

  if (
    !q &&
    !course &&
    !domain &&
    !code &&
    !title &&
    !prof &&
    ratingMin === undefined &&
    ratingMax === undefined &&
    scoreMin === undefined &&
    scoreMax === undefined &&
    !daysOff &&
    !timeStart &&
    !timeEnd &&
    blended === undefined &&
    honours === undefined
  ) {
    return [];
  }

  let iter = Iter.from(sectionStore.sectionsById.values());

  if (q) {
    iter = filterByQuery(iter, q, Array.from(sectionStore.professors));
  }

  if (course) {
    iter = filterByCourse(iter, course);
  }

  if (domain) {
    iter = filterByDomain(iter, domain);
  }

  if (code) {
    iter = filterByCode(iter, code);
  }

  if (title) {
    iter = filterByTitle(iter, title);
  }

  if (prof) {
    iter = filterByProfessor(iter, prof);
  }

  if (ratingMin !== undefined) {
    iter = filterByMinRating(iter, ratingMin);
  }

  if (ratingMax !== undefined) {
    iter = filterByMaxRating(iter, ratingMax);
  }

  if (scoreMin !== undefined) {
    iter = filterByMinScore(iter, scoreMin);
  }

  if (scoreMax !== undefined) {
    iter = filterByMaxScore(iter, scoreMax);
  }

  if (daysOff) {
    iter = filterByDaysOff(iter, daysOff);
  }

  if (timeStart !== undefined) {
    iter = filterByTimeStart(iter, timeStart);
  }

  if (timeEnd !== undefined) {
    iter = filterByTimeEnd(iter, timeEnd);
  }

  if (blended) {
    iter = filterByBlended(iter);
  }

  if (honours) {
    iter = filterByHonours(iter);
  }

  if (sections) {
    const fullSections = sections
      .map((s) => sectionStore.sectionsById.get(s.sectionId))
      .filter((s) => !!s);

    iter = iter.filter((s) => isValidAdditionToSchedule(s, fullSections));
  }

  return iter.collect();
}
