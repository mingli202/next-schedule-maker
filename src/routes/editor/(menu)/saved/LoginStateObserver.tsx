"use client";

import { app } from "@/backend";
import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/Button";

function LoginStateObserver({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [loginState, setLoginState] = useState<
    "loading" | "signedout" | "signedin" | "emailunverified"
  >("loading");

  useEffect(() => {
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoginState("signedout");
        return;
      }

      if (!user.emailVerified) {
        setLoginState("emailunverified");
        return;
      }

      setLoginState("signedin");
    });

    return () => unsub();
  }, [router]);

  return (
    <div className="font-body text-text h-full w-full">
      {loginState === "loading" && (
        <div className="flex h-full w-full items-center justify-center">
          Verifying...
        </div>
      )}
      {loginState === "emailunverified" && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
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
      {loginState === "signedout" && children}
      {loginState === "signedin" && children}
    </div>
  );
}

export default LoginStateObserver;
