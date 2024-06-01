"use client";

import { cn } from "@/lib";
import { Button } from "@/ui";
import {
  faFolder,
  faGear,
  faHammer,
  faHome,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement>;

function VerticalNavbar({ className, ...props }: Props) {
  return (
    <div
      className={cn("z-10 box-border bg-bgPrimary p-1 md:p-2", className)}
      {...props}
    >
      <div className="box-border flex h-full items-center gap-2 rounded-md bg-bgSecondary p-1 max-md:justify-between md:flex-col md:p-2">
        <Link href="/user" className="shrink-0" title="dashboard">
          <Button
            className="p-1 max-md:flex max-md:items-center md:p-2"
            variant="basic"
            targetPath="/user"
          >
            <FontAwesomeIcon icon={faHome} className="h-6 w-6 md:h-8 md:w-8" />
          </Button>
        </Link>

        <Link href="/editor" className="shrink-0" title="build">
          <Button
            variant="basic"
            className="p-1 max-md:flex max-md:items-center md:p-2"
            targetPath="/editor"
          >
            <FontAwesomeIcon
              icon={faHammer}
              className="h-6 w-6 md:h-8 md:w-8"
            />
          </Button>
        </Link>

        <Link href="/user/saved" className="shrink-0" title="saved schedules">
          <Button
            variant="basic"
            className="p-1 max-md:flex max-md:items-center md:p-2"
            targetPath="/user/saved"
          >
            <FontAwesomeIcon
              icon={faFolder}
              className="h-6 w-6 md:h-8 md:w-8"
            />
          </Button>
        </Link>

        <Link href="/user/search" className="shrink-0" title="friends">
          <Button
            variant="basic"
            className="p-1 max-md:flex max-md:items-center md:p-2"
            targetPath="/user/search"
          >
            <FontAwesomeIcon
              icon={faSearch}
              className="h-6 w-6 md:h-8 md:w-8"
            />
          </Button>
        </Link>

        <div className="hidden md:w-full md:basis-full" />

        <Link
          href="/user/settings/profile"
          className="shrink-0"
          title="settings"
        >
          <Button
            variant="basic"
            className="p-1 max-md:flex max-md:items-center md:p-2"
            targetPath="/user/settings/profile"
          >
            <FontAwesomeIcon icon={faGear} className="h-6 w-6 md:h-8 md:w-8" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default VerticalNavbar;
