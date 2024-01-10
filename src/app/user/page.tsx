"use client";

import { app } from "@/backend";
import { Button } from "@/ui";
import { getAuth, signOut } from "firebase/auth";

const Page = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="font-heading text-5xl">Dashboard</h1>
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

export default Page;
