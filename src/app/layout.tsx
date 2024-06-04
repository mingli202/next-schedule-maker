import type { Metadata } from "next";
import "./globals.css";
import { fraunces, poppins } from "./fonts";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import LoginCheck from "./LoginCheck";

export const metadata: Metadata = {
  title: "JAC Dream Schedule Builder",
  description: "Schedule Builder Home Page",
  authors: { name: "Ming Li Liu" },
  creator: "Ming Li Liu",
  generator: "Next.js",
  applicationName: "Dream Builder",
  keywords: [
    "Schedule Maker",
    "Schedule Builder",
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
  ],
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${poppins.variable} overflow-x-hidden bg-bgPrimary font-body text-sm text-text antialiased md:text-base`}
      >
        {children}
        <SpeedInsights />
        <Analytics />
        <LoginCheck />
      </body>
    </html>
  );
}

export default RootLayout;
