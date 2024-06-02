"use client";

import { Class, Code } from "@/types";
import { Button } from "@/ui";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useMemo, useRef } from "react";
import { ScheduleClassesContext } from "../../ScheduleContext";

type Props = {
  allClasses: Record<string, Class>;
  codes: Code[];
  setCodes: (u: Code[]) => void;
  useCurrent: boolean;
};

function Form({ allClasses, codes, setCodes, useCurrent }: Props) {
  const ref = useRef<HTMLFormElement>(null);
  const currentClasses = useContext(ScheduleClassesContext);
  const currentCodes = currentClasses.map((cl) => allClasses[cl.id].code);

  const codesDatalist = useMemo(
    () => [
      ...new Set(
        Object.values(allClasses)
          .map((cl) => cl.code)
          .filter(
            (code) =>
              !codes.some((c) => c.code === code) &&
              (!useCurrent || !currentCodes.includes(code)),
          ),
      ),
    ],
    [allClasses, codes, currentCodes, useCurrent],
  );

  function action(formdata: FormData) {
    ref.current!.reset();

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
      type + "dialog" + code,
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
        const classes = Object.values(allClasses).filter(
          (cl) => cl.code === code.code,
        );

        const professors = [...new Set(classes.map((cl) => cl.lecture.prof))]
          .toSorted()
          .filter((p) => p !== "");

        return (
          <div
            key={code.code}
            className="flex flex-col rounded-md bg-bgSecondary p-2 transition hover:bg-secondary [&_*]:outline-none"
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
                className="absolute z-10 hidden flex-col rounded-md bg-primary p-2 text-black no-underline shadow shadow-black"
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
                openDialog(code.code, "time");
              }}
            >
              <p className="cursor-pointer hover:underline">
                time range:{" "}
                {code.timeRange
                  ? `${code.timeRange.from ?? "00:00"} - ${
                      code.timeRange.to ?? "23:59"
                    }`
                  : "any (click to edit)"}
              </p>

              <form
                id={"timedialog" + code.code}
                className="absolute z-10 hidden flex-col gap-2 rounded-md bg-primary p-2 text-black no-underline shadow shadow-black"
              >
                <label className="flex gap-1">
                  from
                  <input
                    type="time"
                    defaultValue={code.timeRange?.from}
                    min="08:00"
                    max="18:00"
                    step={`${60 * 30}`}
                    placeholder="18:00"
                    autoComplete="off"
                    onChange={(e) => {
                      const updatedCodes = codes.map((c) =>
                        c.code === code.code
                          ? {
                              ...c,
                              timeRange: {
                                ...c.timeRange,
                                from:
                                  e.target.value === ""
                                    ? undefined
                                    : e.target.value.slice(0, 5),
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
                    type="time"
                    defaultValue={code.timeRange?.to}
                    min="08:00"
                    max="18:00"
                    step={`${60 * 30}`}
                    placeholder="18:00"
                    autoComplete="off"
                    onChange={(e) => {
                      const updatedCodes = codes.map((c) =>
                        c.code === code.code
                          ? {
                              ...c,
                              timeRange: {
                                ...c.timeRange,
                                to:
                                  e.target.value === ""
                                    ? undefined
                                    : e.target.value.slice(0, 5),
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
                openDialog(code.code, "rating");
              }}
            >
              <p className="cursor-pointer hover:underline">
                rating range:{" "}
                {code.ratingRange
                  ? `${code.ratingRange.from ?? 0} - ${
                      code.ratingRange.to ?? 5
                    }`
                  : "any (click to edit)"}
              </p>

              <form
                id={"ratingdialog" + code.code}
                className="absolute z-10 hidden flex-col gap-2 rounded-md bg-primary p-2 text-black no-underline shadow shadow-black"
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
                  ? `${code.scoreRange.from ?? 0} - ${
                      code.scoreRange.to ?? 100
                    }`
                  : "any (click to edit)"}
              </p>

              <form
                id={"scoredialog" + code.code}
                className="absolute z-10 hidden flex-col gap-2 rounded-md bg-primary p-2 text-black no-underline shadow shadow-black"
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
        className="group flex items-center gap-2 rounded-md bg-bgSecondary p-2 transition hover:bg-secondary"
        action={action}
        ref={ref}
      >
        <label htmlFor="extraCode" className="w-full">
          <input
            id="extraCode"
            name="extraCode"
            className="w-full rounded-md bg-bgPrimary p-2 outline-none transition group-hover:bg-bgSecondary"
            placeholder="Add code..."
            list="codes"
          />
          <datalist id="codes">
            {codesDatalist.map((code, i) => (
              <option value={code} key={`${code}${i}`} />
            ))}
          </datalist>
        </label>
        <Button className="w-4 shrink-0 p-0" variant="basic" type="submit">
          <FontAwesomeIcon icon={faPlusCircle} className="w-4" />
        </Button>
      </form>
    </>
  );
}

export default Form;
