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
      <div className="absolute left-0 top-0 z-10 h-[200%] w-full bg-gradient-to-b from-bgPrimary/75 to-primary/50" />
      <div className="absolute left-0 top-0 -z-10 h-full w-full overflow-hidden">
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
        className="absolute bottom-4 right-4 z-20"
        variant="basic"
        onClick={() => (pause.current = !pause.current)}
      >
        Pause Bg
      </Button>
    </>
  );
}

export default BgAnimation;
