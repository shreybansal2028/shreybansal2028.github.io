export type StoreBrand = 'Zara' | 'H&M' | 'Myntra' | 'ASOS' | 'Uniqlo' | 'Snitch'

export type ProductCategory = 'All' | 'Top' | 'Bottom' | 'Outerwear' | 'Shoes' | 'Accessories'

export interface StoreProduct {
  id: string
  brand: StoreBrand
  title: string
  category: 'Top' | 'Bottom' | 'Outerwear' | 'Shoes' | 'Accessories'
  price: string
  originalPrice?: string
  discount?: string
  imageUrl: string
  storeUrl: string
  tags: string[]
  inStock: boolean
  rating: string
  reviewsCount?: number
  material?: string
  fit?: string
}

export interface BrandConfigItem {
  name: StoreBrand
  tagline: string
  color: string
  accent: string
  logoEmoji: string
  homeUrl: string
  searchUrl: (query: string) => string
  categoryUrls: Record<'Top' | 'Bottom' | 'Outerwear' | 'Shoes' | 'Accessories', string>
  badge: string
}

export const BRAND_CONFIG: Record<StoreBrand, BrandConfigItem> = {
  Zara: {
    name: 'Zara',
    tagline: 'Modern High-Street, Architectural Cuts & Tailored Chic',
    color: '#000000',
    accent: '#f43f5e',
    logoEmoji: '🏷️',
    homeUrl: 'https://www.zara.com/in/',
    searchUrl: (q: string) => `https://www.zara.com/in/en/search?searchTerm=${encodeURIComponent(q)}`,
    categoryUrls: {
      Top: 'https://www.zara.com/in/en/man-shirts-l737.html',
      Bottom: 'https://www.zara.com/in/en/man-trousers-l838.html',
      Outerwear: 'https://www.zara.com/in/en/man-jackets-l815.html',
      Shoes: 'https://www.zara.com/in/en/man-shoes-l769.html',
      Accessories: 'https://www.zara.com/in/en/man-accessories-l537.html',
    },
    badge: 'High Street Icon',
  },
  'H&M': {
    name: 'H&M',
    tagline: 'Everyday Essentials, Relaxed Silhouettes & Sustainable Basics',
    color: '#ba0c2f',
    accent: '#ef4444',
    logoEmoji: '🛍️',
    homeUrl: 'https://www2.hm.com/en_in/',
    searchUrl: (q: string) => `https://www2.hm.com/en_in/search-results.html?q=${encodeURIComponent(q)}`,
    categoryUrls: {
      Top: 'https://www2.hm.com/en_in/men/shop-by-product/t-shirts-and-tanks.html',
      Bottom: 'https://www2.hm.com/en_in/men/shop-by-product/trousers.html',
      Outerwear: 'https://www2.hm.com/en_in/men/shop-by-product/hoodies-sweatshirts.html',
      Shoes: 'https://www2.hm.com/en_in/men/shop-by-product/shoes.html',
      Accessories: 'https://www2.hm.com/en_in/men/shop-by-product/accessories.html',
    },
    badge: 'Everyday Classic',
  },
  Myntra: {
    name: 'Myntra',
    tagline: 'India’s #1 Fashion Destination • Street Drops, Brands & Fast Delivery',
    color: '#ff3f6c',
    accent: '#f59e0b',
    logoEmoji: '📦',
    homeUrl: 'https://www.myntra.com/',
    searchUrl: (q: string) => `https://www.myntra.com/${encodeURIComponent(q.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`,
    categoryUrls: {
      Top: 'https://www.myntra.com/men-tshirts',
      Bottom: 'https://www.myntra.com/men-jeans',
      Outerwear: 'https://www.myntra.com/men-jackets',
      Shoes: 'https://www.myntra.com/casual-shoes',
      Accessories: 'https://www.myntra.com/men-accessories',
    },
    badge: 'Express Shipping',
  },
  ASOS: {
    name: 'ASOS',
    tagline: 'Global Streetwear, Y2K Nostalgia & Independent Cult Labels',
    color: '#2d2d2d',
    accent: '#8b5cf6',
    logoEmoji: '👟',
    homeUrl: 'https://www.asos.com/',
    searchUrl: (q: string) => `https://www.asos.com/search/?q=${encodeURIComponent(q)}`,
    categoryUrls: {
      Top: 'https://www.asos.com/men/t-shirts-vests/cat/?cid=7616',
      Bottom: 'https://www.asos.com/men/trousers-chinos/cat/?cid=4910',
      Outerwear: 'https://www.asos.com/men/jackets-coats/cat/?cid=3606',
      Shoes: 'https://www.asos.com/men/shoes-boots-trainers/cat/?cid=4172',
      Accessories: 'https://www.asos.com/men/accessories/cat/?cid=4210',
    },
    badge: 'London Street Style',
  },
  Uniqlo: {
    name: 'Uniqlo',
    tagline: 'Japanese LifeWear • Supima Cotton, AIRism & Clean Minimalist Cuts',
    color: '#e60012',
    accent: '#ec4899',
    logoEmoji: '🎌',
    homeUrl: 'https://www.uniqlo.com/in/en/',
    searchUrl: (q: string) => `https://www.uniqlo.com/in/en/search/?q=${encodeURIComponent(q)}`,
    categoryUrls: {
      Top: 'https://www.uniqlo.com/in/en/men/tops',
      Bottom: 'https://www.uniqlo.com/in/en/men/bottoms',
      Outerwear: 'https://www.uniqlo.com/in/en/men/outerwear',
      Shoes: 'https://www.uniqlo.com/in/en/men/shoes',
      Accessories: 'https://www.uniqlo.com/in/en/men/accessories',
    },
    badge: 'LifeWear Innovation',
  },
  Snitch: {
    name: 'Snitch',
    tagline: 'Gen-Z Fast Fashion • Relaxed Korean Fits, Textured Linens & Heavy Drops',
    color: '#1a1a1a',
    accent: '#10b981',
    logoEmoji: '⚡',
    homeUrl: 'https://www.snitch.co.in/',
    searchUrl: (q: string) => `https://www.snitch.co.in/search?q=${encodeURIComponent(q)}`,
    categoryUrls: {
      Top: 'https://www.snitch.co.in/collections/shirts',
      Bottom: 'https://www.snitch.co.in/collections/trousers',
      Outerwear: 'https://www.snitch.co.in/collections/jackets',
      Shoes: 'https://www.snitch.co.in/collections/shoes',
      Accessories: 'https://www.snitch.co.in/collections/accessories',
    },
    badge: 'Viral Gen-Z Drops',
  },
}

