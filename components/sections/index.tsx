import React, { ReactNode } from 'react';

type BackgroundVariant = 'main' | 'alt' | 'elevated';
type SplitRatio = '50/50' | '60/40';

interface SectionWrapperProps {
  children: ReactNode;
  background?: BackgroundVariant;
  className?: string;
  id?: string;
}

export function SectionWrapper({ 
  children, 
  background = 'main',
  className = '',
  id
}: SectionWrapperProps) {
  const bgClasses: Record<BackgroundVariant, string> = {
    main: 'bg-main',
    alt: 'bg-alt',
    elevated: 'bg-elevated'
  };

  return (
    <section 
      id={id}
      className={`section ${bgClasses[background]} ${className}`}
      style={{
        width: '100%'
      }}
    >
      <div className="container">
        {children}
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  overline?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}

export function SectionHeader({ 
  overline, 
  title, 
  subtitle,
  align = 'center',
  className = ''
}: SectionHeaderProps) {
  return (
    <div 
      className={className}
      style={{
        textAlign: align,
        marginBottom: 'var(--space-16)',
        maxWidth: align === 'center' ? 'var(--container-narrow)' : undefined,
        marginLeft: align === 'center' ? 'auto' : undefined,
        marginRight: align === 'center' ? 'auto' : undefined
      }}
    >
      {overline && (
        <p className="text-overline" style={{ marginBottom: 'var(--space-4)' }}>
          {overline}
        </p>
      )}
      <h2 className="text-h2" style={{ marginBottom: subtitle ? 'var(--space-6)' : 0 }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-lead" style={{ margin: 0 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

interface FeatureItem {
  icon: ReactNode;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function FeatureGrid({ 
  features, 
  columns = 3,
  className = ''
}: FeatureGridProps) {
  return (
    <div 
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 'var(--space-8)'
      }}
    >
      {features.map((feature, index) => (
        <div 
          key={index}
          className="animate-on-scroll"
          style={{
            textAlign: 'center',
            padding: 'var(--space-6)'
          }}
        >
          <div 
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-6)',
              color: 'var(--text-main)'
            }}
          >
            {feature.icon}
          </div>
          <h5 
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--h5-size)',
              fontWeight: 'var(--h-weight)',
              lineHeight: 1.25,
              letterSpacing: '-0.01em',
              color: 'var(--text-main)',
              marginBottom: 'var(--space-3)'
            }}
          >
            {feature.title}
          </h5>
          <p 
            style={{
              fontFamily: 'var(--font-text)',
              fontSize: 'var(--text-body-sm)',
              lineHeight: 1.5,
              color: 'var(--text-secondary)',
              margin: 0
            }}
          >
            {feature.description}
          </p>
        </div>
      ))}
      <style jsx>{`
        @media (max-width: 1024px) {
          div:first-child {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

interface SplitSectionProps {
  overline?: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  imageSrc: string;
  imageAlt: string;
  reversed?: boolean;
  ratio?: SplitRatio;
  background?: BackgroundVariant;
  className?: string;
}

export function SplitSection({
  overline,
  title,
  description,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  imageSrc,
  imageAlt,
  reversed = false,
  ratio = '50/50',
  background = 'main',
  className = ''
}: SplitSectionProps) {
  const bgClasses: Record<BackgroundVariant, string> = {
    main: 'bg-main',
    alt: 'bg-alt',
    elevated: 'bg-elevated'
  };

  const gridColumns = ratio === '50/50' 
    ? '1fr 1fr' 
    : reversed ? '2fr 3fr' : '3fr 2fr';

  return (
    <section className={`section ${bgClasses[background]} ${className}`}>
      <div className="container">
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: gridColumns,
            gap: 'var(--space-16)',
            alignItems: 'center'
          }}
        >
          <div 
            style={{ order: reversed ? 2 : 1 }}
          >
            <img 
              src={imageSrc}
              alt={imageAlt}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: 'var(--radius-xl)',
                objectFit: 'cover'
              }}
            />
          </div>
          <div 
            style={{ 
              order: reversed ? 1 : 2,
              paddingLeft: reversed ? 0 : 'var(--space-8)',
              paddingRight: reversed ? 'var(--space-8)' : 0
            }}
          >
            {overline && (
              <p className="text-overline" style={{ marginBottom: 'var(--space-4)' }}>
                {overline}
              </p>
            )}
            <h2 className="text-h2" style={{ marginBottom: 'var(--space-6)' }}>
              {title}
            </h2>
            <p className="text-lead" style={{ marginBottom: 'var(--space-8)' }}>
              {description}
            </p>
            {(ctaText || secondaryCtaText) && (
              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                {ctaText && ctaHref && (
                  <a href={ctaHref} className="btn btn-primary">
                    {ctaText}
                  </a>
                )}
                {secondaryCtaText && secondaryCtaHref && (
                  <a href={secondaryCtaHref} className="btn btn-secondary">
                    {secondaryCtaText}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="order: 2"] {
            order: 1 !important;
          }
          div[style*="order: 1"] {
            order: 2 !important;
          }
          div[style*="padding-left"] {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}

interface Step {
  number: number;
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
}

interface StepSectionProps {
  steps: Step[];
  className?: string;
}

export function StepSection({ steps, className = '' }: StepSectionProps) {
  return (
    <div className={className}>
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(steps.length, 3)}, 1fr)`,
          gap: 'var(--space-12)'
        }}
      >
        {steps.map((step, index) => (
          <div 
            key={index}
            className="animate-on-scroll"
            style={{
              textAlign: 'center'
            }}
          >
            <div 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(48px, 8vw, 80px)',
                fontWeight: 600,
                color: 'var(--text-subtle)',
                lineHeight: 1,
                marginBottom: 'var(--space-6)'
              }}
            >
              {String(step.number).padStart(2, '0')}
            </div>
            {step.imageSrc && (
              <img 
                src={step.imageSrc}
                alt={step.imageAlt || step.title}
                style={{
                  width: '100%',
                  maxWidth: '200px',
                  height: 'auto',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: 'var(--space-6)'
                }}
              />
            )}
            <h5 
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--h5-size)',
                fontWeight: 600,
                color: 'var(--text-main)',
                marginBottom: 'var(--space-3)'
              }}
            >
              {step.title}
            </h5>
            <p 
              style={{
                fontFamily: 'var(--font-text)',
                fontSize: 'var(--text-body-sm)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                margin: 0
              }}
            >
              {step.description}
            </p>
          </div>
        ))}
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
            gap: var(--space-16) !important;
          }
        }
      `}</style>
    </div>
  );
}

interface ComparisonColumn {
  header: string;
  values: (boolean | string)[];
}

interface ComparisonTableProps {
  rowHeaders: string[];
  columns: ComparisonColumn[];
  className?: string;
}

export function ComparisonTable({ 
  rowHeaders, 
  columns,
  className = ''
}: ComparisonTableProps) {
  const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.667 5L7.5 14.167L3.333 10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const XIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 5L5 15M5 5L15 15" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div 
      className={className}
      style={{
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <table 
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          minWidth: '600px'
        }}
      >
        <thead>
          <tr>
            <th 
              style={{
                padding: 'var(--space-4) var(--space-6)',
                textAlign: 'left',
                borderBottom: '1px solid var(--border-default)',
                fontWeight: 400,
                color: 'var(--text-muted)'
              }}
            />
            {columns.map((column, index) => (
              <th 
                key={index}
                style={{
                  padding: 'var(--space-4) var(--space-6)',
                  textAlign: 'center',
                  borderBottom: '1px solid var(--border-default)',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-body)',
                  fontWeight: 600,
                  color: 'var(--text-main)'
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowHeaders.map((rowHeader, rowIndex) => (
            <tr key={rowIndex}>
              <td 
                style={{
                  padding: 'var(--space-4) var(--space-6)',
                  borderBottom: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-text)',
                  fontSize: 'var(--text-body-sm)',
                  color: 'var(--text-secondary)'
                }}
              >
                {rowHeader}
              </td>
              {columns.map((column, colIndex) => {
                const value = column.values[rowIndex];
                return (
                  <td 
                    key={colIndex}
                    style={{
                      padding: 'var(--space-4) var(--space-6)',
                      textAlign: 'center',
                      borderBottom: '1px solid var(--border-subtle)'
                    }}
                  >
                    {typeof value === 'boolean' ? (
                      value ? <CheckIcon /> : <XIcon />
                    ) : (
                      <span 
                        style={{
                          fontFamily: 'var(--font-text)',
                          fontSize: 'var(--text-body-sm)',
                          color: 'var(--text-main)'
                        }}
                      >
                        {value}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface CTABannerProps {
  headline: string;
  description?: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  background?: BackgroundVariant;
  className?: string;
}

export function CTABanner({
  headline,
  description,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
  background = 'elevated',
  className = ''
}: CTABannerProps) {
  const bgClasses: Record<BackgroundVariant, string> = {
    main: 'bg-main',
    alt: 'bg-alt',
    elevated: 'bg-elevated'
  };

  return (
    <section className={`section ${bgClasses[background]} ${className}`}>
      <div className="container">
        <div 
          style={{
            textAlign: 'center',
            maxWidth: 'var(--container-narrow)',
            margin: '0 auto'
          }}
        >
          <h2 className="text-h2" style={{ marginBottom: 'var(--space-6)' }}>
            {headline}
          </h2>
          {description && (
            <p className="text-lead" style={{ marginBottom: 'var(--space-10)' }}>
              {description}
            </p>
          )}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'var(--space-4)',
              flexWrap: 'wrap'
            }}
          >
            <a href={primaryButtonHref} className="btn btn-primary">
              {primaryButtonText}
            </a>
            {secondaryButtonText && secondaryButtonHref && (
              <a href={secondaryButtonHref} className="btn btn-secondary">
                {secondaryButtonText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
