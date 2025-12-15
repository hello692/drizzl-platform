import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SmoothieCard from '../../components/SmoothieCard';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useAutoScroll } from '../../hooks/useAutoScroll';

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

interface NutritionFact {
  label: string;
  value: string;
  dv?: number | null;
  indent?: boolean;
  subIndent?: boolean;
}

interface NutritionHighlight {
  label: string;
  value: string;
  percent: number;
  color: string;
}

interface EnhancedNutrition {
  servingSize: string;
  servingsPerContainer: number;
  calories: number;
  facts: NutritionFact[];
  highlights: NutritionHighlight[];
}

interface ProductData {
  id: string;
  name: string;
  price: number;
  image: string;
  shortDescription: string;
  tagline: string;
  rating: { average: number; count: number };
  gallery: string[];
  lifestyleGallery: { src: string; alt: string }[];
  description: string;
  ingredients: string;
  nutrition: { label: string; value: string }[] | EnhancedNutrition;
  keyIngredients: { name: string; benefit: string; image: string }[];
  badges: string[];
}

const DEFAULT_LIFESTYLE_GALLERY = [
  { src: '/lifestyle/DSC09048-1.jpg', alt: 'Lifestyle 1' },
  { src: '/lifestyle/DSC09063.jpg', alt: 'Lifestyle 2' },
  { src: '/lifestyle/DSC09073-1-2.jpg', alt: 'Lifestyle 3' },
  { src: '/lifestyle/DSC09091.jpg', alt: 'Lifestyle 4' },
  { src: '/lifestyle/DSC09092.jpg', alt: 'Lifestyle 5' },
  { src: '/lifestyle/DSC09108-2.jpg', alt: 'Lifestyle 6' },
];

