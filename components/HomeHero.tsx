import { useRef, useState, useEffect } from 'react';
import GlobalHeader from './GlobalHeader';

const DYNAMIC_WORDS = [
  { word: 'nourished', color: '#7CB342' },  // Green - leafy
  { word: 'happy', color: '#FFB300' },       // Yellow - banana/mango
  { word: 'energized', color: '#FF7043' },   // Orange - citrus
  { word: 'fueled', color: '#E91E63' },      // Pink - berry
  { word: 'calm', color: '#26A69A' },        // Teal - mint
  { word: 'focused', color: '#AB47BC' },     // Purple - acai
  { word: 'strong', color: '#EF5350' },      // Red - strawberry
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
  const { currentWord, currentColor, isVisible } = useRotatingWord(DYNAMIC_WORDS, 2000);

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
          Smoothies you want to kiss and feel{' '}
          <span 
            className={`lv-hero-dynamic-word ${isVisible ? 'visible' : ''}`}
            style={{ color: currentColor }}
          >
            {currentWord}
          </span>
        </h1>
        <p className="lv-hero-sub">
          Because being healthy shouldn't suck, now it's finally worth craving.
        </p>
        <a href="/products" className="lv-hero-cta">
          Smooch it on
        </a>
      </div>
    </section>
  );
}
