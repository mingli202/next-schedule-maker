import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { type SubmitEvent, useCallback, useMemo, useState } from "react";
import { Button } from "src/components";
import { Field, FieldGroup, FieldLabel } from "src/components/ui/field";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
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
      const prof = formData.get("prof")?.toString();
      const ratingMin = parseNumberOrUndefined(
        formData.get("ratingMin")?.toString() ?? "",
      );
      const ratingMax = parseNumberOrUndefined(
        formData.get("ratingMax")?.toString() ?? "",
      );
      const scoreMin = parseNumberOrUndefined(
        formData.get("scoreMin")?.toString() ?? "",
      );
      const scoreMax = parseNumberOrUndefined(
        formData.get("scoreMax")?.toString() ?? "",
      );
      const timeStart = formData.get("timeStart")?.toString();
      const timeEnd = formData.get("timeEnd")?.toString();
      const daysOff = formData.getAll("day").join("");
      const honours = formData.get("honours")?.toString() === "on";
      const blended = formData.get("blended")?.toString() === "on";

      navigate({
        to: "/editor/search",
        search: (prev) => ({
          ...prev,
          course: !course || course.trim() === "" ? undefined : course,
          domain: !domain || domain.trim() === "" ? undefined : domain,
          code: !code || code.trim() === "" ? undefined : code,
          title: !title || title.trim() === "" ? undefined : title,
          prof: !prof || prof.trim() === "" ? undefined : prof,
          ratingMin,
          ratingMax,
          scoreMin,
          scoreMax,
          timeStart:
            !timeStart || timeStart.trim() === "" ? undefined : timeStart,
          timeEnd: !timeEnd || timeEnd.trim() === "" ? undefined : timeEnd,
          daysOff: !daysOff || daysOff.trim() === "" ? undefined : daysOff,
          honours: honours ? true : undefined,
          blended: blended ? true : undefined,
        }),
      });
    },
    [navigate],
  );

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 pb-0">
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

        <Field className="gap-2">
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

        <Field className="gap-2">
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

        <Field className="gap-2">
          <FieldLabel htmlFor="prof">Teacher</FieldLabel>
          <Input
            name="prof"
            id="prof"
            placeholder="e.g. Patrick Burger"
            list="d"
            autoComplete="off"
            defaultValue={search.prof}
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

        <FieldGroup className="grid w-full grid-cols-2 gap-4">
          <Field className="gap-2">
            <FieldLabel htmlFor="ratingMin">Min rating</FieldLabel>
            <Input
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
          </Field>
          <Field className="gap-2">
            <FieldLabel htmlFor="ratingMax">Max rating</FieldLabel>
            <Input
              name="ratingMax"
              id="ratingMax"
              type="number"
              min={0}
              max={5}
              step={0.1}
              placeholder="5"
              defaultValue={search.ratingMax}
              autoComplete="off"
            />
          </Field>
          <Field className="gap-2">
            <FieldLabel htmlFor="scoreMin">Min score</FieldLabel>
            <Input
              name="scoreMin"
              id="scoreMin"
              type="number"
              min={0}
              max={100}
              step={1}
              placeholder="0"
              defaultValue={search.scoreMin}
              autoComplete="off"
            />
          </Field>
          <Field className="gap-2">
            <FieldLabel htmlFor="scoreMax">Max score</FieldLabel>
            <Input
              name="scoreMax"
              id="scoreMax"
              type="number"
              min={0}
              max={100}
              step={1}
              placeholder="5"
              defaultValue={search.scoreMax}
              autoComplete="off"
            />
          </Field>

          <Field className="gap-2">
            <FieldLabel htmlFor="timeStart">Start Time</FieldLabel>
            <Input
              type="time"
              id="timeStart"
              name="timeStart"
              min="08:00"
              max="18:00"
              step={`${60 * 30}`}
              placeholder="08:00"
              autoComplete="off"
              defaultValue={search.timeStart}
            />
          </Field>

          <Field className="gap-2">
            <FieldLabel htmlFor="timeEnd">End Time</FieldLabel>
            <Input
              type="time"
              id="timeEnd"
              name="timeEnd"
              min="08:00"
              max="18:00"
              step={`${60 * 30}`}
              placeholder="18:00"
              autoComplete="off"
              defaultValue={search.timeEnd}
            />
          </Field>
        </FieldGroup>

        <FieldGroup className="gap-2">
          <FieldLabel>Days off</FieldLabel>
          <div className="flex flex-wrap items-center gap-3">
            {["M", "T", "W", "R", "F"].map((day) => (
              <Label key={day} htmlFor={day}>
                <span>{day}</span>
                <input
                  name="day"
                  value={day}
                  type="checkbox"
                  id={day}
                  defaultChecked={search.daysOff?.includes(day)}
                  className="accent-primary h-4 w-4"
                />
              </Label>
            ))}
          </div>
        </FieldGroup>

        <div className="flex flex-wrap items-center gap-3">
          <Label htmlFor="honours">
            <span>Honours</span>
            <input
              name="honours"
              type="checkbox"
              id="honours"
              defaultChecked={search.honours}
              className="accent-primary h-4 w-4"
            />
          </Label>
          <Label htmlFor="blended">
            <span>Blended</span>
            <input
              name="blended"
              type="checkbox"
              id="blended"
              defaultChecked={search.blended}
              className="accent-primary h-4 w-4"
            />
          </Label>
        </div>

        <div className="bg-background sticky bottom-0 flex justify-end gap-2 pb-4">
          <Button
            variant="basic"
            type="reset"
            onClick={() => {
              navigate({
                to: ".",
                search: (prev) => ({
                  sections: prev.sections,
                  previewSectionId: prev.previewSectionId,
                  activeSearch: prev.activeSearch,
                  excludeInvalid: prev.excludeInvalid,
                }),
              });

              setCourse("");
              setTitle("");
              setCode("");
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

const parseNumberOrUndefined = (n: string) => {
  try {
    const num = Number(n);
    return Number.isNaN(num) ? undefined : num;
  } catch {
    return undefined;
  }
};
