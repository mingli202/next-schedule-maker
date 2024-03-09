"use client";

import { db } from "@/backend";
import { UserPublic } from "@/types";

import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import Search from "./Search";
import Results from "./Results";

type Props = {
  searchParams: {
    q?: string;
  };
};
const Page = ({ searchParams }: Props) => {
  const [allUsers, setallUsers] = useState<UserPublic[]>([]);

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
    <div className="relative flex h-full basis-full flex-col gap-4 overflow-hidden p-4">
      <Search className="w-96" />
      <Results allUsers={allUsers} q={searchParams.q ?? ""} />
    </div>
  );
};

export default Page;
