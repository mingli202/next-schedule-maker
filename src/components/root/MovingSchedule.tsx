import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { WorkerMessage, WorkerResponse } from "src/types/worker";
import View from "@/components/View";
import type { SavedSection } from "@/types/schedule";

type Props = {
  index: number;
  lastRef: RefObject<number>;
  pauseRef: RefObject<boolean>;
  worker: Worker | undefined;
};

export function MovingSchedule({ index, lastRef, pauseRef, worker }: Props) {
  const [schedule, setSchedule] = useState<Array<SavedSection>>([]);
  const isGenerating = useRef(false);
  const isStopped = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  const now = useRef<DOMHighResTimeStamp>(0);
  const speedData = useRef<{ dx: number; x0: number }>({
    dx: 0,
    x0: 0,
  });
  const deltaT = 1 / 120;

  const requestNewSchedule = useCallback(() => {
    worker?.postMessage({
      type: "mini-generate",
      index,
    } satisfies WorkerMessage);
  }, [worker, index]);

  const nextFrame = useCallback(
    (t: DOMHighResTimeStamp) => {
      if (!ref.current) {
        return;
      }

      if (!isStopped.current) {
        requestAnimationFrame(nextFrame);
      }

      if (pauseRef.current) {
        return;
      }

      const dt = t - now.current;

      if (dt < deltaT * 1000) {
        return;
      }

      now.current = t;

      const bounds = ref.current.getBoundingClientRect();
      const left = bounds.left;

      if (left > window.innerWidth + 50) {
        isGenerating.current = true;
        let ind = lastRef.current;

        while (ind === lastRef.current) {
          ind = Math.floor(Math.random() * 3);
        }
        lastRef.current = ind;

        const top = `${[-20, 10, 40][ind] + Math.random() * 10}%`;
        const zIndex = Math.floor(Math.random() * 1000);

        const dx = 0.03 * (0.5 * Math.random() + 1);
        const newLeft = -(1200 + Math.random() * 600);

        speedData.current.dx = dx;
        speedData.current.x0 = newLeft;

        ref.current.style.top = top;
        ref.current.style.left = `${newLeft}px`;
        ref.current.style.zIndex = `${zIndex}`;
        requestNewSchedule();
      } else if (!isGenerating.current) {
        ref.current.style.left = `${left + speedData.current.dx / deltaT}px`;
      }
    },
    [lastRef, lastRef.current, pauseRef, requestNewSchedule],
  );

  useEffect(() => {
    isStopped.current = false;

    const onMessage = (e: MessageEvent<WorkerResponse>) => {
      if (e.data.index !== index) {
        return;
      }
      if (e.data.schedule.length === 0) {
        requestNewSchedule();
        return;
      }
      setSchedule(e.data.schedule);
      isGenerating.current = false;
    };
    let id: number;
    let animationId: number;
    if (worker) {
      worker.addEventListener("message", onMessage);
      id = window.setTimeout(() => {
        animationId = requestAnimationFrame(nextFrame);
      }, 1000 * index);
    }

    return () => {
      worker?.removeEventListener("message", onMessage);
      isStopped.current = true;
      clearTimeout(id);
      cancelAnimationFrame(animationId);
    };
  }, [worker, index, requestNewSchedule, nextFrame]);

  return (
    <div
      className="absolute left-[110vw] h-160 w-[64.7rem] overflow-hidden shadow-[rgba(0,0,0,0.56)_0px_22px_70px_4px]"
      ref={ref}
    >
      <View savedSections={schedule} disableControls />
    </div>
  );
}
