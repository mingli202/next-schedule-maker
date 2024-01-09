"use client";

import { app } from "@/backend";
import { Button } from "@/ui";
import { getAuth, signOut } from "firebase/auth";

const Page = () => {
  return (
    <div>
      <p>User Home Page is being built...</p>
      <Button variant="special" onClick={() => signOut(getAuth(app))}>
        Sign Out
      </Button>
    </div>
  );
};

export default Page;
