import type { HTMLProps } from "react";
import type { SectionResponse } from "@/client";
import { cn } from "@/lib";
import LecLab from "./LecLab";

type SectionCardProps = {
  section: SectionResponse;
} & HTMLProps<HTMLDivElement>;

export default function SectionCard({
  section,
  className,
  ...props
}: SectionCardProps) {
  return (
    <div className={cn("flex flex-col p-1", className)} {...props}>
      <h2>
        {section.course}: {section.domain} {section.code}
      </h2>

      <h1 className="font-heading text-base font-bold md:text-2xl">
        {section.section} {section.title}
      </h1>

      {section.leclabs.map((leclab) => (
        <LecLab
          key={leclab.id}
          leclab={leclab}
          className={cn("mt-2 rounded-md p-2")}
        />
      ))}

      {section.more !== "" && <p className="mt-2 opacity-70">{section.more}</p>}
    </div>
  );
}
