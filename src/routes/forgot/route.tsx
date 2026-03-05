import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Button } from "src/components";
import { Field, FieldLabel } from "src/components/ui/field";
import { Input } from "src/components/ui/input";
import { getAuth } from "src/integrations/firebase";

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
      <form className="flex w-[min(25rem,80%)]" action={action}>
        <Field className="gap-4">
          <FieldLabel htmlFor="email">Send password reset email to:</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="example@gmail.com"
            aria-invalid={!!error}
          />

          {!!error && <p className="text-red-400">{error}</p>}

          <Button variant="special" type="submit">
            Send
          </Button>
        </Field>
      </form>

      <Link to="/login" className="hover:underline">
        Back to sign in
      </Link>
    </div>
  );
}
