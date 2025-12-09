import { useRef } from 'react';
import GlobalHeader from './GlobalHeader';
import HeroCopy from './HeroCopy';

export default function HomeHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  return (
    <section className="lv-hero">
      <GlobalHeader variant="transparent" />
      
      <video
        ref={videoRef}
        className="lv-hero-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="lv-hero-overlay" />

      <HeroCopy />
    </section>
  );
}
