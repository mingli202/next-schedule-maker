"use client";

import { app, db } from "@/backend";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, update } from "firebase/database";
import { useEffect } from "react";

function LoginCheck() {
  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(app), async (user) => {
      if (!user) return;
      await update(ref(db, `/users/${user.uid}`), {
        lastSignedIn: new Date().toString() + " on Dream Builder",
      }).catch(() => alert("Error setting data."));

      await update(ref(db, `/public/users/${user.uid}`), {
        name: user.displayName ?? "User",
        email: user.email ?? "User email",
        uid: user.uid,
      }).catch(() => alert("Error setting data."));
    });
    return () => unsub();
  }, []);

  return null;
}

export default LoginCheck;
