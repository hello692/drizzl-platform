import { useRef, useState, useEffect } from 'react';
import GlobalHeader from './GlobalHeader';

const DYNAMIC_WORDS = [
  { word: 'totally nourished', color: '#7CB342' },
  { word: 'over-the-moon happy', color: '#FFB300' },
  { word: 'buzzing with energy', color: '#FF7043' },
  { word: 'fueled for anything', color: '#E91E63' },
  { word: 'cool, calm, and collected', color: '#26A69A' },
  { word: 'sharp as a tack', color: '#AB47BC' },
  { word: 'strong like a boss', color: '#EF5350' },
];

function useRotatingWord(words: typeof DYNAMIC_WORDS, interval = 2000) {
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
    currentColor: words[currentIndex].color,
    isVisible 
  };
}

export default function HomeHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { currentWord, currentColor, isVisible } = useRotatingWord(DYNAMIC_WORDS, 2500);

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
        <h2 className="lv-hero-title lv-hero-title-line2">
          And feel{' '}
          <span 
            className={`lv-hero-dynamic-word ${isVisible ? 'visible' : ''}`}
            style={{ 
              color: currentColor,
              textShadow: `0 4px 24px ${currentColor}40`
            }}
          >
            {currentWord}
          </span>
          .
        </h2>
        <p className="lv-hero-sub">
          Close your eyes. Take a sip. Feel it. That rush of flavor, that moment of calm, that little voice saying "yes, this is exactly what I needed." This isn't just a smoothie — it's your moment. Your ritual. Your daily act of self-love.
        </p>
        <a href="/products" className="lv-hero-cta">
          Smooch it on
        </a>
      </div>
    </section>
  );
}
