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

function SearchedClasses({ allClasses, professors, colors }: Props) {
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
          <ul className="list-disc pl-4">
            <li>
              <b>Search</b>: for quick class lookup.
            </li>
            <li>
              <b>Filter</b>: for more filters for the search result.
            </li>
            <li>
              <b>Autobuild</b>: to generate schedules based on fitlers.
            </li>
            <li>
              <b>Saved</b>: to login and save your schedules.
            </li>
            <li>
              <b>Settings</b>: for more options.
            </li>
          </ul>

          <br />
          <div className="h-0.5 w-full rounded-full bg-third" />
          <br />

          <p>Search by keywords and separate them by a comma:</p>
          <ul className="list-disc pl-4">
            <li>ENGLISH, 603-200, r{">"}4.5, 10:00-16:00</li>
            <li>HUMA, blended, steven</li>
            <li>bio ii, s{">"}80, WF</li>
          </ul>
          <br />
          <p>
            It will attempt to search for what you meant to search by matching
            various patterns:
          </p>
          <ul className="list-disc pl-4">
            <li>{"r>, r<, r="} matches a rating range.</li>
            <li>{"s>, s<, s="} matches a score range.</li>
            <li>
              M, T, W, R, F or any combinasion of these letters will match days
              off.
            </li>
            <li>
              Any combinasion of NN:MM, NN:MM, NNMM with either a dash or{" "}
              {'"to"'} between matches a time range.
            </li>
            <li>ALL CAPS matches a course name.</li>
            <li>NNN Three numbers matches a code.</li>
            <li>{'"honours" and "blended"'} are special keywords.</li>
            <li>
              Matches a teacher{"'"}s name if the keyword matches at least 67%
              of either their first or last name.
            </li>
            <li>Will look for class titles if none of the above matches.</li>
          </ul>

          <br />
          <div className="h-0.5 w-full rounded-full bg-third" />
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
}

export default SearchedClasses;
