import { Metadata } from "next";
import RightNavbar from "./RightNavbar";

export const metadata: Metadata = {
  title: "Settings",
  description: "Schedule Builder User Settings ",
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
    "User Preferences",
    "Settings",
    "Customiztion",
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

const Layout = ({ children }: Props) => {
  return (
    <div className="flex h-full w-full justify-center p-2">
      <div className="flex w-[min(80%,70rem)] gap-2">
        {children}
        <RightNavbar className="w-40 shrink-0" />
      </div>
    </div>
  );
};

export default Layout;
