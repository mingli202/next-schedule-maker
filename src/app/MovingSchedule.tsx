"use client";

import { Class, SharedCurrentClasses } from "@/types";
import View from "./components/View";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import miniGenerate from "./mini-generate";

type Props = {
  allClasses: Record<string, Class>;
  index: number;
  last: MutableRefObject<number>;
  pause: MutableRefObject<boolean>;
};

function MovingSchedule({ allClasses, index, last, pause }: Props) {
  const newSch = useCallback(() => {
    let sch: SharedCurrentClasses[] = [];

    while (sch.length === 0) {
      sch = miniGenerate(allClasses);
    }

    return sch;
  }, [allClasses]);

  const [top, setTop] = useState("0%");
  const [hidden, setHidden] = useState(true);
  const [schedule, setSchedule] = useState(newSch());

  useLayoutEffect(() => {
    let ind = last.current;

    while (ind === last.current) {
      ind = Math.floor(Math.random() * 3);
    }
    last.current = ind;

    setTop(`${[-20, 10, 40][ind] + Math.random() * 10}%`);

    // custom delay to give a staggered effect
    const id = setTimeout(() => {
      setHidden(false);
    }, 1000 * index);

    return () => clearTimeout(id);
  }, [index, last]);

  // setup the animation
  function getSpeed() {
    return 0.5 * Math.random() + 1;
  }
  useEffect(() => {
    if (hidden) return;

    const sch = document.getElementById("movingSchedule#" + index)!;
    let dx = getSpeed();

    // the animation
    const id = setInterval(() => {
      if (pause.current) {
        return;
      }

      const left = Number(sch.style.left.replace("px", ""));

      if (left > window.innerWidth + 50) {
        const nSch = newSch();
        setSchedule(nSch);

        dx = getSpeed();

        let ind = last.current;

        while (ind === last.current) {
          ind = Math.floor(Math.random() * 3);
        }
        last.current = ind;

        const top = `${[-20, 10, 40][ind] + Math.random() * 10}%`;

        sch.style.left = `-${1200 + Math.random() * 600}px`;
        sch.style.top = top;
        sch.style.zIndex = `${Math.floor(Math.random() * 1000)}`;
      } else {
        sch.style.left = `${left + dx}px`;
      }
    }, 1);

    return () => clearInterval(id);
  }, [index, hidden, last, pause, allClasses, newSch]);

  return hidden ? null : (
    <div
      className="absolute h-[40rem] w-[64.7rem] overflow-hidden shadow-[rgba(0,_0,_0,_0.56)_0px_22px_70px_4px]"
      id={"movingSchedule#" + index}
      style={{
        top: top,
        left: -1200,
        zIndex: Math.floor(Math.random() * 1000),
      }}
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
