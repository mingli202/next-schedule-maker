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
          "flex w-full items-center justify-center",
        )}
        {...props}
      >
        <div className="box-border flex w-full flex-col items-center gap-4 bg-transparent text-xl tracking-tight">
          <h1 className="flex-1 text-center font-heading text-5xl tracking-tighter">
            Jac Schedule Builder
          </h1>
          <p className="text-center">The schedule builder you deserve</p>
          <Link href="/editor" className="w-fit">
            <Button variant="special" className="max-md:p-1">
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
