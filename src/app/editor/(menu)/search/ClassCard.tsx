"use client";

import { ActionType, Class, SharedCurrentClasses } from "@/types";
import { Button } from "@/ui";
import {
  faEye,
  faMinus,
  faPlus,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import isValid from "./checkValid";
import { useContext } from "react";
import { ScheduleDispatchContext } from "../../ScheduleContext";
import { motion } from "framer-motion";
import LecLab from "@/app/components/LecLab";
import { db } from "@/backend";
import { ref, update } from "firebase/database";
import "firebase/compat/database";
import firebase from "firebase/compat/app";

type Props = {
  id: string;
  cl: Class;
  allClasses: Record<string, Class>;
  colors: string[];
  currentClasses: SharedCurrentClasses[];
};

function ClassCard({ id, cl, allClasses, colors, currentClasses }: Props) {
  const searchParams = useSearchParams();

  const router = useRouter();

  const dispatch = useContext(ScheduleDispatchContext);

  function handleHoverEnter() {
    if (searchParams.get("previewHover") !== "true") return;

    const url = new URL(window.location.href);
    url.searchParams.set("hoverId", id);

    router.push(`/editor/search?${url.searchParams}`);
  }

  function handleHoverEnd() {
    if (searchParams.get("previewHover") !== "true") return;

    const url = new URL(window.location.href);
    url.searchParams.delete("hoverId");

    router.push(`/editor/search?${url.searchParams}`);
  }

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
        {cl.section} {cl.lecture?.title}
      </h3>

      <LecLab cl={cl} leclab="lecture" />
      <LecLab cl={cl} leclab="laboratory" />

      {cl.more !== "" && <p className="mt-2 text-third">{cl.more}</p>}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="basic"
          title="Report Wrong Info"
          className="flex items-center justify-center"
          onClick={async () => {
            const ServerValue = firebase.database.ServerValue;

            await update(ref(db, "reports"), {
              [id]: ServerValue.increment(1),
            });
          }}
        >
          <FontAwesomeIcon icon={faWarning} />
        </Button>

        <div className="flex justify-end">
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
            currentClasses.some(
              ({ id: savedId }): boolean => savedId === id,
            ) && (
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
    </motion.div>
  );
}

export default ClassCard;
