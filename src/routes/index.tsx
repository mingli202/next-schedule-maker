import { createFileRoute } from "@tanstack/react-router";
import { Navbar, Welcome } from "@/components/root";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="font-body flex w-screen flex-col overflow-x-hidden">
      <Navbar className="fixed w-full" />
      <Welcome id="welcome" className="h-screen" />
    </main>
  );
}
