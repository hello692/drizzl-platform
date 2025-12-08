import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// Google AI-inspired theme tokens
const theme = {
  bgPage: '#050608',
  bgPanel: '#101218',
  bgPanelHover: '#1a1d24',
  textMain: '#f5f5f5',
  textMuted: '#a3a3a3',
  textSubtle: '#6b6b6b',
  borderSubtle: '#272727',
  borderLight: '#333333',
  accent: '#8ab4f8',
  accentGreen: '#81c995',
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
    description: true,
    ingredients: false,
    nutrition: false,
    about: false,
  });
  const [selectedIngredient, setSelectedIngredient] = useState(0);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!product || !productData) {
    return (
      <div style={{ backgroundColor: theme.bgPage, minHeight: '100vh' }}>
        <Navbar />
        <div style={{ padding: '120px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', color: theme.textMain }}>Product not found</h1>
          <Link href="/collections/smoothies" style={{ color: theme.accent, textDecoration: 'underline' }}>
            Back to Smoothies
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <span style={{ color: '#fbbf24', fontSize: '14px', letterSpacing: '1px' }}>
        {'★'.repeat(fullStars)}
        {hasHalfStar && '★'}
        {'☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0))}
      </span>
    );
  };

  return (
    <div style={{ backgroundColor: theme.bgPage, minHeight: '100vh' }}>
      <Navbar />
      
      <main style={{ paddingTop: '100px', paddingBottom: '80px' }}>
        {/* Main Product Section - Card Panel */}
        <section style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            background: theme.bgPanel,
            borderRadius: '24px',
            border: `1px solid ${theme.borderSubtle}`,
            padding: '48px',
          }}>
            {/* Left - Image Gallery */}
            <div>
              {/* Best Seller Badge */}
              <div style={{ marginBottom: '20px' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  background: 'rgba(139, 180, 248, 0.15)',
                  border: `1px solid ${theme.accent}`,
                  borderRadius: '100px',
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '1px',
                  color: theme.accent,
                  textTransform: 'uppercase',
                }}>
                  BEST SELLER
                </span>
              </div>

              {/* Main Image */}
              <div style={{
                background: theme.bgPage,
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px',
              }}>
                <img
                  src={productData.gallery[selectedImageIndex]}
                  alt={productData.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                  }}
                />
              </div>

              {/* Thumbnail Gallery */}
              <div style={{
                display: 'flex',
                gap: '12px',
              }}>
                {productData.gallery.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: selectedImageIndex === index 
                        ? `2px solid ${theme.accent}` 
                        : `1px solid ${theme.borderSubtle}`,
                      background: theme.bgPage,
                      cursor: 'pointer',
                      padding: '8px',
                      transition: 'all 0.2s',
                    }}
                  >
                    <img
                      src={img}
                      alt={`${productData.name} ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Product Info */}
            <div>
              {/* Category */}
              <p style={{
                fontSize: '12px',
                fontWeight: '500',
                letterSpacing: '2px',
                color: theme.textMuted,
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                SMOOTHIE
              </p>

              {/* Product Name */}
              <h1 style={{
                fontSize: '36px',
                fontWeight: '600',
                color: theme.textMain,
                margin: '0 0 16px 0',
                lineHeight: '1.2',
                letterSpacing: '-0.5px',
              }}>
                {productData.name}
              </h1>

              {/* Tagline */}
              <p style={{
                fontSize: '16px',
                color: theme.textMuted,
                marginBottom: '20px',
                lineHeight: '1.6',
              }}>
                <span style={{ color: theme.textSubtle }}>Inspired by: </span>
                {productData.tagline}
              </p>

              {/* Rating */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '32px',
              }}>
                {renderStars(productData.rating.average)}
                <span style={{ fontSize: '14px', color: theme.textMuted }}>
                  {productData.rating.count.toLocaleString()} reviews
                </span>
              </div>

              {/* Price */}
              <div style={{
                fontSize: '32px',
                fontWeight: '600',
                color: theme.textMain,
                marginBottom: '24px',
              }}>
                ${productData.price.toFixed(2)}
              </div>

              {/* Add to Cart Button */}
              <button style={{
                width: '100%',
                padding: '18px 32px',
                backgroundColor: theme.textMain,
                color: theme.bgPage,
                fontSize: '15px',
                fontWeight: '600',
                letterSpacing: '0.5px',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                marginBottom: '24px',
                transition: 'all 0.2s',
              }}>
                Add to Cart
              </button>

              {/* Badges */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                marginBottom: '32px',
              }}>
                {productData.badges.map((badge, index) => (
                  <span key={index} style={{
                    padding: '8px 14px',
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${theme.borderSubtle}`,
                    borderRadius: '100px',
                    fontSize: '12px',
                    color: theme.textMuted,
                  }}>
                    {badge}
                  </span>
                ))}
              </div>

              {/* Accordion Sections */}
              <div style={{ borderTop: `1px solid ${theme.borderSubtle}` }}>
                {/* Description */}
                <div style={{ borderBottom: `1px solid ${theme.borderSubtle}` }}>
                  <button
                    onClick={() => toggleSection('description')}
                    style={{
                      width: '100%',
                      padding: '20px 0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: theme.textMain,
                    }}
                  >
                    Description
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      style={{ 
                        transform: openSections.description ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    >
                      <path d="M6 9l6 6 6-6" stroke={theme.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {openSections.description && (
                    <p style={{
                      paddingBottom: '20px',
                      fontSize: '14px',
                      color: theme.textMuted,
                      lineHeight: '1.7',
                      maxWidth: '640px',
                    }}>
                      {productData.description}
                    </p>
                  )}
                </div>

                {/* All Ingredients */}
                <div style={{ borderBottom: `1px solid ${theme.borderSubtle}` }}>
                  <button
                    onClick={() => toggleSection('ingredients')}
                    style={{
                      width: '100%',
                      padding: '20px 0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: theme.textMain,
                    }}
                  >
                    All Ingredients
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      style={{ 
                        transform: openSections.ingredients ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    >
                      <path d="M6 9l6 6 6-6" stroke={theme.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {openSections.ingredients && (
                    <p style={{
                      paddingBottom: '20px',
                      fontSize: '14px',
                      color: theme.textMuted,
                      lineHeight: '1.7',
                      maxWidth: '640px',
                    }}>
                      {productData.ingredients}
                    </p>
                  )}
                </div>

                {/* Nutrition Facts */}
                <div style={{ borderBottom: `1px solid ${theme.borderSubtle}` }}>
                  <button
                    onClick={() => toggleSection('nutrition')}
                    style={{
                      width: '100%',
                      padding: '20px 0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: theme.textMain,
                    }}
                  >
                    Nutrition Facts
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      style={{ 
                        transform: openSections.nutrition ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    >
                      <path d="M6 9l6 6 6-6" stroke={theme.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {openSections.nutrition && (
                    <div style={{ paddingBottom: '20px' }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '12px',
                      }}>
                        {productData.nutrition.map((item, index) => (
                          <div key={index} style={{
                            padding: '16px',
                            background: theme.bgPage,
                            borderRadius: '12px',
                            textAlign: 'center',
                          }}>
                            <div style={{
                              fontSize: '18px',
                              fontWeight: '600',
                              color: theme.textMain,
                              marginBottom: '4px',
                            }}>
                              {item.value}
                            </div>
                            <div style={{
                              fontSize: '12px',
                              color: theme.textMuted,
                            }}>
                              {item.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* About */}
                <div>
                  <button
                    onClick={() => toggleSection('about')}
                    style={{
                      width: '100%',
                      padding: '20px 0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: '500',
                      color: theme.textMain,
                    }}
                  >
                    About Drizzl Wellness
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      style={{ 
                        transform: openSections.about ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    >
                      <path d="M6 9l6 6 6-6" stroke={theme.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {openSections.about && (
                    <p style={{
                      paddingBottom: '20px',
                      fontSize: '14px',
                      color: theme.textMuted,
                      lineHeight: '1.7',
                      maxWidth: '640px',
                    }}>
                      Drizzl Wellness makes pre-portioned food built on organic fruits and vegetables that arrives frozen at your doorstep—so all you have to make is a good decision. No prep, no mess, no stress and ready in minutes.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Ingredients Section */}
        <section style={{
          maxWidth: '1200px',
          margin: '64px auto 0',
          padding: '0 24px',
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: theme.textMain,
            marginBottom: '12px',
            letterSpacing: '-0.5px',
          }}>
            Key Ingredients
          </h2>
          <p style={{
            fontSize: '15px',
            color: theme.textMuted,
            marginBottom: '32px',
            maxWidth: '640px',
          }}>
            Carefully selected organic ingredients that fuel your body and mind.
          </p>

          {/* Ingredient Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
            flexWrap: 'wrap',
          }}>
            {productData.keyIngredients.map((ingredient, index) => (
              <button
                key={index}
                onClick={() => setSelectedIngredient(index)}
                style={{
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: selectedIngredient === index ? theme.bgPage : theme.textMuted,
                  backgroundColor: selectedIngredient === index ? theme.textMain : 'transparent',
                  border: `1px solid ${selectedIngredient === index ? theme.textMain : theme.borderSubtle}`,
                  borderRadius: '100px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {ingredient.name}
              </button>
            ))}
          </div>

          {/* Ingredient Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}>
            {productData.keyIngredients.slice(0, 3).map((ingredient, index) => (
              <div key={index} style={{
                background: theme.bgPanel,
                borderRadius: '16px',
                border: `1px solid ${theme.borderSubtle}`,
                padding: '24px',
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: theme.textMain,
                  marginBottom: '12px',
                }}>
                  {ingredient.name}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: theme.textMuted,
                  lineHeight: '1.6',
                  margin: 0,
                }}>
                  {ingredient.benefit}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How to Prep Section */}
        <section style={{
          maxWidth: '1200px',
          margin: '64px auto 0',
          padding: '0 24px',
        }}>
          <div style={{
            background: theme.bgPanel,
            borderRadius: '24px',
            border: `1px solid ${theme.borderSubtle}`,
            padding: '48px',
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: theme.textMain,
              marginBottom: '12px',
              letterSpacing: '-0.5px',
            }}>
              How to Prep
            </h2>
            <p style={{
              fontSize: '15px',
              color: theme.textMuted,
              marginBottom: '40px',
              maxWidth: '640px',
            }}>
              From freezer to table in under a minute.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
            }}>
              {[
                { step: '1', title: 'Add Liquid', desc: 'Fill cup to top with your preferred liquid (water, oat milk, or coconut water).' },
                { step: '2', title: 'Blend', desc: 'Pour into a blender and blend until smooth.' },
                { step: '3', title: 'Enjoy', desc: 'Pour back into your cup and enjoy your fresh smoothie.' },
              ].map((item, index) => (
                <div key={index} style={{
                  background: theme.bgPage,
                  borderRadius: '16px',
                  padding: '32px 24px',
                  textAlign: 'center',
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(139, 180, 248, 0.15)',
                    border: `1px solid ${theme.accent}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: theme.accent,
                  }}>
                    {item.step}
                  </div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: theme.textMain,
                    marginBottom: '12px',
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: theme.textMuted,
                    lineHeight: '1.6',
                    margin: 0,
                  }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section style={{
          maxWidth: '1200px',
          margin: '64px auto 0',
          padding: '0 24px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
          }}>
            <div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '600',
                color: theme.textMain,
                marginBottom: '8px',
                letterSpacing: '-0.5px',
              }}>
                You might also like
              </h2>
              <p style={{
                fontSize: '15px',
                color: theme.textMuted,
                margin: 0,
              }}>
                Explore more of our premium smoothie collection.
              </p>
            </div>
            <Link href="/collections/smoothies" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              border: `1px solid ${theme.borderSubtle}`,
              borderRadius: '100px',
              color: theme.textMain,
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}>
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
          }}>
            {POPULAR_SMOOTHIES.filter(p => p.id !== productId).slice(0, 4).map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/products/${relatedProduct.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div style={{
                  background: theme.bgPanel,
                  borderRadius: '16px',
                  border: `1px solid ${theme.borderSubtle}`,
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                }}>
                  <div style={{
                    background: theme.bgPage,
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    aspectRatio: '1',
                  }}>
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      style={{
                        width: '80%',
                        height: '80%',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{
                      fontSize: '15px',
                      fontWeight: '500',
                      color: theme.textMain,
                      margin: '0 0 6px 0',
                    }}>
                      {relatedProduct.name}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: theme.textMuted,
                      margin: 0,
                    }}>
                      ${relatedProduct.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