const PRODUCT_DATA: Record<string, ProductData> = {
  '1': {
    id: '1',
    name: 'Strawberry + Peachy',
    price: 8.49,
    image: '/products/strawberry-peach/1.png',
    shortDescription: 'Big flavor energy: juicy strawberries, lush peaches, pure magic.',
    tagline: 'Big flavor energy: juicy strawberries, lush peaches, pure magic.',
    rating: { average: 4.5, count: 4619 },
    gallery: [
      '/products/strawberry-peach/1.png',
      '/products/strawberry-peach/2.png',
      '/products/strawberry-peach/3.png',
      '/products/strawberry-peach/4.png',
      '/products/strawberry-peach/5.png',
      '/products/strawberry-peach/6.png',
    ],
    lifestyleGallery: [
      { src: '/products/strawberry-peach/lifestyle/1.jpg', alt: 'Strawberry Peach Lifestyle 1' },
      { src: '/products/strawberry-peach/lifestyle/2.jpg', alt: 'Strawberry Peach Lifestyle 2' },
      { src: '/products/strawberry-peach/lifestyle/3.jpg', alt: 'Strawberry Peach Lifestyle 3' },
      { src: '/products/strawberry-peach/lifestyle/4.jpg', alt: 'Strawberry Peach Lifestyle 4' },
      { src: '/products/strawberry-peach/lifestyle/5.jpg', alt: 'Strawberry Peach Lifestyle 5' },
      { src: '/products/strawberry-peach/lifestyle/6.jpg', alt: 'Strawberry Peach Lifestyle 6' },
    ],
    description: "This smoothie doesn't play by the rules. Juicy peach, sassy strawberry, and tangy raspberry bring the flavor chaos, while banana and oats keep it smooth and satisfying. And those goji berries? They're the antioxidant badasses your body didn't know it needed. Sip loud, live bold.",
    ingredients: 'Organic peaches, bananas, raspberries, gluten-free whole grain oats, and goji berries—all certified organic. For precise nutrition, ingredient, and allergen details, check the product label.',
    nutrition: {
      servingSize: '209g',
      servingsPerContainer: 1,
      calories: 180,
      facts: [
        { label: 'Total Fat', value: '3g', dv: 4 },
        { label: 'Saturated Fat', value: '0.4g', dv: 2, indent: true },
        { label: 'Trans Fat', value: '0g', dv: null, indent: true },
        { label: 'Cholesterol', value: '0mg', dv: 0 },
        { label: 'Sodium', value: '5mg', dv: 0 },
        { label: 'Total Carbohydrate', value: '35g', dv: 13 },
        { label: 'Dietary Fiber', value: '5g', dv: 21, indent: true },
        { label: 'Total Sugars', value: '19g', dv: null, indent: true },
        { label: 'Incl. Added Sugars', value: '0g', dv: 0, indent: true, subIndent: true },
        { label: 'Protein', value: '4g', dv: 8 },
      ],
      highlights: [
        { label: 'Fiber', value: '5g', percent: 21, color: '#10b981' },
        { label: 'Protein', value: '4g', percent: 8, color: '#8b5cf6' },
        { label: 'Carbs', value: '35g', percent: 13, color: '#f59e0b' },
      ]
    },
    keyIngredients: [
      { name: 'Strawberry', benefit: 'Bursting with vitamin C, fiber, and folate—your antioxidant BFF.', image: '/ingredients/strawberry.png' },
      { name: 'Banana', benefit: 'The potassium powerhouse that keeps things smooth and sweet.', image: '/ingredients/banana.png' },
      { name: 'Peach', benefit: 'Vitamins A and C for immune boosts and that lit-from-within glow.', image: '/ingredients/peach.png' },
      { name: 'Raspberry', benefit: 'Fiber and antioxidants to keep your gut and heart doing happy dances.', image: '/ingredients/raspberry.png' },
      { name: 'Oats', benefit: "Heart-healthy grains for energy that doesn't quit.", image: '/ingredients/oats.png' },
      { name: 'Goji Berry', benefit: 'The superfood rebel, loaded with amino acids and beta-carotene.', image: '/ingredients/goji.png' },
    ],
    badges: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'No Sugar Added'],
  },
  '9': {
    id: '9',
    name: 'Pink Piyata',
    price: 8.99,
    image: '/products/pink-piyata/gallery-1.jpg',
    shortDescription: 'Tropical dragon fruit',
    tagline: 'a tropical paradise in every sip',
    rating: { average: 4.8, count: 3842 },
    gallery: [
      '/products/pink-piyata/gallery-1.jpg',
      '/products/pink-piyata/gallery-2.jpg',
      '/products/pink-piyata/gallery-3.jpg',
      '/products/pink-piyata/gallery-4.jpg',
      '/products/pink-piyata/gallery-5.jpg',
      '/products/pink-piyata/gallery-6.jpg',
      '/products/pink-piyata/gallery-7.jpg',
      '/products/pink-piyata/gallery-8.jpg',
      '/products/pink-piyata/gallery-9.jpg',
      '/products/pink-piyata/gallery-10.jpg',
      '/products/pink-piyata/gallery-11.jpg',
      '/products/pink-piyata/gallery-12.jpg',
      '/products/pink-piyata/gallery-13.jpg',
      '/products/pink-piyata/gallery-14.jpg',
      '/products/pink-piyata/gallery-15.jpg',
      '/products/pink-piyata/gallery-16.jpg',
      '/products/pink-piyata/gallery-17.jpg',
    ],
    lifestyleGallery: DEFAULT_LIFESTYLE_GALLERY,
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
    image: '/products/matcha/gallery-1.jpg',
    shortDescription: 'Zen in a cup',
    tagline: 'calm focus meets creamy indulgence',
    rating: { average: 4.7, count: 2156 },
    gallery: [
      '/products/matcha/gallery-1.jpg',
      '/products/matcha/gallery-2.jpg',
      '/products/matcha/gallery-3.jpg',
      '/products/matcha/gallery-4.jpg',
      '/products/matcha/gallery-5.jpg',
      '/products/matcha/gallery-6.jpg',
      '/products/matcha/gallery-7.jpg',
      '/products/matcha/gallery-8.jpg',
      '/products/matcha/gallery-9.jpg',
      '/products/matcha/gallery-10.jpg',
      '/products/matcha/gallery-11.jpg',
      '/products/matcha/gallery-12.jpg',
      '/products/matcha/gallery-13.jpg',
      '/products/matcha/gallery-14.jpg',
      '/products/matcha/gallery-15.jpg',
    ],
    lifestyleGallery: DEFAULT_LIFESTYLE_GALLERY,
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
  '11': {
    id: '11',
    name: 'Mocha',
    price: 9.49,
    image: '/products/mocha/gallery-1.jpg',
    shortDescription: 'Chocolate coffee bliss',
    tagline: 'rich chocolate meets smooth espresso',
    rating: { average: 4.8, count: 2847 },
    gallery: [
      '/products/mocha/gallery-1.jpg',
      '/products/mocha/gallery-2.jpg',
      '/products/mocha/gallery-3.jpg',
      '/products/mocha/gallery-4.jpg',
      '/products/mocha/gallery-5.jpg',
      '/products/mocha/gallery-6.jpg',
      '/products/mocha/gallery-7.jpg',
      '/products/mocha/gallery-8.jpg',
      '/products/mocha/gallery-9.jpg',
      '/products/mocha/gallery-10.jpg',
      '/products/mocha/gallery-11.jpg',
      '/products/mocha/gallery-12.jpg',
      '/products/mocha/gallery-13.jpg',
      '/products/mocha/gallery-14.jpg',
    ],
    lifestyleGallery: DEFAULT_LIFESTYLE_GALLERY,
    description: 'Indulge in the perfect marriage of rich chocolate and smooth espresso. This creamy mocha blend delivers coffeehouse vibes without leaving home. Made with organic cold brew, raw cacao, and banana for natural sweetness that satisfies your cravings guilt-free.',
    ingredients: 'organic cold brew coffee, organic cacao powder, organic banana, organic almond butter, organic dates, organic oat milk, organic vanilla extract',
    nutrition: [
      { label: 'Calories', value: '190' },
      { label: 'Total Fat', value: '5g' },
      { label: 'Carbs', value: '28g' },
      { label: 'Fiber', value: '5g' },
      { label: 'Sugars', value: '14g' },
      { label: 'Protein', value: '5g' },
    ],
    keyIngredients: [
      { name: 'Cold Brew', benefit: 'Smooth, less acidic caffeine for steady, sustained energy.', image: '/ingredients/coffee.png' },
      { name: 'Cacao', benefit: 'Rich in antioxidants and natural mood-boosting compounds.', image: '/ingredients/cacao.png' },
      { name: 'Banana', benefit: 'Natural sweetness with potassium for muscle recovery.', image: '/ingredients/banana.png' },
      { name: 'Almond Butter', benefit: 'Healthy fats and protein for lasting satiety.', image: '/ingredients/almond.png' },
      { name: 'Dates', benefit: 'Natural sweetener packed with fiber and minerals.', image: '/ingredients/dates.png' },
      { name: 'Oat Milk', benefit: 'Creamy texture with heart-healthy beta-glucan fiber.', image: '/ingredients/oatmilk.png' },
    ],
    badges: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'Caffeine'],
  },
  '14': {
    id: '14',
    name: 'Coffee Mushroom',
    price: 9.99,
    image: '/products/mushroom-coffee/Coffr Mushroom-TG-1.png',
    shortDescription: 'Adaptogenic energy',
    tagline: 'your morning coffee evolved',
    rating: { average: 4.6, count: 1893 },
    gallery: [
      '/products/mushroom-coffee/Coffr Mushroom-TG-1.png',
      '/products/mushroom-coffee/Coffr Mushroom-TG-2.png',
      '/products/mushroom-coffee/Coffr Mushroom-TG-3.png',
      '/products/mushroom-coffee/DSC07772.png',
      '/products/mushroom-coffee/DSC07777-2.png',
      '/products/mushroom-coffee/DSC07787.png',
    ],
    lifestyleGallery: [
      { src: '/lifestyle/coffee-mushroom-1.jpg', alt: 'Coffee Mushroom lifestyle 1' },
      { src: '/lifestyle/coffee-mushroom-2.jpg', alt: 'Coffee Mushroom lifestyle 2' },
      { src: '/lifestyle/coffee-mushroom-3.jpg', alt: 'Coffee Mushroom lifestyle 3' },
      { src: '/lifestyle/coffee-mushroom-4.jpg', alt: 'Coffee Mushroom lifestyle 4' },
      { src: '/lifestyle/coffee-mushroom-5.jpg', alt: 'Coffee Mushroom lifestyle 5' },
      { src: '/lifestyle/coffee-mushroom-6.jpg', alt: 'Coffee Mushroom lifestyle 6' },
      { src: '/lifestyle/coffee-mushroom-7.png', alt: 'Coffee Mushroom lifestyle 7' },
      { src: '/lifestyle/coffee-mushroom-8.png', alt: 'Coffee Mushroom lifestyle 8' },
      { src: '/lifestyle/coffee-mushroom-9.jpg', alt: 'Coffee Mushroom lifestyle 9' },
      { src: '/lifestyle/coffee-mushroom-10.jpg', alt: 'Coffee Mushroom lifestyle 10' },
      { src: '/lifestyle/coffee-mushroom-11.jpg', alt: 'Coffee Mushroom lifestyle 11' },
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
  '15': {
    id: '15',
    name: 'Chocolate Berry',
    price: 8.99,
    image: '/products/chocolate-berry/Chocolate Berry-1.png',
    shortDescription: 'Decadent & nutritious',
    tagline: 'indulgence meets wellness',
    rating: { average: 4.8, count: 2891 },
    gallery: [
      '/products/chocolate-berry/Chocolate Berry-1.png',
      '/products/chocolate-berry/Chocolate Berry-2.png',
      '/products/chocolate-berry/Chocolate Berry-3.png',
      '/products/chocolate-berry/Chocolate Berry-4.png',
      '/products/chocolate-berry/Chocolate Berry-5.png',
      '/products/chocolate-berry/Chocolate Berry-6.png',
    ],
    lifestyleGallery: [
      { src: '/lifestyle/DSC09048-1Chocolate Berry.jpg', alt: 'Chocolate Berry lifestyle 1' },
      { src: '/lifestyle/DSC08472.jpg', alt: 'Chocolate Berry lifestyle 2' },
      { src: '/lifestyle/DSC09073-1-2Chocolate berry.jpg', alt: 'Chocolate Berry lifestyle 3' },
      { src: '/lifestyle/DSC09300.jpg', alt: 'Chocolate Berry lifestyle 4' },
      { src: '/lifestyle/DSC09302.jpg', alt: 'Chocolate Berry lifestyle 5' },
    ],
    description: 'Satisfy your chocolate cravings without the guilt. Rich organic cacao meets antioxidant-packed berries in this decadent yet nutritious blend. Dark chocolate depth balanced with bright berry notes, creamy almond butter, and a hint of vanilla. Dessert for breakfast? Yes, please.',
    ingredients: 'organic cacao powder, organic raspberries, organic strawberries, organic blueberries, organic almond butter, organic banana, organic vanilla, organic almond milk',
    nutrition: [
      { label: 'Calories', value: '240' },
      { label: 'Total Fat', value: '9g' },
      { label: 'Carbs', value: '35g' },
      { label: 'Fiber', value: '8g' },
      { label: 'Sugars', value: '18g' },
      { label: 'Protein', value: '6g' },
    ],
    keyIngredients: [
      { name: 'Cacao', benefit: 'Rich in flavonoids and mood-boosting compounds for mental wellness.', image: '/ingredients/cacao.png' },
      { name: 'Raspberries', benefit: 'Fiber-rich berries with powerful antioxidants for cellular health.', image: '/ingredients/raspberry.png' },
      { name: 'Strawberries', benefit: 'Vitamin C powerhouse for immune support and skin health.', image: '/ingredients/strawberry.png' },
      { name: 'Blueberries', benefit: 'Brain-boosting antioxidants for cognitive function.', image: '/ingredients/blueberry.png' },
      { name: 'Almond Butter', benefit: 'Healthy fats and protein for sustained energy and satiety.', image: '/ingredients/almondbutter.png' },
      { name: 'Banana', benefit: 'Natural sweetness and potassium for muscle recovery.', image: '/ingredients/banana.png' },
    ],
    badges: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'Antioxidant'],
  },
  '16': {
    id: '16',
    name: 'Almond',
    price: 8.99,
    image: '/products/almond/Almond-1.png',
    shortDescription: 'Creamy & nutty',
    tagline: 'pure almond bliss',
    rating: { average: 4.7, count: 1876 },
    gallery: [
      '/products/almond/Almond-1.png',
      '/products/almond/Almond-2.png',
      '/products/almond/Almond-3.png',
      '/products/almond/Almond-4.png',
      '/products/almond/Almond-5.png',
      '/products/almond/Almond-6.png',
    ],
    lifestyleGallery: [
      { src: '/lifestyle/DSC08818.jpg', alt: 'Almond lifestyle 1' },
      { src: '/lifestyle/DSC08825.jpg', alt: 'Almond lifestyle 2' },
      { src: '/lifestyle/DSC08827.jpg', alt: 'Almond lifestyle 3' },
      { src: '/lifestyle/DSC08836.jpg', alt: 'Almond lifestyle 4' },
      { src: '/lifestyle/DSC08837.jpg', alt: 'Almond lifestyle 5' },
      { src: '/lifestyle/DSC09048-1Almond.jpg', alt: 'Almond lifestyle 6' },
      { src: '/lifestyle/DSC09073-1-2Almond.jpg', alt: 'Almond lifestyle 7' },
    ],
    description: 'Experience the pure, creamy goodness of almonds in every sip. This smooth and satisfying blend combines rich almond butter with vanilla, a touch of honey, and warming spices. Perfect for those who love the simple pleasures of nutty, wholesome ingredients.',
    ingredients: 'organic almond butter, organic almond milk, organic banana, organic honey, organic vanilla, organic cinnamon, organic dates, organic flax seeds',
    nutrition: [
      { label: 'Calories', value: '260' },
      { label: 'Total Fat', value: '12g' },
      { label: 'Carbs', value: '30g' },
      { label: 'Fiber', value: '5g' },
      { label: 'Sugars', value: '18g' },
      { label: 'Protein', value: '8g' },
    ],
    keyIngredients: [
      { name: 'Almond Butter', benefit: 'Healthy fats and protein for sustained energy and heart health.', image: '/ingredients/almondbutter.png' },
      { name: 'Almond Milk', benefit: 'Light and creamy base with vitamin E for skin health.', image: '/ingredients/almondmilk.png' },
      { name: 'Banana', benefit: 'Natural sweetness and potassium for muscle recovery.', image: '/ingredients/banana.png' },
      { name: 'Honey', benefit: 'Natural sweetener with antibacterial properties.', image: '/ingredients/honey.png' },
      { name: 'Cinnamon', benefit: 'Warming spice that helps regulate blood sugar.', image: '/ingredients/cinnamon.png' },
      { name: 'Dates', benefit: 'Natural sweetness with fiber and essential minerals.', image: '/ingredients/dates.png' },
    ],
    badges: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'High Protein'],
  },
  '17': {
    id: '17',
    name: 'Acai',
    price: 9.49,
    image: '/products/acai/Acai-1.png',
    shortDescription: 'Amazonian superfruit',
    tagline: 'the Amazon in a cup',
    rating: { average: 4.9, count: 5234 },
    gallery: [
      '/products/acai/Acai-1.png',
      '/products/acai/Acai-2.png',
      '/products/acai/Acai-3.png',
      '/products/acai/Acai-4.png',
      '/products/acai/Acai-5.png',
      '/products/acai/Acai-6.png',
    ],
    lifestyleGallery: [
      { src: '/lifestyle/DSC09048-1.jpg', alt: 'Acai lifestyle 1' },
      { src: '/lifestyle/DSC09063.jpg', alt: 'Acai lifestyle 2' },
      { src: '/lifestyle/DSC09073-1-2.jpg', alt: 'Acai lifestyle 3' },
      { src: '/lifestyle/DSC09091.jpg', alt: 'Acai lifestyle 4' },
      { src: '/lifestyle/DSC09092.jpg', alt: 'Acai lifestyle 5' },
      { src: '/lifestyle/DSC09108-2.jpg', alt: 'Acai lifestyle 6' },
      { src: '/lifestyle/DSC09118.jpg', alt: 'Acai lifestyle 7' },
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
    image: '/products/nutty-monkey/gallery-1.jpg',
    shortDescription: 'Creamy peanut butter',
    tagline: 'the classic combo perfected',
    rating: { average: 4.8, count: 3567 },
    gallery: [
      '/products/nutty-monkey/gallery-1.jpg',
      '/products/nutty-monkey/gallery-2.jpg',
      '/products/nutty-monkey/gallery-3.jpg',
      '/products/nutty-monkey/gallery-4.jpg',
      '/products/nutty-monkey/gallery-5.jpg',
      '/products/nutty-monkey/gallery-6.jpg',
      '/products/nutty-monkey/gallery-7.jpg',
      '/products/nutty-monkey/gallery-8.jpg',
      '/products/nutty-monkey/gallery-9.jpg',
      '/products/nutty-monkey/gallery-10.jpg',
      '/products/nutty-monkey/gallery-11.jpg',
      '/products/nutty-monkey/gallery-12.jpg',
      '/products/nutty-monkey/gallery-13.jpg',
      '/products/nutty-monkey/gallery-14.jpg',
      '/products/nutty-monkey/gallery-15.jpg',
      '/products/nutty-monkey/gallery-16.jpg',
      '/products/nutty-monkey/gallery-17.jpg',
      '/products/nutty-monkey/gallery-18.jpg',
      '/products/nutty-monkey/gallery-19.jpg',
      '/products/nutty-monkey/gallery-20.jpg',
      '/products/nutty-monkey/gallery-21.jpg',
      '/products/nutty-monkey/gallery-22.jpg',
      '/products/nutty-monkey/gallery-23.jpg',
      '/products/nutty-monkey/gallery-24.jpg',
      '/products/nutty-monkey/gallery-25.jpg',
      '/products/nutty-monkey/gallery-26.jpg',
      '/products/nutty-monkey/gallery-27.jpg',
      '/products/nutty-monkey/gallery-28.jpg',
    ],
    lifestyleGallery: DEFAULT_LIFESTYLE_GALLERY,
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
  '13': {
    id: '13',
    name: 'Mango Jackfruit',
    price: 8.99,
    image: '/products/mango-jackfruit/Mango Jackfruit-1.png',
    shortDescription: 'Tropical paradise',
    tagline: 'sunshine in every sip',
    rating: { average: 4.8, count: 2134 },
    gallery: [
      '/products/mango-jackfruit/Mango Jackfruit-1.png',
      '/products/mango-jackfruit/Mango Jackfruit-2.png',
      '/products/mango-jackfruit/Mango Jackfruit-3.png',
      '/products/mango-jackfruit/Mango Jackfruit-4.png',
      '/products/mango-jackfruit/Mango Jackfruit-5.png',
      '/products/mango-jackfruit/Mango Jackfruit-5 (1).png',
      '/products/mango-jackfruit/Mango Jackfruit-7.png',
    ],
    lifestyleGallery: [
      { src: '/lifestyle/mango-jackfruit/Copy of 890A4590_out1.jpg', alt: 'Mango Jackfruit lifestyle' },
      { src: '/lifestyle/mango-jackfruit/Copy of 890A4611_out1.jpg', alt: 'Mango Jackfruit lifestyle' },
      { src: '/lifestyle/mango-jackfruit/Copy of 890A5348_out1.jpg', alt: 'Mango Jackfruit lifestyle' },
      { src: '/lifestyle/mango-jackfruit/Copy of 890A5363_out1.jpg', alt: 'Mango Jackfruit lifestyle' },
      { src: '/lifestyle/mango-jackfruit/Copy of 890A5382_out1.jpg', alt: 'Mango Jackfruit lifestyle' },
      { src: '/lifestyle/mango-jackfruit/Copy of 890A5405_out1.jpg', alt: 'Mango Jackfruit lifestyle' },
      { src: '/lifestyle/mango-jackfruit/Copy of 890A5435_out1.jpg', alt: 'Mango Jackfruit lifestyle' },
      { src: '/lifestyle/mango-jackfruit/Copy of 890A5450_out1.jpg', alt: 'Mango Jackfruit lifestyle' },
      { src: '/lifestyle/mango-jackfruit/Copy of 890A5454_out1.jpg', alt: 'Mango Jackfruit lifestyle' },
      { src: '/lifestyle/mango-jackfruit/Copy of 890A5458_out1.jpg', alt: 'Mango Jackfruit lifestyle' },
      { src: '/lifestyle/mango-jackfruit/Copy of 890A5484_out1.jpg', alt: 'Mango Jackfruit lifestyle' },
      { src: '/lifestyle/mango-jackfruit/Copy of 890A5536_out1.jpg', alt: 'Mango Jackfruit lifestyle' },
      { src: '/lifestyle/mango-jackfruit/DSC08704.jpg', alt: 'Mango Jackfruit lifestyle' },
      { src: '/lifestyle/mango-jackfruit/DSC09048-1Mango Jackfruit.jpg', alt: 'Mango Jackfruit lifestyle' },
      { src: '/lifestyle/mango-jackfruit/DSC09073-1-2Mango Jackfruit.jpg', alt: 'Mango Jackfruit lifestyle' },
    ],
    description: 'Transport yourself to a tropical paradise with this exotic blend of sun-ripened mangoes and sweet jackfruit. Each sip delivers a burst of golden sunshine, balanced with creamy coconut and a hint of lime for the ultimate island escape.',
    ingredients: 'organic mango, organic jackfruit, organic coconut milk, organic lime juice, organic turmeric, organic ginger, organic coconut water',
    nutrition: [
      { label: 'Calories', value: '210' },
      { label: 'Total Fat', value: '5g' },
      { label: 'Carbs', value: '42g' },
      { label: 'Fiber', value: '4g' },
      { label: 'Sugars', value: '32g' },
      { label: 'Protein', value: '3g' },
    ],
    keyIngredients: [
      { name: 'Mango', benefit: 'Rich in vitamin C and beta-carotene for immune support and glowing skin.', image: '/ingredients/mango.png' },
      { name: 'Jackfruit', benefit: 'Natural sweetness with fiber and antioxidants for digestive health.', image: '/ingredients/jackfruit.png' },
      { name: 'Coconut Milk', benefit: 'Creamy texture with MCTs for sustained energy and brain function.', image: '/ingredients/coconutmilk.png' },
      { name: 'Turmeric', benefit: 'Powerful anti-inflammatory curcumin for joint and immune health.', image: '/ingredients/turmeric.png' },
      { name: 'Ginger', benefit: 'Aids digestion and provides natural anti-nausea benefits.', image: '/ingredients/ginger.png' },
      { name: 'Coconut Water', benefit: 'Natural hydration and electrolytes for recovery.', image: '/ingredients/coconutwater.png' },
    ],
    badges: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'Tropical'],
  },
};

