"use client";

import { Class, SharedCurrentClasses } from "@/types";
import View from "./components/View";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import type { WorkerResponse } from "@/workers/myWorker";

type Props = {
  allClasses: Record<string, Class>;
  index: number;
  lastRef: RefObject<number>;
  pauseRef: RefObject<boolean>;
  workerRef: RefObject<Worker | null>;
};

function MovingSchedule({
  allClasses,
  index,
  lastRef,
  pauseRef,
  workerRef,
}: Props) {
  // const [hidden, setHidden] = useState(true);
  const [schedule, setSchedule] = useState<SharedCurrentClasses[]>([]);
  const ref = useRef<HTMLDivElement>(null!);

  const animationFrames = useRef<number[]>([]);
  const now = useRef<DOMHighResTimeStamp>(0);

  const requestNewSchedule = useCallback(() => {
    console.log("request new schedule");
    workerRef.current?.postMessage({
      type: "mini-generate",
      allClasses,
    });
  }, [workerRef, allClasses]);

  const handleNewSchedule = useCallback(
    (sch: SharedCurrentClasses[] = []) => {
      console.log("handle new schedule", sch);
      if (sch.length === 0) {
        requestNewSchedule();
        return;
      }
      setSchedule(sch);

      let ind = lastRef.current;

      while (ind === lastRef.current) {
        ind = Math.floor(Math.random() * 3);
      }
      lastRef.current = ind;

      const top = `${[-20, 10, 40][ind] + Math.random() * 10}%`;
      const dx = 0.5 * (0.5 * Math.random() + 1);
      const zIndex = Math.floor(Math.random() * 1000);
      const newLeft = 1200 + Math.random() * 600;

      ref.current.style.top = top;
      ref.current.style.left = `-${newLeft}px`;
      ref.current.style.zIndex = `${zIndex}`;

      function updateFrame(t: DOMHighResTimeStamp) {
        const id = requestAnimationFrame(updateFrame);
        const time = t - now.current;

        if (pauseRef.current) {
          return;
        }

        const bounds = ref.current.getBoundingClientRect();
        const left = bounds.left;

        if (left > window.innerWidth + 50) {
          cancelAnimationFrame(id);
          workerRef.current?.postMessage({
            type: "mini-generate",
            allClasses,
          });
        }

        ref.current.style.left = `${left + dx * time}px`;
      }

      now.current = performance.now();
      const id = requestAnimationFrame(updateFrame);
      animationFrames.current.push(id);
    },

    [requestNewSchedule, lastRef, pauseRef, workerRef, allClasses],
  );

  useEffect(() => {
    const onMessage = (e: MessageEvent<WorkerResponse>) => {
      handleNewSchedule(e.data.schedule);
    };
    const worker = workerRef.current;
    worker?.addEventListener("message", onMessage);

    const id = setTimeout(() => {
      requestNewSchedule();
    }, 1000 * index);

    return () => {
      worker?.removeEventListener("message", onMessage);
      clearTimeout(id);
    };
  }, [workerRef, handleNewSchedule, requestNewSchedule, index]);

  return (
    <div
      className="absolute h-160 w-[64.7rem] overflow-hidden shadow-[rgba(0,0,0,0.56)_0px_22px_70px_4px]"
      ref={ref}
      style={{ left: -1200 }}
    >
      <View
        allClasses={allClasses}
        scheduleClasses={schedule}
        stateType="none"
        disableTime
      />
    </div>
  );
}

export default MovingSchedule;
