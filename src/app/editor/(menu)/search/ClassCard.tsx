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

  return (
    <div key={id} className="box-border rounded-md bg-bgSecondary p-2">
      <p className="font-light">
        {cl.program}: {cl.course} {cl.code}
      </p>

      <h3 className="font-heading text-xl font-bold">
        {cl.section} {cl.lecture.title}
      </h3>

      <div className="mt-2 rounded-md bg-secondary p-2">
        <h4 className="italic">Lecture</h4>

        <p className="flex items-center gap-2">
          <FontAwesomeIcon icon={faUser} className="h-4 opacity-50" />
          {cl.lecture.prof}
          <span className="font-bold">
            {cl.lecture.rating.score === 0 ? "N/A" : cl.lecture.rating.score}
          </span>
        </p>

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

          <p className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} className="h-4 opacity-50" />
            {cl.lab.prof}
            <span className="font-bold">{cl.lab.rating.score}</span>
          </p>

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
          onHoverStart={() => {
            if (searchParams.get("previewHover") !== "true") return;

            const url = new URL(window.location.href);
            url.searchParams.set("hoverId", id);

            router.push(`/editor/search?${url.searchParams}`);
          }}
          onHoverEnd={() => {
            if (searchParams.get("previewHover") !== "true") return;

            const url = new URL(window.location.href);
            url.searchParams.delete("hoverId");

            router.push(`/editor/search?${url.searchParams}`);
          }}
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
    </div>
  );
};

export default ClassCard;
