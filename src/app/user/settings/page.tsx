"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.css";
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
    <div className={styles.card}>
      <p className={styles.display}>{display}</p>
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
        <>
          <p className={styles.value} title="edit">
            {value}
          </p>

          <Button
            title="delete"
            variant="basic"
            className="shrink-0"
            onClick={() => {
              setEditName(true);
            }}
          >
            <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
          </Button>
        </>
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
    <div className="flex h-full w-full flex-col gap-2 rounded-md bg-black/30 p-3 shadow-[rgba(156,205,220,0.24)_0px_3px_8px]">
      {user ? (
        <>
          <div>
            <h1 className="font-heading text-3xl">Profile</h1>
            <p className={styles.desc}>Manage your profile</p>
          </div>

          <div className="h-0.5 w-full rounded-full bg-third/50" />

          <div className="p-2">
            <h2 className="text-xl">Basic Info</h2>
            <p className={styles.desc}>How you will appear to other users</p>
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
              <div className={styles.card}>
                <p className={styles.display}>Uid</p>
                <p className={styles.value}>{user.uid}</p>
              </div>
              <div className={styles.card}>
                <p className={styles.display}>Email</p>
                <p className={styles.value}>{user.email}</p>
              </div>
            </div>
          </div>

          <div className="h-0.5 w-full rounded-full bg-third/50" />

          <div className="p-2">
            <h2 className="text-xl">Visibility</h2>
            <p className={styles.desc}>
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
              <div className={styles.card}>
                <p className={styles.display}>Password</p>
                {getAuth(app).currentUser?.providerData.some(
                  (d) => d.providerId === "google.com",
                ) ? (
                  <div className="flex items-center gap-1 pl-2">
                    <Image
                      src="/assets/google icon.png"
                      alt="google icon"
                      width={16}
                      height={16}
                      className="shrink-0"
                    />
                    <p className={styles.value}>Google Account</p>
                  </div>
                ) : (
                  <Button
                    variant="basic"
                    className={styles.value}
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
