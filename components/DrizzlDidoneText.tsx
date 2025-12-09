import { useEffect, useState } from 'react';

interface DrizzlDidoneTextProps {
  text: string;
  className?: string;
  letterSpacing?: number;
  size?: number;
}

const GLYPH_WIDTHS: Record<string, number> = {
  'A': 720, 'B': 640, 'C': 680, 'D': 700, 'E': 580, 'F': 560,
  'G': 720, 'H': 720, 'I': 320, 'J': 480, 'K': 680, 'L': 560,
  'M': 880, 'N': 720, 'O': 740, 'P': 620, 'Q': 740, 'R': 680,
  'S': 600, 'T': 640, 'U': 720, 'V': 700, 'W': 960, 'X': 680,
  'Y': 680, 'Z': 620, ' ': 300
};

export default function DrizzlDidoneText({ 
  text, 
  className = '', 
  letterSpacing = 20,
  size = 48 
}: DrizzlDidoneTextProps) {
  const [svgLoaded, setSvgLoaded] = useState(false);

  useEffect(() => {
    fetch('/fonts/drizzl-didone/glyphs.svg')
      .then(res => res.text())
      .then(svgContent => {
        const container = document.getElementById('drizzl-didone-sprites');
        if (!container) {
          const div = document.createElement('div');
          div.id = 'drizzl-didone-sprites';
          div.innerHTML = svgContent;
          div.style.display = 'none';
          document.body.appendChild(div);
        }
        setSvgLoaded(true);
      })
      .catch(console.error);
  }, []);

  const letters = text.toUpperCase().split('');
  const scale = size / 1000;
  
  let totalWidth = 0;
  const positions: number[] = [];
  
  letters.forEach((letter) => {
    positions.push(totalWidth);
    const width = GLYPH_WIDTHS[letter] || 500;
    totalWidth += (width + letterSpacing) * scale;
  });

  if (!svgLoaded) {
    return (
      <span className={className} style={{ fontSize: size, fontFamily: "'Bodoni Moda', Georgia, serif" }}>
        {text}
      </span>
    );
  }

  return (
    <svg 
      className={className}
      viewBox={`0 0 ${totalWidth / scale} 1000`}
      style={{ 
        height: size, 
        width: totalWidth,
        display: 'inline-block',
        verticalAlign: 'baseline'
      }}
    >
      {letters.map((letter, index) => {
        if (letter === ' ') return null;
        const symbolId = `dd-${letter}`;
        const width = GLYPH_WIDTHS[letter] || 500;
        
        return (
          <use 
            key={index}
            href={`#${symbolId}`}
            x={positions[index] / scale}
            y={0}
            width={width}
            height={1000}
          />
        );
      })}
    </svg>
  );
}
