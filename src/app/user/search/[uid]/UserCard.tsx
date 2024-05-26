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
        setallUsers(val);
      },
      { onlyOnce: true },
    );

    return () => {
      unsub();
      unsub2();
    };
  }, []);

  const showUser = allUsers?.[uid];

  const unfollow = async () => {
    const user = getAuth(app).currentUser;

    if (!user || !followings) return;

    const toUpdate = followings.filter((f) => f !== uid);

    await update(ref(db, `/users/${user.uid}`), {
      followings: toUpdate,
    }).catch(() => console.log("Error updating data"));
  };

  return (
    <div className={cn("h-full w-full p-2", className)} {...props}>
      {showUser && showUser.visible ? (
        <div className="flex h-full w-full gap-3 rounded-md bg-bgSecondary p-3 shadow-xl shadow-primary/30">
          <div className="box-border flex basis-1/4 flex-col gap-2 overflow-hidden rounded-md max-md:order-2 md:h-full">
            <div className="flex shrink-0 items-center gap-2">
              <h2 className="font-heading text-3xl">{allUsers[uid].name}</h2>

              {followings && followings.includes(allUsers[uid].uid) ? (
                <Button
                  variant="basic"
                  className="h-7 w-7 shrink-0 p-0"
                  onClick={async (e) => {
                    e.stopPropagation();

                    await unfollow();
                  }}
                >
                  <FontAwesomeIcon
                    icon={faUserMinus}
                    className="h-full w-full"
                  />
                </Button>
              ) : (
                <Button
                  variant="basic"
                  className="h-7 w-7 shrink-0 p-0"
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
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    className="h-full w-full"
                  />
                </Button>
              )}
            </div>

            <div className="shrink-0 text-sm text-third">
              <p>{allUsers[uid].email}</p>
              <p>{allUsers[uid].uid}</p>
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

          <div className="basis-3/4 overflow-x-auto overflow-y-hidden max-md:order-1 md:h-full">
            <View
              disableRemove
              className="h-[40rem] min-w-[40rem] md:h-full"
              allClasses={allClasses}
              scheduleClasses={searchSchedule}
              stateType={{
                type: "setStateAction",
                dispatch: setSearchSchedule,
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col justify-center text-center">
          <p>Cannot find User</p>
          <p>
            (either the user doesn{"'"}t exist or their account is invisible)
          </p>
        </div>
      )}
    </div>
  );
};

export default UserCard;
