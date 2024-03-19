"use client";

import { app } from "@/backend";

import { Button } from "@/ui";
import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ContextProvider from "./Context";

const LoginStateObserver = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [loginState, setLoginState] = useState<
    "loading" | "signedin" | "signedout" | "emailunverified"
  >("loading");

  useEffect(() => {
    const auth = getAuth(app);

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        return setLoginState("signedout");
      }

      if (!user.emailVerified) {
        return setLoginState("emailunverified");
      }

      setLoginState("signedin");
    });

    return () => {
      unsub();
    };
  }, [router]);

  return (
    <main className="relative flex h-screen w-screen overflow-hidden font-body text-text max-md:flex-col">
      {loginState === "signedin" && (
        <ContextProvider>{children}</ContextProvider>
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
            Send email
          </Button>
        </div>
      )}
    </main>
  );
};

export default LoginStateObserver;
