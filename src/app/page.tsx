import { Navbar, Welcome } from ".";

function LandingPage() {
  return (
    <main className="flex w-screen flex-col overflow-x-hidden font-body text-text">
      <Navbar className="fixed w-full" />
      <Welcome id="welcome" className="h-screen" />
    </main>
  );
}

export default LandingPage;
