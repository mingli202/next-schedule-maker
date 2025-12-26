"use client";

import { Class } from "@/types";
import MovingSchedule from "./MovingSchedule";
import { useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/ui";

type Props = {
  allClasses: Record<string, Class>;
};

function BgAnimation({ allClasses }: Props) {
  const last = useRef(1);
  const pause = useRef(false);

  const [vw, setVw] = useState(Infinity);

  useLayoutEffect(() => {
    setVw(window.innerWidth);
  }, []);

  return (
    <>
      <div className="from-bg-primary/75 to-primary/50 absolute top-0 left-0 -z-10 h-[200%] w-full bg-gradient-to-b" />
      <div className="absolute top-0 left-0 -z-20 h-full w-full">
        {Array(vw > 768 ? 10 : 5)
          .fill(0)
          .map((_, i) => (
            <MovingSchedule
              allClasses={allClasses}
              key={i}
              index={i}
              last={last}
              pause={pause}
            />
          ))}
      </div>
      <Button
        className="absolute right-4 bottom-4"
        variant="basic"
        onClick={() => (pause.current = !pause.current)}
      >
        Pause Bg
      </Button>
    </>
  );
}

export default BgAnimation;
