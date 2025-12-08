import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// Apple-inspired design tokens (light theme - monochrome)
const apple = {
  bgPrimary: '#ffffff',
  bgSecondary: '#f5f5f7',
  bgTertiary: '#e8e8ed',
  textPrimary: '#000000',
  textSecondary: '#6e6e73',
  textTertiary: '#86868b',
  accent: '#000000',
  accentHover: '#1d1d1f',
  divider: 'rgba(0,0,0,0.1)',
};

interface ProductData {
  id: string;
  name: string;
  price: number;
  image: string;
  shortDescription: string;
  tagline: string;
  rating: { average: number; count: number };
  gallery: string[];
  description: string;
  ingredients: string;
  nutrition: { label: string; value: string }[];
  keyIngredients: { name: string; benefit: string; image: string }[];
  badges: string[];
}

const PRODUCT_DATA: Record<string, ProductData> = {
  '1': {
    id: '1',
    name: 'Strawberry + Peach',
    price: 8.49,
    image: '/products/strawberry-peach/main-product.png',
    shortDescription: 'Creamy strawberry bliss',
    tagline: 'a scoop of strawberry-banana sorbet',
    rating: { average: 4.5, count: 4619 },
    gallery: [
      '/products/strawberry-peach/main-product.png',
      '/products/strawberry-peach/transparent-glass-1.png',
      '/products/strawberry-peach/transparent-glass-2.png',
      '/products/strawberry-peach/lifestyle-1.jpg',
    ],
    description: 'If you asked a peach what it wanted to be when it grew up, it would tell you: THIS SMOOTHIE. Sweet strawberries, bright raspberries, and a hint of tartness from goji berries round out that irresistibly juicy peach flavor. Bananas, oats, and flax seeds make the whole thing creamy and satisfying.',
    ingredients: 'organic strawberries, organic bananas, organic peaches, organic raspberries, organic gluten-free whole grain oats, organic flax seeds, organic goji berries',
    nutrition: [
      { label: 'Calories', value: '140' },
      { label: 'Total Fat', value: '1.5g' },
      { label: 'Carbs', value: '32g' },
      { label: 'Fiber', value: '6g' },
      { label: 'Sugars', value: '18g' },
      { label: 'Protein', value: '3g' },
    ],
    keyIngredients: [
      { name: 'Strawberry', benefit: 'One cup of strawberries is high in antioxidant vitamin C and provides a good source of fiber, copper and folate.', image: '/ingredients/strawberry.png' },
      { name: 'Banana', benefit: 'One large banana is a good source of potassium and vitamin C.', image: '/ingredients/banana.png' },
      { name: 'Peach', benefit: 'Peaches are rich in vitamins A and C, supporting immune health and glowing skin.', image: '/ingredients/peach.png' },
      { name: 'Raspberry', benefit: 'Raspberries are high in fiber and antioxidants for gut and heart health.', image: '/ingredients/raspberry.png' },
      { name: 'Oats', benefit: 'Oats provide heart-healthy whole grains for sustained energy throughout the day.', image: '/ingredients/oats.png' },
      { name: 'Goji Berry', benefit: 'Goji berries are a superfood rich in amino acids and beta-carotene.', image: '/ingredients/goji.png' },
    ],
    badges: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'No Sugar Added'],
  },
  '9': {
    id: '9',
    name: 'Pink Piyata',
    price: 8.99,
    image: '/products/pink-piyata/transparent-glass-1.png',
    shortDescription: 'Tropical dragon fruit',
    tagline: 'a tropical paradise in every sip',
    rating: { average: 4.8, count: 3842 },
    gallery: [
      '/products/pink-piyata/transparent-glass-1.png',
      '/products/pink-piyata/transparent-glass-2.png',
      '/products/pink-piyata/transparent-glass-3.png',
      '/products/pink-piyata/lifestyle-1.jpg',
    ],
    description: 'Transport yourself to a tropical oasis with every sip. Vibrant dragon fruit meets sweet pineapple and creamy coconut for a smoothie that tastes like vacation. Packed with antioxidants and natural electrolytes to keep you feeling refreshed and energized.',
    ingredients: 'organic dragon fruit, organic pineapple, organic coconut cream, organic banana, organic mango, organic chia seeds',
    nutrition: [
      { label: 'Calories', value: '160' },
      { label: 'Total Fat', value: '3g' },
      { label: 'Carbs', value: '28g' },
      { label: 'Fiber', value: '5g' },
      { label: 'Sugars', value: '16g' },
      { label: 'Protein', value: '2g' },
    ],
    keyIngredients: [
      { name: 'Dragon Fruit', benefit: 'Rich in antioxidants and supports healthy digestion with prebiotics.', image: '/ingredients/dragonfruit.png' },
      { name: 'Pineapple', benefit: 'Contains bromelain for digestive health and vitamin C for immunity.', image: '/ingredients/pineapple.png' },
      { name: 'Coconut', benefit: 'Natural electrolytes for hydration and healthy medium-chain fats.', image: '/ingredients/coconut.png' },
      { name: 'Mango', benefit: 'High in vitamin C and beta-carotene for skin and eye health.', image: '/ingredients/mango.png' },
      { name: 'Banana', benefit: 'Natural energy boost with potassium for muscle recovery.', image: '/ingredients/banana.png' },
      { name: 'Chia Seeds', benefit: 'Omega-3 fatty acids and plant-based protein for sustained energy.', image: '/ingredients/chia.png' },
    ],
    badges: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'No Sugar Added'],
  },
  '10': {
    id: '10',
    name: 'Matcha',
    price: 9.49,
    image: '/products/matcha/transparent-glass-1.png',
    shortDescription: 'Zen in a cup',
    tagline: 'calm focus meets creamy indulgence',
    rating: { average: 4.7, count: 2156 },
    gallery: [
      '/products/matcha/transparent-glass-1.png',
      '/products/matcha/transparent-glass-2.png',
      '/products/matcha/transparent-glass-3.png',
      '/products/matcha/lifestyle-1.jpg',
    ],
    description: 'Find your zen with this ceremonial-grade matcha blend. The earthy sweetness of premium Japanese matcha is perfectly balanced with creamy banana and a hint of vanilla. A gentle caffeine boost without the jitters, plus L-theanine for calm, focused energy.',
    ingredients: 'organic ceremonial matcha, organic banana, organic almond butter, organic vanilla extract, organic spinach, organic hemp seeds',
    nutrition: [
      { label: 'Calories', value: '180' },
      { label: 'Total Fat', value: '6g' },
      { label: 'Carbs', value: '24g' },
      { label: 'Fiber', value: '4g' },
      { label: 'Sugars', value: '12g' },
      { label: 'Protein', value: '5g' },
    ],
    keyIngredients: [
      { name: 'Matcha', benefit: 'L-theanine for calm, focused energy without the jitters.', image: '/ingredients/matcha.png' },
      { name: 'Banana', benefit: 'Natural sweetness and creaminess with potassium.', image: '/ingredients/banana.png' },
      { name: 'Almond Butter', benefit: 'Healthy fats and protein for sustained satiety.', image: '/ingredients/almond.png' },
      { name: 'Spinach', benefit: 'Iron and vitamins for energy without changing the taste.', image: '/ingredients/spinach.png' },
      { name: 'Hemp Seeds', benefit: 'Complete plant protein source with all essential amino acids.', image: '/ingredients/hemp.png' },
      { name: 'Vanilla', benefit: 'Natural mood enhancer with calming aromatherapy benefits.', image: '/ingredients/vanilla.png' },
    ],
    badges: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'Caffeine'],
  },
  '14': {
    id: '14',
    name: 'Coffee Mushroom',
    price: 9.99,
    image: '/products/coffee-mushroom/transparent-glass-1.png',
    shortDescription: 'Adaptogenic energy',
    tagline: 'your morning coffee evolved',
    rating: { average: 4.6, count: 1893 },
    gallery: [
      '/products/coffee-mushroom/transparent-glass-1.png',
      '/products/coffee-mushroom/transparent-glass-2.png',
      '/products/coffee-mushroom/transparent-glass-3.png',
      '/products/coffee-mushroom/lifestyle-1.jpg',
    ],
    description: 'Your morning coffee just got a serious upgrade. Cold brew meets adaptogenic mushrooms for sustained energy without the crash. Lions mane for focus, chaga for immunity, and reishi for stress relief. Blended with creamy oat milk and a touch of maple.',
    ingredients: 'organic cold brew coffee, organic lions mane mushroom, organic chaga mushroom, organic reishi mushroom, organic oat milk, organic maple syrup, organic cacao',
    nutrition: [
      { label: 'Calories', value: '120' },
      { label: 'Total Fat', value: '3g' },
      { label: 'Carbs', value: '18g' },
      { label: 'Fiber', value: '3g' },
      { label: 'Sugars', value: '8g' },
      { label: 'Protein', value: '4g' },
    ],
    keyIngredients: [
      { name: 'Cold Brew', benefit: 'Smooth, less acidic caffeine boost for steady energy.', image: '/ingredients/coffee.png' },
      { name: 'Lions Mane', benefit: 'Supports focus, memory, and cognitive function.', image: '/ingredients/lionsmane.png' },
      { name: 'Chaga', benefit: 'Powerful immune system support and antioxidants.', image: '/ingredients/chaga.png' },
      { name: 'Reishi', benefit: 'Adaptogenic mushroom for stress relief and calm.', image: '/ingredients/reishi.png' },
      { name: 'Oat Milk', benefit: 'Creamy texture with heart-healthy fiber.', image: '/ingredients/oatmilk.png' },
      { name: 'Cacao', benefit: 'Mood-boosting antioxidants and natural magnesium.', image: '/ingredients/cacao.png' },
    ],
    badges: ['Gluten-Free', 'Dairy-Free', 'Adaptogenic', 'Caffeine'],
  },
  '17': {
    id: '17',
    name: 'Acai',
    price: 9.49,
    image: '/products/acai/Acai-TG-1.jpg',
    shortDescription: 'Amazonian superfruit',
    tagline: 'the Amazon in a cup',
    rating: { average: 4.9, count: 5234 },
    gallery: [
      '/products/acai/Acai-TG-1.jpg',
      '/products/acai/Acai-TG-2.jpg',
      '/products/acai/Acai-TG-3.jpg',
      '/products/acai/lifestyle-1.jpg',
    ],
    description: 'The legendary Amazonian superfruit takes center stage in this antioxidant-rich blend. Wild-harvested acai berries combined with mixed berries, banana, and a hint of guarana for natural energy. Deep purple, deeply delicious, deeply nutritious.',
    ingredients: 'organic acai berries, organic blueberries, organic banana, organic strawberries, organic guarana, organic hemp hearts, organic coconut water',
    nutrition: [
      { label: 'Calories', value: '170' },
      { label: 'Total Fat', value: '4g' },
      { label: 'Carbs', value: '30g' },
      { label: 'Fiber', value: '7g' },
      { label: 'Sugars', value: '14g' },
      { label: 'Protein', value: '3g' },
    ],
    keyIngredients: [
      { name: 'Acai', benefit: 'One of the most antioxidant-rich fruits on earth for cellular health.', image: '/ingredients/acai.png' },
      { name: 'Blueberries', benefit: 'Brain-boosting antioxidants for cognitive function.', image: '/ingredients/blueberry.png' },
      { name: 'Guarana', benefit: 'Natural, sustained energy boost without the crash.', image: '/ingredients/guarana.png' },
      { name: 'Banana', benefit: 'Creamy texture and natural sweetness with potassium.', image: '/ingredients/banana.png' },
      { name: 'Hemp Hearts', benefit: 'Complete protein and omega fatty acids for heart health.', image: '/ingredients/hemp.png' },
      { name: 'Coconut Water', benefit: 'Natural hydration and electrolytes for recovery.', image: '/ingredients/coconutwater.png' },
    ],
    badges: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'Superfood'],
  },
  '12': {
    id: '12',
    name: 'Nutty Monkey',
    price: 8.99,
    image: '/products/nutty-monkey/transparent-glass-1.png',
    shortDescription: 'Creamy peanut butter',
    tagline: 'the classic combo perfected',
    rating: { average: 4.8, count: 3567 },
    gallery: [
      '/products/nutty-monkey/transparent-glass-1.png',
      '/products/nutty-monkey/transparent-glass-2.png',
      '/products/nutty-monkey/transparent-glass-3.png',
      '/products/nutty-monkey/lifestyle-1.jpg',
    ],
    description: 'The beloved peanut butter and banana combo, elevated to smoothie perfection. Creamy organic peanut butter meets ripe bananas, a touch of cacao, and a drizzle of honey. Protein-packed and utterly satisfying for breakfast or post-workout fuel.',
    ingredients: 'organic peanut butter, organic banana, organic cacao nibs, organic honey, organic oat milk, organic vanilla, organic flax seeds',
    nutrition: [
      { label: 'Calories', value: '280' },
      { label: 'Total Fat', value: '14g' },
      { label: 'Carbs', value: '32g' },
      { label: 'Fiber', value: '5g' },
      { label: 'Sugars', value: '16g' },
      { label: 'Protein', value: '10g' },
    ],
    keyIngredients: [
      { name: 'Peanut Butter', benefit: 'Rich in protein and healthy fats for lasting satiety.', image: '/ingredients/peanutbutter.png' },
      { name: 'Banana', benefit: 'Natural sweetness and potassium for muscle recovery.', image: '/ingredients/banana.png' },
      { name: 'Cacao', benefit: 'Mood-boosting antioxidants and natural magnesium.', image: '/ingredients/cacao.png' },
      { name: 'Honey', benefit: 'Natural sweetener with antibacterial properties.', image: '/ingredients/honey.png' },
      { name: 'Oat Milk', benefit: 'Creamy texture with heart-healthy beta-glucan fiber.', image: '/ingredients/oatmilk.png' },
      { name: 'Flax Seeds', benefit: 'Omega-3 fatty acids for brain and heart health.', image: '/ingredients/flax.png' },
    ],
    badges: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'High Protein'],
  },
};

