"use client";

import { app } from "@/backend";
import { cn } from "@/lib";
import { Button } from "@/ui";
import { getAuth, signOut } from "firebase/auth";

import { HTMLAttributes } from "react";

function Banner({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const user = getAuth(app).currentUser;

  return (
    <div className={cn("flex items-center gap-4", className)} {...props}>
      <div className="basis-full items-center md:flex">
        <h1 className="shrink-0 font-heading text-3xl md:text-5xl">
          Dashboard
        </h1>

        <div className="invisible basis-full bg-transparent max-md:hidden" />

        <p className="shrink-0">{user?.displayName ?? user?.email ?? "User"}</p>
      </div>

      <Button
        variant="special"
        onClick={() => signOut(getAuth(app))}
        className="h-fit w-fit shrink-0"
      >
        Sign Out
      </Button>
    </div>
  );
}

export default Banner;
