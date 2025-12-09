import { useRef, useState, useEffect } from 'react';
import GlobalHeader from './GlobalHeader';

const AFFIRMATIONS = [
  'I am strong',
  'I am nourished',
  'I am happy',
  'I am energized',
  'I am fueled',
  'I am calm',
  'I am focused',
];

export default function HomeHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = AFFIRMATIONS[currentIndex];
    
    const typeSpeed = isDeleting ? 40 : 80;
    const pauseTime = isDeleting ? 100 : 2000;

    if (!isDeleting && displayText === currentPhrase) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseTime);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % AFFIRMATIONS.length);
      return;
    }

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayText(currentPhrase.substring(0, displayText.length - 1));
      } else {
        setDisplayText(currentPhrase.substring(0, displayText.length + 1));
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex]);

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
        <h1 className="lv-hero-title">Fall in Love with Smoothies Again.</h1>
        <p className="lv-hero-affirmation">
          <span>{displayText}</span>
          <span className="lv-hero-cursor">|</span>
        </p>
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
