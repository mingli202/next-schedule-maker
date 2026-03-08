import { Link, useLocation } from "@tanstack/react-router";
import { Filter, Folder, Search, Settings, Star } from "lucide-react";
import { cn } from "src/lib/utils";
import Button from "@/components/Button";

const searchFn = (prev: {
  previewSectionId?: number | undefined;
  sections?: { sectionId: number; colorIndex: number }[] | undefined;
}) => ({
  ...prev,
  sections: prev.sections ?? [],
});

export function MenuNavBar({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  return (
    <div
      className={cn(
        className,
        "box-border flex justify-between gap-1 rounded-md",
      )}
    >
      <Link
        to="/editor/search"
        className="w-full"
        title="search"
        search={searchFn}
      >
        <Button
          variant="basic"
          className={cn("flex w-full justify-center rounded-md p-1")}
          animate={{
            opacity: pathname === "/editor/search" ? 1 : undefined,
          }}
        >
          <Search className="h-4" />
        </Button>
      </Link>

      <Link
        to="/editor/filter"
        className="w-full"
        title="filter"
        search={searchFn}
      >
        <Button
          variant="basic"
          className="flex w-full justify-center rounded-md p-1"
          animate={{
            opacity: pathname === "/editor/filter" ? 1 : undefined,
          }}
        >
          <Filter className="h-4" />
        </Button>
      </Link>

      <Link
        to="/editor/autobuild"
        className="w-full"
        title="autobuild"
        search={searchFn}
      >
        <Button
          variant="basic"
          className="flex w-full justify-center rounded-md p-1"
          animate={{
            opacity: pathname === "/editor/autobuild" ? 1 : undefined,
          }}
        >
          <Star className="h-4" />
        </Button>
      </Link>

      <Link
        to="/editor/saved"
        className="w-full"
        title="saved"
        search={searchFn}
      >
        <Button
          variant="basic"
          className="flex w-full justify-center rounded-md p-1"
          animate={{
            opacity: pathname === "/editor/saved" ? 1 : undefined,
          }}
        >
          <Folder className="h-4" />
        </Button>
      </Link>

      <Link
        to="/editor/settings"
        className="w-full"
        title="settings"
        search={searchFn}
      >
        <Button
          variant="basic"
          className="flex w-full justify-center rounded-md p-1"
          animate={{
            opacity: pathname === "/editor/settings" ? 1 : undefined,
          }}
        >
          <Settings className="h-4" />
        </Button>
      </Link>
    </div>
  );
}
