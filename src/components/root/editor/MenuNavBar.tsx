import { Link, useLocation } from "@tanstack/react-router";
import { Filter, Folder, Search, Settings, Star } from "lucide-react";
import { cn } from "src/lib/utils";
import Button from "@/components/Button";

const searchFn = (prev: {
  previewSectionId?: string | undefined;
  sections?: { sectionId: string; colorIndex: number }[] | undefined;
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
      <Link to="/editor/search" className="w-full" search={searchFn}>
        <Button
          variant="basic"
          className={cn("flex w-full justify-center rounded-md p-1")}
          animate={{
            opacity: pathname === "/editor/search" ? 1 : undefined,
          }}
          title="search"
        >
          <Search className="h-4" />
        </Button>
      </Link>

      <Link to="/editor/filter" className="w-full" search={searchFn}>
        <Button
          variant="basic"
          className="flex w-full justify-center rounded-md p-1"
          animate={{
            opacity: pathname === "/editor/filter" ? 1 : undefined,
          }}
          title="filter"
        >
          <Filter className="h-4" />
        </Button>
      </Link>

      <Link to="/editor/autobuild" className="w-full" search={searchFn}>
        <Button
          variant="basic"
          className="flex w-full justify-center rounded-md p-1"
          animate={{
            opacity: pathname === "/editor/autobuild" ? 1 : undefined,
          }}
          title="autobuild"
        >
          <Star className="h-4" />
        </Button>
      </Link>

      <Link to="/editor/saved" className="w-full" search={searchFn}>
        <Button
          variant="basic"
          className="flex w-full justify-center rounded-md p-1"
          animate={{
            opacity: pathname === "/editor/saved" ? 1 : undefined,
          }}
          title="saved"
        >
          <Folder className="h-4" />
        </Button>
      </Link>

      <Link to="/editor/settings" className="w-full" search={searchFn}>
        <Button
          variant="basic"
          className="flex w-full justify-center rounded-md p-1"
          animate={{
            opacity: pathname === "/editor/settings" ? 1 : undefined,
          }}
          title="settings"
        >
          <Settings className="h-4" />
        </Button>
      </Link>
    </div>
  );
}
