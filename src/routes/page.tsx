import { Navbar, Welcome } from "./(root)";

function LandingPage() {
  return (
    <main className="font-body text-text flex w-screen flex-col overflow-x-hidden">
      <Navbar className="fixed w-full" />
      <Welcome id="welcome" className="h-screen" />
    </main>
  );
}

export default LandingPage;
