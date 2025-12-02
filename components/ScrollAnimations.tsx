import { ReactNode, CSSProperties, useEffect, useState } from 'react';
import { useScrollAnimation, useMultipleScrollAnimations } from '../hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scaleUp' | 'fadeUpSlow';
  delay?: number;
}

export function AnimatedSection({ 
  children, 
  className = '', 
  style = {}, 
  animation = 'fadeUp',
  delay = 0 
}: AnimatedSectionProps) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();

  const animationStyles: Record<string, CSSProperties> = {
    fadeUp: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
    },
    fadeUpSlow: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(80px)',
    },
    fadeIn: {
      opacity: isVisible ? 1 : 0,
    },
    slideLeft: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(100px)',
    },
    slideRight: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(-100px)',
    },
    scaleUp: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'scale(1)' : 'scale(0.9)',
    },
  };

  return (
    <div
      ref={ref}
      className={`scroll-animated ${className}`}
      style={{
        ...style,
        ...animationStyles[animation],
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
}

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  delay?: number;
}

export function AnimatedText({ 
  children, 
  className = '', 
  style = {},
  as: Tag = 'p',
  delay = 0
}: AnimatedTextProps) {
  const [ref, isVisible] = useScrollAnimation<HTMLElement>();

  return (
    <Tag
      ref={ref as any}
      className={`scroll-animated-text ${className}`}
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}

interface StaggeredGridProps {
  children: ReactNode[];
  className?: string;
  style?: CSSProperties;
  staggerDelay?: number;
  itemClassName?: string;
}

export function StaggeredGrid({ 
  children, 
  className = '', 
  style = {},
  staggerDelay = 80,
  itemClassName = ''
}: StaggeredGridProps) {
  const { containerRef, visibleItems } = useMultipleScrollAnimations(children.length, staggerDelay);

  return (
    <div ref={containerRef} className={className} style={style}>
      {children.map((child, index) => (
        <div
          key={index}
          className={`stagger-item ${itemClassName}`}
          style={{
            opacity: visibleItems[index] ? 1 : 0,
            transform: visibleItems[index] ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
            transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  speed?: number;
}

export function ParallaxSection({ 
  children, 
  className = '', 
  style = {},
  speed = 0.5
}: ParallaxSectionProps) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnce: false });

  return (
    <div
      ref={ref}
      className={`parallax-section ${className}`}
      style={{
        ...style,
        transform: isVisible ? `translateY(${speed * -20}px)` : 'translateY(0)',
        transition: 'transform 0.3s ease-out',
      }}
    >
      {children}
    </div>
  );
}

interface RevealTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
  charDelay?: number;
}

export function RevealText({ 
  text, 
  className = '', 
  style = {},
  charDelay = 30
}: RevealTextProps) {
  const [ref, isVisible] = useScrollAnimation<HTMLSpanElement>();
  
  return (
    <span ref={ref} className={className} style={style}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          style={{
            display: 'inline-block',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * charDelay}ms`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

interface CountUpProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

export function CountUp({ 
  end, 
  prefix = '', 
  suffix = '',
  duration = 2000,
  className = '',
  style = {}
}: CountUpProps) {
  const [ref, isVisible] = useScrollAnimation<HTMLSpanElement>();
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

