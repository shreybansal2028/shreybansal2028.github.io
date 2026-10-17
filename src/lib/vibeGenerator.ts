import { DailyVibe, Mood, WatchItem, OutfitLook, FoodOption } from './types'

// Curated movie database with verified titles, platforms, high-vibe posters and ratings
export const CURATED_WATCH_BY_MOOD: Record<Mood, WatchItem[]> = {
  dead: [
    {
      title: 'Derry Girls',
      year: '2018-2022',
      type: 'Series',
      genre: 'Binge Comedy',
      rating: '8.5/10',
      platform: 'Netflix',
      why_it_vibes: 'Zero cognitive load. Pure laugh-until-you-choke high school chaos in 90s Northern Ireland.',
      stream_url: 'https://www.netflix.com/search?q=Derry+Girls',
      poster_url: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Spirited Away',
      year: '2001',
      type: 'Movie',
      genre: 'Studio Ghibli Comfort',
      rating: '8.6/10',
      platform: 'Netflix',
      why_it_vibes: 'Hypnotic hand-drawn visuals, comforting bathhouse soundscapes, heals dead energy.',
      stream_url: 'https://www.netflix.com/search?q=Spirited+Away',
      poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Severance',
      year: '2022-',
      type: 'Series',
      genre: 'Mind-Bending Thriller',
      rating: '8.7/10',
      platform: 'Apple TV+',
      why_it_vibes: 'When your brain feels disconnected from reality anyway, lean all the way in.',
      stream_url: 'https://tv.apple.com/us/show/severance',
      poster_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    },
  ],
  meh: [
    {
      title: 'The Bear',
      year: '2022-',
      type: 'Series',
      genre: 'High-Octane Drama',
      rating: '8.6/10',
      platform: 'Disney+/Hotstar',
      why_it_vibes: 'Pumps sheer dopamine and adrenaline straight through your apathy.',
      stream_url: 'https://www.hotstar.com/in/shows/the-bear',
      poster_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Grand Budapest Hotel',
      year: '2014',
      type: 'Movie',
      genre: 'Wes Anderson Aesthetic',
      rating: '8.1/10',
      platform: 'Disney+/Hotstar',
      why_it_vibes: 'Pastel symmetries and dry wit to color in a grey autopilot day.',
      stream_url: 'https://www.hotstar.com/in/movies/the-grand-budapest-hotel',
      poster_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Midnight Diner: Tokyo Stories',
      year: '2016-',
      type: 'Series',
      genre: 'Cozy Solitary Food',
      rating: '8.4/10',
      platform: 'Netflix',
      why_it_vibes: 'Late-night ramen, quiet jazz, and strangers connecting under Tokyo neon.',
      stream_url: 'https://www.netflix.com/search?q=Midnight+Diner',
      poster_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    },
  ],
  okay: [
    {
      title: 'Everything Everywhere All at Once',
      year: '2022',
      type: 'Movie',
      genre: 'Multiverse Absurdism',
      rating: '8.8/10',
      platform: 'Prime Video',
      why_it_vibes: 'Wild philosophical ride that leaves you weirdly grateful to simply exist.',
      stream_url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Everything+Everywhere+All+at+Once',
      poster_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Normal People',
      year: '2020',
      type: 'Series',
      genre: 'Intimate Indie Romance',
      rating: '8.4/10',
      platform: 'Prime Video',
      why_it_vibes: 'Melancholic Dublin skies, soft acoustic tracks, poetic intimacy.',
      stream_url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Normal+People',
      poster_url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Arcane',
      year: '2021-2024',
      type: 'Anime',
      genre: 'Steampunk Cyberpunk',
      rating: '9.0/10',
      platform: 'Netflix',
      why_it_vibes: 'Masterpiece animation and visceral needle drops to elevate a steady day.',
      stream_url: 'https://www.netflix.com/search?q=Arcane',
      poster_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    },
  ],
  good: [
    {
      title: 'Knives Out / Glass Onion',
      year: '2019-2022',
      type: 'Movie',
      genre: 'Whodunit Mystery',
      rating: '7.9/10',
      platform: 'Netflix',
      why_it_vibes: 'Smart, snappy dialogue, electric mansions, Benoit Blanc solving chaos.',
      stream_url: 'https://www.netflix.com/search?q=Glass+Onion',
      poster_url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Challengers',
      year: '2024',
      type: 'Movie',
      genre: 'Electro-Synth Tennis Thriller',
      rating: '7.6/10',
      platform: 'Prime Video',
      why_it_vibes: 'Trent Reznor techno beats, sweat-drenched tension, peak Gen-Z cinema.',
      stream_url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Challengers',
      poster_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Ted Lasso',
      year: '2020-2023',
      type: 'Series',
      genre: 'Feel-Good Energy',
      rating: '8.8/10',
      platform: 'Apple TV+',
      why_it_vibes: 'Infectious optimism, British banter, warm cup of tea for the soul.',
      stream_url: 'https://tv.apple.com/us/show/ted-lasso',
      poster_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    },
  ],
  great: [
    {
      title: 'Baby Driver',
      year: '2017',
      type: 'Movie',
      genre: 'Rhythm Action Thriller',
      rating: '7.6/10',
      platform: 'Netflix',
      why_it_vibes: 'Every gear shift, gunshot, and coffee sip synchronized to legendary tracks.',
      stream_url: 'https://www.netflix.com/search?q=Baby+Driver',
      poster_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Spider-Man: Across the Spider-Verse',
      year: '2023',
      type: 'Movie',
      genre: 'Multi-Style Visual High',
      rating: '8.7/10',
      platform: 'Netflix',
      why_it_vibes: 'Unreal soundtrack by Metro Boomin with groundbreaking art in every frame.',
      stream_url: 'https://www.netflix.com/search?q=Across+the+Spider-Verse',
      poster_url: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Succession',
      year: '2018-2023',
      type: 'Series',
      genre: 'Savage Power Satire',
      rating: '8.9/10',
      platform: 'Disney+/Hotstar',
      why_it_vibes: 'Nicholas Britell piano drops, cutthroat boardroom roasts, peak swagger.',
      stream_url: 'https://www.hotstar.com/in/shows/succession',
      poster_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    },
  ],
  chaotic: [
    {
      title: 'Euphoria',
      year: '2019-',
      type: 'Series',
      genre: 'Neon Hyper-Drama',
      rating: '8.3/10',
      platform: 'Disney+/Hotstar',
      why_it_vibes: 'Glitter tears, Labrinth synth drops, unhinged carnival chaos.',
      stream_url: 'https://www.hotstar.com/in/shows/euphoria',
      poster_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Bullet Train',
      year: '2022',
      type: 'Movie',
      genre: 'Neon Assassin Mayhem',
      rating: '7.3/10',
      platform: 'Netflix',
      why_it_vibes: 'Brad Pitt fighting eccentric assassins on a high-speed Tokyo shinkansen.',
      stream_url: 'https://www.netflix.com/search?q=Bullet+Train',
      poster_url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Bodies Bodies Bodies',
      year: '2022',
      type: 'Movie',
      genre: 'Gen-Z Paranoia Slasher',
      rating: '6.3/10',
      platform: 'Prime Video',
      why_it_vibes: 'Glowsticks, TikTok brainrot accusations, hurricane mansion disaster party.',
      stream_url: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Bodies+Bodies+Bodies',
      poster_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    },
  ],
}

