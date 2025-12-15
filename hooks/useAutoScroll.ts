import { useEffect, useRef, useCallback } from 'react';

interface AutoScrollOptions {
  speed?: number; // pixels per second (default: 35)
  pauseOnInteraction?: boolean; // pause when user interacts (default: true)
  resumeDelay?: number; // ms to wait before resuming after interaction (default: 1500)
  direction?: 'left' | 'right'; // scroll direction (default: 'left')
}

export function useAutoScroll(options: AutoScrollOptions = {}) {
  const {
    speed = 35,
    pauseOnInteraction = true,
    resumeDelay = 1500,
    direction = 'left',
  } = options;

  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoveringRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);

  const pauseScroll = useCallback(() => {
    isPausedRef.current = true;
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
  }, []);

  const resumeScroll = useCallback(() => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      if (!isHoveringRef.current && !isDraggingRef.current) {
        isPausedRef.current = false;
        lastTimeRef.current = 0;
      }
    }, resumeDelay);
  }, [resumeDelay]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const children = Array.from(track.children) as HTMLElement[];
    if (children.length === 0) return;

    const originalWidth = children.reduce((acc, child) => {
      const style = window.getComputedStyle(child);
      const marginLeft = parseFloat(style.marginLeft) || 0;
      const marginRight = parseFloat(style.marginRight) || 0;
      return acc + child.offsetWidth + marginLeft + marginRight;
    }, 0);

    const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
    const totalOriginalWidth = originalWidth + (children.length - 1) * gap;

    children.forEach((child) => {
      const clone = child.cloneNode(true) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true');
      clone.classList.add('auto-scroll-clone');
      track.appendChild(clone);
    });

    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = currentTime;
      }

      if (!isPausedRef.current) {
        const deltaTime = currentTime - lastTimeRef.current;
        const pixelsToMove = (speed * deltaTime) / 1000;

        if (direction === 'left') {
          track.scrollLeft += pixelsToMove;
          if (track.scrollLeft >= totalOriginalWidth) {
            track.scrollLeft -= totalOriginalWidth;
          }
        } else {
          track.scrollLeft -= pixelsToMove;
          if (track.scrollLeft <= 0) {
            track.scrollLeft += totalOriginalWidth;
          }
        }
      }

      lastTimeRef.current = currentTime;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    if (pauseOnInteraction) {
      const handleMouseEnter = () => {
        isHoveringRef.current = true;
        pauseScroll();
      };

      const handleMouseLeave = () => {
        isHoveringRef.current = false;
        resumeScroll();
      };

      const handleMouseDown = () => {
        isDraggingRef.current = true;
        pauseScroll();
      };

      const handleMouseUp = () => {
        isDraggingRef.current = false;
        resumeScroll();
      };

      const handleTouchStart = () => {
        isDraggingRef.current = true;
        pauseScroll();
      };

      const handleTouchEnd = () => {
        isDraggingRef.current = false;
        resumeScroll();
      };

      const handleWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
          pauseScroll();
          resumeScroll();
        }
      };

      track.addEventListener('mouseenter', handleMouseEnter);
      track.addEventListener('mouseleave', handleMouseLeave);
      track.addEventListener('mousedown', handleMouseDown);
      track.addEventListener('mouseup', handleMouseUp);
      track.addEventListener('touchstart', handleTouchStart, { passive: true });
      track.addEventListener('touchend', handleTouchEnd, { passive: true });
      track.addEventListener('wheel', handleWheel, { passive: true });

      return () => {
        cancelAnimationFrame(animationRef.current);
        if (resumeTimeoutRef.current) {
          clearTimeout(resumeTimeoutRef.current);
        }
        track.removeEventListener('mouseenter', handleMouseEnter);
        track.removeEventListener('mouseleave', handleMouseLeave);
        track.removeEventListener('mousedown', handleMouseDown);
        track.removeEventListener('mouseup', handleMouseUp);
        track.removeEventListener('touchstart', handleTouchStart);
        track.removeEventListener('touchend', handleTouchEnd);
        track.removeEventListener('wheel', handleWheel);

        const clones = track.querySelectorAll('.auto-scroll-clone');
        clones.forEach((clone) => clone.remove());
      };
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
      const clones = track.querySelectorAll('.auto-scroll-clone');
      clones.forEach((clone) => clone.remove());
    };
  }, [speed, pauseOnInteraction, resumeDelay, direction, pauseScroll, resumeScroll]);

  return { trackRef, pauseScroll, resumeScroll };
}

export default useAutoScroll;
