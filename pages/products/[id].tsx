import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const POPULAR_SMOOTHIES = [
  { id: '1', name: 'Strawberry + Peach', price: 8.49, image: '/products/strawberry-peach/main-product.png', description: 'Creamy strawberry bliss' },
  { id: '9', name: 'Pink Piyata', price: 8.99, image: '/products/pink-piyata/transparent-glass-1.png', description: 'Tropical dragon fruit' },
  { id: '10', name: 'Matcha', price: 9.49, image: '/products/matcha/transparent-glass-1.png', description: 'Zen in a cup' },
  { id: '14', name: 'Coffee Mushroom', price: 9.99, image: '/products/coffee-mushroom/transparent-glass-1.png', description: 'Adaptogenic energy' },
  { id: '17', name: 'Acai', price: 9.49, image: '/products/acai/Acai-TG-1.jpg', description: 'Amazonian superfruit' },
  { id: '12', name: 'Nutty Monkey', price: 8.99, image: '/products/nutty-monkey/transparent-glass-1.png', description: 'Creamy peanut butter' },
];

const GALLERY_IMAGES = [
  '/products/strawberry-peach/main-product.png',
  '/products/strawberry-peach/transparent-glass-1.png',
  '/products/strawberry-peach/transparent-glass-2.png',
  '/products/strawberry-peach/lifestyle-1.jpg',
  '/products/strawberry-peach/lifestyle-2.jpg',
  '/products/strawberry-peach/product-1.jpg',
];

const KEY_INGREDIENTS = [
  { name: 'Strawberry', benefit: 'Rich in vitamin C and antioxidants for glowing skin', emoji: '🍓' },
  { name: 'Banana', benefit: 'Natural energy boost with potassium for muscle recovery', emoji: '🍌' },
  { name: 'Peach', benefit: 'Packed with vitamins A & C for immune support', emoji: '🍑' },
  { name: 'Raspberry', benefit: 'High in fiber and antioxidants for gut health', emoji: '🫐' },
  { name: 'Oats', benefit: 'Heart-healthy whole grains for sustained energy', emoji: '🌾' },
  { name: 'Goji Berry', benefit: 'Superfood with amino acids and beta-carotene', emoji: '🔴' },
];

