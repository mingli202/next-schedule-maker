"use client";

import { app } from "@/backend";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoggedOut from "./LoggedOut";

const LoginStateObserver = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [loginState, setLoginState] = useState<
    "loading" | "signedout" | "signedin"
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
    <div className="h-full w-full font-body text-text">
      {loginState === "loading" && (
        <div className="flex h-full w-full items-center justify-center">
          Verifying...
        </div>
      )}
      {loginState === "signedout" && <LoggedOut />}
      {loginState === "signedin" && children}
    </div>
  );
};

export default LoginStateObserver;
