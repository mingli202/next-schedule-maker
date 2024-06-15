import { Metadata } from "next";
import LoginStateObserver from "./LoginStateObserver";
import VerticalNavbar from "./VerticalNavbar";

export const metadata: Metadata = {
  title: "User",
  description:
    "John Abbott College (JAC) Dream Schedule Builder User Dashboard. A user home page where your saved schedules are all in one place.",
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
    "Dashboard",
    "friends",
    "build",
    "chat",
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
    <LoginStateObserver>
      {children}
      <VerticalNavbar className="h-fit shrink-0 max-md:relative max-md:bottom-0 max-md:w-full md:order-first md:h-full" />
    </LoginStateObserver>
  );
}

export default Layout;
