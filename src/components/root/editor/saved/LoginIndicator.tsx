import { useConvexAuth } from "@convex-dev/react-query";
import { Link } from "@tanstack/react-router";

export function LoginIndicator() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  console.log("isAuthenticated:", isAuthenticated);
  console.log("isLoading:", isLoading);

  if (isLoading || isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full shrink-0 gap-2 rounded-sm border border-amber-600 bg-amber-900 p-1">
      <div>
        You are not logged in, you won't have access to your schedules on other
        devices.{" "}
        <Link to="/login" className="underline">
          Login
        </Link>
      </div>
    </div>
  );
}
