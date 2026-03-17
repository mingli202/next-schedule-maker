import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BottomMenu } from "src/components/root/editor/settings/BottomMenu";
import { SettingCard } from "src/components/root/editor/settings/SettingCard";

export const Route = createFileRoute("/editor/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: "/editor/settings" });

  return (
    <div className="relative flex h-full w-full flex-col gap-4 rounded-md p-4">
      <h1 className="font-heading shrink-0 text-xl">Options</h1>
      <SettingCard
        title="Live search"
        desc="Results are displayed as you type."
        param="activeSearch"
        onToggle={() =>
          navigate({
            search: (prev) => ({
              ...prev,
              activeSearch: prev.activeSearch ? undefined : true,
            }),
          })
        }
      />
      <SettingCard
        title="Show preview"
        desc="Preview where the class would be in the schedule when hovering above it. You can also toggle the preview by clicking the eye icon."
        param="previewSectionId"
        onToggle={() =>
          navigate({
            search: (prev) => ({
              ...prev,
              previewSectionId: prev.previewSectionId ? undefined : -1,
            }),
          })
        }
      />
      <SettingCard
        title="Exclude invalid sections"
        desc="Exclude classes from search result that you can't take because either it conflicts with another class or you already have a class for the course."
        param="excludeInvalid"
        onToggle={() =>
          navigate({
            search: (prev) => ({
              ...prev,
              excludeInvalid: prev.excludeInvalid ? undefined : true,
            }),
          })
        }
      />
      <div className="basis-full bg-transparent max-md:hidden" />
      <BottomMenu />
    </div>
  );
}
