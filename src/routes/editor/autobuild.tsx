import { createFileRoute } from "@tanstack/react-router";
import Autobuild from "src/components/root/editor/autobuild/Autobuild";

export const Route = createFileRoute("/editor/autobuild")({
  component: Autobuild,
});
