# Drizzl Maison Serif Type System

A luxury editorial serif family inspired by high-fashion typography. Three optical weights designed for premium brand applications.

---

## FAMILY OVERVIEW

| Style | Role | Size Range | Contrast | Use |
|-------|------|------------|----------|-----|
| **Display** | Page titles | 48–120px | 10:1 | "HISTORY", hero headlines |
| **Subtitle** | Under titles | 18–30px | 6:1 | Taglines, intro lines |
| **Text** | Paragraphs | 14–19px | 4:1 | Body copy, descriptions |

---

## A. STYLE SPECIFICATIONS

### 1. DRIZZL MAISON DISPLAY
```
Purpose:         Big page titles (like "HISTORY")
Optical size:    48–120px
Cap height:      720 units (tall)
Contrast:        10:1 (thick:thin)
Letter-spacing:  -2% tight
Text transform:  ALL CAPS preferred
Weight:          400–500 (slightly bold)

Characteristics:
- Strong Didone fashion serif
- Long vertical stems
- Sharp apex angles
- Horizontal hairline serifs
- Bracketed transitions
- Dramatic thick/thin contrast
```

### 2. DRIZZL MAISON SUBTITLE
```
Purpose:         Under-title text, taglines
Optical size:    18–30px
Cap height:      700 units
Contrast:        6:1 (thick:thin)
Letter-spacing:  0% neutral
Text transform:  Sentence case or SMALL CAPS
Weight:          400 (medium)

Characteristics:
- Calmer, less dramatic
- Lower contrast for readability
- Wider letter-spacing than Display
- Softer serif brackets
- Medium stem weight
```

### 3. DRIZZL MAISON TEXT
```
Purpose:         Paragraphs, long-form content
Optical size:    14–19px
Cap height:      680 units
Contrast:        4:1 (thick:thin)
Letter-spacing:  +1% airy
Text transform:  Sentence case
Weight:          400 (regular)
Line-height:     1.55

Characteristics:
- Smooth modern serif
- Humanist rhythm (NOT sharp Bodoni)
- Low contrast for screen reading
- Subtle, organic serifs
- Open counters
- Soft stress transitions
```

---

## B. STROKE CONTRAST RATIOS

| Style | Thick Stem | Thin Stroke | Ratio | Hairline |
|-------|------------|-------------|-------|----------|
| Display | 90 units | 9 units | 10:1 | 8 units |
| Subtitle | 72 units | 12 units | 6:1 | 12 units |
| Text | 56 units | 14 units | 4:1 | 14 units |

### Stroke Width Table (1000 UPM)
```
Element              | Display | Subtitle | Text   |
---------------------|---------|----------|--------|
Vertical stem        | 90      | 72       | 56     |
Horizontal hairline  | 9       | 12       | 14     |
Diagonal thick       | 85      | 68       | 52     |
Diagonal thin        | 10      | 13       | 15     |
Serif height         | 8       | 12       | 14     |
Bowl stroke          | 88      | 70       | 54     |
```

---

## C. SERIF GEOMETRY

### Serif Style: Bracketed Hairline with Flared Terminals

```
                FLARED
               TERMINAL
                  ↓
         ┌───────═══───────┐
         │                 │
    ─────┤   HAIRLINE      ├─────
         │                 │
         └──╮           ╭──┘
            │  BRACKET  │
            │   CURVE   │
            │           │
            │   STEM    │
```

### Display Serif Specs
```
Serif width (each side):    40 units
Serif height:               8 units
Bracket radius:             15 units
Terminal flare:             +5 units (subtle)
Bracket curve:              Bezier (0.4, 0, 0.15, 1)
```

### Subtitle Serif Specs
```
Serif width (each side):    45 units
Serif height:               12 units
Bracket radius:             20 units
Terminal flare:             +3 units (subtle)
Bracket curve:              Bezier (0.35, 0, 0.2, 1)
```

### Text Serif Specs
```
Serif width (each side):    50 units
Serif height:               14 units
Bracket radius:             25 units
Terminal flare:             +2 units (minimal)
Bracket curve:              Bezier (0.3, 0, 0.25, 1)
Organic softness:           High (humanist feel)
```

---

## D. TRACKING & KERNING

### Letter-Spacing by Style
```css
/* Display - Tight */
.drizzl-display {
  letter-spacing: -0.02em;  /* -2% */
}

/* Subtitle - Neutral */
.drizzl-subtitle {
  letter-spacing: 0em;      /* 0% */
}

/* Text - Airy */
.drizzl-text {
  letter-spacing: 0.01em;   /* +1% */
}
```

### Critical Kerning Pairs

#### Display (Tight Pairs)
| Pair | Value | Pair | Value |
|------|-------|------|-------|
| AV | -100 | VA | -100 |
| AW | -80 | WA | -80 |
| AT | -75 | TA | -75 |
| AY | -90 | YA | -90 |
| LT | -55 | TY | -50 |
| LV | -55 | LY | -50 |
| LA | -60 | FA | -50 |
| PA | -35 | TO | -30 |

