"use client";

import SavedList from "@/app/editor/(menu)/saved/SavedList";
import { db } from "@/backend";
import { cn } from "@/lib";
import { UserPublic } from "@/types";
import { get, off, ref } from "firebase/database";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { HTMLAttributes, useEffect, useState } from "react";

type Props = HTMLAttributes<HTMLDivElement> & { colors: string[] };

const UserCard = ({ className, colors, ...props }: Props) => {
  const searchParams = useSearchParams();
  const showId = searchParams.get("showId")?.toString();

  const [showUser, setShowUser] = useState<UserPublic>();

  useEffect(() => {
    if (!showId) return;

    const r = ref(db, `/public/users/${showId}`);
    get(r).then((snap) => setShowUser(snap.val()));

    return () => {
      off(r);
    };
  }, [showId]);

  return (
    <div
      className={cn("flex items-center justify-center p-4", className)}
      {...props}
    >
      <AnimatePresence>
        {showUser ? (
          <motion.div className="flex w-[max(20rem)] flex-col gap-2 rounded-md bg-bgSecondary p-4">
            <div className="flex flex-col items-center gap-2">
              <h2 className="font-heading text-5xl">{showUser.name}</h2>
              <div className="flex flex-col items-center text-sm text-text/70">
                <p>{showUser.email}</p>
                <p>{showUser.uid}</p>
              </div>
            </div>
            {showUser.schedules ? (
              <div>
                <SavedList
                  savedSchedules={showUser.schedules}
                  colors={colors}
                  uid={showUser.uid}
                />
              </div>
            ) : (
              <div>This user has no schedules on display.</div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default UserCard;
