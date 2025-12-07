# Drizzl Wellness - Global Design System

## Brand Positioning
- **Product**: Premium frozen smoothies
- **Energy**: Fresh. Frozen. Fantastic. Smoothies that make life feel better.
- **Emotional Language**: "I Feel Good / I Feel Better / I Feel Me"
- **Positioning**: Premium, minimal, confident, Apple/Oura-level calm

---

## 1. TYPOGRAPHY SYSTEM

### Font Stack
```css
--font-display: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
--font-text: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif;
```

### Type Scale

| Token | Desktop | Mobile | Weight | Line Height | Letter Spacing | Usage |
|-------|---------|--------|--------|-------------|----------------|-------|
| `--h1` | 80px | 40px | 600 | 1.05 | -0.03em | Hero headlines |
| `--h2` | 56px | 32px | 600 | 1.1 | -0.02em | Section titles |
| `--h3` | 40px | 28px | 600 | 1.15 | -0.02em | Subsection titles |
| `--h4` | 28px | 22px | 600 | 1.2 | -0.015em | Card titles |
| `--h5` | 22px | 18px | 600 | 1.25 | -0.01em | Small headings |
| `--h6` | 18px | 16px | 600 | 1.3 | 0 | Mini headings |
| `--lead` | 24px | 20px | 400 | 1.5 | -0.01em | Intro paragraphs |
| `--body` | 18px | 16px | 400 | 1.6 | 0 | Body text |
| `--body-sm` | 15px | 14px | 400 | 1.5 | 0 | Small body |
| `--overline` | 12px | 11px | 600 | 1.2 | 0.1em | Eyebrow text |
| `--button` | 16px | 15px | 500 | 1 | 0.02em | Button labels |

---

## 2. COLOR PALETTE (MONOCHROME ONLY)

### Backgrounds
```css
--bg-main: #000000;       /* Primary background - pure black */
--bg-alt: #0a0a0a;        /* Alternate sections */
--bg-elevated: #111111;   /* Cards, elevated surfaces */
--bg-surface: #161616;    /* Interactive surfaces */
--bg-hover: #1a1a1a;      /* Hover states */
```

### Text Colors
```css
--text-main: #ffffff;           /* Primary text - pure white */
--text-secondary: #a1a1a6;      /* Secondary text */
--text-muted: #6e6e73;          /* Muted/tertiary text */
--text-subtle: #48484a;         /* Very subtle text */
```

### Borders
```css
--border-subtle: rgba(255, 255, 255, 0.08);   /* Subtle dividers */
--border-default: rgba(255, 255, 255, 0.12);  /* Default borders */
--border-strong: rgba(255, 255, 255, 0.2);    /* Strong borders */
--border-focus: rgba(255, 255, 255, 0.5);     /* Focus states */
```

---

## 3. SPACING SCALE

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-14: 56px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
--space-32: 128px;
```

### Section Spacing
- **Section vertical padding**: `clamp(80px, 12vw, 140px)`
- **Section horizontal padding**: `clamp(24px, 6vw, 100px)`
- **Max content width**: `1280px`
- **Narrow content width**: `960px`
- **Reading width**: `720px`

---

## 4. GRID SYSTEM

### Desktop (1024px+)
- 12-column grid
- Column gap: 32px
- Container max: 1280px

### Tablet (768px - 1023px)
- 8-column grid
- Column gap: 24px

### Mobile (<768px)
- 4-column grid
- Column gap: 16px

---

## 5. COMPONENT STYLES

### Buttons

#### Primary Button
```css
.btn-primary {
  background: #ffffff;
  color: #000000;
  padding: 16px 32px;
  border-radius: 980px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 16px 32px;
  border-radius: 980px;
}
.btn-secondary:hover {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.05);
}
```

#### Ghost Button
```css
.btn-ghost {
  background: transparent;
  color: #ffffff;
  padding: 12px 0;
  border: none;
  text-decoration: underline;
  text-underline-offset: 4px;
}
```

### Cards

#### Product Card
- White background (#ffffff)
- Rounded corners (24px)
- No shadow (flat design)
- Padding: 24px
- Hover: subtle scale (1.02)

#### Feature Card
- Transparent background
- Border: 1px solid rgba(255,255,255,0.1)
- Rounded corners (16px)
- Padding: 32px

### Badges
```css
.badge {
  display: inline-block;
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 980px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
```

---

## 6. MOTION & INTERACTION

### Transitions
- **Default**: `0.2s ease`
- **Emphasis**: `0.3s ease`
- **Entrance**: `0.4s ease-out`

### Scroll Animations
- Fade up on enter (20px travel)
- Stagger delay: 0.1s between items
- Only trigger once per element

### Hover States
- Buttons: slight lift (-1px translateY)
- Cards: subtle scale (1.02)
- Links: opacity 0.7

---

## 7. PAGE SECTION PATTERNS

### Hero Section
- Full viewport height (or 90vh)
- Centered content
- Large headline with typewriter effect
- Single primary CTA
- Optional background video/image

### Feature Grid Section
- 3-column on desktop
- 2-column on tablet
- 1-column on mobile
- Icon + headline + description

### Split Content Section
- 2-column layout (50/50 or 60/40)
- Image on one side, text on other
- Alternating pattern

### Comparison Table Section
- Full width
- Clear column headers
- Check/X icons for features

### Testimonial Section
- Card carousel
- Video thumbnails with play button
- Name + credential + quote

### CTA Banner Section
- Full width background
- Centered headline + description
- Primary button

### FAQ Section
- Accordion layout
- Grouped by category
- Plus/minus toggle icon

---

## 8. RESPONSIVE BREAKPOINTS

```css
/* Mobile First Approach */
@media (min-width: 480px) { /* Large mobile */ }
@media (min-width: 640px) { /* Small tablet */ }
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large desktop */ }
@media (min-width: 1536px) { /* Extra large */ }
```

---

## 9. ACCESSIBILITY

- Minimum contrast ratio: 4.5:1 for text
- Focus outlines: 2px solid white with 2px offset
- Touch targets: minimum 48px
- Semantic HTML structure
- ARIA labels for interactive elements
- Reduced motion support

---

## 10. FILE STRUCTURE

```
/components
  /ui
    Button.tsx
    Badge.tsx
    Card.tsx
    Input.tsx
  /sections
    Hero.tsx
    FeatureGrid.tsx
    SplitContent.tsx
    Testimonials.tsx
    FAQ.tsx
    CTABanner.tsx
    ComparisonTable.tsx
  /layout
    Navbar.tsx
    Footer.tsx
    PageLayout.tsx
/styles
  globals.css
  design-tokens.css
```
