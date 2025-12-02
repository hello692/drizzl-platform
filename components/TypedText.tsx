'use client';

import { useEffect, useState } from 'react';

interface TypedTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
  animated?: boolean;
}

export default function TypedText({
  text,
  delay = 0,
  speed = 0.05,
  className = '',
  style = {},
  animated = true,
}: TypedTextProps) {
  const [displayedText, setDisplayedText] = useState(text);
  const [isComplete, setIsComplete] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (!animated) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const startAnimation = () => {
      setDisplayedText('');
      setIsComplete(false);
      let index = 0;
      
      intervalId = setInterval(() => {
        setDisplayedText(text.substring(0, index + 1));
        index++;
        if (index >= text.length) {
          clearInterval(intervalId);
          setIsComplete(true);
        }
      }, speed * 1000);
    };

    if (delay > 0) {
      timeoutId = setTimeout(startAnimation, delay * 1000);
    } else {
      startAnimation();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, delay, speed, animated]);

  return (
    <span
      className={className}
      style={{
        ...style,
        animation: animated && mounted && delay > 0 ? `smoothReveal ${0.6}s ease-out ${delay}s both` : undefined,
        position: 'relative',
      }}
    >
      {displayedText}
      {mounted && !isComplete && animated && (
        <span
          style={{
            display: 'inline-block',
            width: '2px',
            height: '1em',
            marginLeft: '3px',
            background: 'rgba(66, 133, 244, 0.6)',
            animation: 'typingCursor 1s infinite',
            verticalAlign: 'middle',
          }}
        />
      )}
    </span>
  );
}
