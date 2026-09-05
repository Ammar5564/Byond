import { BackgroundCanvasClient } from "@/components/BackgroundCanvasClient";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Principles } from "@/components/Principles";
import { Capabilities } from "@/components/Capabilities";
import { SelectedWork } from "@/components/SelectedWork";
import { Trust } from "@/components/Trust";
import { Contact, Footer } from "@/components/Contact";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-transparent">
      {/* WebGL layer — fixed, behind everything */}
      <BackgroundCanvasClient />

      {/* Editorial UI above the shader */}
      <div className="relative z-10 bg-transparent">
        <Navigation />
        <Hero />
        <Principles />
        <Capabilities />
        <SelectedWork />
        <Trust />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
