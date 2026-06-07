import { createFileRoute } from "@tanstack/react-router";
import SavedSchedules from "src/components/root/editor/saved/SavedShedules";

export const Route = createFileRoute("/editor/saved")({
  component: SavedSchedules,
});
