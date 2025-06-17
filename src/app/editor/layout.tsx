import ScheduleContextProvider from "./ScheduleContext";

import DragIndicator from "./DragIndicator";
import "./styles.css";
import ViewWrapper from "./ViewWrapper";
import { getRemoteJson } from "@/lib";
import { Class } from "@/types";

import { Metadata } from "next";
import ReleaseNotes from "./ReleaseNotes";
// import ReleaseNotes from "./ReleaseNotes";
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
  children: React.ReactNode;
};

async function Layout({ children }: Props) {
  const allClasses: Record<string, Class> = await getRemoteJson("allClasses");

  return (
    <ScheduleContextProvider>
      <main className="box-border flex w-screen gap-2 overflow-y-auto overflow-x-hidden p-2 text-sm text-text max-md:flex-col md:h-screen md:overflow-hidden md:text-base">
        <div
          className="overflow-x-hidden overflow-y-hidden max-md:order-2 md:h-full md:overflow-x-auto"
          id="menu"
        >
          {children}
        </div>
        <DragIndicator />
        <div
          className="overflow-hidden max-md:order-1 md:h-full md:overflow-x-auto md:overflow-y-hidden"
          id="view"
        >
          <ViewWrapper allClasses={allClasses} />
        </div>
      </main>
      <ReleaseNotes />
    </ScheduleContextProvider>
  );
}

export default Layout;
