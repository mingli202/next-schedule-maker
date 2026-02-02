import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "./(root)/globals.css?url";

export const Router = createRootRoute({
  head: () => ({
    meta: [],
  }),
});
