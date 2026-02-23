import { createRouter, ErrorComponent } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {},

    scrollRestoration: true,
    defaultPreloadStaleTime: 0,

    defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  });

  return router;
};
