"use client";

import { useState } from "react";
import { cn } from "@/lib";
import { Button } from "@/ui";
import Link from "next/link";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from "@/backend";
import { useRouter } from "next/navigation";

const ForgotPage = () => {
  const [error, setError] = useState("");
  const router = useRouter();

  const action = async (formdata: FormData) => {
    const email = formdata.get("email");
    if (!email) return;

    const auth = getAuth(app);
    try {
      await sendPasswordResetEmail(auth, email.toString());
    } catch {
      setError("An error occured. Try again.");
      return;
    }

    alert("Email sent!");
    router.push("/login");
  };

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <form className="flex w-[min(25rem,80%)] flex-col gap-2" action={action}>
        <label htmlFor="email">Send password reset email to:</label>
        <input
          id="email"
          name="email"
          className={cn(
            "box-border w-full rounded-md border-4 border-solid border-secondary bg-bgPrimary p-2 outline-none transition placeholder:italic focus:border-primary focus:bg-bgSecondary",
            {
              "border-red-900 bg-red-950 focus:border-red-300 focus:bg-red-900":
                error !== "",
            },
          )}
          type="email"
          required
          placeholder="example@gmail.com"
        />

        {error !== "" && <p className="text-red-400">{error}</p>}

        <Button variant="special" type="submit" className="mt-2">
          Send
        </Button>
      </form>

      <Link href="/login" className="hover:underline">
        Back to sign in
      </Link>
    </main>
  );
};

export default ForgotPage;
