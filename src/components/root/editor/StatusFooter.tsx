import { useConvexAuth } from "convex/react";
import { Button } from "src/components";
import { ButtonVariant } from "src/components/Button";
import { useSectionStore } from "src/lib/store/section";

export function StatusFooter() {
  const store = useSectionStore();
  const { isLoading, isAuthenticated } = useConvexAuth();

  return (
    <div className="bg-secondary/50 flex items-center justify-between text-xs">
      <div>
        {isLoading ? null : isAuthenticated ? (
          <Button className="rounded-none py-1" variant={ButtonVariant.Special}>
            Account
          </Button>
        ) : (
          <Button className="rounded-none py-1" variant={ButtonVariant.Special}>
            Log in
          </Button>
        )}
      </div>
      <p className="flex gap-1">
        {store.semester}
        <span className="hidden md:block"> ({store.filename})</span>
      </p>
    </div>
  );
}
