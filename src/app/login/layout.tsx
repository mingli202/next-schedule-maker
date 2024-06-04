import { Metadata } from "next";
import LoginStateObserver from "./LoginStateObserver";

export const metadata: Metadata = {
  title: "Login",
  description: "Schedule Builder Login Page",
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
    "login",
    "account creation",
    "sign up",
    "scheulde persistance",
    "google login",
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
  return <LoginStateObserver>{children}</LoginStateObserver>;
}

export default Layout;
