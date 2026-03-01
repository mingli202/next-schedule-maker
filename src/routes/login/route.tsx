import { useConvexAuth } from "@convex-dev/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "src/components";
import useFormState from "src/hooks/useFormState";
import { getAuth, provider } from "src/integrations/firebase";
import { cn } from "src/lib";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
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

    const auth = getAuth();

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

  if (isAuthenticated) {
    navigate({ to: "/editor", search: { sections: [] } });
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className={cn(
          "flex w-[min(20rem,80%)] flex-col items-center gap-2 rounded-md p-2 shadow-lg max-md:text-sm md:w-[min(25rem,80%)] md:gap-4 md:p-4",
        )}
      >
        <h2 className="font-heading text-xl md:text-3xl">
          {isSignup ? "Sign up" : "Sign in"}
        </h2>

        <form
          className="flex w-full flex-col gap-2 [&>label>p]:opacity-50"
          onSubmit={handleSubmit}
        >
          <label className="box-border w-full" htmlFor="email">
            <p>Email</p>
            <input
              className={cn(
                "border-secondary bg-bg-primary focus:border-primary focus:bg-bg-secondary box-border w-full rounded-md border-4 border-solid p-2 transition outline-none placeholder:italic",
                {
                  "border-red-900 bg-red-950 focus:border-red-300 focus:bg-red-900":
                    !!error,
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
              {isSignup ? null : (
                <Link
                  to="/forgot"
                  className="opacity-50 transition hover:opacity-100"
                >
                  Forgot?
                </Link>
              )}
            </div>
            <div className="flex gap-2">
              <input
                className={cn(
                  "focus:border-primary focus:bg-bg-secondary bg-bg-primary border-secondary box-border w-full rounded-md border-4 border-solid p-2 transition outline-none placeholder:italic",
                  {
                    "border-red-900 bg-red-950 focus:border-red-300 focus:bg-red-900":
                      !!error,
                  },
                )}
                name="password"
                autoComplete="off"
                id="password"
                type={type}
                required
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
          </label>

          {isSignup ? (
            <motion.label
              className="box-border w-full"
              htmlFor="confirm-password"
              initial={{
                opacity: 0,
                y: "-50%",
              }}
              animate={{
                opacity: 1,
                y: "0%",
              }}
            >
              <div className="flex justify-between">
                <p className="opacity-50">Confirm Password</p>
              </div>
              <div className="flex gap-2">
                <input
                  className={cn(
                    "border-secondary bg-bg-primary focus:border-primary focus:bg-bg-secondary box-border w-full rounded-md border-4 border-solid p-2 transition outline-none placeholder:italic",
                    {
                      "border-red-900 bg-red-950 focus:border-red-300 focus:bg-red-900":
                        !!error,
                    },
                  )}
                  name="confirm-password"
                  autoComplete="off"
                  id="confirm-password"
                  type={type}
                  required
                />
              </div>
            </motion.label>
          ) : null}

          {error !== "" && <p className="text-red-400">{error}</p>}

          <div className="flex w-full justify-center">
            <Button variant="special" type="submit" className="w-full">
              {isSignup ? "Sign up" : "Sign in"}
            </Button>
          </div>
        </form>

        <div className="flex w-full items-center gap-2">
          <div className="bg-bg-secondary h-1 basis-full rounded-full" />
          <p className="text-third">or</p>
          <div className="bg-bg-secondary h-1 basis-full rounded-full" />
        </div>

        <Button
          className="flex items-center gap-2 rounded-full bg-white p-2 text-black opacity-100"
          onClick={async () => {
            await signInWithPopup(getAuth(), provider);
          }}
          variant="basic"
        >
          <img
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
            Don{"'"}t have and account?{" "}
            <Button
              className="text-primary p-0 hover:underline"
              onClick={() => setIsSignup(true)}
              isPending={isPending}
            >
              Sign Up
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
