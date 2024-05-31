import { Class, SharedCurrentClasses } from "@/types";
import isValid from "./checkValid";

type ReturnType = [string, Class][];

function filterDown(
  allClasses: Record<string, Class>,
  search: Map<string, string>,
  professors: string[],
  currentClasses: SharedCurrentClasses[],
) {
  if (
    !["prof", "rating", "score", "code", "time", "title", "course", "day"].some(
      (k) => search.has(k),
    )
  ) {
    if (!search.has("q")) return [];
    if (search.get("q") === "") return [];
  }

  let toReturn = Object.entries(allClasses);

  for (const [key, val] of search) {
    if (key === "q" && val === "") continue;
    const allVal = val.split(",").map((v) => v.trim());

    for (let v of allVal) {
      v = v.replaceAll(/[/()\\]|\[|\]/gi, "\\$&");

      switch (key) {
        case "prof":
          toReturn = filterByProfessor(toReturn, v);
          break;

        case "rating":
          toReturn = filterByRating(toReturn, v, "r");
          break;

        case "score":
          toReturn = filterByRating(toReturn, v, "s");
          break;

        case "code":
          toReturn = filterByCode(toReturn, v);
          break;

        case "time":
          toReturn = filterByTime(toReturn, v);
          break;

        case "title":
          toReturn = filterByTitle(toReturn, v);
          break;

        case "course":
          toReturn = filterByCourse(toReturn, v);
          break;

        case "day":
          toReturn = filterByDay(toReturn, v);
          break;

        case "q":
          toReturn = filterByQuery(toReturn, v, professors);
          break;
      }
    }
  }

  if (search.get("checkValid") === "true") {
    toReturn = toReturn.filter(([, cl]) =>
      isValid(cl, currentClasses, allClasses),
    );
  }

  return toReturn;
}

function filterByProfessor(arr: ReturnType, prof: string) {
  if (prof === "") return [];

  const re = new RegExp(prof, "ig");
  return arr.filter(([, cl]) => cl.lecture.prof.match(re));
}

function filterByRating(arr: ReturnType, rating: string, type: "r" | "s") {
  if (rating === "") return [];
  const sign = rating[0];
  const num = Number(rating.slice(1));

  if (!num) return [];

  switch (sign) {
    case "<":
      return arr.filter(([, cl]) => {
        if (type === "r") return cl.lecture.rating.avg < num;
        if (type === "s") return cl.lecture.rating.score < num;
      });
    case ">":
      return arr.filter(([, cl]) => {
        if (type === "r") return cl.lecture.rating.avg > num;
        if (type === "s") return cl.lecture.rating.score > num;
      });
    case "=":
      return arr.filter(([, cl]) => {
        if (type === "r") return cl.lecture.rating.avg === num;
        if (type === "s") return cl.lecture.rating.score === num;
      });
  }

  return [];
}

function filterByCode(arr: ReturnType, code: string) {
  if (code === "") return [];

  const re = new RegExp(code, "ig");
  return arr.filter(([, cl]) => cl.code.match(re));
}

function filterByTime(arr: ReturnType, time: string) {
  if (time === "") return [];

  const [start, end] = time.split("-").map((t) => {
    return Number(t.replaceAll(":", ""));
  });

  const toReturn = arr.filter(([, cl]) => {
    const tArr = [
      ...Object.entries(cl.lecture),
      ...Object.entries(cl.lab),
    ].filter(([key]) => !["prof", "title", "rating"].includes(key));

    return tArr.every(([, t]) => {
      const [tStart, tEnd] = t
        .toString()
        .split("-")
        .map((t) => Number(t));

      return tStart >= start && tEnd <= end;
    });
  });

  return toReturn;
}

function filterByTitle(arr: ReturnType, title: string) {
  if (title === "") return [];

  const re = new RegExp(title, "ig");
  return arr.filter(([, cl]) => cl.lecture.title.match(re));
}

function filterByCourse(arr: ReturnType, courseName: string) {
  if (courseName === "") return [];

  const re = new RegExp(courseName, "ig");
  return arr.filter(([, cl]) => cl.course.match(re));
}

function filterByDay(arr: ReturnType, day: string) {
  if (day === "") return [];

  return arr.filter(([, cl]) => {
    const lectureTime = Object.keys(cl.lecture).filter(
      (t) => !["prof", "rating", "title"].includes(t),
    );
    const labTime = Object.keys(cl.lab).filter(
      (t) => !["prof", "rating", "title"].includes(t),
    );
    const days = lectureTime.join("") + labTime.join("");
    return !day.split("").some((d) => days.includes(d));
  });
}

function filterBySpecialKeywords(arr: ReturnType, special: string) {
  if (special.match(/^blended$/gi)) {
    return arr.filter(([, cl]) => cl.more.startsWith("BLENDED"));
  } else {
    return arr.filter(([, cl]) => cl.more.startsWith("For Honours"));
  }
}

const timeReg = /^\d{1,2}[:h]?\d{2}(-| ?to ?)\d{2}[:h]?\d{2}$/g;
const codeReg = /^\d{3}(-| )?[0-9A-Z]{0,3}(-| )?\w{0,2}$/g;
const ratingReg = /^r[<>=]\d+$/g;
const scoreReg = /^s[<>=]\d+$/g;
const courseReg = /^[A-Z]{2,} *[A-Z ]*$/g;
const dayReg = /^[MTWRF]+ *[MTWRF ]*$/g;

function filterByQuery(arr: ReturnType, query: string, professors: string[]) {
  let tmp = structuredClone(arr);
  const keywords = query.split(",");

  for (const keyword of keywords) {
    // check if code
    if (keyword.match(codeReg)) {
      for (const k of keyword.split(" ")) {
        tmp = filterByCode(tmp, k);
      }
    }

    // check if day
    else if (keyword.match(dayReg)) {
      for (const k of keyword.split(" ")) {
        tmp = filterByDay(tmp, k);
      }
    }
    // check if time
    else if (keyword.match(timeReg)) {
      tmp = filterByTime(tmp, keyword);
    }
    // check if rating
    else if (keyword.match(ratingReg)) {
      tmp = filterByRating(tmp, keyword.slice(1), "r");
    }
    // check if score
    else if (keyword.match(scoreReg)) {
      tmp = filterByRating(tmp, keyword.slice(1), "s");
    }
    // check if course name
    else if (keyword.match(courseReg)) {
      for (const k of keyword.split(" ")) {
        tmp = filterByCourse(tmp, k);
      }
    }
    // check if honours or blended
    else if (keyword.match(/^honours$|^blended$/gi)) {
      tmp = filterBySpecialKeywords(tmp, keyword);
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

  return tmp;
}

export default filterDown;
