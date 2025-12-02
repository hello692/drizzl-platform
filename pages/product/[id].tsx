import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const smoothies: { [key: string]: any } = {
  '1': {
    id: '1',
    name: 'Strawberry + Peach',
    tagline: 'Inspired by a scoop of strawberry-banana sorbet',
    price: 8.49,
    reviews: 4619,
    rating: 4.5,
    badge: 'BEST SELLER',
    image: 'https://daily-harvest.com/cdn/shop/files/strawberry-peach-smoothie-daily-harvest-3657974.jpg?v=1760509351&width=2048',
    description: 'If you asked a peach what it wanted to be when it grew up, it would tell you: THIS SMOOTHIE. Sweet strawberries, bright raspberries, and a hint of tartness from goji berries round out that irresistibly juicy peach flavor. Bananas, oats, and flax seeds make the whole thing creamy and satisfying.',
    ingredients: ['organic strawberries', 'organic bananas', 'organic peaches', 'organic raspberries', 'organic gluten-free whole grain oats', 'organic flax seeds', 'organic goji berries'],
    nutrition: {
      calories: '140',
      fat: '1.5g',
      carbs: '32g',
      fiber: '6g',
      protein: '3g',
      sugars: '18g',
    },
    attributes: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'No Sugar Added'],
    keyIngredients: [
      { name: 'Strawberry', description: 'One cup of strawberries is high in antioxidant vitamin C and provides a good source of fiber, copper and folate.' },
      { name: 'Banana', description: 'One large banana is rich in vitamin B6 and provides a good source of potassium, fiber and antioxidant vitamin C.' },
      { name: 'Peach', description: 'A peach is a good source of vitamin C, an antioxidant that protects essential molecules and supports the immune system.' },
      { name: 'Raspberry', description: 'A cup of raspberries is high in digestion supporting fiber and antioxidant vitamin C.' },
    ],
    prepSteps: [
      'Fill cup to top with your preferred liquid (any liquid works, but we\'d go with an option like water or coconut water).',
      'Pour into a blender and blend.',
      'Pour back into your cup and enjoy.',
    ],
  },
  '2': {
    id: '2',
    name: 'Strawberry Banana Protein',
    tagline: 'Creamy strawberry with plant-based protein',
    price: 9.49,
    reviews: 48,
    rating: 4.5,
    badge: 'NEW',
    image: 'https://daily-harvest.com/cdn/shop/files/strawberry-banana-protein-smoothie-daily-harvest-3370693.jpg?v=1760509314&width=2048',
    description: 'A delicious blend of strawberries and bananas with plant-based protein to keep you satisfied throughout the day.',
    ingredients: ['organic strawberries', 'organic bananas', 'organic pea protein', 'organic oats', 'organic vanilla extract'],
    nutrition: { calories: '180', fat: '1g', carbs: '28g', fiber: '5g', protein: '18g', sugars: '12g' },
    attributes: ['Gluten-Free', 'Dairy-Free', 'Made from Plants'],
    keyIngredients: [
      { name: 'Strawberry', description: 'High in antioxidant vitamin C and provides a good source of fiber.' },
      { name: 'Banana', description: 'Rich in vitamin B6 and potassium.' },
    ],
    prepSteps: [
      'Fill cup to top with your preferred liquid (any liquid works, but we\'d go with an option like water or coconut water).',
      'Pour into a blender and blend.',
      'Pour back into your cup and enjoy.',
    ],
  },
  '3': {
    id: '3',
    name: 'Tropical Greens Protein',
    tagline: 'Tropical fruits with plant-based protein and greens',
    price: 9.49,
    reviews: 43,
    rating: 4.5,
    badge: 'NEW',
    image: 'https://daily-harvest.com/cdn/shop/files/tropical-greens-protein-smoothie-daily-harvest-8021323.jpg?v=1760509314&width=2048',
    description: 'A refreshing blend of tropical fruits with nutrient-rich greens and plant-based protein.',
    ingredients: ['organic mango', 'organic pineapple', 'organic spinach', 'organic kale', 'organic pea protein'],
    nutrition: { calories: '160', fat: '0.5g', carbs: '30g', fiber: '6g', protein: '15g', sugars: '16g' },
    attributes: ['Gluten-Free', 'Dairy-Free', 'Made from Plants'],
    keyIngredients: [
      { name: 'Mango', description: 'Rich in vitamins A and C, supporting vision and immune health.' },
      { name: 'Spinach', description: 'Packed with iron and other essential minerals.' },
    ],
    prepSteps: [
      'Fill cup to top with your preferred liquid (any liquid works, but we\'d go with an option like water or coconut water).',
      'Pour into a blender and blend.',
      'Pour back into your cup and enjoy.',
    ],
  },
};

