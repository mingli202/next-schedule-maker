"use client";

import { Class } from "@/types";
import { useSearchParams } from "next/navigation";

type Props = {
  allClasses: Record<string, Class>;
};
const PreviewHover = ({ allClasses }: Props) => {
  const searchParams = useSearchParams();
  if (searchParams.get("previewHover") !== "true") return;

  const hoverId = searchParams.get("hoverId");
  if (!hoverId || !hoverId.match(/\d+/)) return;

  const hoverClass = allClasses[hoverId];

  return (
    <div className="absolute left-0 top-0 z-10 grid h-full w-full grid-cols-5 grid-rows-[repeat(20,1fr)] bg-transparent">
      {hoverClass.viewData.map((times) => {
        const [d, [start, end]] = Object.entries(times)[0];
        return (
          <div
            key={hoverClass.code + d + hoverClass.section + "hover"}
            className="z-10 overflow-hidden rounded-md bg-white p-2 text-[8px] leading-[10px] text-black opacity-50 md:text-[14px] md:leading-[14px]"
            style={{
              gridColumn: d,
              gridRowStart: start,
              gridRowEnd: end,
            }}
          >
            <p className="line-clamp-2 font-bold">{hoverClass.lecture.title}</p>
            <p className="mt-1 line-clamp-1">{hoverClass.code}</p>
            <p className="font">{hoverClass.section}</p>
            <p className="mt-1 line-clamp-2">{hoverClass.lecture.prof}</p>
          </div>
        );
      })}
    </div>
  );
};

export default PreviewHover;
