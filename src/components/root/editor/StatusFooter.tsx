import { Link } from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";
import { signOut } from "firebase/auth";
import type { ComponentProps } from "react";
import { Button } from "src/components";
import { ButtonVariant } from "src/components/Button";
import { useReleaseNotes } from "src/hooks";
import { getAuth } from "src/integrations/firebase";
import { useSectionStore } from "src/lib/store/section";
import { cn } from "src/lib/utils";
import ReleaseNotes from "./ReleaseNotes";

const auth = getAuth();

const LittleButton = ({
  className,
  variant,
  ...props
}: ComponentProps<typeof Button>) => (
  <Button
    className={cn(
      className,
      "rounded-none py-1",
      variant !== ButtonVariant.Special && "hover:bg-foreground/20",
    )}
    {...props}
    variant={variant}
  />
);

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
      <div className="bg-secondary/50 flex w-full items-center text-xs">
        <div>
          {isLoading ? null : isAuthenticated ? (
            <LittleButton
              variant={ButtonVariant.Special}
              onClick={() => signOut(auth)}
            >
              Log out
            </LittleButton>
          ) : (
            <Link to="/login">
              <LittleButton variant={ButtonVariant.Special}>
                Log in
              </LittleButton>
            </Link>
          )}
        </div>
        <div className="flex-1" />
        <LittleButton onClick={open}>Release notes</LittleButton>
        <LittleButton className="flex gap-1">
          {store.semester}
          <span className="hidden md:block"> ({store.filename})</span>
        </LittleButton>
      </div>
    </>
  );
}
