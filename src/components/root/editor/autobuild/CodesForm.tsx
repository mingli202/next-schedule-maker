import { useSearch } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import {
  type MouseEvent,
  type SubmitEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Checkbox } from "src/components/ui/checkbox";
import { Field, FieldLabel } from "src/components/ui/field";
import { Input } from "src/components/ui/input";
import { useSectionStore } from "src/lib/store/section";
import type { Code } from "src/types/autobuild";
import Button from "@/components/Button";

type Props = {
  codes: Code[];
  setCodes: (u: (codes: Code[]) => Code[]) => void;
  useCurrent: boolean;
};

const codeKey = (codes: string[]) => codes.toSorted().join("\0");

export default function CodesForm({ codes, setCodes, useCurrent }: Props) {
  const ref = useRef<HTMLFormElement>(null);
  const { sectionsById } = useSectionStore();

  const currentSections = useSearch({
    from: "/editor/autobuild",
    select: (s) => s.sections,
  });

  const selectedCodesKey = useMemo(
    () => codeKey(codes.map((code) => code.code)),
    [codes],
  );

  const currentCodesKey = useMemo(
    () =>
      codeKey(
        currentSections
          .map((cl) => sectionsById.get(cl.sectionId)?.code)
          .filter((code) => code !== undefined),
      ),
    [currentSections, sectionsById],
  );

  const codesDatalist = useMemo(() => {
    const selectedCodes = new Set(selectedCodesKey.split("\0").filter(Boolean));
    const currentCodes = new Set(currentCodesKey.split("\0").filter(Boolean));

    return [
      ...new Set(
        Array.from(sectionsById.values())
          .map((cl) => cl.code)
          .filter(
            (code) =>
              !selectedCodes.has(code) &&
              (!useCurrent || !currentCodes.has(code)),
          )
          .toSorted(),
      ),
    ];
  }, [sectionsById, selectedCodesKey, currentCodesKey, useCurrent]);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = useCallback(
    (e: SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formdata = new FormData(e.currentTarget);

      if (!ref.current) {
        return;
      }
      ref.current.reset();
      setSubmitError(null);

      const newInput = formdata.get("extraCode");
      if (!newInput) return;
      if (!codesDatalist.includes(newInput.toString())) {
        setSubmitError("Invalid code");
        return;
      }

      setCodes((codes) => [...codes, { code: newInput.toString() }]);
    },
    [codesDatalist, setCodes],
  );

  const onRemove = useCallback(
    (code: Code) => {
      setCodes((c) => c.filter((_c) => _c.code !== code.code));
    },
    [setCodes],
  );

  return (
    <>
      {codes.map((code) => (
        <ACodeForm
          code={code}
          key={code.code}
          setCodes={setCodes}
          onRemove={onRemove}
        />
      ))}

      <form
        className="group bg-secondary/50 hover:bg-secondary flex flex-col gap-2 rounded-md p-2 transition"
        ref={ref}
        onSubmit={submit}
      >
        <div className="flex w-full items-center gap-2">
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
          <Button
            className="w-4 shrink-0 p-0"
            variant="basic"
            type="submit"
            title="add"
          >
            <Plus className="w-4" />
          </Button>
        </div>
        {submitError && <p className="text-destructive">{submitError}</p>}
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

  const onRangeChanged = useCallback(
    (type: "rating" | "score", range: { from?: string; to?: string }) => {
      const min = range.from;
      const max = range.to;

      const nmin = (min ?? "") === "" ? undefined : Number(min);
      const nmax = (max ?? "") === "" ? undefined : Number(max);

      setCodes((codes) =>
        codes.map((c) => {
          if (c.code !== code.code) {
            return c;
          }

          if (
            nmin === undefined &&
            nmax === undefined &&
            (type === "rating" ? c.ratingRange : c.scoreRange) === undefined
          ) {
            return c; // skip creating empty range
          }

          if (type === "rating") {
            const ratingRange =
              c.ratingRange === undefined ? {} : { ...c.ratingRange };

            ratingRange.from = nmin;
            ratingRange.to = nmax;

            return { ...c, ratingRange };
          } else {
            const scoreRange =
              c.scoreRange === undefined ? {} : { ...c.scoreRange };

            scoreRange.from = nmin;
            scoreRange.to = nmax;

            return { ...c, scoreRange };
          }
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

      <ARange code={code} name="rating" onRangeChanged={onRangeChanged} />
      <ARange code={code} name="score" onRangeChanged={onRangeChanged} />
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

  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const f = (e: PointerEvent) => {
      if (!ref.current) return;
      if (!(e.target instanceof Node)) return;
      if (ref.current.contains(e.target)) return;

      return setOpen(false);
    };
    document.body.addEventListener("click", f);

    return () => {
      document.body.removeEventListener("click", f);
    };
  }, []);

  const onClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setOpen((o) => !o);
  }, []);

  return (
    <div className="relative" role="dialog" aria-modal={true} ref={ref}>
      <button
        className="cursor-pointer text-left hover:underline"
        type="button"
        onClick={onClick}
      >
        teachers:{" "}
        {code.professors && code.professors.length > 0
          ? code.professors.join("; ")
          : "any (click to edit)"}
      </button>

      {open && (
        <div className="bg-background ring-ring absolute z-10 flex flex-col gap-2 rounded-md p-2 no-underline shadow ring-1 shadow-black">
          {allProfessors.map((p) => (
            <Field orientation="horizontal" key={`checkbox-${p}`}>
              <Checkbox
                defaultChecked={code.professors?.includes(p)}
                id={`checkbox-${p}`}
                onCheckedChange={() => {
                  onProfessorClicked(p);
                }}
                className="dark:bg-secondary/40 dark:border-secondary"
              />
              <FieldLabel htmlFor={`checkbox-${p}`}>{p}</FieldLabel>
            </Field>
          ))}
        </div>
      )}
    </div>
  );
}

type ARangeProps = {
  code: Code;
  name: "score" | "rating";
  onRangeChanged: (
    type: "rating" | "score",
    range: {
      from?: string;
      to?: string;
    },
  ) => void;
};
function ARange(props: ARangeProps) {
  const { code, name, onRangeChanged } = props;

  const displayMin =
    name === "score" ? code.scoreRange?.from : code.ratingRange?.from;
  const displayMax =
    name === "score" ? code.scoreRange?.to : code.ratingRange?.to;

  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const f = (e: PointerEvent) => {
      if (!ref.current) return;
      if (!(e.target instanceof Node)) return;
      if (ref.current.contains(e.target)) return;

      return setOpen(false);
    };
    document.body.addEventListener("click", f);

    return () => {
      document.body.removeEventListener("click", f);
    };
  }, []);

  const onClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setOpen((o) => !o);
  }, []);

  return (
    <div className="relative" role="dialog" aria-modal={true} ref={ref}>
      <button
        className="cursor-pointer text-left hover:underline"
        type="button"
        onClick={onClick}
      >
        {name}:{" "}
        {displayMin === undefined && displayMax === undefined ? (
          "any (click to edit)"
        ) : (
          <>
            {displayMin === undefined ? "any" : displayMin} -{" "}
            {displayMax === undefined ? "any" : displayMax}
          </>
        )}
      </button>

      {open && (
        <div className="bg-background ring-ring absolute z-10 flex w-32 flex-col gap-2 rounded-md p-2 no-underline shadow ring-1 shadow-black">
          <div className="flex gap-1">
            <FieldLabel
              htmlFor={`arange-${code.code}${name}Min`}
              className="shrink-0"
            >
              from
            </FieldLabel>
            <Input
              type="number"
              autoComplete="off"
              id={`arange-${code.code}${name}Min`}
              min={0}
              max={name === "rating" ? 5 : 100}
              placeholder="0"
              step={1}
              onChange={(e) => onRangeChanged(name, { from: e.target.value })}
              defaultValue={displayMin}
            />
          </div>
          <div className="flex gap-1">
            <FieldLabel
              htmlFor={`arange-${code.code}${name}Max`}
              className="shrink-0"
            >
              to
            </FieldLabel>
            <Input
              type="number"
              autoComplete="off"
              id={`arange-${code.code}${name}Max`}
              min={0}
              max={name === "rating" ? 5 : 100}
              placeholder={name === "rating" ? "5" : "100"}
              step={1}
              onChange={(e) => onRangeChanged(name, { to: e.target.value })}
              defaultValue={displayMax}
            />
          </div>
        </div>
      )}
    </div>
  );
}
