"use client";

import { cn } from "@/lib";
import { Button } from "@/ui";
import { faMinus, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import { HTMLAttributes, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { get, ref, update } from "firebase/database";
import { app, db } from "@/backend";
import { UserPublic } from "@/types";
import { getAuth } from "firebase/auth";
import { FollowingsContext } from "../Context";

type Props = HTMLAttributes<HTMLDivElement>;

const Search = ({ className, ...props }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [results, setResults] = useState<UserPublic[]>([]);

  const followings = useContext(FollowingsContext);

  useEffect(() => {
    const q = searchParams.get("q")?.toString() ?? "";
    const user = getAuth(app).currentUser;

    get(ref(db, "/public/users")).then((snapshot) => {
      if (!snapshot.exists()) return;
      const val: Record<string, UserPublic> = snapshot.val();

      setResults(
        Object.values(val).filter((usr) => {
          return (
            usr.visible &&
            usr.uid !== user?.uid &&
            q.split(" ").every((_q) => {
              const re = new RegExp(_q, "ig");
              return (
                usr.email.match(re) || usr.name.match(re) || usr.uid.match(re)
              );
            })
          );
        }),
      );
    });

    return () => {};
  }, [searchParams]);

  const action = (formdata: FormData) => {
    const search = formdata.get("search")?.toString();

    const url = new URL(window.location.href);

    if (search) {
      url.searchParams.set("q", search);
    } else {
      url.searchParams.delete("q");
    }

    router.push(`/user/search?${url.searchParams}`);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <h2 className="shrink-0 font-heading text-3xl">Search Users</h2>
      <form className="flex w-full shrink-0 gap-2" action={action}>
        <input
          className="basis-full rounded-md border border-third bg-bgPrimary p-2 outline-none placeholder:italic focus:border-primary focus:bg-bgSecondary"
          name="search"
          id="search"
          type="text"
          placeholder="Search by username, email or uid"
        />
        <Button variant="special" className="shrink-0" type="submit">
          <FontAwesomeIcon icon={faSearch} className="h-4 w-4" />
        </Button>
      </form>
      <div className="box-border flex basis-full flex-col gap-2 overflow-y-auto overflow-x-hidden rounded-md">
        <AnimatePresence>
          {results.map((usr, i) => (
            <motion.div
              key={i.toString() + usr.uid}
              className="flex cursor-pointer items-center gap-2 rounded-md bg-bgSecondary p-2"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.025 }}
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.set("showId", usr.uid);
                router.push(`/user/search?${url.searchParams}`);
              }}
            >
              <div className="basis-full text-sm text-text/70">
                <p className="font-heading text-xl font-bold text-text">
                  {usr.name}
                </p>
                <p>{usr.email}</p>
                <p>{usr.uid}</p>
              </div>
              {followings && followings.includes(usr.uid) ? (
                <Button
                  variant="basic"
                  className="shrink-0 p-1"
                  onClick={async (e) => {
                    e.stopPropagation();

                    const user = getAuth(app).currentUser;
                    if (!user) return;

                    const toUpdate = followings.filter((f) => f !== usr.uid);

                    await update(ref(db, `/users/${user.uid}`), {
                      followings: [...toUpdate],
                    }).catch(() => console.log("Error updating data"));
                  }}
                >
                  <FontAwesomeIcon icon={faMinus} className="h-8 w-8" />
                </Button>
              ) : (
                <Button
                  variant="basic"
                  className="shrink-0 p-1"
                  onClick={async (e) => {
                    e.stopPropagation();

                    const user = getAuth(app).currentUser;
                    if (!user) return;

                    const toUpdate = followings
                      ? new Set<string>([...followings, usr.uid])
                      : [usr.uid];

                    await update(ref(db, `/users/${user.uid}`), {
                      followings: [...toUpdate],
                    }).catch(() => console.log("Error updating data"));
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} className="h-8 w-8" />
                </Button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Search;
