"use client";

// import { motion } from "framer-motion";
import generate from "./generate";
import { SharedCurrentClasses } from "@/types";
import { useContext } from "react";
import { ScheduleClassesContext } from "../../ScheduleContext";
import { PageLoading } from "@/ui";

type Props = {
  setGeneratedSchedules: React.Dispatch<
    React.SetStateAction<SharedCurrentClasses[][]>
  >;
  codes: string[];
  colors: string[];
  setIsBuilding: React.Dispatch<
    React.SetStateAction<"form" | "building" | "complete">
  >;
};

const Loader = ({
  setGeneratedSchedules,
  codes,
  colors,
  setIsBuilding,
}: Props) => {
  const currentClasses = useContext(ScheduleClassesContext);

  generate(codes, currentClasses, colors)
    .then((res) => {
      setGeneratedSchedules(res);
      setIsBuilding("complete");
    })
    .catch((err) => console.log(err));

  return <PageLoading />;
};

export default Loader;
