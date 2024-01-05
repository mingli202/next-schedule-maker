"use client";

import { Class } from "@/types";
import { Button } from "@/ui";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useMemo, useRef } from "react";
import { ScheduleClassesContext } from "../../ScheduleContext";

type Props = {
  allClasses: Record<string, Class>;
  codes: string[];
  setCodes: React.Dispatch<React.SetStateAction<string[]>>;
  setIsBuilding: React.Dispatch<
    React.SetStateAction<"form" | "building" | "complete">
  >;
};

const Form = ({ allClasses, codes, setCodes }: Props) => {
  const ref = useRef<HTMLFormElement>(null);
  const currentClasses = useContext(ScheduleClassesContext);
  const currentCodes = currentClasses.map((cl) => allClasses[cl.id].code);

  const codesDatalist = useMemo(
    () => [
      ...new Set(
        Object.values(allClasses)
          .map((cl) => cl.code)
          .filter(
            (code) => !codes.includes(code) && !currentCodes.includes(code),
          ),
      ),
    ],
    [allClasses, codes, currentCodes],
  );

  const action = (formdata: FormData) => {
    ref.current?.reset();

    const newInput = formdata.get("extraCode");
    if (!newInput) return;
    if (!codesDatalist.includes(newInput.toString())) {
      alert("This code does not exist");
      return;
    }

    setCodes([...codes, newInput.toString()]);
  };

  return (
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
  );
};

export default Form;
