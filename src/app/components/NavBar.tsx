import Link from "next/link";
import { Button } from "@/ui";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

function Navbar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        className,
        "z-20 box-border flex justify-between bg-bgPrimary bg-opacity-50 p-4 backdrop-blur-lg backdrop-filter",
      )}
    >
      <Link href="/" className="flex h-[40px] items-center gap-4">
        <Image src="/assets/logo.png" alt="Logo" width={36} height={36} />
        <span className="font-heading text-3xl">Dream Builder</span>
      </Link>

      <div className="flex gap-6">
        <Link href="#about">
          <Button variant="basic">About</Button>
        </Link>

        <Link href="#features">
          <Button variant="basic">Features</Button>
        </Link>

        <Link href="#contact">
          <Button variant="basic">Contact</Button>
        </Link>

        <Link href="/login">
          <Button variant="special">Login</Button>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
