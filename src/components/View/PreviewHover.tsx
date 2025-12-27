"use client";

import type { Class } from "@/types";
import { useSearchParams } from "next/navigation";

type Props = {
  allClasses: Record<string, Class>;
};
function PreviewHover({ allClasses }: Props) {
  const searchParams = useSearchParams();
  if (searchParams.get("previewHover") !== "true") return;

  const hoverId = searchParams.get("hoverId");
  if (!hoverId || !hoverId.match(/\d+/)) return;

  const hoverClass = allClasses[hoverId];

  return (
    <div className="absolute top-0 left-0 z-10 grid h-full w-full grid-cols-5 grid-rows-[repeat(20,1fr)] bg-transparent">
      {hoverClass.viewData.map((times) => {
        const [d, [start, end]] = Object.entries(times)[0];
        return (
          <div
            key={hoverClass.code + d + hoverClass.section + "hover"}
            className="z-10 overflow-hidden rounded-md bg-white p-2 text-[8px] leading-2.5 text-black opacity-50 md:text-[14px] md:leading-3.5"
            style={{
              gridColumn: d,
              gridRowStart: start,
              gridRowEnd: end,
            }}
          >
            <p className="line-clamp-2 font-bold">
              {hoverClass.lecture?.title}
            </p>
            <p className="mt-1 line-clamp-1">{hoverClass.code}</p>
            <p className="font">{hoverClass.section}</p>
            <p className="mt-1 line-clamp-2">{hoverClass.lecture?.prof}</p>
          </div>
        );
      })}
    </div>
  );
}

export default PreviewHover;
