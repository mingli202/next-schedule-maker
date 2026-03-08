import type { HTMLProps, ReactNode } from "react";
import type { SectionResponse } from "@/client";
import { cn } from "@/lib/utils";
import LecLab from "./LecLab";

type SectionCardProps = {
  section: SectionResponse;
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
        "bg-secondary/60 flex flex-col gap-2 rounded-xl p-2",
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

      {section.leclabs.map((leclab) => (
        <LecLab
          key={leclab.id}
          leclab={leclab}
          className={cn("rounded-md p-2", leclabClassName)}
        />
      ))}

      {section.more !== "" && <p className="opacity-70">{section.more}</p>}
      {footer}
    </div>
  );
}
