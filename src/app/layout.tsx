import type { Metadata } from "next";
import { poppins, fraunces } from "./fonts";
import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "JAC Dream Schedule Builder",
  description:
    "John Abbott College (JAC) Dream Schedule Builder Home Page. An interactive schedule builder for John Abbott College (JAC) students. By using our advanced filtering options, you can make your dream schedule in seconds!",
  authors: { name: "Ming Li Liu" },
  creator: "Ming Li Liu",
  generator: "Next.js",
  applicationName: "Javascript",
  keywords: [
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
  ],
  robots: "robots.txt",
  manifest: "manifest.json",
  other: {
    "google-site-verification": "cSh40L1cc_UacQ_WYgMrNFYCIdZcRopjr8AWnUyDCoY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${fraunces.variable} font-body bg-bgPrimary text-text overflow-hidden antialiased`}
      >
        {children}

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
