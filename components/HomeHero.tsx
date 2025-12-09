import { useRef, useState, useEffect } from 'react';
import GlobalHeader from './GlobalHeader';

const DYNAMIC_WORDS = [
  'nourished',
  'happy',
  'energized',
  'fueled',
  'calm',
  'focused',
  'strong',
];

function useRotatingWord(words: string[], interval = 2000) {
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

  return { currentWord: words[currentIndex], isVisible };
}

export default function HomeHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { currentWord, isVisible } = useRotatingWord(DYNAMIC_WORDS, 2000);

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
          <span className={`lv-hero-dynamic-word ${isVisible ? 'visible' : ''}`}>
            {currentWord}
          </span>
        </h1>
        <p className="lv-hero-sub">
          Because being healthy shouldn't suck.
        </p>
        <a href="/products" className="lv-hero-cta">
          Kiss of health
        </a>
      </div>
    </section>
  );
}
