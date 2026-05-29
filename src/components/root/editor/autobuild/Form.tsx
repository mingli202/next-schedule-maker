import { useSearch } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useCallback, useMemo, useRef } from "react";
import { useSectionStore } from "src/lib/store/section";
import type { Code } from "src/types/autobuild";
import Button from "@/components/Button";

type Props = {
  codes: Code[];
  setCodes: (u: Code[]) => void;
  useCurrent: boolean;
};

export default function CodesForm({ codes, setCodes, useCurrent }: Props) {
  const ref = useRef<HTMLFormElement>(null);

  const { sectionsById } = useSectionStore();

  const currentSections = useSearch({
    from: "/editor/autobuild",
    select: (s) => s.sections,
  });

  const currentCodes = currentSections
    .map((cl) => sectionsById.get(cl.sectionId)?.code)
    .filter((s) => s !== undefined);

  const codesDatalist = useMemo(
    () => [
      ...new Set(
        Array.from(sectionsById.values())
          .map((cl) => cl.code)
          .filter(
            (code) =>
              !codes.some((c) => c.code === code) &&
              (!useCurrent || !currentCodes.includes(code)),
          ),
      ),
    ],
    [sectionsById, codes, currentCodes, useCurrent],
  );

  function action(formdata: FormData) {
    if (!ref.current) {
      return;
    }
    ref.current.reset();

    const newInput = formdata.get("extraCode");
    if (!newInput) return;
    if (!codesDatalist.includes(newInput.toString())) {
      alert("Invlid code");
      return;
    }

    const updatedCodes = [...codes, { code: newInput.toString() }];

    setCodes(updatedCodes);
  }

  function openDialog(code: string, type: string) {
    const dialog = document.getElementById(
      `${type}dialog${code}`,
    )! as HTMLDivElement;
    dialog.style.display = "flex";

    const body = document.querySelector("body")!;

    const f = () => {
      dialog.style.display = "none";
      body.removeEventListener("click", f);
    };

    body.addEventListener("click", f);
  }

  return (
    <>
      {codes.map((code) => {
        const classes = Array.from(sectionsById.values()).filter(
          (cl) => cl.code === code.code,
        );

        const professors = [
          ...new Set(
            classes.flatMap((section) =>
              section.leclabs.map((leclab) => leclab.prof),
            ),
          ),
        ]
          .toSorted()
          .filter((p) => p !== "");

        return (
          <div
            key={code.code}
            className="bg-secondary/50 hover:bg-secondary flex flex-col rounded-md p-2 transition **:outline-none"
          >
            <div className="flex items-center justify-between">
              <p className="font-bold">{code.code}</p>
              <Button
                variant="basic"
                onClick={() => {
                  const updatedCodes = codes.filter((c) => c !== code);
                  setCodes(updatedCodes);
                }}
                className="w-fit p-0"
              >
                Remove
              </Button>
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                openDialog(code.code, "teacher");
              }}
            >
              <p className="cursor-pointer hover:underline">
                teachers:{" "}
                {code.professors && code.professors.length > 0
                  ? code.professors.join("; ")
                  : "any (click to edit)"}
              </p>

              <form
                id={"teacherdialog" + code.code}
                className="bg-primary absolute z-10 hidden flex-col rounded-md p-2 text-black no-underline shadow shadow-black"
              >
                {professors.map((p) => (
                  <label key={p} className="flex gap-1">
                    <input
                      type="checkbox"
                      id={p}
                      defaultChecked={code.professors?.includes(p)}
                      onClick={() => {
                        const updatedCodes = codes.map((c) =>
                          c.code === code.code
                            ? {
                                ...c,
                                professors: c.professors
                                  ? c.professors.includes(p)
                                    ? c.professors.filter((prof) => prof !== p)
                                    : [...c.professors, p]
                                  : [p],
                              }
                            : c,
                        );
                        setCodes(updatedCodes);
                      }}
                    />
                    {p}
                  </label>
                ))}
              </form>
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                openDialog(code.code, "rating");
              }}
            >
              <p className="cursor-pointer hover:underline">
                rating range:{" "}
                {code.ratingRange
                  ? `${code.ratingRange.from ?? 0} - ${code.ratingRange.to ?? 5}`
                  : "any (click to edit)"}
              </p>

              <form
                id={"ratingdialog" + code.code}
                className="bg-primary absolute z-10 hidden flex-col gap-2 rounded-md p-2 text-black no-underline shadow shadow-black"
              >
                <label className="flex gap-1">
                  from
                  <input
                    defaultValue={code.ratingRange?.from}
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    placeholder="0"
                    autoComplete="off"
                    onChange={(e) => {
                      const updatedCodes = codes.map((c) =>
                        c.code === code.code
                          ? {
                              ...c,
                              ratingRange: {
                                ...c.ratingRange,
                                from:
                                  e.target.value === ""
                                    ? undefined
                                    : Number(e.target.value),
                              },
                            }
                          : c,
                      );
                      setCodes(updatedCodes);
                    }}
                  />
                </label>

                <label className="flex gap-1">
                  to
                  <input
                    defaultValue={code.ratingRange?.to}
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    placeholder="5"
                    autoComplete="off"
                    onChange={(e) => {
                      const updatedCodes = codes.map((c) =>
                        c.code === code.code
                          ? {
                              ...c,
                              ratingRange: {
                                ...c.ratingRange,
                                to:
                                  e.target.value === ""
                                    ? undefined
                                    : Number(e.target.value),
                              },
                            }
                          : c,
                      );
                      setCodes(updatedCodes);
                    }}
                  />
                </label>
              </form>
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                openDialog(code.code, "score");
              }}
            >
              <p className="cursor-pointer hover:underline">
                score range:{" "}
                {code.scoreRange
                  ? `${code.scoreRange.from ?? 0} - ${code.scoreRange.to ?? 100}`
                  : "any (click to edit)"}
              </p>

              <form
                id={"scoredialog" + code.code}
                className="bg-primary absolute z-10 hidden flex-col gap-2 rounded-md p-2 text-black no-underline shadow shadow-black"
              >
                <label className="flex gap-1">
                  from
                  <input
                    defaultValue={code.scoreRange?.from}
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    placeholder="0"
                    autoComplete="off"
                    onChange={(e) => {
                      const updatedCodes = codes.map((c) =>
                        c.code === code.code
                          ? {
                              ...c,
                              scoreRange: {
                                ...c.scoreRange,
                                from:
                                  e.target.value === ""
                                    ? undefined
                                    : Number(e.target.value),
                              },
                            }
                          : c,
                      );
                      setCodes(updatedCodes);
                    }}
                  />
                </label>

                <label className="flex gap-1">
                  to
                  <input
                    defaultValue={code.scoreRange?.to}
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    placeholder="100"
                    autoComplete="off"
                    onChange={(e) => {
                      const updatedCodes = codes.map((c) =>
                        c.code === code.code
                          ? {
                              ...c,
                              scoreRange: {
                                ...c.scoreRange,
                                to:
                                  e.target.value === ""
                                    ? undefined
                                    : Number(e.target.value),
                              },
                            }
                          : c,
                      );
                      setCodes(updatedCodes);
                    }}
                  />
                </label>
              </form>
            </div>
          </div>
        );
      })}

      <form
        className="group bg-bg-secondary hover:bg-secondary flex items-center gap-2 rounded-md p-2 transition"
        action={action}
        ref={ref}
      >
        <label htmlFor="extraCode" className="w-full">
          <input
            id="extraCode"
            name="extraCode"
            className="bg-background group-hover:bg-bg-secondary w-full rounded-md p-2 transition outline-none"
            placeholder="Add code..."
            list="codes"
          />
          <datalist id="codes">
            {codesDatalist.map((code) => (
              <option value={code} key={`${code}`} />
            ))}
          </datalist>
        </label>
        <Button className="w-4 shrink-0 p-0" variant="basic" type="submit">
          <Plus className="w-4" />
        </Button>
      </form>
    </>
  );
}