const TRUST_BADGES = [
  { label: 'Gluten-Free', icon: '🌾' },
  { label: 'Dairy-Free', icon: '🥛' },
  { label: 'Made from Plants', icon: '🌱' },
  { label: 'No Sugar Added', icon: '🚫' },
];

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionSection({ title, children, isOpen, onToggle }: AccordionSectionProps) {
  return (
    <div style={{
      borderBottom: '1px solid rgba(255,255,255,0.1)',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 0',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#ffffff',
        }}
      >
        <span style={{
          fontSize: '14px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          {title}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          <path d="M4 6L8 10L12 6" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div style={{
        maxHeight: isOpen ? '500px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease',
      }}>
        <div style={{
          paddingBottom: '24px',
          color: '#86868b',
          fontSize: '15px',
          lineHeight: '1.7',
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const product = POPULAR_SMOOTHIES.find(p => p.id === id);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [openSections, setOpenSections] = useState({
    description: true,
    ingredients: false,
    nutrition: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!product) {
    return (
      <>
        <Navbar />
        <div style={{ 
          padding: '120px 60px', 
          textAlign: 'center',
          background: '#000000',
          color: '#ffffff',
          minHeight: '100vh',
        }}>
          <p>Product not found</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <section style={{
        background: '#000000',
        padding: 'clamp(100px, 8vw, 140px) clamp(24px, 6vw, 100px) clamp(60px, 5vw, 100px)',
        minHeight: '100vh',
      }}>
        <div className="product-main-grid" style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(40px, 5vw, 80px)',
          alignItems: 'flex-start',
        }}>
          <div>
            <div style={{
              background: '#111111',
              borderRadius: '20px',
              overflow: 'hidden',
              aspectRatio: '1/1',
              position: 'relative',
              marginBottom: '16px',
            }}>
              <img
                src={GALLERY_IMAGES[selectedImageIndex]}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'opacity 0.3s ease',
                }}
              />
            </div>
            
            <div className="thumbnail-container" style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              paddingBottom: '8px',
              WebkitOverflowScrolling: 'touch',
            }}>
              {GALLERY_IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  style={{
                    flexShrink: 0,
                    width: '72px',
                    height: '72px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: selectedImageIndex === idx ? '2px solid #E85A71' : '2px solid transparent',
                    background: '#111111',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'border-color 0.3s ease, transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="product-info-sticky" style={{
            position: 'sticky',
            top: '120px',
          }}>
            <div style={{
              display: 'inline-block',
              background: '#E85A71',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '980px',
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              marginBottom: '20px',
            }}>
              BEST SELLER
            </div>

            <h1 style={{
              fontSize: 'clamp(36px, 4vw, 52px)',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '12px',
              letterSpacing: '-0.02em',
              lineHeight: '1.1',
            }}>
              {product.name}
            </h1>

            <Link href="/collections/smoothies" style={{
              fontSize: '15px',
              color: '#E85A71',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: '16px',
              transition: 'opacity 0.3s ease',
            }}>
              Smoothie
            </Link>

            <p style={{
              fontSize: '16px',
              color: '#86868b',
              marginBottom: '20px',
              fontStyle: 'italic',
            }}>
              Inspired by: a scoop of strawberry-banana sorbet
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
            }}>
              <span style={{
                fontSize: '16px',
                color: '#E85A71',
                letterSpacing: '2px',
              }}>
                ★★★★★
              </span>
              <span style={{
                fontSize: '14px',
                color: '#86868b',
              }}>
                4,619 reviews
              </span>
            </div>

            <p style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '32px',
            }}>
              ${product.price.toFixed(2)}
            </p>

            <button style={{
              width: '100%',
              padding: '18px 40px',
              background: '#E85A71',
              color: '#ffffff',
              border: 'none',
              borderRadius: '980px',
              fontSize: '16px',
              fontWeight: '700',
              letterSpacing: '0.5px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '32px',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#d14a61';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#E85A71';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Add to Cart — ${product.price.toFixed(2)}
            </button>

            <div className="trust-badges-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              marginBottom: '40px',
            }}>
              {TRUST_BADGES.map((badge, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <span style={{ fontSize: '18px' }}>{badge.icon}</span>
                  <span style={{
                    fontSize: '13px',
                    color: '#ffffff',
                    fontWeight: '500',
                  }}>
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}>
              <AccordionSection
                title="Description"
                isOpen={openSections.description}
                onToggle={() => toggleSection('description')}
              >
                If you asked a peach what it wanted to be when it grew up, it would tell you: THIS SMOOTHIE. Sweet strawberries, bright raspberries, and a hint of tartness from goji berries round out that irresistibly juicy peach flavor. Bananas, oats, and flax seeds make the whole thing creamy and satisfying.
              </AccordionSection>

              <AccordionSection
                title="Ingredients"
                isOpen={openSections.ingredients}
                onToggle={() => toggleSection('ingredients')}
              >
                <p style={{ marginBottom: '16px' }}>
                  Organic strawberries, organic bananas, organic peaches, organic raspberries, organic gluten-free whole grain oats, organic flax seeds, organic goji berries
                </p>
                <p style={{ fontSize: '13px', color: '#6e6e73' }}>
                  All ingredients are non-GMO and sustainably sourced.
                </p>
              </AccordionSection>

              <AccordionSection
                title="Nutrition Facts"
                isOpen={openSections.nutrition}
                onToggle={() => toggleSection('nutrition')}
              >
                <div className="nutrition-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px',
                }}>
                  {[
                    { label: 'Calories', value: '140' },
                    { label: 'Total Fat', value: '1.5g' },
                    { label: 'Carbs', value: '32g' },
                    { label: 'Fiber', value: '6g' },
                    { label: 'Sugars', value: '18g' },
                    { label: 'Protein', value: '3g' },
                  ].map((item, idx) => (
                    <div key={idx} style={{
                      textAlign: 'center',
                      padding: '16px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '12px',
                    }}>
                      <p style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#ffffff',
                        marginBottom: '4px',
                      }}>
                        {item.value}
                      </p>
                      <p style={{
                        fontSize: '12px',
                        color: '#6e6e73',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </AccordionSection>
            </div>
          </div>
        </div>
      </section>

      <section style={{
        background: '#000000',
        padding: 'clamp(60px, 8vw, 100px) 0',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 clamp(24px, 6vw, 100px)',
        }}>
          <h2 style={{
            fontSize: 'clamp(28px, 3vw, 40px)',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '48px',
            letterSpacing: '-0.02em',
          }}>
            Key Ingredients
          </h2>
        </div>
        
        <div className="ingredients-scroll" style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          paddingLeft: 'clamp(24px, 6vw, 100px)',
          paddingRight: 'clamp(24px, 6vw, 100px)',
          paddingBottom: '20px',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x mandatory',
        }}>
          {KEY_INGREDIENTS.map((ingredient, idx) => (
            <div
              key={idx}
              style={{
                flexShrink: 0,
                width: '240px',
                background: '#111111',
                borderRadius: '20px',
                padding: '28px 24px',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.3s ease',
                scrollSnapAlign: 'start',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(232,90,113,0.4)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{
                fontSize: '48px',
                display: 'block',
                marginBottom: '16px',
              }}>
                {ingredient.emoji}
              </span>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '8px',
              }}>
                {ingredient.name}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#86868b',
                lineHeight: '1.5',
              }}>
                {ingredient.benefit}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{
        background: '#000000',
        padding: 'clamp(60px, 8vw, 100px) clamp(24px, 6vw, 100px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          <h2 style={{
            fontSize: 'clamp(28px, 3vw, 40px)',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '48px',
            letterSpacing: '-0.02em',
          }}>
            How to Prep
          </h2>
          
          <div className="prep-steps-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
          }}>
            {[
              { step: '1', title: 'Add Liquid', desc: 'Pour 8-12 oz of your favorite milk or water into a blender' },
              { step: '2', title: 'Empty Cup', desc: 'Add the entire contents of your frozen smoothie cup' },
              { step: '3', title: 'Blend', desc: 'Blend until smooth and creamy. Enjoy immediately!' },
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start',
              }}>
                <div style={{
                  flexShrink: 0,
                  width: '48px',
                  height: '48px',
                  background: '#E85A71',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#ffffff',
                }}>
                  {item.step}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '8px',
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: '15px',
                    color: '#86868b',
                    lineHeight: '1.6',
                  }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{
        background: '#000000',
        padding: 'clamp(60px, 8vw, 100px) clamp(24px, 6vw, 100px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '48px',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <h2 style={{
              fontSize: 'clamp(28px, 3vw, 40px)',
              fontWeight: '700',
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}>
              You Might Also Like
            </h2>
            <Link href="/collections/smoothies" style={{
              fontSize: '14px',
              color: '#E85A71',
              textDecoration: 'none',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'gap 0.3s ease',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.gap = '12px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.gap = '8px';
              }}
            >
              View All
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="#E85A71" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
          
          <div className="related-products-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '24px',
          }}>
            {POPULAR_SMOOTHIES.filter(p => p.id !== id).slice(0, 4).map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/products/${relatedProduct.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  background: '#111111',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.06)',
                  aspectRatio: '1/1',
                  marginBottom: '16px',
                }}>
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '8px',
                }}>
                  {relatedProduct.name}
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                }}>
                  <span style={{
                    fontSize: '12px',
                    color: '#E85A71',
                    letterSpacing: '1px',
                  }}>
                    ★★★★★
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: '#6e6e73',
                  }}>
                    4,000+ reviews
                  </span>
                </div>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#ffffff',
                }}>
                  ${relatedProduct.price.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .thumbnail-container::-webkit-scrollbar,
        .ingredients-scroll::-webkit-scrollbar {
          display: none;
        }
        
        .thumbnail-container,
        .ingredients-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @media (max-width: 900px) {
          .product-main-grid {
            grid-template-columns: 1fr !important;
          }
          
          .product-info-sticky {
            position: relative !important;
            top: 0 !important;
          }
          
          .trust-badges-grid {
            grid-template-columns: 1fr !important;
          }
          
          .nutrition-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        @media (max-width: 600px) {
          .prep-steps-grid {
            grid-template-columns: 1fr !important;
          }
          
          .related-products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        @media (max-width: 400px) {
          .related-products-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