export function buildOutfitDetails(mood: Mood, weatherCondition: string, weatherTemp: number): OutfitLook {
  const isCold = weatherTemp < 20
  const isRain = weatherCondition.toLowerCase().includes('rain') || weatherCondition.toLowerCase().includes('drizzle')

  switch (mood) {
    case 'dead':
      return {
        title: 'Slouchy Ghost Core',
        aesthetic: 'Ultra-Comfort Minimal Sleepwalker',
        top: isCold ? 'Washed charcoal heavyweight oversized hoodie' : 'Boxy faded heavyweight cotton tee',
        bottom: 'Baggy grey fleece sweatpants with cinched cuffs',
        shoes: 'Muted chunky mule slides or Boston clogs',
        accessories: 'Wireless over-ear noise-cancelling headphones',
        zara_search: 'https://www.zara.com/in/en/search?searchTerm=oversized+heavyweight+hoodie',
        hm_search: 'https://www2.hm.com/en_in/search-results.html?q=relaxed+fit+sweatpants',
        myntra_search: 'https://www.myntra.com/oversized-hoodie',
        asos_search: 'https://www.asos.com/search/?q=oversized+lounge+hoodie',
      }
    case 'meh':
      return {
        title: 'Muted Utility Minimal',
        aesthetic: 'Understated Casual Citywear',
        top: 'Waffle-knit long sleeve in vintage olive / sand',
        bottom: 'Loose-fit double knee carpenter pants in ecru',
        shoes: 'Retro suede low-top skate sneakers (gum sole)',
        accessories: 'Canvas crossbody crescent sling bag',
        zara_search: 'https://www.zara.com/in/en/search?searchTerm=carpenter+pants',
        hm_search: 'https://www2.hm.com/en_in/search-results.html?q=waffle+knit+sweater',
        myntra_search: 'https://www.myntra.com/carpenter-trousers',
        asos_search: 'https://www.asos.com/search/?q=carpenter+pants',
      }
    case 'okay':
      return {
        title: 'Clean Campus Scandinavian',
        aesthetic: 'Effortless Coffee Run Casual',
        top: isCold ? 'Boxy quarter-zip knit in oatmeal' : 'Structured stripe relaxed poplin shirt over white ribbed tank',
        bottom: 'Wide-leg pleated dark denim or flowy chinos',
        shoes: 'White court leather sneakers or retro runners',
        accessories: 'Thin silver chain + wire-frame tortoiseshell shades',
        zara_search: 'https://www.zara.com/in/en/search?searchTerm=wide+leg+jeans',
        hm_search: 'https://www2.hm.com/en_in/search-results.html?q=relaxed+poplin+shirt',
        myntra_search: 'https://www.myntra.com/wide-leg-denim',
        asos_search: 'https://www.asos.com/search/?q=wide+leg+chinos',
      }
    case 'good':
      return {
        title: 'Neo-Vintage Streetwear',
        aesthetic: 'Main Character Soho Stroll',
        top: 'Cropped boxy bomber jacket or racing knit over baby tee',
        bottom: 'Straight-leg vintage wash distressed carpenter jeans',
        shoes: 'Chunky chunky lug-sole loafers or Samba OGs',
        accessories: 'Leather shoulder bag + mini rectangular sunglasses',
        zara_search: 'https://www.zara.com/in/en/search?searchTerm=bomber+jacket',
        hm_search: 'https://www2.hm.com/en_in/search-results.html?q=vintage+jeans',
        myntra_search: 'https://www.myntra.com/bomber-jacket',
        asos_search: 'https://www.asos.com/search/?q=cropped+bomber',
      }
    case 'great':
      return {
        title: 'Cyber Downtown Sleaze',
        aesthetic: 'Electric Power Chic',
        top: 'Fitted mock-neck knit top or asymmetric tailored blazer',
        bottom: 'Tailored puddle trousers in midnight obsidian',
        shoes: 'Square-toe western boots or futuristic technical runners',
        accessories: 'Chunky chrome statement rings + silver ear cuff',
        zara_search: 'https://www.zara.com/in/en/search?searchTerm=oversized+blazer',
        hm_search: 'https://www2.hm.com/en_in/search-results.html?q=wide+trousers',
        myntra_search: 'https://www.myntra.com/tailored-trousers',
        asos_search: 'https://www.asos.com/search/?q=tailored+blazer',
      }
    case 'chaotic':
      return {
        title: 'Rave-Brat Hyperpop Fusion',
        aesthetic: 'Unapologetic Y2K Statement',
        top: 'Graphic mesh long sleeve with acid-wash baby tee layer',
        bottom: 'Multi-pocket parachute cargo pants in cobalt or camo',
        shoes: 'Silver metallic chunky trail runners with neon laces',
        accessories: 'Tinted frameless visor glasses + star clip hairpins',
        zara_search: 'https://www.zara.com/in/en/search?searchTerm=parachute+cargo+pants',
        hm_search: 'https://www2.hm.com/en_in/search-results.html?q=cargo+trousers',
        myntra_search: 'https://www.myntra.com/parachute-cargos',
        asos_search: 'https://www.asos.com/search/?q=parachute+pants',
      }
  }
}

