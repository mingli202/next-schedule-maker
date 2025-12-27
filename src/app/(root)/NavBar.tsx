import Link from "next/link";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

function Navbar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        className,
        "bg-bg-primary bg-opacity-50 z-50 box-border flex flex-col gap-4 p-4 backdrop-blur-lg backdrop-filter",
      )}
    >
      <div className="flex items-center">
        <Link href="/" className="flex h-10 items-center gap-4">
          <Image src="/assets/logo.png" alt="Logo" width={36} height={36} />
          <span className="font-heading text-lg md:text-3xl">
            Dream Builder
          </span>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
