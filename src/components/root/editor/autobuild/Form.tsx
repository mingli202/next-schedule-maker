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
import { useSectionStore } from "src/lib/store/section";
import type { Code } from "src/types/autobuild";
import Button from "@/components/Button";

type Props = {
  codes: Code[];
  setCodes: (u: Code[] | ((codes: Code[]) => Code[])) => void;
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

  const submit = useCallback(
    (e: SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formdata = new FormData(e.currentTarget);

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
        className="group bg-bg-secondary hover:bg-secondary flex items-center gap-2 rounded-md p-2 transition"
        ref={ref}
        onSubmit={submit}
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

  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const f = (e: PointerEvent) => {
      if (!ref.current) return;
      if (!(e.target instanceof Node)) return;
      if (!ref.current.contains(e.target)) return;

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
        <div className="bg-primary absolute z-10 flex-col rounded-md p-2 text-black no-underline shadow shadow-black">
          {allProfessors.map((p) => (
            <label key={p} className="flex gap-1">
              <input
                type="checkbox"
                id={p}
                defaultChecked={code.professors?.includes(p)}
                onClick={(e) => {
                  e.stopPropagation();
                  onProfessorClicked(p);
                }}
              />
              {p}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
