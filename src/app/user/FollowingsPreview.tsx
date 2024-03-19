"use client";

import { cn } from "@/lib";
import Link from "next/link";
import { HTMLAttributes, useEffect, useState } from "react";

import { Button } from "@/ui";
import { getAuth } from "firebase/auth";
import { app, db } from "@/backend";
import { onValue, ref, update } from "firebase/database";
import { UserPublic } from "@/types";

type Props = HTMLAttributes<HTMLDivElement>;

const FollowingsPreview = ({ className, ...props }: Props) => {
  const [followings, setfollowings] = useState<string[] | null | "loading">(
    "loading",
  );

  const [results, setresults] = useState<
    Record<string, UserPublic> | null | "loading"
  >("loading");

  const unfollow = async (followingId: string) => {
    const user = getAuth(app).currentUser;
    if (!user || !followings || followings === "loading") return;

    const toUpdate = followings.filter((f) => f !== followingId);

    await update(ref(db, `/users/${user.uid}`), {
      followings: toUpdate,
    });
  };

  useEffect(() => {
    if (followings === "loading") return;

    const unsub = onValue(
      ref(db, "/public/users"),
      (snap) => {
        const allUsers: Record<string, UserPublic> | null = snap.val();

        if (!allUsers) return;
        if (!followings) {
          setresults(null);
          return;
        }

        const res: Record<string, UserPublic> = {};

        for (const id of followings) {
          res[id] = allUsers[id];
        }

        setresults(res);
      },
      { onlyOnce: true },
    );

    return () => {
      return unsub();
    };
  }, [followings]);

  useEffect(() => {
    const user = getAuth(app).currentUser;
    if (!user) return;

    const unsub = onValue(ref(db, `/users/${user.uid}/followings`), (snap) => {
      const val = snap.val();
      setfollowings(val);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <div
      className={cn("flex flex-col gap-2 overflow-hidden", className)}
      {...props}
    >
      <Link href="/user/followings" className="w-full shrink-0">
        <h2 className="text-2xl font-bold">Followings</h2>
      </Link>
      {results !== "loading" ? (
        results ? (
          Object.entries(results).map(([id, user]) => (
            <div
              key={id}
              className="flex items-center gap-2 rounded-md bg-bgSecondary p-2"
            >
              <Link href={`/user/search/${user.uid}`} className="basis-full">
                {user.name}
              </Link>
              <Button
                className="shrink-0 p-0 text-sm"
                variant="basic"
                disableBgEffect
                onClick={() => unfollow(id)}
              >
                Unfollow
              </Button>
            </div>
          ))
        ) : (
          <div>
            <p>You don{"'"}t follow any user. Click to find a user!</p>
            <Link href="/user/search">
              <Button variant="special">Search Users</Button>
            </Link>
          </div>
        )
      ) : null}
    </div>
  );
};

export default FollowingsPreview;
