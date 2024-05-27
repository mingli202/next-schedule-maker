"use client";

import View from "@/app/components/View";
import { Class } from "@/types";
import { useContext } from "react";
import { ScheduleClassesContext, SetScheduleContext } from "../Context";

type Props = {
  allClasses: Record<string, Class>;
};
const ViewWrapper = ({ allClasses }: Props) => {
  const setCurrentClasses = useContext(SetScheduleContext);
  const currentClasses = useContext(ScheduleClassesContext);

  return (
    <View
      allClasses={allClasses}
      stateType={{
        type: "setStateAction",
        dispatch: setCurrentClasses,
      }}
      scheduleClasses={currentClasses}
      disableRemove
    />
  );
};

export default ViewWrapper;
