import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import LVNavbar from '../../components/LVNavbar';
import Footer from '../../components/Footer';
import SmoothieCard from '../../components/SmoothieCard';

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
    image: '/products/strawberry-peach/gallery-1.png',
    shortDescription: 'Creamy strawberry bliss',
    tagline: 'a scoop of strawberry-banana sorbet',
    rating: { average: 4.5, count: 4619 },
    gallery: [
      '/products/strawberry-peach/gallery-1.png',
      '/products/strawberry-peach/gallery-2.png',
      '/products/strawberry-peach/gallery-3.png',
      '/products/strawberry-peach/gallery-4.png',
      '/products/strawberry-peach/gallery-5.png',
      '/products/strawberry-peach/gallery-6.png',
      '/products/strawberry-peach/gallery-7.png',
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
    tagline: 'island vibes in a cup',
    rating: { average: 4.7, count: 2134 },
    gallery: [
      '/products/mango-jackfruit/gallery-1.jpg',
      '/products/mango-jackfruit/gallery-2.jpg',
      '/products/mango-jackfruit/gallery-3.jpg',
      '/products/mango-jackfruit/gallery-4.jpg',
      '/products/mango-jackfruit/gallery-5.jpg',
      '/products/mango-jackfruit/gallery-6.jpg',
      '/products/mango-jackfruit/gallery-7.jpg',
      '/products/mango-jackfruit/gallery-8.jpg',
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
  { id: '1', name: 'Strawberry + Peach', price: 8.49, image: '/products/strawberry-peach/gallery-1.png', hoverImage: '/products/strawberry-peach/gallery-2.png', badge: 'BEST SELLER', rating: 4.5, reviews: 4619 },
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
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [openSections, setOpenSections] = useState({
    productDetails: false,
    deliveryReturns: false,
    gifting: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!product || !productData) {
    return (
      <div className="lv-page">
        <LVNavbar />
        <div className="lv-not-found">
          <h1>Product not found</h1>
          <Link href="/collections/smoothies">
            Back to Smoothies
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="lv-page">
      <LVNavbar />
      
      <main className="lv-main">
        <section className="lv-product-section">
          <div className="lv-product-grid">
            <div className="lv-product-gallery">
              <div className="lv-gallery-main">
                <button 
                  className="lv-gallery-nav lv-gallery-nav-left"
                  onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : productData.gallery.length - 1)}
                  aria-label="Previous image"
                >
                  <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
                    <path d="M8 2L2 8L8 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <img
                  src={productData.gallery[selectedImageIndex]}
                  alt={productData.name}
                  className="lv-gallery-image"
                />
                <button 
                  className="lv-gallery-nav lv-gallery-nav-right"
                  onClick={() => setSelectedImageIndex(prev => prev < productData.gallery.length - 1 ? prev + 1 : 0)}
                  aria-label="Next image"
                >
                  <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
                    <path d="M2 2L8 8L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <div className="lv-gallery-thumbs-row">
                {productData.gallery.slice(0, 7).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`lv-gallery-thumb-btn ${selectedImageIndex === index ? 'active' : ''}`}
                  >
                    <img src={img} alt={`View ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="lv-product-info">
              <span className="lv-product-sku">DRZ-{productData.id.padStart(5, '0')}</span>
              <h1 className="lv-product-title">{productData.name}</h1>
              <p className="lv-product-price">${productData.price.toFixed(2)}</p>

              <button className="lv-add-to-bag">ADD TO SHOPPING BAG</button>

              <div className="lv-product-actions">
                <button className="lv-action-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Find in Store
                </button>
                <button className="lv-action-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  Add to Wishlist
                </button>
              </div>

              <div className="lv-divider"></div>

              <div className="lv-description-section">
                <p className={`lv-description-text ${descriptionExpanded ? 'expanded' : ''}`}>
                  {productData.description}
                </p>
                {productData.description.length > 150 && (
                  <button 
                    className="lv-read-more-btn"
                    onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                  >
                    {descriptionExpanded ? 'Read less' : 'Read more'}
                  </button>
                )}
              </div>

              <div className="lv-accordion">
                <div className="lv-accordion-item">
                  <button 
                    className="lv-accordion-header"
                    onClick={() => toggleSection('productDetails')}
                  >
                    <span>Product Details</span>
                    <span className="lv-accordion-icon">{openSections.productDetails ? '−' : '+'}</span>
                  </button>
                  {openSections.productDetails && (
                    <div className="lv-accordion-body">
                      <p><strong>Ingredients:</strong> {productData.ingredients}</p>
                      <div className="lv-nutrition-list">
                        {productData.nutrition.map((item, index) => (
                          <div key={index} className="lv-nutrition-row">
                            <span>{item.label}</span>
                            <span>{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="lv-accordion-item">
                  <button 
                    className="lv-accordion-header"
                    onClick={() => toggleSection('deliveryReturns')}
                  >
                    <span>Delivery & Returns</span>
                    <span className="lv-accordion-icon">{openSections.deliveryReturns ? '−' : '+'}</span>
                  </button>
                  {openSections.deliveryReturns && (
                    <div className="lv-accordion-body">
                      <p>Free standard delivery on orders over $50.</p>
                      <p>Express delivery available for $9.99.</p>
                      <p>Due to the frozen nature of our products, returns are not accepted. If you receive a damaged product, please contact our customer service team.</p>
                    </div>
                  )}
                </div>

                <div className="lv-accordion-item">
                  <button 
                    className="lv-accordion-header"
                    onClick={() => toggleSection('gifting')}
                  >
                    <span>Gifting</span>
                    <span className="lv-accordion-icon">{openSections.gifting ? '−' : '+'}</span>
                  </button>
                  {openSections.gifting && (
                    <div className="lv-accordion-body">
                      <p>Each order is beautifully packaged in our signature insulated box.</p>
                      <p>Add a personalized gift message at checkout.</p>
                      <p>Corporate gifting available for orders of 10+ units.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="lv-recommendations">
          <div className="lv-recommendations-container">
            <h2 className="lv-recommendations-title">You May Also Like</h2>
            <div className="lv-recommendations-grid">
              {POPULAR_SMOOTHIES.filter(s => s.id !== productId).slice(0, 4).map((item) => (
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
