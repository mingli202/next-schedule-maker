"use client";

import filterDown from "./filterDown";
import { useContext } from "react";
import { ScheduleClassesContext } from "../../ScheduleContext";

import ClassCard from "./ClassCard";
import { useSearchParams } from "next/navigation";
import { Class } from "@/types";

type Props = {
  allClasses: Record<string, Class>;
  professors: string[];
  colors: string[];
};

const SearchedClasses = ({ allClasses, professors, colors }: Props) => {
  const searchParams = useSearchParams();
  const search = new Map(searchParams.entries());

  const currentClasses = useContext(ScheduleClassesContext);

  const filterClasses = filterDown(
    allClasses,
    search,
    professors,
    currentClasses,
  );

  return (
    <div className="scroll mt-2 flex w-full basis-full flex-col gap-2 overflow-y-auto">
      {filterClasses.map(([id, cl]) => (
        <ClassCard
          key={id}
          id={id}
          cl={cl}
          colors={colors}
          allClasses={allClasses}
          currentClasses={currentClasses}
        />
      ))}

      {filterClasses.length === 0 && (
        <div className="box-border w-full overflow-y-auto p-4">
          <h2 className="text-center font-heading text-xl">Guidelines:</h2>
          <br />
          <p>Search by keywords and separate them by a comma:</p>
          <ul className="list-disc pl-4">
            <li>waves, brian, M 10h30 to 12h30</li>
            <li>ENGLISH, 603-200, r{">"}4.5</li>
            <li>HUMA, blended, steven</li>
            <li>bio ii, s{">"}80</li>
            <li>intro to acc, WF, 1000-1130</li>
          </ul>
          <br />
          <p>
            It will attempt to search for what you meant to search by matching
            various patterns:
          </p>
          <ul className="list-disc pl-4">
            <li>{"r>, r<, r="} matches rating.</li>
            <li>{"s>, s<, s="} matches score.</li>
            <li>
              M, T, W, R, F or any combinasion of these letters will match days.
            </li>
            <li>
              Any combinasion of NN:MM, NN:MM, NNMM with either a dash or{" "}
              {'"to"'} between matches time.
            </li>
            <li>
              Combine a day with a time range will match classes that has that
              specific time.
            </li>
            <li>ALL CAPS matches a course name.</li>
            <li>NNN Three numbers matches a code.</li>
            <li>{'"honours" and "blended"'} are special keywords.</li>
            <li>
              Matches a teacher{"'"}s name if the keyword matches at least 67%
              of either their first or last name
            </li>
            <li>Will look for class titles if none of the above matches.</li>
          </ul>
          <br />
          <p>
            Warning: DO NOT touch the URL unless you are familiar with URL
            Params since everything is stored in the URL. If the URL is broken,
            click on the gear icon and reset everything.
          </p>
          <br />
          <p>
            DISCLAIMER: This website is a tool meant to help students plan their
            schedule. It is NOT an official website and you still need to make
            your schedule via OMINVOX. Moreover, although we try our best to
            make the website as reliable as possible, it is still your
            responsibility to make sure that the info is correct.
          </p>
          <br />
        </div>
      )}
    </div>
  );
};

export default SearchedClasses;
