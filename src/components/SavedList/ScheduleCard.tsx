import type { SavedSchedule } from "convex/types";
import { type HTMLMotionProps, motion } from "framer-motion";
import { CircleCheck, CircleX, Trash } from "lucide-react";
import {
  type HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { getColorFromIndex } from "src/lib/colors";
import { useSectionStore } from "src/lib/store/section";
import { cn } from "src/lib/utils";
import Button from "../Button";

type Props = {
  schedule: SavedSchedule;
  disableEdit?: boolean;
  selectedId?: string;
  onScheduleSelect: (scheduleId: string) => void;
  onScheduleDelete: (scheduleId: string) => void;
  onScheduleNameChange: (scheduleId: string, newName: string) => void;
};

function ScheduleCard({
  schedule,
  className,
  disableEdit,
  selectedId,
  onScheduleSelect,
  onScheduleDelete,
  onScheduleNameChange,
  ...props
}: Props & HTMLAttributes<HTMLDivElement> & HTMLMotionProps<"div">) {
  const editRef = useRef<HTMLDivElement>(null);
  const { sectionsById } = useSectionStore();

  const [editName, setEditName] = useState(false);

  const nameChange = useCallback(
    (formdata: FormData) => {
      setEditName(false);
      const name = formdata.get("name")?.toString() ?? "Untitled";
      onScheduleNameChange(schedule.id, name);
    },
    [onScheduleNameChange, schedule.id],
  );

  const onEdit = useCallback(() => {
    if (disableEdit) return;

    setEditName(true);
  }, [disableEdit]);

  useEffect(() => {
    const f = (e: PointerEvent) => {
      if (!editRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (editRef.current.contains(e.target)) return;

      setEditName(false);
    };

    document.body.addEventListener("click", f);

    return () => {
      document.body.removeEventListener("click", f);
    };
  }, []);

  return (
    <motion.div
      className={cn(
        "bg-secondary/50 flex h-fit w-full flex-col gap-1 rounded-[calc(var(--radius)+var(--spacing)-2px)] p-1 transition",
        {
          "bg-secondary": selectedId === schedule.id,
        },
        className,
      )}
      onClick={(e) => {
        e.nativeEvent.stopImmediatePropagation();
      }}
      {...props}
    >
      <button
        type="button"
        className={cn(
          "col-span-5 row-[span_20/span_20] grid h-20 w-full shrink-0 cursor-pointer grid-cols-5 grid-rows-[repeat(20,1fr)] overflow-hidden rounded-md bg-slate-300 transition hover:bg-slate-300/90",
        )}
        title="select"
        onClick={() => {
          onScheduleSelect(schedule.id);
        }}
      >
        {schedule.sections.map(({ sectionId, colorIndex }) => {
          const sch = sectionsById.get(sectionId);

          if (!sch) {
            return null;
          }

          const { bgColor } = getColorFromIndex(colorIndex);

          return sch.viewData.map((s) => {
            const [day, [start, end]] = Object.entries(s)[0];

            return (
              <div
                className="rounded-xs"
                style={{
                  gridColumn: day,
                  gridRowStart: start,
                  gridRowEnd: end,
                  backgroundColor: bgColor,
                }}
                key={`${sch.code}-${sch.section}-${day}-${schedule.id}-${start}-${end}`}
              />
            );
          });
        })}
      </button>

      <div
        className="flex h-full items-center justify-between gap-2"
        id="asdf"
        ref={editRef}
      >
        {editName ? (
          <form
            className="bg-background box-border flex basis-full items-center overflow-hidden rounded-md"
            action={async (f) => {
              if (disableEdit) return;
              nameChange(f);
            }}
          >
            <input
              name="name"
              id="name"
              className="bg-background w-full outline-none"
              defaultValue={schedule.name}
              // biome-ignore lint/a11y/noAutofocus: no, this is peak
              autoFocus
            />
            <Button variant="basic" type="submit" className="shrink-0 p-1">
              <CircleCheck className="h-3 w-3 md:h-4 md:w-4" />
            </Button>

            <Button
              variant="basic"
              type="button"
              onClick={() => setEditName(false)}
              className="shrink-0 p-1"
            >
              <CircleX className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </form>
        ) : (
          <>
            <button
              type="button"
              className={cn(
                !disableEdit && "cursor-pointer",
                "line-clamp-1 text-left",
              )}
              onClick={onEdit}
              title="edit"
            >
              {schedule.name && schedule.name !== ""
                ? schedule.name
                : "Untitled"}
            </button>
            {disableEdit !== true && (
              <Button
                title="delete"
                variant="basic"
                className="shrink-0 p-1"
                onClick={() => {
                  if (disableEdit) return;
                  onScheduleDelete(schedule.id);
                }}
              >
                <Trash className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

export default ScheduleCard;