export function buildFoodDetails(mood: Mood, weatherTemp: number): FoodOption {
  switch (mood) {
    case 'dead':
      return {
        title: 'Steaming Tonkotsu Ramen with Chili Crisp & Soft Egg',
        cuisine: 'Japanese / Comfort Broth',
        vibe_type: 'Soul-Restoring Warmth',
        description: 'Rich, thick 12-hour broth with chewy noodles, melt-in-mouth chashu, and a scallion mountain.',
        pairing: 'Iced barley tea or cold pocari sweat',
        zomato_search: 'https://www.zomato.com/search?q=ramen',
        swiggy_search: 'https://www.swiggy.com/search?query=ramen',
        maps_search: 'https://www.google.com/maps/search/?api=1&query=ramen+japanese+restaurants+near+me',
        quick_recipe: 'Instant Shin Ramyun + slice of American cheddar + poached egg + spoon of chili oil in 4 mins.',
      }
    case 'meh':
      return {
        title: 'Crispy Smashed Double Cheeseburger & Truffle Fries',
        cuisine: 'American Diner Comfort',
        vibe_type: 'Instant Dopamine Hit',
        description: 'Lacy crispy-edged beef patties on butter-toasted brioche with melted sharp cheddar and secret burger sauce.',
        pairing: 'Cold craft soda or vanilla malt shake',
        zomato_search: 'https://www.zomato.com/search?q=smash+burger',
        swiggy_search: 'https://www.swiggy.com/search?query=smash+burger',
        maps_search: 'https://www.google.com/maps/search/?api=1&query=best+burgers+near+me',
        quick_recipe: 'Air-fry frozen fries with parmesan & garlic salt, stack cheese toastie with sweet relish.',
      }
    case 'okay':
      return {
        title: 'Fresh Salmon Sourdough Tartine & Shiso Lime Poke Bowl',
        cuisine: 'Modern Cafe / Hawaiian Coastal',
        vibe_type: 'Clean Serotonin Fuel',
        description: 'Sashimi-grade salmon over sticky sushi rice, edamame, ripe avocado chunks, pickled cucumber, and sriracha kewpie drizzle.',
        pairing: 'Matcha iced latte or sparkling yuzu lemonade',
        zomato_search: 'https://www.zomato.com/search?q=poke+bowl',
        swiggy_search: 'https://www.swiggy.com/search?query=poke+bowl',
        maps_search: 'https://www.google.com/maps/search/?api=1&query=poke+bowls+healthy+cafes+near+me',
        quick_recipe: 'Canned tuna + Kewpie mayo + sriracha + sesame oil over warm microwave rice and avocado.',
      }
    case 'good':
      return {
        title: 'Charred Neapolitan Pizza with Burrata & Hot Honey',
        cuisine: 'Artisanal Italian',
        vibe_type: 'Aesthetic Friday Feast',
        description: 'Wood-fired leopard-crust dough topped with San Marzano tomatoes, torn fresh creamy burrata, basil, and a generous hot honey drizzle.',
        pairing: 'San Pellegrino Aranciata or crisp kombucha',
        zomato_search: 'https://www.zomato.com/search?q=wood+fired+pizza',
        swiggy_search: 'https://www.swiggy.com/search?query=neapolitan+pizza',
        maps_search: 'https://www.google.com/maps/search/?api=1&query=neapolitan+wood+fired+pizza+near+me',
        quick_recipe: 'Naan bread base in hot cast iron skillet with pesto, mozzarella, cherry tomatoes, finished under broiler.',
      }
    case 'great':
      return {
        title: 'Smoked Butter Garlic Naan with Dal Makhani & Tandoori Feast',
        cuisine: 'Rich North Indian Tandoor',
        vibe_type: 'Royal Celebration Energy',
        description: 'Velvety black lentils slow-cooked overnight with churned white butter, paired with blistered garlic naan and smoky tandoori chaap.',
        pairing: 'Thick mango lassi or spiced jeera soda',
        zomato_search: 'https://www.zomato.com/search?q=dal+makhani+butter+naan',
        swiggy_search: 'https://www.swiggy.com/search?query=tandoori+north+indian',
        maps_search: 'https://www.google.com/maps/search/?api=1&query=best+north+indian+punjabi+restaurants+near+me',
        quick_recipe: 'Toasted pita stuffed with spiced chickpeas, tahini, cucumber crunch, and hot pickled onions.',
      }
    case 'chaotic':
      return {
        title: 'Korean Loaded Gochujang Fried Chicken with Cheesy Tteokbokki',
        cuisine: 'Seoul Street Food Mania',
        vibe_type: 'Midnight Adrenaline Munchies',
        description: 'Double-fried ultra-crunchy wings drenched in sweet sticky fiery red pepper glaze, served beside molten mozzarella rice cakes.',
        pairing: 'Ice-cold lemon Sprite or Korean banana milk',
        zomato_search: 'https://www.zomato.com/search?q=korean+fried+chicken',
        swiggy_search: 'https://www.swiggy.com/search?query=korean+fried+chicken',
        maps_search: 'https://www.google.com/maps/search/?api=1&query=korean+fried+chicken+tteokbokki+near+me',
        quick_recipe: 'Frozen nuggets tossed in skillet with honey, gochujang/sriracha, soy sauce and garlic; top with cheese.',
      }
  }
}

export function generateVibeResult(
  mood: Mood,
  weatherCondition: string = 'Sunny',
  weatherTemp: number = 24,
  guestId?: string
): DailyVibe {
  const watchList = CURATED_WATCH_BY_MOOD[mood] || CURATED_WATCH_BY_MOOD.okay
  const outfit = buildOutfitDetails(mood, weatherCondition, weatherTemp)
  const food = buildFoodDetails(mood, weatherTemp)

  return {
    id: guestId || `vibe_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    date: new Date().toISOString().split('T')[0],
    mood,
    weather_condition: weatherCondition,
    weather_temp: weatherTemp,
    outfit_pick: `${outfit.title} — ${outfit.top} with ${outfit.bottom}`,
    meal_pick: food.title,
    watch_pick: `${watchList[0].title} (${watchList[0].year}) on ${watchList[0].platform}`,
    watch_details: watchList,
    outfit_details: outfit,
    meal_details: food,
    is_guest: true,
    created_at: new Date().toISOString(),
  }
}
