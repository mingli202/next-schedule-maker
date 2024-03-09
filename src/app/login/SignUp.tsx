"use client";

import { app, provider } from "@/backend";
import { cn } from "@/lib";
import { Button } from "@/ui";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithPopup,
} from "firebase/auth";
import { HTMLMotionProps, motion } from "framer-motion";
import { HTMLAttributes, useState } from "react";
import Image from "next/image";

type Props = {
  setWindow: React.Dispatch<React.SetStateAction<"signin" | "signup">>;
};

const SignUp = ({
  className,
  setWindow,
  ...props
}: HTMLAttributes<HTMLDivElement> & HTMLMotionProps<"div"> & Props) => {
  const [error, setError] = useState("");

  const action = async (formdata: FormData) => {
    const auth = getAuth(app);

    const email = formdata.get("email");
    const password = formdata.get("password");
    const passwordConfirm = formdata.get("password-confirm");

    if (!email || !password || !passwordConfirm) return;
    if (password.toString() !== passwordConfirm.toString()) {
      setError("Password must match");
      return;
    }

    await createUserWithEmailAndPassword(
      auth,
      email.toString(),
      password.toString(),
    ).catch(() => setError("An error occured. Try again."));
  };

  return (
    <motion.div
      className={cn(
        "flex w-[min(25rem,80%)] flex-col items-center gap-4 rounded-md p-4 shadow-lg shadow-primary",
        className,
      )}
      {...props}
    >
      <h2 className="font-heading text-3xl">Sign Up</h2>

      <form
        className="flex w-full flex-col gap-2 [&>label>p]:opacity-50"
        action={action}
      >
        <label className="box-border w-full" htmlFor="email">
          <p>Email</p>
          <input
            className={cn(
              "box-border w-full rounded-md border-4 border-solid border-secondary bg-bgPrimary p-2 outline-none transition placeholder:italic focus:border-primary focus:bg-bgSecondary",
              {
                "border-red-900 bg-red-950 focus:border-red-300 focus:bg-red-900":
                  error !== "",
              },
            )}
            placeholder="example@gmail.com"
            name="email"
            id="email"
            type="email"
            required
          />
        </label>

        <label className="box-border w-full" htmlFor="password">
          <div className="flex justify-between">
            <p className="opacity-50">Password</p>
          </div>
          <div className="flex gap-2">
            <input
              className={cn(
                "box-border w-full rounded-md border-4 border-solid border-secondary bg-bgPrimary p-2 outline-none transition placeholder:italic focus:border-primary focus:bg-bgSecondary",
                {
                  "border-red-900 bg-red-950 focus:border-red-300 focus:bg-red-900":
                    error !== "",
                },
              )}
              name="password"
              autoComplete="off"
              id="password"
              required
            />
          </div>
        </label>

        <label className="box-border w-full" htmlFor="password-confirm">
          <div className="flex justify-between">
            <p className="opacity-50">Confirm Password</p>
          </div>
          <div className="flex gap-2">
            <input
              className={cn(
                "box-border w-full rounded-md border-4 border-solid border-secondary bg-bgPrimary p-2 outline-none transition placeholder:italic focus:border-primary focus:bg-bgSecondary",
                {
                  "border-red-900 bg-red-950 focus:border-red-300 focus:bg-red-900":
                    error !== "",
                },
              )}
              name="password-confirm"
              autoComplete="off"
              id="password-confirm"
              required
            />
          </div>
        </label>

        {error !== "" && <p className="text-red-400">{error}</p>}

        <div className="flex w-full justify-center">
          <Button variant="special" type="submit" className="w-full">
            Sign Up
          </Button>
        </div>
      </form>

      <div className="flex w-full items-center gap-2">
        <div className="h-1 basis-full rounded-full bg-bgSecondary" />
        <p className="text-third">or</p>
        <div className="h-1 basis-full rounded-full bg-bgSecondary" />
      </div>

      <Button
        className="flex items-center gap-2 rounded-full bg-white p-2 text-black opacity-100"
        onClick={async () => {
          const auth = getAuth(app);
          await signInWithPopup(auth, provider).catch((err) =>
            console.log(err),
          );
        }}
        variant="basic"
      >
        <Image
          src="/assets/google icon.png"
          alt="google icon"
          width={20}
          height={20}
          className="shrink-0"
        />
        <p>Continue with Google</p>
      </Button>

      <div className="flex gap-2">
        Back to
        <Button
          className="p-0 text-primary underline"
          onClick={() => setWindow("signin")}
        >
          Sign In
        </Button>
      </div>
    </motion.div>
  );
};

export default SignUp;
