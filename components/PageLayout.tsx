import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { AnimatedSection, AnimatedText, StaggeredGrid } from './ScrollAnimations';

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}

interface PageHeroProps {
  badge?: string;
  badgeColor?: string;
  title: string;
  subtitle?: string;
  showFruits?: boolean;
}

export function PageHero({ 
  badge, 
  badgeColor = 'linear-gradient(135deg, #3FBF7F, #FFD166)',
  title, 
  subtitle,
  showFruits = true 
}: PageHeroProps) {
  return (
    <section className="hero-vibrant" style={{
      padding: '140px 60px 100px',
      textAlign: 'center',
      minHeight: '400px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FFF9F5 0%, #FFE8D6 30%, #FFEEF2 60%, #F0FFF4 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {showFruits && (
        <>
          <div className="floating-fruit tiktok-float" style={{ position: 'absolute', top: '20%', left: '8%', fontSize: '40px' }}>🍓</div>
          <div className="floating-fruit tiktok-float" style={{ position: 'absolute', top: '30%', right: '10%', fontSize: '36px', animationDelay: '0.5s' }}>🥭</div>
          <div className="floating-fruit tiktok-float" style={{ position: 'absolute', bottom: '25%', left: '12%', fontSize: '32px', animationDelay: '1s' }}>🫐</div>
          <div className="floating-fruit tiktok-float" style={{ position: 'absolute', bottom: '35%', right: '6%', fontSize: '38px', animationDelay: '0.3s' }}>🍊</div>
        </>
      )}
      
      {badge && (
        <AnimatedSection animation="fadeUp">
          <span style={{
            display: 'inline-block',
            background: badgeColor,
            color: '#fff',
            padding: '8px 20px',
            borderRadius: '50px',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}>
            {badge}
          </span>
        </AnimatedSection>
      )}
      
      <AnimatedSection animation="fadeUp" delay={badge ? 100 : 0}>
        <h1 className="tiktok-heading tiktok-heading-gradient" style={{
          
          textAlign: 'center',
        }}>
          {title}
        </h1>
      </AnimatedSection>
      
      {subtitle && (
        <AnimatedSection animation="fadeUp" delay={badge ? 200 : 100}>
          <p className="tiktok-subheading" style={{ textAlign: 'center', margin: '0 auto' }}>
            {subtitle}
          </p>
        </AnimatedSection>
      )}
    </section>
  );
}

interface PageSectionProps {
  children: ReactNode;
  background?: 'white' | 'light' | 'cream' | 'gradient' | 'black';
  className?: string;
}

export function PageSection({ children, background = 'white', className = '' }: PageSectionProps) {
  const bgClasses: Record<string, string> = {
    white: 'tiktok-section-white',
    light: 'tiktok-section-light',
    cream: 'tiktok-section-cream',
    gradient: '',
    black: 'tiktok-section-black',
  };
  
  return (
    <section className={`tiktok-section ${bgClasses[background]} ${className}`}>
      <div className="tiktok-container" style={{ maxWidth: '1320px' }}>
        {children}
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  badge?: string;
  badgeColor?: string;
  title: string;
  subtitle?: string;
  emoji?: string;
  centered?: boolean;
}

export function SectionHeader({ 
  badge, 
  badgeColor = 'linear-gradient(135deg, #3FBF7F, #FFD166)',
  title, 
  subtitle,
  emoji,
  centered = false 
}: SectionHeaderProps) {
  return (
    <AnimatedSection animation="fadeUp" style={{ 
      textAlign: centered ? 'center' : 'left', 
      marginBottom: '60px' 
    }}>
      {badge && (
        <span style={{
          display: 'inline-block',
          background: badgeColor,
          color: '#fff',
          padding: '8px 20px',
          borderRadius: '50px',
          fontSize: '13px',
          fontWeight: '700',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: '20px',
        }}>
          {badge}
        </span>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: subtitle ? '16px' : 0, justifyContent: centered ? 'center' : 'flex-start' }}>
        {emoji && <span style={{ fontSize: '32px' }}>{emoji}</span>}
        <h2 className="tiktok-heading tiktok-heading-gradient" style={{ marginBottom: 0 }}>
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="tiktok-subheading" style={{ margin: centered ? '0 auto' : 0 }}>
          {subtitle}
        </p>
      )}
    </AnimatedSection>
  );
}

interface ProductGridProps {
  children: ReactNode[];
}

export function ProductGrid({ children }: ProductGridProps) {
  return (
    <StaggeredGrid
      className="tiktok-feature-grid"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
      staggerDelay={80}
    >
      {children}
    </StaggeredGrid>
  );
}

interface ProductCardProps {
  image: string;
  name: string;
  category?: string;
  price: number;
  reviews?: number;
  href: string;
}

export function ProductCard({ image, name, category, price, reviews, href }: ProductCardProps) {
  return (
    <a href={href} className="tiktok-card" style={{
      textDecoration: 'none',
      color: 'inherit',
      padding: '0',
      overflow: 'hidden',
    }}>
      <div className="tiktok-image-reveal" style={{ marginBottom: '16px' }}>
        <img 
          src={image} 
          alt={name}
          style={{
            width: '100%',
            height: '240px',
            objectFit: 'cover',
          }}
        />
      </div>
      <div style={{ padding: '0 20px 20px' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '700',
          marginBottom: '6px',
          letterSpacing: '-0.3px',
        }}>
          {name}
        </h3>
        {category && (
          <p style={{
            fontSize: '13px',
            color: '#79747e',
            marginBottom: '8px',
            letterSpacing: '-0.2px',
          }}>
            {category}
          </p>
        )}
        {reviews && (
          <p className="stars-vibrant" style={{
            fontSize: '13px',
            marginBottom: '12px',
          }}>
            ★★★★★ {reviews} reviews
          </p>
        )}
        <p style={{
          fontSize: '16px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #FF8A4B, #FF4F7B)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          ${price.toFixed(2)}
        </p>
      </div>
    </a>
  );
}

export { AnimatedSection, AnimatedText, StaggeredGrid };
