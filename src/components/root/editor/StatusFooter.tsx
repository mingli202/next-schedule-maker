import { Link } from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";
import { signOut } from "firebase/auth";
import { useCallback } from "react";
import { Button } from "src/components";
import { ButtonVariant } from "src/components/Button";
import { getAuth } from "src/integrations/firebase";
import { useSectionStore } from "src/lib/store/section";

const auth = getAuth();

export function StatusFooter() {
  const store = useSectionStore();
  const { isLoading, isAuthenticated } = useConvexAuth();

  const logOut = useCallback(async () => {
    await signOut(auth);
  }, []);

  return (
    <div className="bg-secondary/50 flex items-center justify-between text-xs">
      <div>
        {isLoading ? null : isAuthenticated ? (
          <Button
            className="rounded-none py-1"
            variant={ButtonVariant.Special}
            onClick={logOut}
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
  );
}
