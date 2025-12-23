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
  heroVideo?: string;
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
    name: 'Pink Piyata Punch',
    price: 8.99,
    image: '/products/pink-piyata/1.png',
    shortDescription: 'A Tropical Paradise in Every Sip',
    tagline: 'A Tropical Paradise in Every Sip',
    rating: { average: 4.8, count: 3842 },
    gallery: [
      '/products/pink-piyata/1.png',
      '/products/pink-piyata/2.png',
      '/products/pink-piyata/3.png',
      '/products/pink-piyata/4.png',
      '/products/pink-piyata/5.png',
      '/products/pink-piyata/6.png',
    ],
    lifestyleGallery: [
      { src: '/products/pink-piyata/lifestyle/1.jpg', alt: 'Pink Piyata Punch Lifestyle 1' },
      { src: '/products/pink-piyata/lifestyle/2.jpg', alt: 'Pink Piyata Punch Lifestyle 2' },
      { src: '/products/pink-piyata/lifestyle/3.jpg', alt: 'Pink Piyata Punch Lifestyle 3' },
      { src: '/products/pink-piyata/lifestyle/4.jpg', alt: 'Pink Piyata Punch Lifestyle 4' },
      { src: '/products/pink-piyata/lifestyle/5.jpg', alt: 'Pink Piyata Punch Lifestyle 5' },
      { src: '/products/pink-piyata/lifestyle/6.jpg', alt: 'Pink Piyata Punch Lifestyle 6' },
      { src: '/products/pink-piyata/lifestyle/7.jpg', alt: 'Pink Piyata Punch Lifestyle 7' },
      { src: '/products/pink-piyata/lifestyle/8.jpg', alt: 'Pink Piyata Punch Lifestyle 8' },
      { src: '/products/pink-piyata/lifestyle/9.jpg', alt: 'Pink Piyata Punch Lifestyle 9' },
      { src: '/products/pink-piyata/lifestyle/10.jpg', alt: 'Pink Piyata Punch Lifestyle 10' },
    ],
    description: 'Picture this: sun, sand, and a tropical breeze. That\'s the vibe in every sip of Pink Piyata Punch. Bursting with dragon fruit, pineapple, and creamy coconut, it\'s a getaway in a glass. Packed with antioxidants and electrolytes, it\'s your daily dose of paradise and power.',
    ingredients: 'Organic Pitaya, Organic Strawberry, Organic Raspberry, Organic Spinach, Organic Chia Seeds, Organic Goji Berries, Organic Medjool Dates, Organic Lemon Juice, Organic Maca Powder — because you deserve the best.',
    nutrition: {
      servingSize: '283g',
      servingsPerContainer: 1,
      calories: 250,
      facts: [
        { label: 'Total Fat', value: '0g', dv: 0 },
        { label: 'Saturated Fat', value: '0g', dv: 0, indent: true },
        { label: 'Trans Fat', value: '0g', dv: null, indent: true },
        { label: 'Cholesterol', value: '0mg', dv: 0 },
        { label: 'Sodium', value: '25mg', dv: 1 },
        { label: 'Total Carbohydrate', value: '59g', dv: 18 },
        { label: 'Dietary Fiber', value: '4g', dv: 14, indent: true },
        { label: 'Total Sugars', value: '17g', dv: null, indent: true },
        { label: 'Incl. Added Sugars', value: '0g', dv: 0, indent: true, subIndent: true },
        { label: 'Protein', value: '4g', dv: 8 },
        { label: 'Vitamin D', value: '0mcg', dv: 0 },
        { label: 'Calcium', value: '40mg', dv: 4 },
        { label: 'Iron', value: '1.4mg', dv: 8 },
        { label: 'Potassium', value: '480mg', dv: 10 },
      ],
      highlights: [
        { label: 'Fiber', value: '4g', percent: 14, color: '#10b981' },
        { label: 'Protein', value: '4g', percent: 8, color: '#8b5cf6' },
        { label: 'Carbs', value: '59g', percent: 18, color: '#f59e0b' },
      ]
    },
    keyIngredients: [
      { name: 'Pitaya (Dragon Fruit)', benefit: 'A vibrant superfruit loaded with antioxidants and prebiotic fiber to boost digestion and vitality.', image: '/ingredients/dragonfruit.png' },
      { name: 'Strawberry', benefit: 'Bursting with vitamin C and polyphenols to support glowing skin and a strong immune system.', image: '/ingredients/strawberry.png' },
      { name: 'Raspberry', benefit: 'A fiber-rich berry packed with antioxidants for gut health and cellular protection.', image: '/ingredients/raspberry.png' },
      { name: 'Spinach', benefit: 'A powerhouse green full of essential vitamins and minerals to keep you balanced.', image: '/ingredients/spinach.png' },
      { name: 'Chia Seeds', benefit: 'Tiny but mighty, packed with omega-3s and plant-based protein for lasting energy.', image: '/ingredients/chia.png' },
      { name: 'Goji Berries', benefit: 'An antioxidant-rich superfruit known for supporting immunity and longevity.', image: '/ingredients/goji.png' },
      { name: 'Medjool Dates', benefit: 'Naturally sweet and full of fiber and minerals for a gentle energy boost.', image: '/ingredients/dates.png' },
      { name: 'Lemon', benefit: 'Zesty and refreshing, loaded with vitamin C to brighten your day and your smoothie.', image: '/ingredients/lemon.png' },
      { name: 'Maca Powder', benefit: 'An adaptogenic root that helps balance mood, stamina, and energy.', image: '/ingredients/maca.png' },
    ],
    badges: ['Gluten-Free', 'Dairy-Free', 'Plant-Based', 'No Added Sugar'],
  },
  '10': {
    id: '10',
    name: 'Matcha Madness',
    price: 9.49,
    image: '/products/matcha/1.png',
    shortDescription: 'Calm Focus Meets Creamy Indulgence',
    tagline: 'Calm Focus Meets Creamy Indulgence',
    rating: { average: 4.7, count: 2156 },
    gallery: [
      '/products/matcha/1.png',
      '/products/matcha/2.png',
      '/products/matcha/3.png',
      '/products/matcha/4.png',
      '/products/matcha/5.png',
      '/products/matcha/6.png',
    ],
    lifestyleGallery: [
      { src: '/products/matcha/lifestyle/matcha-lifestyle-1.jpg', alt: 'Matcha Madness Lifestyle 1' },
      { src: '/products/matcha/lifestyle/matcha-lifestyle-2.jpg', alt: 'Matcha Madness Lifestyle 2' },
      { src: '/products/matcha/lifestyle/matcha-lifestyle-3.jpg', alt: 'Matcha Madness Lifestyle 3' },
      { src: '/products/matcha/lifestyle/matcha-lifestyle-4.jpg', alt: 'Matcha Madness Lifestyle 4' },
      { src: '/products/matcha/lifestyle/matcha-lifestyle-5.jpg', alt: 'Matcha Madness Lifestyle 5' },
      { src: '/products/matcha/lifestyle/matcha-lifestyle-6.jpg', alt: 'Matcha Madness Lifestyle 6' },
      { src: '/products/matcha/lifestyle/matcha-lifestyle-7.jpg', alt: 'Matcha Madness Lifestyle 7' },
    ],
    description: 'Matcha Madness is your daily escape. Ceremonial-grade matcha blends with tropical pineapple, creamy banana, zesty lemon, and a kick of ginger for a bold, refreshing boost. Packed with spinach and powered by L-theanine, it delivers calm, focused energy without the crash. One sip, and you\'re unstoppable.',
    ingredients: 'Organic Ceremonial Matcha, Organic Pineapple, Organic Spinach, Organic Banana, Organic Lemon Juice, Organic Ginger — because you deserve the best.',
    nutrition: {
      servingSize: '283g',
      servingsPerContainer: 1,
      calories: 150,
      facts: [
        { label: 'Total Fat', value: '2g', dv: 3 },
        { label: 'Saturated Fat', value: '0g', dv: 0, indent: true },
        { label: 'Trans Fat', value: '0g', dv: null, indent: true },
        { label: 'Cholesterol', value: '0mg', dv: 0 },
        { label: 'Sodium', value: '15mg', dv: 1 },
        { label: 'Total Carbohydrate', value: '34g', dv: 12 },
        { label: 'Dietary Fiber', value: '4g', dv: 14, indent: true },
        { label: 'Total Sugars', value: '15g', dv: null, indent: true },
        { label: 'Incl. Added Sugars', value: '0g', dv: 0, indent: true, subIndent: true },
        { label: 'Protein', value: '5g', dv: 10 },
        { label: 'Vitamin D', value: '0mcg', dv: 0 },
        { label: 'Calcium', value: '50mg', dv: 4 },
        { label: 'Iron', value: '1.8mg', dv: 10 },
        { label: 'Potassium', value: '420mg', dv: 9 },
      ],
      highlights: [
        { label: 'Fiber', value: '4g', percent: 14, color: '#10b981' },
        { label: 'Protein', value: '5g', percent: 10, color: '#8b5cf6' },
        { label: 'Carbs', value: '34g', percent: 12, color: '#f59e0b' },
      ]
    },
    keyIngredients: [
      { name: 'Matcha', benefit: 'Packed with L-theanine for calm, focused energy without the crash.', image: '/ingredients/matcha.png' },
      { name: 'Banana', benefit: 'Naturally sweet and creamy, loaded with potassium for balance.', image: '/ingredients/banana.png' },
      { name: 'Almond Butter', benefit: 'A rich source of healthy fats and protein to keep you satisfied.', image: '/ingredients/almond.png' },
      { name: 'Spinach', benefit: 'A nutrient powerhouse with iron and vitamins, all without altering the flavor.', image: '/ingredients/spinach.png' },
      { name: 'Hemp Seeds', benefit: 'A complete plant-based protein with all essential amino acids.', image: '/ingredients/hemp.png' },
      { name: 'Vanilla', benefit: 'A natural mood booster with soothing aromatherapy benefits.', image: '/ingredients/vanilla.png' },
    ],
    badges: ['Gluten-Free', 'Dairy-Free', 'Plant-Based', 'Naturally Energizing'],
  },
  '11': {
    id: '11',
    name: 'Mocha Protein Fuel',
    price: 9.49,
    image: '/products/mocha/gallery-1.jpg',
    shortDescription: 'Rich chocolate. Smooth espresso. Pure bliss.',
    tagline: 'When Espresso and Chocolate Swipe Right',
    rating: { average: 4.8, count: 2847 },
    gallery: [
      '/products/mocha/gallery-1.jpg',
      '/products/mocha/gallery-2.jpg',
      '/products/mocha/gallery-3.jpg',
      '/products/mocha/gallery-4.jpg',
      '/products/mocha/gallery-5.jpg',
      '/products/mocha/gallery-6.jpg',
    ],
    lifestyleGallery: [
      { src: '/lifestyle/mocha/DSC09186.jpg', alt: 'Mocha Lifestyle 1' },
      { src: '/lifestyle/mocha/DSC09048-1Matcha.jpg', alt: 'Mocha Lifestyle 2' },
      { src: '/lifestyle/mocha/DSC09073-1-2mocha.jpg', alt: 'Mocha Lifestyle 3' },
      { src: '/lifestyle/mocha/DSC09159.jpg', alt: 'Mocha Lifestyle 4' },
      { src: '/lifestyle/mocha/DSC09161.jpg', alt: 'Mocha Lifestyle 5' },
    ],
    description: "This creamy mocha blend brings coffeehouse vibes straight to your kitchen. Made with organic cold brew coffee, raw cacao, and naturally sweet banana, it delivers indulgent flavor without the guilt. Clean, simple, and deeply satisfying—every sip feels like a treat.",
    ingredients: 'Organic cold brew coffee, organic banana, organic dates, organic cacao powder, organic almond butter, organic oat milk, organic vanilla extract. Contains: Almonds. Caffeine: Naturally occurring from cold brew coffee.',
    nutrition: {
      servingSize: '1 cup',
      servingsPerContainer: 1,
      calories: 190,
      facts: [
        { label: 'Total Fat', value: '5g', dv: 6 },
        { label: 'Saturated Fat', value: '1g', dv: 5, indent: true },
        { label: 'Trans Fat', value: '0g', dv: null, indent: true },
        { label: 'Cholesterol', value: '0mg', dv: 0 },
        { label: 'Sodium', value: '10mg', dv: 0 },
        { label: 'Total Carbohydrate', value: '28g', dv: 10 },
        { label: 'Dietary Fiber', value: '5g', dv: 18, indent: true },
        { label: 'Total Sugars', value: '14g', dv: null, indent: true },
        { label: 'Incl. Added Sugars', value: '0g', dv: 0, indent: true, subIndent: true },
        { label: 'Protein', value: '5g', dv: 10 },
      ],
      highlights: [
        { label: 'Fiber', value: '5g', percent: 18, color: '#10b981' },
        { label: 'Protein', value: '5g', percent: 10, color: '#8b5cf6' },
        { label: 'Carbs', value: '28g', percent: 10, color: '#f59e0b' },
      ]
    },
    keyIngredients: [
      { name: 'Cold Brew Coffee', benefit: 'Smooth, low-acid caffeine for steady energy that lasts.', image: '/ingredients/coffee.png' },
      { name: 'Cacao', benefit: 'Antioxidant-rich and naturally mood-boosting.', image: '/ingredients/cacao.png' },
      { name: 'Banana', benefit: 'Naturally sweet and packed with potassium to support recovery.', image: '/ingredients/banana.png' },
      { name: 'Almond Butter', benefit: 'Healthy fats and plant-based protein for lasting satisfaction.', image: '/ingredients/almond.png' },
      { name: 'Dates', benefit: "Nature's candy, rich in fiber and essential minerals.", image: '/ingredients/dates.png' },
      { name: 'Oat Milk', benefit: 'Creamy, dreamy texture with heart-healthy benefits.', image: '/ingredients/oatmilk.png' },
    ],
    badges: ['Gluten-Free', 'Dairy-Free', 'Plant-Based', 'No Added Sugar', 'Contains Caffeine'],
  },
  '14': {
    id: '14',
    name: 'Coffee Mushroom',
    price: 9.99,
    image: '/products/mushroom-coffee/Coffr Mushroom-TG-1.png',
    shortDescription: 'Good Morning, Gorgeous',
    tagline: 'Good Morning, Gorgeous',
    rating: { average: 4.6, count: 1893 },
    gallery: [
      '/products/mushroom-coffee/Coffr Mushroom-TG-1.png',
      '/products/mushroom-coffee/Coffr Mushroom-TG-2.png',
      '/products/mushroom-coffee/Coffr Mushroom-TG-3.png',
      '/products/mushroom-coffee/Coffr Mushroom-TG-4.png',
      '/products/mushroom-coffee/Coffr Mushroom-TG-5.png',
      '/products/mushroom-coffee/Coffr Mushroom-TG-6.png',
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
    description: "Wake up, America. Wake up, world. Your coffee just got a glow-up. This isn't your average cup of joe—it's a full-on morning seduction. Organic brewed coffee brings the bold, smooth energy, while a 10-mushroom blend whispers, \"Focus, darling, you've got this.\" Add creamy banana, hearty oats, and a kiss of cinnamon and vanilla, and you've got a brew that's as grounding as it is energizing. No jitters. No crash. Just pure, unadulterated morning magic. It's coffee, but sexier.",
    ingredients: 'Organic Brewed Coffee, Organic Banana, Organic Rolled Oats, Organic Vanilla Extract, Organic Cinnamon, Organic 10 Mushroom Blend (Turkey Tail, Lion\'s Mane, Cordyceps, Chaga, Shiitake, Maitake, Red Reishi, Agaricus Blazei, Tremella, Poria), Organic Chocolate Protein Powder (Pea Protein), Pumpkin Seed Protein, Monk Fruit Extract. Made in a facility that also processes peanuts, tree nuts, soy, and dairy.',
    nutrition: {
      servingSize: '210 g',
      servingsPerContainer: 1,
      calories: 210,
      facts: [
        { label: 'Total Fat', value: '4g', dv: 6 },
        { label: 'Saturated Fat', value: '0.5g', dv: 2, indent: true },
        { label: 'Trans Fat', value: '0g', dv: null, indent: true },
        { label: 'Cholesterol', value: '0mg', dv: 0 },
        { label: 'Sodium', value: '26mg', dv: 1 },
        { label: 'Total Carbohydrate', value: '26g', dv: 9 },
        { label: 'Dietary Fiber', value: '5g', dv: 18, indent: true },
        { label: 'Total Sugars', value: '14g', dv: null, indent: true },
        { label: 'Incl. Added Sugars', value: '0g', dv: 0, indent: true, subIndent: true },
        { label: 'Protein', value: '21g', dv: 42 },
      ],
      highlights: [
        { label: 'Protein', value: '21g', percent: 42, color: '#8b5cf6' },
        { label: 'Fiber', value: '5g', percent: 18, color: '#10b981' },
        { label: 'Carbs', value: '26g', percent: 9, color: '#f59e0b' },
      ]
    },
    keyIngredients: [
      { name: 'Brewed Coffee', benefit: 'Smooth, naturally caffeinated energy that whispers, "You\'ve got this."', image: '/ingredients/coffee.png' },
      { name: '10-Mushroom Blend', benefit: 'A spectrum of functional mushrooms to sharpen your focus, boost your immunity, and make you feel unstoppable.', image: '/ingredients/mushroom.png' },
      { name: 'Pea Protein & Pumpkin Seed Protein', benefit: 'Plant-based powerhouses to fuel your muscles and keep you satisfied.', image: '/ingredients/protein.png' },
      { name: 'Rolled Oats', benefit: 'Slow-burning carbs for steady energy and fullness.', image: '/ingredients/oats.png' },
      { name: 'Banana', benefit: 'Natural sweetness with potassium to keep you balanced and glowing.', image: '/ingredients/banana.png' },
      { name: 'Cinnamon & Vanilla', benefit: 'Warming, cozy flavors that feel like a hug in a cup.', image: '/ingredients/cinnamon.png' },
    ],
    badges: ['Gluten-Free', 'Dairy-Free', 'Plant-Based', 'Adaptogenic', 'Contains Caffeine'],
  },
  '15': {
    id: '15',
    name: 'Chocolate Berry Protein',
    price: 8.99,
    image: '/products/chocolate-berry/Chocolate Berry-1.png',
    shortDescription: 'Indulgence Meets Wellness',
    tagline: 'Indulgence Meets Wellness',
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
    description: "One sip, and you're in the jungle. Rich cacao seduces your taste buds, creamy banana keeps it smooth, and a trio of warming spices wraps you in a chocolatey embrace. It's indulgence that fuels your body, sharpens your mind, and leaves you wanting more.",
    ingredients: 'Organic Brewed Coffee, Organic Bananas, Organic Rolled Oats, Organic Young Coconut Meat, Organic Dates, Organic Vanilla Extract, Organic Cinnamon, Organic Almond Milk, Organic 10 Mushroom Blend (Turkey Tail, Lion\'s Mane, Cordyceps, Chaga, Shiitake, Maitake, Red Reishi, Agaricus Blazei, Tremella, Poria), Organic Chocolate Protein Powder (Pea Protein), Pumpkin Seed Protein, Monk Fruit Extract, Chia Seed Protein, Alkalized Cocoa, Vanilla Powder. Contains: Tree nuts. Dietary: Plant-based, dairy-free.',
    nutrition: {
      servingSize: '253 g',
      servingsPerContainer: 1,
      calories: 270,
      facts: [
        { label: 'Total Fat', value: '9g', dv: 12 },
        { label: 'Saturated Fat', value: '1g', dv: 5, indent: true },
        { label: 'Trans Fat', value: '0g', dv: null, indent: true },
        { label: 'Cholesterol', value: '0mg', dv: 0 },
        { label: 'Sodium', value: '55mg', dv: 2 },
        { label: 'Total Carbohydrate', value: '38g', dv: 14 },
        { label: 'Dietary Fiber', value: '7g', dv: 25, indent: true },
        { label: 'Total Sugars', value: '13g', dv: null, indent: true },
        { label: 'Incl. Added Sugars', value: '0g', dv: 0, indent: true, subIndent: true },
        { label: 'Protein', value: '9g', dv: 18 },
      ],
      highlights: [
        { label: 'Fiber', value: '7g', percent: 25, color: '#10b981' },
        { label: 'Protein', value: '9g', percent: 18, color: '#8b5cf6' },
        { label: 'Carbs', value: '38g', percent: 14, color: '#f59e0b' },
      ]
    },
    keyIngredients: [
      { name: 'Organic Brewed Coffee', benefit: 'Bold, energizing, and ready to wake you up like a jungle sunrise.', image: '/ingredients/coffee.png' },
      { name: 'Organic Bananas', benefit: 'Smooth, creamy, and the ultimate charmer.', image: '/ingredients/banana.png' },
      { name: 'Organic Rolled Oats', benefit: 'The slow-burn energy hero, keeping you steady and strong.', image: '/ingredients/oats.png' },
      { name: 'Organic Young Coconut Meat', benefit: 'Silky, tropical, and pure indulgence.', image: '/ingredients/coconut.png' },
      { name: 'Organic Chocolate Protein Powder', benefit: 'Rich, velvety, and packed with plant-based power.', image: '/ingredients/protein.png' },
      { name: 'Organic 10 Mushroom Blend', benefit: 'A powerhouse of adaptogens to fuel your focus and resilience.', image: '/ingredients/mushroom.png' },
      { name: 'Alkalized Cocoa', benefit: 'Deep chocolate flavor with a smooth, indulgent finish.', image: '/ingredients/cacao.png' },
    ],
    badges: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'Antioxidant-Rich'],
  },
  '16': {
    id: '16',
    name: 'Almond Luvly',
    price: 8.99,
    image: '/products/almond/Almond-1.png',
    shortDescription: 'Love at First Sip',
    tagline: 'Love at First Sip',
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
    description: "Close your eyes. Imagine a single raindrop sliding off an almond tree leaf, landing softly on your lips. That's Almond Luvly—a smoothie so rich, creamy, and indulgent, it feels like a love letter in a cup. Banana brings the sweetness, almond and hazelnut butters bring the smooth-talking charm, and young coconut meat? Oh, that's the silky seduction. And just when you think it couldn't get better, cacao nibs crash the party with a little crunch and a lot of attitude. This isn't just a smoothie—it's a full-on romance. Bold, confident, and unapologetically delicious.",
    ingredients: 'Organic Banana, Organic Hazelnut Butter, Organic Medjool Dates, Organic Young Coconut Meat, Almond Butter, Cacao Nibs. Contains: Almonds, Hazelnuts. Made in a facility that also processes: Peanuts, Tree Nuts, Soy, Dairy.',
    nutrition: {
      servingSize: '216 g',
      servingsPerContainer: 1,
      calories: 230,
      facts: [
        { label: 'Total Fat', value: '23g', dv: 29 },
        { label: 'Saturated Fat', value: '15g', dv: 86, indent: true },
        { label: 'Trans Fat', value: '0g', dv: null, indent: true },
        { label: 'Cholesterol', value: '0mg', dv: 0 },
        { label: 'Sodium', value: '14mg', dv: 1 },
        { label: 'Total Carbohydrate', value: '19g', dv: 7 },
        { label: 'Dietary Fiber', value: '2g', dv: 8, indent: true },
        { label: 'Total Sugars', value: '15g', dv: null, indent: true },
        { label: 'Incl. Added Sugars', value: '0g', dv: 0, indent: true, subIndent: true },
        { label: 'Protein', value: '5g', dv: 10 },
      ],
      highlights: [
        { label: 'Fiber', value: '2g', percent: 8, color: '#10b981' },
        { label: 'Protein', value: '5g', percent: 10, color: '#8b5cf6' },
        { label: 'Carbs', value: '19g', percent: 7, color: '#f59e0b' },
      ]
    },
    keyIngredients: [
      { name: 'Banana', benefit: 'Sweet, soft, and always there for you.', image: '/ingredients/banana.png' },
      { name: 'Hazelnut Butter', benefit: 'Smooth, nutty, and irresistibly rich.', image: '/ingredients/hazelnut.png' },
      { name: 'Medjool Dates', benefit: "Nature's caramel, sweet and oh-so-satisfying.", image: '/ingredients/dates.png' },
      { name: 'Young Coconut Meat', benefit: 'Silky, tropical, and pure indulgence.', image: '/ingredients/coconut.png' },
      { name: 'Almond Butter', benefit: 'The creamy, dreamy heart of it all.', image: '/ingredients/almondbutter.png' },
      { name: 'Cacao Nibs', benefit: 'Crunchy little rebels with a dark chocolate edge.', image: '/ingredients/cacao.png' },
    ],
    badges: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'High Protein'],
  },
  '17': {
    id: '17',
    name: 'Acai Passionfruit',
    price: 9.49,
    image: '/products/acai/Acai-1.png',
    shortDescription: 'The Amazon in a Cup',
    tagline: 'The Amazon in a Cup',
    rating: { average: 4.9, count: 5234 },
    heroVideo: '/videos/acai-video.mp4',
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
    description: "One sip, and you're deep in the Amazon. Bold, dark acai meets the tropical tang of passion fruit in a blend so smooth, it feels like a moonlit kiss. Mango and banana bring the creamy sweetness, while acerola and lion's mane mushroom fuel your body and sharpen your mind. It's wild. It's vibrant. It's pure jungle magic.",
    ingredients: 'Organic Acai, Organic Mango, Organic Banana, Organic Passion Fruit, Organic Acerola, Organic Dates, Organic Lion\'s Mane Mushroom',
    nutrition: {
      servingSize: '1 cup (268 g)',
      servingsPerContainer: 1,
      calories: 200,
      facts: [
        { label: 'Total Fat', value: '4g', dv: 6 },
        { label: 'Saturated Fat', value: '0.5g', dv: 2, indent: true },
        { label: 'Trans Fat', value: '0g', dv: null, indent: true },
        { label: 'Cholesterol', value: '0mg', dv: 0 },
        { label: 'Sodium', value: '3mg', dv: 0 },
        { label: 'Total Carbohydrate', value: '38g', dv: 14 },
        { label: 'Dietary Fiber', value: '7g', dv: 25, indent: true },
        { label: 'Total Sugars', value: '18g', dv: null, indent: true },
        { label: 'Incl. Added Sugars', value: '0g', dv: 0, indent: true, subIndent: true },
        { label: 'Protein', value: '4g', dv: 8 },
      ],
      highlights: [
        { label: 'Fiber', value: '7g', percent: 25, color: '#10b981' },
        { label: 'Protein', value: '4g', percent: 8, color: '#8b5cf6' },
        { label: 'Carbs', value: '38g', percent: 14, color: '#f59e0b' },
      ]
    },
    keyIngredients: [
      { name: 'Acai', benefit: "The Amazon's antioxidant-packed goddess, fueling vitality and glow.", image: '/ingredients/acai.png' },
      { name: 'Passion Fruit', benefit: 'A tropical kiss of vitamin C and immune-boosting magic.', image: '/ingredients/passionfruit.png' },
      { name: 'Acerola', benefit: 'Vitamin C so potent, it\'s like a shield for your body.', image: '/ingredients/acerola.png' },
      { name: 'Lion\'s Mane Mushroom', benefit: 'The jungle genius, sharpening your focus with every sip.', image: '/ingredients/lionsmane.png' },
      { name: 'Dates', benefit: 'Sweet, balanced energy to keep you steady and strong.', image: '/ingredients/dates.png' },
    ],
    badges: ['Gluten-Free', 'Dairy-Free', 'Plant-Based', 'No Added Sugar', 'Superfood'],
  },
  '12': {
    id: '12',
    name: 'Nutty Monkey',
    price: 8.99,
    image: '/products/nutty-monkey/Nutty Monkey-1.png',
    shortDescription: 'The Classic Combo, Perfected',
    tagline: 'The Classic Combo, Perfected',
    rating: { average: 4.8, count: 3567 },
    gallery: [
      '/products/nutty-monkey/Nutty Monkey-1.png',
      '/products/nutty-monkey/Nutty Monkey-2.png',
      '/products/nutty-monkey/Nutty Monkey-3.png',
      '/products/nutty-monkey/Nutty Monkey-4.png',
      '/products/nutty-monkey/Nutty Monkey-5.png',
      '/products/nutty-monkey/Nutty Monkey-6.png',
    ],
    lifestyleGallery: [
      { src: '/lifestyle/nutty-monkey/Copy of 890A4778_out1.jpg', alt: 'Nutty Monkey lifestyle' },
      { src: '/lifestyle/nutty-monkey/Copy of 890A4785_out1.jpg', alt: 'Nutty Monkey lifestyle' },
      { src: '/lifestyle/nutty-monkey/Copy of 890A4942_out1.jpg', alt: 'Nutty Monkey lifestyle' },
      { src: '/lifestyle/nutty-monkey/Copy of 890A4954_out1.jpg', alt: 'Nutty Monkey lifestyle' },
      { src: '/lifestyle/nutty-monkey/Copy of 890A4989_out1.jpg', alt: 'Nutty Monkey lifestyle' },
      { src: '/lifestyle/nutty-monkey/Copy of 890A5047_out1.jpg', alt: 'Nutty Monkey lifestyle' },
      { src: '/lifestyle/nutty-monkey/Copy of 890A5092_out1.jpg', alt: 'Nutty Monkey lifestyle' },
      { src: '/lifestyle/nutty-monkey/Copy of 890A5106_out1.jpg', alt: 'Nutty Monkey lifestyle' },
      { src: '/lifestyle/nutty-monkey/Copy of 890A5128_out1.jpg', alt: 'Nutty Monkey lifestyle' },
      { src: '/lifestyle/nutty-monkey/Copy of 890A5136_out1.jpg', alt: 'Nutty Monkey lifestyle' },
      { src: '/lifestyle/nutty-monkey/Copy of 890A5573_out1.jpg', alt: 'Nutty Monkey lifestyle' },
      { src: '/lifestyle/nutty-monkey/Copy of 890A5586_out1.jpg', alt: 'Nutty Monkey lifestyle' },
      { src: '/lifestyle/nutty-monkey/DSC08625.jpg', alt: 'Nutty Monkey lifestyle' },
      { src: '/lifestyle/nutty-monkey/DSC09048-1Nutty Monkey.jpg', alt: 'Nutty Monkey lifestyle' },
      { src: '/lifestyle/nutty-monkey/DSC09073-1-2Alnutty monkey (2).jpg', alt: 'Nutty Monkey lifestyle' },
    ],
    description: "Creamy almond butter. Sweet, ripe bananas. Juicy strawberries. Nutty Monkey is the smoothie that feels like a warm hug and a high-five all at once. Balanced with dates for natural sweetness and chia seeds for a little crunch and a lot of fuel, it's the perfect blend of comfort and power. Whether you're kicking off your morning, crushing a midday slump, or recovering like a champ after a workout, Nutty Monkey's got your back. It's classic, it's crave-worthy, and it's here to make your day delicious.",
    ingredients: 'Organic Banana, Organic Almond Butter, Organic Dates, Organic Strawberries, Organic Chia Seeds. Made in a facility that also processes peanuts, tree nuts, soy, and dairy.',
    nutrition: {
      servingSize: '201 g',
      servingsPerContainer: 1,
      calories: 220,
      facts: [
        { label: 'Total Fat', value: '19g', dv: 24 },
        { label: 'Saturated Fat', value: '1.5g', dv: 8, indent: true },
        { label: 'Trans Fat', value: '0g', dv: null, indent: true },
        { label: 'Cholesterol', value: '0mg', dv: 0 },
        { label: 'Sodium', value: '59mg', dv: 3 },
        { label: 'Total Carbohydrate', value: '28g', dv: 10 },
        { label: 'Dietary Fiber', value: '5g', dv: 18, indent: true },
        { label: 'Total Sugars', value: '18g', dv: null, indent: true },
        { label: 'Incl. Added Sugars', value: '0g', dv: 0, indent: true, subIndent: true },
        { label: 'Protein', value: '6g', dv: 12 },
      ],
      highlights: [
        { label: 'Fat', value: '19g', percent: 24, color: '#ec4899' },
        { label: 'Fiber', value: '5g', percent: 18, color: '#10b981' },
        { label: 'Protein', value: '6g', percent: 12, color: '#8b5cf6' },
      ]
    },
    keyIngredients: [
      { name: 'Almond Butter', benefit: 'Rich, creamy, and packed with healthy fats and plant-based protein to keep you full and fueled.', image: '/ingredients/almond.png' },
      { name: 'Banana', benefit: 'Naturally sweet and loaded with potassium to keep your muscles happy and your energy steady.', image: '/ingredients/banana.png' },
      { name: 'Strawberries', benefit: 'Bright, juicy, and bursting with antioxidants and vitamin C for a refreshing boost.', image: '/ingredients/strawberry.png' },
      { name: 'Dates', benefit: 'Sweet, fiber-packed, and full of essential minerals to keep you going.', image: '/ingredients/dates.png' },
      { name: 'Chia Seeds', benefit: 'Tiny powerhouses of omega-3s, fiber, and plant protein for digestion and sustained energy.', image: '/ingredients/chia.png' },
    ],
    badges: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'High Protein'],
  },
  '13': {
    id: '13',
    name: 'Mango Jackfruit',
    price: 8.99,
    image: '/products/mango-jackfruit/Mango Jackfruit-1.png',
    shortDescription: 'Sunshine in Every Sip',
    tagline: 'Sunshine in Every Sip',
    rating: { average: 4.8, count: 2134 },
    gallery: [
      '/products/mango-jackfruit/Mango Jackfruit-1.png',
      '/products/mango-jackfruit/Mango Jackfruit-2.png',
      '/products/mango-jackfruit/Mango Jackfruit-3.png',
      '/products/mango-jackfruit/Mango Jackfruit-4.png',
      '/products/mango-jackfruit/Mango Jackfruit-5.png',
      '/products/mango-jackfruit/Mango Jackfruit-5 (1).png',
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
    description: "Close your eyes and take a sip—suddenly, you're on a sun-drenched beach, toes in the sand, and a warm breeze on your face. Sweet, juicy mangoes and luscious jackfruit steal the show, while creamy coconut and a splash of zesty lime bring the island vibes. It's golden sunshine in a glass, and the best part? No TSA lines.",
    ingredients: 'Organic Mango, Organic Coconut Meat, Organic Pineapple, Organic Banana, Organic Coconut Butter, Organic Passion Fruit, Organic Dates, Organic Vanilla Extract. Made in a facility that also processes peanuts, tree nuts, soy, and dairy.',
    nutrition: {
      servingSize: '240 g',
      servingsPerContainer: 1,
      calories: 180,
      facts: [
        { label: 'Total Fat', value: '5g', dv: 8 },
        { label: 'Saturated Fat', value: '0.5g', dv: 2, indent: true },
        { label: 'Trans Fat', value: '0g', dv: null, indent: true },
        { label: 'Cholesterol', value: '0mg', dv: 0 },
        { label: 'Sodium', value: '30mg', dv: 1 },
        { label: 'Total Carbohydrate', value: '33g', dv: 12 },
        { label: 'Dietary Fiber', value: '3g', dv: 11, indent: true },
        { label: 'Total Sugars', value: '20g', dv: null, indent: true },
        { label: 'Incl. Added Sugars', value: '0g', dv: 0, indent: true, subIndent: true },
        { label: 'Protein', value: '3g', dv: 6 },
      ],
      highlights: [
        { label: 'Carbs', value: '33g', percent: 12, color: '#f59e0b' },
        { label: 'Fiber', value: '3g', percent: 11, color: '#10b981' },
        { label: 'Fat', value: '5g', percent: 8, color: '#ec4899' },
      ]
    },
    keyIngredients: [
      { name: 'Mango', benefit: 'Juicy, golden, and loaded with vitamin C for glowing skin and immune support.', image: '/ingredients/mango.png' },
      { name: 'Pineapple', benefit: 'Sweet, tangy, and packed with enzymes to keep your digestion on point.', image: '/ingredients/pineapple.png' },
      { name: 'Banana', benefit: 'Creamy, smooth, and full of potassium to keep you balanced and energized.', image: '/ingredients/banana.png' },
      { name: 'Coconut Meat & Coconut Butter', benefit: 'Rich, satisfying fats that fuel your day and keep you full.', image: '/ingredients/coconut.png' },
      { name: 'Passion Fruit', benefit: 'Bold, tropical flavor with antioxidants to refresh and revitalize.', image: '/ingredients/passionfruit.png' },
      { name: 'Dates', benefit: 'Sweet, fiber-packed, and full of essential minerals.', image: '/ingredients/dates.png' },
      { name: 'Vanilla Extract', benefit: 'A warm, subtle note that ties the tropical flavors together.', image: '/ingredients/vanilla.png' },
    ],
    badges: ['Gluten-Free', 'Dairy-Free', 'Made from Plants', 'Tropical'],
  },
};

