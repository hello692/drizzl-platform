import { useRef, useState, useEffect } from 'react';
import GlobalHeader from './GlobalHeader';

const DYNAMIC_PHRASES = [
  { phrase: 'And feel totally nourished.', color: '#7CB342' },
  { phrase: 'And feel over-the-moon happy.', color: '#FFB300' },
  { phrase: 'And feel buzzing with energy.', color: '#FF7043' },
  { phrase: 'And feel fueled for anything.', color: '#E91E63' },
  { phrase: 'And feel cool, calm, and collected.', color: '#26A69A' },
  { phrase: 'And feel sharp as a tack.', color: '#AB47BC' },
  { phrase: 'And feel strong like a boss.', color: '#EF5350' },
];

function useRotatingPhrase(phrases: typeof DYNAMIC_PHRASES, interval = 2000) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fadeOutTimer = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % phrases.length);
        setIsVisible(true);
      }, 400);
    }, interval);

    return () => clearInterval(fadeOutTimer);
  }, [phrases.length, interval]);

  return { 
    currentPhrase: phrases[currentIndex].phrase, 
    currentColor: phrases[currentIndex].color,
    isVisible 
  };
}

export default function HomeHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { currentPhrase, currentColor, isVisible } = useRotatingPhrase(DYNAMIC_PHRASES, 2500);

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

      <div className="lv-hero-copy">
        <h1 className="lv-hero-title">
          Smoothies You'll Want to Kiss
        </h1>
        <p 
          className={`lv-hero-rotating-phrase ${isVisible ? 'visible' : ''}`}
          style={{ 
            color: currentColor,
            textShadow: `0 4px 24px ${currentColor}40`
          }}
        >
          {currentPhrase}
        </p>
        <p className="lv-hero-sub">
          Because being healthy shouldn't suck—Drizzl Wellness makes it worth craving.
        </p>
        <a href="/products" className="lv-hero-cta">
          Smooch it on
        </a>
      </div>
    </section>
  );
}
