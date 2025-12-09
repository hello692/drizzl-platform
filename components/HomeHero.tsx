import { useRef, useState } from 'react';
import Link from 'next/link';

export default function HomeHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="home-hero">
      <div className="home-hero__video-wrapper">
        <video
          ref={videoRef}
          className="home-hero__video"
          autoPlay
          muted
          loop
          playsInline
          poster="/videos/hero-poster.jpg"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="home-hero__overlay" />
      </div>

      <div className="home-hero__content">
        <h1 className="home-hero__title">The Smoothie Season with DRIZZL</h1>
        <p className="home-hero__subtitle">
          Be inspired by the House's selection of<br />
          wellness smoothies this season.
        </p>
      </div>

      <button 
        className="home-hero__control home-hero__control--left"
        onClick={handlePlayPause}
        aria-label={isPaused ? "Play background video" : "Pause background video"}
      >
        {isPaused ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        )}
      </button>
      
      <button 
        className="home-hero__control home-hero__control--right"
        onClick={handleMuteToggle}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>
    </section>
  );
}
