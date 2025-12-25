'use client';

import { useEffect } from 'react';

type Theme = 'system' | 'light' | 'dark';

export type ShipStickyHeaderProps = {
  items?: string[];
  showFooter?: boolean;
  theme?: Theme;
  animate?: boolean;
  hue?: number;
  startVh?: number;
  spaceVh?: number;
  debug?: boolean;
  taglineHTML?: string;
};

function WordHeroPage({
  items = ['design.', 'prototype.', 'solve.', 'build.', 'develop.', 'cook.', 'ship.'],
  showFooter = true,
  theme = 'system',
  animate = true,
  hue = 280,
  startVh = 50,
  spaceVh = 50,
  debug = false,
  taglineHTML = `and i&apos;ll show you how.<br /><a href="https://rahil.pro">rahil.pro</a>.`,
}: ShipStickyHeaderProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.animate = String(animate);
    root.dataset.debug = String(debug);
    root.style.setProperty('--hue', String(hue));
    root.style.setProperty('--start', `${startVh}vh`);
    root.style.setProperty('--space', `${spaceVh}vh`);
  }, [theme, animate, debug, hue, startVh, spaceVh]);

  return (
    <div
      className="scroll-hero-container"
      style={
        {
          '--count': items.length,
        } as React.CSSProperties
      }
    >
      <header className="scroll-hero-header">
        <section className="scroll-hero-section-inner">
          <h1 className="scroll-hero-h1">
            <span aria-hidden="true">you can&nbsp;</span>
            <span className="sr-only">you can ship things.</span>
          </h1>

          <ul aria-hidden="true" className="scroll-hero-list">
            {items.map((word, i) => (
              <li key={i} style={{ '--i': i } as React.CSSProperties} className="scroll-hero-item">
                {word}
              </li>
            ))}
          </ul>
        </section>
      </header>

      <main className="scroll-hero-main">
        <section className="scroll-hero-main-section">
          <p
            className="scroll-hero-tagline"
            dangerouslySetInnerHTML={{ __html: taglineHTML }}
          />
        </section>
      </main>

      {showFooter && <footer className="scroll-hero-footer">Drizzl Wellness &copy; 2025</footer>}
    </div>
  );
}

export { WordHeroPage };
