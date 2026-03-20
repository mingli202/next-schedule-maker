import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { type SubmitEvent, useCallback, useMemo, useState } from "react";
import { Button } from "src/components";
import { Field, FieldLabel } from "src/components/ui/field";
import { Input } from "src/components/ui/input";
import { Iter } from "src/lib/iter";
import { useSectionStore } from "src/lib/store/section";
import { SearchSectionParams } from "src/types/schedule";

export const Route = createFileRoute("/editor/filter")({
  component: RouteComponent,
  validateSearch: SearchSectionParams,
});

function RouteComponent() {
  const { sectionsById } = useSectionStore();

  const search = useSearch({ from: "/editor/filter" });
  const navigate = useNavigate({ from: "/editor/filter" });

  const [course, setCourse] = useState(search.course ?? "");
  const [domain, setDomain] = useState(search.domain ?? "");
  const [code, setCode] = useState(search.code ?? "");
  const [title, setTitle] = useState(search.title ?? "");

  const courseNameDatalist = useMemo(
    () => Iter.from(Array.from(sectionsById.values())),
    [sectionsById],
  );

  const domainNameDatalist = useMemo(
    () =>
      courseNameDatalist.filter(
        (section) =>
          course === "" ||
          section.course.toLowerCase().includes(course.toLowerCase()),
      ),
    [courseNameDatalist, course],
  );

  const codeDataList = useMemo(
    () =>
      domainNameDatalist.filter(
        (section) =>
          domain === "" ||
          section.domain.toLowerCase().includes(domain.toLowerCase()),
      ),
    [domainNameDatalist, domain],
  );

  const titleDatalist = useMemo(
    () =>
      codeDataList.filter(
        (section) =>
          code === "" ||
          section.code.toLowerCase().includes(code.toLowerCase()),
      ),
    [codeDataList, code],
  );

  const profDatalist = useMemo(
    () =>
      titleDatalist.filter(
        (section) =>
          title === "" ||
          section.title.toLowerCase().includes(title.toLowerCase()),
      ),
    [title, titleDatalist],
  );

  const handleSubmit = useCallback(
    (e: SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.target);

      const course = formData.get("course")?.toString();
      const domain = formData.get("domain")?.toString();
      const code = formData.get("code")?.toString();
      const title = formData.get("title")?.toString();

      navigate({
        to: "/editor/search",
        search: (prev) => ({
          ...prev,
          course,
          domain,
          code,
          title,
        }),
      });
    },
    [navigate],
  );

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto p-4">
      <form
        className="relative flex w-full flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <Field className="gap-2">
          <FieldLabel htmlFor="course">Course</FieldLabel>
          <Input
            id="course"
            name="course"
            placeholder="e.g. Complementary"
            onChange={(e) => setCourse(e.target.value)}
            list="course-list"
            autoComplete="off"
            type="text"
            value={course}
          />

          <datalist id="course-list">
            {[
              ...new Set(
                courseNameDatalist
                  .map((cl) => cl.course)
                  .filter((c) => c.trim() !== "")
                  .collect()
                  .sort(),
              ),
            ].map((val) => (
              <option value={val} key={val} />
            ))}
          </datalist>
        </Field>

        <Field className="gap-2">
          <FieldLabel htmlFor="domain">Domain</FieldLabel>
          <Input
            id="domain"
            name="domain"
            placeholder="e.g. BIOLOGY"
            onChange={(e) => setDomain(e.target.value)}
            list="domain-list"
            autoComplete="off"
            type="text"
            value={domain}
          />

          <datalist id="domain-list">
            {[
              ...new Set(
                domainNameDatalist
                  .map((cl) => cl.domain)
                  .filter((c) => c.trim() !== "")
                  .collect()
                  .sort(),
              ),
            ].map((val) => (
              <option value={val} key={val} />
            ))}
          </datalist>
        </Field>

        <Field>
          <FieldLabel htmlFor="code">Code</FieldLabel>
          <Input
            name="code"
            id="code"
            placeholder="e.g. 603-103-MQ"
            autoComplete="off"
            onChange={(e) => setCode(e.target.value)}
            list="code-list"
            type="text"
            value={code}
          />
          <datalist id="code-list">
            {[
              ...new Set(
                codeDataList
                  .map((cl) => cl.code)
                  .collect()
                  .sort(),
              ),
            ].map((val) => (
              <option value={val} key={val} />
            ))}
          </datalist>
        </Field>

        <Field>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input
            name="title"
            id="title"
            placeholder="e.g. Hockey is everything"
            autoComplete="off"
            list="c"
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            value={title}
          />
          <datalist id="c">
            {[
              ...new Set(
                titleDatalist
                  .map((cl) => cl.title)
                  .filter((p) => p.trim() !== "")
                  .collect()
                  .sort(),
              ),
            ].map((val) => (
              <option key={val} value={val} />
            ))}
          </datalist>
        </Field>

        <Field>
          <FieldLabel htmlFor="prof">Teacher</FieldLabel>
          <Input
            name="prof"
            id="prof"
            placeholder="e.g. Patrick Burger"
            list="d"
            autoComplete="off"
            defaultValue={search.prof ?? ""}
            type="text"
          />
          <datalist id="d">
            {[
              ...new Set(
                profDatalist
                  .flatMap((section) =>
                    section.leclabs.map((leclab) => leclab.prof),
                  )
                  .filter((p) => p.trim() !== "")
                  .collect()
                  .sort(),
              ),
            ].map((val) => (
              <option value={val} key={val} />
            ))}
          </datalist>
        </Field>

        <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-2">
          <div className="group bg-bg-secondary hover:bg-secondary basis-1/2 rounded-md p-2 transition">
            <h2 className="font-bold">Rating /5</h2>
            <div className="flex items-center gap-4">
              <label htmlFor="ratingMin">
                <input
                  name="ratingMin"
                  id="ratingMin"
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  placeholder="0"
                  defaultValue={search.ratingMin}
                  autoComplete="off"
                />
              </label>
              to
              <label htmlFor="ratingMax">
                <input
                  name="ratingMax"
                  id="ratingMax"
                  className="bg-background group-hover:bg-bg-secondary rounded-md p-2 transition outline-none"
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  placeholder="5"
                  autoComplete="off"
                  defaultValue={search.ratingMax}
                />
              </label>
            </div>
          </div>

          <div className="group bg-bg-secondary hover:bg-secondary basis-1/2 rounded-md p-2 transition">
            <h2 className="font-bold">Score /100</h2>
            <div className="flex items-center gap-4">
              <label htmlFor="scoreMin">
                <input
                  name="scoreMin"
                  id="scoreMin"
                  className="bg-background group-hover:bg-bg-secondary rounded-md p-2 transition outline-none"
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  placeholder="0"
                  autoComplete="off"
                  defaultValue={search.scoreMin}
                />
              </label>
              to
              <label htmlFor="scoreMax">
                <input
                  name="scoreMax"
                  id="scoreMax"
                  className="bg-background group-hover:bg-bg-secondary rounded-md p-2 transition outline-none"
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  placeholder="100"
                  autoComplete="off"
                  defaultValue={search.scoreMax}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="group bg-bg-secondary hover:bg-secondary rounded-md p-2 transition">
          <p className="font-bold">Days Off</p>
          <div className="flex gap-2">
            <label
              htmlFor="M"
              className="bg-background group-hover:bg-bg-secondary flex gap-2 rounded-md p-2"
            >
              <input
                name="day"
                value="M"
                type="checkbox"
                id="M"
                className="outline-none"
                defaultChecked={search.daysOff?.includes("M")}
              />
              M
            </label>
            <label
              htmlFor="T"
              className="bg-background group-hover:bg-bg-secondary flex gap-2 rounded-md p-2"
            >
              <input
                name="day"
                value="T"
                type="checkbox"
                id="T"
                className="outline-none"
                defaultChecked={search.daysOff?.includes("T")}
              />
              T
            </label>
            <label
              htmlFor="W"
              className="bg-background group-hover:bg-bg-secondary flex gap-2 rounded-md p-2"
            >
              <input
                name="day"
                value="W"
                type="checkbox"
                id="W"
                className="outline-none"
                defaultChecked={search.daysOff?.includes("W")}
              />
              W
            </label>
            <label
              htmlFor="R"
              className="bg-background group-hover:bg-bg-secondary flex gap-2 rounded-md p-2"
            >
              <input
                name="day"
                value="R"
                type="checkbox"
                id="R"
                className="outline-none"
                defaultChecked={search.daysOff?.includes("R")}
              />
              R
            </label>
            <label
              htmlFor="F"
              className="bg-background group-hover:bg-bg-secondary flex gap-2 rounded-md p-2"
            >
              <input
                name="day"
                value="F"
                type="checkbox"
                id="F"
                className="outline-none"
                defaultChecked={search.daysOff?.includes("F")}
              />
              F
            </label>
          </div>
        </div>

        <div className="group bg-bg-secondary hover:bg-secondary rounded-md p-2 transition">
          <h2 className="font-bold">Time Range</h2>
          <div className="flex items-center gap-4">
            <label htmlFor="timeMin">
              <input
                name="time"
                id="timeMin"
                className="bg-background group-hover:bg-bg-secondary rounded-md p-2 transition outline-none"
                type="time"
                min="08:00"
                max="18:00"
                step={`${60 * 30}`}
                placeholder="08:00"
                autoComplete="off"
                defaultValue={search.timeStart}
              />
            </label>
            to
            <label htmlFor="timeMax">
              <input
                name="time"
                id="timeMax"
                className="bg-background group-hover:bg-bg-secondary rounded-md p-2 transition outline-none"
                type="time"
                min="08:00"
                max="18:00"
                step={`${60 * 30}`}
                placeholder="18:00"
                autoComplete="off"
                defaultValue={search.timeEnd}
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
              const url = new URL(window.location.href);

              [
                "prof",
                "rating",
                "score",
                "code",
                "time",
                "title",
                "course",
                "day",
              ].forEach((query) => {
                url.searchParams.delete(query);
              });

              [
                "M",
                "T",
                "W",
                "R",
                "F",
                "prof",
                "timeMin",
                "timeMax",
                "scoreMin",
                "scoreMax",
                "ratingMin",
                "ratingMax",
              ].forEach((id) => {
                const el = document.getElementById(id) as HTMLInputElement;
                el.defaultChecked = false;
                el.defaultValue = "";
              });

              setCourse("");
              setCode("");
              setTitle("");
            }}
          >
            Clear
          </Button>

          <Button variant="special" type="submit">
            Apply
          </Button>
        </div>
      </form>
    </div>
  );
}
