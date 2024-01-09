"use client";

import { app } from "@/backend";
import { Button } from "@/ui";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginStateObserver = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [loginState, setLoginState] = useState<
    "loading" | "signedin" | "signedout"
  >("loading");

  useEffect(() => {
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoginState("signedin");
      } else {
        setLoginState("signedout");
      }
    });

    return () => unsub();
  }, [router]);

  return (
    <main className="flex w-screen overflow-y-auto overflow-x-hidden font-body text-text">
      {loginState === "signedin" && children}
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
    </main>
  );
};

export default LoginStateObserver;
