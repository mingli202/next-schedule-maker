import { useConvexAuth } from "@convex-dev/react-query";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useLocalStorage } from "src/hooks";
import { LocalStorageKey } from "src/lib/storageKeys";

export function LoginIndicator() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  const [dimiss, setDismiss] = useLocalStorage(
    false,
    LocalStorageKey.DISMISS_LOGGEDOUT_NOTICE,
  );

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    setDismiss(false);
    return null;
  }

  if (dimiss) {
    return null;
  }

  return (
    <div className="w-full shrink-0 rounded-sm border border-amber-600 bg-amber-900 p-1">
      <div>
        You are not logged in, you won't have access to your schedules on other
        devices.{" "}
        <Link to="/login" className="underline">
          Login
        </Link>
      </div>
      <button
        type="button"
        className="flex items-center gap-1 text-left hover:cursor-pointer hover:underline"
        onClick={() => setDismiss(true)}
      >
        <X className="h-4 w-4" />
        don't show again
      </button>
    </div>
  );
}
