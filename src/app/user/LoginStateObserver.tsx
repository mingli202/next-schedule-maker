"use client";

import { app, db } from "@/backend";
import { Saved } from "@/types";
import { Button } from "@/ui";
import {
  Unsubscribe,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { onValue, ref } from "firebase/database";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export const SchedulesContext = createContext<Saved[] | null>(null);
export const FriendsContext = createContext<string[] | null>(null);

const LoginStateObserver = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [savedSchedules, setSavedSchedules] = useState<Saved[] | null>(null);
  const [friends, setFriends] = useState<string[] | null>(null);

  const [loginState, setLoginState] = useState<
    "loading" | "signedin" | "signedout" | "emailunverified"
  >("loading");

  useEffect(() => {
    const auth = getAuth(app);
    let detach1: Unsubscribe;
    let detach2: Unsubscribe;

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!user.emailVerified) {
          setLoginState("emailunverified");
          return;
        }

        detach1 = onValue(
          ref(db, `/users/${user.uid}/schedules`),
          (snapshot) => {
            setSavedSchedules(snapshot.val());
          },
        );

        detach2 = onValue(ref(db, `/users/${user.uid}/friends`), (snapshot) =>
          setFriends(snapshot.val()),
        );

        setLoginState("signedin");
      } else {
        setLoginState("signedout");
      }
    });

    return () => {
      unsub();

      if (!detach1 || !detach2) return;
      detach1();
      detach2();
    };
  }, [router]);

  return (
    <main className="flex w-screen overflow-y-auto overflow-x-hidden font-body text-text">
      {loginState === "signedin" && (
        <SchedulesContext.Provider value={savedSchedules}>
          <FriendsContext.Provider value={friends}>
            {children}
          </FriendsContext.Provider>
        </SchedulesContext.Provider>
      )}
      {loginState === "loading" && (
        <div className="flex h-screen w-screen items-center justify-center">
          Verifying...
        </div>
      )}
      {loginState === "signedout" && (
        <div className="flex h-screen w-screen flex-col items-center justify-center gap-2">
          <h1 className="font-heading text-3xl">You are signed out</h1>
          <Link href="/login">
            <Button variant="special">Go to login page</Button>
          </Link>
        </div>
      )}
      {loginState === "emailunverified" && (
        <div className="flex h-screen w-screen flex-col items-center justify-center gap-2">
          <h1 className="font-heading text-3xl">Email Verification</h1>
          <p className="text-center">
            Your email has not been verified. Click to send verification email
            and check your inbox.
          </p>
          <Button
            onClick={async () => {
              const auth = getAuth(app);
              const user = auth.currentUser;

              if (!user) return;

              await sendEmailVerification(user);
              await signOut(auth);
            }}
            variant="special"
          >
            Verify email
          </Button>
        </div>
      )}
    </main>
  );
};

export default LoginStateObserver;
