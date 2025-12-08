import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

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
  pairsWellWith?: { name: string; price: number; image: string };
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
    pairsWellWith: { name: 'Organic Pea Protein Powder', price: 44.99, image: '/products/protein-powder.png' },
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
    pairsWellWith: { name: 'Organic Pea Protein Powder', price: 44.99, image: '/products/protein-powder.png' },
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
    pairsWellWith: { name: 'Organic Pea Protein Powder', price: 44.99, image: '/products/protein-powder.png' },
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
    pairsWellWith: { name: 'Organic Pea Protein Powder', price: 44.99, image: '/products/protein-powder.png' },
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
    pairsWellWith: { name: 'Organic Pea Protein Powder', price: 44.99, image: '/products/protein-powder.png' },
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
    pairsWellWith: { name: 'Organic Pea Protein Powder', price: 44.99, image: '/products/protein-powder.png' },
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

const getBadgeIcon = (badge: string) => {
  switch (badge) {
    case 'Gluten-Free': return '🌾';
    case 'Dairy-Free': return '🥛';
    case 'Made from Plants': return '🌱';
    case 'No Sugar Added': return '🚫';
    case 'Caffeine': return '☕';
    case 'Adaptogenic': return '🍄';
    case 'Superfood': return '⭐';
    case 'High Protein': return '💪';
    default: return '✓';
  }
};

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
    about: true,
  });
  const [selectedIngredient, setSelectedIngredient] = useState(0);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!product || !productData) {
    return (
      <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ padding: '120px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', color: '#000000' }}>Product not found</h1>
          <Link href="/collections/smoothies" style={{ color: '#000000', textDecoration: 'underline' }}>
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
      <span style={{ color: '#000000', fontSize: '16px', letterSpacing: '2px' }}>
        {'★'.repeat(fullStars)}
        {hasHalfStar && '½'}
        {'☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0))}
      </span>
    );
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />
      
      <main style={{ paddingTop: '80px' }}>
        {/* Best Seller Badge - Top Left */}
        <div style={{ padding: '20px 48px' }}>
          <span style={{
            display: 'inline-block',
            padding: '6px 12px',
            border: '1px solid #000000',
            fontSize: '11px',
            fontWeight: '500',
            letterSpacing: '1px',
            color: '#000000',
            textTransform: 'uppercase',
          }}>
            BEST SELLER
          </span>
        </div>

        {/* Main Product Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '60px 1fr 1fr',
          gap: '40px',
          padding: '0 48px 60px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          {/* Gallery Numbers - Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '40px' }}>
            {productData.gallery.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: selectedImageIndex === index ? '600' : '400',
                  color: selectedImageIndex === index ? '#000000' : '#999999',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Product Image - Center */}
          <div style={{ position: 'relative' }}>
            <img
              src={productData.gallery[selectedImageIndex]}
              alt={productData.name}
              style={{
                width: '100%',
                maxWidth: '500px',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
            {/* Certification Badges */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              display: 'flex',
              gap: '8px',
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '1px solid #000000',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FFFFFF',
                fontSize: '8px',
                textAlign: 'center',
                lineHeight: '1.1',
              }}>
                <span style={{ fontWeight: '600' }}>USDA</span>
                <span>ORGANIC</span>
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '1px solid #000000',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FFFFFF',
                fontSize: '8px',
                textAlign: 'center',
                lineHeight: '1.1',
              }}>
                <span style={{ fontWeight: '600' }}>NON</span>
                <span>GMO</span>
              </div>
            </div>
          </div>

          {/* Product Info - Right */}
          <div style={{ paddingTop: '20px' }}>
            {/* Category */}
            <p style={{
              fontSize: '12px',
              fontWeight: '500',
              letterSpacing: '1.5px',
              color: '#666666',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              SMOOTHIE
            </p>

            {/* Product Name */}
            <h1 style={{
              fontSize: '42px',
              fontWeight: '700',
              color: '#000000',
              margin: '0 0 12px 0',
              lineHeight: '1.1',
              textTransform: 'uppercase',
            }}>
              {productData.name}
            </h1>

            {/* Tagline */}
            <p style={{
              fontSize: '16px',
              color: '#666666',
              marginBottom: '16px',
              fontStyle: 'italic',
            }}>
              <span style={{ fontWeight: '500', fontStyle: 'normal' }}>Inspired by: </span>
              {productData.tagline}
            </p>

            {/* Rating */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '24px',
            }}>
              {renderStars(productData.rating.average)}
              <span style={{ fontSize: '14px', color: '#666666' }}>
                {productData.rating.count.toLocaleString()} reviews
              </span>
            </div>

            {/* Add to Cart Button */}
            <button style={{
              width: '100%',
              padding: '18px 32px',
              backgroundColor: '#000000',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '600',
              letterSpacing: '1px',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'uppercase',
              marginBottom: '24px',
              transition: 'opacity 0.2s',
            }}>
              ADD TO CART ${productData.price.toFixed(2)}
            </button>

            {/* Badges Row */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '32px',
              paddingBottom: '32px',
              borderBottom: '1px solid #E5E5E5',
            }}>
              {productData.badges.map((badge, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  color: '#333333',
                }}>
                  <span style={{ fontSize: '14px' }}>{getBadgeIcon(badge)}</span>
                  <span>{badge}</span>
                </div>
              ))}
            </div>

            {/* Pairs Well With */}
            {productData.pairsWellWith && (
              <div style={{ marginBottom: '32px' }}>
                <p style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '1px',
                  color: '#000000',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                }}>
                  PAIRS WELL WITH
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  border: '1px solid #E5E5E5',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: '#F5F5F5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      color: '#666666',
                    }}>
                      PROTEIN
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#000000', margin: 0 }}>
                        {productData.pairsWellWith.name}
                      </p>
                      <p style={{ fontSize: '14px', color: '#666666', margin: '4px 0 0 0' }}>
                        ${productData.pairsWellWith.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button style={{
                    padding: '10px 20px',
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '20px',
                  }}>
                    ADD +
                  </button>
                </div>
              </div>
            )}

            {/* Accordion Sections */}
            <div>
              {/* Description */}
              <div style={{ borderBottom: '1px solid #E5E5E5' }}>
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
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#000000',
                  }}
                >
                  Description
                  <span style={{ fontSize: '20px', transform: openSections.description ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    ∨
                  </span>
                </button>
                {openSections.description && (
                  <div style={{ paddingBottom: '20px', fontSize: '15px', color: '#333333', lineHeight: '1.7' }}>
                    {productData.description}
                  </div>
                )}
              </div>

              {/* All Ingredients */}
              <div style={{ borderBottom: '1px solid #E5E5E5' }}>
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
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#000000',
                  }}
                >
                  All ingredients
                  <span style={{ fontSize: '20px', transform: openSections.ingredients ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    ∨
                  </span>
                </button>
                {openSections.ingredients && (
                  <div style={{ paddingBottom: '20px', fontSize: '15px', color: '#333333', lineHeight: '1.7' }}>
                    {productData.ingredients}
                  </div>
                )}
              </div>

              {/* Nutrition Facts */}
              <div style={{ borderBottom: '1px solid #E5E5E5' }}>
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
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#000000',
                  }}
                >
                  Nutrition facts
                  <span style={{ fontSize: '20px', transform: openSections.nutrition ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    ∨
                  </span>
                </button>
                {openSections.nutrition && (
                  <div style={{ paddingBottom: '20px' }}>
                    {productData.nutrition.map((item, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 0',
                        fontSize: '14px',
                        color: '#333333',
                        borderBottom: index < productData.nutrition.length - 1 ? '1px solid #F0F0F0' : 'none',
                      }}>
                        <span>{item.label}</span>
                        <span style={{ fontWeight: '500' }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* About Drizzl */}
              <div style={{ borderBottom: '1px solid #E5E5E5' }}>
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
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#000000',
                  }}
                >
                  About Drizzl Wellness
                  <span style={{ fontSize: '20px', transform: openSections.about ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    ∨
                  </span>
                </button>
                {openSections.about && (
                  <div style={{ paddingBottom: '20px', fontSize: '15px', color: '#333333', lineHeight: '1.7' }}>
                    Drizzl Wellness makes pre-portioned food built on organic fruits and vegetables that arrives frozen at your doorstep—so all <em>you</em> have to make is a good decision. No prep, no mess, no stress and ready in minutes.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Key Ingredients Section */}
        <section style={{
          padding: '80px 48px',
          backgroundColor: '#FFFFFF',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px',
            maxWidth: '1400px',
            margin: '0 auto',
            alignItems: 'center',
          }}>
            {/* Ingredient Image */}
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '100%',
                height: '400px',
                backgroundColor: '#FAFAFA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '120px',
              }}>
                {productData.keyIngredients[selectedIngredient]?.name === 'Strawberry' && '🍓'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Banana' && '🍌'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Peach' && '🍑'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Raspberry' && '🫐'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Oats' && '🌾'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Goji Berry' && '🔴'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Dragon Fruit' && '🐲'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Pineapple' && '🍍'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Coconut' && '🥥'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Mango' && '🥭'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Chia Seeds' && '🌱'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Matcha' && '🍵'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Almond Butter' && '🌰'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Spinach' && '🥬'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Hemp Seeds' && '🌿'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Vanilla' && '✨'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Cold Brew' && '☕'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Lions Mane' && '🦁'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Chaga' && '🍄'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Reishi' && '🌙'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Oat Milk' && '🥛'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Cacao' && '🍫'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Acai' && '🫐'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Blueberries' && '🔵'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Guarana' && '⚡'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Hemp Hearts' && '💚'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Coconut Water' && '🥥'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Peanut Butter' && '🥜'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Honey' && '🍯'}
                {productData.keyIngredients[selectedIngredient]?.name === 'Flax Seeds' && '🌾'}
              </div>
            </div>

            {/* Ingredient Info */}
            <div>
              <h2 style={{
                fontSize: '14px',
                fontWeight: '600',
                letterSpacing: '2px',
                color: '#000000',
                textTransform: 'uppercase',
                marginBottom: '24px',
              }}>
                KEY INGREDIENTS
              </h2>

              {/* Ingredient Tabs */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '32px',
              }}>
                {productData.keyIngredients.map((ingredient, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIngredient(index)}
                    style={{
                      padding: '8px 16px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: selectedIngredient === index ? '#FFFFFF' : '#000000',
                      backgroundColor: selectedIngredient === index ? '#000000' : '#FFFFFF',
                      border: '1px solid #000000',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {ingredient.name}
                  </button>
                ))}
              </div>

              {/* Ingredient Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}>
                {productData.keyIngredients.slice(0, 2).map((ingredient, index) => (
                  <div key={index} style={{
                    padding: '24px',
                    border: '1px solid #E5E5E5',
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#000000',
                      marginBottom: '12px',
                    }}>
                      {ingredient.name}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#666666',
                      lineHeight: '1.6',
                      margin: 0,
                    }}>
                      {ingredient.benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How to Prep Section */}
        <section style={{
          padding: '80px 48px',
          backgroundColor: '#F5F5F5',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            maxWidth: '1400px',
            margin: '0 auto',
            alignItems: 'center',
          }}>
            {/* Blender Image */}
            <div style={{
              width: '100%',
              height: '400px',
              backgroundColor: '#E8E8E8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '100px',
            }}>
              🫗
            </div>

            {/* Prep Steps */}
            <div>
              <h2 style={{
                fontSize: '14px',
                fontWeight: '600',
                letterSpacing: '2px',
                color: '#000000',
                textTransform: 'uppercase',
                marginBottom: '40px',
              }}>
                HOW TO PREP
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    flexShrink: 0,
                  }}>
                    1
                  </div>
                  <p style={{ fontSize: '16px', color: '#333333', lineHeight: '1.6', margin: 0 }}>
                    Fill cup to top with your preferred liquid (any liquid works, but we'd go with an option like water or coconut water).
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    flexShrink: 0,
                  }}>
                    2
                  </div>
                  <p style={{ fontSize: '16px', color: '#333333', lineHeight: '1.6', margin: 0 }}>
                    Pour into a blender and blend.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    flexShrink: 0,
                  }}>
                    3
                  </div>
                  <p style={{ fontSize: '16px', color: '#333333', lineHeight: '1.6', margin: 0 }}>
                    Pour back into your cup and enjoy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section style={{
          padding: '80px 48px',
          backgroundColor: '#FFFFFF',
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '40px',
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#000000',
                margin: 0,
              }}>
                You might also like
              </h2>
              <Link href="/collections/smoothies" style={{
                fontSize: '14px',
                color: '#000000',
                textDecoration: 'underline',
              }}>
                View All
              </Link>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
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
                    backgroundColor: '#FAFAFA',
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
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
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#000000',
                    margin: '0 0 4px 0',
                  }}>
                    {relatedProduct.name}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#666666',
                    margin: 0,
                  }}>
                    ${relatedProduct.price.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
