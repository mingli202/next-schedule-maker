import BottomMenu from "./BottomMenu";
import Card from "./Card";

const Settings = () => {
  return (
    <div className="relative flex h-full w-full flex-col gap-2 rounded-md">
      <h1 className="shrink-0 font-heading text-2xl font-bold">Settings</h1>
      <Card
        title="Live Search"
        desc="Results are displayed while you type. May reduce performance."
        param="liveSearch"
      />
      <Card
        title="Show Preview"
        desc="Preview where the class would be in the schedule when hovering above the eye icon. You can also toggle it by clicking the eye icon."
        param="previewHover"
      />
      <Card
        title="Filter Out Invalid Classes"
        desc="Filter out classes that you can't take because either it conflicts with another class or you already have a class for the course."
        param="checkValid"
      />
      <div className="basis-full bg-transparent max-md:hidden" />
      <BottomMenu />
    </div>
  );
};

export default Settings;
