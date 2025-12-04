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
    image: '/products/strawberry-peach/transparent-glass-new.jpg',
    hoverImage: '/products/strawberry-peach/transparent-glass-2.png',
    images: [
      '/products/strawberry-peach/transparent-glass-new.jpg',
      '/products/strawberry-peach/transparent-glass-1.png',
      '/products/strawberry-peach/transparent-glass-2.png',
      '/products/strawberry-peach/transparent-glass-3.png',
      '/products/strawberry-peach/product-1.jpg',
      '/products/strawberry-peach/product-2.jpg',
      '/products/strawberry-peach/product-3.jpg',
      '/products/strawberry-peach/lifestyle-1.jpg',
      '/products/strawberry-peach/lifestyle-2.jpg',
    ],
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
  '9': {
    id: '9',
    name: 'Pink Piyata',
    tagline: 'A tropical fiesta of dragon fruit and exotic flavors',
    price: 8.99,
    reviews: 127,
    rating: 4.8,
    badge: 'NEW',
    image: '/products/pink-piyata/transparent-glass-1.png',
    hoverImage: '/products/pink-piyata/transparent-glass-2.png',
    images: [
      '/products/pink-piyata/transparent-glass-1.png',
      '/products/pink-piyata/transparent-glass-2.png',
      '/products/pink-piyata/transparent-glass-3.png',
      '/products/pink-piyata/product-1.jpg',
      '/products/pink-piyata/product-2.jpg',
      '/products/pink-piyata/product-3.jpg',
      '/products/pink-piyata/lifestyle-1.jpg',
      '/products/pink-piyata/lifestyle-2.jpg',
      '/products/pink-piyata/detail-1.jpg',
    ],
    description: 'Bursting with vibrant pink dragon fruit, tropical pineapple, and creamy coconut, Pink Piyata is a celebration in a cup. This exotic blend delivers a refreshing taste of paradise with every sip, packed with antioxidants and natural sweetness.',
    ingredients: ['organic dragon fruit', 'organic pineapple', 'organic coconut', 'organic banana', 'organic passion fruit', 'organic chia seeds'],
    nutrition: {
      calories: '150',
      fat: '2g',
      carbs: '30g',
      fiber: '5g',
      protein: '3g',
      sugars: '20g',
    },
    attributes: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'No Sugar Added'],
    keyIngredients: [
      { name: 'Dragon Fruit', description: 'Rich in antioxidants, vitamin C, and fiber. Known for its vibrant pink color and immune-boosting properties.' },
      { name: 'Pineapple', description: 'High in vitamin C and bromelain, which supports digestion and reduces inflammation.' },
      { name: 'Coconut', description: 'Provides healthy fats and electrolytes for natural hydration and energy.' },
      { name: 'Passion Fruit', description: 'Packed with vitamins A and C, fiber, and beneficial plant compounds.' },
    ],
    prepSteps: [
      'Fill cup to top with your preferred liquid (coconut water works great for extra tropical vibes).',
      'Pour into a blender and blend until smooth.',
      'Pour back into your cup and enjoy the fiesta.',
    ],
  },
  '10': {
    id: '10',
    name: 'Matcha',
    tagline: 'Zen in a cup with ceremonial-grade matcha',
    price: 9.49,
    reviews: 312,
    rating: 4.7,
    badge: 'NEW',
    image: '/products/matcha/transparent-glass-1.png',
    hoverImage: '/products/matcha/transparent-glass-2.png',
    images: [
      '/products/matcha/transparent-glass-1.png',
      '/products/matcha/transparent-glass-2.png',
      '/products/matcha/transparent-glass-3.png',
      '/products/matcha/product-1.jpg',
      '/products/matcha/product-2.jpg',
      '/products/matcha/product-3.jpg',
      '/products/matcha/lifestyle-1.jpg',
      '/products/matcha/lifestyle-2.jpg',
      '/products/matcha/lifestyle-3.jpg',
      '/products/matcha/detail-1.jpg',
    ],
    description: 'Experience the calm energy of Japan with our ceremonial-grade matcha blend. Earthy, smooth, and subtly sweet, this smoothie combines premium matcha with creamy banana and coconut for a zen-like boost that keeps you focused all day.',
    ingredients: ['organic ceremonial matcha', 'organic banana', 'organic coconut milk', 'organic spinach', 'organic vanilla', 'organic agave'],
    nutrition: {
      calories: '160',
      fat: '3g',
      carbs: '28g',
      fiber: '4g',
      protein: '4g',
      sugars: '14g',
    },
    attributes: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'No Sugar Added'],
    keyIngredients: [
      { name: 'Matcha', description: 'Premium ceremonial-grade green tea powder rich in antioxidants, L-theanine for calm focus, and natural caffeine for sustained energy.' },
      { name: 'Banana', description: 'Rich in vitamin B6 and potassium, providing natural sweetness and creamy texture.' },
      { name: 'Coconut Milk', description: 'Adds healthy fats and a smooth, creamy base with natural electrolytes.' },
      { name: 'Spinach', description: 'Packed with iron, vitamins, and minerals for added nutrition without altering the taste.' },
    ],
    prepSteps: [
      'Fill cup to top with your preferred liquid (oat milk or coconut milk recommended for best taste).',
      'Pour into a blender and blend until smooth and creamy.',
      'Pour back into your cup and find your zen.',
    ],
  },
  '11': {
    id: '11',
    name: 'Mocha',
    tagline: 'Rich espresso meets creamy chocolate indulgence',
    price: 9.49,
    reviews: 245,
    rating: 4.8,
    badge: 'NEW',
    image: '/products/mocha/transparent-glass-1.png',
    hoverImage: '/products/mocha/transparent-glass-2.png',
    images: [
      '/products/mocha/transparent-glass-1.png',
      '/products/mocha/transparent-glass-2.png',
      '/products/mocha/transparent-glass-3.png',
      '/products/mocha/product-1.jpg',
      '/products/mocha/product-2.jpg',
      '/products/mocha/product-3.jpg',
      '/products/mocha/lifestyle-1.jpg',
      '/products/mocha/lifestyle-2.jpg',
      '/products/mocha/lifestyle-3.jpg',
      '/products/mocha/detail-1.jpg',
    ],
    description: 'Wake up to the perfect blend of rich espresso and decadent cacao. Our Mocha smoothie delivers a coffee-house experience with the nutrition of a wholesome breakfast. Creamy banana and oats create a satisfying base while natural caffeine gives you the boost you need.',
    ingredients: ['organic cold brew coffee', 'organic cacao', 'organic banana', 'organic oat milk', 'organic dates', 'organic almond butter'],
    nutrition: {
      calories: '180',
      fat: '4g',
      carbs: '32g',
      fiber: '5g',
      protein: '5g',
      sugars: '16g',
    },
    attributes: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'No Sugar Added'],
    keyIngredients: [
      { name: 'Cold Brew Coffee', description: 'Smooth, less acidic coffee that provides natural caffeine for sustained energy without the jitters.' },
      { name: 'Cacao', description: 'Raw cacao is rich in antioxidants, magnesium, and mood-boosting compounds for a natural chocolate flavor.' },
      { name: 'Banana', description: 'Adds natural sweetness and creamy texture while providing potassium and vitamin B6.' },
      { name: 'Almond Butter', description: 'Healthy fats and protein for lasting energy and a rich, nutty depth.' },
    ],
    prepSteps: [
      'Fill cup to top with your preferred liquid (oat milk recommended for the creamiest result).',
      'Pour into a blender and blend until smooth and velvety.',
      'Pour back into your cup and enjoy your morning boost.',
    ],
  },
  '12': {
    id: '12',
    name: 'Nutty Monkey',
    tagline: 'Creamy peanut butter banana bliss',
    price: 8.99,
    reviews: 389,
    rating: 4.9,
    badge: 'BEST SELLER',
    image: '/products/nutty-monkey/transparent-glass-1.png',
    hoverImage: '/products/nutty-monkey/transparent-glass-2.png',
    images: [
      '/products/nutty-monkey/transparent-glass-1.png',
      '/products/nutty-monkey/transparent-glass-2.png',
      '/products/nutty-monkey/transparent-glass-3.png',
      '/products/nutty-monkey/product-1.jpg',
      '/products/nutty-monkey/product-2.jpg',
      '/products/nutty-monkey/product-3.jpg',
      '/products/nutty-monkey/lifestyle-1.jpg',
      '/products/nutty-monkey/lifestyle-2.jpg',
      '/products/nutty-monkey/lifestyle-3.jpg',
      '/products/nutty-monkey/detail-1.jpg',
    ],
    description: 'Go bananas for this irresistible blend of creamy peanut butter and ripe bananas. Nutty Monkey is the ultimate comfort smoothie that tastes like dessert but packs serious nutrition. Perfect for post-workout recovery or whenever you need a satisfying treat.',
    ingredients: ['organic banana', 'organic peanut butter', 'organic cacao nibs', 'organic oats', 'organic flax seeds', 'organic dates'],
    nutrition: {
      calories: '210',
      fat: '8g',
      carbs: '30g',
      fiber: '6g',
      protein: '8g',
      sugars: '14g',
    },
    attributes: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'No Sugar Added'],
    keyIngredients: [
      { name: 'Peanut Butter', description: 'Rich in protein and healthy fats, providing lasting energy and that classic nutty flavor everyone loves.' },
      { name: 'Banana', description: 'Creamy texture and natural sweetness with potassium for muscle recovery.' },
      { name: 'Cacao Nibs', description: 'Crunchy bits of pure cacao add antioxidants and a subtle chocolate depth.' },
      { name: 'Oats', description: 'Heart-healthy fiber that keeps you full and provides sustained energy.' },
    ],
    prepSteps: [
      'Fill cup to top with your preferred liquid (almond milk or oat milk works great).',
      'Pour into a blender and blend until smooth and creamy.',
      'Pour back into your cup and enjoy your nutty treat.',
    ],
  },
  '13': {
    id: '13',
    name: 'Mango Jackfruit',
    tagline: 'Tropical sunshine in every sip',
    price: 8.99,
    reviews: 156,
    rating: 4.7,
    badge: 'NEW',
    image: '/products/mango-jackfruit/transparent-glass-1.png',
    hoverImage: '/products/mango-jackfruit/transparent-glass-2.png',
    images: [
      '/products/mango-jackfruit/transparent-glass-1.png',
      '/products/mango-jackfruit/transparent-glass-2.png',
      '/products/mango-jackfruit/transparent-glass-3.png',
      '/products/mango-jackfruit/product-1.jpg',
      '/products/mango-jackfruit/product-2.jpg',
      '/products/mango-jackfruit/product-3.jpg',
      '/products/mango-jackfruit/lifestyle-1.jpg',
      '/products/mango-jackfruit/lifestyle-2.jpg',
      '/products/mango-jackfruit/lifestyle-3.jpg',
      '/products/mango-jackfruit/detail-1.jpg',
    ],
    description: 'Escape to the tropics with our exotic Mango Jackfruit blend. Sweet, aromatic mango pairs perfectly with the unique honey-like flavor of jackfruit, creating a smoothie that tastes like a tropical vacation. Packed with vitamins and natural sweetness.',
    ingredients: ['organic mango', 'organic jackfruit', 'organic pineapple', 'organic coconut milk', 'organic banana', 'organic turmeric'],
    nutrition: {
      calories: '145',
      fat: '2g',
      carbs: '32g',
      fiber: '4g',
      protein: '2g',
      sugars: '22g',
    },
    attributes: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'No Sugar Added'],
    keyIngredients: [
      { name: 'Mango', description: 'Rich in vitamins A and C, supporting immune health and giving that classic tropical sweetness.' },
      { name: 'Jackfruit', description: 'Exotic fruit with a unique honey-pineapple flavor, rich in antioxidants and fiber.' },
      { name: 'Pineapple', description: 'Adds tropical zing and contains bromelain for digestive health.' },
      { name: 'Turmeric', description: 'Golden spice with powerful anti-inflammatory properties and subtle earthy warmth.' },
    ],
    prepSteps: [
      'Fill cup to top with your preferred liquid (coconut water for extra tropical flavor).',
      'Pour into a blender and blend until smooth.',
      'Pour back into your cup and taste the tropics.',
    ],
  },
  '14': {
    id: '14',
    name: 'Coffee Mushroom',
    tagline: 'Adaptogenic fuel for peak performance',
    price: 9.99,
    reviews: 203,
    rating: 4.8,
    badge: 'NEW',
    image: '/products/coffee-mushroom/transparent-glass-1.png',
    hoverImage: '/products/coffee-mushroom/transparent-glass-2.png',
    images: [
      '/products/coffee-mushroom/transparent-glass-1.png',
      '/products/coffee-mushroom/transparent-glass-2.png',
      '/products/coffee-mushroom/transparent-glass-3.png',
      '/products/coffee-mushroom/product-1.jpg',
      '/products/coffee-mushroom/product-2.jpg',
      '/products/coffee-mushroom/product-3.jpg',
      '/products/coffee-mushroom/lifestyle-1.jpg',
      '/products/coffee-mushroom/lifestyle-2.jpg',
      '/products/coffee-mushroom/lifestyle-3.jpg',
      '/products/coffee-mushroom/detail-1.jpg',
    ],
    description: 'Elevate your morning ritual with our adaptogenic Coffee Mushroom blend. Premium cold brew meets powerful lion\'s mane and chaga mushrooms for focus, clarity, and sustained energy without the crash. A smooth, earthy coffee experience that supports your mind and body.',
    ingredients: ['organic cold brew coffee', 'organic lion\'s mane mushroom', 'organic chaga mushroom', 'organic cacao', 'organic coconut cream', 'organic dates'],
    nutrition: {
      calories: '120',
      fat: '4g',
      carbs: '18g',
      fiber: '3g',
      protein: '3g',
      sugars: '10g',
    },
    attributes: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'No Sugar Added'],
    keyIngredients: [
      { name: 'Lion\'s Mane', description: 'Powerful nootropic mushroom that supports cognitive function, memory, and mental clarity.' },
      { name: 'Chaga', description: 'King of medicinal mushrooms, packed with antioxidants and immune-supporting properties.' },
      { name: 'Cold Brew Coffee', description: 'Smooth, less acidic coffee for sustained energy without the jitters.' },
      { name: 'Cacao', description: 'Raw chocolate adds mood-boosting compounds and rich, earthy depth.' },
    ],
    prepSteps: [
      'Fill cup to top with your preferred liquid (oat milk for the creamiest result).',
      'Pour into a blender and blend until smooth.',
      'Pour back into your cup and fuel your focus.',
    ],
  },
  '15': {
    id: '15',
    name: 'Chocolate Berry',
    tagline: 'Decadent chocolate meets antioxidant berries',
    price: 8.99,
    reviews: 278,
    rating: 4.8,
    badge: 'NEW',
    image: '/products/chocolate-berry/transparent-glass-1.png',
    hoverImage: '/products/chocolate-berry/transparent-glass-2.png',
    images: [
      '/products/chocolate-berry/transparent-glass-1.png',
      '/products/chocolate-berry/transparent-glass-2.png',
      '/products/chocolate-berry/transparent-glass-3.png',
      '/products/chocolate-berry/product-1.jpg',
      '/products/chocolate-berry/product-2.jpg',
      '/products/chocolate-berry/product-3.jpg',
      '/products/chocolate-berry/lifestyle-1.jpg',
      '/products/chocolate-berry/lifestyle-2.jpg',
      '/products/chocolate-berry/lifestyle-3.jpg',
      '/products/chocolate-berry/detail-1.jpg',
    ],
    description: 'Indulge in the perfect harmony of rich chocolate and vibrant mixed berries. Our Chocolate Berry smoothie delivers an antioxidant powerhouse disguised as a decadent dessert. Creamy cacao blends with strawberries, blueberries, and raspberries for a guilt-free treat.',
    ingredients: ['organic cacao powder', 'organic strawberries', 'organic blueberries', 'organic raspberries', 'organic banana', 'organic almond butter', 'organic dates'],
    nutrition: {
      calories: '165',
      fat: '5g',
      carbs: '28g',
      fiber: '7g',
      protein: '4g',
      sugars: '16g',
    },
    attributes: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'No Sugar Added'],
    keyIngredients: [
      { name: 'Cacao', description: 'Raw chocolate packed with flavonoids, magnesium, and mood-enhancing compounds for a healthy indulgence.' },
      { name: 'Mixed Berries', description: 'Strawberries, blueberries, and raspberries deliver a potent mix of antioxidants and vitamins.' },
      { name: 'Almond Butter', description: 'Adds creamy richness plus protein, healthy fats, and vitamin E.' },
      { name: 'Banana', description: 'Natural sweetness and creamy texture with potassium for muscle support.' },
    ],
    prepSteps: [
      'Fill cup to top with your preferred liquid (almond milk pairs perfectly).',
      'Pour into a blender and blend until smooth and creamy.',
      'Pour back into your cup and enjoy the chocolatey goodness.',
    ],
  },
  '16': {
    id: '16',
    name: 'Almond',
    tagline: 'Pure nutty bliss in every sip',
    price: 8.99,
    reviews: 312,
    rating: 4.9,
    badge: 'NEW',
    image: '/products/almond/transparent-glass-1.png',
    hoverImage: '/products/almond/transparent-glass-2.png',
    images: [
      '/products/almond/transparent-glass-1.png',
      '/products/almond/transparent-glass-2.png',
      '/products/almond/transparent-glass-3.png',
      '/products/almond/product-1.jpg',
      '/products/almond/product-2.jpg',
      '/products/almond/product-3.jpg',
      '/products/almond/lifestyle-1.jpg',
      '/products/almond/lifestyle-2.jpg',
      '/products/almond/lifestyle-3.jpg',
      '/products/almond/detail-1.jpg',
    ],
    description: 'Experience the smooth, creamy goodness of our Almond smoothie. Made with rich almond butter, wholesome oats, and a touch of vanilla, this nutty delight delivers satisfying protein and healthy fats. Perfect for a nourishing breakfast or post-workout recovery.',
    ingredients: ['organic almond butter', 'organic almonds', 'organic oats', 'organic banana', 'organic vanilla extract', 'organic maple syrup', 'organic flax seeds'],
    nutrition: {
      calories: '195',
      fat: '10g',
      carbs: '22g',
      fiber: '5g',
      protein: '7g',
      sugars: '12g',
    },
    attributes: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'No Sugar Added'],
    keyIngredients: [
      { name: 'Almond Butter', description: 'Creamy and rich, packed with vitamin E, magnesium, and heart-healthy monounsaturated fats.' },
      { name: 'Almonds', description: 'Crunchy whole almonds add texture and extra protein for sustained energy.' },
      { name: 'Oats', description: 'Heart-healthy fiber keeps you full and provides slow-releasing energy.' },
      { name: 'Vanilla', description: 'Pure vanilla adds aromatic sweetness and depth to the nutty flavor profile.' },
    ],
    prepSteps: [
      'Fill cup to top with your preferred liquid (almond milk for extra nutty flavor).',
      'Pour into a blender and blend until smooth and creamy.',
      'Pour back into your cup and savor the nutty goodness.',
    ],
  },
  '17': {
    id: '17',
    name: 'Acai',
    tagline: 'Amazonian superfruit power',
    price: 9.49,
    reviews: 487,
    rating: 4.9,
    badge: 'BEST SELLER',
    image: '/products/acai/transparent-glass-1.png',
    hoverImage: '/products/acai/transparent-glass-2.png',
    images: [
      '/products/acai/transparent-glass-1.png',
      '/products/acai/transparent-glass-2.png',
      '/products/acai/transparent-glass-3.png',
      '/products/acai/product-1.jpg',
      '/products/acai/product-2.jpg',
      '/products/acai/product-3.jpg',
      '/products/acai/lifestyle-1.jpg',
      '/products/acai/lifestyle-2.jpg',
      '/products/acai/lifestyle-3.jpg',
      '/products/acai/detail-1.jpg',
    ],
    description: 'Harness the legendary power of the Amazon with our Acai smoothie. This deep purple superfruit is loaded with antioxidants, omega fatty acids, and natural energy. Blended with mixed berries and banana for a refreshing, nutrient-dense treat that fuels your day.',
    ingredients: ['organic acai puree', 'organic blueberries', 'organic strawberries', 'organic banana', 'organic coconut water', 'organic honey', 'organic chia seeds'],
    nutrition: {
      calories: '170',
      fat: '6g',
      carbs: '26g',
      fiber: '5g',
      protein: '3g',
      sugars: '18g',
    },
    attributes: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'No Sugar Added'],
    keyIngredients: [
      { name: 'Acai', description: 'Amazonian superfruit with one of the highest antioxidant scores, supporting heart and brain health.' },
      { name: 'Blueberries', description: 'Antioxidant powerhouse that supports cognitive function and provides natural sweetness.' },
      { name: 'Chia Seeds', description: 'Tiny seeds packed with omega-3s, fiber, and protein for sustained energy.' },
      { name: 'Coconut Water', description: 'Natural electrolytes for hydration and a subtle tropical sweetness.' },
    ],
    prepSteps: [
      'Fill cup to top with your preferred liquid (coconut water recommended).',
      'Pour into a blender and blend until smooth and creamy.',
      'Pour back into your cup and enjoy the superfruit boost.',
    ],
  },
};

