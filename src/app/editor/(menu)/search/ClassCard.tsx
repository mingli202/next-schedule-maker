"use client";

import { ActionType, Class, SharedCurrentClasses } from "@/types";
import { Button } from "@/ui";
import {
  faClock,
  faEye,
  faMinus,
  faPlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import isValid from "./checkValid";
import { useContext } from "react";
import { ScheduleDispatchContext } from "../../ScheduleContext";
import { motion } from "framer-motion";

type Props = {
  id: string;
  cl: Class;
  allClasses: Record<string, Class>;
  colors: string[];
  currentClasses: SharedCurrentClasses[];
};

const ClassCard = ({ id, cl, allClasses, colors, currentClasses }: Props) => {
  const searchParams = useSearchParams();

  const router = useRouter();

  const dispatch = useContext(ScheduleDispatchContext);

  const handleHoverEnter = () => {
    if (searchParams.get("previewHover") !== "true") return;

    const url = new URL(window.location.href);
    url.searchParams.set("hoverId", id);

    router.push(`/editor/search?${url.searchParams}`);
  };

  const handleHoverEnd = () => {
    if (searchParams.get("previewHover") !== "true") return;

    const url = new URL(window.location.href);
    url.searchParams.delete("hoverId");

    router.push(`/editor/search?${url.searchParams}`);
  };

  return (
    <motion.div
      key={id}
      className="box-border rounded-md bg-bgSecondary p-2"
      onHoverStart={handleHoverEnter}
      onHoverEnd={handleHoverEnd}
    >
      <p className="font-light">
        {cl.program}: {cl.course} {cl.code}
      </p>

      <h3 className="font-heading text-xl font-bold">
        {cl.section} {cl.lecture.title}
      </h3>

      <div className="mt-2 rounded-md bg-secondary p-2">
        <h4 className="italic">Lecture</h4>

        <div className="relative flex items-center gap-2">
          <FontAwesomeIcon icon={faUser} className="h-4 opacity-50" />
          {cl.lecture.prof}
          <div className="group relative flex cursor-default font-bold">
            <p>
              {cl.lecture.rating.score === 0 ? "N/A" : cl.lecture.rating.score}
            </p>
            <div className="absolute top-0 hidden w-[12rem] -translate-y-1/2 translate-x-12 rounded-md bg-slate p-1 text-sm font-normal leading-4 text-black shadow-lg group-hover:block">
              <p>
                Rating:{" "}
                {cl.lecture.rating.avg === 0
                  ? "N/A"
                  : `${cl.lecture.rating.avg}/5`}
              </p>
              <p>
                Difficulty:{" "}
                {cl.lecture.rating.difficulty === 0
                  ? "N/A"
                  : `${cl.lecture.rating.difficulty}/5`}
              </p>
              <p>
                Raters:{" "}
                {cl.lecture.rating.nRating === 0
                  ? "N/A"
                  : `${cl.lecture.rating.nRating} raters`}
              </p>
              <p>
                Take again:{" "}
                {cl.lecture.rating.takeAgain === 0
                  ? "N/A"
                  : `${cl.lecture.rating.takeAgain}%`}
              </p>
              <p className="font-bold">
                Overall Score:{" "}
                {cl.lecture.rating.score === 0
                  ? "N/A"
                  : `${cl.lecture.rating.score}/100`}
              </p>
            </div>
          </div>
        </div>

        {Object.entries(cl.lecture)
          .filter((i) => !["title", "prof", "rating"].includes(i[0]))
          .map((j, index) => {
            return (
              <p className="flex items-center gap-2" key={index}>
                <FontAwesomeIcon icon={faClock} className="h-4 opacity-50" />
                {j[0]}
                <span>{j[1] as string}</span>
              </p>
            );
          })}
      </div>

      {"prof" in cl.lab && (
        <div className="mt-2 rounded-md bg-secondary p-2">
          <h4 className="italic">Lab</h4>

          <div className="relative flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} className="h-4 opacity-50" />
            {cl.lab.prof}
            <div className="group relative flex cursor-default font-bold">
              <p>{cl.lab.rating.score === 0 ? "N/A" : cl.lab.rating.score}</p>
              <div className="absolute top-0 hidden w-[12rem] -translate-y-1/2 translate-x-12 rounded-md bg-slate p-1 text-sm font-normal leading-4 text-black shadow-lg group-hover:block">
                <p>
                  Rating:{" "}
                  {cl.lab.rating.avg === 0 ? "N/A" : `${cl.lab.rating.avg}/5`}
                </p>
                <p>
                  Difficulty:{" "}
                  {cl.lab.rating.difficulty === 0
                    ? "N/A"
                    : `${cl.lab.rating.difficulty}/5`}
                </p>
                <p>
                  Raters:{" "}
                  {cl.lab.rating.nRating === 0
                    ? "N/A"
                    : `${cl.lab.rating.nRating} raters`}
                </p>
                <p>
                  Take again:{" "}
                  {cl.lab.rating.takeAgain === 0
                    ? "N/A"
                    : `${cl.lab.rating.takeAgain}%`}
                </p>
                <p className="font-bold">
                  Overall Score:{" "}
                  {cl.lab.rating.score === 0
                    ? "N/A"
                    : `${cl.lab.rating.score}/100`}
                </p>
              </div>
            </div>
          </div>

          {Object.entries(cl.lab)
            .filter((i) => !["title", "prof", "rating"].includes(i[0]))
            .map((j, index) => {
              return (
                <p className="flex items-center gap-2" key={index}>
                  <FontAwesomeIcon icon={faClock} className="h-4 opacity-50" />
                  {j[0]}
                  <span>{j[1] as string}</span>
                </p>
              );
            })}
        </div>
      )}

      {cl.more !== "" && <p className="mt-2 text-third">{cl.more}</p>}
      <div className="flex items-center justify-end pt-2">
        <Button
          variant="basic"
          className="flex items-center justify-center"
          title="preview"
          onClick={() => {
            const hover = searchParams.get("previewHover");

            const url = new URL(window.location.href);

            if (hover !== "true") {
              url.searchParams.set("previewHover", "true");
              url.searchParams.set("hoverId", id);

              router.push(`/editor/search?${url.searchParams}`);
            } else {
              url.searchParams.delete("previewHover");
              url.searchParams.delete("hoverId");

              router.push(`/editor/search?${url.searchParams}`);
            }
          }}
        >
          <FontAwesomeIcon icon={faEye} />
        </Button>

        {isValid(cl, currentClasses, allClasses) ? (
          <Button
            variant="basic"
            className="flex items-center justify-center"
            title="add"
            onClick={() => {
              const checkValid = searchParams.get("checkValid");

              if (checkValid === "true") {
                handleHoverEnd();
              }

              let bgColor = "";
              let textColor = "#000";
              const pickedColors = currentClasses.map((cl) => cl.bgColor);

              for (let i = 0; i < colors.length; i++) {
                if (!pickedColors.includes(colors[i])) {
                  if (i > 7) textColor = "#FFF";
                  bgColor = colors[i];
                  break;
                }
              }

              const action: ActionType = {
                type: "add",
                cl: {
                  id,
                  bgColor,
                  textColor,
                },
              };

              dispatch(action);
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        ) : (
          currentClasses.some(({ id: savedId }): boolean => savedId === id) && (
            <Button
              variant="basic"
              className="flex items-center justify-center"
              title="remove"
              onClick={() => {
                const action: ActionType = { type: "delete", id };
                dispatch(action);
              }}
            >
              <FontAwesomeIcon icon={faMinus} />
            </Button>
          )
        )}
      </div>
    </motion.div>
  );
};

export default ClassCard;
