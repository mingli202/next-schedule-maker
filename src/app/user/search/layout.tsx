import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Users",
  description: "Schedule Builder Search Users",
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
    "Users",
    "Search Users",
    "Followings",
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
    <div className="relative flex h-full basis-full flex-col gap-4 overflow-hidden p-2">
      {children}
    </div>
  );
};

export default Layout;
