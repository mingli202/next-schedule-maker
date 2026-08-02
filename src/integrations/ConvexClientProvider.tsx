import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { ConvexProviderWithAuth, type ConvexReactClient } from "convex/react";
import { getAuth } from "firebase/auth";
import { type ReactNode, useCallback, useEffect, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { app } from "src/integrations/firebase";

type Props = {
  children?: ReactNode;
  client: ConvexReactClient;
};

const auth = getAuth(app);

export function useAuthFromFirebase() {
  const [user, loading] = useAuthState(auth);

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      if (!user) return null;
      return await user.getIdToken(forceRefreshToken);
    },
    [user],
  );

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
      <CreateUserOnLoad>{children}</CreateUserOnLoad>
    </ConvexProviderWithAuth>
  );
}

function CreateUserOnLoad({ children }: { children: ReactNode }) {
  const [user] = useAuthState(auth);

  const { mutateAsync: createUser } = useMutation({
    mutationFn: useConvexMutation(api.user.mutations.createUser),
  });

  useEffect(() => {
    if (user) {
      createUser({});
    }
  }, [user, createUser]);

  return children;
}
