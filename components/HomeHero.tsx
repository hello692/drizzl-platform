import { useRef, useState } from 'react';
import LVHeader from './LVHeader';

export default function HomeHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  return (
    <section className="lv-hero">
      <LVHeader />
      
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

      <div className="lv-hero-copy">
        <h1 className="lv-hero-title">The Smoothie Season with DRIZZL</h1>
        <p className="lv-hero-sub">
          Be inspired by our selection of<br />
          wellness smoothies this season.
        </p>
      </div>
    </section>
  );
}
