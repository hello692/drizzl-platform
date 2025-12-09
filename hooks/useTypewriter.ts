import { useState, useEffect, useCallback } from 'react';

interface UseTypewriterOptions {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  delayBetweenPhrases?: number;
}

export function useTypewriter({
  phrases,
  typingSpeed = 80,
  deletingSpeed = 50,
  pauseDuration = 1800,
  delayBetweenPhrases = 400,
}: UseTypewriterOptions) {
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isWaiting, setIsWaiting] = useState(false);

  const currentPhrase = phrases[phraseIndex];

  useEffect(() => {
    if (isWaiting) return;

    let timeout: NodeJS.Timeout;

    if (isTyping) {
      if (displayText.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        setIsWaiting(true);
        timeout = setTimeout(() => {
          setIsWaiting(false);
          setIsTyping(false);
        }, pauseDuration);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deletingSpeed);
      } else {
        timeout = setTimeout(() => {
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
          setIsTyping(true);
        }, delayBetweenPhrases);
      }
    }

    return () => clearTimeout(timeout);
  }, [
    displayText,
    isTyping,
    isWaiting,
    currentPhrase,
    phrases.length,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    delayBetweenPhrases,
  ]);

  return { displayText, isTyping };
}
