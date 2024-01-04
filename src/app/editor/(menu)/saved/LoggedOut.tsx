import { Button } from "@/ui";
import Link from "next/link";

const LoggedOut = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <p className="">Login to save schedules</p>
      <Link href="/login">
        <Button variant="special">Login</Button>
      </Link>
    </div>
  );
};

export default LoggedOut;
