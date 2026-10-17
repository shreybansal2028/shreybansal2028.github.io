import { Mood } from './types'

export interface RestaurantMenuItem {
  id: string
  name: string
  price: string
  category: 'Signature' | 'Appetizer' | 'Main' | 'Dessert' | 'Drinks'
  description: string
  isVeg: boolean
  isChefSpecial?: boolean
}

export interface RestaurantInfo {
  id: string
  name: string
  tagline: string
  dishMatched: string
  cuisine: string
  mood: Mood
  rating: string
  reviewsCount: number
  priceForTwo: string
  address: string
  phone: string
  email: string
  openingHours: string
  dressCode: string
  imageUrl: string
  menu: RestaurantMenuItem[]
  availableSlots: string[]
  quickBiteAlternative: {
    title: string
    prepTime: string
    hack: string
    ingredients: string[]
  }
}

export interface TableBooking {
  bookingId: string
  restaurantId: string
  restaurantName: string
  dishMatched: string
  date: string
  time: string
  guests: number
  userName: string
  userPhone: string
  specialRequest?: string
  status: 'Confirmed' | 'Pending'
  createdAt: string
}

export const MOOD_RESTAURANTS: Record<Mood, (city?: string) => RestaurantInfo> = {
  dead: (city = 'Delhi') => ({
    id: 'rest-dead-1',
    name: 'Kofuku Ramen & Izakaya',
    tagline: 'Authentic 12-Hour Tonkotsu Broth & Melty Chashu',
    dishMatched: 'Steaming Tonkotsu Ramen with Chili Crisp & Soft Egg',
    cuisine: 'Japanese / Noodle House',
    mood: 'dead',
    rating: '4.9',
    reviewsCount: 1840,
    priceForTwo: '₹1,800 for two',
    address: `Level 2, High Street Mall, Central Avenue, ${city}`,
    phone: '+91 98712 34560',
    email: 'reservations@kofukubistro.in',
    openingHours: '12:00 PM - 11:30 PM (Daily)',
    dressCode: 'Casual / Come As You Are',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    menu: [
      {
        id: 'k-1',
        name: 'Signature Tonkotsu Black Garlic Ramen',
        price: '₹745',
        category: 'Signature',
        description: 'Rich pork bone broth slow-simmered for 12 hours, thin springy noodles, torched chashu, ajitsuke tamago & burnt garlic oil.',
        isVeg: false,
        isChefSpecial: true,
      },
      {
        id: 'k-2',
        name: 'Spicy Miso Mushroom Ramen',
        price: '₹685',
        category: 'Signature',
        description: 'Creamy fermented red miso broth with charred shiitake, bamboo shoots, bok choy, and house chili oil.',
        isVeg: true,
        isChefSpecial: true,
      },
      {
        id: 'k-3',
        name: 'Pan-Seared Pork / Edamame Gyoza (6 pcs)',
        price: '₹420',
        category: 'Appetizer',
        description: 'Crispy lacy-bottom dumplings served with spicy scallion ponzu dip.',
        isVeg: false,
      },
      {
        id: 'k-4',
        name: 'Torched Chashu Pork Bao Buns (2 pcs)',
        price: '₹480',
        category: 'Appetizer',
        description: 'Fluffy steamed lotus buns with sweet hoisin glaze, pickled cucumbers, and crushed peanuts.',
        isVeg: false,
      },
      {
        id: 'k-5',
        name: 'Matcha Fondant Cake with Roasted Black Sesame Gelato',
        price: '₹390',
        category: 'Dessert',
        description: 'Warm molten matcha cake with nutty sesame ice cream.',
        isVeg: true,
      },
    ],
    availableSlots: ['7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:15 PM', '10:00 PM'],
    quickBiteAlternative: {
      title: '4-Min Cheesy Shin Ramyun Comfort Hack',
      prepTime: '4 mins',
      hack: 'Boil Shin ramyun with 80% water. Crack an egg, immediately top with an American cheddar slice & spoon of chili oil. Cover 60 secs until velvety.',
      ingredients: ['Shin Ramyun', 'American cheese', '1 egg', 'Chili crisp'],
    },
  }),

  meh: (city = 'Delhi') => ({
    id: 'rest-meh-1',
    name: 'Smash & Co. Gourmet Diner',
    tagline: 'Lacy Crispy-Edged Patties & Parmesan Truffle Drips',
    dishMatched: 'Crispy Smashed Double Cheeseburger with Truffle Fries',
    cuisine: 'American Craft Diner',
    mood: 'meh',
    rating: '4.8',
    reviewsCount: 2150,
    priceForTwo: '₹1,400 for two',
    address: `Ground Floor, 12th Main Road, Outer Ring, ${city}`,
    phone: '+91 98101 88421',
    email: 'hello@smashandco.in',
    openingHours: '11:30 AM - 12:00 AM (Daily)',
    dressCode: 'Casual Cool',
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    menu: [
      {
        id: 's-1',
        name: 'The Oklahoma Onion Smash Burger',
        price: '₹590',
        category: 'Signature',
        description: 'Two smashed beef/lamb patties pressed paper-thin into shaved sweet onions, double American cheese & secret shack sauce on toasted brioche.',
        isVeg: false,
        isChefSpecial: true,
      },
      {
        id: 's-2',
        name: 'Truffle & Parmesan Loaded Hand-Cut Fries',
        price: '₹380',
        category: 'Appetizer',
        description: 'Crispy double-cooked russet fries tossed in white truffle oil, rosemary sea salt, and aged 24-month parmesan mountain.',
        isVeg: true,
        isChefSpecial: true,
      },
      {
        id: 's-3',
        name: 'Smoked Jalapeno Jack Crisp Burger',
        price: '₹540',
        category: 'Main',
        description: 'Crisp fried paneer/chicken patty with smoked pepper jack, house pickled jalapenos, and spicy honey chipotle mayo.',
        isVeg: false,
      },
      {
        id: 's-4',
        name: 'Buffalo Hot Honey Tenders (5 pcs)',
        price: '₹420',
        category: 'Appetizer',
        description: 'Buttermilk fried tenders glazed in fiery sweet hot honey butter with blue cheese dip.',
        isVeg: false,
      },
      {
        id: 's-5',
        name: 'Thick Malted Salted Caramel Shake',
        price: '₹320',
        category: 'Drinks',
        description: 'Churned vanilla bean custard with house burnt caramel and pretzel crumble.',
        isVeg: true,
      },
    ],
    availableSlots: ['6:30 PM', '7:15 PM', '8:00 PM', '8:45 PM', '9:30 PM', '10:15 PM'],
    quickBiteAlternative: {
      title: 'Air-Fryer Truffle Garlic Wedge Feast',
      prepTime: '7 mins',
      hack: 'Air-fry wedges at 200°C for 6 mins. Toss in a stainless bowl with melted garlic butter, pinch of truffle oil & grated parmesan.',
      ingredients: ['Frozen wedges', 'Butter', 'Garlic powder', 'Parmesan'],
    },
  }),

  okay: (city = 'Delhi') => ({
    id: 'rest-okay-1',
    name: 'Sora Poke & Artisan Bakery',
    tagline: 'Fresh Coastal Serotonin Bowls & Sourdough Deli',
    dishMatched: 'Fresh Salmon Sourdough Tartine & Shiso Lime Poke Bowl',
    cuisine: 'Modern Coastal / Cafe',
    mood: 'okay',
    rating: '4.9',
    reviewsCount: 1420,
    priceForTwo: '₹1,600 for two',
    address: `Corner Heritage Block, Park Boulevard, ${city}`,
    phone: '+91 98450 77123',
    email: 'hi@sorapoke.com',
    openingHours: '8:30 AM - 10:30 PM (Daily)',
    dressCode: 'Smart Casual',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    menu: [
      {
        id: 'so-1',
        name: 'Sashimi Salmon Shiso Lime Poke Bowl',
        price: '₹720',
        category: 'Signature',
        description: 'Norwegian salmon sashimi, seasoned warm sushi rice, ripe Hass avocado, edamame, pickled cucumber, furikake & sriracha kewpie.',
        isVeg: false,
        isChefSpecial: true,
      },
      {
        id: 'so-2',
        name: 'Whipped Ricotta & Heirloom Tomato Tartine',
        price: '₹510',
        category: 'Appetizer',
        description: 'Thick toasted artisan sourdough with lemon zest whipped ricotta, multicolored cherry tomatoes, hot chili honey & fresh microgreens.',
        isVeg: true,
        isChefSpecial: true,
      },
      {
        id: 'so-3',
        name: 'Smoked Tofu & Ponzu Crunch Bowl',
        price: '₹580',
        category: 'Main',
        description: 'Marinated crispy tofu, black sticky rice, shredded purple cabbage, spicy nori ribbons, and roasted sesame ginger glaze.',
        isVeg: true,
      },
      {
        id: 'so-4',
        name: 'Ceremonial Uji Matcha Iced Cloud Latte',
        price: '₹340',
        category: 'Drinks',
        description: 'Direct-trade Japanese matcha whisked over chilled oat milk with vanilla cold foam.',
        isVeg: true,
      },
    ],
    availableSlots: ['12:30 PM', '1:15 PM', '2:00 PM', '6:30 PM', '7:30 PM', '8:30 PM'],
    quickBiteAlternative: {
      title: '5-Min Spicy Tuna & Avocado Rice Bowl',
      prepTime: '5 mins',
      hack: 'Mix canned tuna with 1 tbsp kewpie mayo and sriracha. Spoon over warm rice with avocado cubes and crumbled toasted seaweed.',
      ingredients: ['Warm rice', 'Tuna or tofu', 'Kewpie mayo', 'Sriracha', 'Avocado'],
    },
  }),

  good: (city = 'Delhi') => ({
    id: 'rest-good-1',
    name: 'Bottega Neapolitan Pizzeria',
    tagline: 'Wood-Fired San Marzano Leopard Crust & Burrata',
    dishMatched: 'Charred Neapolitan Pizza with Burrata & Hot Honey',
    cuisine: 'Artisanal Italian',
    mood: 'good',
    rating: '4.9',
    reviewsCount: 3200,
    priceForTwo: '₹2,000 for two',
    address: `Piazzetta 14, 2nd Cross, Galleria Lane, ${city}`,
    phone: '+91 98200 65412',
    email: 'booking@bottegapizza.it',
    openingHours: '12:30 PM - 11:30 PM (Daily)',
    dressCode: 'Smart Chic',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    menu: [
      {
        id: 'b-1',
        name: 'The Burrata & Hot Honey Piccante',
        price: '₹845',
        category: 'Signature',
        description: 'San Marzano DOP tomato sauce, fresh creamy whole burrata torn in the center, fior di latte, hot Calabrian chili honey drizzle & fresh torn basil.',
        isVeg: true,
        isChefSpecial: true,
      },
      {
        id: 'b-2',
        name: 'Smoked Truffle Wild Mushroom Pizza',
        price: '₹890',
        category: 'Signature',
        description: 'White base with fontina cheese, wild porcini and portobello mushrooms, garlic thyme oil & white truffle essence.',
        isVeg: true,
        isChefSpecial: true,
      },
      {
        id: 'b-3',
        name: 'Charred Broccolini & Whipped Garlic Stracciatella',
        price: '₹480',
        category: 'Appetizer',
        description: 'Wood-oven roasted broccolini with toasted almonds and creamy cheese drizzle.',
        isVeg: true,
      },
      {
        id: 'b-4',
        name: 'Traditional 72-Hour Tiramisu Al Mascarpone',
        price: '₹440',
        category: 'Dessert',
        description: 'Savoiardi soaked in espresso and dark rum, dusted with bitter cocoa powder.',
        isVeg: true,
      },
    ],
    availableSlots: ['7:00 PM', '7:45 PM', '8:30 PM', '9:15 PM', '10:00 PM'],
    quickBiteAlternative: {
      title: 'Skillet Naan Pizza with Hot Honey',
      prepTime: '6 mins',
      hack: 'Crisp garlic naan in hot skillet with olive oil. Spread marinara, layer mozzarella, cover 3 mins until cheese bubbles. Drizzle hot honey.',
      ingredients: ['Garlic naan', 'Marinara', 'Mozzarella', 'Honey', 'Chili flakes'],
    },
  }),

  great: (city = 'Delhi') => ({
    id: 'rest-great-1',
    name: 'Dastaan Tandoor & Heritage Kitchen',
    tagline: 'Smoky Charcoal Sigri & Overnight Simmered Dal Makhani',
    dishMatched: 'Smoked Butter Garlic Naan with Dal Makhani & Tandoori Feast',
    cuisine: 'North Indian Heritage Tandoor',
    mood: 'great',
    rating: '4.9',
    reviewsCount: 4600,
    priceForTwo: '₹2,200 for two',
    address: `The Heritage Courtyard, Outer Circle, ${city}`,
    phone: '+91 98119 44321',
    email: 'table@dastaanheritage.com',
    openingHours: '12:00 PM - 3:30 PM, 7:00 PM - 12:00 AM',
    dressCode: 'Celebratory / Elegant',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    menu: [
      {
        id: 'd-1',
        name: 'Dastaan Signature Dal Makhani',
        price: '₹620',
        category: 'Signature',
        description: 'Slow-simmered over smoldering coal embers for 24 hours with vine-ripened tomatoes and freshly churned white dairy butter.',
        isVeg: true,
        isChefSpecial: true,
      },
      {
        id: 'd-2',
        name: 'Blistered Butter Garlic Naan Basket',
        price: '₹210',
        category: 'Main',
        description: 'Clay-oven baked flatbread infused with roasted garlic flakes and brushed with cultured butter.',
        isVeg: true,
      },
      {
        id: 'd-3',
        name: 'Murgh Bhatti Tikka / Paneer Tikka Angaar',
        price: '₹680',
        category: 'Signature',
        description: 'Marinated in smoked kashmiri chili, hung curd, and roasted coriander; charred on charcoal skewers.',
        isVeg: false,
        isChefSpecial: true,
      },
      {
        id: 'd-4',
        name: 'Awadhi Dum Gosht / Subz Biryani',
        price: '₹740',
        category: 'Main',
        description: 'Aged basmati rice sealed in earthenware with saffron, rose petals, and fried golden onions.',
        isVeg: false,
      },
      {
        id: 'd-5',
        name: 'Kesariya Jalebi with Rabri Mousse',
        price: '₹380',
        category: 'Dessert',
        description: 'Hot crunchy saffron coils served beside chilled cardamom rabri cream.',
        isVeg: true,
      },
    ],
    availableSlots: ['7:30 PM', '8:15 PM', '9:00 PM', '9:45 PM', '10:30 PM'],
    quickBiteAlternative: {
      title: 'Tandoori Spiced Chickpea & Chutney Toastie',
      prepTime: '6 mins',
      hack: 'Sauté canned chickpeas with garam masala in butter. Layer inside buttered sourdough with mint chutney and chopped onions.',
      ingredients: ['Chickpeas', 'Sourdough', 'Mint chutney', 'Garam masala'],
    },
  }),

  chaotic: (city = 'Delhi') => ({
    id: 'rest-chaotic-1',
    name: 'Seoul Pocha Korean Street Bar',
    tagline: 'Fiery Gochujang Glazed Wings & Molten Tteokbokki',
    dishMatched: 'Korean Loaded Gochujang Fried Chicken with Cheesy Tteokbokki',
    cuisine: 'Korean Street Food & Night Market',
    mood: 'chaotic',
    rating: '4.8',
    reviewsCount: 1980,
    priceForTwo: '₹1,500 for two',
    address: `Neon Alley 8, Cyber Hub Sector 29, ${city}`,
    phone: '+91 98991 22004',
    email: 'kpop@seoulpocha.in',
    openingHours: '1:00 PM - 1:00 AM (Daily)',
    dressCode: 'Neon / Streetwear',
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
    menu: [
      {
        id: 'sp-1',
        name: 'Gochujang Fire Glazed Crunchy Wings (8 pcs)',
        price: '₹590',
        category: 'Signature',
        description: 'Double-dredged ultra-shatter-crisp wings drenched in sweet fiery fermented chili honey glaze, topped with crushed peanuts and sesame.',
        isVeg: false,
        isChefSpecial: true,
      },
      {
        id: 'sp-2',
        name: 'Cheesy Molten Mozzarella Tteokbokki',
        price: '₹520',
        category: 'Signature',
        description: 'Chewy Korean cylinder rice cakes and fishcakes simmered in spicy gochujang broth, smothered under a blanket of torched mozzarella.',
        isVeg: true,
        isChefSpecial: true,
      },
      {
        id: 'sp-3',
        name: 'Crispy Kimchi Seafood / Scallion Pancake',
        price: '₹440',
        category: 'Appetizer',
        description: 'Sizzling pan-fried crunchy savory pancake with aged fermented kimchi and chili soy dip.',
        isVeg: true,
      },
      {
        id: 'sp-4',
        name: 'Kimchi Fried Rice with Sunny Soft Egg',
        price: '₹460',
        category: 'Main',
        description: 'Wok-charred rice with diced spam or tofu, aged kimchi, roasted nori, and molten yolk.',
        isVeg: false,
      },
      {
        id: 'sp-5',
        name: 'Bingsu Shaved Ice with Sweet Mango & Condensed Milk',
        price: '₹360',
        category: 'Dessert',
        description: 'Snow-fluffy milk shaved ice with fresh Alphonso mango cubes and sweet cream drizzle.',
        isVeg: true,
      },
    ],
    availableSlots: ['7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM', '11:45 PM'],
    quickBiteAlternative: {
      title: 'Sticky Honey Gochujang Crispy Bites',
      prepTime: '5 mins',
      hack: 'Whisk 1 tbsp honey with 1 tbsp sriracha/gochujang in warm skillet. Toss hot fried nuggets or paneer until glazed and glossy.',
      ingredients: ['Nuggets or paneer', 'Honey', 'Gochujang or sriracha', 'Sesame'],
    },
  }),
}
