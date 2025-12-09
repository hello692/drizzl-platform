import { useTypewriter } from '../hooks/useTypewriter';

const AFFIRMATIONS = [
  'I am strong',
  'I am nourished',
  'I am happy',
  'I am energized',
  'I am fueled',
  'I am calm',
  'I am focused',
];

export default function HeroCopy() {
  const { displayText, isTyping } = useTypewriter({
    phrases: AFFIRMATIONS,
    typingSpeed: 70,
    deletingSpeed: 40,
    pauseDuration: 1800,
    delayBetweenPhrases: 500,
  });

  return (
    <div className="hero-copy">
      <h1 className="hero-headline">
        Fall in Love with Smoothies Again.
      </h1>
      <p className="hero-affirmation">
        <span className="hero-affirmation-text">{displayText}</span>
        <span className={`hero-cursor ${isTyping ? 'typing' : 'deleting'}`} />
      </p>
    </div>
  );
}
