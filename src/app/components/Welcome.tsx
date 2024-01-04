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
        className={twMerge(className, "flex w-full items-center")}
        {...props}
      >
        <div className="box-border flex flex-col gap-4 bg-transparent pl-16 text-3xl tracking-tight">
          <h1 className="max-w-7xl flex-1 font-heading text-9xl tracking-tighter">
            Next Generation Schedule Builder
          </h1>
          <p className="max-w-4xl">
            Dream Builder is a schedule builder for John Abbott College that
            makes your schedule planing 10x faster!
          </p>
          <Link href="/editor" className="mt-6 w-fit">
            <Button variant="special">
              <div className="flex items-center gap-2 p-1 tracking-tight">
                <span>Give it a try</span>
                <FontAwesomeIcon icon={faArrowRight} className="h-7" />
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
