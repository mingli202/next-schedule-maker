"use client";

import { Class } from "@/types";
import View from "../components/View";
import { useContext } from "react";
import {
  ScheduleClassesContext,
  ScheduleDispatchContext,
} from "./ScheduleContext";

type Props = {
  allClasses: Record<string, Class>;
};

const ViewWrapper = ({ allClasses }: Props) => {
  const dispatch = useContext(ScheduleDispatchContext);
  const scheduleClasses = useContext(ScheduleClassesContext);

  return (
    <View
      allClasses={allClasses}
      stateType={{
        type: "dispatch",
        dispatch: dispatch,
      }}
      scheduleClasses={scheduleClasses}
    />
  );
};

export default ViewWrapper;
