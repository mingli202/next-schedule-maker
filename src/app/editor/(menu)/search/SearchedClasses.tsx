"use client";

import filterDown from "./filterDown";
import { useContext } from "react";
import { ScheduleClassesContext } from "../../ScheduleContext";

import ClassCard from "./ClassCard";
import { useSearchParams } from "next/navigation";
import { Class } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Image from "next/image";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

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
            DISCLAIMER: This website is a tool meant to help students plan their
            schedule. It is NOT an official website and you still need to make
            your schedule via OMNIVOX. Moreover, although we try our best to
            make the website as reliable as possible, it is still your
            responsibility to make sure that the info is correct.
          </p>

          <br />
          <div className="h-0.5 w-full rounded-full bg-third" />
          <br />

          <Link
            href="https://github.com/Nanoscience202/next-schedule-maker"
            className="flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512"
              className="h-4 w-4"
            >
              {/*<!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->*/}
              <path
                d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                className="fill-text"
              />
            </svg>
            <p>Contribute</p>
          </Link>

          <Link
            href="https://github.com/Nanoscience202"
            className="flex items-center gap-2"
          >
            <Image
              src="/assets/gh icon.png"
              alt="github icon"
              width={16}
              height={16}
              className="rounded-full"
            />
            Made by Ming Li Liu, 2022-2024 Honours Science student
          </Link>

          <Link
            href="https://www.instagram.com/vincent_mingli/"
            className="flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="h-4 w-4"
            >
              {/*<!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->*/}
              <path
                className="fill-text"
                d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
              />
            </svg>
            vincent_mingli
          </Link>

          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faPhone} className="h-4 w-4" />
            (514) 586-1268
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchedClasses;
