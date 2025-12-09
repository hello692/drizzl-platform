# Drizzl Didone Type Family

## Complete Design Specifications

A luxury Didone-style serif typeface family inspired by high-fashion campaign typography. Designed for premium brand applications with two optical weights.

---

## A. WEIGHTS OVERVIEW

### 1. Drizzl Didone Display
- **Optical size:** 48–120px
- **Purpose:** Hero titles, headlines, display typography
- **Contrast ratio:** 11:1 (thick:thin)
- **Character:** Bold presence, sharp apexes, tight spacing
- **File:** `drizzl-didone-display.svg`

### 2. Drizzl Didone Text
- **Optical size:** 14–24px
- **Purpose:** Subtitles, paragraphs, body copy
- **Contrast ratio:** 6:1 (thick:thin)
- **Character:** Readable, softer serifs, open spacing
- **File:** `drizzl-didone-text.svg`

---

## B. STROKE WIDTH RATIOS

### Display Weight (11:1 Contrast)
```
Thick stem:      88 units (8.8% of em)
Thin stroke:      8 units (0.8% of em)
Hairline serif:  10 units (1.0% of em)
Bowl thickness:  85 units (8.5% of em)
Diagonal thick:  80 units (8.0% of em)
Diagonal thin:   12 units (1.2% of em)
```

### Text Weight (6:1 Contrast)
```
Thick stem:      70 units (7.0% of em)
Thin stroke:     12 units (1.2% of em)
Hairline serif:  14 units (1.4% of em)
Bowl thickness:  68 units (6.8% of em)
Diagonal thick:  65 units (6.5% of em)
Diagonal thin:   14 units (1.4% of em)
```

### Stroke Width Table (1000 UPM)
| Element         | Display | Text   | Delta |
|-----------------|---------|--------|-------|
| Vertical stem   | 88      | 70     | -18   |
| Horizontal thin | 8       | 12     | +4    |
| Diagonal thick  | 80      | 65     | -15   |
| Diagonal thin   | 12      | 14     | +2    |
| Serif height    | 10      | 14     | +4    |
| Bowl stroke     | 85      | 68     | -17   |

---

## C. SERIF GEOMETRY

### Serif Style: Soft Bracketed Hairline

```
                    ┌─────────────┐
                    │   BRACKET   │
                    │   CURVE     │
           ┌────────┴─────────────┴────────┐
           │                               │
    ───────┤         HAIRLINE              ├───────
           │         SERIF                 │
           └───────────────────────────────┘
                         │
                         │ STEM
                         │
```

### Display Weight Serif Specifications
```
Serif width (each side):     45 units
Serif height:                10 units
Bracket radius:              18 units
Terminal taper:              3 units (subtle)
Bracket transition:          Bezier curve (0.4, 0, 0.2, 1)
```

### Text Weight Serif Specifications
```
Serif width (each side):     50 units
Serif height:                14 units
Bracket radius:              22 units
Terminal taper:              5 units (softer)
Bracket transition:          Bezier curve (0.3, 0, 0.1, 1)
```

### Serif Construction Notes
1. **Horizontal orientation** – All serifs are purely horizontal
2. **Gentle bracket** – Smooth S-curve transition into stem (NOT sharp Bodoni)
3. **Slight taper** – Serifs thin slightly toward terminals
4. **Bilateral symmetry** – Equal extension left and right of stem
5. **Consistent thickness** – Hairline weight maintained across all serifs

### Ball Terminal Specifications (C, G, S, etc.)
```
Display: Diameter 32 units, positioned at stroke terminus
Text:    Diameter 38 units, softer connection to stroke
```

---

## D. OPTICAL SPACING RULES

### Sidebearings (in units, 1000 UPM)

#### Display Weight (Tight)
| Left Category  | Right Category | Left SB | Right SB |
|----------------|----------------|---------|----------|
| Straight       | Straight       | 50      | 50       |
| Straight       | Round          | 50      | 30       |
| Round          | Straight       | 30      | 50       |
| Round          | Round          | 30      | 30       |
| Diagonal       | Straight       | 15      | 50       |
| Straight       | Diagonal       | 50      | 15       |
| Diagonal       | Diagonal       | 15      | 15       |

#### Text Weight (Open)
| Left Category  | Right Category | Left SB | Right SB |
|----------------|----------------|---------|----------|
| Straight       | Straight       | 65      | 65       |
| Straight       | Round          | 65      | 45       |
| Round          | Straight       | 45      | 65       |
| Round          | Round          | 45      | 45       |
| Diagonal       | Straight       | 25      | 65       |
| Straight       | Diagonal       | 65      | 25       |
| Diagonal       | Diagonal       | 25      | 25       |

