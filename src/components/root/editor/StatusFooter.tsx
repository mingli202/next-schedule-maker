import { Link } from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";
import { signOut } from "firebase/auth";
import { Button } from "src/components";
import { ButtonVariant } from "src/components/Button";
import { useReleaseNotes } from "src/hooks";
import { getAuth } from "src/integrations/firebase";
import { useSectionStore } from "src/lib/store/section";
import ReleaseNotes from "./ReleaseNotes";

const auth = getAuth();

export function StatusFooter() {
  const store = useSectionStore();
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { shouldOpen, open, close } = useReleaseNotes();

  return (
    <>
      <ReleaseNotes
        shouldOpen={shouldOpen}
        close={close}
        semester={store.semester}
      />
      <div className="bg-secondary/50 flex items-center justify-between text-xs">
        <div>
          {isLoading ? null : isAuthenticated ? (
            <Button
              className="rounded-none py-1"
              variant={ButtonVariant.Special}
              onClick={() => signOut(auth)}
            >
              Log out
            </Button>
          ) : (
            <Link to="/login">
              <Button
                className="rounded-none py-1"
                variant={ButtonVariant.Special}
              >
                Log in
              </Button>
            </Link>
          )}
        </div>
        <p className="flex gap-1">
          {store.semester}
          <span className="hidden md:block"> ({store.filename})</span>
        </p>
      </div>
    </>
  );
}
