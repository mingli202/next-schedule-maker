import type { HTMLProps } from "react";
import { cn } from "src/lib";

type Props = HTMLProps<HTMLDivElement>;

export function Sidebar({ className, ...props }: Props) {
  return (
    <div
      className={cn(
        "overflow-x-hidden overflow-y-hidden max-md:order-2 md:h-full md:overflow-x-auto",
        className,
      )}
      {...props}
    ></div>
  );
}
