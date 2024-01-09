import { Metadata } from "next";
import LoginStateObserver from "./LoginStateObserver";
import VerticalNavbar from "./VerticalNavbar";

export const metadata: Metadata = {
  title: "Login",
  description: "Schedule Builder User Dashboard",
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

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <LoginStateObserver>
      <VerticalNavbar />
      {children}
    </LoginStateObserver>
  );
};

export default Layout;
