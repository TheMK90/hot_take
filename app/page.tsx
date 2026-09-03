import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MarqueeBackdrop } from "@/components/MarqueeBackdrop";
import { LobbyRail } from "@/components/LobbyRail";
import { ReviewsSection } from "@/components/ReviewsSection";
import { NowShowing } from "@/components/NowShowing";
import { Top10 } from "@/components/Top10";
import { Genres } from "@/components/Genres";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import { ComposerModal } from "@/components/ComposerModal";

export default function Home() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "var(--bg)", color: "var(--ink)", overflowX: "hidden" }}>
      <MarqueeBackdrop />
      <Header />
      <Hero />
      <LobbyRail />
      <ReviewsSection />
      <NowShowing />
      <Top10 />
      <Genres />
      <Footer />
      <AuthModal />
      <ComposerModal />
    </div>
  );
}
