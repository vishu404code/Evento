import React from 'react';
import { ProgressBar } from './components/ProgressBar';
import { CursorGlow } from './components/CursorGlow';
import { BackgroundBlobs } from './components/BackgroundBlobs';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ClubMarquee } from './components/ClubMarquee';
import { ChaosToOrder } from './components/ChaosToOrder';
import { ScrollStory } from './components/ScrollStory';
import { NotifyShareDemo } from './components/NotifyShareDemo';
import { OrganizerFlow } from './components/OrganizerFlow';
import { Features } from './components/Features';
import { StatsStrip } from './components/StatsStrip';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-beige text-charcoal flex flex-col selection:bg-terracotta/20 selection:text-terracotta-dark">
      {/* Global Scroll Progress Bar */}
      <ProgressBar />

      {/* Global Cursor Glow on Desktop */}
      <CursorGlow />

      {/* Ambient Parallax Background Blobs */}
      <BackgroundBlobs />

      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Content Flow */}
      <main className="flex-1">
        {/* Section 2 & 3: Hero & Floating Event Cards */}
        <Hero />

        {/* Section 4: Club Marquee Strip */}
        <ClubMarquee />

        {/* Section 5: WhatsApp Chaos -> EVENTO Order */}
        <ChaosToOrder />

        {/* Section 6: Pinned Scroll-Story: A Day on EVENTO */}
        <ScrollStory />

        {/* Section 9: Notify and Share Demo */}
        <NotifyShareDemo />

        {/* Section 10: For Organizers (@rishihood.edu.in) */}
        <OrganizerFlow />

        {/* Section 11: Feature Highlights */}
        <Features />

        {/* Section 12: Animated Counters & Goal Promise Strip */}
        <StatsStrip />

        {/* Section 13: FAQ Accordion */}
        <FAQ />

        {/* Section 13b: Final Terracotta CTA Band */}
        <FinalCTA />
      </main>

      {/* Section 14: Footer */}
      <Footer />
    </div>
  );
};

export default App;

