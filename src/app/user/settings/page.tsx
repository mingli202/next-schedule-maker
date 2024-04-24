"use client";

import { useEffect, useState } from "react";
import { onValue, ref, update } from "firebase/database";
import { getAuth, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { app, db } from "@/backend";
import { UserPublic } from "@/types";
import { Button } from "@/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faEdit,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Slider from "./Slider";
import { cn } from "@/lib";

const Input = ({
  k,
  value,
  display,
  action,
}: {
  k: string;
  value: string;
  display: string;
  action: (formdata: FormData) => void;
}) => {
  const [editName, setEditName] = useState(false);

  return (
    <div
      className={cn(
        "w-100 flex items-center overflow-hidden rounded-md bg-bgSecondary p-2",
        ...["w-full", "flex-col", "items-start"].map((c) => "max-md:" + c),
      )}
    >
      <p
        className={cn(
          "w-[min(30%,15rem)] shrink-0 overflow-x-auto p-2 text-primary",
          ...["w-full"].map((c) => "max-md:" + c),
        )}
      >
        {display}
      </p>
      {editName ? (
        <form
          className="box-border flex items-center overflow-hidden rounded-md bg-bgPrimary"
          action={(f: FormData) => {
            setEditName(false);
            action(f);
          }}
        >
          <input
            className="w-fit bg-bgPrimary p-2 outline-none"
            autoFocus
            defaultValue={value}
            name={k}
          />
          <Button variant="basic" type="submit" className="shrink-0">
            <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4" />
          </Button>

          <Button
            variant="basic"
            type="button"
            onClick={() => setEditName(false)}
            className="shrink-0"
          >
            <FontAwesomeIcon icon={faXmarkCircle} className="h-4 w-4" />
          </Button>
        </form>
      ) : (
        <div className="flex w-full gap-2 p-2">
          <p className={cn("overflow-x-auto")} title="edit">
            {value}
          </p>

          <Button
            title="delete"
            variant="basic"
            className="shrink-0 p-0"
            onClick={() => {
              setEditName(true);
            }}
          >
            <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

const Page = () => {
  const [user, setuser] = useState<UserPublic | null>(null);

  useEffect(() => {
    const user = getAuth(app).currentUser;
    if (!user) return;

    const unsub = onValue(ref(db, "/public/users/" + user.uid), (snap) => {
      const val = snap.val();
      setuser(val);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <div className="flex w-full flex-col gap-2 p-3">
      {user ? (
        <>
          <div>
            <h1 className="font-heading text-3xl">Profile</h1>
            <p className={cn("text-sm text-text/70")}>Manage your profile</p>
          </div>

          <div className="h-0.5 w-full rounded-full bg-third/50" />

          <div className="p-2">
            <h2 className="text-xl">Basic Info</h2>
            <p className={cn("text-sm text-text/70")}>
              How you will appear to other users
            </p>
            <div className="mt-2 flex flex-col gap-2">
              <Input
                k="name"
                display="Display Name"
                value={user.name}
                action={async (formdata: FormData) => {
                  const user = getAuth(app).currentUser;
                  if (!user) return;

                  const val = formdata.get("name")?.toString();
                  if (!val) return;

                  await update(ref(db, `/public/users/${user.uid}`), {
                    name: val,
                  }).catch(() =>
                    alert("Error updating public data. Try again."),
                  );

                  await updateProfile(user, {
                    displayName: val,
                  }).catch(() => alert("Error updating profile. Try again."));
                }}
              />
              <div
                className={cn(
                  "w-100 flex overflow-hidden rounded-md bg-bgSecondary p-4 max-md:gap-2 md:items-center",
                  ...["w-full", "flex-col", "items-start", "p-3"].map(
                    (c) => "max-md:" + c,
                  ),
                )}
              >
                <p
                  className={cn(
                    "w-[min(30%,15rem)] shrink-0 overflow-x-auto text-primary",
                    ...["w-full"].map((c) => "max-md:" + c),
                  )}
                >
                  Uid
                </p>
                <p className="overflow-x-auto">{user.uid}</p>
              </div>

              <div
                className={cn(
                  "w-100 flex overflow-hidden rounded-md bg-bgSecondary p-4 max-md:gap-2 md:items-center",
                  ...["w-full", "flex-col", "items-start", "p-3"].map(
                    (c) => "max-md:" + c,
                  ),
                )}
              >
                <p
                  className={cn(
                    "w-[min(30%,15rem)] shrink-0 overflow-x-auto text-primary",
                    ...["w-full"].map((c) => "max-md:" + c),
                  )}
                >
                  Email
                </p>
                <p className="overflow-x-auto">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="h-0.5 w-full rounded-full bg-third/50" />

          <div className="p-2">
            <h2 className="text-xl">Visibility</h2>
            <p className={cn("text-sm text-text/70")}>
              Whether you are searchable by other users
            </p>
            <div className="mt-2 flex flex-col gap-2">
              <Slider />
            </div>
          </div>

          <div className="h-0.5 w-full rounded-full bg-third/50" />

          <div className="p-2">
            <h2 className="text-xl">Other</h2>
            <div className="mt-2 flex flex-col gap-2">
              <div
                className={cn(
                  "flex w-full items-center overflow-hidden rounded-md bg-bgSecondary p-1 md:p-2",
                )}
              >
                <p
                  className={cn(
                    "shrink-0 p-2 text-primary md:w-[min(30%,15rem)] md:overflow-x-auto",
                  )}
                >
                  Password
                </p>
                {getAuth(app).currentUser?.providerData.some(
                  (d) => d.providerId === "google.com",
                ) ? (
                  <div className="flex items-center gap-1 pl-2 max-md:basis-full">
                    <Image
                      src="/assets/google icon.png"
                      alt="google icon"
                      width={16}
                      height={16}
                      className="shrink-0"
                    />
                    <p className={cn("overflow-x-auto p-2")}>Google Account</p>
                  </div>
                ) : (
                  <Button
                    variant="basic"
                    className={cn("overflow-x-auto p-2 max-md:basis-full")}
                    onClick={async () => {
                      const auth = getAuth(app);
                      const user = auth.currentUser;

                      if (!auth || !user?.email) return;

                      await sendPasswordResetEmail(auth, user.email)
                        .then(() => alert("Email sent!"))
                        .catch(() => alert("Error. Try again."));
                    }}
                  >
                    Send Password Reset Email
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Page;