### Letter Category Classification
```
Straight left:   B, D, E, F, H, I, K, L, M, N, P, R
Straight right:  H, I, M, N, U
Round left:      C, G, O, Q
Round right:     C, D, G, O, Q
Diagonal left:   A, V, W, X, Y
Diagonal right:  A, K, V, W, X, Y
Special:         J (hooked), S (spine), T (crossbar), Z (diagonal)
```

### Kerning Pairs

#### Critical Pairs (Display Weight)
| Pair | Kern Value | Notes                    |
|------|------------|--------------------------|
| AV   | -95        | Maximum optical closure  |
| AW   | -75        | Wide diagonal pair       |
| TA   | -70        | Crossbar-apex collision  |
| LA   | -55        | Baseline-apex gap        |
| LY   | -50        | Baseline-diagonal gap    |
| TY   | -45        | Crossbar-diagonal pair   |
| VA   | -95        | Symmetric to AV          |
| WA   | -75        | Symmetric to AW          |
| AT   | -70        | Apex-crossbar collision  |
| AY   | -85        | Apex-diagonal pair       |
| FA   | -55        | Bar-apex gap             |
| LT   | -50        | Baseline-crossbar gap    |
| LV   | -50        | Baseline-diagonal gap    |
| LW   | -40        | Baseline-wide diagonal   |
| PA   | -30        | Bowl-apex minor gap      |
| TO   | -25        | Crossbar-round minor     |
| TR   | -25        | Crossbar-bowl minor      |
| YA   | -85        | Symmetric to AY          |
| YO   | -25        | Diagonal-round minor     |

#### Text Weight Kerning (Reduced by 40%)
| Pair | Kern Value |
|------|------------|
| AV   | -57        |
| AW   | -45        |
| TA   | -42        |
| LA   | -33        |
| LY   | -30        |
| TY   | -27        |

### Tracking Recommendations
```css
/* Display Weight */
.drizzl-didone-display {
  letter-spacing: 0.01em;   /* Very tight for impact */
  word-spacing: 0.05em;
}

/* Text Weight */
.drizzl-didone-text {
  letter-spacing: 0.03em;   /* Open for readability */
  word-spacing: 0.08em;
}
```

---

## E. WEIGHT VARIATION LOGIC

### Variable Font Axes

#### Primary Axis: Weight (wght)
```
Axis tag:        wght
Range:           300 – 600
Default:         400
Named instances:
  - Light:       300
  - Regular:     400
  - Medium:      500
  - SemiBold:    600
```

#### Secondary Axis: Optical Size (opsz)
```
Axis tag:        opsz
Range:           14 – 120
Default:         48
Named instances:
  - Text:        14 (optimized for 14-24px)
  - Display:     120 (optimized for 48-120px)
```

### Interpolation Compatibility

#### Consistent Elements (DO NOT VARY)
```
- Cap height:        720 units
- Ascender height:   800 units (elongated for elegance)
- Descender depth:   -200 units (modest)
- x-height:          380 units (small for elegance)
- Baseline:          0 units
- UPM:               1000 units
```

#### Variable Elements (INTERPOLATE)
```
Element              | wght 300  | wght 400  | wght 500  | wght 600  |
---------------------|-----------|-----------|-----------|-----------|
Stem width           | 55        | 70        | 85        | 100       |
Hairline width       | 10        | 12        | 14        | 16        |
Serif height         | 12        | 14        | 16        | 18        |
Bracket radius       | 25        | 22        | 19        | 16        |
Bowl contrast        | 5:1       | 6:1       | 7:1       | 8:1       |
```

### Optical Size Interpolation
```
Element              | opsz 14   | opsz 48   | opsz 120  |
---------------------|-----------|-----------|-----------|
Stem width           | 70        | 80        | 88        |
Hairline width       | 12        | 10        | 8         |
Contrast ratio       | 6:1       | 8:1       | 11:1      |
Serif extension      | 50        | 47        | 45        |
Bracket softness     | High      | Medium    | Low       |
Letter spacing       | +3%       | 0%        | -2%       |
```

### Master Locations
```
Master 1 (Light Text):     wght=300, opsz=14
Master 2 (Regular Text):   wght=400, opsz=14
Master 3 (Light Display):  wght=300, opsz=120
Master 4 (Regular Display): wght=400, opsz=120
```

---

## F. TYPOGRAPHIC USAGE GUIDELINES

### Hierarchy System

