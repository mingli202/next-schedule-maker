import { useConvexAuth } from "@convex-dev/react-query";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "src/components";
import { Field, FieldGroup, FieldLabel } from "src/components/ui/field";
import { Input } from "src/components/ui/input";
import useFormState from "src/hooks/useFormState";
import { getAuth, provider } from "src/integrations/firebase";
import { cn } from "src/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      {
        title: "Login",
      },
      {
        name: "desciption",
        content:
          "John Abbott College (JAC) Dream Schedule Builder Login Page. Login into your account to access your schedules anywhere anytime.",
      },
    ],
  }),
  component: RouteComponent,
});

const auth = getAuth();

function RouteComponent() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  const [isSignup, setIsSignup] = useState(false);
  const [type, setType] = useState<"password" | "text">("text");

  const [error, handleSubmit, isPending] = useFormState(async (e) => {
    const formData = new FormData(e.target);

    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return "Fields must not be empty";
    }

    if (isSignup) {
      const confirmPassword = formData.get("confirm-password")?.toString();

      if (!confirmPassword) {
        return "Fields must not be empty";
      }

      if (confirmPassword !== password) {
        return "Passwords must match";
      }
    }

    const user = isSignup
      ? await createUserWithEmailAndPassword(auth, email, password).catch(
          () => null,
        )
      : await signInWithEmailAndPassword(auth, email, password).catch(
          () => null,
        );

    if (!user) {
      return "Looks like something went wrong";
    }
  });

  return isLoading ? null : isAuthenticated ? (
    <Navigate to="/editor" search={{ sections: [] }} />
  ) : (
    <div className="flex h-full w-full items-center justify-center">
      <motion.div
        layout
        transition={{ duration: 0.25, ease: "easeOut" }}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        className={cn(
          "flex w-[min(20rem,80%)] flex-col items-center gap-2 rounded-md p-2 shadow-lg max-md:text-sm md:w-[min(25rem,80%)] md:gap-6 md:p-4",
        )}
      >
        <h2 className="font-heading text-xl md:text-3xl">
          {isSignup ? "Sign up" : "Sign in"}
        </h2>

        <form className="w-full" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                placeholder="example@gmail.com"
                name="email"
                id="email"
                type="email"
                required
                className="bg-card"
                aria-invalid={!!error}
              />
            </Field>

            <Field>
              <div className="flex w-full justify-between">
                <FieldLabel htmlFor="password">Password</FieldLabel>

                {isSignup ? null : (
                  <Link
                    to="/forgot"
                    className="text-sm opacity-50 transition hover:opacity-100"
                  >
                    Forgot?
                  </Link>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  name="password"
                  autoComplete="off"
                  id="password"
                  type={type}
                  required
                  aria-invalid={!!error}
                />
                {isSignup ? null : (
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
                      <Eye className="h-4" />
                    ) : (
                      <EyeOff className="h-4" />
                    )}
                  </Button>
                )}
              </div>
            </Field>

            <motion.div
              initial={false}
              animate={{
                opacity: isSignup ? 1 : 0,
                height: isSignup ? "auto" : 0,
                y: isSignup ? "0%" : "-50%",
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden"
              aria-hidden={!isSignup}
            >
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input
                  name="confirm-password"
                  autoComplete="off"
                  id="confirm-password"
                  type={type}
                  required={isSignup}
                  disabled={!isSignup}
                  aria-invalid={!!error}
                  tabIndex={isSignup ? 0 : -1}
                />
              </Field>
            </motion.div>

            {!!error && <p className="text-red-400">{error}</p>}

            <Button variant="special" type="submit" className="w-full">
              {isSignup ? "Sign up" : "Sign in"}
            </Button>
          </FieldGroup>
        </form>

        <div className="flex w-full items-center gap-2">
          <div className="bg-secondary h-1 basis-full rounded-full" />
          <p className="text-third shrink-0">or</p>
          <div className="bg-secondary h-1 basis-full rounded-full" />
        </div>

        <Button
          className="flex items-center gap-2 rounded-full bg-white p-2 text-black opacity-100"
          onClick={async () => {
            await signInWithPopup(auth, provider);
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

        {isSignup ? (
          <motion.div
            className="flex gap-2"
            initial={{
              opacity: 0,
              y: "-50%",
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            key="signin-text"
          >
            Already have an account?{" "}
            <Button
              className="text-primary p-0 hover:underline"
              onClick={() => setIsSignup(false)}
              isPending={isPending}
            >
              Sign In
            </Button>
          </motion.div>
        ) : (
          <motion.div
            className="flex gap-2"
            initial={{
              opacity: 0,
              y: "-50%",
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            key="signup-text"
          >
            Don{"'"}t have an account?{" "}
            <Button
              className="text-primary p-0 hover:underline"
              onClick={() => setIsSignup(true)}
              isPending={isPending}
            >
              Sign Up
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
