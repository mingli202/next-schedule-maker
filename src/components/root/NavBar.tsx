import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { cn } from "@/lib/utils";

export function Navbar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        className,
        "bg-background bg-opacity-50 z-50 box-border flex flex-col gap-4 p-4 backdrop-blur-lg backdrop-filter",
      )}
    >
      <div className="flex items-center">
        <Link to="/" className="flex h-10 items-center gap-4">
          <Image src="/assets/logo.png" alt="Logo" width={36} height={36} />
          <span className="font-heading text-lg md:text-3xl">
            Dream Builder
          </span>
        </Link>
      </div>
    </div>
  );
}