```
TIER 1: Hero Title
  Font:    Drizzl Didone Display
  Size:    2.6rem (41.6px) – 5rem (80px)
  Weight:  400
  Spacing: 0.01em
  Case:    Title Case or ALL CAPS
  
TIER 2: Section Headline
  Font:    Drizzl Didone Display
  Size:    1.8rem (28.8px) – 2.4rem (38.4px)
  Weight:  400
  Spacing: 0.015em
  Case:    Title Case
  
TIER 3: Subtitle / Tagline
  Font:    Drizzl Didone Text
  Size:    1rem (16px) – 1.2rem (19.2px)
  Weight:  400
  Spacing: 0.03em
  Case:    Sentence case
  
TIER 4: Body Paragraph
  Font:    Drizzl Didone Text
  Size:    0.9rem (14.4px) – 1rem (16px)
  Weight:  400
  Spacing: 0.04em
  Line-height: 1.6
  Case:    Sentence case
```

### CSS Implementation

```css
/* Hero Title */
.hero-title {
  font-family: 'Drizzl Didone Display', 'Bodoni Moda', 'Didot', Georgia, serif;
  font-size: clamp(2.6rem, 6vw, 5rem);
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 1.1;
}

/* Subtitle */
.subtitle {
  font-family: 'Drizzl Didone Text', 'Bodoni Moda', Georgia, serif;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.03em;
  line-height: 1.5;
}

/* Body */
.body-text {
  font-family: 'Drizzl Didone Text', Georgia, serif;
  font-size: 0.95rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  line-height: 1.65;
}
```

### Recommended Pairings
```
Headlines:  Drizzl Didone Display
Body:       Inter, Helvetica Neue, or SF Pro (sans-serif)

OR

Headlines:  Drizzl Didone Display
Body:       Drizzl Didone Text (for all-serif luxury aesthetic)
```

### DO / DON'T Guidelines

#### DO ✓
- Use Display weight at 48px or larger
- Use Text weight at 24px or smaller
- Maintain generous line spacing (1.4–1.7)
- Allow breathing room around headlines
- Use on dark backgrounds for maximum impact
- Apply to high-quality print materials

#### DON'T ✗
- Use Display weight below 36px (too thin hairlines)
- Use Text weight above 32px (loses elegance)
- Set body text tighter than 1.4 line-height
- Apply to low-resolution displays without testing
- Use for UI elements (buttons, labels)
- Combine with other Didone/Modern serifs

### Color Recommendations
```
On Dark (#000000):
  - Primary:   #FFFFFF (pure white)
  - Secondary: #E5E5E5 (soft white)
  
On Light (#FFFFFF):
  - Primary:   #1A1A1A (near black)
  - Secondary: #4A4A4A (charcoal)
```

---

## G. GLYPH REFERENCE

### Display Weight Symbol IDs
```
A: #ddd-A    N: #ddd-N
B: #ddd-B    O: #ddd-O
C: #ddd-C    P: #ddd-P
D: #ddd-D    Q: #ddd-Q
E: #ddd-E    R: #ddd-R
F: #ddd-F    S: #ddd-S
G: #ddd-G    T: #ddd-T
H: #ddd-H    U: #ddd-U
I: #ddd-I    V: #ddd-V
J: #ddd-J    W: #ddd-W
K: #ddd-K    X: #ddd-X
L: #ddd-L    Y: #ddd-Y
M: #ddd-M    Z: #ddd-Z
```

### Text Weight Symbol IDs
```
A: #ddt-A    N: #ddt-N
B: #ddt-B    O: #ddt-O
C: #ddt-C    P: #ddt-P
D: #ddt-D    Q: #ddt-Q
E: #ddt-E    R: #ddt-R
F: #ddt-F    S: #ddt-S
G: #ddt-G    T: #ddt-T
H: #ddt-H    U: #ddt-U
I: #ddt-I    V: #ddt-V
J: #ddt-J    W: #ddt-W
K: #ddt-K    X: #ddt-X
L: #ddt-L    Y: #ddt-Y
M: #ddt-M    Z: #ddt-Z
```

---

## H. TECHNICAL NOTES

### File Formats
- **SVG Sprites:** For web inline usage
- **Future:** OTF/TTF/WOFF2 conversion recommended for production

### Browser Support
- All modern browsers (Chrome, Firefox, Safari, Edge)
- SVG use elements require same-origin or CORS headers

### Accessibility
- Maintain minimum 16px for body text
- Ensure sufficient contrast (WCAG AA: 4.5:1)
- Avoid using for critical UI text

---

*Drizzl Didone © 2024 DRIZZL Wellness. Original typeface design.*
