import { useRef, useState, useEffect } from 'react';
import Navbar from './Navbar';
import Link from 'next/link';

const DYNAMIC_WORDS = [
  { word: 'buzzing with energy', gradient: true },
  { word: 'totally nourished', gradient: true },
  { word: 'fueled for anything', gradient: true },
  { word: 'sharp as a tack', gradient: true },
  { word: 'strong like a boss', gradient: true },
];

function useRotatingWord(words: typeof DYNAMIC_WORDS, interval = 2500) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fadeOutTimer = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setIsVisible(true);
      }, 400);
    }, interval);

    return () => clearInterval(fadeOutTimer);
  }, [words.length, interval]);

  return { 
    currentWord: words[currentIndex].word, 
    isVisible 
  };
}

export default function HomeHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { currentWord, isVisible } = useRotatingWord(DYNAMIC_WORDS, 2800);

  return (
    <section className="hero-futuristic">
      <Navbar />
      
      <video
        ref={videoRef}
        className="hero-futuristic-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>
      
      <div className="hero-futuristic-overlay" />
      <div className="hero-futuristic-glow" />

      <div className="hero-futuristic-content">
        <div className="ai-badge">
          <span className="ai-badge-dot" />
          AI-POWERED NUTRITION
        </div>
        
        <h1 className="hero-futuristic-title">
          Smoothies You'll Want to Kiss
        </h1>
        
        <h2 className="hero-futuristic-subtitle">
          And feel{' '}
          <span className={`gradient-text-animated ${isVisible ? 'visible' : ''}`}>
            {currentWord}
          </span>
          .
        </h2>
        
        <p className="hero-futuristic-description">
          Because being healthy shouldn't suck—Drizzl Wellness makes it worth craving.
        </p>
        
        <Link href="/products" className="cta-button-futuristic">
          <span>Smooch it on</span>
          <svg className="cta-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        <div className="tech-stats">
          <div className="stat">
            <span className="stat-number">100%</span>
            <span className="stat-label">ORGANIC</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number">0g</span>
            <span className="stat-label">ADDED SUGAR</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number">AI</span>
            <span className="stat-label">OPTIMIZED</span>
          </div>
        </div>
      </div>
    </section>
  );
}
