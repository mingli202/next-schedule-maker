import { twMerge } from "tailwind-merge";
import { Button } from "@/ui";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Bg from "./WelcomeBg";
import ScrollIndicator from "./ScrollIndicator";

function Welcome({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <>
      <div
        className={twMerge(
          className,
          "relative flex w-full items-center justify-center overflow-hidden",
        )}
        {...props}
      >
        <div className="box-border flex w-full flex-col items-center gap-4 bg-transparent text-xl tracking-tight">
          <h1 className="z-20 flex-1 text-center font-heading text-5xl tracking-tighter drop-shadow-[#000_0_0_20px]">
            Jac Schedule Builder
          </h1>
          <p className="z-20 text-center drop-shadow-[#000_0_0_20px]">
            The schedule builder you deserve
          </p>
          <Link href="/editor" className="z-20 w-fit">
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
        <ScrollIndicator />
        <Bg />
      </div>
    </>
  );
}

export default Welcome;
