import Button from "@/components/Button";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { HTMLAttributes } from "react";
import { Class } from "@/types";
import { getLocalJsonData } from "@/lib/getLocalJson";
import BgAnimation from "./BgAnimation";
import cn from "@/lib/cn";

async function Welcome({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const allClasses: Record<string, Class> =
    await getLocalJsonData("allClasses");

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
        <Link href="/editor" className="w-fit">
          <Button
            variant="special"
            className="drop-shadow-[rgba(0,0,0,0.5)_0_0_20px] max-md:p-1"
          >
            <div className="flex items-center gap-2 p-1 tracking-tight">
              <span>Give it a try</span>
              <FontAwesomeIcon icon={faArrowRight} className="h-5 md:h-7" />
            </div>
          </Button>
        </Link>
      </div>
      <BgAnimation allClasses={allClasses} />
    </div>
  );
}

export default Welcome;
