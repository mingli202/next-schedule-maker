"use client";

import { app, db, provider } from "@/backend";
import { cn } from "@/lib";
import { Button } from "@/ui";
import {
  EmailAuthProvider,
  User,
  deleteUser,
  getAuth,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
} from "firebase/auth";
import { ref, remove } from "firebase/database";
import { Variants, motion } from "framer-motion";
import { useState } from "react";

type Props = {
  setShowDelete: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteModal = ({ setShowDelete }: Props) => {
  const [error, setError] = useState<string | null>(null);

  const expandVariants: Variants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
  };

  const modalVariants: Variants = {
    initial: {
      scale: 0.9,
    },
    animate: {
      scale: 1,
    },
  };

  const action = async (formData: FormData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) return;

    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) return;

    const credentials = EmailAuthProvider.credential(
      email.toString(),
      password.toString(),
    );

    const ok = await reauthenticateWithCredential(user, credentials);

    if (!ok) {
      setError("Invalid Email or Password");
      return;
    }

    await handleDeleteData(user);
  };

  const handleGoogleDelete = async () => {
    const user = getAuth(app).currentUser;

    if (!user) return;

    const ok = await reauthenticateWithPopup(user, provider);

    if (!ok) {
      setError("Please try again");
      return;
    }

    await handleDeleteData(user);
  };

  const handleDeleteData = async (user: User) => {
    await remove(ref(db, `users/${user.uid}`));
    await remove(ref(db, `public/users/${user.uid}`));

    await deleteUser(user);
  };

  return (
    <motion.div
      className="absolute left-0 top-0 z-30 flex h-full w-full items-center justify-center rounded-md bg-white/30 backdrop-blur-md backdrop-filter"
      initial="initial"
      animate="animate"
      exit="initial"
      variants={expandVariants}
      onClick={() => {
        setShowDelete(false);
      }}
    >
      <motion.div
        className={cn(
          "flex flex-col gap-2 rounded-md bg-red-950 p-4 text-red-100 shadow-xl md:w-[40rem]",
        )}
        onClick={(e) => {
          e.stopPropagation();
        }}
        variants={modalVariants}
      >
        {!getAuth(app).currentUser?.providerData.some(
          (d) => d.providerId === "google.com",
        ) ? (
          <>
            <h2 className="font-heading text-2xl md:text-3xl">
              Enter your credentials to delete.
            </h2>
            <form
              className="flex w-full flex-col gap-2 [&>label>p]:opacity-50"
              action={action}
            >
              <label className="box-border w-full" htmlFor="email">
                <p>Email</p>
                <input
                  className={cn(
                    "box-border w-full rounded-md border-4 border-solid border-red-900 bg-red-950 p-2 outline-none transition placeholder:italic focus:border-red-100 focus:bg-red-900",
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
                      "box-border w-full rounded-md border-4 border-solid border-red-900 bg-red-950 p-2 outline-none transition placeholder:italic focus:border-red-100 focus:bg-red-900",
                    )}
                    name="password"
                    autoComplete="off"
                    id="password"
                    required
                    placeholder="password"
                  />
                </div>
              </label>

              {error !== null && <p className="text-red-400">{error}</p>}

              <div className="mt-2 flex w-full justify-center">
                <Button
                  variant="basic"
                  type="submit"
                  className="w-full text-red-50"
                >
                  Delete Account
                </Button>
              </div>
            </form>{" "}
          </>
        ) : (
          <div className="flex justify-between max-md:flex-col">
            <h2 className="font-heading text-2xl md:text-3xl">
              Reauthenticate to delete
            </h2>
            <Button
              variant="basic"
              className="text-red-50 md:w-fit"
              onClick={handleGoogleDelete}
            >
              Delete Account
            </Button>
          </div>
        )}
        {error !== null && <p className="text-center text-red-50">{error}</p>}
      </motion.div>
    </motion.div>
  );
};

export default DeleteModal;
