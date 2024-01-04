import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  index: number;
} & HTMLAttributes<HTMLDivElement>;

function Card({ index, className, children, ...props }: Props) {
  return (
    <div
      className={twMerge(
        className,
        "box-border rounded-lg p-6 text-bgPrimary",
        ["bg-primary", "bg-secondary text-text", "bg-third text-text"].at(
          index,
        ),
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
