"use client";

import { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components";
import { useRouter } from "next/navigation";

function Login() {
  const [window, setWindow] = useState<"signin" | "signup">("signin");
  const router = useRouter();

  const variants: Variants = {
    initial: {
      x: "-50%",
      opacity: 0,
    },
    animate: {
      x: "0%",
      opacity: 1,
    },
    exit: {
      x: "50%",
      opacity: 0,
    },
  };

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center">
      <AnimatePresence>
        {window === "signin" && (
          <SignIn
            setWindow={setWindow}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            key="signin"
            className="absolute"
          />
        )}
        {window === "signup" && (
          <SignUp
            setWindow={setWindow}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            key="signup"
            className="absolute"
          />
        )}
      </AnimatePresence>
      <Button
        onClick={() => {
          router.push("/editor");
        }}
        className="absolute bottom-0"
        variant="basic"
      >
        Try without an account
      </Button>
    </div>
  );
}

export default Login;
