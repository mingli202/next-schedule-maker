import type { Metadata } from "next";
import "./globals.css";
import { fraunces, poppins } from "./fonts";
import { SpeedInsights } from "@vercel/speed-insights/next";

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

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${poppins.variable} bg-bgPrimary font-body text-text antialiased`}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;
