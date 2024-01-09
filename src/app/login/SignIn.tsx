"use client";

import { cn } from "@/lib";
import { Dispatch, HTMLAttributes, SetStateAction, useState } from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { Button } from "@/ui";
import Image from "next/image";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { app, provider } from "@/backend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

type Props = {
  setWindow: Dispatch<SetStateAction<"signin" | "signup">>;
};

const SignIn = ({
  className,
  setWindow,
  ...props
}: HTMLAttributes<HTMLDivElement> & HTMLMotionProps<"div"> & Props) => {
  const [error, setError] = useState("");
  const [type, setType] = useState<"password" | "text">("password");

  const action = async (formData: FormData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) return;

    const auth = getAuth(app);

    await signInWithEmailAndPassword(
      auth,
      email.toString(),
      password.toString(),
    ).catch(() => setError("Invalid Email or Password"));
  };

  return (
    <motion.div
      className={cn(
        "flex w-[min(25rem,80%)] flex-col items-center gap-4 rounded-md p-4 shadow-lg shadow-primary",
        className,
      )}
      {...props}
    >
      <h2 className="font-heading text-3xl">Sign In</h2>

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
            <Link
              href="/forgot"
              className="opacity-50 transition hover:opacity-100"
            >
              Forgot?
            </Link>
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
              type={type}
              required
            />
            <Button
              variant="basic"
              type="button"
              onClick={() => {
                if (type === "password") {
                  setType("text");
                } else {
                  setType("password");
                }
              }}
            >
              {type === "password" ? (
                <FontAwesomeIcon icon={faEye} className="h-4" title="reveal" />
              ) : (
                <FontAwesomeIcon
                  icon={faEyeSlash}
                  className="h-4"
                  title="hide"
                />
              )}
            </Button>
          </div>
        </label>

        {error !== "" && <p className="text-red-400">{error}</p>}

        <div className="flex w-full justify-center">
          <Button variant="special" type="submit" className="w-full">
            Login
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
        Don{"'"}t have and account?{" "}
        <Button
          className="p-0 text-primary underline"
          onClick={() => setWindow("signup")}
        >
          Sign Up
        </Button>
      </div>
    </motion.div>
  );
};

export default SignIn;
