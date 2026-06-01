import { memo, useCallback, useMemo } from "react";
import type { SavedSection } from "src/types/schedule";
import Schedule from "./Schedule";
import Button from "src/components/Button";
import { Virtuoso } from "react-virtuoso";
import { cn } from "src/lib/utils";
import { useNavigate } from "@tanstack/react-router";

const Footer = memo((props: { returnFn: () => void }) => {
  const { returnFn } = props;

  return (
    <div className="bg-background">
      <Button variant="special" className="w-fit" onClick={() => returnFn()}>
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

    return (
      <div className={cn(index !== 0 && "pt-2")}>
        <Schedule
          index={index}
          schedule={schedule}
          onScheduleSelected={onScheduleSelected}
          onScheduleSaved={() => {}}
        />
      </div>
    );
  },
);

type Props = {
  setIsBuilding: React.Dispatch<
    React.SetStateAction<"form" | "building" | "complete">
  >;
  generatedSchedules: SavedSection[][];
};

export default function Results({ setIsBuilding, generatedSchedules }: Props) {
  const returnFn = useCallback(() => setIsBuilding("form"), [setIsBuilding]);

  const components = useMemo(
    () => ({
      EmptyPlaceholder: () => <NoResult />,
    }),
    [],
  );

  return (
    <>
      <Virtuoso
        components={components}
        style={{ overflowX: "hidden", width: "100%" }}
        data={generatedSchedules}
        overscan={200}
        itemContent={(index, schedule) => (
          <MemoizedSchedule index={index} schedule={schedule} />
        )}
      />
      <Footer returnFn={returnFn} />
    </>
  );
}
