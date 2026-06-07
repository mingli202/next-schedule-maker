import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient } from "@tanstack/react-query";
import { createRouter, ErrorComponent } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { NotFound } from "./components/root";
import { TooltipProvider } from "./components/ui/tooltip";
import { ConvexClientProvider } from "./integrations/ConvexClientProvider";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
  const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;

  if (!CONVEX_URL) {
    throw new Error("Missing convex url!");
  }

  const convexQueryClient = new ConvexQueryClient(CONVEX_URL);

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  });

  convexQueryClient.connect(queryClient);

  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: "intent",

    scrollRestoration: true,
    defaultPreloadStaleTime: 0,

    defaultNotFoundComponent: () => <NotFound />,
    defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
    defaultStructuralSharing: true,

    Wrap: ({ children }) => (
      <ConvexClientProvider client={convexQueryClient.convexClient}>
        <TooltipProvider>{children}</TooltipProvider>
      </ConvexClientProvider>
    ),
  });
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