const POPULAR_SMOOTHIES = [
  { id: '1', name: 'Strawberry + Peachy', price: 8.49, image: '/products/strawberry-peach/1.png', hoverImage: '/products/strawberry-peach/2.png', badge: 'BEST SELLER', rating: 4.5, reviews: 4619 },
  { id: '9', name: 'Pink Piyata', price: 8.99, image: '/products/pink-piyata/gallery-1.jpg', hoverImage: '/products/pink-piyata/gallery-2.jpg', badge: 'NEW', rating: 4.7, reviews: 127 },
  { id: '10', name: 'Matcha', price: 9.49, image: '/products/matcha/gallery-1.jpg', hoverImage: '/products/matcha/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.8, reviews: 312 },
  { id: '11', name: 'Mocha', price: 9.49, image: '/products/mocha/gallery-1.jpg', hoverImage: '/products/mocha/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.6, reviews: 245 },
  { id: '14', name: 'Coffee Mushroom', price: 9.99, image: '/products/coffee-mushroom/gallery-1.jpg', hoverImage: '/products/coffee-mushroom/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.8, reviews: 203 },
  { id: '17', name: 'Acai', price: 9.49, image: '/products/acai/Acai-1.png', hoverImage: '/products/acai/Acai-2.png', badge: 'BEST SELLER', rating: 4.9, reviews: 487 },
  { id: '12', name: 'Nutty Monkey', price: 8.99, image: '/products/nutty-monkey/gallery-1.jpg', hoverImage: '/products/nutty-monkey/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.7, reviews: 389 },
  { id: '13', name: 'Mango Jackfruit', price: 8.99, image: '/products/mango-jackfruit/Mango Jackfruit-1.png', hoverImage: '/products/mango-jackfruit/Mango Jackfruit-2.png', badge: 'NEW', rating: 4.8, reviews: 156 },
  { id: '15', name: 'Chocolate Berry', price: 8.99, image: '/products/chocolate-berry/gallery-1.jpg', hoverImage: '/products/chocolate-berry/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.8, reviews: 278 },
  { id: '16', name: 'Almond', price: 8.99, image: '/products/almond/Almond-1.png', hoverImage: '/products/almond/Almond-2.png', badge: 'BEST SELLER', rating: 4.7, reviews: 187 },
];

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const productId = typeof id === 'string' ? id : '';
  const productData = PRODUCT_DATA[productId];
  const product = POPULAR_SMOOTHIES.find(p => p.id === productId);
  
  const { user } = useAuth();
  const { addItem } = useCart(user?.id);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [openSections, setOpenSections] = useState({
    description: false,
    ingredients: false,
    nutrition: false,
    keyIngredients: false,
    howToPrep: false,
  });
  const [selectedIngredient, setSelectedIngredient] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  
  // Auto-scroll for lifestyle carousel with infinite loop
  const { trackRef: lifestyleTrackRef } = useAutoScroll({
    speed: 35,
    pauseOnInteraction: true,
    resumeDelay: 1500,
    direction: 'left',
  });
  
  // Accordion state for LV-style product info sections
  const [infoSections, setInfoSections] = useState({
    about: true,
    prepare: false,
    nutrition: false,
    delivery: false,
  });

  const handleAddToCart = async () => {
    if (!productData || isAddingToCart) return;
    setIsAddingToCart(true);
    try {
      await addItem(productId, 1, {
        id: productId,
        name: productData.name,
        price: productData.price,
        image_url: productData.image,
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

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

  // Product 9 - Side by Side Layout
  const renderProduct9Layout = () => (
    <section style={{
      paddingTop: '120px',
      paddingBottom: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '120px 48px 40px',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'start',
      }}>
        {/* Left Side - Images */}
        <div>
          <div style={{
            backgroundColor: '#f5f5f7',
            borderRadius: '24px',
            padding: '40px',
            marginBottom: '20px',
          }}>
            <img
              src={productData.gallery[selectedImageIndex]}
              alt={productData.name}
              loading="eager"
              style={{
                width: '100%',
                maxHeight: '500px',
                objectFit: 'contain',
              }}
            />
          </div>
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
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
                  loading="lazy"
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

        {/* Right Side - Product Info & Actions */}
        <div style={{ position: 'sticky', top: '120px' }}>
          <h1 style={{
            fontSize: '40px',
            fontWeight: '600',
            color: apple.textPrimary,
            margin: '0 0 12px 0',
            letterSpacing: '-0.02em',
            lineHeight: '1.1',
          }}>
            {productData.name}
          </h1>
          <p style={{
            fontSize: '18px',
            fontWeight: '400',
            color: apple.textSecondary,
            margin: '0 0 24px',
            lineHeight: '1.5',
          }}>
            {productData.tagline}
          </p>
          <p style={{
            fontSize: '28px',
            fontWeight: '600',
            color: apple.textPrimary,
            margin: '0 0 24px',
          }}>
            ${productData.price.toFixed(2)}
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '32px',
          }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: i < Math.floor(productData.rating.average) ? '#000' : '#ccc', fontSize: '18px' }}>★</span>
              ))}
            </div>
            <span style={{ fontSize: '14px', color: apple.textSecondary }}>
              ({productData.rating.count.toLocaleString()} reviews)
            </span>
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            style={{
              width: '100%',
              padding: '16px 32px',
              backgroundColor: addedToCart ? '#22c55e' : apple.accent,
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: '500',
              border: 'none',
              borderRadius: '980px',
              cursor: isAddingToCart ? 'wait' : 'pointer',
              transition: 'background-color 0.2s',
              marginBottom: '16px',
              opacity: isAddingToCart ? 0.7 : 1,
            }}>
            {isAddingToCart ? 'Adding...' : addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
          </button>
          <Link href="/collections/smoothies" style={{
            display: 'block',
            textAlign: 'center',
            fontSize: '17px',
            color: apple.accent,
            textDecoration: 'none',
            marginBottom: '40px',
          }}>
            View all smoothies →
          </Link>
          <div style={{
            borderTop: '1px solid rgba(0,0,0,0.1)',
            paddingTop: '24px',
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: apple.textPrimary,
              marginBottom: '12px',
            }}>
              About this smoothie
            </h3>
            <p style={{
              fontSize: '15px',
              color: apple.textSecondary,
              lineHeight: '1.6',
            }}>
              {productData.description}
            </p>
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '24px',
          }}>
            {productData.badges.map((badge, index) => (
              <span
                key={index}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#f5f5f7',
                  borderRadius: '980px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: apple.textSecondary,
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  const toggleInfoSection = (section: keyof typeof infoSections) => {
    setInfoSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Default Layout - LV-Inspired Luxury Split Layout
  const renderDefaultLayout = () => (
    <section className="lv-product-page">
      <div className="lv-product-main">
        {/* Left Column - Vertical Scrolling Image Gallery */}
        <div className="lv-product-gallery">
          {productData.gallery.slice(0, 8).map((img, index) => (
            <div key={index} className="lv-gallery-image-wrapper">
              <img
                src={img}
                alt={`${productData.name} - View ${index + 1}`}
                className="lv-gallery-image"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        {/* Right Column - Sticky Product Info Panel */}
        <div className="lv-product-info">
          <div className="lv-product-info-inner">
            <h1 className="lv-product-name">{productData.name}</h1>
            <p className="lv-product-subtitle">{productData.tagline}</p>
            <p className="lv-product-price">${productData.price.toFixed(2)}</p>
            
            <div className="lv-product-rating">
              <div className="lv-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(productData.rating.average) ? 'filled' : ''}>★</span>
                ))}
              </div>
              <span className="lv-fan-favorite">💛 Fan Favorite</span>
            </div>

            <button 
              className={`lv-add-to-cart ${addedToCart ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              style={{ opacity: isAddingToCart ? 0.7 : 1, cursor: isAddingToCart ? 'wait' : 'pointer' }}
            >
              {isAddingToCart ? 'Adding...' : addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
            
            <Link href="/collections/smoothies" className="lv-view-all">
              View all smoothies →
            </Link>

            {/* Accordion Sections */}
            <div className="lv-accordion">
              {/* About this smoothie */}
              <div className="lv-accordion-item">
                <button 
                  className="lv-accordion-header"
                  onClick={() => toggleInfoSection('about')}
                >
                  <div>
                    <span className="lv-accordion-title">About</span>
                    <span className="lv-accordion-subtitle">Taste the difference</span>
                  </div>
                  <span className="lv-accordion-icon">{infoSections.about ? '−' : '+'}</span>
                </button>
                {infoSections.about && (
                  <div className="lv-accordion-content">
                    <p>{productData.description}</p>
                  </div>
                )}
              </div>

              {/* Ingredients */}
              <div className="lv-accordion-item">
                <button 
                  className="lv-accordion-header"
                  onClick={() => toggleSection('ingredients')}
                >
                  <div>
                    <span className="lv-accordion-title">Ingredients</span>
                    <span className="lv-accordion-subtitle">What goes in every cup</span>
                  </div>
                  <span className="lv-accordion-icon">{openSections.ingredients ? '−' : '+'}</span>
                </button>
                {openSections.ingredients && (
                  <div className="lv-accordion-content">
                    <p>{productData.ingredients}</p>
                  </div>
                )}
              </div>

              {/* Nutrition */}
              <div className="lv-accordion-item">
                <button 
                  className="lv-accordion-header"
                  onClick={() => toggleSection('nutrition')}
                >
                  <div>
                    <span className="lv-accordion-title">Nutrition Facts</span>
                    <span className="lv-accordion-subtitle">What you put in matters</span>
                  </div>
                  <span className="lv-accordion-icon">{openSections.nutrition ? '−' : '+'}</span>
                </button>
                {openSections.nutrition && (
                  <div className="lv-accordion-content">
                    {Array.isArray(productData.nutrition) ? (
                      <div className="lv-nutrition-grid">
                        {productData.nutrition.map((item, idx) => (
                          <div key={idx} className="lv-nutrition-item">
                            <span className="lv-nutrition-label">{item.label}</span>
                            <span className="lv-nutrition-value">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="nutrition-facts-panel">
                        {/* Visual Highlights Section */}
                        <div className="nutrition-highlights">
                          {productData.nutrition.highlights.map((h, idx) => (
                            <div key={idx} className="highlight-card">
                              <div className="highlight-ring" style={{ '--ring-color': h.color, '--ring-percent': h.percent } as React.CSSProperties}>
                                <svg viewBox="0 0 36 36" className="circular-chart">
                                  <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                  <path className="circle" strokeDasharray={`${h.percent}, 100`} style={{ stroke: h.color }} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                </svg>
                                <div className="highlight-value">{h.percent}%</div>
                              </div>
                              <div className="highlight-label">{h.label}</div>
                              <div className="highlight-amount">{h.value}</div>
                            </div>
                          ))}
                        </div>

                        {/* Serving Info */}
                        <div className="serving-info">
                          <span>Serving Size: <strong>{productData.nutrition.servingSize}</strong></span>
                          <span>Servings: <strong>{productData.nutrition.servingsPerContainer}</strong></span>
                        </div>

                        {/* Calories Hero */}
                        <div className="calories-hero">
                          <span className="calories-label">Calories</span>
                          <span className="calories-value">{productData.nutrition.calories}</span>
                        </div>

                        {/* Detailed Facts Table */}
                        <div className="facts-table">
                          <div className="facts-header">
                            <span>Amount Per Serving</span>
                            <span>% DV*</span>
                          </div>
                          {productData.nutrition.facts.map((fact, idx) => (
                            <div key={idx} className={`fact-row ${fact.indent ? 'indent' : ''} ${fact.subIndent ? 'sub-indent' : ''}`}>
                              <span className="fact-label">{fact.label}</span>
                              <span className="fact-value">{fact.value}</span>
                              <span className="fact-dv">
                                {fact.dv !== null && fact.dv !== undefined ? (
                                  <span className="dv-badge" style={{ 
                                    background: fact.dv >= 20 ? 'rgba(16, 185, 129, 0.15)' : fact.dv >= 5 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(107, 114, 128, 0.1)',
                                    color: fact.dv >= 20 ? '#10b981' : fact.dv >= 5 ? '#f59e0b' : '#6b7280'
                                  }}>{fact.dv}%</span>
                                ) : '—'}
                              </span>
                            </div>
                          ))}
                        </div>

                        <p className="dv-footnote">*Percent Daily Values (DV) are based on a 2,000 calorie diet.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Key Ingredients */}
              <div className="lv-accordion-item">
                <button 
                  className="lv-accordion-header"
                  onClick={() => toggleSection('keyIngredients')}
                >
                  <div>
                    <span className="lv-accordion-title">Key Ingredients</span>
                    <span className="lv-accordion-subtitle">The flavor-packed power players</span>
                  </div>
                  <span className="lv-accordion-icon">{openSections.keyIngredients ? '−' : '+'}</span>
                </button>
                {openSections.keyIngredients && (
                  <div className="lv-accordion-content">
                    {productData.keyIngredients.map((ingredient, idx) => (
                      <p key={idx}><strong>{ingredient.name}:</strong> {ingredient.benefit}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* How to prepare */}
              <div className="lv-accordion-item">
                <button 
                  className="lv-accordion-header"
                  onClick={() => toggleSection('howToPrep')}
                >
                  <div>
                    <span className="lv-accordion-title">How to Prepare</span>
                    <span className="lv-accordion-subtitle">Smoothie joy in 60 seconds</span>
                  </div>
                  <span className="lv-accordion-icon">{openSections.howToPrep ? '−' : '+'}</span>
                </button>
                {openSections.howToPrep && (
                  <div className="lv-accordion-content">
                    <p><strong>Add liquid:</strong> Fill to the top with water, oat milk, or coconut water—your call.</p>
                    <p><strong>Blend:</strong> Toss it in the blender and let the magic happen.</p>
                    <p><strong>Enjoy:</strong> Pour it back, sip it up, and feel unstoppable.</p>
                  </div>
                )}
              </div>

              {/* Delivery & Returns */}
              <div className="lv-accordion-item">
                <button 
                  className="lv-accordion-header"
                  onClick={() => toggleInfoSection('delivery')}
                >
                  <div>
                    <span className="lv-accordion-title">Delivery & Returns</span>
                    <span className="lv-accordion-subtitle">Smoothies, delivered fast and stress-free</span>
                  </div>
                  <span className="lv-accordion-icon">{infoSections.delivery ? '−' : '+'}</span>
                </button>
                {infoSections.delivery && (
                  <div className="lv-accordion-content">
                    <p><strong>Free shipping:</strong> Orders over $50? We've got you.</p>
                    <p><strong>Standard delivery:</strong> 3-5 business days—easy peasy.</p>
                    <p><strong>Express delivery:</strong> 1-2 business days—because you can't wait.</p>
                    <p><strong>Returns:</strong> Changed your mind? Send unopened products back within 30 days.</p>
                    <p style={{marginTop: '12px', fontStyle: 'italic'}}>Because life's too short for boring smoothies.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="lv-badges">
              {productData.badges.map((badge, index) => (
                <span key={index} className="lv-badge">{badge}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Old centered layout (for reference)
  const renderCenteredLayout = () => (
    <section style={{
      paddingTop: '120px',
      paddingBottom: '0',
      textAlign: 'center',
    }}>
      <h1 style={{
        fontSize: 'clamp(36px, 5vw, 48px)',
        fontWeight: '600',
        color: apple.textPrimary,
        margin: '0 0 12px 0',
        letterSpacing: '-0.02em',
        lineHeight: '1.1',
      }}>
        {productData.name}
      </h1>
      <p style={{
        fontSize: 'clamp(16px, 2vw, 20px)',
        fontWeight: '400',
        color: apple.textSecondary,
        margin: '0 auto 32px',
        maxWidth: '600px',
        lineHeight: '1.5',
      }}>
        {productData.tagline}
      </p>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        marginBottom: '12px',
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
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: '0 24px',
        overflow: 'hidden',
      }}>
        <img
          src={productData.gallery[selectedImageIndex]}
          alt={productData.name}
          loading="eager"
          style={{
            width: '100%',
            maxHeight: '700px',
            objectFit: 'contain',
            ...(productId === '1' ? { marginTop: '-10px' } : {}),
          }}
        />
      </div>
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
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </button>
        ))}
      </div>
    </section>
  );

  return (
    <div style={{ 
      backgroundColor: apple.bgPrimary, 
      minHeight: '100vh',
    }}>
      <Navbar variant="dynamic" />
      
      <main>
        {renderDefaultLayout()}

        {/* Lifestyle Film-Strip Section */}
        <section className="lifestyle-section">
          <div className="lifestyle-header">
            <h2 className="lifestyle-title">Your Everyday — Powered Naturally.</h2>
            <p className="lifestyle-subtitle">Real nourishment. Real moments. Real life.</p>
          </div>
          <div className="lifestyle-wrapper">
            <div className="lifestyle-track" id="lifestyle-track" ref={lifestyleTrackRef}>
              {(productData?.lifestyleGallery || DEFAULT_LIFESTYLE_GALLERY).slice(0, 6).map((slide, index) => (
                <div key={index} className="lifestyle-card">
                  <Image 
                    src={slide.src} 
                    alt={slide.alt} 
                    width={400}
                    height={500}
                    quality={75}
                    priority={index < 3}
                    sizes="(max-width: 768px) 80vw, 400px"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
            <div className="lifestyle-arrows">
              <button 
                className="lifestyle-arrow prev"
                onClick={() => {
                  const track = document.getElementById('lifestyle-track');
                  const card = document.querySelector('.lifestyle-card');
                  if (track && card) {
                    const step = card.getBoundingClientRect().width + 24;
                    track.scrollBy({ left: -step, behavior: 'smooth' });
                  }
                }}
                aria-label="Previous"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button 
                className="lifestyle-arrow next"
                onClick={() => {
                  const track = document.getElementById('lifestyle-track');
                  const card = document.querySelector('.lifestyle-card');
                  if (track && card) {
                    const step = card.getBoundingClientRect().width + 24;
                    track.scrollBy({ left: step, behavior: 'smooth' });
                  }
                }}
                aria-label="Next"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* The Lineup Section - Exact clone from landing page */}
        <section className="video-section" style={{ background: '#0a0a0a' }}>
          <div className="video-section-container">
            <h2 className="video-section-title">
              The lineup
            </h2>
            <p className="video-section-subtitle">
              These are the ones people can't stop reordering.
            </p>

            <div className="video-carousel-wrapper">
              <button className="carousel-arrow carousel-arrow-left">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <div className="video-carousel-track">
                {POPULAR_SMOOTHIES.slice(0, 5).map((item) => (
                  <SmoothieCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    image={item.image}
                    hoverImage={item.hoverImage}
                    badge={item.badge}
                    price={item.price}
                    rating={item.rating}
                    reviews={item.reviews}
                  />
                ))}
              </div>

              <button className="carousel-arrow carousel-arrow-right">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
