import { SidebarNav } from "@/components/sidebar-nav";
import { MusicPlayer } from "@/components/music-player";
import { VideoWallSection } from "@/components/sections/video-wall-section";
import { HomeButton } from "@/components/home-button";
import { siteConfig } from "@/lib/site-config";

export default function VideosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeButton />
      <SidebarNav />

      <main className="flex-1 p-4 md:p-8 md:ml-0">
        <div className="max-w-6xl mx-auto">
          <VideoWallSection />
        </div>
      </main>

      <MusicPlayer
        title={siteConfig.music.title}
        url={siteConfig.music.url}
      />
    </div>
  );
}
