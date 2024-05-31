import { Navbar, Welcome, AboutUs, Features, Contact } from ".";

function LandingPage() {
  return (
    <main className="flex w-screen flex-col overflow-x-hidden font-body text-text">
      <Navbar className="fixed w-full" />
      <Welcome id="welcome" className="h-screen" />
      <AboutUs id="about" className="min-h-screen pt-20" />
      <Features id="features" className="pt-20" />
      <Contact id="contact" className="pt-20" />
    </main>
  );
}

export default LandingPage;
