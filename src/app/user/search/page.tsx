"use client";

import { db } from "@/backend";
import { UserPublic } from "@/types";

import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import Search from "./Search";
import Results from "./Results";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const [allUsers, setallUsers] = useState<UserPublic[]>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    const unsub = onValue(
      ref(db, "/public/users"),
      (snap) => {
        if (!snap.exists()) {
          setallUsers([]);
          return;
        }
        const val: Record<string, UserPublic> = snap.val();

        setallUsers(Object.values(val));
      },
      { onlyOnce: true },
    );

    return () => {
      unsub();
    };
  }, []);

  return (
    <>
      <Search className="w-full shrink-0 md:w-96" />
      <div className="basis-full overflow-hidden md:overflow-y-auto">
        <Results allUsers={allUsers} q={searchParams.get("q") ?? ""} />
      </div>
    </>
  );
};

export default Page;
