import { Metadata } from "next";
import RightNavbar from "./RightNavbar";

export const metadata: Metadata = {
  robots: "robots.txt",
  manifest: "manifest.json",
  title: "Settings",
  description:
    "John Abbott College (JAC) Dream Schedule Builder User Settings.",
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

function Layout({ children }: Props) {
  return (
    <div className="flex basis-full overflow-hidden p-2 max-md:flex-col md:h-full md:justify-center">
      <div className="flex h-full w-full gap-2 max-md:flex-col md:w-[min(80%,70rem)]">
        <RightNavbar className="w-full shrink-0 md:order-last md:w-40" />
        <div className="h-full w-full basis-full overflow-auto rounded-md bg-black/30 shadow-[rgba(156,205,220,0.24)_0px_3px_8px]">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
