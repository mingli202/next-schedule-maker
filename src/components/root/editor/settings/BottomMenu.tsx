import { Link, useSearch } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { Button } from "src/components";
import download from "src/lib/download";
import { useSectionStore } from "src/lib/store/section";

export function BottomMenu() {
  const { sectionsById } = useSectionStore();
  const sections = useSearch({
    from: "/editor/settings",
    select: (s) => s.sections,
  });

  return (
    <div className="bg-background flex w-full shrink-0 items-center justify-between gap-2">
      <Link
        to="/editor/settings"
        title="reset everything"
        search={{ sections: [] }}
      >
        <Button variant="basic" title="Clear everything on the screen">
          Reset URL
        </Button>
      </Link>

      <Button
        onClick={() => {
          download(sections, sectionsById);
        }}
        variant="basic"
        className="rounded-none p-0"
        disableBgEffect
        title="Download as excel"
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}
