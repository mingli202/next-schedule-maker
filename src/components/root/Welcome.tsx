import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { HTMLAttributes } from "react";
import { cn } from "src/lib/utils";
import Button from "@/components/Button";
import { BgAnimation } from "./BgAnimation";

export function Welcome({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        className,
        "relative flex w-full items-center justify-center overflow-hidden",
      )}
      {...props}
    >
      <div className="box-border flex w-full flex-col items-center gap-4 bg-transparent text-xl tracking-tight">
        <h1 className="font-heading flex-1 text-center text-5xl tracking-tighter drop-shadow-[#000_0_0_20px]">
          Jac Schedule Builder
        </h1>
        <p className="text-center drop-shadow-[#000_0_0_20px]">
          The schedule builder you deserve
        </p>
        <Link to="/editor/search" search={{ sections: [] }} className="w-fit">
          <Button
            variant="special"
            className="drop-shadow-[rgba(0,0,0,0.5)_0_0_20px] max-md:p-1"
          >
            <div className="flex items-center gap-2 p-1 tracking-tight">
              <span>Give it a try</span>
              <ArrowRight className="h-5 md:h-7" />
            </div>
          </Button>
        </Link>
      </div>
      <BgAnimation />
    </div>
  );
}