const AccordionSection = ({ title, content, defaultOpen = false }: { title: string; content: React.ReactNode; defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{
      borderBottom: '1px solid #e8e8e8',
      paddingBottom: '24px',
      marginBottom: '24px',
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'none',
          border: 'none',
          padding: '0',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          letterSpacing: '-0.3px',
        }}
      >
        <span>{title}</span>
        <span style={{
          fontSize: '20px',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          ↓
        </span>
      </button>
      {isOpen && (
        <div style={{
          marginTop: '16px',
          fontSize: '14px',
          color: '#424245',
          lineHeight: '1.7',
          letterSpacing: '-0.2px',
        }}>
          {content}
        </div>
      )}
    </div>
  );
};

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const product = id ? smoothies[id as string] : null;
  const [selectedIngredient, setSelectedIngredient] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useState<HTMLDivElement | null>(null)[0];

  if (!product) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '60vh', padding: '60px 40px', textAlign: 'center' }}>
          <h1>Product not found</h1>
        </div>
        <Footer />
      </>
    );
  }

  const relatedProducts = Object.values(smoothies).filter((p: any) => p.id !== product.id).slice(0, 3);

  return (
    <>
      <Navbar />
      <div style={{ background: '#ffffff', padding: '60px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Product Header with Badge */}
          <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            {product.badge && (
              <div style={{
                background: '#ffffff',
                border: '2px solid #000',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '800',
                letterSpacing: '1px',
              }}>
                {product.badge}
              </div>
            )}
          </div>

          {/* Main Product Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', marginBottom: '100px' }}>
            {/* Left: Product Image */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  height: 'auto',
                  borderRadius: '0px',
                }}
              />
            </div>

            {/* Right: Product Details */}
            <div>
              {/* Category */}
              <p style={{
                fontSize: '13px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                margin: '0 0 16px 0',
                color: '#000',
              }}>
                Smoothie
              </p>

              {/* Product Name */}
              <h1 style={{
                fontSize: '56px',
                fontWeight: '900',
                margin: '0 0 16px 0',
                letterSpacing: '-1px',
                textTransform: 'uppercase',
              }}>
                {product.name}
              </h1>

              {/* Tagline */}
              <p style={{
                fontSize: '14px',
                color: '#000',
                margin: '0 0 28px 0',
                fontWeight: '500',
                letterSpacing: '-0.2px',
              }}>
                <span style={{ fontWeight: '700' }}>Inspired by:</span> {product.tagline.replace('Inspired by a scoop of ', '')}
              </p>

              {/* Rating */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '28px',
                fontSize: '14px',
              }}>
                <span style={{ fontSize: '20px' }}>{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
                <span style={{ color: '#424245', fontWeight: '500' }}>{product.reviews.toLocaleString()} reviews</span>
              </div>

              {/* Add to Cart Button */}
              <button style={{
                width: '100%',
                padding: '20px 24px',
                background: '#000',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0px',
                fontSize: '13px',
                fontWeight: '700',
                letterSpacing: '0.8px',
                cursor: 'pointer',
                marginBottom: '32px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textTransform: 'uppercase',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
              >
                ADD TO CART ${product.price.toFixed(2)}
              </button>

              {/* Attributes - Single Row */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
                justifyContent: 'flex-start',
              }}>
                {product.attributes.map((attr: string, idx: number) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#000',
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M7 12l2.5 2.5 4-5"></path>
                    </svg>
                    <span>{attr}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Collapsible Accordion Section */}
          <div style={{
            borderTop: '1px solid #e8e8e8',
            paddingTop: '40px',
            marginBottom: '100px',
          }}>
            <AccordionSection
              title="Description"
              content={<p style={{ margin: 0 }}>{product.description}</p>}
              defaultOpen={false}
            />
            <AccordionSection
              title="All ingredients"
              content={<p style={{ margin: 0 }}>{product.ingredients.join(', ')}.</p>}
              defaultOpen={false}
            />
            <AccordionSection
              title="Nutrition facts"
              content={
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '24px',
                }}>
                  {Object.entries(product.nutrition).map(([key, value]: [string, any]) => (
                    <div key={key}>
                      <p style={{
                        fontSize: '12px',
                        color: '#79747e',
                        textTransform: 'capitalize',
                        marginBottom: '4px',
                        margin: 0,
                      }}>
                        {key}
                      </p>
                      <p style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        margin: 0,
                      }}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              }
              defaultOpen={false}
            />
            <AccordionSection
              title="About Drizzl Wellness"
              content={
                <p style={{ margin: 0 }}>
                  Drizzl Wellness makes pre-portioned food built on organic fruits and vegetables that arrives frozen at your doorstep—so all you have to make is a good decision. No prep, no mess, no stress and ready in minutes.
                </p>
              }
              defaultOpen={true}
            />
          </div>

          {/* Key Ingredients */}
          <div style={{
            background: '#ffffff',
            marginBottom: '100px',
            borderTop: '1px solid #e8e8e8',
            paddingTop: '60px',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '60px',
              alignItems: 'flex-start',
            }}>
              {/* Left: Image */}
              <div style={{
                background: '#f0f0f0',
                borderRadius: '0px',
                height: '350px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <img
                  src="https://daily-harvest.com/cdn/shop/files/DH_Shopify_KeyIngredient_688x458-Smoothies_A04.jpg?v=1715720942"
                  alt="Key ingredients"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Right: Content */}
              <div>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '16px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}>
                  Key Ingredients
                </h2>

                {/* Tabs */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '32px',
                  paddingBottom: '20px',
                  borderBottom: '1px solid #e8e8e8',
                  flexWrap: 'wrap',
                }}>
                  {product.keyIngredients.map((ing: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedIngredient(idx)}
                      style={{
                        background: selectedIngredient === idx ? '#000' : '#ffffff',
                        color: selectedIngredient === idx ? '#ffffff' : '#000',
                        border: selectedIngredient === idx ? 'none' : '1px solid #e8e8e8',
                        padding: '6px 14px',
                        fontSize: '12px',
                        fontWeight: '600',
                        letterSpacing: '0.5px',
                        cursor: 'pointer',
                        borderRadius: '0px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedIngredient !== idx) {
                          e.currentTarget.style.borderColor = '#000';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedIngredient !== idx) {
                          e.currentTarget.style.borderColor = '#e8e8e8';
                        }
                      }}
                    >
                      {ing.name}
                    </button>
                  ))}
                </div>

                {/* Two-Column Grid with Arrows */}
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                }}>
                  {/* Left Arrow */}
                  <button
                    onClick={() => {
                      setSelectedIngredient(Math.max(0, selectedIngredient - 2));
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '18px',
                      cursor: selectedIngredient > 0 ? 'pointer' : 'default',
                      color: '#000',
                      opacity: selectedIngredient > 0 ? 0.6 : 0.2,
                      transition: 'opacity 0.2s',
                      padding: '0',
                      flex: 0,
                    }}
                    onMouseEnter={(e) => {
                      if (selectedIngredient > 0) e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      if (selectedIngredient > 0) e.currentTarget.style.opacity = '0.6';
                    }}
                    disabled={selectedIngredient === 0}
                  >
                    ←
                  </button>

                  {/* Cards Container */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    flex: 1,
                  }}>
                    {product.keyIngredients.slice(selectedIngredient, selectedIngredient + 2).map((ing: any, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          border: '1px solid #e8e8e8',
                          padding: '20px',
                          backgroundColor: '#ffffff',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#000';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e8e8e8';
                        }}
                      >
                        <h3 style={{
                          fontSize: '15px',
                          fontWeight: '700',
                          marginBottom: '10px',
                          letterSpacing: '-0.2px',
                          margin: '0 0 10px 0',
                        }}>
                          {ing.name}
                        </h3>
                        <p style={{
                          fontSize: '13px',
                          color: '#424245',
                          lineHeight: '1.5',
                          letterSpacing: '-0.2px',
                          margin: 0,
                        }}>
                          {ing.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Right Arrow */}
                  <button
                    onClick={() => {
                      setSelectedIngredient(Math.min(product.keyIngredients.length - 2, selectedIngredient + 2));
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '18px',
                      cursor: selectedIngredient < product.keyIngredients.length - 2 ? 'pointer' : 'default',
                      color: '#000',
                      opacity: selectedIngredient < product.keyIngredients.length - 2 ? 0.6 : 0.2,
                      transition: 'opacity 0.2s',
                      padding: '0',
                      flex: 0,
                    }}
                    onMouseEnter={(e) => {
                      if (selectedIngredient < product.keyIngredients.length - 2) e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      if (selectedIngredient < product.keyIngredients.length - 2) e.currentTarget.style.opacity = '0.6';
                    }}
                    disabled={selectedIngredient >= product.keyIngredients.length - 2}
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* How to Prep */}
          <div style={{
            background: '#ffffff',
            borderTop: '1px solid #e8e8e8',
            paddingTop: '60px',
            marginBottom: '100px',
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '40px',
              letterSpacing: '-0.5px',
              textTransform: 'uppercase',
            }}>
              How to Prep
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '60px',
              alignItems: 'center',
            }}>
              {/* Left: Image placeholder */}
              <div style={{
                background: '#f0f0f0',
                borderRadius: '0px',
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <img
                  src="https://daily-harvest.com/cdn/shop/files/Smoothie_Blending_6.gif?v=1762142309&width=460"
                  alt="How to prep"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Right: Steps */}
              <div>
                {product.prepSteps.map((step: string, idx: number) => (
                  <div key={idx} style={{
                    display: 'flex',
                    gap: '20px',
                    marginBottom: idx !== product.prepSteps.length - 1 ? '28px' : 0,
                  }}>
                    <div style={{
                      background: '#000',
                      color: '#ffffff',
                      width: '36px',
                      height: '36px',
                      minWidth: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: '700',
                    }}>
                      {idx + 1}
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: '#424245',
                      lineHeight: '1.7',
                      letterSpacing: '-0.2px',
                      margin: 0,
                      paddingTop: '8px',
                    }}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div style={{
              borderTop: '1px solid #e8e8e8',
              paddingTop: '60px',
            }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '40px',
                letterSpacing: '-0.5px',
              }}>
                You Might Also Like
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '40px',
              }}>
                {relatedProducts.map((relProduct: any) => (
                  <Link key={relProduct.id} href={`/product/${relProduct.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{
                        background: '#ffffff',
                        borderRadius: '0px',
                        overflow: 'hidden',
                        border: '1px solid #e8e8e8',
                        marginBottom: '20px',
                        aspectRatio: '1',
                      }}>
                        <img
                          src={relProduct.image}
                          alt={relProduct.name}
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
                        marginBottom: '8px',
                        letterSpacing: '-0.3px',
                      }}>
                        {relProduct.name}
                      </h3>
                      <p style={{
                        fontSize: '14px',
                        color: '#79747e',
                        marginBottom: '8px',
                        letterSpacing: '-0.2px',
                      }}>
                        {'★'.repeat(Math.floor(relProduct.rating))}{'☆'.repeat(5 - Math.floor(relProduct.rating))} {relProduct.reviews.toLocaleString()} reviews
                      </p>
                      <p style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        letterSpacing: '-0.3px',
                      }}>
                        ${relProduct.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
