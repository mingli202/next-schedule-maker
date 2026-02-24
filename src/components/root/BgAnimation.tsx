"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import { MovingSchedule } from "./MovingSchedule";

export function BgAnimation() {
  const last = useRef(1);
  const pause = useRef(false);

  const [vw, setVw] = useState(Infinity);
  const [worker, setWorker] = useState<Worker>();

  useEffect(() => {
    const worker = new Worker(
      new URL("../../workers/myWorker.ts", import.meta.url),
      {
        type: "module",
      },
    );
    setWorker(worker);
    setVw(window.innerWidth);

    return () => {
      worker.terminate();
    };
  }, []);

  return (
    <>
      <div className="from-bg-primary/75 to-primary/50 absolute top-0 left-0 -z-10 h-[200%] w-full bg-linear-to-b" />
      <div className="absolute top-0 left-0 -z-20 h-full w-full">
        {Array(vw > 768 ? 10 : 5)
          .fill(0)
          .map((_, i) => (
            <MovingSchedule
              key={i.toString()}
              index={i}
              lastRef={last}
              pauseRef={pause}
              worker={worker}
            />
          ))}
      </div>
      <Button
        className="absolute right-4 bottom-4"
        variant="basic"
        onClick={() => {
          pause.current = !pause.current;
        }}
      >
        Pause Bg
      </Button>
    </>
  );
}
