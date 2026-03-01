import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import appCss from "./globals.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "JAC Dream Schedule Builder",
      },
      {
        name: "description",
        content:
          "John Abbott College (JAC) Dream Schedule Builder Home Page. An interactive schedule builder for John Abbott College (JAC) students. By using our advanced filtering options, you can make your dream schedule in seconds!",
      },
      {
        name: "author",
        content: "Ming Li Liu",
      },
      {
        name: "creator",
        content: "Ming Li Liu",
      },
      {
        name: "generator",
        content: "Tanstack Start",
      },
      {
        name: "applicationName",
        content: "JAC Dream Schedule Builder",
      },
      {
        name: "keywords",
        content: [
          "Schedule Maker",
          "Schedule Builder",
          "Schedule Visualiser",
          "John Abbott College",
          "JAC",
          "Dream Schedule Maker",
          "Editor",
          "Schedule Planner",
          "Next Js",
          "React",
          "Javascript",
          "JS",
          "TailwindCss",
        ].join(", "),
      },
      {
        name: "google-site-verification",
        content: "cSh40L1cc_UacQ_WYgMrNFYCIdZcRopjr8AWnUyDCoY",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
    ],
  }),

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg-primary font-body text-text h-screen w-screen overflow-x-hidden text-sm antialiased md:text-base">
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