#### Subtitle (Moderate Pairs)
| Pair | Value | Pair | Value |
|------|-------|------|-------|
| AV | -65 | VA | -65 |
| AW | -50 | WA | -50 |
| AT | -45 | TA | -45 |
| LT | -35 | LY | -30 |

#### Text (Gentle Pairs)
| Pair | Value | Pair | Value |
|------|-------|------|-------|
| AV | -40 | VA | -40 |
| AW | -30 | WA | -30 |
| ff | -10 | fi | -8 |
| fl | -8 | Ty | -25 |

---

## E. NUMERALS

### Numeral Specifications
```
Style:           Lining figures (uniform height)
Alignment:       Tabular for Display, Proportional for Text
Height:          Cap-height aligned
Width:           
  - Display: Tight proportional
  - Text: Slightly wider for readability

0: Oval with vertical stress
1: Minimal serif, centered
2: Open curve, gentle terminal
3: Double bowl, balanced
4: Open counter, angled stem
5: Curved bowl, flat top
6: Full bowl, curved stem
7: Angled stem, minimal serif
8: Double bowl, symmetrical
9: Inverted 6 form
```

---

## F. USAGE RULES

### Hierarchy Implementation

```
TIER 1: Section Title (HISTORY style)
  Font:        Drizzl Maison Display
  Size:        2.8rem (44.8px)
  Weight:      400
  Transform:   uppercase
  Spacing:     -0.02em
  Color:       #1A1A1A on light / #FFFFFF on dark

TIER 2: Under-title Sentence
  Font:        Drizzl Maison Subtitle
  Size:        1.1rem (17.6px)
  Weight:      400
  Transform:   none (sentence case)
  Spacing:     0em
  Color:       #4A4A4A on light / #E5E5E5 on dark

TIER 3: Long Content Paragraphs
  Font:        Drizzl Maison Text
  Size:        1rem (16px)
  Weight:      400
  Transform:   none
  Spacing:     0.01em
  Line-height: 1.55
  Color:       #333333 on light / #CCCCCC on dark
```

### CSS Implementation

```css
/* ========== DRIZZL MAISON DISPLAY ========== */
.dm-display {
  font-family: 'Cormorant Garamond', 'Didot', Georgia, serif;
  font-size: clamp(2.4rem, 6vw, 4.5rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 0.95;
  text-transform: uppercase;
}

/* ========== DRIZZL MAISON SUBTITLE ========== */
.dm-subtitle {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 400;
  letter-spacing: 0em;
  line-height: 1.4;
}

/* ========== DRIZZL MAISON TEXT ========== */
.dm-text {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(0.95rem, 1.5vw, 1.1rem);
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 1.55;
}

/* Small caps variant for subtitles */
.dm-subtitle--smallcaps {
  font-variant: small-caps;
  letter-spacing: 0.05em;
}
```

---

## G. VARIABLE FONT AXES

### Primary Axis: Optical Size (opsz)
```
Axis tag:        opsz
Range:           14 – 120
Default:         16

Named instances:
  - Text:        14 (body copy optimized)
  - Subtitle:    24 (mid-range)
  - Display:     72 (headline optimized)
```

### Secondary Axis: Weight (wght)
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

### Interpolation Table
```
Parameter        | opsz 14  | opsz 24  | opsz 72  | opsz 120 |
-----------------|----------|----------|----------|----------|
Contrast ratio   | 4:1      | 6:1      | 8:1      | 10:1     |
Stem width       | 56       | 68       | 82       | 90       |
Hairline width   | 14       | 12       | 10       | 9        |
Serif extension  | 50       | 47       | 43       | 40       |
Bracket radius   | 25       | 22       | 18       | 15       |
x-height ratio   | 0.48     | 0.45     | 0.42     | 0.40     |
```

---

## H. WEB FONT FALLBACK STACK

For practical web implementation, use these Google Fonts as fallbacks:

```css
/* Display - closest match */
font-family: 'Cormorant Garamond', 'Playfair Display', 'Didot', Georgia, serif;

/* Subtitle */
font-family: 'Cormorant Garamond', 'EB Garamond', Georgia, serif;

/* Text */
font-family: 'Cormorant Garamond', 'Source Serif Pro', Georgia, serif;
```

---

## I. COLOR RECOMMENDATIONS

### On Dark Backgrounds (#000000)
```
Display:   #FFFFFF (pure white)
Subtitle:  #F0F0F0 (soft white)
Text:      #E5E5E5 (reading white)
```

### On Light Backgrounds (#FFFFFF)
```
Display:   #1A1A1A (near black)
Subtitle:  #3A3A3A (dark gray)
Text:      #4A4A4A (reading gray)
```

---

## J. DO / DON'T GUIDELINES

### DO ✓
- Use Display at 36px or larger, always uppercase
- Use Subtitle for taglines and intro sentences
- Use Text for paragraphs with 1.5+ line-height
- Maintain generous whitespace around Display text
- Pair with clean sans-serif for UI elements

### DON'T ✗
- Use Display for body text
- Set Text above 20px (loses elegance)
- Combine with other decorative serifs
- Use tight line-height for Text (<1.4)
- Apply to low-resolution displays without testing

---

*Drizzl Maison Serif © 2024 DRIZZL Wellness. Original type system design.*