type ACodeFormProps = {
  code: Code;
  setCodes: (f: (codes: Code[]) => Code[]) => void;
  onRemove: (code: Code) => void;
};
function ACodeForm(props: ACodeFormProps) {
  const { code, onRemove, setCodes } = props;
  const { sectionsById } = useSectionStore();

  const classesForSection = useRef(
    Array.from(sectionsById.values()).filter((cl) => cl.code === code.code),
  );

  const allProfessors = useRef(
    [
      ...new Set(
        classesForSection.current.flatMap((section) =>
          section.leclabs.map((leclab) => leclab.prof),
        ),
      ),
    ]
      .toSorted()
      .filter((p) => p !== ""),
  );

  const onProfessorClicked = useCallback(
    (prof: string) => {
      setCodes((codes) =>
        codes.map((c) => {
          if (c.code !== code.code) {
            return c;
          }

          let profs: string[];
          if (c.professors?.includes(prof)) {
            profs = c.professors.filter((p) => p !== prof);
          } else {
            profs = [...(c.professors ?? []), prof];
          }

          return {
            ...c,
            professors: profs,
          };
        }),
      );
    },
    [setCodes, code.code],
  );

  return (
    <div className="bg-secondary/50 hover:bg-secondary flex flex-col rounded-md p-2 transition **:outline-none">
      <div className="flex items-center justify-between">
        <p className="font-bold">{code.code}</p>
        <Button
          variant="basic"
          onClick={() => onRemove(code)}
          className="w-fit p-0"
        >
          Remove
        </Button>
      </div>
      <ACodeTeacherSelection
        allProfessors={allProfessors.current}
        code={code}
        onProfessorClicked={onProfessorClicked}
      />
    </div>
  );
}

type ACodeTeacherSelectionProps = {
  allProfessors: string[];
  onProfessorClicked: (prof: string) => void;
  code: Code;
};
function ACodeTeacherSelection(props: ACodeTeacherSelectionProps) {
  const { allProfessors, onProfessorClicked, code } = props;

  return (
    <div>
      <p className="cursor-pointer hover:underline">
        teachers:{" "}
        {code.professors && code.professors.length > 0
          ? code.professors.join("; ")
          : "any (click to edit)"}
      </p>

      <form
        id={`teacherdialog${code.code}`}
        className="bg-primary absolute z-10 hidden flex-col rounded-md p-2 text-black no-underline shadow shadow-black"
      >
        {allProfessors.map((p) => (
          <label key={p} className="flex gap-1">
            <input
              type="checkbox"
              id={p}
              defaultChecked={code.professors?.includes(p)}
              onClick={() => onProfessorClicked(p)}
            />
            {p}
          </label>
        ))}
      </form>
    </div>
  );
}
