import { createFileRoute } from "@tanstack/react-router";
import SavedSchedules from "src/components/root/editor/saved/SavedSchedules";

export const Route = createFileRoute("/editor/saved")({
  component: SavedSchedules,
});
