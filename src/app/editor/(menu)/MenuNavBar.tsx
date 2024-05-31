"use client";

import { cn } from "@/lib";
import { Button } from "@/ui";
import {
  faDownload,
  faFilter,
  faGear,
  faSearch,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function MenuNavBar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const searchParams = useSearchParams();

  return (
    <div
      className={cn(
        className,
        "box-border flex justify-between gap-1 rounded-md",
      )}
    >
      <Link
        href={`/editor/search?${searchParams}`}
        className="w-full"
        title="search"
      >
        <Button
          variant="basic"
          className="flex w-full justify-center rounded-md p-1"
          targetPath="/editor/search"
        >
          <FontAwesomeIcon icon={faSearch} className="h-4" />
        </Button>
      </Link>

      <Link
        href={`/editor/filter?${searchParams}`}
        className="w-full"
        title="filter"
      >
        <Button
          variant="basic"
          className="flex w-full justify-center rounded-md p-1"
          targetPath="/editor/filter"
        >
          <FontAwesomeIcon icon={faFilter} className="h-4" />
        </Button>
      </Link>

      <Link
        href={`/editor/autobuild?${searchParams}`}
        className="w-full"
        title="autobuild"
      >
        <Button
          variant="basic"
          className="flex w-full justify-center rounded-md p-1"
          targetPath="/editor/autobuild"
        >
          <FontAwesomeIcon icon={faStar} className="h-4" />
        </Button>
      </Link>

      <Link
        href={`/editor/saved?${searchParams}`}
        className="w-full"
        title="saved"
      >
        <Button
          variant="basic"
          className="flex w-full justify-center rounded-md p-1"
          targetPath="/editor/saved"
        >
          <FontAwesomeIcon icon={faDownload} className="h-4" />
        </Button>
      </Link>

      <Link
        href={`/editor/settings?${searchParams}`}
        className="w-full"
        title="settings"
      >
        <Button
          variant="basic"
          className="flex w-full justify-center rounded-md p-1"
          targetPath="/editor/settings"
        >
          <FontAwesomeIcon icon={faGear} className="h-4" />
        </Button>
      </Link>
    </div>
  );
}

export default MenuNavBar;
