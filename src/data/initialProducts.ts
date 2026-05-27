import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-theen-nelli-big',
    name: 'Theen Nelli (Big Amla Honey)',
    tamilName: 'தேன் நெல்லிக்காய் - பெரியது',
    price: 440,
    description: 'Whole big wild gooseberries soaked in premium wild forest honey. Packed with Vitamin C and iron, it aids digestion and strengthens immunity.',
    category: 'Amla Honey',
    rating: 4.8,
    image: 'https://res.cloudinary.com/dlddzqqnw/image/upload/v1779903800/Gemini_Generated_Image_7vuisf7vuisf7vui_pvwkb6.png',
    inventory: 50,
    ingredients: ['Whole Indian Gooseberry (Amla)', '100% Pure Natural Forest Honey']
  },
  {
    id: 'prod-chinna-nelli',
    name: 'Chinna Nelli',
    tamilName: 'தேன் நெல்லிக்காய் - சிறியது',
    price: 390,
    description: 'Small organic baby gooseberry pieces soaked in amber forest honey. Easy for children to consume and great for high energy.',
    category: 'Amla Honey',
    rating: 4.7,
    image: 'https://res.cloudinary.com/dlddzqqnw/image/upload/v1779905674/Gemini_Generated_Image_arcgdxarcgdxarcg_xmvn7x.png',
    inventory: 45,
    ingredients: ['Small Country Gooseberry Pieces', 'Pure Farm Honey']
  },
  {
    id: 'prod-theen-perichai',
    name: 'Theen Perichai',
    tamilName: 'தேன் பேரீச்சம்பழம்',
    price: 450,
    description: 'Premium soft Arabian dates soaked completely in natural honey. Rich in iron, fibers, and natural sugars to boost your stamina.',
    category: 'Honey Dates',
    rating: 4.9,
    image: 'https://res.cloudinary.com/dlddzqqnw/image/upload/v1779906185/Gemini_Generated_Image_mu1lfmmu1lfmmu1l_ulpujy.png',
    inventory: 60,
    ingredients: ['Imported Seedless Dates', 'Thirunelveli Pure Rock Honey']
  },
  {
    id: 'prod-honey-dry-fruits',
    name: 'Honey Dry Fruits',
    tamilName: 'தேன் டிரை புரூட்ஸ்',
    price: 480,
    description: 'Assorted premium quality dried walnuts, green raisins, apricot slices blended in single-origin honey.',
    category: 'Dry Fruits',
    rating: 4.8,
    image: 'https://res.cloudinary.com/dlddzqqnw/image/upload/v1779906744/Gemini_Generated_Image_afftvcafftvcafft_zgjhz3.png',
    inventory: 35,
    ingredients: ['Walnuts', 'Dried Apricot', 'Golden Raisins', 'Pure Stingless Bee Honey']
  },
  {
    id: 'prod-theen-athi',
    name: 'Theen Athi',
    tamilName: 'தேன் அத்திப்பழம்',
    price: 460,
    description: 'Delicately dried high-fiber mountain figs preserved in deep golden sweet honey. Perfect combination for heart health and blood purity.',
    category: 'Honey Fig',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&q=80&w=500',
    inventory: 30,
    ingredients: ['Smyrna Dried Figs (Athi)', 'Raw Saffron Infused Honey']
  },
  {
    id: 'prod-theen-inji',
    name: 'Theen Inji',
    tamilName: 'தேன் இஞ்சி',
    price: 350,
    description: 'Traditional home recipe of sliced farm-grown ginger infused in raw organic honey. Outstanding relief for cold, cough, and digestive issues.',
    category: 'Honey Ginger',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=500',
    inventory: 40,
    ingredients: ['Dehydrated Fresh Ginger Slices', 'Thirunelveli Wildwood Honey']
  },
  {
    id: 'prod-raja-rani-mix',
    name: 'Raja Rani Mix',
    tamilName: 'ராஜாராணி மிக்ஸ்',
    price: 550,
    description: 'Royal power house formulation comprising whole pine nuts, almonds, pumpkin pumpkin seeds, and pistachios marinated in top-grade nectar.',
    category: 'Special Mix',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1596450514943-ac434a2c07d5?auto=format&fit=crop&q=80&w=500',
    isBestSeller: true,
    inventory: 25,
    ingredients: ['Almonds', 'Cashews', 'Walnuts', 'Pistachios', 'Pumpkin Seeds', 'Chia Seeds', 'Wild Forest Honey']
  },
  {
    id: 'prod-theen-mundhiri',
    name: 'Theen Mundhiri',
    tamilName: 'தேன் முந்திரி',
    price: 470,
    description: 'Whole select premium roasted cashews marinated in thick wild clover honey. A delightful natural snack full of essential minerals.',
    category: 'Honey Cashew',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1600189020840-e9918c25269d?auto=format&fit=crop&q=80&w=500',
    inventory: 40,
    ingredients: ['Selected Large Cashews', 'Organic Farm Honey']
  },
  {
    id: 'prod-gulkand-dry-fruits',
    name: 'Gulkand Dry Fruits',
    tamilName: 'குல்கந்து டிரை புரூட்ஸ்',
    price: 520,
    description: 'Traditional aromatic sun-cooked rose petal jam (Gulkand) perfectly mixed with hand-chopped premium almonds, cashews and pistachio nuts.',
    category: 'Gulkand Mix',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1512223792601-592a9809eed4?auto=format&fit=crop&q=80&w=500',
    inventory: 30,
    ingredients: ['Paneer Rose Petals', 'Rock Sugar Candy', 'Cashews', 'Almonds', 'Wild Nectar Honey']
  },
  {
    id: 'prod-theen-badam',
    name: 'Theen Badam',
    tamilName: 'தேன் பாதாம்',
    price: 490,
    description: 'Mammoth sized California almonds shelled and thoroughly cured in natural multifloral bee honey. Best consumed daily on empty stomach.',
    category: 'Honey Almond',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6db4?auto=format&fit=crop&q=80&w=500',
    inventory: 50,
    ingredients: ['Premium Shelled Almonds (Badam)', 'Raw Multifloral Honey']
  },
  {
    id: 'prod-theen-naattu-poondu',
    name: 'Theen Naattu Poondu',
    tamilName: 'தேன் நாட்டுப்பூண்டு',
    price: 380,
    description: 'Peeled organic hill garlic cloves slow-cooked and aged in natural liquid gold. Famous south Indian traditional remedy for weight management and cardio health.',
    category: 'Honey Garlic',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1581063324423-edefbb5fcd3c?auto=format&fit=crop&q=80&w=500',
    inventory: 35,
    ingredients: ['Peeled Country Garlic (Naattu Poondu)', '100% Raw Hill Honey']
  }
];