export const CATEGORY_INFO: Record<
  ProductCategory,
  { label: string; icon: string; description: string }
> = {
  All: {
    label: 'All Pieces',
    icon: '✨',
    description: 'Browse the entire wardrobe drop across top brands',
  },
  Top: {
    label: 'Tops & Shirts',
    icon: '👕',
    description: 'Oversized tees, boxy linen shirts, knit polos and graphic drops',
  },
  Bottom: {
    label: 'Bottoms & Pants',
    icon: '👖',
    description: 'Wide-leg tailored trousers, baggy denim, cargos & parachute pants',
  },
  Outerwear: {
    label: 'Jackets & Hoodies',
    icon: '🧥',
    description: 'Heavyweight fleeces, oversized bombers, workwear jackets & blazers',
  },
  Shoes: {
    label: 'Footwear & Shoes',
    icon: '👟',
    description: 'Chunky loafers, vintage retro skate court sneakers, & boots',
  },
  Accessories: {
    label: 'Bags & Accents',
    icon: '🎒',
    description: 'Modular crossbodies, bucket hats, sunglasses & silver accents',
  },
}

export function getAllStoreProducts(): StoreProduct[] {
  return [
    // ════════════════════════════════════════════════════════════════
    // 1. ZARA (High-Street & Tailored Cuts)
    // ════════════════════════════════════════════════════════════════
    {
      id: 'zara-top-1',
      brand: 'Zara',
      title: 'Structured Relaxed Fit Poplin Overshirt',
      category: 'Top',
      price: '₹3,590',
      imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.zara.com/in/en/search?searchTerm=poplin+overshirt',
      tags: ['New In', 'Relaxed Fit', 'Minimal'],
      inStock: true,
      rating: '4.8',
      reviewsCount: 312,
      material: '100% Breathable Poplin Cotton',
      fit: 'Relaxed Drop-Shoulder',
    },
    {
      id: 'zara-top-2',
      brand: 'Zara',
      title: 'Textured Open-Knit Resort Polo Shirt',
      category: 'Top',
      price: '₹3,290',
      imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.zara.com/in/en/search?searchTerm=knit+polo+shirt',
      tags: ['Trending', 'Resort Vibe', 'Textured'],
      inStock: true,
      rating: '4.9',
      reviewsCount: 184,
      material: 'Cotton-Viscose Blend',
      fit: 'Regular Boxy Fit',
    },
    {
      id: 'zara-bottom-1',
      brand: 'Zara',
      title: 'Wide Leg Tailored Pleated Trousers',
      category: 'Bottom',
      price: '₹4,990',
      imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.zara.com/in/en/search?searchTerm=wide+leg+pleated+trousers',
      tags: ['Best Seller', 'Puddle Hem', 'Tailored'],
      inStock: true,
      rating: '4.9',
      reviewsCount: 620,
      material: 'Flowy Viscose Twill',
      fit: 'Wide Leg High Rise',
    },
    {
      id: 'zara-bottom-2',
      brand: 'Zara',
      title: 'Relaxed Fit Washed Ecru Denim Jeans',
      category: 'Bottom',
      price: '₹4,590',
      imageUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.zara.com/in/en/search?searchTerm=relaxed+denim+jeans',
      tags: ['Clean Fit', 'Raw Wash'],
      inStock: true,
      rating: '4.7',
      reviewsCount: 245,
      material: '100% Rigid Denim',
      fit: 'Relaxed Straight Cut',
    },
    {
      id: 'zara-outer-1',
      brand: 'Zara',
      title: 'Structured Double-Breasted Minimal Blazer',
      category: 'Outerwear',
      price: '₹7,990',
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.zara.com/in/en/search?searchTerm=double+breasted+blazer',
      tags: ['Runway Drop', 'Sharp Cut'],
      inStock: true,
      rating: '4.9',
      reviewsCount: 156,
      material: 'Lightweight Wool Blend',
      fit: 'Structured Boxy',
    },
    {
      id: 'zara-shoes-1',
      brand: 'Zara',
      title: 'Lug-Sole Leather Chunky Loafers',
      category: 'Shoes',
      price: '₹5,590',
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.zara.com/in/en/search?searchTerm=chunky+leather+loafers',
      tags: ['High Shine', 'Comfort Insole', 'Trending'],
      inStock: true,
      rating: '4.7',
      reviewsCount: 418,
      material: '100% Genuine Cowhide',
      fit: 'True to Size',
    },
    {
      id: 'zara-acc-1',
      brand: 'Zara',
      title: 'Minimalist Modular Crossbody Leather Bag',
      category: 'Accessories',
      price: '₹2,990',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.zara.com/in/en/search?searchTerm=crossbody+leather+bag',
      tags: ['Clean Aesthetic', 'Magnetic Clasp'],
      inStock: true,
      rating: '4.8',
      reviewsCount: 190,
      material: 'Full Grain Vegan Leather',
    },

    // ════════════════════════════════════════════════════════════════
    // 2. H&M (Relaxed Essentials & Cozy Silhouettes)
    // ════════════════════════════════════════════════════════════════
    {
      id: 'hm-top-1',
      brand: 'H&M',
      title: 'Relaxed Fit Heavyweight Cotton Boxy T-shirt',
      category: 'Top',
      price: '₹999',
      originalPrice: '₹1,499',
      discount: '33% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www2.hm.com/en_in/search-results.html?q=heavyweight+t+shirt',
      tags: ['Heavy Cotton', 'Everyday Staple'],
      inStock: true,
      rating: '4.7',
      reviewsCount: 1420,
      material: '240 GSM Carded Cotton',
      fit: 'Oversized Boxy',
    },
    {
      id: 'hm-top-2',
      brand: 'H&M',
      title: 'Resort Collar Linen-Blend Short Sleeve Shirt',
      category: 'Top',
      price: '₹1,999',
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www2.hm.com/en_in/search-results.html?q=resort+collar+shirt',
      tags: ['Breathable', 'Holiday Vibe'],
      inStock: true,
      rating: '4.6',
      reviewsCount: 390,
      material: '55% Linen, 45% Cotton',
      fit: 'Relaxed Fit',
    },
    {
      id: 'hm-bottom-1',
      brand: 'H&M',
      title: 'Loose Fit Carpenter Denim Workwear Jeans',
      category: 'Bottom',
      price: '₹2,699',
      originalPrice: '₹3,299',
      discount: '18% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www2.hm.com/en_in/search-results.html?q=carpenter+jeans',
      tags: ['Utility Loops', 'Vintage Wash'],
      inStock: true,
      rating: '4.8',
      reviewsCount: 890,
      material: 'Midweight Denim',
      fit: 'Loose Skate Fit',
    },
    {
      id: 'hm-outer-1',
      brand: 'H&M',
      title: 'Heavy Fleece Brushed Interior Hoodie',
      category: 'Outerwear',
      price: '₹1,999',
      originalPrice: '₹2,499',
      discount: '20% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www2.hm.com/en_in/search-results.html?q=relaxed+hoodie',
      tags: ['Trending', 'Cozy Warmth', 'Double Hood'],
      inStock: true,
      rating: '4.8',
      reviewsCount: 2150,
      material: 'Cotton-Polyester Blend',
      fit: 'Slouchy Dropped Shoulder',
    },
    {
      id: 'hm-shoes-1',
      brand: 'H&M',
      title: 'Retro Court Low-Top Canvas Sneakers',
      category: 'Shoes',
      price: '₹2,299',
      imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www2.hm.com/en_in/search-results.html?q=retro+court+sneakers',
      tags: ['Rubber Toe', 'Daily Beater'],
      inStock: true,
      rating: '4.5',
      reviewsCount: 320,
      material: 'Canvas with Vulcanized Sole',
    },
    {
      id: 'hm-acc-1',
      brand: 'H&M',
      title: 'Textured Waffle Rib-Knit Beanie',
      category: 'Accessories',
      price: '₹799',
      imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www2.hm.com/en_in/search-results.html?q=waffle+knit+beanie',
      tags: ['Eco Blend', 'Folded Brim'],
      inStock: true,
      rating: '4.6',
      reviewsCount: 640,
    },

    // ════════════════════════════════════════════════════════════════
    // 3. MYNTRA (Fast Drops, Streetwear & Verified Deals)
    // ════════════════════════════════════════════════════════════════
    {
      id: 'myntra-top-1',
      brand: 'Myntra',
      title: 'Roadster Acid-Wash Dropped Shoulder Graphic Tee',
      category: 'Top',
      price: '₹799',
      originalPrice: '₹1,499',
      discount: '46% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.myntra.com/men-tshirts?f=Brand%3ARoadster',
      tags: ['Super Deal', 'Pure Cotton', 'Vintage Acid'],
      inStock: true,
      rating: '4.7',
      reviewsCount: 3820,
      material: '100% Combed Cotton',
      fit: 'Oversized Street Cut',
    },
    {
      id: 'myntra-bottom-1',
      brand: 'Myntra',
      title: 'Highlander 6-Pocket Parachute Cargo Trousers',
      category: 'Bottom',
      price: '₹1,249',
      originalPrice: '₹2,299',
      discount: '45% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.myntra.com/men-trousers?f=Categories%3ACargos',
      tags: ['Gen-Z Top Pick', 'Drawstring Hem', 'Deep Pockets'],
      inStock: true,
      rating: '4.8',
      reviewsCount: 2940,
      material: 'Ripstop Cotton Twill',
      fit: 'Baggy Parachute Fit',
    },
    {
      id: 'myntra-outer-1',
      brand: 'Myntra',
      title: 'Roadster Sherpa-Collar Heavy Corduroy Trucker',
      category: 'Outerwear',
      price: '₹2,499',
      originalPrice: '₹4,999',
      discount: '50% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.myntra.com/men-jackets',
      tags: ['Winter Essential', 'Warm Sherpa'],
      inStock: true,
      rating: '4.8',
      reviewsCount: 1120,
      material: 'Heavy Corduroy with Faux Shearling',
    },
    {
      id: 'myntra-shoes-1',
      brand: 'Myntra',
      title: 'HRX Chunky Suede Street Low-Top Skate Sneakers',
      category: 'Shoes',
      price: '₹2,199',
      originalPrice: '₹3,999',
      discount: '45% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.myntra.com/casual-shoes?f=Brand%3AHRX%20by%20Hrithik%20Roshan',
      tags: ['Cushion Foam', 'Gum Sole', 'High Grip'],
      inStock: true,
      rating: '4.6',
      reviewsCount: 4890,
      material: 'Suede & Leatherette',
    },
    {
      id: 'myntra-acc-1',
      brand: 'Myntra',
      title: 'Wildcraft Water-Repellent Compact Sling Pouch',
      category: 'Accessories',
      price: '₹849',
      originalPrice: '₹1,299',
      discount: '35% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.myntra.com/sling-bag',
      tags: ['Waterproof', 'YKK Zippers'],
      inStock: true,
      rating: '4.7',
      reviewsCount: 1650,
    },

    // ════════════════════════════════════════════════════════════════
    // 4. ASOS (London Street Style & Cult Y2K Drops)
    // ════════════════════════════════════════════════════════════════
    {
      id: 'asos-top-1',
      brand: 'ASOS',
      title: 'COLLUSION Unisex Heavyweight Boxy Distressed Tee',
      category: 'Top',
      price: '₹2,190',
      imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.asos.com/search/?q=collusion+t-shirt',
      tags: ['Exclusive', 'Y2K Wash', 'Raw Hem'],
      inStock: true,
      rating: '4.9',
      reviewsCount: 780,
      material: 'Organic Vintage Heavy Cotton',
      fit: 'Extreme Boxy',
    },
    {
      id: 'asos-bottom-1',
      brand: 'ASOS',
      title: 'COLLUSION Unisex Baggy 90s Acid Wash Denim Skate Jeans',
      category: 'Bottom',
      price: '₹2,990',
      imageUrl: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.asos.com/search/?q=collusion+baggy+jeans',
      tags: ['Trending', 'Acid Blue', 'Skater Vibe'],
      inStock: true,
      rating: '4.8',
      reviewsCount: 940,
      material: '100% Rigid Heavy Cotton',
      fit: 'Super Baggy',
    },
    {
      id: 'asos-outer-1',
      brand: 'ASOS',
      title: 'ASOS DESIGN Extreme Boxy Flight Bomber Jacket',
      category: 'Outerwear',
      price: '₹4,490',
      originalPrice: '₹5,990',
      discount: '25% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.asos.com/search/?q=bomber+jacket',
      tags: ['Runway Drop', 'Orange Lining', 'Water Resistant'],
      inStock: true,
      rating: '4.9',
      reviewsCount: 512,
      material: 'High-Density Satin Nylon',
      fit: 'Oversized Cropped Boxy',
    },
    {
      id: 'asos-shoes-1',
      brand: 'ASOS',
      title: 'ASOS DESIGN Chunky Contrast-Stitch Lug Derby Shoes',
      category: 'Shoes',
      price: '₹4,290',
      imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.asos.com/search/?q=chunky+derby+shoes',
      tags: ['Statement Sole', 'Clean Welt'],
      inStock: true,
      rating: '4.7',
      reviewsCount: 380,
    },
    {
      id: 'asos-acc-1',
      brand: 'ASOS',
      title: 'ASOS DESIGN Chunky Solid Cuban Link Chain',
      category: 'Accessories',
      price: '₹1,290',
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.asos.com/search/?q=cuban+chain+necklace',
      tags: ['Water Safe', 'Silver Finish'],
      inStock: true,
      rating: '4.8',
      reviewsCount: 610,
    },

    // ════════════════════════════════════════════════════════════════
    // 5. UNIQLO (Japanese LifeWear & Clean Precision)
    // ════════════════════════════════════════════════════════════════
    {
      id: 'uniqlo-top-1',
      brand: 'Uniqlo',
      title: 'AIRism Cotton Oversized Crew Neck Half-Sleeve T-Shirt',
      category: 'Top',
      price: '₹1,490',
      imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.uniqlo.com/in/en/search/?q=airism+oversized+t-shirt',
      tags: ['Viral Favorite', 'Quick Dry', 'Smooth Drape'],
      inStock: true,
      rating: '5.0',
      reviewsCount: 8430,
      material: 'AIRism Performance Cotton',
      fit: 'Structured Boxy Drop Shoulder',
    },
    {
      id: 'uniqlo-bottom-1',
      brand: 'Uniqlo',
      title: 'Pleated Wide-Leg Ankle Length Relaxed Pants',
      category: 'Bottom',
      price: '₹3,990',
      imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.uniqlo.com/in/en/search/?q=pleated+wide+pants',
      tags: ['Effortless Flow', 'Wrinkle Resistant'],
      inStock: true,
      rating: '4.9',
      reviewsCount: 2190,
      material: '2-Way Stretch Drape Twill',
      fit: 'Relaxed Wide Leg',
    },
    {
      id: 'uniqlo-outer-1',
      brand: 'Uniqlo',
      title: 'Ultra Light Down Seamless Compact Jacket',
      category: 'Outerwear',
      price: '₹4,990',
      imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.uniqlo.com/in/en/search/?q=ultra+light+down',
      tags: ['Packable Pouch', '750+ Fill Power'],
      inStock: true,
      rating: '4.9',
      reviewsCount: 5640,
      material: 'Premium Japanese Down',
      fit: 'Regular Layering Fit',
    },
    {
      id: 'uniqlo-shoes-1',
      brand: 'Uniqlo',
      title: 'Heritage Minimalist Low-Top Vulcanized Sneakers',
      category: 'Shoes',
      price: '₹2,490',
      imageUrl: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.uniqlo.com/in/en/search/?q=canvas+sneakers',
      tags: ['Antibacterial Insole', 'Clean White'],
      inStock: true,
      rating: '4.7',
      reviewsCount: 890,
    },
    {
      id: 'uniqlo-acc-1',
      brand: 'Uniqlo',
      title: 'Viral Round Mini Dumpling Shoulder Crossbody Bag',
      category: 'Accessories',
      price: '₹1,290',
      imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.uniqlo.com/in/en/search/?q=round+mini+shoulder+bag',
      tags: ['Global Viral Hit', 'Deceptively Roomy'],
      inStock: true,
      rating: '5.0',
      reviewsCount: 14200,
    },

    // ════════════════════════════════════════════════════════════════
    // 6. SNITCH (Korean Aesthetic, Fast Drops & Gen-Z Hits)
    // ════════════════════════════════════════════════════════════════
    {
      id: 'snitch-top-1',
      brand: 'Snitch',
      title: 'Oversized Cuban Collar Slub Textured Shirt',
      category: 'Top',
      price: '₹1,299',
      originalPrice: '₹1,899',
      discount: '31% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.snitch.co.in/collections/shirts',
      tags: ['Korean Fit', 'Slub Texture', 'Summer Drop'],
      inStock: true,
      rating: '4.8',
      reviewsCount: 1780,
      material: '100% Breathable Slub Cotton',
      fit: 'Relaxed Korean Cut',
    },
    {
      id: 'snitch-bottom-1',
      brand: 'Snitch',
      title: 'Korean Fit Double-Pleated Draped Formal Trousers',
      category: 'Bottom',
      price: '₹1,799',
      originalPrice: '₹2,599',
      discount: '30% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.snitch.co.in/collections/trousers',
      tags: ['Viral Cut', 'Fluid Silhouette'],
      inStock: true,
      rating: '4.9',
      reviewsCount: 2310,
      material: 'Premium Poly-Viscose Blend',
      fit: 'Korean Wide Leg',
    },
    {
      id: 'snitch-outer-1',
      brand: 'Snitch',
      title: 'Suede Finish Moto Biker Zip Jacket in Tan',
      category: 'Outerwear',
      price: '₹3,499',
      originalPrice: '₹4,999',
      discount: '30% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.snitch.co.in/collections/jackets',
      tags: ['Statement Piece', 'Velvet Suede Touch'],
      inStock: true,
      rating: '4.8',
      reviewsCount: 890,
      material: 'Ultra Soft Faux Suede',
    },
    {
      id: 'snitch-shoes-1',
      brand: 'Snitch',
      title: 'Retro Court Platform Low Skate Trainers',
      category: 'Shoes',
      price: '₹2,299',
      originalPrice: '₹3,499',
      discount: '34% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.snitch.co.in/collections/shoes',
      tags: ['Elevated Sole', 'Two-Tone'],
      inStock: true,
      rating: '4.6',
      reviewsCount: 670,
    },
    {
      id: 'snitch-acc-1',
      brand: 'Snitch',
      title: 'Layered Stainless Steel Dual Cuban Chain',
      category: 'Accessories',
      price: '₹699',
      originalPrice: '₹1,299',
      discount: '46% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=700&q=80',
      storeUrl: 'https://www.snitch.co.in/collections/accessories',
      tags: ['Tarnish Free', 'Hypoallergenic'],
      inStock: true,
      rating: '4.7',
      reviewsCount: 1450,
    },
  ]
}

export function getFilteredStoreProducts(options?: {
  brand?: StoreBrand | 'All'
  category?: ProductCategory
  search?: string
}): StoreProduct[] {
  let list = getAllStoreProducts()

  if (options?.brand && options.brand !== 'All') {
    list = list.filter((p) => p.brand === options.brand)
  }

  if (options?.category && options.category !== 'All') {
    list = list.filter((p) => p.category === options.category)
  }

  if (options?.search && options.search.trim()) {
    const q = options.search.toLowerCase()
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    )
  }

  return list
}

export function getStoreProductsForAesthetic(
  aesthetic: string,
  topPiece?: string,
  bottomPiece?: string
): Record<StoreBrand, StoreProduct[]> {
  const all = getAllStoreProducts()

  const result: Record<StoreBrand, StoreProduct[]> = {
    Zara: [],
    'H&M': [],
    Myntra: [],
    ASOS: [],
    Uniqlo: [],
    Snitch: [],
  }

  all.forEach((item) => {
    result[item.brand].push(item)
  })

  return result
}
