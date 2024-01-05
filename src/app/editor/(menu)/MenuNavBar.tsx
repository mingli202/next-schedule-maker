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
import { usePathname, useSearchParams } from "next/navigation";

const MenuNavBar = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const path = usePathname();

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
        className={cn(
          "w-full",
          { "opacity-50": path !== "/editor/search" },
          "transition hover:opacity-100",
        )}
        title="search"
      >
        <Button
          variant="basic"
          className="flex w-full justify-center rounded-md p-1 opacity-100"
        >
          <FontAwesomeIcon icon={faSearch} className="h-4" />
        </Button>
      </Link>

      <Link
        href={`/editor/autobuild?${searchParams}`}
        className={cn(
          "w-full",
          { "opacity-50": path !== "/editor/autobuild" },
          "transition hover:opacity-100",
        )}
        title="autobuild"
      >
        <Button
          variant="basic"
          className="flex w-full justify-center rounded-md p-1 opacity-100"
        >
          <FontAwesomeIcon icon={faStar} className="h-4" />
        </Button>
      </Link>

      <Link
        href={`/editor/filter?${searchParams}`}
        className={cn(
          "w-full",
          { "opacity-50": path !== "/editor/filter" },
          "transition hover:opacity-100",
        )}
        title="filter"
      >
        <Button
          variant="basic"
          className="flex w-full justify-center rounded-md p-1 opacity-100"
        >
          <FontAwesomeIcon icon={faFilter} className="h-4" />
        </Button>
      </Link>

      <Link
        href={`/editor/saved?${searchParams}`}
        className={cn(
          "w-full",
          { "opacity-50": path !== "/editor/saved" },
          "transition hover:opacity-100",
        )}
        title="saved"
      >
        <Button
          variant="basic"
          className="flex w-full justify-center rounded-md p-1 opacity-100"
        >
          <FontAwesomeIcon icon={faDownload} className="h-4" />
        </Button>
      </Link>

      <Link
        href={`/editor/settings?${searchParams}`}
        className={cn(
          "w-full",
          { "opacity-50": path !== "/editor/settings" },
          "transition hover:opacity-100",
        )}
        title="settings"
      >
        <Button
          variant="basic"
          className="flex w-full justify-center rounded-md p-1 opacity-100"
        >
          <FontAwesomeIcon icon={faGear} className="h-4" />
        </Button>
      </Link>
    </div>
  );
};

export default MenuNavBar;
