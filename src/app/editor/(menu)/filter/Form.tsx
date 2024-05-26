"use client";

import { Class } from "@/types";
import { Button } from "@/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type Props = {
  allClasses: Record<string, Class>;
};

const Form = ({ allClasses }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [courseName, setCourseName] = useState(
    searchParams.get("course") ?? "",
  );
  const [code, setCode] = useState(searchParams.get("code") ?? "");
  const [title, setTitle] = useState(searchParams.get("title") ?? "");

  const courseNameDatalist = useMemo(
    () => Object.values(allClasses),
    [allClasses],
  );

  const codeDataList = useMemo(
    () =>
      courseNameDatalist.filter((cl) => {
        const courseRe = new RegExp(courseName, "gi");
        return cl.course.match(courseRe);
      }),
    [courseNameDatalist, courseName],
  );

  const titleDatalist = useMemo(
    () =>
      codeDataList.filter((cl) => {
        const codeRe = new RegExp(code, "gi");
        return cl.code.match(codeRe);
      }),
    [codeDataList, code],
  );

  const profDatalist = useMemo(
    () =>
      titleDatalist.filter((cl) => {
        const titleRe = new RegExp(title, "gi");
        return cl.lecture.title.match(titleRe);
      }),
    [title, titleDatalist],
  );

  const action = (formData: FormData) => {
    const url = new URL(window.location.href);

    const days = formData.getAll("day");
    if (days.length === 0) {
      url.searchParams.delete("day");
    } else {
      url.searchParams.set("day", days.join(""));
    }

    const time = formData.getAll("time");
    if (time.length === 0 || time.some((t) => t === "")) {
      url.searchParams.delete("time");
    } else {
      url.searchParams.set("time", time.map((t) => t.slice(0, 5)).join("-"));
    }

    formData.delete("day");
    formData.delete("time");

    for (const [key, val] of formData.entries()) {
      if (val === "") url.searchParams.delete(key);
      else {
        switch (key) {
          case "ratingMin":
            url.searchParams.set("rating", `>${val.toString()}`);
            break;
          case "ratingMax":
            url.searchParams.set("rating", `<${val.toString()}`);
            break;
          case "scoreMin":
            url.searchParams.set("score", `>${val.toString()}`);
            break;
          case "scoreMax":
            url.searchParams.set("score", `>${val.toString()}`);
            break;
          default:
            url.searchParams.set(key, val.toString());
            break;
        }
      }
    }

    router.push(`/editor/search?${url.searchParams}`);
  };

  return (
    <form
      className="relative flex h-full w-full flex-col gap-2 overflow-y-auto overflow-x-hidden"
      action={action}
    >
      <label
        className="group rounded-md bg-bgSecondary p-2 transition hover:bg-secondary"
        htmlFor="course"
      >
        <h2 className="font-bold">Course Name</h2>
        <input
          name="course"
          id="course"
          className="w-full rounded-md bg-bgPrimary p-2 outline-none transition group-hover:bg-bgSecondary"
          placeholder="e.g. English"
          onChange={(e) => setCourseName(e.target.value)}
          list="a"
          autoComplete="off"
          type="text"
          value={courseName}
        />
        <datalist id="a">
          {[...new Set(courseNameDatalist.map((cl) => cl.course).sort())].map(
            (val) => (
              <option value={val} key={val} />
            ),
          )}
        </datalist>
      </label>

      <label
        className="group rounded-md bg-bgSecondary p-2 transition hover:bg-secondary"
        htmlFor="code"
      >
        <h2 className="font-bold">Code</h2>
        <input
          name="code"
          id="code"
          className="w-full rounded-md bg-bgPrimary p-2 outline-none transition group-hover:bg-bgSecondary"
          placeholder="e.g. 603-103-MQ"
          autoComplete="off"
          onChange={(e) => setCode(e.target.value)}
          list="b"
          type="text"
          value={code}
        />
        <datalist id="b">
          {[...new Set(codeDataList.map((cl) => cl.code).sort())].map((val) => (
            <option value={val} key={val} />
          ))}
        </datalist>
      </label>

      <label
        className="group rounded-md bg-bgSecondary p-2 transition hover:bg-secondary"
        htmlFor="title"
      >
        <h2 className="font-bold">Title</h2>
        <input
          name="title"
          id="title"
          className="w-full rounded-md bg-bgPrimary p-2 outline-none transition group-hover:bg-bgSecondary"
          placeholder="e.g. Hockey is everything"
          autoComplete="off"
          list="c"
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          value={title}
        />
        <datalist id="c">
          {[...new Set(titleDatalist.map((cl) => cl.lecture.title).sort())].map(
            (val) => (
              <option key={val} value={val} />
            ),
          )}
        </datalist>
      </label>

      <label
        className="group rounded-md bg-bgSecondary p-2 transition hover:bg-secondary"
        htmlFor="prof"
      >
        <h2 className="font-bold">Teacher</h2>
        <input
          name="prof"
          id="prof"
          className="w-full rounded-md bg-bgPrimary p-2 outline-none transition group-hover:bg-bgSecondary"
          placeholder="e.g. Patrick Burger"
          list="d"
          autoComplete="off"
          defaultValue={searchParams.get("prof") ?? ""}
          type="text"
        />
        <datalist id="d">
          {[...new Set(profDatalist.map((cl) => cl.lecture.prof).sort())].map(
            (val) => (
              <option value={val} key={val} />
            ),
          )}
        </datalist>
      </label>

      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-2">
        <div className="group basis-1/2 rounded-md bg-bgSecondary p-2 transition hover:bg-secondary">
          <h2 className="font-bold">Rating /5</h2>
          <div className="flex items-center gap-4">
            <label htmlFor="ratingMin">
              <input
                name="ratingMin"
                id="ratingMin"
                className="rounded-md bg-bgPrimary p-2 outline-none transition group-hover:bg-bgSecondary"
                type="number"
                min={0}
                max={5}
                step={0.1}
                placeholder="0"
                defaultValue={
                  searchParams
                    .get("rating")
                    ?.match(/>\d+/)?.[0]
                    .replace(">", "") ?? ""
                }
                autoComplete="off"
              />
            </label>
            to
            <label htmlFor="ratingMax">
              <input
                name="ratingMax"
                id="ratingMax"
                className="rounded-md bg-bgPrimary p-2 outline-none transition group-hover:bg-bgSecondary"
                type="number"
                min={0}
                max={5}
                step={0.1}
                placeholder="5"
                autoComplete="off"
                defaultValue={
                  searchParams
                    .get("rating")
                    ?.match(/<\d+/)?.[0]
                    .replace("<", "") ?? ""
                }
              />
            </label>
          </div>
        </div>

        <div className="group basis-1/2 rounded-md bg-bgSecondary p-2 transition hover:bg-secondary">
          <h2 className="font-bold">Score /100</h2>
          <div className="flex items-center gap-4">
            <label htmlFor="scoreMin">
              <input
                name="scoreMin"
                id="scoreMin"
                className="rounded-md bg-bgPrimary p-2 outline-none transition group-hover:bg-bgSecondary"
                type="number"
                min={0}
                max={100}
                step={1}
                placeholder="0"
                autoComplete="off"
                defaultValue={
                  searchParams
                    .get("score")
                    ?.match(/>\d+/)?.[0]
                    .replace(">", "") ?? ""
                }
              />
            </label>
            to
            <label htmlFor="scoreMax">
              <input
                name="scoreMax"
                id="scoreMax"
                className="rounded-md bg-bgPrimary p-2 outline-none transition group-hover:bg-bgSecondary"
                type="number"
                min={0}
                max={100}
                step={1}
                placeholder="100"
                autoComplete="off"
                defaultValue={
                  searchParams
                    .get("score")
                    ?.match(/<\d+/)?.[0]
                    .replace("<", "") ?? ""
                }
              />
            </label>
          </div>
        </div>
      </div>

      <div className="group rounded-md bg-bgSecondary p-2 transition hover:bg-secondary">
        <p className="font-bold">Days (Has class on these days)</p>
        <div className="flex gap-2">
          <label
            htmlFor="M"
            className="flex gap-2 rounded-md bg-bgPrimary p-2 group-hover:bg-bgSecondary"
          >
            <input
              name="day"
              value="M"
              type="checkbox"
              id="M"
              className="outline-none"
              defaultChecked={searchParams.get("day")?.includes("M")}
            />
            M
          </label>
          <label
            htmlFor="T"
            className="flex gap-2 rounded-md bg-bgPrimary p-2 group-hover:bg-bgSecondary"
          >
            <input
              name="day"
              value="T"
              type="checkbox"
              id="T"
              className="outline-none"
              defaultChecked={searchParams.get("day")?.includes("T")}
            />
            T
          </label>
          <label
            htmlFor="W"
            className="flex gap-2 rounded-md bg-bgPrimary p-2 group-hover:bg-bgSecondary"
          >
            <input
              name="day"
              value="W"
              type="checkbox"
              id="W"
              className="outline-none"
              defaultChecked={searchParams.get("day")?.includes("W")}
            />
            W
          </label>
          <label
            htmlFor="R"
            className="flex gap-2 rounded-md bg-bgPrimary p-2 group-hover:bg-bgSecondary"
          >
            <input
              name="day"
              value="R"
              type="checkbox"
              id="R"
              className="outline-none"
              defaultChecked={searchParams.get("day")?.includes("R")}
            />
            R
          </label>
          <label
            htmlFor="F"
            className="flex gap-2 rounded-md bg-bgPrimary p-2 group-hover:bg-bgSecondary"
          >
            <input
              name="day"
              value="F"
              type="checkbox"
              id="F"
              className="outline-none"
              defaultChecked={searchParams.get("day")?.includes("F")}
            />
            F
          </label>
        </div>
      </div>

      <div className="group rounded-md bg-bgSecondary p-2 transition hover:bg-secondary">
        <h2 className="font-bold">Time Range</h2>
        <div className="flex items-center gap-4">
          <label htmlFor="timeMin">
            <input
              name="time"
              id="timeMin"
              className="rounded-md bg-bgPrimary p-2 outline-none transition group-hover:bg-bgSecondary"
              type="time"
              min="08:00"
              max="18:00"
              step={`${60 * 30}`}
              placeholder="08:00"
              autoComplete="off"
              defaultValue={searchParams.get("time")?.split("-")[0]}
            />
          </label>
          to
          <label htmlFor="timeMax">
            <input
              name="time"
              id="timeMax"
              className="rounded-md bg-bgPrimary p-2 outline-none transition group-hover:bg-bgSecondary"
              type="time"
              min="08:00"
              max="18:00"
              step={`${60 * 30}`}
              placeholder="18:00"
              autoComplete="off"
              defaultValue={searchParams.get("time")?.split("-")[1]}
            />
          </label>
        </div>
      </div>

      <div>
        <p className="text-center">
          Narrow search results by specifying what you want. Leaving an entry
          blank will not filter for that entry.
        </p>
      </div>

      <div className="flex justify-end gap-2 p-2">
        <Button
          variant="basic"
          type="reset"
          onClick={() => {
            ["M", "T", "W", "R", "F"].forEach((day) => {
              const el = document.getElementById(day) as HTMLInputElement;
              el.checked = false;
            });

            setCourseName("");
            setCode("");
            setTitle("");

            const prof = document.getElementById("prof") as HTMLInputElement;
            prof.defaultValue = "";

            const timeMin = document.getElementById(
              "timeMin",
            ) as HTMLInputElement;
            timeMin.defaultValue = "";

            const timeMax = document.getElementById(
              "timeMax",
            ) as HTMLInputElement;
            timeMax.defaultValue = "";
          }}
        >
          Clear
        </Button>

        <Button variant="special" type="submit">
          Apply
        </Button>
      </div>
    </form>
  );
};

export default Form;
