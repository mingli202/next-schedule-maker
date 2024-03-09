"use client";

import { app } from "@/backend";
import { cn } from "@/lib";
import { Button } from "@/ui";
import { getAuth, signOut } from "firebase/auth";

import { HTMLAttributes } from "react";

const Banner = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  const user = getAuth(app).currentUser;

  return (
    <div className={cn("flex justify-between", className)} {...props}>
      <h1 className="font-heading text-5xl">Dashboard</h1>
      <div className="flex items-center gap-4">
        <p>{user?.displayName ?? user?.email ?? "User"}</p>
        <Button
          variant="special"
          onClick={() => signOut(getAuth(app))}
          className="h-fit w-fit"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Banner;
