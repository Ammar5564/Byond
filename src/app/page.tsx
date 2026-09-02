import { Hero, Philosophy, EditorialQuotes } from "@/components/Hero";
import { StatementBreak } from "@/components/MarqueeBand";
import { Capabilities } from "@/components/Capabilities";
import { SelectedWork } from "@/components/SelectedWork";
import { Approach } from "@/components/Approach";
import { Testimonials } from "@/components/Testimonials";
import { Partners } from "@/components/Partners";
import { Contact, Footer } from "@/components/Contact";
import { movingStatements } from "@/lib/content";

export default function Home() {
  return (
    <main>
      <Hero />
      <StatementBreak lines={movingStatements.afterHero} variant="crescendo" />
      <Philosophy />
      <EditorialQuotes />
      <Capabilities />
      <SelectedWork />
      <StatementBreak lines={movingStatements.afterWork} variant="bridge" />
      <Approach />
      <Testimonials />
      <Partners />
      <StatementBreak lines={movingStatements.beforeContact} variant="dark" />
      <Contact />
      <Footer />
    </main>
  );
}
