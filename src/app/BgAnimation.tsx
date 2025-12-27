"use client";

import type { Class } from "@/types";
import MovingSchedule from "./MovingSchedule";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/ui";

type Props = {
  allClasses: Record<string, Class>;
};

function BgAnimation({ allClasses }: Props) {
  const last = useRef(1);
  const pause = useRef(false);

  const [vw, setVw] = useState(Infinity);
  const workerRef = useRef<Worker>(null);

  useEffect(() => {
    console.log(import.meta.url);
    console.log(new URL("../workers/myWorker.ts", import.meta.url));
    const worker = new Worker(
      new URL("../workers/myWorker.ts", import.meta.url),
    );
    const anotherWorker = new Worker(
      new URL("../workers/anotherWorker.js", import.meta.url),
    );
    console.log({ anotherWorker });
    workerRef.current = worker;
    console.log({ worker });
    setVw(window.innerWidth);

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  return (
    <>
      <div className="from-bg-primary/75 to-primary/50 absolute top-0 left-0 -z-10 h-[200%] w-full bg-linear-to-b" />
      <div className="absolute top-0 left-0 -z-20 h-full w-full">
        {Array(vw > 768 ? 1 : 1)
          .fill(0)
          .map((_, i) => (
            <MovingSchedule
              allClasses={allClasses}
              key={i}
              index={i}
              lastRef={last}
              pauseRef={pause}
              workerRef={workerRef}
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

export default BgAnimation;
