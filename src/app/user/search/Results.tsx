"use client";

import { app, db } from "@/backend";
import { UserPublic } from "@/types";
import { Button } from "@/ui";
import { getAuth } from "firebase/auth";
import { onValue, ref, update } from "firebase/database";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { HTMLAttributes, useEffect, useState } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  allUsers: UserPublic[];
  q: string;
};

function Results({ allUsers, q }: Props) {
  const [followings, setfollowings] = useState<string[] | null>(null);
  const [results, setResults] = useState<UserPublic[]>([]);

  useEffect(() => {
    const user = getAuth(app).currentUser;
    if (!user) return;

    const r = allUsers.filter((usr) => {
      return (
        usr.visible &&
        usr.uid !== user?.uid &&
        q.split(" ").every((_q) => {
          const re = new RegExp(_q, "ig");
          return usr.name.match(re);
        })
      );
    });
    setResults(r);
  }, [q, allUsers]);

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

  const unfollow = async (followingUid: string) => {
    const user = getAuth(app).currentUser;
    if (!user || !followings) return;

    const toUpdate = followings.filter((f) => f !== followingUid);

    await update(ref(db, `/users/${user.uid}`), {
      followings: toUpdate,
    });
  };

  const follow = async (followingUid: string) => {
    const user = getAuth(app).currentUser;
    if (!user) return;

    const updatedFollowings = followings
      ? [...followings, followingUid]
      : [followingUid];

    await update(ref(db, `/users/${user.uid}`), {
      followings: updatedFollowings,
    }).catch(() => alert("Failed to follow user"));
  };

  return (
    <div
      className="box-border flex flex-col gap-2 overflow-y-auto overflow-x-hidden rounded-md
    max-md:h-full md:grid md:grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]"
    >
      <AnimatePresence>
        {results.map((usr, i) => (
          <motion.div
            key={i.toString() + usr.uid}
            className="flex h-fit w-full cursor-pointer items-center gap-2 rounded-md bg-bgSecondary p-2"
            initial={{ opacity: 0, y: 5 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: i * 0.05,
              },
            }}
          >
            <div className="basis-full text-sm text-text/70">
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`/user/search/${usr.uid}`}
                  className="text-xl font-bold text-text"
                >
                  {usr.name}
                </Link>

                {followings && followings.includes(usr.uid) ? (
                  <Button
                    variant="basic"
                    className="shrink-0 p-0"
                    disableBgEffect
                    onClick={async (e) => {
                      e.stopPropagation();
                      await unfollow(usr.uid);
                    }}
                  >
                    <p>Unfollow</p>
                  </Button>
                ) : (
                  <Button
                    variant="basic"
                    className="shrink-0 p-1"
                    disableBgEffect
                    onClick={async (e) => {
                      e.stopPropagation();
                      await follow(usr.uid);
                    }}
                  >
                    <p>Follow</p>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="col-span-full h-0 bg-transparent opacity-0" />
    </div>
  );
}

export default Results;
