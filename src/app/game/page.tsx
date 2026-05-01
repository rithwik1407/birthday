import { SidebarNav } from "@/components/sidebar-nav";
import { MusicPlayer } from "@/components/music-player";
import { GameSection } from "@/components/sections/game-section";
import { HomeButton } from "@/components/home-button";
import { siteConfig } from "@/lib/site-config";

export default function GamePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary">
      <HomeButton />
      <SidebarNav />
      <GameSection />
      <MusicPlayer
        title={siteConfig.music.title}
        url={siteConfig.music.url}
      />
    </div>
  );
}
