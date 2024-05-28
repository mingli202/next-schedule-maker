"use client";

import SavedList from "@/app/components/SavedList";
import View from "@/app/components/View";
import { db, app } from "@/backend";

import { cn } from "@/lib";
import { Class, SharedCurrentClasses, UserPublic } from "@/types";
import { Button } from "@/ui";
import { faUserMinus, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAuth } from "firebase/auth";
import { onValue, ref, update } from "firebase/database";
import { HTMLAttributes, useEffect, useState } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  allClasses: Record<string, Class>;
  uid: string;
};

const UserCard = ({ className, allClasses, uid, ...props }: Props) => {
  const [followings, setfollowings] = useState<string[] | null>(null);
  const [allUsers, setallUsers] = useState<
    Record<string, UserPublic> | null | undefined
  >();

  const [searchSchedule, setSearchSchedule] = useState<SharedCurrentClasses[]>(
    [],
  );

  const [showUser, setShowUser] = useState<UserPublic | null | undefined>();

  useEffect(() => {
    const user = getAuth(app).currentUser;
    if (!user) return;

    const unsub = onValue(ref(db, `/users/${user.uid}/followings`), (snap) => {
      if (!snap.exists()) {
        setfollowings([]);
        return;
      }

      const val = snap.val();
      setfollowings(val);
    });

    const unsub2 = onValue(
      ref(db, "/public/users"),
      (snap) => {
        const val = snap.val();

        setShowUser(val[uid]);
        setallUsers(val);
      },
      { onlyOnce: true },
    );

    return () => {
      unsub();
      unsub2();
    };
  }, [uid]);

  const unfollow = async () => {
    const user = getAuth(app).currentUser;

    if (!user || !followings) return;

    const toUpdate = followings.filter((f) => f !== uid);

    await update(ref(db, `/users/${user.uid}`), {
      followings: toUpdate,
    }).catch(() => console.log("Error updating data"));
  };

  return (
    <div
      className={cn("h-full w-full overflow-hidden md:p-2", className)}
      {...props}
    >
      {showUser !== undefined && allUsers !== undefined ? (
        showUser && allUsers ? (
          <div
            className={cn(
              "h-full w-full gap-2 rounded-md bg-bgSecondary p-1 shadow-lg shadow-primary/30 md:flex md:gap-3 md:p-3",
              "overflow-auto",
            )}
          >
            <div className="shrink-0 overflow-x-hidden overflow-y-hidden md:order-2 md:h-full md:basis-3/4 md:overflow-x-auto">
              <View
                disableRemove
                allClasses={allClasses}
                scheduleClasses={searchSchedule}
                stateType={{
                  type: "setStateAction",
                  dispatch: setSearchSchedule,
                }}
              />
            </div>
            <div className="box-border flex basis-full flex-col gap-1 overflow-hidden rounded-md md:order-1 md:h-full md:basis-1/4 md:gap-2">
              <div className="flex shrink-0 items-center justify-between gap-2 p-1">
                <h2 className="font-heading text-xl md:text-3xl">
                  {allUsers[uid].name}
                </h2>

                {followings && followings.includes(allUsers[uid].uid) ? (
                  <Button
                    variant="basic"
                    className="shrink-0"
                    onClick={async (e) => {
                      e.stopPropagation();

                      await unfollow();
                    }}
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    variant="basic"
                    className="shrink-0"
                    onClick={async (e) => {
                      e.stopPropagation();

                      const user = getAuth(app).currentUser;
                      if (!user) return;

                      const toUpdate = followings
                        ? new Set<string>([...followings, uid])
                        : [uid];

                      await update(ref(db, `/users/${user.uid}`), {
                        followings: [...toUpdate],
                      }).catch(() => console.log("Error updating data"));
                    }}
                  >
                    Follow
                  </Button>
                )}
              </div>

              <div className="flex w-full basis-full flex-col overflow-hidden rounded-md bg-bgPrimary p-2">
                {allUsers[uid].schedules ? (
                  <SavedList
                    savedSchedules={allUsers[uid].schedules ?? {}}
                    allClasses={allClasses}
                    noEdit
                    stateType={{
                      type: "setStateAction",
                      dispatch: setSearchSchedule,
                    }}
                  />
                ) : (
                  <p>This user has no schedule on display.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col justify-center text-center">
            <p>Cannot find User</p>
            <p>
              (either the user doesn{"'"}t exist or their account is invisible)
            </p>
          </div>
        )
      ) : null}
    </div>
  );
};

export default UserCard;
