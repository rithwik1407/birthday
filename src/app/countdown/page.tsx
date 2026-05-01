import { SidebarNav } from "@/components/sidebar-nav";
import { MusicPlayer } from "@/components/music-player";
import { CountdownSection } from "@/components/sections/countdown-section";
import { HomeButton } from "@/components/home-button";
import { siteConfig } from "@/lib/site-config";

export default function CountdownPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary">
      <HomeButton />
      <SidebarNav />
      <CountdownSection />
      <MusicPlayer
        title={siteConfig.music.title}
        url={siteConfig.music.url}
      />
    </div>
  );
}
