import ScheduleContextProvider from "./ScheduleContext";

import { Metadata } from "next";
import View from "./view";
import DragIndicator from "./DragIndicator";
import "./styles.css";
export const metadata: Metadata = {
  title: "Editor",
  description: "Schedule Builder Editor",
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
type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  return (
    <ScheduleContextProvider>
      <main className="box-border flex w-screen overflow-auto p-2 text-sm text-text max-md:flex-col md:h-screen md:overflow-hidden md:text-base">
        <div
          className="overflow-x-auto overflow-y-hidden max-md:order-2 md:h-full"
          id="menu"
        >
          {children}
        </div>
        <DragIndicator />
        <div
          className="overflow-x-auto overflow-y-hidden max-md:order-1 md:h-full"
          id="view"
        >
          <View className="h-[40rem] min-w-[40rem] md:h-full" />
        </div>
      </main>
    </ScheduleContextProvider>
  );
};

export default Layout;
