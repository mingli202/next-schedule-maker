import { Metadata } from "next";
import LoginStateObserver from "./LoginStateObserver";
import VerticalNavbar from "./VerticalNavbar";
import SavedPreview from "./SavedPreview";
import FriendsPreview from "./FriendsPreview";
import { getLocalJsonData } from "@/lib";

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

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  const colors: string[] = await getLocalJsonData("colors");

  return (
    <LoginStateObserver>
      <VerticalNavbar />
      <div className="flex w-full flex-col gap-4 p-4">
        {children}
        <div className="flex w-full gap-4">
          <SavedPreview colors={colors} />
          <FriendsPreview />
        </div>
      </div>
    </LoginStateObserver>
  );
};

export default Layout;
