import { useSearch } from "@tanstack/react-router";
import { Check } from "lucide-react";

type CardProps = {
  title: string;
  desc: string;
  param: "previewSectionId" | "activeSearch" | "excludeInvalid";
  onToggle: () => void;
};
export function SettingCard({ title, desc, param, onToggle }: CardProps) {
  const q = useSearch({ from: "/editor", select: (s) => s[param] });

  return (
    <div className="bg-bg-secondary flex shrink-0 justify-between gap-2 rounded-md p-2">
      <div>
        <h2 className="text-base font-bold md:text-xl">{title}</h2>
        <p className="opacity-90 max-md:text-sm">{desc}</p>
      </div>
      <div className="flex shrink-0 items-center justify-center">
        <button
          type="button"
          className="bg-secondary hover:bg-third flex h-6 w-6 items-center justify-center rounded-md transition md:h-8 md:w-8"
          onClick={onToggle}
        >
          {q !== undefined && <Check className="h-3 w-3 md:h-4 md:w-4" />}
        </button>
      </div>
    </div>
  );
}
