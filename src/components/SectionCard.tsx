import type { HTMLProps, ReactNode } from "react";
import type { Section } from "src/types/generated";
import { cn } from "@/lib/utils";
import LecLabComponent from "./LecLab";

type SectionCardProps = {
  section: Section;
  footer?: ReactNode;
  leclabClassName?: string;
} & HTMLProps<HTMLDivElement>;

export default function SectionCard({
  section,
  footer,
  className,
  leclabClassName,
  ...props
}: SectionCardProps) {
  return (
    <div
      className={cn(
        "bg-secondary/50 flex flex-col gap-2 rounded-xl p-2",
        className,
      )}
      {...props}
    >
      <div>
        <h2 className="font-light">
          {section.course}: {section.domain} {section.code}
        </h2>

        <h1 className="font-heading text-base font-bold md:text-xl">
          {section.section} {section.title}
        </h1>
      </div>

      {section.leclabs.map((leclab, i) => (
        <LecLabComponent
          key={section.id + JSON.stringify(leclab.dayTimes) + i.toString()}
          leclab={leclab}
          className={cn("p-2", leclabClassName)}
        />
      ))}

      {section.more !== "" && <p className="opacity-70">{section.more}</p>}
      {footer}
    </div>
  );
}
