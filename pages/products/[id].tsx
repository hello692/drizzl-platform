import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SmoothieCard from '../../components/SmoothieCard';

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
    image: '/products/strawberry-peach/gallery-1.jpg',
    shortDescription: 'Creamy strawberry bliss',
    tagline: 'a scoop of strawberry-banana sorbet',
    rating: { average: 4.5, count: 4619 },
    gallery: [
      '/products/strawberry-peach/gallery-1.jpg',
      '/products/strawberry-peach/gallery-2.jpg',
      '/products/strawberry-peach/gallery-3.jpg',
      '/products/strawberry-peach/gallery-5.jpg',
      '/products/strawberry-peach/gallery-10.jpg',
      '/products/strawberry-peach/gallery-11.jpg',
      '/products/strawberry-peach/gallery-13.jpg',
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
    image: '/products/coffee-mushroom/gallery-1.jpg',
    shortDescription: 'Adaptogenic energy',
    tagline: 'your morning coffee evolved',
    rating: { average: 4.6, count: 1893 },
    gallery: [
      '/products/coffee-mushroom/gallery-1.jpg',
      '/products/coffee-mushroom/gallery-2.jpg',
      '/products/coffee-mushroom/gallery-3.jpg',
      '/products/coffee-mushroom/gallery-4.jpg',
      '/products/coffee-mushroom/gallery-5.jpg',
      '/products/coffee-mushroom/gallery-6.jpg',
      '/products/coffee-mushroom/gallery-7.jpg',
      '/products/coffee-mushroom/gallery-8.jpg',
      '/products/coffee-mushroom/gallery-9.jpg',
      '/products/coffee-mushroom/gallery-10.jpg',
      '/products/coffee-mushroom/gallery-11.jpg',
      '/products/coffee-mushroom/gallery-12.jpg',
      '/products/coffee-mushroom/gallery-13.jpg',
      '/products/coffee-mushroom/gallery-14.jpg',
      '/products/coffee-mushroom/gallery-15.jpg',
      '/products/coffee-mushroom/gallery-16.jpg',
      '/products/coffee-mushroom/gallery-17.jpg',
      '/products/coffee-mushroom/gallery-18.jpg',
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
    image: '/products/chocolate-berry/gallery-1.jpg',
    shortDescription: 'Decadent & nutritious',
    tagline: 'indulgence meets wellness',
    rating: { average: 4.8, count: 2891 },
    gallery: [
      '/products/chocolate-berry/gallery-1.jpg',
      '/products/chocolate-berry/gallery-2.jpg',
      '/products/chocolate-berry/gallery-3.jpg',
      '/products/chocolate-berry/gallery-4.jpg',
      '/products/chocolate-berry/gallery-5.jpg',
      '/products/chocolate-berry/gallery-6.jpg',
      '/products/chocolate-berry/gallery-7.jpg',
      '/products/chocolate-berry/gallery-8.jpg',
      '/products/chocolate-berry/gallery-9.jpg',
      '/products/chocolate-berry/gallery-10.jpg',
      '/products/chocolate-berry/gallery-11.jpg',
      '/products/chocolate-berry/gallery-12.jpg',
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
    image: '/products/almond/gallery-1.jpg',
    shortDescription: 'Creamy & nutty',
    tagline: 'pure almond bliss',
    rating: { average: 4.7, count: 1876 },
    gallery: [
      '/products/almond/gallery-1.jpg',
      '/products/almond/gallery-2.jpg',
      '/products/almond/gallery-3.jpg',
      '/products/almond/gallery-4.jpg',
      '/products/almond/gallery-5.jpg',
      '/products/almond/gallery-6.jpg',
      '/products/almond/gallery-7.jpg',
      '/products/almond/gallery-8.jpg',
      '/products/almond/gallery-9.jpg',
      '/products/almond/gallery-10.jpg',
      '/products/almond/gallery-11.jpg',
      '/products/almond/gallery-12.jpg',
      '/products/almond/gallery-13.jpg',
      '/products/almond/gallery-14.jpg',
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
    image: '/products/acai/gallery-1.jpg',
    shortDescription: 'Amazonian superfruit',
    tagline: 'the Amazon in a cup',
    rating: { average: 4.9, count: 5234 },
    gallery: [
      '/products/acai/gallery-1.jpg',
      '/products/acai/gallery-2.jpg',
      '/products/acai/gallery-3.jpg',
      '/products/acai/gallery-4.jpg',
      '/products/acai/gallery-5.jpg',
      '/products/acai/gallery-6.jpg',
      '/products/acai/gallery-7.jpg',
      '/products/acai/gallery-8.jpg',
      '/products/acai/gallery-9.jpg',
      '/products/acai/gallery-10.jpg',
      '/products/acai/gallery-11.jpg',
      '/products/acai/gallery-12.jpg',
      '/products/acai/gallery-13.jpg',
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
    image: '/products/mango-jackfruit/gallery-1.jpg',
    shortDescription: 'Tropical paradise',
    tagline: 'sunshine in every sip',
    rating: { average: 4.8, count: 2134 },
    gallery: [
      '/products/mango-jackfruit/gallery-1.jpg',
      '/products/mango-jackfruit/gallery-2.jpg',
      '/products/mango-jackfruit/gallery-3.jpg',
      '/products/mango-jackfruit/gallery-4.jpg',
      '/products/mango-jackfruit/gallery-5.jpg',
      '/products/mango-jackfruit/gallery-6.jpg',
      '/products/mango-jackfruit/gallery-7.jpg',
      '/products/mango-jackfruit/gallery-8.jpg',
      '/products/mango-jackfruit/gallery-9.jpg',
      '/products/mango-jackfruit/gallery-10.jpg',
      '/products/mango-jackfruit/gallery-11.jpg',
      '/products/mango-jackfruit/gallery-12.jpg',
      '/products/mango-jackfruit/gallery-13.jpg',
      '/products/mango-jackfruit/gallery-14.jpg',
      '/products/mango-jackfruit/gallery-15.jpg',
      '/products/mango-jackfruit/gallery-16.jpg',
      '/products/mango-jackfruit/gallery-17.jpg',
      '/products/mango-jackfruit/gallery-18.jpg',
      '/products/mango-jackfruit/gallery-19.jpg',
      '/products/mango-jackfruit/gallery-20.jpg',
      '/products/mango-jackfruit/gallery-21.jpg',
      '/products/mango-jackfruit/gallery-22.jpg',
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
  { id: '1', name: 'Strawberry + Peach', price: 8.49, image: '/products/strawberry-peach/gallery-1.jpg', hoverImage: '/products/strawberry-peach/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.5, reviews: 4619 },
  { id: '9', name: 'Pink Piyata', price: 8.99, image: '/products/pink-piyata/gallery-1.jpg', hoverImage: '/products/pink-piyata/gallery-2.jpg', badge: 'NEW', rating: 4.7, reviews: 127 },
  { id: '10', name: 'Matcha', price: 9.49, image: '/products/matcha/gallery-1.jpg', hoverImage: '/products/matcha/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.8, reviews: 312 },
  { id: '11', name: 'Mocha', price: 9.49, image: '/products/mocha/gallery-1.jpg', hoverImage: '/products/mocha/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.6, reviews: 245 },
  { id: '14', name: 'Coffee Mushroom', price: 9.99, image: '/products/coffee-mushroom/gallery-1.jpg', hoverImage: '/products/coffee-mushroom/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.8, reviews: 203 },
  { id: '17', name: 'Acai', price: 9.49, image: '/products/acai/gallery-1.jpg', hoverImage: '/products/acai/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.9, reviews: 487 },
  { id: '12', name: 'Nutty Monkey', price: 8.99, image: '/products/nutty-monkey/gallery-1.jpg', hoverImage: '/products/nutty-monkey/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.7, reviews: 389 },
  { id: '13', name: 'Mango Jackfruit', price: 8.99, image: '/products/mango-jackfruit/gallery-1.jpg', hoverImage: '/products/mango-jackfruit/gallery-2.jpg', badge: 'NEW', rating: 4.8, reviews: 156 },
  { id: '15', name: 'Chocolate Berry', price: 8.99, image: '/products/chocolate-berry/gallery-1.jpg', hoverImage: '/products/chocolate-berry/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.8, reviews: 278 },
  { id: '16', name: 'Almond', price: 8.99, image: '/products/almond/gallery-1.jpg', hoverImage: '/products/almond/gallery-2.jpg', badge: 'BEST SELLER', rating: 4.7, reviews: 187 },
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
  const [lifestyleScale, setLifestyleScale] = useState(1);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const lifestyleSectionRef = useRef<HTMLDivElement>(null);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Scroll-triggered fullscreen effect for lifestyle cards
  useEffect(() => {
    const handleScroll = () => {
      if (!lifestyleSectionRef.current) return;
      
      const section = lifestyleSectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress through the section (0 to 1)
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      // Start animation when section enters viewport
      if (sectionTop < windowHeight && sectionTop > -sectionHeight) {
        // Progress from 0 (section enters) to 1 (section leaves)
        const progress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight * 0.5)));
        
        // Scale from 1 to 1.8 as user scrolls
        const scale = 1 + (progress * 0.8);
        setLifestyleScale(Math.min(scale, 1.8));
        
        // Change active card based on progress
        const cardIndex = Math.floor(progress * 5);
        setActiveCardIndex(Math.min(cardIndex, 4));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          paddingBottom: '0',
          textAlign: 'center',
        }}>
          {/* Product Name */}
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

          {/* Tagline */}
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            fontWeight: '400',
            color: apple.textSecondary,
            margin: '0 auto 32px',
            maxWidth: '600px',
            lineHeight: '1.5',
          }}>
            Inspired by {productData.tagline}
          </p>

          {/* CTA */}
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

          {/* Large Hero Product Image */}
          <div style={{
            maxWidth: '700px',
            margin: '0 auto',
            padding: '0 24px',
            overflow: 'hidden',
          }}>
            <img
              src={productData.gallery[selectedImageIndex]}
              alt={productData.name}
              style={{
                width: '100%',
                maxHeight: '700px',
                objectFit: 'contain',
                ...(productId === '1' ? { marginTop: '-10px' } : {}),
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

          {/* Accordion Sections - Menu Style - Black Background */}
          <div style={{
            backgroundColor: '#000000',
            margin: '40px 0 0',
            padding: '40px 24px',
          }}>
            <div style={{
              maxWidth: '600px',
              margin: '0 auto',
              textAlign: 'left',
            }}>
            {/* All Ingredients */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
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
                    color: '#ffffff',
                    marginBottom: '4px',
                  }}>
                    Ingredients
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#ffffff',
                  }}>
                    What goes in every cup
                  </div>
                </div>
                <span style={{
                  fontSize: '24px',
                  color: '#ffffff',
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
                  color: '#ffffff',
                  lineHeight: '1.6',
                  margin: 0,
                }}>
                  {productData.ingredients}
                </p>
              )}
            </div>

            {/* Nutrition Facts */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
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
                    color: '#ffffff',
                    marginBottom: '4px',
                  }}>
                    Nutrition
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#ffffff',
                  }}>
                    What you put in matters
                  </div>
                </div>
                <span style={{
                  fontSize: '24px',
                  color: '#ffffff',
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
                      <span style={{ color: '#ffffff', fontWeight: '500' }}>{item.label}:</span>
                      <span style={{ color: '#ffffff' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
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
                    color: '#ffffff',
                    marginBottom: '4px',
                  }}>
                    About
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#ffffff',
                  }}>
                    Taste the difference
                  </div>
                </div>
                <span style={{
                  fontSize: '24px',
                  color: '#ffffff',
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
                  color: '#ffffff',
                  lineHeight: '1.6',
                  margin: 0,
                }}>
                  {productData.description}
                </p>
              )}
            </div>

            {/* Key Ingredients */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
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
                    color: '#ffffff',
                    marginBottom: '4px',
                  }}>
                    Key Ingredients
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#ffffff',
                  }}>
                    The power behind every sip
                  </div>
                </div>
                <span style={{
                  fontSize: '24px',
                  color: '#ffffff',
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
                      <span style={{ color: '#ffffff', fontWeight: '500' }}>{ingredient.name}: </span>
                      <span style={{ color: '#ffffff' }}>{ingredient.benefit}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* How to Prep */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
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
                    color: '#ffffff',
                    marginBottom: '4px',
                  }}>
                    How to Prepare
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#ffffff',
                  }}>
                    Ready in 60 seconds
                  </div>
                </div>
                <span style={{
                  fontSize: '24px',
                  color: '#ffffff',
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
                    <span style={{ color: '#ffffff', fontWeight: '500' }}>1. Add liquid: </span>
                    <span style={{ color: '#ffffff' }}>Fill cup to top with water, oat milk, or coconut water.</span>
                  </div>
                  <div style={{ fontSize: '15px' }}>
                    <span style={{ color: '#ffffff', fontWeight: '500' }}>2. Blend: </span>
                    <span style={{ color: '#ffffff' }}>Pour into a blender and blend until silky smooth.</span>
                  </div>
                  <div style={{ fontSize: '15px' }}>
                    <span style={{ color: '#ffffff', fontWeight: '500' }}>3. Enjoy: </span>
                    <span style={{ color: '#ffffff' }}>Pour back into your cup. Sip. Smile. Repeat.</span>
                  </div>
                </div>
              )}
            </div>
            </div>
          </div>
        </section>

        {/* Lifestyle Story Section - TikTok-style Scroll Effect */}
        <section className="lifestyle-story-section" ref={lifestyleSectionRef}>
          <div className="lifestyle-story-container">
            <h2 className="lifestyle-story-title" style={{
              opacity: Math.max(0, 1 - (lifestyleScale - 1) * 2),
              transform: `translateY(${(lifestyleScale - 1) * -50}px)`,
            }}>Your Everyday — Powered Naturally.</h2>
            <p className="lifestyle-story-subtitle" style={{
              opacity: Math.max(0, 1 - (lifestyleScale - 1) * 2),
              transform: `translateY(${(lifestyleScale - 1) * -30}px)`,
            }}>Real nourishment. Real moments. Real life.</p>
            
            <div className="lifestyle-cards-wrapper" style={{ overflow: 'visible' }}>
              <div className="lifestyle-cards-track" style={{
                transform: `scale(${lifestyleScale})`,
                transformOrigin: 'center center',
                gap: `${Math.max(20 - (lifestyleScale - 1) * 30, 0)}px`,
              }}>
                {[
                  { img: '/lifestyle/beach.jpg', label: 'Find balance' },
                  { img: '/lifestyle/biking.jpg', label: 'Move freely' },
                  { img: '/lifestyle/bees.jpg', label: 'Powered by nature' },
                  { img: '/lifestyle/skiing.jpg', label: 'Live fully' },
                  { img: '/lifestyle/wellness.jpg', label: 'Fuel joy' },
                ].map((card, index) => (
                  <div 
                    key={index}
                    className={`lifestyle-card ${activeCardIndex === index ? 'lifestyle-card-active' : ''}`}
                    style={{
                      transform: activeCardIndex === index && lifestyleScale > 1.3 
                        ? `scale(${1 + (lifestyleScale - 1.3) * 0.5})` 
                        : 'scale(1)',
                      zIndex: activeCardIndex === index ? 10 : 1,
                      opacity: lifestyleScale > 1.5 && activeCardIndex !== index 
                        ? Math.max(0, 1 - (lifestyleScale - 1.5) * 3) 
                        : 1,
                    }}
                  >
                    <img src={card.img} alt={card.label} />
                    <div className="lifestyle-card-overlay">
                      <span>{card.label}</span>
                    </div>
                  </div>
                ))}
              </div>
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
