import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  robots: "robots.txt",
  manifest: "manifest.json",
  title: "Editor",
  description:
    "John Abbott College (JAC) Dream Schedule Builder Editor. A visual interface to add and generate schedules that fits your needs.",
  authors: { name: "Ming Li Liu" },
  creator: "Ming Li Liu",
  generator: "Next.js",
  applicationName: "Javascript",
  keywords: [
    "Schedule Maker",
    "Schedule Builder",
    "John Abbott College",
    "JAC",
    "Dream Schedule Maker",
    "Editor",
    "Visualizer",
    "Schedule Planner",
    "Next Js",
    "React",
    "Javascript",
    "JS",
    "TailwindCss",
  ],
};

type Props = {
  children: ReactNode;
};
export default function Layout({ children }: Props) {
  return <>{children}</>;
}