const POPULAR_SMOOTHIES = [
  { id: '1', name: 'Strawberry + Peachy', price: 8.49, image: '/products/strawberry-peach/1.png', hoverImage: '/products/strawberry-peach/2.png', badge: 'BEST SELLER', rating: 4.5, reviews: 4619 },
  { id: '9', name: 'Pink Piyata Punch', price: 8.99, image: '/products/pink-piyata/1.png', hoverImage: '/products/pink-piyata/2.png', badge: 'NEW', rating: 4.7, reviews: 127 },
  { id: '10', name: 'Matcha Madness', price: 9.49, image: '/products/matcha/1.png', hoverImage: '/products/matcha/2.png', badge: 'BEST SELLER', rating: 4.8, reviews: 312 },
  { id: '11', name: 'Mocha Protein Fuel', price: 9.49, image: '/products/mocha/gallery-1.jpg', hoverImage: '/products/mocha/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.6, reviews: 245 },
  { id: '14', name: 'Coffee Mushroom', price: 9.99, image: '/products/coffee-mushroom/gallery-1.jpg', hoverImage: '/products/coffee-mushroom/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.8, reviews: 203 },
  { id: '17', name: 'Acai Passionfruit', price: 9.49, image: '/products/acai/Acai-1.png', hoverImage: '/products/acai/Acai-2.png', badge: 'BEST SELLER', rating: 4.9, reviews: 487 },
  { id: '12', name: 'Nutty Monkey', price: 8.99, image: '/products/nutty-monkey/Nutty Monkey-1.png', hoverImage: '/products/nutty-monkey/Nutty Monkey-2.png', badge: 'BEST SELLER', rating: 4.7, reviews: 389 },
  { id: '13', name: 'Mango Jackfruit', price: 8.99, image: '/products/mango-jackfruit/Mango Jackfruit-1.png', hoverImage: '/products/mango-jackfruit/Mango Jackfruit-2.png', badge: 'NEW', rating: 4.8, reviews: 156 },
  { id: '15', name: 'Chocolate Berry Protein', price: 8.99, image: '/products/chocolate-berry/gallery-1.jpg', hoverImage: '/products/chocolate-berry/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.8, reviews: 278 },
  { id: '16', name: 'Almond Luvly', price: 8.99, image: '/products/almond/Almond-1.png', hoverImage: '/products/almond/Almond-2.png', badge: 'BEST SELLER', rating: 4.7, reviews: 187 },
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
          {productData.gallery.slice(0, 2).map((img, index) => (
            <div key={`img-${index}`} className="lv-gallery-image-wrapper">
              <img
                src={img}
                alt={`${productData.name} - View ${index + 1}`}
                className="lv-gallery-image"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}

          {productData.heroVideo && (
            <div key="hero-video" className="lv-gallery-image-wrapper">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="lv-gallery-image"
              >
                <source src={productData.heroVideo} type="video/mp4" />
              </video>
            </div>
          )}

          {productData.gallery.slice(2, 8).map((img, index) => (
            <div key={`img-${index + 2}`} className="lv-gallery-image-wrapper">
              <img
                src={img}
                alt={`${productData.name} - View ${index + 3}`}
                className="lv-gallery-image"
                loading="lazy"
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
              <span className="lv-review-count">(87 reviews)</span>
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
                    <p><strong>Add Liquid:</strong> Fill your cup with water, almond milk, oat milk, or coconut water—your call.</p>
                    <p><strong>Blend:</strong> Blend until smooth, creamy, and vibrant.</p>
                    <p><strong>Enjoy:</strong> Sip, savor, and feel the tropical refreshment fuel your day.</p>
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
                    <p><strong>Free Shipping:</strong> Enjoy free shipping on orders over $50.</p>
                    <p><strong>Standard Delivery:</strong> Get your smoothies in 3–5 business days.</p>
                    <p><strong>Express Delivery:</strong> Need it now? Choose 1–2 day express shipping.</p>
                    <p><strong>Hassle-Free Returns:</strong> Unopened products can be returned within 30 days.</p>
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
            <h2 className="lifestyle-title">Conquer Your Day — Naturally.</h2>
            <p className="lifestyle-subtitle">Real Fuel. Zero Nonsense.</p>
          </div>
          <div className="lifestyle-wrapper">
            <div className="lifestyle-track" id="lifestyle-track">
              {[...Array(2)].map((_, setIndex) => (
                (productData?.lifestyleGallery || DEFAULT_LIFESTYLE_GALLERY).map((slide, index) => (
                  <div key={`${setIndex}-${index}`} className="lifestyle-card">
                    <Image 
                      src={slide.src} 
                      alt={slide.alt} 
                      width={400}
                      height={500}
                      quality={75}
                      priority={setIndex === 0 && index < 3}
                      sizes="(max-width: 768px) 80vw, 400px"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))
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

        {/* The Lineup Section - Infinite scroll carousel */}
        <section className="lineup-section">
          <div className="lineup-header">
            <h2 className="lineup-title">The Lineup</h2>
            <p className="lineup-subtitle">Smoothies So Addictive, They Break Repeat Buttons.</p>
          </div>
          <div className="lineup-wrapper">
            <div className="lineup-track">
              {[...Array(2)].map((_, setIndex) => (
                POPULAR_SMOOTHIES.map((item) => (
                  <div key={`${setIndex}-${item.id}`} className="lineup-card">
                    <SmoothieCard
                      id={item.id}
                      name={item.name}
                      image={item.image}
                      hoverImage={item.hoverImage}
                      badge={item.badge}
                      price={item.price}
                      rating={item.rating}
                      reviews={item.reviews}
                    />
                  </div>
                ))
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
