"use client";

import { app } from "@/backend";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function LoginStateObserver({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [loginState, setLoginState] = useState<
    "loading" | "signedout" | "signedin"
  >("loading");

  useEffect(() => {
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoginState("signedin");
        router.push("/user");
      } else {
        setLoginState("signedout");
      }
    });

    return () => unsub();
  }, [router]);

  return (
    <main className="font-body text-text">
      {loginState === "loading" && (
        <div className="flex h-screen w-screen items-center justify-center">
          Verifying...
        </div>
      )}
      {loginState === "signedout" && children}
    </main>
  );
}

export default LoginStateObserver;
