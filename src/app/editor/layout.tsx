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
  menu: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <ScheduleContextProvider>
      <main className="box-border flex h-screen w-screen overflow-hidden p-2 text-text">
        <div className="h-full overflow-x-auto overflow-y-hidden" id="menu">
          {children}
        </div>
        <DragIndicator />
        <div className="h-full overflow-x-auto overflow-y-hidden" id="view">
          <View className="h-full min-w-[40rem]" />
        </div>
      </main>
    </ScheduleContextProvider>
  );
};

export default Layout;
