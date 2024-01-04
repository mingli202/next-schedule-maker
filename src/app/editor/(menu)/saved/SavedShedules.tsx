"use client";

import { app } from "@/backend";
import { Saved } from "@/types";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { useEffect, useState } from "react";
import LoggedOut from "./LoggedOut";

// type Props = {
//   allClasses: Record<string, Class>;
// };

const SavedSchedules = () => {
  const [savedSchedules, setSavedSchedules] = useState<Saved[] | null>([]);

  useEffect(() => {
    const obsever = onAuthStateChanged(getAuth(app), (user) => {
      if (!user) setSavedSchedules(null);
    });

    const local = localStorage.getItem("dream-builder");
    if (!local) {
      localStorage.setItem("dream-builder", JSON.stringify([]));
    } else {
      setSavedSchedules(JSON.parse(local));
    }

    return () => {
      obsever();
    };
  }, []);

  return (
    <>
      {savedSchedules ? (
        <div className="flex w-full flex-wrap">
          {savedSchedules.map((sch) => {
            return <p key={sch.id}>asdf</p>;
          })}
        </div>
      ) : (
        <LoggedOut />
      )}
    </>
  );
};

export default SavedSchedules;
