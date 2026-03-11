import type { SectionResponse } from "src/client";
import type { SectionStore } from "src/types";
import type { SearchSectionParams } from "src/types/schedule";
import { Iter } from "../iter";

const isBlank = (str: string | undefined) =>
  str === undefined || str.trim().length === 0;

const includes = (str: string, substring: string) =>
  str.toLowerCase().includes(substring.toLowerCase());

const startsWith = (str: string, substring: string) =>
  str.toLowerCase().startsWith(substring.toLowerCase());

const filterByProfessor = (iter: Iter<SectionResponse>, prof: string) =>
  prof.trim() === ""
    ? iter
    : iter.filter((section) =>
        section.leclabs.some((leclab) => includes(leclab.prof, prof)),
      );

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

const filterByCode = (iter: Iter<SectionResponse>, code: string) =>
  code.trim() === ""
    ? iter
    : iter.filter((section) => includes(section.code, code));

const filterByTimeStart = (iter: Iter<SectionResponse>, timeStart: string) =>
  !timeStart.match(/\d{4}/)
    ? iter
    : iter.filter(
        (section) =>
          !section.leclabs.some((leclab) =>
            leclab.dayTimes.some(
              (dayTime) => dayTime.startTimeHhmm < timeStart,
            ),
          ),
      );

const filterByTimeEnd = (iter: Iter<SectionResponse>, timeEnd: string) =>
  !timeEnd.match(/\d{4}/)
    ? iter
    : iter.filter(
        (section) =>
          !section.leclabs.some((leclab) =>
            leclab.dayTimes.some((dayTime) => dayTime.endTimeHhmm > timeEnd),
          ),
      );

const filterByBlended = (iter: Iter<SectionResponse>) =>
  iter.filter((section) => section.more.startsWith("BLENDED"));

const filterByHonours = (iter: Iter<SectionResponse>) =>
  iter.filter((section) => section.more.startsWith("For Honours"));

const filterByTitle = (iter: Iter<SectionResponse>, title: string) =>
  title.trim() === ""
    ? iter
    : iter.filter((section) => startsWith(section.title, title));

const filterByCourse = (iter: Iter<SectionResponse>, course: string) =>
  course.trim() === ""
    ? iter
    : iter.filter((section) => startsWith(section.course, course));

const filterByDomain = (iter: Iter<SectionResponse>, domain: string) =>
  domain.trim() === ""
    ? iter
    : iter.filter((section) => startsWith(section.domain, domain));

const filterByDaysOff = (iter: Iter<SectionResponse>, daysOff: string) =>
  iter.filter(
    (section) =>
      !section.leclabs.some((leclab) =>
        leclab.dayTimes.some((dayTime) =>
          daysOff.split("").some((day) => dayTime.day.includes(day)),
        ),
      ),
  );

const timeReg = /^(\d{1,2}[:h]?\d{2})(-| ?to ?)(\d{2}[:h]?\d{2})$/g;
const codeReg = /^\d{3}(-| )?[0-9A-Z]{0,3}(-| )?\w{0,2}$/g;
const domainReg = /^[A-Z]{2,} *[A-Z ]*$/g;
const dayReg = /^[MTWRF]+ *[MTWRF ]*$/g;

const filterByQuery = (
  iter: Iter<SectionResponse>,
  q: string,
  professors: string[],
) => {
  const keywords = q.split(",");
  let tmp = iter;

  for (const keyword of keywords) {
    const timeMatch = keyword.match(timeReg);
    // check if time
    if (timeMatch) {
      tmp = filterByTimeStart(tmp, timeMatch[0]);
      tmp = filterByTimeEnd(tmp, timeMatch[2]);
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
        tmp = filterByCourse(tmp, k);
      }
    }
    // check if honours or blended
    else if (keyword.toLowerCase() === "blended") {
      tmp = filterByBlended(tmp);
    } else if (keyword.toLowerCase() === "honours") {
      tmp = filterByHonours(tmp);
    }

    // check if user meant to search a professors
    else if (
      keyword.split(" ").some((keyword) => {
        return professors.some((prof) => {
          return prof.split(",").some((p) => {
            const re = new RegExp(keyword, "ig");
            return p.match(re) && keyword.length > p.length * (2 / 3);
          });
        });
      })
    ) {
      for (const k of keyword.split(" ")) {
        tmp = filterByProfessor(tmp, k);
      }
    }
    // if nothing then search title
    else {
      for (const k of keyword.split(" ")) {
        tmp = filterByTitle(tmp, k);
      }
    }
  }

  return iter;
};

export function filterDown(
  sectionStore: SectionStore,
  search: SearchSectionParams,
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
  } = search;

  if (
    isBlank(q) &&
    isBlank(course) &&
    isBlank(domain) &&
    isBlank(code) &&
    isBlank(title) &&
    isBlank(prof) &&
    ratingMin === undefined &&
    ratingMax === undefined &&
    scoreMin === undefined &&
    scoreMax === undefined &&
    isBlank(daysOff) &&
    isBlank(timeStart) &&
    isBlank(timeEnd) &&
    blended === undefined &&
    honours === undefined
  ) {
    return [];
  }

  let iter = Iter.from(Object.values(sectionStore.sectionsById));

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

  return iter.collect();
}
