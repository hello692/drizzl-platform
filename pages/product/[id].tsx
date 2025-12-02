import { useRouter } from 'next/router';
import Link from 'next/link';
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
  },
};

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const product = id ? smoothies[id as string] : null;

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
              {/* Category Link */}
              <Link href="/products/smoothies" style={{ fontSize: '13px', color: '#666', textDecoration: 'underline', marginBottom: '16px', display: 'block' }}>
                Smoothie
              </Link>

              {/* Product Name */}
              <h1 style={{
                fontSize: '48px',
                fontWeight: '700',
                margin: '0 0 12px 0',
                letterSpacing: '-0.8px',
              }}>
                {product.name}
              </h1>

              {/* Tagline */}
              <p style={{
                fontSize: '16px',
                color: '#666',
                margin: '0 0 20px 0',
                fontStyle: 'italic',
              }}>
                {product.tagline}
              </p>

              {/* Rating */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '32px',
                fontSize: '14px',
              }}>
                <span>{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
                <span style={{ color: '#666' }}>{product.reviews.toLocaleString()} reviews</span>
              </div>

              {/* Price Section */}
              <div style={{
                borderBottom: '1px solid #e8e8e8',
                paddingBottom: '28px',
                marginBottom: '28px',
              }}>
                <p style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  margin: '0 0 16px 0',
                }}>
                  ${product.price.toFixed(2)}
                </p>

                {/* Subscribe & Save */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', cursor: 'pointer' }}>
                  <input type="radio" defaultChecked style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>Subscribe & Save</span>
                </label>
                <p style={{ fontSize: '13px', color: '#666', margin: '0' }}>Get $35 off your next order over $100*</p>
              </div>

              {/* Add to Cart Button */}
              <button style={{
                width: '100%',
                padding: '18px 24px',
                background: '#000',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0px',
                fontSize: '14px',
                fontWeight: '700',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                marginBottom: '32px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
              >
                Add to cart
              </button>

              {/* Attributes */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
              }}>
                {product.attributes.map((attr: string, idx: number) => (
                  <div key={idx} style={{
                    background: '#f9f9f9',
                    padding: '16px',
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: '600',
                    letterSpacing: '0.5px',
                  }}>
                    ✓ {attr}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Description & Details Section */}
          <div style={{
            borderTop: '1px solid #e8e8e8',
            paddingTop: '60px',
            marginBottom: '100px',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '60px',
            }}>
              {/* Left: Description & Ingredients */}
              <div>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '16px',
                  letterSpacing: '-0.3px',
                }}>
                  Description
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: '#424245',
                  lineHeight: '1.8',
                  letterSpacing: '-0.2px',
                  marginBottom: '40px',
                }}>
                  {product.description}
                </p>

                <h3 style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '12px',
                }}>
                  All Ingredients
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#424245',
                  lineHeight: '1.7',
                  letterSpacing: '-0.2px',
                }}>
                  {product.ingredients.join(', ')}.
                </p>
              </div>

              {/* Right: Nutrition */}
              <div>
                <h3 style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '20px',
                }}>
                  Nutrition Facts
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '20px',
                }}>
                  {Object.entries(product.nutrition).map(([key, value]: [string, any]) => (
                    <div key={key}>
                      <p style={{
                        fontSize: '12px',
                        color: '#79747e',
                        textTransform: 'capitalize',
                        marginBottom: '4px',
                      }}>
                        {key}
                      </p>
                      <p style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        margin: 0,
                      }}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Key Ingredients */}
          <div style={{
            background: '#f9f9fa',
            padding: '60px',
            borderRadius: '4px',
            marginBottom: '100px',
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '40px',
              letterSpacing: '-0.5px',
            }}>
              Key Ingredients
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '40px',
            }}>
              {product.keyIngredients.map((ing: any, idx: number) => (
                <div key={idx}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    marginBottom: '8px',
                    letterSpacing: '-0.3px',
                  }}>
                    {ing.name}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#424245',
                    lineHeight: '1.6',
                    letterSpacing: '-0.2px',
                  }}>
                    {ing.description}
                  </p>
                </div>
              ))}
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
