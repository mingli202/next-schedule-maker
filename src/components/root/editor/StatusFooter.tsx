import { Link } from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";
import { signOut } from "firebase/auth";
import { MessageCircle, Sparkles } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { Button } from "src/components";
import { ButtonVariant } from "src/components/Button";
import { ReleaseNotes } from "src/components/ReleaseNotes";
import { FeedbackDialog } from "src/components/root/editor/FeedbackDialog";
import { useReleaseNotes } from "src/hooks";
import { getAuth } from "src/integrations/firebase";
import { useSectionStore } from "src/lib/store/section";
import { cn } from "src/lib/utils";

const auth = getAuth();

const LittleButton = ({
  className,
  variant,
  ...props
}: ComponentProps<typeof Button>) => (
  <Button
    className={cn(
      "flex items-center gap-1",
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
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <>
      <FeedbackDialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen} />
      <ReleaseNotes shouldOpen={shouldOpen} close={close} store={store} />
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
        <LittleButton onClick={() => setIsFeedbackOpen(true)}>
          <MessageCircle className="h-3 w-3" />
          <span className="hidden md:block">Feedback</span>
        </LittleButton>
        <LittleButton onClick={open}>
          <Sparkles className="h-3 w-3" />
          <span className="hidden md:block">Release notes</span>
        </LittleButton>
        <LittleButton>
          {store.semester}
          <span className="hidden md:block"> ({store.filename})</span>
        </LittleButton>
      </div>
    </>
  );
}
