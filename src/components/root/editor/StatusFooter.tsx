import { Link } from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";
import { signOut } from "firebase/auth";
import { ButtonVariant } from "src/components/Button";
import { LittleButton } from "src/components/LittleButton";
import { ReleaseNotes } from "src/components/ReleaseNotes";
import { FeedbackDialog } from "src/components/root/editor/FeedbackDialog";
import { getAuth } from "src/integrations/firebase";
import { useSectionStore } from "src/lib/store/section";
import { PdfManagerPopup } from "./PdfManagerPopup";

const auth = getAuth();

export function StatusFooter() {
  const store = useSectionStore();
  const { isLoading, isAuthenticated } = useConvexAuth();

  return (
    <div className="bg-secondary/50 flex w-full items-center">
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
            <LittleButton variant={ButtonVariant.Special}>Log in</LittleButton>
          </Link>
        )}
      </div>
      <div className="flex-1" />
      <FeedbackDialog />
      <ReleaseNotes store={store} />
      <PdfManagerPopup store={store} />
    </div>
  );
}
