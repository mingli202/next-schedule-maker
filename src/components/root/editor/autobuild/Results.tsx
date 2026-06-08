import { useNavigate } from "@tanstack/react-router";
import { memo, useCallback, useMemo } from "react";
import { type Components, Virtuoso } from "react-virtuoso";
import Button from "src/components/Button";
import { cn } from "src/lib/utils";
import type { SavedSection } from "src/types/schedule";
import Schedule from "./Schedule";
import { useSavedSchedule } from "src/hooks/useSavedSchedule";

const Footer = memo((props: { returnFn: () => void }) => {
  const { returnFn } = props;

  return (
    <div className="bg-background">
      <Button variant="special" className="w-fit" onClick={returnFn}>
        Return
      </Button>
    </div>
  );
});

const NoResult = memo(() => <p>No schedule can be made.</p>);

const MemoizedSchedule = memo(
  ({ index, schedule }: { index: number; schedule: SavedSection[] }) => {
    const navigate = useNavigate({ from: "/editor/autobuild" });

    const onScheduleSelected = useCallback(() => {
      navigate({
        search: (prev) => ({
          ...prev,
          sections: schedule,
        }),
      });
    }, [navigate, schedule]);

    const { setSavedSchedule } = useSavedSchedule();

    const onScheduleSaved = useCallback(
      (schedule: SavedSection[]) => {
        setSavedSchedule({
          sections: schedule,
          name: "Untitled",
          source: "default",
        });
      },
      [setSavedSchedule],
    );

    return (
      <div className={cn(index !== 0 && "pt-2")}>
        <Schedule
          index={index}
          schedule={schedule}
          onScheduleSelected={onScheduleSelected}
          onScheduleSaved={onScheduleSaved}
        />
      </div>
    );
  },
);

type Props = {
  generatedSchedules: SavedSection[][];
  onReturn: () => void;
  onScroll: (topScrollIndex: number) => void;
  initialScroll: number;
};

export default memo(
  ({ generatedSchedules, onReturn, onScroll, initialScroll }: Props) => {
    const components: Components<
      {
        sectionId: number;
        colorIndex: number;
      }[]
    > = useMemo(
      () => ({
        EmptyPlaceholder: () => <NoResult />,
        Header: () => (
          <div>{generatedSchedules.length} schedules generated</div>
        ),
      }),
      [generatedSchedules.length],
    );

    return (
      <>
        <Virtuoso
          components={components}
          initialTopMostItemIndex={initialScroll}
          style={{ overflowX: "hidden", width: "100%" }}
          data={generatedSchedules}
          rangeChanged={(range) => onScroll(range.startIndex)}
          overscan={200}
          itemContent={(index, schedule) => (
            <MemoizedSchedule index={index} schedule={schedule} />
          )}
        />
        <Footer returnFn={onReturn} />
      </>
    );
  },
);
