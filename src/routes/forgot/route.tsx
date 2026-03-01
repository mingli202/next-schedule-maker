import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Button } from "src/components";
import { getAuth } from "src/integrations/firebase";
import { cn } from "src/lib";

export const Route = createFileRoute("/forgot")({
  component: RouteComponent,
});

const auth = getAuth();

function RouteComponent() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function action(formdata: FormData) {
    const email = formdata.get("email");
    if (!email) return;

    try {
      await sendPasswordResetEmail(auth, email.toString());
    } catch {
      setError("An error occured. Try again.");
      return;
    }

    alert("Email sent!");
    navigate({ to: "/login" });
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <form className="flex w-[min(25rem,80%)] flex-col gap-4" action={action}>
        <label htmlFor="email">Send password reset email to:</label>
        <input
          id="email"
          name="email"
          className={cn(
            "border-secondary bg-background focus:border-primary focus:bg-bg-secondary box-border w-full rounded-md border-4 border-solid p-2 transition outline-none placeholder:italic",
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

        <Button variant="special" type="submit">
          Send
        </Button>
      </form>

      <Link to="/login" className="hover:underline">
        Back to sign in
      </Link>
    </div>
  );
}
