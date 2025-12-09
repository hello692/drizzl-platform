import { useEffect, useState } from 'react';

interface DrizzlDidoneTextProps {
  text: string;
  weight?: 'display' | 'text';
  className?: string;
  size?: number;
  color?: string;
}

const DISPLAY_WIDTHS: Record<string, number> = {
  'A': 750, 'B': 620, 'C': 680, 'D': 720, 'E': 580, 'F': 560,
  'G': 740, 'H': 720, 'I': 280, 'J': 420, 'K': 700, 'L': 560,
  'M': 900, 'N': 720, 'O': 760, 'P': 620, 'Q': 780, 'R': 680,
  'S': 580, 'T': 640, 'U': 720, 'V': 720, 'W': 980, 'X': 680,
  'Y': 680, 'Z': 620, ' ': 280
};

const TEXT_WIDTHS: Record<string, number> = {
  'A': 700, 'B': 580, 'C': 620, 'D': 660, 'E': 540, 'F': 520,
  'G': 680, 'H': 660, 'I': 260, 'J': 380, 'K': 640, 'L': 500,
  'M': 820, 'N': 660, 'O': 700, 'P': 580, 'Q': 720, 'R': 620,
  'S': 540, 'T': 580, 'U': 660, 'V': 660, 'W': 900, 'X': 620,
  'Y': 620, 'Z': 560, ' ': 260
};

export default function DrizzlDidoneText({ 
  text, 
  weight = 'display',
  className = '', 
  size = 48,
  color = 'currentColor'
}: DrizzlDidoneTextProps) {
  const [svgLoaded, setSvgLoaded] = useState(false);

  const prefix = weight === 'display' ? 'ddd' : 'ddt';
  const widths = weight === 'display' ? DISPLAY_WIDTHS : TEXT_WIDTHS;
  const spacing = weight === 'display' ? 10 : 20;
  const svgFile = weight === 'display' 
    ? '/fonts/drizzl-didone/drizzl-didone-display.svg'
    : '/fonts/drizzl-didone/drizzl-didone-text.svg';

  useEffect(() => {
    const containerId = `drizzl-didone-${weight}-sprites`;
    
    if (document.getElementById(containerId)) {
      setSvgLoaded(true);
      return;
    }

    fetch(svgFile)
      .then(res => res.text())
      .then(svgContent => {
        const div = document.createElement('div');
        div.id = containerId;
        div.innerHTML = svgContent;
        div.style.display = 'none';
        document.body.appendChild(div);
        setSvgLoaded(true);
      })
      .catch(console.error);
  }, [weight, svgFile]);

  const letters = text.toUpperCase().split('');
  const scale = size / 1000;
  
  let totalWidth = 0;
  const positions: { x: number; char: string; width: number }[] = [];
  
  letters.forEach((letter) => {
    const width = widths[letter] || 500;
    positions.push({ x: totalWidth, char: letter, width });
    totalWidth += width + spacing;
  });

  if (!svgLoaded) {
    return (
      <span 
        className={className} 
        style={{ 
          fontSize: size, 
          fontFamily: "'Bodoni Moda', 'Didot', Georgia, serif",
          color 
        }}
      >
        {text}
      </span>
    );
  }

  return (
    <svg 
      className={className}
      viewBox={`0 0 ${totalWidth} 1000`}
      style={{ 
        height: size, 
        width: totalWidth * scale,
        display: 'inline-block',
        verticalAlign: 'baseline',
        fill: color
      }}
      aria-label={text}
      role="img"
    >
      {positions.map(({ x, char, width }, index) => {
        if (char === ' ') return null;
        const symbolId = `${prefix}-${char}`;
        
        return (
          <use 
            key={index}
            href={`#${symbolId}`}
            x={x}
            y={0}
            width={width}
            height={1000}
          />
        );
      })}
    </svg>
  );
}