const POPULAR_SMOOTHIES = [
  { id: '1', name: 'Strawberry + Peach', price: 8.49, image: '/products/strawberry-peach/main-product.png' },
  { id: '9', name: 'Pink Piyata', price: 8.99, image: '/products/pink-piyata/transparent-glass-1.png' },
  { id: '10', name: 'Matcha', price: 9.49, image: '/products/matcha/transparent-glass-1.png' },
  { id: '14', name: 'Coffee Mushroom', price: 9.99, image: '/products/coffee-mushroom/transparent-glass-1.png' },
  { id: '17', name: 'Acai', price: 9.49, image: '/products/acai/Acai-TG-1.jpg' },
  { id: '12', name: 'Nutty Monkey', price: 8.99, image: '/products/nutty-monkey/transparent-glass-1.png' },
];

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const productId = typeof id === 'string' ? id : '';
  const productData = PRODUCT_DATA[productId];
  const product = POPULAR_SMOOTHIES.find(p => p.id === productId);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [openSections, setOpenSections] = useState({
    description: false,
    ingredients: false,
    nutrition: false,
    keyIngredients: false,
    howToPrep: false,
  });
  const [selectedIngredient, setSelectedIngredient] = useState(0);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!product || !productData) {
    return (
      <div style={{ backgroundColor: apple.bgPrimary, minHeight: '100vh' }}>
        <Navbar />
        <div style={{ padding: '200px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '600', color: apple.textPrimary, marginBottom: '24px' }}>
            Product not found
          </h1>
          <Link href="/collections/smoothies" style={{ 
            color: apple.accent, 
            fontSize: '21px',
            textDecoration: 'none',
          }}>
            Back to Smoothies &rarr;
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: apple.bgPrimary, 
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
    }}>
      <Navbar />
      
      <main>
        {/* Hero Product Section - Apple Style Full Width */}
        <section style={{
          paddingTop: '120px',
          paddingBottom: '80px',
          textAlign: 'center',
        }}>
          {/* Product Name - Large Apple Typography */}
          <h1 style={{
            fontSize: 'clamp(48px, 8vw, 80px)',
            fontWeight: '600',
            color: apple.textPrimary,
            margin: '0 0 16px 0',
            letterSpacing: '-0.02em',
            lineHeight: '1.05',
          }}>
            {productData.name}
          </h1>

          {/* Tagline */}
          <p style={{
            fontSize: 'clamp(21px, 3vw, 28px)',
            fontWeight: '400',
            color: apple.textSecondary,
            margin: '0 auto 40px',
            maxWidth: '680px',
            lineHeight: '1.4',
          }}>
            Inspired by {productData.tagline}
          </p>

          {/* CTA */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            marginBottom: '60px',
          }}>
            <button style={{
              padding: '12px 24px',
              backgroundColor: apple.accent,
              color: '#ffffff',
              fontSize: '17px',
              fontWeight: '400',
              border: 'none',
              borderRadius: '980px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}>
              Add to Cart
            </button>
            <Link href="/collections/smoothies" style={{
              fontSize: '17px',
              color: apple.accent,
              textDecoration: 'none',
            }}>
              View all smoothies &rarr;
            </Link>
          </div>

          {/* Large Hero Product Image */}
          <div style={{
            maxWidth: '500px',
            margin: '0 auto',
            padding: '0 24px',
          }}>
            <img
              src={productData.gallery[selectedImageIndex]}
              alt={productData.name}
              style={{
                width: '100%',
                maxHeight: '500px',
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Thumbnail Gallery - Like Reference Image 3 */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '40px',
            padding: '0 24px',
          }}>
            {productData.gallery.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px',
                  border: selectedImageIndex === index ? '2px solid #000000' : '2px solid transparent',
                  backgroundColor: '#f5f5f7',
                  cursor: 'pointer',
                  padding: '8px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={img}
                  alt={`${productData.name} view ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </button>
            ))}
          </div>

          {/* Accordion Sections - Menu Style */}
          <div style={{
            maxWidth: '600px',
            margin: '40px auto 0',
            padding: '0 24px',
            textAlign: 'left',
          }}>
            {/* All Ingredients */}
            <div style={{ borderTop: `1px solid ${apple.divider}` }}>
              <button
                onClick={() => toggleSection('ingredients')}
                style={{
                  width: '100%',
                  padding: '24px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div>
                  <div style={{
                    fontSize: '28px',
                    fontWeight: '600',
                    color: apple.textPrimary,
                    marginBottom: '4px',
                  }}>
                    Ingredients
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: apple.textSecondary,
                  }}>
                    What goes in every cup
                  </div>
                </div>
                <span style={{
                  fontSize: '24px',
                  color: apple.textSecondary,
                  fontWeight: '300',
                  lineHeight: '1',
                  marginTop: '8px',
                }}>
                  {openSections.ingredients ? '−' : '+'}
                </span>
              </button>
              {openSections.ingredients && (
                <p style={{
                  paddingBottom: '24px',
                  fontSize: '15px',
                  color: apple.textSecondary,
                  lineHeight: '1.6',
                  margin: 0,
                }}>
                  {productData.ingredients}
                </p>
              )}
            </div>

            {/* Nutrition Facts */}
            <div style={{ borderTop: `1px solid ${apple.divider}` }}>
              <button
                onClick={() => toggleSection('nutrition')}
                style={{
                  width: '100%',
                  padding: '24px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div>
                  <div style={{
                    fontSize: '28px',
                    fontWeight: '600',
                    color: apple.textPrimary,
                    marginBottom: '4px',
                  }}>
                    Nutrition
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: apple.textSecondary,
                  }}>
                    What you put in matters
                  </div>
                </div>
                <span style={{
                  fontSize: '24px',
                  color: apple.textSecondary,
                  fontWeight: '300',
                  lineHeight: '1',
                  marginTop: '8px',
                }}>
                  {openSections.nutrition ? '−' : '+'}
                </span>
              </button>
              {openSections.nutrition && (
                <div style={{
                  paddingBottom: '24px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}>
                  {productData.nutrition.map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      gap: '8px',
                      fontSize: '15px',
                    }}>
                      <span style={{ color: apple.textPrimary, fontWeight: '500' }}>{item.label}:</span>
                      <span style={{ color: apple.textSecondary }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div style={{ borderTop: `1px solid ${apple.divider}` }}>
              <button
                onClick={() => toggleSection('description')}
                style={{
                  width: '100%',
                  padding: '24px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div>
                  <div style={{
                    fontSize: '28px',
                    fontWeight: '600',
                    color: apple.textPrimary,
                    marginBottom: '4px',
                  }}>
                    About
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: apple.textSecondary,
                  }}>
                    Taste the difference
                  </div>
                </div>
                <span style={{
                  fontSize: '24px',
                  color: apple.textSecondary,
                  fontWeight: '300',
                  lineHeight: '1',
                  marginTop: '8px',
                }}>
                  {openSections.description ? '−' : '+'}
                </span>
              </button>
              {openSections.description && (
                <p style={{
                  paddingBottom: '24px',
                  fontSize: '15px',
                  color: apple.textSecondary,
                  lineHeight: '1.6',
                  margin: 0,
                }}>
                  {productData.description}
                </p>
              )}
            </div>

            {/* Key Ingredients */}
            <div style={{ borderTop: `1px solid ${apple.divider}` }}>
              <button
                onClick={() => toggleSection('keyIngredients')}
                style={{
                  width: '100%',
                  padding: '24px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div>
                  <div style={{
                    fontSize: '28px',
                    fontWeight: '600',
                    color: apple.textPrimary,
                    marginBottom: '4px',
                  }}>
                    Key Ingredients
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: apple.textSecondary,
                  }}>
                    The power behind every sip
                  </div>
                </div>
                <span style={{
                  fontSize: '24px',
                  color: apple.textSecondary,
                  fontWeight: '300',
                  lineHeight: '1',
                  marginTop: '8px',
                }}>
                  {openSections.keyIngredients ? '−' : '+'}
                </span>
              </button>
              {openSections.keyIngredients && (
                <div style={{
                  paddingBottom: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}>
                  {productData.keyIngredients.map((ingredient, index) => (
                    <div key={index} style={{ fontSize: '15px' }}>
                      <span style={{ color: apple.textPrimary, fontWeight: '500' }}>{ingredient.name}: </span>
                      <span style={{ color: apple.textSecondary }}>{ingredient.benefit}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* How to Prep */}
            <div style={{ borderTop: `1px solid ${apple.divider}`, borderBottom: `1px solid ${apple.divider}` }}>
              <button
                onClick={() => toggleSection('howToPrep')}
                style={{
                  width: '100%',
                  padding: '24px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div>
                  <div style={{
                    fontSize: '28px',
                    fontWeight: '600',
                    color: apple.textPrimary,
                    marginBottom: '4px',
                  }}>
                    How to Prepare
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: apple.textSecondary,
                  }}>
                    Ready in 60 seconds
                  </div>
                </div>
                <span style={{
                  fontSize: '24px',
                  color: apple.textSecondary,
                  fontWeight: '300',
                  lineHeight: '1',
                  marginTop: '8px',
                }}>
                  {openSections.howToPrep ? '−' : '+'}
                </span>
              </button>
              {openSections.howToPrep && (
                <div style={{
                  paddingBottom: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}>
                  <div style={{ fontSize: '15px' }}>
                    <span style={{ color: apple.textPrimary, fontWeight: '500' }}>1. Add liquid: </span>
                    <span style={{ color: apple.textSecondary }}>Fill cup to top with water, oat milk, or coconut water.</span>
                  </div>
                  <div style={{ fontSize: '15px' }}>
                    <span style={{ color: apple.textPrimary, fontWeight: '500' }}>2. Blend: </span>
                    <span style={{ color: apple.textSecondary }}>Pour into a blender and blend until silky smooth.</span>
                  </div>
                  <div style={{ fontSize: '15px' }}>
                    <span style={{ color: apple.textPrimary, fontWeight: '500' }}>3. Enjoy: </span>
                    <span style={{ color: apple.textSecondary }}>Pour back into your cup. Sip. Smile. Repeat.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* The Lineup Section */}
        <section style={{
          padding: '60px 0 80px',
          backgroundColor: '#000000',
          position: 'relative',
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '40px',
          }}>
            <h2 style={{
              fontSize: '42px',
              fontWeight: '600',
              color: '#ffffff',
              margin: '0 0 8px 0',
            }}>
              The lineup
            </h2>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.5)',
              margin: 0,
            }}>
              These are the ones people can't stop reordering.
            </p>
          </div>

          {/* Content with Arrows */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            padding: '0 24px',
          }}>
            {/* Left Arrow */}
            <button
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Product Cards */}
            <div style={{
              display: 'flex',
              gap: '12px',
              overflow: 'hidden',
            }}>
              {POPULAR_SMOOTHIES.slice(0, 5).map((item, index) => {
                const labels = ['BEST SELLER', 'NEW', 'BEST SELLER', 'BEST SELLER', 'BEST SELLER'];
                const labelColors = ['#ff3b5c', '#4ade80', '#ff3b5c', '#ff3b5c', '#ff3b5c'];
                return (
                  <Link
                    key={item.id}
                    href={`/products/${item.id}`}
                    style={{
                      textDecoration: 'none',
                      display: 'block',
                      width: '180px',
                      flexShrink: 0,
                    }}
                  >
                    <div style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      padding: '16px',
                      height: '320px',
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                      {/* Label */}
                      <div style={{ height: '16px', marginBottom: '6px' }}>
                        {labels[index] && (
                          <span style={{
                            fontSize: '10px',
                            fontWeight: '700',
                            color: labelColors[index],
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                          }}>
                            {labels[index]}
                          </span>
                        )}
                      </div>
                      
                      {/* Product Name */}
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#000000',
                        margin: '0 0 2px 0',
                        lineHeight: '1.2',
                      }}>
                        {item.name}
                      </h3>
                      
                      {/* Subtitle */}
                      <p style={{
                        fontSize: '13px',
                        color: '#86868b',
                        margin: '0 0 12px 0',
                      }}>
                        Smoothie
                      </p>
                      
                      {/* Product Image */}
                      <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f7',
                        borderRadius: '8px',
                        padding: '8px',
                      }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Right Arrow */}
            <button
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
