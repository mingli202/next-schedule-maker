import { useNavigate, useSearch } from "@tanstack/react-router";
import type { SavedSchedule } from "convex/types";
import { useCallback } from "react";
import { Button, PageLoading } from "src/components";
import SavedList from "src/components/SavedList";
import { useSavedSchedule } from "src/hooks/useSavedSchedule";
import { CurrentScheduleSectionsLegend } from "./CurrentScheduleSectionsLegend";
import { LoginIndicator } from "./LoginIndicator";

export default function SavedSchedules() {
  const navigate = useNavigate({ from: "/editor/saved" });

  const currentSections = useSearch({
    from: "/editor/saved",
    select: (s) => s.sections,
  });

  const {
    schedules,
    updateSavedScheduleName,
    deleteSavedSchedule,
    setSavedSchedule,
    isLoading,
  } = useSavedSchedule();

  const handleClick = useCallback(() => {
    setSavedSchedule({
      name: "Untitled",
      source: "default",
      sections: currentSections,
    });
  }, [currentSections, setSavedSchedule]);

  const handleSavedScheduleSelect = useCallback(
    (schedule: SavedSchedule) => {
      navigate({
        to: ".",
        search: (prev) => ({
          ...prev,
          sections: schedule.sections,
        }),
      });
    },
    [navigate],
  );

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className="relative flex h-full w-full flex-col gap-2">
      <div className="flex w-full shrink-0 justify-center pt-2">
        <Button
          variant="special"
          className="w-fit text-sm"
          onClick={handleClick}
          disableScaleEffect
        >
          Save Current Schedule
        </Button>
      </div>

      <SavedList
        onScheduleSelect={handleSavedScheduleSelect}
        onScheduleDelete={deleteSavedSchedule}
        onSheduleNameChange={updateSavedScheduleName}
        savedSchedules={schedules}
      />

      <LoginIndicator />

      <CurrentScheduleSectionsLegend />
    </div>
  );
}
