"use client";

// import { motion } from "framer-motion";
import generate from "./generate";
import { Code, SharedCurrentClasses } from "@/types";
import { useContext } from "react";
import { ScheduleClassesContext } from "../../ScheduleContext";
import { PageLoading } from "@/ui";

type Props = {
  setGeneratedSchedules: React.Dispatch<
    React.SetStateAction<SharedCurrentClasses[][]>
  >;
  codes: Code[];
  colors: string[];
  setIsBuilding: React.Dispatch<
    React.SetStateAction<"form" | "building" | "complete">
  >;
  useCurrent: boolean;
  dayOff: string[];
};

function Loader({
  setGeneratedSchedules,
  codes,
  colors,
  setIsBuilding,
  useCurrent,
  dayOff,
}: Props) {
  const currentClasses = useContext(ScheduleClassesContext);

  generate(codes, currentClasses, colors, useCurrent, dayOff)
    .then((res) => {
      setGeneratedSchedules(res);
      setIsBuilding("complete");
    })
    .catch((err) => console.log(err));

  return <PageLoading />;
}

export default Loader;
