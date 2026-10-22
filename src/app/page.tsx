import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Trust } from "@/components/Trust";
import { Principles } from "@/components/Principles";
import { Capabilities } from "@/components/Capabilities";
import { SelectedWork } from "@/components/SelectedWork";
import { Contact, Footer } from "@/components/Contact";

export default function Home() {
  return (
    <main className="relative overflow-x-clip bg-ivory">
      <Navigation />
      <Hero />
      <Trust />
      <Principles />
      <Capabilities />
      <SelectedWork />
      <Contact />
      <Footer />
    </main>
  );
}