const ModernArrowDown = ({ isOpen }: { isOpen: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  }}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const ModernArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const ModernArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

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
          color: '#000',
        }}
      >
        <span>{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', color: '#000' }}>
          <ModernArrowDown isOpen={isOpen} />
        </div>
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
  const [relatedScrollPosition, setRelatedScrollPosition] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMainImageHovered, setIsMainImageHovered] = useState(false);

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
      <div className="gradient-animated" style={{ padding: '60px', background: 'linear-gradient(-45deg, #ffffff, #f8f9fa, #ffffff, #f0f0f0)', backgroundSize: '400% 400%' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Product Header with Badge */}
          <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            {product.badge && (
              <div className="tech-shine" style={{
                background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '800',
                letterSpacing: '1px',
                borderRadius: '20px',
                boxShadow: '0 4px 12px rgba(66, 133, 244, 0.2)',
              }}>
                {product.badge}
              </div>
            )}
          </div>

          {/* Main Product Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', marginBottom: '100px' }}>
            {/* Left: Product Image Carousel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Main Image */}
              <div 
                style={{ 
                  position: 'relative',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  aspectRatio: '1 / 1',
                  width: '100%',
                  maxWidth: '560px',
                  cursor: product.hoverImage ? 'pointer' : 'default',
                }}
                onMouseEnter={() => product.hoverImage && setIsMainImageHovered(true)}
                onMouseLeave={() => product.hoverImage && setIsMainImageHovered(false)}
              >
                <img
                  src={
                    isMainImageHovered && product.hoverImage && currentImageIndex === 0
                      ? product.hoverImage
                      : (product.images ? product.images[currentImageIndex] : product.image)
                  }
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transition: 'all 0.4s ease',
                    transform: isMainImageHovered && currentImageIndex === 0 ? 'scale(1.02)' : 'scale(1)',
                  }}
                />
                
                {/* Navigation Arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => (prev - 1 + product.images.length) % product.images.length)}
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: '#ffffff',
                        border: '1px solid #e0e0e0',
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        color: '#000',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        zIndex: 10,
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#000';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.borderColor = '#000';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.color = '#000';
                        e.currentTarget.style.borderColor = '#e0e0e0';
                      }}
                    >
                      <ModernArrowLeft />
                    </button>

                    <button
                      onClick={() => setCurrentImageIndex(prev => (prev + 1) % product.images.length)}
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: '#ffffff',
                        border: '1px solid #e0e0e0',
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        color: '#000',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        zIndex: 10,
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#000';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.borderColor = '#000';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.color = '#000';
                        e.currentTarget.style.borderColor = '#e0e0e0';
                      }}
                    >
                      <ModernArrowRight />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip - Scrollable Single Row */}
              {product.images && product.images.length > 1 && (
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  paddingBottom: '8px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#ccc transparent',
                }}>
                  {product.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      style={{
                        width: '64px',
                        minWidth: '64px',
                        height: '64px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: idx === currentImageIndex ? '2px solid #000' : '2px solid #e0e0e0',
                        padding: 0,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        opacity: idx === currentImageIndex ? 1 : 0.7,
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        if (idx !== currentImageIndex) {
                          e.currentTarget.style.opacity = '1';
                          e.currentTarget.style.borderColor = '#999';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (idx !== currentImageIndex) {
                          e.currentTarget.style.opacity = '0.7';
                          e.currentTarget.style.borderColor = '#e0e0e0';
                        }
                      }}
                    >
                      <img
                        src={img}
                        alt={`${product.name} - View ${idx + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
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
              <h1 className="heading-2100 text-glow" style={{
                fontSize: '56px',
                margin: '0 0 16px 0',
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
                      cursor: selectedIngredient > 0 ? 'pointer' : 'default',
                      color: '#000',
                      opacity: selectedIngredient > 0 ? 0.6 : 0.2,
                      transition: 'opacity 0.2s',
                      padding: '0',
                      flex: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedIngredient > 0) e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      if (selectedIngredient > 0) e.currentTarget.style.opacity = '0.6';
                    }}
                    disabled={selectedIngredient === 0}
                  >
                    <ModernArrowLeft />
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
                      cursor: selectedIngredient < product.keyIngredients.length - 2 ? 'pointer' : 'default',
                      color: '#000',
                      opacity: selectedIngredient < product.keyIngredients.length - 2 ? 0.6 : 0.2,
                      transition: 'opacity 0.2s',
                      padding: '0',
                      flex: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedIngredient < product.keyIngredients.length - 2) e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      if (selectedIngredient < product.keyIngredients.length - 2) e.currentTarget.style.opacity = '0.6';
                    }}
                    disabled={selectedIngredient >= product.keyIngredients.length - 2}
                  >
                    <ModernArrowRight />
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
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}>
                {/* Left Arrow */}
                <button
                  onClick={() => {
                    setRelatedScrollPosition(Math.max(0, relatedScrollPosition - 1));
                  }}
                  style={{
                    position: 'absolute',
                    left: '-40px',
                    zIndex: 10,
                    background: '#000',
                    border: 'none',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: relatedScrollPosition > 0 ? 'pointer' : 'default',
                    color: '#ffffff',
                    opacity: relatedScrollPosition > 0 ? 1 : 0.3,
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (relatedScrollPosition > 0) e.currentTarget.style.opacity = '0.8';
                  }}
                  onMouseLeave={(e) => {
                    if (relatedScrollPosition > 0) e.currentTarget.style.opacity = '1';
                  }}
                  disabled={relatedScrollPosition === 0}
                >
                  <ModernArrowLeft />
                </button>

                {/* Products Container */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '32px',
                  width: '100%',
                }}>
                  {relatedProducts.slice(relatedScrollPosition, relatedScrollPosition + 4).map((relProduct: any) => (
                    <Link
                      key={relProduct.id}
                      href={`/product/${relProduct.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div
                        style={{
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
                          marginBottom: '16px',
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
                          fontSize: '14px',
                          fontWeight: '700',
                          marginBottom: '8px',
                          letterSpacing: '-0.3px',
                        }}>
                          {relProduct.name}
                        </h3>
                        <p style={{
                          fontSize: '12px',
                          color: '#79747e',
                          marginBottom: '8px',
                          letterSpacing: '-0.2px',
                        }}>
                          {relProduct.type || 'Smoothie'}
                        </p>
                        <p style={{
                          fontSize: '12px',
                          color: '#79747e',
                          marginBottom: '8px',
                          letterSpacing: '-0.2px',
                        }}>
                          {'★'.repeat(Math.floor(relProduct.rating))}{'☆'.repeat(5 - Math.floor(relProduct.rating))} {relProduct.reviews.toLocaleString()} reviews
                        </p>
                        <p style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          letterSpacing: '-0.3px',
                        }}>
                          ${relProduct.price.toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Right Arrow */}
                <button
                  onClick={() => {
                    setRelatedScrollPosition(Math.min(relatedProducts.length - 4, relatedScrollPosition + 1));
                  }}
                  style={{
                    position: 'absolute',
                    right: '-40px',
                    zIndex: 10,
                    background: '#000',
                    border: 'none',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: relatedScrollPosition < relatedProducts.length - 4 ? 'pointer' : 'default',
                    color: '#ffffff',
                    opacity: relatedScrollPosition < relatedProducts.length - 4 ? 1 : 0.3,
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (relatedScrollPosition < relatedProducts.length - 4) e.currentTarget.style.opacity = '0.8';
                  }}
                  onMouseLeave={(e) => {
                    if (relatedScrollPosition < relatedProducts.length - 4) e.currentTarget.style.opacity = '1';
                  }}
                  disabled={relatedScrollPosition >= relatedProducts.length - 4}
                >
                  <ModernArrowRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
