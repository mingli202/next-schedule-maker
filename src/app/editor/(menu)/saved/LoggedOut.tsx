import { Button } from "@/ui";
import {
  faFileDownload,
  faGear,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

function LoggedOut() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <p>Login to save schedules or save as Excel file</p>
        <p>
          (<FontAwesomeIcon icon={faGear} className="h-4" /> {">"}{" "}
          <FontAwesomeIcon icon={faList} className="h-4" /> {">"}{" "}
          <FontAwesomeIcon icon={faFileDownload} className="h-4" />)
        </p>
        <Link href="/login">
          <Button variant="special">Login</Button>
        </Link>
      </div>
    </div>
  );
}

export default LoggedOut;
