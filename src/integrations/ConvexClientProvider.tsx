import { ConvexProviderWithAuth, type ConvexReactClient } from "convex/react";
import { getAuth } from "firebase/auth";
import { type ReactNode, useCallback, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { app } from "src/integrations/firebase";

type Props = {
  children?: ReactNode;
  client: ConvexReactClient;
};

function useAuthFromFirebase() {
  const auth = getAuth(app);
  const [user, loading] = useAuthState(auth);

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      if (!user) return null;
      return await user.getIdToken(forceRefreshToken);
    },
    [user],
  );

  console.log({ user, isAuthenticated: !!user });

  return useMemo(
    () => ({
      isLoading: loading,
      isAuthenticated: !!user,
      fetchAccessToken,
    }),
    [loading, user, fetchAccessToken],
  );
}

export function ConvexClientProvider({ children, client }: Props) {
  return (
    <ConvexProviderWithAuth client={client} useAuth={useAuthFromFirebase}>
      {children}
    </ConvexProviderWithAuth>
  );
}
