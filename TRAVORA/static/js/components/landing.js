import { store } from '../store.js';
import { openPlacePicker, getPlacePhoto } from './places_autocomplete.js';
import { openCalendarPicker } from './calendar_picker.js';
import { renderCustomDropdown } from './custom_dropdown.js';
import { POPULAR_INDIAN_DESTINATIONS, INDIA_AIRPORTS, INDIA_TRAIN_STATIONS, INDIA_BUS_STATIONS } from './india_places_data.js';

// DYNAMIC FLIGHT GENERATOR FOR ANY INDIAN DOMESTIC ROUTE
export function buildRouteFlights(fromCity, toCity, fromCode, toCode, cabinClass = 'Economy', depDate = null, totalTravellers = 1) {
  const cleanFrom = (fromCity || 'New Delhi').split('(')[0].split('-')[0].trim();
  const cleanTo = (toCity || 'Mumbai').split('(')[0].split('-')[0].trim();

  // Domestic route duration estimates
  const shortRoutes = ["DEL-JAI", "DEL-AGR", "DEL-ATQ", "DEL-DED", "DEL-IXC", "BOM-GOI", "BOM-PNQ", "BOM-STV", "BLR-COK", "BLR-MAA", "BLR-GOI", "MAA-CJB"];
  const longRoutes = ["DEL-GOI", "DEL-BLR", "DEL-COK", "DEL-CCU", "DEL-TRV", "BOM-CCU", "BOM-GAU", "DEL-IXZ", "BOM-IXZ", "DEL-SXR", "DEL-IXL"];
  
  const pair1 = `${fromCode}-${toCode}`;
  const pair2 = `${toCode}-${fromCode}`;

  let durationMinutes = 130;
  let durationStr = "2h 10m";
  let baseFare = 3590;

  if (shortRoutes.includes(pair1) || shortRoutes.includes(pair2)) {
    durationMinutes = 75;
    durationStr = "1h 15m";
    baseFare = 2890;
  } else if (longRoutes.includes(pair1) || longRoutes.includes(pair2)) {
    durationMinutes = 165;
    durationStr = "2h 45m";
    baseFare = 4450;
  }

  if (depDate) {
    const dt = new Date(depDate + 'T00:00:00');
    if (!isNaN(dt.getTime())) {
      const dayOffset = Math.floor(dt.getTime() / 86400000);
      const dayVariance = ((dayOffset * 137) % 25 - 12) / 100;
      baseFare = Math.round(baseFare * (1 + dayVariance));
    }
  }

  let classMultiplier = 1.0;
  if (cabinClass === 'Premium') classMultiplier = 1.45;
  if (cabinClass === 'Business') classMultiplier = 2.40;

  function calcArr(depStr, mins) {
    const [h, m] = depStr.split(':').map(Number);
    const total = h * 60 + m + mins;
    const nh = Math.floor(total / 60) % 24;
    const nm = total % 60;
    const nextDay = total >= 1440 ? ' +1' : '';
    return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}${nextDay}`;
  }

  const hashSeed = Math.abs((fromCode + toCode).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));

  return [
    {
      id: `fl-${fromCode}-${toCode}-1`,
      airline: 'IndiGo',
      code: `6E-${2000 + (hashSeed % 790)}`,
      airlineLogo: '6E',
      color: 'bg-indigo-600',
      depTime: '06:15',
      arrTime: calcArr('06:15', durationMinutes),
      duration: durationStr,
      stops: 'Non-stop',
      fromCode: fromCode,
      fromCity: cleanFrom,
      toCode: toCode,
      toCity: cleanTo,
      price: Math.round(baseFare * classMultiplier),
      originalPrice: Math.round(baseFare * classMultiplier * 1.25),
      discount: 'Save ₹850',
      badge: 'Cheapest Direct Flight',
      badgeColor: 'bg-emerald-500 text-white',
      baggage: 'Cabin: 7kg | Check-in: 15kg',
      refundable: 'Partially Refundable',
      terminal: `${cleanFrom} Domestic Terminal T1`,
      aircraft: 'Airbus A321neo Sharklets',
      seatPitch: '30-inch standard legroom',
      amenities: ['USB Power Sockets', '6E Tiffin In-flight Menu', 'DGCA On-Time Record 94%']
    },
    {
      id: `fl-${fromCode}-${toCode}-2`,
      airline: 'Air India',
      code: `AI-${800 + (hashSeed % 180)}`,
      airlineLogo: 'AI',
      color: 'bg-red-700',
      depTime: '08:45',
      arrTime: calcArr('08:45', durationMinutes),
      duration: durationStr,
      stops: 'Non-stop',
      fromCode: fromCode,
      fromCity: cleanFrom,
      toCode: toCode,
      toCity: cleanTo,
      price: Math.round((baseFare + 450) * classMultiplier),
      originalPrice: Math.round((baseFare + 450) * classMultiplier * 1.22),
      discount: 'Save ₹750',
      badge: 'Free Hot Meal & 25kg Baggage',
      badgeColor: 'bg-amber-600 text-white',
      baggage: 'Cabin: 7kg | Check-in: 25kg (Generous)',
      refundable: 'Refundable',
      terminal: `${cleanFrom} Terminal T3`,
      aircraft: 'Airbus A350-900 / A320neo',
      seatPitch: '31-inch extra comfort legroom',
      amenities: ['Complimentary Hot Multi-Course Meal', '25kg Included Baggage', 'Maharaja Lounges Access Available']
    },
    {
      id: `fl-${fromCode}-${toCode}-3`,
      airline: 'Vistara',
      code: `UK-${900 + (hashSeed % 95)}`,
      airlineLogo: 'UK',
      color: 'bg-purple-900',
      depTime: '11:20',
      arrTime: calcArr('11:20', durationMinutes),
      duration: durationStr,
      stops: 'Non-stop',
      fromCode: fromCode,
      fromCity: cleanFrom,
      toCode: toCode,
      toCity: cleanTo,
      price: Math.round((baseFare + 850) * classMultiplier),
      originalPrice: Math.round((baseFare + 850) * classMultiplier * 1.24),
      discount: 'Save ₹980',
      badge: 'Full Service Luxury',
      badgeColor: 'bg-purple-700 text-white',
      baggage: 'Cabin: 7kg | Check-in: 15kg',
      refundable: 'Refundable',
      terminal: `${cleanFrom} Terminal T3`,
      aircraft: 'Airbus A321neo (3-Class Luxury)',
      seatPitch: '31-inch luxury leather seats',
      amenities: ['Gourmet Dining by Chef', 'Wireless IFE to Personal Device', 'Star Alliance Mileage Accrual']
    },
    {
      id: `fl-${fromCode}-${toCode}-4`,
      airline: 'Akasa Air',
      code: `QP-${1300 + (hashSeed % 140)}`,
      airlineLogo: 'QP',
      color: 'bg-orange-600',
      depTime: '15:10',
      arrTime: calcArr('15:10', durationMinutes),
      duration: durationStr,
      stops: 'Non-stop',
      fromCode: fromCode,
      fromCity: cleanFrom,
      toCode: toCode,
      toCity: cleanTo,
      price: Math.round((baseFare + 200) * classMultiplier),
      originalPrice: Math.round((baseFare + 200) * classMultiplier * 1.20),
      discount: 'Save ₹640',
      badge: 'New Boeing 737 MAX',
      badgeColor: 'bg-blue-600 text-white',
      baggage: 'Cabin: 7kg | Check-in: 15kg',
      refundable: 'Free Reschedule with Prime',
      terminal: `${cleanFrom} Terminal T2`,
      aircraft: 'Boeing 737 MAX 8 Eco-Tech',
      seatPitch: '30-inch quiet cabin ergonomics',
      amenities: ['Individual USB Fast Charging', 'Cafe Akasa Freshly Prepared Delights', 'Eco-Friendly Low Noise Flight']
    },
    {
      id: `fl-${fromCode}-${toCode}-5`,
      airline: 'SpiceJet',
      code: `SG-${8100 + (hashSeed % 190)}`,
      airlineLogo: 'SG',
      color: 'bg-red-500',
      depTime: '18:40',
      arrTime: calcArr('18:40', durationMinutes),
      duration: durationStr,
      stops: 'Non-stop',
      fromCode: fromCode,
      fromCity: cleanFrom,
      toCode: toCode,
      toCity: cleanTo,
      price: Math.round((baseFare - 250) * classMultiplier),
      originalPrice: Math.round((baseFare - 250) * classMultiplier * 1.25),
      discount: 'Save ₹750',
      badge: 'Evening Super Saver',
      badgeColor: 'bg-slate-800 text-white',
      baggage: 'Cabin: 7kg | Check-in: 15kg',
      refundable: 'Partially Refundable',
      terminal: `${cleanFrom} Domestic Terminal T1C`,
      aircraft: 'Boeing 737-800',
      seatPitch: '30-inch standard seats',
      amenities: ['SpiceMax Priority Boarding Available', 'Standard Hand Baggage', 'Web Check-in Free']
    },
    {
      id: `fl-${fromCode}-${toCode}-6`,
      airline: 'Air India Express',
      code: `IX-${1400 + (hashSeed % 160)}`,
      airlineLogo: 'IX',
      color: 'bg-teal-700',
      depTime: '21:30',
      arrTime: calcArr('21:30', durationMinutes),
      duration: durationStr,
      stops: 'Non-stop',
      fromCode: fromCode,
      fromCity: cleanFrom,
      toCode: toCode,
      toCity: cleanTo,
      price: Math.round(baseFare * classMultiplier),
      originalPrice: Math.round(baseFare * classMultiplier * 1.20),
      discount: 'Save ₹650',
      badge: 'Late Night Express',
      badgeColor: 'bg-teal-700 text-white',
      baggage: 'Cabin: 7kg | Check-in: 15kg',
      refundable: 'Partially Refundable',
      terminal: `${cleanFrom} Terminal T2`,
      aircraft: 'Boeing 737 MAX 8',
      seatPitch: '30-inch mood lighting cabin',
      amenities: ['Gourmair Pre-order Hot Meals', 'Dynamic LED Mood Lighting', 'Digital Mobile Boarding']
    }
  ];
}

// DYNAMIC HOTEL GENERATOR FOR ANY INDIAN DESTINATION
export function buildDestinationHotels(targetPlace = 'Goa', checkInDate = null, nightsCount = 3, roomsGuests = '1 Room, 2 Adults') {
  const pLower = (targetPlace || '').toLowerCase();

  if (pLower.includes('andaman') || pLower.includes('havelock') || pLower.includes('port blair') || pLower.includes('ixz')) {
    return [
      {
        id: 'hot-ixz-1',
        name: 'Taj Exotica Resort & Spa, Andamans',
        location: 'Radhanagar Beachfront, Havelock Island (Swaraj Dweep)',
        rating: 4.9,
        reviewsCount: '2,140 verified reviews',
        tag: 'Luxury 5-Star Beachfront Villa',
        amenities: ['Private Beachfront Villa', 'Olympic Infinity Pool', 'Jiva Ayurvedic Spa', 'Complimentary Speedboat Transfers', 'Gourmet Seafood Pavilion'],
        roomType: 'Deluxe Sea View Villa with Private Plunge Pool',
        price: 18500,
        originalPrice: 24900,
        discount: '26% OFF',
        image: '/static/assets/destinations/andaman_havelock_beach.jpg',
        roomSize: '750 sq.ft',
        bedType: 'King Bed with Ocean View Balcony',
        cancellation: 'Free cancellation up to 48 hours before check-in'
      },
      {
        id: 'hot-ixz-2',
        name: 'Barefoot at Havelock Eco Resort',
        location: 'Beach No. 7, Rainforest Canopy, Havelock Island',
        rating: 4.8,
        reviewsCount: '1,530 verified reviews',
        tag: 'Eco-Luxury Rainforest Stays',
        amenities: ['Rainforest Wooden Cottages', 'Dolphin & Coral Snorkeling', 'Organic Farm-to-Table Breakfast', 'Certified PADI Scuba Center'],
        roomType: 'Nicobari Luxury Beach Cottage',
        price: 12800,
        originalPrice: 16500,
        discount: '22% OFF',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
        roomSize: '580 sq.ft',
        bedType: 'Canopy King Bed • Teakwood Verandah',
        cancellation: 'Free cancellation up to 72 hours before arrival'
      },
      {
        id: 'hot-ixz-3',
        name: 'SeaShell Resort & Spa Havelock',
        location: 'Beach No. 2, Govind Nagar, Havelock Island',
        rating: 4.7,
        reviewsCount: '1,280 verified reviews',
        tag: '5-Star Oceanfront Retreat',
        amenities: ['Ocean Facing Balcony', 'Lagoon Swimming Pool', 'Urban Nirvana Ayurvedic Spa', 'Scuba Diving & Kayak Desk'],
        roomType: 'Lagoon Luxury Oceanfront Suite',
        price: 9400,
        originalPrice: 12800,
        discount: '27% OFF',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        roomSize: '480 sq.ft',
        bedType: 'King Size Bed • Lagoon View',
        cancellation: 'Free cancellation with Travora Prime'
      },
      {
        id: 'hot-ixz-4',
        name: 'Welcomhotel by ITC Hotels, Bay Island',
        location: 'Marine Hill, Port Blair, Andaman',
        rating: 4.8,
        reviewsCount: '1,890 verified reviews',
        tag: 'ITC Luxury Heritage',
        amenities: ['Panoramic Bay View', 'Pristine Seawater Pool', 'Swarna Mahal Fine Dining', 'Free Airport Luxury Chauffeur'],
        roomType: 'Executive Bay View Deluxe Room',
        price: 11200,
        originalPrice: 15000,
        discount: '25% OFF',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        roomSize: '520 sq.ft',
        bedType: 'King Bed with Harbor View',
        cancellation: 'Free cancellation up to 24h prior'
      },
      {
        id: 'hot-ixz-5',
        name: 'Symphony Summer Sands Beach Resort',
        location: 'Neil Island & Havelock Coastal Belt',
        rating: 4.6,
        reviewsCount: '980 verified reviews',
        tag: 'Beachfront Leisure Resort',
        amenities: ['Lagoon Swimming Pool', 'Beach Candlelight Dinners', 'Free Coral Reef Tour', 'Complimentary Buffet Breakfast'],
        roomType: 'Aqua Luxury Private Villa',
        price: 7650,
        originalPrice: 10500,
        discount: '27% OFF',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        roomSize: '450 sq.ft',
        bedType: 'Queen Deluxe Bed',
        cancellation: 'Free cancellation'
      }
    ];
  } else if (pLower.includes('jaipur')) {
    return [
      {
        id: 'hot-jai-1',
        name: 'Rambagh Palace Jaipur (Taj Heritage)',
        location: 'Bhawani Singh Road, Civil Lines, Jaipur',
        rating: 4.9,
        reviewsCount: '3,450 verified reviews',
        tag: 'Royal 5-Star Heritage Palace',
        amenities: ['Former Royal Residence of Maharaja', 'Suvarna Mahal Royal Dining', 'Peacock Garden Walk', 'Jiva Grande Royal Spa', 'Vintage Car Airport Transfers'],
        roomType: 'Historical Palace Suite with Royal Courtyard View',
        price: 24500,
        originalPrice: 32000,
        discount: '23% OFF',
        image: '/static/assets/destinations/jaipur_royal_palace.jpg',
        roomSize: '800 sq.ft',
        bedType: 'Four Poster Royal King Bed',
        cancellation: 'Free cancellation up to 48h prior'
      },
      {
        id: 'hot-jai-2',
        name: 'The Oberoi Rajvilas, Jaipur',
        location: 'Goner Road, Babaji Ka Mod, Jaipur',
        rating: 4.9,
        reviewsCount: '2,210 verified reviews',
        tag: 'Luxury Fort Palace & Villas',
        amenities: ['32-Acre Landscaped Oasis', 'Private Luxury Tents with AC', 'Ancient Shiva Temple inside', 'Ayurvedic Wellness Sanctuary'],
        roomType: 'Premier Room with Private Garden Verandah',
        price: 19800,
        originalPrice: 26000,
        discount: '24% OFF',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        roomSize: '650 sq.ft',
        bedType: 'Luxury Teak King Bed',
        cancellation: 'Free cancellation'
      },
      {
        id: 'hot-jai-3',
        name: 'Jai Mahal Palace (Taj Collection)',
        location: 'Jacob Road, Civil Lines, Jaipur',
        rating: 4.8,
        reviewsCount: '1,980 verified reviews',
        tag: '18th-Century Indo-Saracenic Palace',
        amenities: ['18 Acres of Mughal Gardens', 'Outdoor Marble Pool', 'Giant Chess Board Garden', 'Cinnamon Fine Dining'],
        roomType: 'Luxury Palace Garden View Room',
        price: 13500,
        originalPrice: 18000,
        discount: '25% OFF',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
        roomSize: '520 sq.ft',
        bedType: 'King Bed with Mughal Arch Decor',
        cancellation: 'Free cancellation'
      },
      {
        id: 'hot-jai-4',
        name: 'Fairmont Jaipur Luxury Resort',
        location: 'Kukas Hills, Amber Fort Corridor, Jaipur',
        rating: 4.8,
        reviewsCount: '2,640 verified reviews',
        tag: 'Aravalli Hills Palace Resort',
        amenities: ['Aravalli Mountain Views', 'Ruhab Luxury Turkish Spa', 'Zarin Indo-Persian Fine Dining', 'Falconry & Hot Air Balloon Desk'],
        roomType: 'Signature Fairmont Room with Forest View',
        price: 9800,
        originalPrice: 13500,
        discount: '27% OFF',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        roomSize: '550 sq.ft',
        bedType: 'Custom Fairmont Plush King Bed',
        cancellation: 'Free cancellation'
      },
      {
        id: 'hot-jai-5',
        name: 'ITC Rajputana Luxury Collection',
        location: 'Palace Road, Near Railway Station, Jaipur',
        rating: 4.7,
        reviewsCount: '1,820 verified reviews',
        tag: 'Luxury Collection 5-Star',
        amenities: ['Peshawri Iconic Dining', 'Kaya Kalp Spa', 'Courtyard Swimming Pool', 'Free Airport Shuttle'],
        roomType: 'Rajputana Royal Executive Chamber',
        price: 7800,
        originalPrice: 10800,
        discount: '28% OFF',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        roomSize: '480 sq.ft',
        bedType: 'Luxury Queen Bed',
        cancellation: 'Free cancellation'
      }
    ];
  } else if (pLower.includes('udaipur')) {
    return [
      {
        id: 'hot-udr-1',
        name: 'Taj Lake Palace Udaipur (Floating Wonder)',
        location: 'Pichola Island, Lake Pichola, Udaipur',
        rating: 4.9,
        reviewsCount: '3,890 verified reviews',
        tag: 'World-Renowned Lake Palace',
        amenities: ['Private Speedboat Transfer across Lake', '360° Lake Pichola Views', 'Jharokha Traditional Dining', 'Jiva Royal Spa Boat'],
        roomType: 'Palace Lake View Suite with Historic Marble Inlay',
        price: 28500,
        originalPrice: 38000,
        discount: '25% OFF',
        image: '/static/assets/destinations/udaipur_lake_palace.jpg',
        roomSize: '700 sq.ft',
        bedType: 'Grand Four Poster Royal Bed',
        cancellation: 'Free cancellation'
      },
      {
        id: 'hot-udr-2',
        name: 'The Oberoi Udaivilas Luxury Resort',
        location: 'Haridas Ji Ki Magri, Lake Pichola, Udaipur',
        rating: 4.9,
        reviewsCount: '2,940 verified reviews',
        tag: 'Ranked Top Resort in Asia',
        amenities: ['Semi-Private Swimming Pools with Lake Access', 'Mewari Cooking Masterclasses', 'Private Wildlife Conservatory', 'Kohinoor Spa'],
        roomType: 'Premier Room with Semi-Private Pool Access',
        price: 26000,
        originalPrice: 34000,
        discount: '24% OFF',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        roomSize: '620 sq.ft',
        bedType: 'King Bed • Direct Pool Verandah',
        cancellation: 'Free cancellation'
      },
      {
        id: 'hot-udr-3',
        name: 'The Leela Palace Udaipur',
        location: 'Lake Pichola Waterfront, Udaipur',
        rating: 4.8,
        reviewsCount: '2,410 verified reviews',
        tag: 'Waterfront Modern Royalty',
        amenities: ['Lake Facing Private Balconies', 'Sheesh Mahal Rooftop Dining', 'ESPA Ayurvedic Treatments', 'Heritage Folk Music Evenings'],
        roomType: 'Grand Heritage Lake View Room with Balcony',
        price: 18900,
        originalPrice: 25000,
        discount: '24% OFF',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
        roomSize: '580 sq.ft',
        bedType: 'Plush King Bed',
        cancellation: 'Free cancellation'
      },
      {
        id: 'hot-udr-4',
        name: 'Fateh Prakash Palace Heritage',
        location: 'City Palace Complex, Udaipur',
        rating: 4.8,
        reviewsCount: '1,560 verified reviews',
        tag: 'HRH Royal Collection',
        amenities: ['Located inside Historic City Palace', 'Sunset Terrace Restaurant', 'Exclusive Crystal Gallery Access', 'Lake View Pool'],
        roomType: 'Palace Premier Heritage Room',
        price: 12500,
        originalPrice: 17000,
        discount: '26% OFF',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        roomSize: '500 sq.ft',
        bedType: 'Royal Teak King Bed',
        cancellation: 'Free cancellation'
      },
      {
        id: 'hot-udr-5',
        name: 'Aurika by Lemon Tree Hotels',
        location: 'Kala Rohi, Sajjangarh Monsoon Palace Road, Udaipur',
        rating: 4.7,
        reviewsCount: '1,320 verified reviews',
        tag: 'Hilltop Luxury Resort',
        amenities: ['Hilltop Infinity Pool', 'Aravalli Mountain Panorama', 'Mirasa Fine Dining', 'Araya Spa'],
        roomType: 'Deluxe Courtyard View Room',
        price: 8400,
        originalPrice: 11500,
        discount: '27% OFF',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        roomSize: '460 sq.ft',
        bedType: 'King Bed',
        cancellation: 'Free cancellation'
      }
    ];
  } else if (pLower.includes('manali') || pLower.includes('himachal') || pLower.includes('kullu')) {
    return [
      {
        id: 'hot-mnl-1',
        name: 'The Himalayan Luxury Castle & Resort',
        location: 'Hadimba Road, Log Huts Area, Manali',
        rating: 4.9,
        reviewsCount: '1,780 verified reviews',
        tag: 'Victorian Gothic Castle & Orchard Cottages',
        amenities: ['Direct Views of Rohtang & Snow Peaks', 'Heated Outdoor Swimming Pool', 'Castleton Dining Lounge', 'Chiminey Fireplaces in Rooms'],
        roomType: 'Grand Castle Suite with Private Fireplace',
        price: 13500,
        originalPrice: 18000,
        discount: '25% OFF',
        image: '/static/assets/destinations/manali_snow_peaks.jpg',
        roomSize: '650 sq.ft',
        bedType: 'King Bed with Real Wood Fireplace',
        cancellation: 'Free cancellation'
      },
      {
        id: 'hot-mnl-2',
        name: 'Span Resort & Spa (Beas Riverfront)',
        location: 'Baragarh Estate, Kullu-Manali Highway',
        rating: 4.8,
        reviewsCount: '2,120 verified reviews',
        tag: 'Luxury Riverfront Retreat',
        amenities: ['Beas River Stone Bank Access', 'Span L\'occitane Heli-Skiing Spa', 'Private Riverside Trout Fishing', 'Pine Forest Helipad'],
        roomType: 'River View Cottage with Private Lawn',
        price: 11800,
        originalPrice: 15500,
        discount: '24% OFF',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        roomSize: '580 sq.ft',
        bedType: 'King Bed with Beas River Soundscape',
        cancellation: 'Free cancellation'
      },
      {
        id: 'hot-mnl-3',
        name: 'Larisa Resort Manali',
        location: 'Haripur, Naggar Road, Manali',
        rating: 4.8,
        reviewsCount: '1,430 verified reviews',
        tag: 'Apple Orchard Boutique Haven',
        amenities: ['Organic Apple Orchard Living', 'Heated Outdoor Jacuzzi Pool', 'Farm Fresh Himalayan Cuisine', 'Star Gazing Fire Pits'],
        roomType: 'Orchard Luxury Suite with Jacuzzi',
        price: 9200,
        originalPrice: 12500,
        discount: '26% OFF',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
        roomSize: '520 sq.ft',
        bedType: 'King Bed with Mountain Verandah',
        cancellation: 'Free cancellation'
      },
      {
        id: 'hot-mnl-4',
        name: 'Solang Valley Resort',
        location: 'Solang Valley Adventure Base, Manali',
        rating: 4.7,
        reviewsCount: '1,640 verified reviews',
        tag: 'Snow & Adventure Hub',
        amenities: ['Direct Ski & Paragliding Access', 'Riverside Deck Barbecue', 'Heated Bedrooms', 'Campfire & Live Music Evenings'],
        roomType: 'Glacier View Deluxe Room',
        price: 7400,
        originalPrice: 9900,
        discount: '25% OFF',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        roomSize: '450 sq.ft',
        bedType: 'King Bed with Snow Glacier Panorama',
        cancellation: 'Free cancellation'
      },
      {
        id: 'hot-mnl-5',
        name: 'Manuallaya Resort Spa in the Himalayas',
        location: 'Sunny Side, Chadiyari, Manali',
        rating: 4.6,
        reviewsCount: '1,290 verified reviews',
        tag: 'Pine Forest Wellness Resort',
        amenities: ['Indoor Heated Pool & Sauna', 'TBR Ayurvedic Massage', 'Kibber Multicuisine Bistro', 'Children Games Zone'],
        roomType: 'Superior Pine View Room',
        price: 5800,
        originalPrice: 8000,
        discount: '27% OFF',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        roomSize: '420 sq.ft',
        bedType: 'Double Queen Bed',
        cancellation: 'Free cancellation'
      }
    ];
  } else {
    // Default dynamic luxury generation for Goa or any selected city
    const cleanCity = targetPlace.split('(')[0].split(',')[0].trim() || 'Goa';
    const photo = getPlacePhoto(cleanCity, '', '/static/assets/destinations/goa_beach_sunset.jpg');
    return [
      {
        id: `hot-${cleanCity.toLowerCase().replace(/\\s+/g, '-')}-1`,
        name: `Taj Exotica Resort & Luxury Suites ${cleanCity}`,
        location: `Scenic Waterfront & Heritage Boulevard, ${cleanCity}`,
        rating: 4.9,
        reviewsCount: '2,940 verified reviews',
        tag: 'Luxury 5-Star Heritage',
        amenities: ['Private Beach & Lagoon Access', 'Infinity Pool', 'Jiva Ayurvedic Spa', 'Complimentary Gourmet Buffet Breakfast', 'Free Airport Shuttle'],
        roomType: 'Deluxe Sea View Villa with Private Plunge Pool',
        price: 14500,
        originalPrice: 19800,
        discount: '26% OFF',
        image: photo,
        roomSize: '650 sq.ft',
        bedType: 'King Size Plush Bed',
        cancellation: 'Free cancellation up to 48 hours before check-in'
      },
      {
        id: `hot-${cleanCity.toLowerCase().replace(/\\s+/g, '-')}-2`,
        name: `Grand Hyatt Luxury Waterfront ${cleanCity}`,
        location: `Bayfront Promenade, ${cleanCity}`,
        rating: 4.8,
        reviewsCount: '2,120 verified reviews',
        tag: '5-Star Resort',
        amenities: ['Bay View Suites', '24/7 Butler Service', 'Heated Indoor & Outdoor Pools', 'Free High Speed WiFi'],
        roomType: 'Club Ocean View Suite with Balcony',
        price: 11200,
        originalPrice: 15400,
        discount: '27% OFF',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        roomSize: '580 sq.ft',
        bedType: 'Grand Hyatt King Bed',
        cancellation: 'Free cancellation'
      },
      {
        id: `hot-${cleanCity.toLowerCase().replace(/\\s+/g, '-')}-3`,
        name: `ITC Grand / Fortune Select ${cleanCity}`,
        location: `Sunset Avenue, Green Valley, ${cleanCity}`,
        rating: 4.7,
        reviewsCount: '1,560 verified reviews',
        tag: 'Premium 5-Star Eco',
        amenities: ['Lagoon Pool', 'Kaya Kalp Spa', 'Multicuisine Fine Dining', 'Free Airport Shuttle'],
        roomType: 'Executive Garden View Room',
        price: 8900,
        originalPrice: 12500,
        discount: '28% OFF',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        roomSize: '500 sq.ft',
        bedType: 'King Bed with Garden View',
        cancellation: 'Free cancellation'
      },
      {
        id: `hot-${cleanCity.toLowerCase().replace(/\\s+/g, '-')}-4`,
        name: `Alila Diwa / Vivanta Heritage ${cleanCity}`,
        location: `Palm Grove Avenue, ${cleanCity}`,
        rating: 4.8,
        reviewsCount: '2,240 verified reviews',
        tag: 'Boutique Luxury Stay',
        amenities: ['Paddy Field Infinity Pool', 'Boutique Spa', 'Open Air Bistro', 'Free Sunset Yoga'],
        roomType: 'Terrace Garden Room with King Bed',
        price: 6450,
        originalPrice: 9200,
        discount: '30% OFF',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
        roomSize: '460 sq.ft',
        bedType: 'Terrace King Bed',
        cancellation: 'Free cancellation'
      },
      {
        id: `hot-${cleanCity.toLowerCase().replace(/\\s+/g, '-')}-5`,
        name: `Sterling Leisure Stays ${cleanCity}`,
        location: `Heritage Central Road, ${cleanCity}`,
        rating: 4.5,
        reviewsCount: '1,050 verified reviews',
        tag: 'Verified Value Stays',
        amenities: ['Swimming Pool', 'Kids Play Zone', 'Buffet Breakfast Included', 'Free Cancellation'],
        roomType: 'Superior Queen Room',
        price: 4200,
        originalPrice: 5800,
        discount: '27% OFF',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        roomSize: '400 sq.ft',
        bedType: 'Queen Bed',
        cancellation: 'Free cancellation'
      }
    ];
  }
}

export function renderLanding() {
  const state = store.getState();
  const activeSearchTab = window.landingSearchTab || state.landingSearchTab || 'flights';
  const flightTripType = window.landingFlightTripType || 'roundtrip';
  const specialFare = window.landingSpecialFare || 'regular';
  const isFlexibleDates = typeof window.landingFlexibleDates === 'undefined' ? true : window.landingFlexibleDates;
  const isDirectOnly = !!window.landingDirectOnly;
  const isSearchActive = !!window.landingIsSearchActive;
  const isTravellerDropdownOpen = !!window.isTravellerDropdownOpen;

  const adults = typeof window.landingAdults === 'number' ? window.landingAdults : 1;
  const children = typeof window.landingChildren === 'number' ? window.landingChildren : 0;
  const infants = typeof window.landingInfants === 'number' ? window.landingInfants : 0;
  const cabinClass = window.landingCabinClass || 'Economy';
  const totalTravellers = adults + children + infants;

  const fromCity = window.landingFromCity || 'New Delhi (DEL)';
  const toCity = window.landingToCity || 'Mumbai (BOM)';
  const fromCode = fromCity.match(/\(([A-Z0-9]{3,4})/)?.[1] || fromCity.slice(0, 3).toUpperCase();
  const toCode = toCity.match(/\(([A-Z0-9]{3,4})/)?.[1] || toCity.slice(0, 3).toUpperCase();

  const hotelCity = window.landingHotelCity || 'Goa, India';
  const packageDest = window.landingPackageDest || 'Goa Coastal & Heritage';
  const cabPickup = window.landingCabPickup || 'Mumbai City Center';
  const cabDrop = window.landingCabDrop || 'Goa (Panaji / Calangute)';
  const trainFrom = window.landingTrainFrom || 'New Delhi (NDLS)';
  const trainTo = window.landingTrainTo || 'Madgaon Goa (MAO)';
  const resultsCategory = window.landingResultsCategory || activeSearchTab;
  const targetPlace = (resultsCategory === 'hotels' ? hotelCity : resultsCategory === 'packages' ? packageDest : resultsCategory === 'buses_cabs' ? cabDrop : resultsCategory === 'trains' ? trainTo : toCity).split('(')[0].split(',')[0].trim();
  const targetPhoto = getPlacePhoto(targetPlace, '', '/static/assets/destinations/goa_beach_sunset.jpg');

  // Dates and stay window calculations
  const checkInDateObj = new Date((window.landingDepDate || '2026-10-28') + 'T00:00:00');
  let checkOutDateObj = new Date((window.landingRetDate || '2026-10-31') + 'T00:00:00');
  if (checkOutDateObj <= checkInDateObj) {
    checkOutDateObj = new Date(checkInDateObj.getTime() + 86400000 * 3);
    window.landingRetDate = checkOutDateObj.toISOString().split('T')[0];
  }
  const hotelStayNights = Math.max(1, Math.round((checkOutDateObj - checkInDateObj) / 86400000));

  const liveHotelResults = buildDestinationHotels(targetPlace, window.landingDepDate, hotelStayNights, window.landingHotelRooms || '1 Room, 2 Adults');
  const liveFlightResults = buildRouteFlights(fromCity, toCity, fromCode, toCode, cabinClass, window.landingDepDate, totalTravellers);

  const livePackageResults = [
    {
      id: 'pkg-1',
      title: `${targetPlace} Coastal Heritage & Sunset Cruise Expedition`,
      duration: '4 Days / 3 Nights',
      operator: 'Aarav Expeditions',
      operatorRating: 4.9,
      tag: 'Best Seller • All-Inclusive',
      inclusions: ['Roundtrip Flights Included', '5-Star Resort Stay (3 Nights)', 'Private AC Chauffeur Car', 'Guided Catamaran Dolphin Cruise', 'Daily Breakfast & Dinner Buffets'],
      price: 18500,
      originalPrice: 24900,
      discount: '25% OFF',
      image: targetPhoto
    },
    {
      id: 'pkg-2',
      title: `${targetPlace} Classic Explorer & Hidden Gems Trail`,
      duration: '5 Days / 4 Nights',
      operator: 'Travora Certified Operations',
      operatorRating: 4.8,
      tag: 'Top Rated Guided Tour',
      inclusions: ['4-Star Boutique Stay', 'All Monument Entry & VIP Fast-Track', 'Local Culture & Food Tasting', 'Private Airport Transfers', 'Dedicated 24/7 Tour Manager'],
      price: 21800,
      originalPrice: 28500,
      discount: '23% OFF',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
    },
    {
      id: 'pkg-3',
      title: `${targetPlace} Romance & Luxury Honeymoon Escape`,
      duration: '4 Days / 3 Nights',
      operator: 'Elite India Voyages',
      operatorRating: 5.0,
      tag: 'Couple Special',
      inclusions: ['Private Plunge Pool Villa', 'Candlelight Beachfront Dinner with Wine', 'Couples Aromatherapy Spa', 'Private Luxury Yacht Cruise', 'Complimentary Champagne Basket'],
      price: 26500,
      originalPrice: 34000,
      discount: '22% OFF',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800'
    },
    {
      id: 'pkg-4',
      title: `${targetPlace} Adventure, Water Sports & Wildlife Trek`,
      duration: '3 Days / 2 Nights',
      operator: 'Wilderness & Coastal Thrills',
      operatorRating: 4.7,
      tag: 'Adventure Seekers',
      inclusions: ['Scuba Diving with Video Recording', 'Parasailing & Jet Skiing', 'Eco-Cottage Stay', 'Safety Gear & Certified Dive Master', 'All Meals Included'],
      price: 14200,
      originalPrice: 19000,
      discount: '25% OFF',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'
    }
  ];

  const liveBusCabResults = [
    {
      id: 'cab-1',
      title: `Volvo Multi-Axle Luxury AC Sleeper (2+1)`,
      category: 'Luxury Bus',
      operator: 'Zingbus Premium Plus',
      rating: 4.8,
      depTime: '08:30 PM',
      arrTime: '06:45 AM (Next Day)',
      duration: '10h 15m',
      from: cabPickup,
      to: cabDrop,
      amenities: ['Individual USB Charging & Reading Lights', 'Fresh Sanitized Blanket & Pillow', 'Live GPS Tracking & SOS', 'Emergency Rest Stop at Top Highway Food Court'],
      price: 1450,
      originalPrice: 1950,
      seatsLeft: '8 Berths Left'
    },
    {
      id: 'cab-2',
      title: `Toyota Innova Crysta Chauffeur (6 Seater)`,
      category: 'Private Cab',
      operator: 'Travora Verified Fleet',
      rating: 4.9,
      depTime: 'Flexible (Doorstep Pickup)',
      arrTime: 'Direct Highway Drive',
      duration: '8h 30m',
      from: cabPickup,
      to: cabDrop,
      amenities: ['Top Rated Commercial Driver', 'Toll Taxes & State Permits Included', 'Chilled Mineral Water Bottles', 'Unlimited Luggage Capacity'],
      price: 5200,
      originalPrice: 6500,
      seatsLeft: 'Instant Confirmation'
    },
    {
      id: 'cab-3',
      title: `Prime Sedan (Swift Dzire / Etios AC)`,
      category: 'Private Cab',
      operator: 'Travora Express Fleet',
      rating: 4.7,
      depTime: 'On-Demand Instant',
      arrTime: 'Express Highway Route',
      duration: '8h 45m',
      from: cabPickup,
      to: cabDrop,
      amenities: ['AC Sanitized Sedan', 'Zero Surge Guarantee', 'Chauffeur Background Verified', 'Free Cancellation up to 2h before departure'],
      price: 3450,
      originalPrice: 4400,
      seatsLeft: 'Guaranteed Cab'
    },
    {
      id: 'cab-4',
      title: `IntrCity SmartBus AC Seater / Sleeper`,
      category: 'Smart Bus',
      operator: 'IntrCity SmartBus Lounge',
      rating: 4.7,
      depTime: '10:00 PM',
      arrTime: '07:30 AM',
      duration: '9h 30m',
      from: cabPickup,
      to: cabDrop,
      amenities: ['Air-Conditioned Boarding Lounge', 'In-Bus Washroom', 'Wi-Fi & Entertainment Screen', 'Safe Driver Certified'],
      price: 1650,
      originalPrice: 2200,
      seatsLeft: '5 Seats Left'
    }
  ];

  const liveTrainResults = [
    {
      id: 'trn-1',
      trainNumber: '22229',
      trainName: 'Vande Bharat Superfast Express',
      depTime: '05:25 AM',
      arrTime: '11:15 AM',
      duration: '5h 50m',
      from: trainFrom,
      to: trainTo,
      runsOn: 'All Days except Friday',
      classes: [
        { name: 'Executive Chair (EC)', price: 1790, status: 'AVAILABLE - 28 Seats' },
        { name: 'Chair Car (CC)', price: 1040, status: 'AVAILABLE - 64 Seats' }
      ]
    },
    {
      id: 'trn-2',
      trainNumber: '22414',
      trainName: 'Madgaon Rajdhani Express',
      depTime: '11:05 AM',
      arrTime: '06:30 AM (Next Day)',
      duration: '19h 25m',
      from: trainFrom,
      to: trainTo,
      runsOn: 'Mon, Wed, Fri',
      classes: [
        { name: 'AC 2 Tier (2A)', price: 2950, status: 'AVAILABLE - 16 Berths' },
        { name: 'AC 3 Tier (3A)', price: 2150, status: 'AVAILABLE - 42 Berths' }
      ]
    },
    {
      id: 'trn-3',
      trainNumber: '22119',
      trainName: 'Tejas Superfast Express',
      depTime: '06:15 AM',
      arrTime: '02:00 PM',
      duration: '7h 45m',
      from: trainFrom,
      to: trainTo,
      runsOn: 'Tue, Thu, Sat, Sun',
      classes: [
        { name: 'Executive Chair (EC)', price: 1980, status: 'AVAILABLE - 19 Seats' },
        { name: 'AC Chair Car (CC)', price: 1250, status: 'AVAILABLE - 52 Seats' }
      ]
    },
    {
      id: 'trn-4',
      trainNumber: '12284',
      trainName: 'Duronto AC Non-Stop Express',
      depTime: '09:40 PM',
      arrTime: '04:15 PM (Next Day)',
      duration: '18h 35m',
      from: trainFrom,
      to: trainTo,
      runsOn: 'Daily',
      classes: [
        { name: 'AC 2 Tier (2A)', price: 2750, status: 'AVAILABLE - 12 Berths' },
        { name: 'AC 3 Tier (3A)', price: 1950, status: 'AVAILABLE - 38 Berths' }
      ]
    }
  ];

  // Bank & Promo Coupons (Yatra Signature)
  const promoOffers = [
    {
      code: 'TRAVICICI',
      bank: 'ICICI Bank',
      title: 'ICICI Bank Credit Cards',
      discount: 'Flat 12% OFF up to ₹2,500',
      desc: 'Applicable on domestic flights & luxury hotel stays. No minimum booking value required.',
      category: 'flights',
      icon: 'credit-card',
      color: 'from-amber-600 to-orange-700'
    },
    {
      code: 'TRAVHDFC',
      bank: 'HDFC Bank',
      title: 'HDFC Super Saver',
      discount: 'Instant ₹4,000 Cashback',
      desc: 'Exclusive savings on multi-airline combinations, roundtrips, and 5-star verified stays.',
      category: 'hotels',
      icon: 'sparkles',
      color: 'from-blue-600 to-indigo-800'
    },
    {
      code: 'FIRSTFLY',
      bank: 'TRAVORA Exclusive',
      title: 'First Flight Special',
      discount: 'Flat ₹1,200 Instant Discount',
      desc: 'Valid on your first domestic booking. Includes free seat selection and complimentary meal.',
      category: 'flights',
      icon: 'plane',
      color: 'from-[#ea2330] to-[#880808]'
    },
    {
      code: 'PRIMEFLY',
      bank: 'TRAVORA Prime',
      title: 'Zero Convenience Fee',
      discount: 'Save ₹400 - ₹850 per Ticket',
      desc: 'Never pay booking fees or convenience charges again with TRAVORA Prime Membership.',
      category: 'prime',
      icon: 'crown',
      color: 'from-purple-600 to-pink-700'
    },
    {
      code: 'HACKERDEAL',
      bank: 'Combo Savings',
      title: 'Kayak Hacker Fares',
      discount: 'Save up to 35% on Split Fares',
      desc: 'Mix and match separate airlines for departure and return to unlock lowest wholesale rates.',
      category: 'flights',
      icon: 'zap',
      color: 'from-[#ea2330] to-[#5c0606]'
    },
    {
      code: 'MONSOON26',
      bank: 'Special Holiday',
      title: 'Monsoon Getaways',
      discount: 'Flat ₹2,500 OFF on Tours',
      desc: 'Valid on all 4D/3N and 5D/4N holiday packages in Goa, Kerala, and Himachal Pradesh.',
      category: 'holidays',
      icon: 'palmtree',
      color: 'from-[#880808] to-[#260406]'
    }
  ];

  // Top 8 Visual Indian Dream Destinations (Image Rich Showcase)
  const topDestinations = [
    {
      name: 'Goa',
      tagline: 'Sun-Kissed Beaches & Golden Sunsets',
      cityFull: 'Goa (GOI / GOX)',
      fare: 2499,
      hotelsCount: '1,420+ Stays',
      weather: '28°C Sunny',
      weatherIcon: 'sun',
      tag: 'Bestseller Beach',
      img: '/static/assets/destinations/goa_beach_sunset.jpg'
    },
    {
      name: 'Kashmir',
      tagline: 'Gulmarg Snow Slopes & Dal Lake Shikaras',
      cityFull: 'Srinagar (SXR)',
      fare: 4990,
      hotelsCount: '680+ Stays',
      weather: '-1°C Snowing',
      weatherIcon: 'cloud-snow',
      tag: 'Winter Alpine Special',
      img: '/static/assets/destinations/kashmir_snow_resort.jpg'
    },
    {
      name: 'Kerala',
      tagline: 'Alleppey Luxury Houseboats & Backwaters',
      cityFull: 'Kochi (COK)',
      fare: 4650,
      hotelsCount: '980+ Stays',
      weather: '26°C Tropical',
      weatherIcon: 'cloud-rain',
      tag: 'Ayurveda & Lagoons',
      img: '/static/assets/destinations/kerala_houseboat_lake.jpg'
    },
    {
      name: 'Jaipur',
      tagline: 'Majestic Amber Fort & Royal Courtyards',
      cityFull: 'Jaipur (JAI)',
      fare: 3200,
      hotelsCount: '1,150+ Stays',
      weather: '24°C Pleasant',
      weatherIcon: 'sun',
      tag: 'Royal Heritage',
      img: '/static/assets/destinations/jaipur_royal_palace.jpg'
    },
    {
      name: 'Manali',
      tagline: 'Snow Capped Cedar Pines & Solang Valley',
      cityFull: 'Kullu Manali (KUU)',
      fare: 2850,
      hotelsCount: '740+ Stays',
      weather: '4°C Crisp Air',
      weatherIcon: 'cloud',
      tag: 'Himalayan Escape',
      img: '/static/assets/destinations/manali_snow_peaks.jpg'
    },
    {
      name: 'Andaman & Havelock',
      tagline: 'Radhanagar Crystal Azure Waters & Palms',
      cityFull: 'Port Blair (IXZ)',
      fare: 6800,
      hotelsCount: '320+ Stays',
      weather: '29°C Turquoise',
      weatherIcon: 'sun',
      tag: 'Island Paradise',
      img: '/static/assets/destinations/andaman_havelock_beach.jpg'
    },
    {
      name: 'Udaipur',
      tagline: 'Lake Pichola Floating Marble Palaces',
      cityFull: 'Udaipur (UDR)',
      fare: 3600,
      hotelsCount: '580+ Stays',
      weather: '25°C Romantic',
      weatherIcon: 'sunset',
      tag: 'City of Lakes',
      img: '/static/assets/destinations/udaipur_lake_palace.jpg'
    },
    {
      name: 'Varanasi',
      tagline: 'Ancient Ganga Ghats & Evening Lamp Aarti',
      cityFull: 'Varanasi (VNS)',
      fare: 3150,
      hotelsCount: '620+ Stays',
      weather: '23°C Spiritual',
      weatherIcon: 'flame',
      tag: 'Sacred Heritage',
      img: '/static/assets/destinations/varanasi_ganga_ghats.jpg'
    }
  ];

  // Explore India by Themes (8 Visual Tiles)
  const travelThemes = [
    { title: 'Beaches & Coastal Chill', count: '45+ Packages', img: '/static/assets/destinations/goa_beach_sunset.jpg', dest: 'Goa' },
    { title: 'Snow & Himalayan Peaks', count: '38+ Packages', img: '/static/assets/destinations/manali_snow_peaks.jpg', dest: 'Manali' },
    { title: 'Royal Palaces & Haveli', count: '29+ Packages', img: '/static/assets/destinations/jaipur_royal_palace.jpg', dest: 'Jaipur' },
    { title: 'Backwaters & Houseboats', count: '24+ Packages', img: '/static/assets/destinations/kerala_houseboat_lake.jpg', dest: 'Kerala' },
    { title: 'Spiritual Ghats & Temples', count: '32+ Packages', img: '/static/assets/destinations/varanasi_ganga_ghats.jpg', dest: 'Varanasi' },
    { title: 'Island Coral Reefs', count: '18+ Packages', img: '/static/assets/destinations/andaman_havelock_beach.jpg', dest: 'Port Blair' },
    { title: 'Romantic Floating Palaces', count: '22+ Packages', img: '/static/assets/destinations/udaipur_lake_palace.jpg', dest: 'Udaipur' },
    { title: 'Winter Gondola Escapes', count: '27+ Packages', img: '/static/assets/destinations/kashmir_snow_resort.jpg', dest: 'Kashmir' }
  ];

  // Popular Flight Routes
  const popularRoutes = [
    { from: 'New Delhi (DEL)', to: 'Goa (GOI / GOX)', fromName: 'New Delhi', toName: 'Goa', fromCode: 'DEL', toCode: 'GOI', fare: 3499, airline: 'IndiGo', stops: 'Non-stop', duration: '2h 15m', tag: 'Bestseller' },
    { from: 'Mumbai (BOM)', to: 'New Delhi (DEL)', fromName: 'Mumbai', toName: 'New Delhi', fromCode: 'BOM', toCode: 'DEL', fare: 3850, airline: 'Air India', stops: 'Non-stop', duration: '2h 10m', tag: 'Fastest' },
    { from: 'Bengaluru (BLR)', to: 'Goa (GOI / GOX)', fromName: 'Bangalore', toName: 'Goa', fromCode: 'BLR', toCode: 'GOI', fare: 2499, airline: 'Akasa Air', stops: 'Non-stop', duration: '1h 15m', tag: 'Lowest Fare' },
    { from: 'New Delhi (DEL)', to: 'Srinagar (SXR)', fromName: 'New Delhi', toName: 'Srinagar', fromCode: 'DEL', toCode: 'SXR', fare: 4990, airline: 'Vistara', stops: 'Non-stop', duration: '1h 35m', tag: 'Himalayan Deal' },
    { from: 'Mumbai (BOM)', to: 'Jaipur (JAI)', fromName: 'Mumbai', toName: 'Jaipur', fromCode: 'BOM', toCode: 'JAI', fare: 3200, airline: 'SpiceJet', stops: 'Non-stop', duration: '1h 45m', tag: 'Royal Route' },
    { from: 'Kolkata (CCU)', to: 'Port Blair (IXZ)', fromName: 'Kolkata', toName: 'Port Blair', fromCode: 'CCU', toCode: 'IXZ', fare: 6800, airline: 'IndiGo', stops: 'Non-stop', duration: '2h 30m', tag: 'Island Special' },
    { from: 'New Delhi (DEL)', to: 'Kochi (COK)', fromName: 'New Delhi', toName: 'Kochi', fromCode: 'DEL', toCode: 'COK', fare: 4650, airline: 'Air India', stops: 'Non-stop', duration: '3h 10m', tag: 'Kerala Backwaters' },
    { from: 'Hyderabad (HYD)', to: 'Goa (GOI / GOX)', fromName: 'Hyderabad', toName: 'Goa', fromCode: 'HYD', toCode: 'GOI', fare: 2890, airline: 'Akasa Air', stops: 'Non-stop', duration: '1h 20m', tag: 'Weekend Escape' }
  ];

  // Live Flights Search Results are dynamically generated via buildRouteFlights based on selected route
  // 8 Luxury & Boutique Hotels Showcase (Image Rich)
  const luxuryHotels = [
    {
      name: 'Taj Exotica Resort & Spa',
      location: 'Benaulim, South Goa',
      rating: '4.9',
      reviews: '2,420 Reviews',
      price: '14,500',
      tag: '5-Star Beachfront Luxury',
      img: '/static/assets/destinations/goa_beach_sunset.jpg',
      amenities: ['Private Beach', 'Infinity Pool', 'Ayurvedic Spa', 'Free Breakfast Included']
    },
    {
      name: 'Rambagh Palace Heritage',
      location: 'Bhawani Singh Road, Jaipur',
      rating: '5.0',
      reviews: '3,110 Reviews',
      price: '28,000',
      tag: 'Royal Palace Residence',
      img: '/static/assets/destinations/jaipur_royal_palace.jpg',
      amenities: ['Royal Butler Service', 'Peacock Gardens', 'Historic Suites', 'Fine Dining']
    },
    {
      name: 'Kumarakom Lake Resort',
      location: 'Kottayam, Kerala Backwaters',
      rating: '4.9',
      reviews: '1,890 Reviews',
      price: '16,200',
      tag: 'Meandering Pool Villas',
      img: '/static/assets/destinations/kerala_houseboat_lake.jpg',
      amenities: ['Private Houseboat Cruise', 'Ayurveda Center', 'Lake View Dining', 'Speedboat Transfer']
    },
    {
      name: 'The Khyber Himalayan Resort',
      location: 'Gulmarg, Kashmir',
      rating: '4.9',
      reviews: '1,750 Reviews',
      price: '22,500',
      tag: 'Heated Glass Pool & Gondola',
      img: '/static/assets/destinations/kashmir_snow_resort.jpg',
      amenities: ['Ski-in / Ski-out', 'Heated Indoor Pool', 'L’Occitane Spa', 'Mountain View Balcony']
    },
    {
      name: 'Taj Lake Palace',
      location: 'Lake Pichola, Udaipur',
      rating: '5.0',
      reviews: '4,280 Reviews',
      price: '34,000',
      tag: 'Floating Marble Wonder',
      img: '/static/assets/destinations/udaipur_lake_palace.jpg',
      amenities: ['Royal Boat Arrival', 'Jiva Spa Boat', 'Champagne Sunset Cruise', 'Mewar Fine Dining']
    },
    {
      name: 'The Oberoi Amarvilas',
      location: 'Taj East Gate Road, Agra',
      rating: '4.9',
      reviews: '2,980 Reviews',
      price: '31,500',
      tag: 'Direct Taj Mahal Balcony View',
      img: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80',
      amenities: ['Private Balcony Taj View', 'Tiered Turquoise Pools', 'Golf Cart Taj Access', 'Butler Service']
    },
    {
      name: 'Taj Exotica Resort & Spa, Andamans',
      location: 'Radhanagar Beach, Havelock',
      rating: '4.9',
      reviews: '1,430 Reviews',
      price: '24,000',
      tag: 'Pristine Island Sanctuary',
      img: '/static/assets/destinations/andaman_havelock_beach.jpg',
      amenities: ['Zero Footprint Villas', 'Private Radhanagar Shore', 'Scuba Diving Desk', 'Fresh Seafood']
    },
    {
      name: 'Span Resort & Spa',
      location: 'Baragarh, Manali Valley',
      rating: '4.8',
      reviews: '1,620 Reviews',
      price: '15,800',
      tag: 'Riverside Alpine Retreat',
      img: '/static/assets/destinations/manali_snow_peaks.jpg',
      amenities: ['Beas River Frontage', 'Cedar Forest Trails', 'Heli-Skiing Desk', 'Outdoor Bonfire Lounge']
    }
  ];

  // Handcrafted Holiday Packages (6 Curated Itineraries with Photos)
  const holidayPackages = [
    {
      id: 'goa-pkg',
      name: 'Goa Sun, Sand & Spice Tour',
      dest: 'Goa',
      duration: '4 Days / 3 Nights',
      price: 11499,
      rating: '4.9/5',
      operator: 'Goa Coastal Expeditions',
      img: '/static/assets/destinations/goa_beach_sunset.jpg',
      tag: 'Bestseller Beach',
      inclusions: ['Round-trip Flights Included', '4-Star Beach Resort', 'South Goa Catamaran Tour', 'Daily Breakfast', 'AC Cab Transfer']
    },
    {
      id: 'kashmir-pkg',
      name: 'Kashmir Valley & Gulmarg Snow Escape',
      dest: 'Kashmir',
      duration: '5 Days / 4 Nights',
      price: 18990,
      rating: '5.0/5',
      operator: 'Himalayan Peak Safaris',
      img: '/static/assets/destinations/kashmir_snow_resort.jpg',
      tag: 'Snow & Houseboat',
      inclusions: ['Dal Lake Luxury Houseboat', 'Gondola Ride Phase 1', 'Mughal Gardens Tour', 'All Meals Included', 'Chauffeur Cab']
    },
    {
      id: 'kerala-pkg',
      name: 'Alleppey Backwaters & Munnar Hills',
      dest: 'Kerala',
      duration: '5 Days / 4 Nights',
      price: 15400,
      rating: '4.8/5',
      operator: 'Backwater Trails Kerala',
      img: '/static/assets/destinations/kerala_houseboat_lake.jpg',
      tag: 'Ayurveda & Nature',
      inclusions: ['Private Houseboat Stay', 'Tea Plantation Walk', 'Spice Gardens Excursion', 'Ayurvedic Massage', 'Airport Pickup']
    },
    {
      id: 'rajasthan-pkg',
      name: 'Royal Rajasthan Heritage & Palaces',
      dest: 'Jaipur & Udaipur',
      duration: '6 Days / 5 Nights',
      price: 19800,
      rating: '4.9/5',
      operator: 'Rajputana Heritage Tours',
      img: '/static/assets/destinations/jaipur_royal_palace.jpg',
      tag: 'Palace Experience',
      inclusions: ['Heritage Haveli Stays', 'Amber Fort Guided Visit', 'Lake Pichola Boat Ride', 'Cultural Puppet & Dance Shows']
    },
    {
      id: 'andaman-pkg',
      name: 'Andaman Azure Seas & Havelock Island',
      dest: 'Port Blair & Havelock',
      duration: '5 Days / 4 Nights',
      price: 21900,
      rating: '4.9/5',
      operator: 'Bay of Bengal Escapes',
      img: '/static/assets/destinations/andaman_havelock_beach.jpg',
      tag: 'Island Coral Special',
      inclusions: ['Speed Catamaran to Havelock', 'Snorkeling at Elephant Beach', 'Radhanagar Sunset Transfer', '4-Star Beach Cottages']
    },
    {
      id: 'himachal-pkg',
      name: 'Manali Pine Forest & Solang Adventure',
      dest: 'Manali',
      duration: '5 Days / 4 Nights',
      price: 13900,
      rating: '4.8/5',
      operator: 'Beas Valley Adventure Co.',
      img: '/static/assets/destinations/manali_snow_peaks.jpg',
      tag: 'Mountain Adventure',
      inclusions: ['Solang Valley Snow Activities', 'Atal Tunnel Excursion', 'Wooden Chalet Resort', 'Campfire & BBQ Dinner', 'Volvo Transfers']
    }
  ];

  // Traveler Community Stories & UGC Photo Wall (6 Real Moments)
  const travelerStories = [
    {
      name: 'Ananya Sharma',
      trip: 'Vagator & Morjim, Goa',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      img: '/static/assets/destinations/goa_beach_sunset.jpg',
      badge: 'Solo Explorer',
      quote: 'Booking through TRAVORA was effortless. Autonomous re-routing saved us 6 hours when our connecting flight got rescheduled without a single call needed!'
    },
    {
      name: 'Rohan & Sneha Mathur',
      trip: 'Gulmarg & Dal Lake, Kashmir',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      img: '/static/assets/destinations/kashmir_snow_resort.jpg',
      badge: 'Couples Getaway',
      quote: 'The snow resort package had everything taken care of—gondola Phase 2 tickets, heated 4x4 cab, and the luxury Dal Lake houseboat was unreal.'
    },
    {
      name: 'Vikramaditya Rao',
      trip: 'Kumarakom & Alleppey, Kerala',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      img: '/static/assets/destinations/kerala_houseboat_lake.jpg',
      badge: 'Family Vacation',
      quote: 'Private houseboat backwater cruise was pure tranquility. Traditional fish curry cooked fresh on board. Zero hidden fees at final checkout.'
    },
    {
      name: 'Meera Deshmukh',
      trip: 'Lake Pichola & City Palace, Udaipur',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      img: '/static/assets/destinations/udaipur_lake_palace.jpg',
      badge: 'Heritage Lover',
      quote: 'Watching the sunset over Lake Pichola from the palace courtyard was pure magic. The AI Planner configured our whole 4-day itinerary flawlessly.'
    },
    {
      name: 'Arjun & Friends',
      trip: 'Solang Valley & Rohtang, Manali',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      img: '/static/assets/destinations/manali_snow_peaks.jpg',
      badge: 'Adventure Group',
      quote: 'Flawless road transfer and alpine cottage booking. We booked the hacker flight combo and saved over ₹4,200 compared to other travel portals.'
    },
    {
      name: 'Sanya & Kabir',
      trip: 'Radhanagar Beach, Havelock',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      img: '/static/assets/destinations/andaman_havelock_beach.jpg',
      badge: 'Honeymooners',
      quote: 'Crystal clear waters at Radhanagar Beach. The verified operator catamaran and scuba gear arrived on time. Best holiday experience of our lives!'
    }
  ];

  const showLandingSplash = !window.__travoraIntroPlayed;
  if (showLandingSplash) {
    // Stage 1 transitions to Stage 2 after 1.8s
    setTimeout(() => {
      if (typeof window.advanceToIntroStage2 === 'function') {
        window.advanceToIntroStage2();
      }
    }, 1800);
    // Auto-dismiss after celebration finishes (~5.4s)
    setTimeout(() => {
      if (typeof window.dismissSplashIntro === 'function') {
        window.dismissSplashIntro();
      }
    }, 5600);
  }

  return `
    <!-- CINEMATIC LANDING SPLASH INTRO (STAGE 1: TRAVORA CORE -> STAGE 2: WORLD TOURISM DAY) -->
    ${showLandingSplash ? `
    <div id="auth-splash-overlay" onclick="window.dismissSplashIntro()" class="cursor-pointer select-none" style="z-index:9999;">
      <div class="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
      
      <!-- Pulsing ambient glow orbs -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none animate-pulse" style="background:radial-gradient(circle,rgba(129,11,56,0.45),transparent 70%);filter:blur(50px);"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none" style="background:radial-gradient(circle,rgba(255,215,0,0.22),transparent 70%);filter:blur(60px);animation:orbitPulse 3.5s ease-in-out infinite 0.8s;"></div>

      <!-- Traditional Decorative Mandalas -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-15">
        <svg class="w-[600px] h-[600px] text-amber-400 wtd-mandala" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="0.35">
          <circle cx="50" cy="50" r="45" stroke-dasharray="2 2" />
          <circle cx="50" cy="50" r="35" />
          <circle cx="50" cy="50" r="25" stroke-dasharray="1 1" />
          <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" />
          <circle cx="50" cy="50" r="15" />
        </svg>
      </div>

      <!-- Orbit rings -->
      <div class="splash-orbit-ring"></div>
      <div class="splash-orbit-ring"></div>
      <div class="splash-orbit-ring"></div>

      <!-- ===================================================================
           STAGE 1: TRAVORA BRAND OPENING INTRO
           =================================================================== -->
      <div id="intro-stage-1" class="relative flex flex-col items-center text-center space-y-6 z-10 px-6 max-w-lg mx-auto wtd-fade-stage">
        <!-- Plane arc -->
        <div class="relative w-80 h-20 flex items-center justify-center">
          <svg class="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 320 80" fill="none">
            <path d="M 10 65 Q 160 5 310 40" stroke="url(#splashGrad1)" stroke-width="2.5" stroke-dasharray="8 7" class="flight-dash-animated opacity-90"/>
            <defs>
              <linearGradient id="splashGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#810B38" stop-opacity="0"/>
                <stop offset="50%" stop-color="#810B38" stop-opacity="1"/>
                <stop offset="100%" stop-color="#DCC3AA" stop-opacity="1"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="splash-flight-sweep">
            <i data-lucide="plane" class="w-8 h-8 glow-pulse-teal" style="color:#F1E2D1;filter:drop-shadow(0 0 18px rgba(129,11,56,0.95));"></i>
          </div>
        </div>
        <!-- Logo emblem with glow -->
        <div class="splash-logo-core relative">
          <div class="absolute -inset-8 rounded-full pointer-events-none animate-pulse" style="background:radial-gradient(circle,rgba(129,11,56,0.55),rgba(220,195,170,0.12),transparent);filter:blur(16px);"></div>
          <img src="/static/assets/logo/travora_emblem.png" alt="TRAVORA" class="w-32 h-32 sm:w-36 sm:h-36 object-contain relative z-10" style="filter:drop-shadow(0 12px 40px rgba(129,11,56,0.90));"/>
        </div>
        <!-- Tagline -->
        <div class="splash-brand-title space-y-3">
          <p class="text-sm font-bold tracking-widest" style="color:rgba(220,195,170,0.9);letter-spacing:0.25em;">PLAN FREELY. TRAVEL PERSONALLY. ADAPT INSTANTLY.</p>
        </div>
        <!-- Progress bar -->
        <div class="splash-progress-track">
          <div class="splash-progress-fill"></div>
        </div>
        <!-- Skip hint -->
        <p class="text-[11px] tracking-widest flex items-center space-x-1.5 hover:opacity-100 transition" style="color:rgba(241,226,209,0.55);">
          <span>TAP TO CONTINUE</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </p>
      </div>

      <!-- ===================================================================
           STAGE 2: WORLD TOURISM DAY CELEBRATION (पधारो म्हारे देस)
           =================================================================== -->
      <div id="intro-stage-2" class="hidden relative flex flex-col items-center text-center space-y-5 z-20 px-6 max-w-2xl mx-auto wtd-fade-stage" style="opacity:0;transform:scale(1.08);">
        
        <!-- Diya & Festive Crown -->
        <div class="flex items-center justify-center space-x-3 text-amber-400">
          <span class="wtd-diya-glow text-2xl">🪔</span>
          <span class="px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-amber-500/20 via-red-600/30 to-amber-500/20 border border-amber-400/40 text-amber-300 shadow-lg">
            27 September • World Tourism Day 2026
          </span>
          <span class="wtd-diya-glow text-2xl" style="animation-delay: 0.6s;">🪔</span>
        </div>

        <!-- Celebrates Title -->
        <h2 class="font-cinzel text-lg sm:text-2xl font-black uppercase tracking-[0.18em] text-amber-200 gold-foil-text leading-tight">
          TRAVORA CELEBRATES WORLD TOURISM DAY
        </h2>

        <!-- Grand Devanagari Centerpiece -->
        <div class="py-2">
          <h1 class="padharo-heading text-5xl sm:text-7xl font-extrabold tracking-wide leading-tight select-none">
            पधारो म्हारे देस
          </h1>
          <p class="text-xs sm:text-sm font-semibold text-amber-200/90 tracking-widest uppercase mt-2">
            Welcome to the Land of Eternal Heritage, Diversity & Hospitality
          </p>
        </div>

        <!-- 802 Districts & Incredible India Pledge -->
        <div class="p-3 sm:px-6 rounded-2xl bg-black/40 border border-amber-400/30 backdrop-blur-md max-w-lg text-center space-y-1">
          <p class="text-xs text-amber-100/90 leading-relaxed font-medium">
            From the snow peaks of the Himalayas to the backwaters of Kerala and the royal forts of Rajasthan — Discover <strong>802 Districts of Incredible India</strong> with AI-powered personalized journeys.
          </p>
        </div>

        <!-- Action Button -->
        <div class="pt-2">
          <button 
            type="button"
            onclick="window.dismissSplashIntro();" 
            class="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 hover:from-amber-400 hover:to-red-500 text-white font-extrabold text-sm tracking-wider uppercase shadow-2xl shadow-amber-500/40 transition transform hover:scale-105 flex items-center space-x-2 border border-amber-300/40">
            <span class="font-devanagari-royal text-base">पधारो म्हारे देस</span>
            <span>&bull;</span>
            <span>Explore Incredible India</span>
            <i data-lucide="compass" class="w-4 h-4 ml-1"></i>
          </button>
        </div>

        <p class="text-[10px] text-amber-300/60 uppercase tracking-widest">
          Tap anywhere to enter portal
        </p>

      </div>

    </div>` : ''}

    <div class="space-y-12 sm:space-y-16 pb-16 overflow-hidden">


      <!-- ===================================================================
           LUXURY SUB-NAV PROMO & DISRUPTION ASSURANCE RIBBON (AUTO-FADE)
           =================================================================== -->
      <div id="travora-coupon-banner-wrapper" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2.5 transition-all duration-700 ease-out">
        <div id="travora-coupon-banner" 
             onmouseenter="window.pauseCouponFadeTimer && window.pauseCouponFadeTimer()"
             onmouseleave="window.resumeCouponFadeTimer && window.resumeCouponFadeTimer()"
             class="relative p-3 sm:py-2.5 sm:px-4 rounded-2xl bg-gradient-to-r from-red-600/10 via-[#810B38]/15 to-amber-600/10 dark:from-[#210408] dark:via-[#420815]/60 dark:to-[#210408] border border-red-500/30 text-xs text-red-950 dark:text-red-200 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md backdrop-blur-xl transition-all duration-700 ease-out overflow-hidden group">
          
          <!-- LEFT / PROMO DETAILS -->
          <div class="flex items-center space-x-2.5 sm:space-x-3 flex-wrap gap-y-1.5">
            <span class="px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#ea2330] via-[#a3122c] to-[#810B38] text-white font-black text-[10px] sm:text-[10.5px] uppercase tracking-wider shadow-sm flex items-center space-x-1 shrink-0">
              <i data-lucide="sparkles" class="w-3 h-3 text-amber-300 animate-pulse"></i>
              <span>TRAVORA × YATRA PASS</span>
            </span>

            <span class="font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-[12.5px]">
              Book Flights & Stays with <strong class="text-red-600 dark:text-red-400 font-extrabold underline decoration-red-400/40">Zero Convenience Fees</strong> using:
            </span>

            <!-- INTERACTIVE TICKET-STYLE COUPON PILL -->
            <button 
              id="top-coupon-copy-btn"
              type="button"
              onclick="window.copyPromoCode('FIRSTFLY', this)" 
              class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-[#810B38] hover:bg-[#961239] text-white font-black text-xs tracking-wider shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-amber-400/30 group/btn"
              title="Click to copy coupon code FIRSTFLY">
              <span class="font-mono">FIRSTFLY</span>
              <i data-lucide="copy" class="w-3 h-3 text-amber-300 group-hover/btn:rotate-12 transition"></i>
            </button>
          </div>

          <!-- RIGHT / VALUE PROPS & DISMISS BUTTON -->
          <div class="flex items-center space-x-3 text-[11px] sm:text-[11.5px] font-bold text-slate-700 dark:text-slate-300 shrink-0">
            <span class="flex items-center space-x-1 text-slate-800 dark:text-slate-200">
              <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-500"></i>
              <span>100% Price Match</span>
            </span>
            <span class="opacity-25">|</span>
            <span class="flex items-center space-x-1 text-amber-700 dark:text-amber-300">
              <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-500"></i>
              <span>Disruption Radar</span>
            </span>
            <span class="opacity-25 hidden sm:inline">|</span>
            <span class="hidden sm:flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
              <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
              <span>Free Reschedule</span>
            </span>

            <!-- DISMISS CLOSE BUTTON -->
            <button 
              type="button"
              onclick="window.dismissCouponBanner()" 
              class="ml-1 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
              title="Dismiss Offer Banner">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>

          <!-- SUBTLE AUTO-FADE TIMER PROGRESS BAR -->
          <div id="coupon-fade-progress" class="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 via-red-500 to-[#810B38] opacity-60 w-full"></div>
        </div>
      </div>

      <!-- ===================================================================
           HERO SEARCH ENGINE WITH BESPOKE TRAVEL PHOTOGRAPHY & DARK RED OVERLAY
           =================================================================== -->
      <section class="relative">
        
        

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6">
          
          <!-- Hero Header Tagline -->
          <div class="text-center text-white space-y-2 max-w-3xl mx-auto">
            <div class="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full backdrop-blur-md border border-white/20 text-xs font-black text-white shadow-lg mb-1" style="background:linear-gradient(135deg,#810B38,#541A1A);">
              <i data-lucide="plane" class="w-3.5 h-3.5"></i>
              <span>INDIA'S PREMIER SMART TRAVEL ENGINE</span>
            </div>
            <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight drop-shadow-md">
              Book Cheap Flights, Hotels & Dynamic Tours
            </h1>
            <p class="text-xs sm:text-sm text-slate-200 max-w-2xl mx-auto drop-shadow">
              Compare 500+ airlines, 1.2M verified stays, and 517 ground operators with real-time disruption adaptation.
            </p>
          </div>

          <!-- YATRA ELEVATED MASTER SEARCH CARD WITH GLASS EFFECT -->
          <div class="yatra-search-hero glass-hero-panel rounded-3xl p-4 sm:p-7 space-y-5 transition-all duration-300">

            <!-- TAB 1: FLIGHTS SEARCH ENGINE -->
            ${activeSearchTab === 'flights' ? `
              <div class="space-y-4">
                
                <!-- Trip Type & Options Bar -->
                <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div class="flex items-center space-x-5 font-bold text-slate-800 dark:text-slate-200">
                    <label class="flex items-center space-x-1.5 cursor-pointer select-none">
                      <input type="radio" name="flightTripType" value="oneway" ${flightTripType === 'oneway' ? 'checked' : ''} onchange="window.setLandingFlightTripType('oneway')" class="accent-red-600 w-4 h-4" />
                      <span>One Way</span>
                    </label>
                    <label class="flex items-center space-x-1.5 cursor-pointer select-none">
                      <input type="radio" name="flightTripType" value="roundtrip" ${flightTripType === 'roundtrip' ? 'checked' : ''} onchange="window.setLandingFlightTripType('roundtrip')" class="accent-red-600 w-4 h-4" />
                      <span>Round Trip</span>
                    </label>
                    <label class="flex items-center space-x-1.5 cursor-pointer select-none">
                      <input type="radio" name="flightTripType" value="multicity" ${flightTripType === 'multicity' ? 'checked' : ''} onchange="window.setLandingFlightTripType('multicity')" class="accent-red-600 w-4 h-4" />
                      <span>Multi-City</span>
                    </label>
                  </div>

                  <!-- Direct Flights & Flexible Dates -->
                  <div class="flex items-center space-x-3 text-xs">
                    <label class="flex items-center space-x-1.5 cursor-pointer px-3 py-1 rounded-xl bg-red-500/10 text-red-700 dark:text-red-300 font-bold border border-red-500/20 select-none">
                      <input type="checkbox" id="chk-flexible-dates" ${isFlexibleDates ? 'checked' : ''} onchange="window.toggleLandingFlexibleDates(this.checked)" class="accent-red-600" />
                      <span>Flexible Dates (+/- 3 Days Matrix)</span>
                    </label>
                    <label class="hidden sm:flex items-center space-x-1.5 cursor-pointer text-slate-500 select-none">
                      <input type="checkbox" ${isDirectOnly ? 'checked' : ''} onchange="window.toggleDirectFlights(this.checked)" class="accent-red-600" />
                      <span>Non-Stop Only</span>
                    </label>
                  </div>
                </div>

                <!-- 4 Major Search Inputs (From, To, Departure, Travellers) with Swap Button -->
                <div class="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  
                  <!-- DEPART FROM CITY (CLICK TO OPEN PLACE PICKER) -->
                  <div 
                    onclick="window.openPlacePicker({ type: 'flights', targetInputId: 'search-from-city', title: 'Depart From: Choose Indian Airport' })"
                    class="glass-input-card p-3.5 rounded-2xl space-y-1 focus-within:border-red-500 hover:border-[#810B38] dark:hover:border-red-500 cursor-pointer transition shadow-xs group">
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span class="flex items-center space-x-1">
                        <i data-lucide="plane-takeoff" class="w-3 h-3 text-[#810B38] dark:text-red-400"></i>
                        <span>Depart From</span>
                      </span>
                      <span class="font-mono text-red-600 dark:text-red-400 font-extrabold">${fromCode}</span>
                    </div>
                    <div class="flex items-center justify-between pt-0.5">
                      <input 
                        type="text" 
                        id="search-from-city" 
                        value="${fromCity}" 
                        readonly
                        onchange="window.landingFromCity = this.value;"
                        class="w-full font-black text-sm sm:text-base text-slate-900 dark:text-white bg-transparent outline-none cursor-pointer truncate"
                      />
                      <i data-lucide="search" class="w-4 h-4 text-slate-400 group-hover:text-[#810B38] transition shrink-0 ml-1"></i>
                    </div>
                    <div class="text-[11px] text-slate-400 truncate">Tap to pick from 50+ airports</div>
                  </div>

                  <!-- CIRCULAR SWAP BUTTON -->
                  <button 
                    type="button"
                    onclick="window.swapLandingCities()" 
                    title="Swap Origin and Destination"
                    class="hidden sm:flex absolute left-1/2 lg:left-1/4 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-red-600 text-slate-600 dark:text-slate-300 hover:text-red-600 shadow-md items-center justify-center transition transform hover:rotate-180">
                    <i data-lucide="arrow-left-right" class="w-4 h-4"></i>
                  </button>

                  <!-- GOING TO CITY (CLICK TO OPEN PLACE PICKER) -->
                  <div 
                    onclick="window.openPlacePicker({ type: 'flights', targetInputId: 'search-to-city', title: 'Going To: Choose Indian Airport' })"
                    class="glass-input-card p-3.5 rounded-2xl space-y-1 focus-within:border-red-500 hover:border-[#810B38] dark:hover:border-red-500 cursor-pointer transition shadow-xs group">
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span class="flex items-center space-x-1">
                        <i data-lucide="plane-landing" class="w-3 h-3 text-emerald-500"></i>
                        <span>Going To</span>
                      </span>
                      <span class="font-mono text-red-600 dark:text-red-400 font-extrabold">${toCode}</span>
                    </div>
                    <div class="flex items-center justify-between pt-0.5">
                      <input 
                        type="text" 
                        id="search-to-city" 
                        value="${toCity}" 
                        readonly
                        onchange="window.landingToCity = this.value;"
                        class="w-full font-black text-sm sm:text-base text-slate-900 dark:text-white bg-transparent outline-none cursor-pointer truncate"
                      />
                      <i data-lucide="search" class="w-4 h-4 text-slate-400 group-hover:text-[#810B38] transition shrink-0 ml-1"></i>
                    </div>
                    <div class="text-[11px] text-slate-400 truncate">Tap to pick from 50+ airports</div>
                  </div>

                  <!-- DEPARTURE & RETURN DATES (INTERACTIVE SMART CALENDAR) -->
                  <div 
                    id="flight-calendar-trigger"
                    onclick="window.openFlightCalendarPicker()"
                    class="travora-date-trigger glass-input-card p-3.5 rounded-2xl space-y-1 hover:border-[#810B38] dark:hover:border-red-500 cursor-pointer transition shadow-xs group">
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span class="flex items-center space-x-1">
                        <i data-lucide="calendar" class="w-3 h-3 text-amber-500"></i>
                        <span>Departure - Return</span>
                      </span>
                      <span id="flight-trip-type-badge" class="text-[10px] text-red-600 dark:text-red-400 font-bold">${flightTripType === 'roundtrip' ? 'Round Trip' : 'One Way'}</span>
                    </div>
                    <div class="flex items-center justify-between pt-0.5">
                      <div class="font-black text-sm sm:text-base text-slate-900 dark:text-white truncate">
                        <span id="flight-dep-date-display">${new Date((window.landingDepDate || '2026-10-28') + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        ${flightTripType === 'roundtrip' ? `
                          <span id="flight-ret-date-arrow" class="text-slate-400 mx-1">→</span>
                          <span id="flight-ret-date-display">${new Date((window.landingRetDate || '2026-10-31') + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        ` : `
                          <span id="flight-ret-date-arrow" class="text-slate-400 mx-1 hidden">→</span>
                          <span id="flight-ret-date-display" class="hidden"></span>
                        `}
                      </div>
                      <i data-lucide="calendar-days" class="w-4 h-4 text-amber-500 group-hover:scale-110 transition shrink-0 ml-1"></i>
                    </div>
                    <div class="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center space-x-1 truncate">
                      <i data-lucide="sparkles" class="w-3 h-3 shrink-0"></i>
                      <span>Smart Calendar • Festival Markers</span>
                    </div>
                    <!-- Hidden inputs for date value synchronization -->
                    <input type="hidden" id="search-dep-date" value="${window.landingDepDate || '2026-10-28'}" />
                    <input type="hidden" id="search-ret-date" value="${window.landingRetDate || '2026-10-31'}" />
                  </div>

                  <!-- TRAVELLERS & CABIN CLASS -->
                  <div 
                    id="travellers-dropdown-card"
                    onclick="window.toggleTravellerDropdown(event)"
                    class="relative glass-input-card p-3.5 rounded-2xl space-y-1 focus-within:border-red-500 hover:border-[#810B38] dark:hover:border-red-500 cursor-pointer select-none transition ${isTravellerDropdownOpen ? 'z-50 ring-2 ring-red-500/50 shadow-2xl bg-white dark:bg-slate-900' : 'z-20'}">
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Travellers & Class</span>
                      <span id="traveller-badge-class" class="text-[10px] text-[#ea2330] font-bold">${cabinClass}</span>
                    </div>
                    <div class="flex items-center justify-between pt-0.5">
                      <div class="truncate">
                        <div id="traveller-summary-title" class="font-black text-sm sm:text-base text-slate-900 dark:text-white truncate">
                          ${totalTravellers} Traveller${totalTravellers > 1 ? 's' : ''}
                        </div>
                        <div id="traveller-summary-sub" class="text-[11px] text-slate-400 truncate">${cabinClass} • Standard Baggage</div>
                      </div>
                      <i id="traveller-chevron" data-lucide="chevron-down" class="w-4 h-4 text-slate-400 shrink-0 ml-1 transition-transform ${isTravellerDropdownOpen ? 'rotate-180 text-red-600' : ''}"></i>
                    </div>

                    <!-- Interactive Travellers Popover Selector -->
                    <div 
                      id="traveller-selection-popover"
                      onclick="event.stopPropagation()"
                      class="absolute top-full right-0 sm:right-0 mt-2 w-72 sm:w-80 z-50 p-4 sm:p-5 rounded-3xl surface-card shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-slate-200 dark:border-slate-700 space-y-4 bg-white dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150 ${isTravellerDropdownOpen ? '' : 'hidden'}">
                      <div class="space-y-3.5">
                        
                        <!-- Adults -->
                        <div class="flex items-center justify-between">
                          <div>
                            <div class="text-xs font-bold text-slate-800 dark:text-white">Adults (12+ yrs)</div>
                            <div class="text-[10px] text-slate-400">On the day of travel</div>
                          </div>
                          <div class="flex items-center space-x-2">
                            <button 
                              type="button" 
                              onclick="event.stopPropagation(); window.changeAdults(-1)" 
                              class="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-sm text-slate-700 dark:text-slate-300 hover:border-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition active:scale-95 cursor-pointer">-</button>
                            <span id="traveller-adults-count" class="w-8 text-center font-black text-sm text-slate-900 dark:text-white">${adults}</span>
                            <button 
                              type="button" 
                              onclick="event.stopPropagation(); window.changeAdults(1)" 
                              class="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-sm text-slate-700 dark:text-slate-300 hover:border-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition active:scale-95 cursor-pointer">+</button>
                          </div>
                        </div>

                        <!-- Children -->
                        <div class="flex items-center justify-between">
                          <div>
                            <div class="text-xs font-bold text-slate-800 dark:text-white">Children (2-12 yrs)</div>
                            <div class="text-[10px] text-slate-400">With separate seat</div>
                          </div>
                          <div class="flex items-center space-x-2">
                            <button 
                              type="button" 
                              onclick="event.stopPropagation(); window.changeChildren(-1)" 
                              class="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-sm text-slate-700 dark:text-slate-300 hover:border-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition active:scale-95 cursor-pointer">-</button>
                            <span id="traveller-children-count" class="w-8 text-center font-black text-sm text-slate-900 dark:text-white">${children}</span>
                            <button 
                              type="button" 
                              onclick="event.stopPropagation(); window.changeChildren(1)" 
                              class="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-sm text-slate-700 dark:text-slate-300 hover:border-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition active:scale-95 cursor-pointer">+</button>
                          </div>
                        </div>

                        <!-- Infants -->
                        <div class="flex items-center justify-between">
                          <div>
                            <div class="text-xs font-bold text-slate-800 dark:text-white">Infants (&lt; 2 yrs)</div>
                            <div class="text-[10px] text-slate-400">On lap</div>
                          </div>
                          <div class="flex items-center space-x-2">
                            <button 
                              type="button" 
                              onclick="event.stopPropagation(); window.changeInfants(-1)" 
                              class="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-sm text-slate-700 dark:text-slate-300 hover:border-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition active:scale-95 cursor-pointer">-</button>
                            <span id="traveller-infants-count" class="w-8 text-center font-black text-sm text-slate-900 dark:text-white">${infants}</span>
                            <button 
                              type="button" 
                              onclick="event.stopPropagation(); window.changeInfants(1)" 
                              class="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-sm text-slate-700 dark:text-slate-300 hover:border-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition active:scale-95 cursor-pointer">+</button>
                          </div>
                        </div>

                      </div>

                      <!-- Cabin Class Selection -->
                      <div class="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <div class="text-[10px] font-bold text-slate-400 uppercase">Cabin Class</div>
                        <div class="grid grid-cols-3 gap-1.5 text-[11px] font-bold" id="cabin-class-btn-group">
                          ${['Economy', 'Premium', 'Business'].map(cls => `
                            <button 
                              type="button" 
                              data-cabin-class="${cls}"
                              onclick="event.stopPropagation(); window.setCabinClass('${cls}')" 
                              class="cabin-class-btn py-2 px-1.5 rounded-xl text-center border font-bold text-xs transition cursor-pointer ${cabinClass === cls ? 'bg-gradient-to-r from-[#ea2330] to-[#880808] text-white border-red-600 shadow-md font-black ring-2 ring-red-400/50' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'}">
                              ${cls}
                            </button>
                          `).join('')}
                        </div>
                      </div>

                      <button 
                        type="button" 
                        onclick="event.stopPropagation(); window.closeTravellerDropdown()" 
                        class="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ea2330] via-[#d91b28] to-[#880808] hover:from-[#d91b28] hover:to-[#5c0606] text-white font-black text-xs shadow-md shadow-red-600/30 hover:opacity-95 transition cursor-pointer">
                        Apply Travellers & Class
                      </button>
                    </div>
                  </div>

                </div>

                <!-- POPULAR HUBS BAR -->
                <div class="glass-pill-container p-2.5 rounded-2xl flex flex-wrap items-center gap-1.5 text-xs">
                  <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center space-x-1 mr-1">
                    <i data-lucide="trending-up" class="w-3.5 h-3.5 text-red-500"></i>
                    <span>Popular Hubs:</span>
                  </span>
                  ${[
                    { name: 'Goa', full: 'Goa (GOI / GOX)' },
                    { name: 'Mumbai', full: 'Mumbai (BOM)' },
                    { name: 'Delhi', full: 'New Delhi (DEL)' },
                    { name: 'Bengaluru', full: 'Bengaluru (BLR)' },
                    { name: 'Jaipur', full: 'Jaipur (JAI)' },
                    { name: 'Srinagar', full: 'Srinagar (SXR)' },
                    { name: 'Leh Ladakh', full: 'Leh Ladakh (IXL)' },
                    { name: 'Kochi', full: 'Kochi (COK)' },
                    { name: 'Manali', full: 'Kullu Manali (KUU)' },
                    { name: 'Andaman', full: 'Port Blair (IXZ)' },
                    { name: 'Udaipur', full: 'Udaipur (UDR)' },
                    { name: 'Varanasi', full: 'Varanasi (VNS)' },
                    { name: 'Amritsar', full: 'Amritsar (ATQ)' },
                    { name: 'Dehradun', full: 'Dehradun / Rishikesh (DED)' },
                    { name: 'Darjeeling', full: 'Bagdogra (IXB)' },
                    { name: 'Puri', full: 'Bhubaneswar (BBI)' },
                    { name: 'Ayodhya', full: 'Ayodhya (AYJ)' }
                  ].map(city => `
                    <button 
                      type="button"
                      onclick="window.setQuickDestination('${city.full}')"
                      class="px-2.5 py-1 rounded-xl border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-red-600 hover:border-red-500 bg-white/70 dark:bg-white/5 text-[11px] font-medium transition flex items-center space-x-1 shadow-2xs hover:scale-105 backdrop-blur-sm">
                      <span>${city.name}</span>
                    </button>
                  `).join('')}
                  <!-- Button to open whole India airport directory -->
                  <button 
                    type="button"
                    onclick="window.openPlacePicker({ type: 'flights', targetInputId: 'search-to-city', title: 'Choose From 50+ Airports Across All India' })"
                    class="px-3 py-1 rounded-xl border border-[#810B38] bg-red-500/10 text-[#810B38] dark:text-red-300 font-extrabold text-[11px] hover:bg-[#810B38] hover:text-white transition flex items-center space-x-1 shadow-sm ml-auto backdrop-blur-sm">
                    <i data-lucide="compass" class="w-3.5 h-3.5"></i>
                    <span>🗺️ All 50+ Hubs Across India</span>
                  </button>
                </div>

                <!-- SPECIAL FARE CATEGORIES -->
                <div class="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span class="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                    <i data-lucide="tag" class="w-3.5 h-3.5 text-red-600"></i>
                    <span>Special Fares:</span>
                  </span>
                  <button 
                    type="button"
                    onclick="window.setLandingSpecialFare('regular')" 
                    class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border backdrop-blur-sm ${specialFare === 'regular' ? 'bg-red-50 dark:bg-red-950/60 border-red-600 text-red-700 dark:text-red-300 font-black shadow-sm' : 'border-slate-200/70 dark:border-white/10 bg-white/50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-400'}">
                    Regular Fares
                  </button>
                  <button 
                    type="button"
                    onclick="window.setLandingSpecialFare('forces')" 
                    class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border backdrop-blur-sm ${specialFare === 'forces' ? 'bg-red-50 dark:bg-red-950/60 border-red-600 text-red-700 dark:text-red-300 font-black shadow-sm' : 'border-slate-200/70 dark:border-white/10 bg-white/50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-400'}">
                    Armed Forces (Flat ₹600 Off)
                  </button>
                  <button 
                    type="button"
                    onclick="window.setLandingSpecialFare('student')" 
                    class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border backdrop-blur-sm ${specialFare === 'student' ? 'bg-red-50 dark:bg-red-950/60 border-red-600 text-red-700 dark:text-red-300 font-black shadow-sm' : 'border-slate-200/70 dark:border-white/10 bg-white/50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-400'}">
                    Student Fare (Extra 10kg Baggage)
                  </button>
                  <button 
                    type="button"
                    onclick="window.setLandingSpecialFare('senior')" 
                    class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border backdrop-blur-sm ${specialFare === 'senior' ? 'bg-red-50 dark:bg-red-950/60 border-red-600 text-red-700 dark:text-red-300 font-black shadow-sm' : 'border-slate-200/70 dark:border-white/10 bg-white/50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-400'}">
                    Senior Citizen (60+ Yrs)
                  </button>
                  <button 
                    type="button"
                    onclick="window.setLandingSpecialFare('doctors')" 
                    class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border backdrop-blur-sm ${specialFare === 'doctors' ? 'bg-red-50 dark:bg-red-950/60 border-red-600 text-red-700 dark:text-red-300 font-black shadow-sm' : 'border-slate-200/70 dark:border-white/10 bg-white/50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-400'}">
                    Doctors & Nurses
                  </button>
                </div>

                <!-- SUBMIT SEARCH BUTTON (GLOSSY RED TO DARK RED) -->
                <div class="pt-3 flex justify-center">
                  <button 
                    type="button"
                    onclick="window.executeLandingSearch('flights')" 
                    class="w-full sm:w-auto min-w-[280px] px-14 py-3.5 rounded-2xl bg-gradient-to-r from-[#ea2330] via-[#d91b28] to-[#880808] hover:from-[#d91b28] hover:to-[#5c0606] text-white font-black text-base shadow-xl shadow-red-600/35 transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2">
                    <i data-lucide="search" class="w-5 h-5"></i>
                    <span>Search Flights Across India</span>
                  </button>
                </div>

              </div>
            ` : activeSearchTab === 'hotels' ? `
              <!-- TAB 2: HOTELS SEARCH -->
              <div class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <!-- Destination Input with Autocomplete Trigger -->
                  <div 
                    onclick="window.openPlacePicker({ type: 'hotels', targetInputId: 'hotel-city', title: 'Choose Indian Stay City / Resort' })"
                    class="glass-input-card p-3.5 rounded-2xl space-y-1 hover:border-[#810B38] dark:hover:border-red-500 cursor-pointer transition group shadow-xs">
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span class="flex items-center space-x-1">
                        <i data-lucide="building" class="w-3 h-3 text-[#810B38] dark:text-red-400"></i>
                        <span>Destination / Property</span>
                      </span>
                      <span class="text-red-600 font-bold text-[10px]">Verified Stays</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <input type="text" id="hotel-city" value="${hotelCity}" readonly onchange="window.landingHotelCity = this.value; window.landingToCity = this.value;" class="w-full font-black text-sm sm:text-base text-slate-900 dark:text-white bg-transparent outline-none cursor-pointer" />
                      <i data-lucide="search" class="w-4 h-4 text-slate-400 group-hover:text-[#810B38] transition shrink-0 ml-1"></i>
                    </div>
                    <div class="text-[11px] text-slate-400 truncate">Resorts, Boutique Stays, Heritage Haveli</div>
                  </div>

                  <!-- Check-in & Check-out with Smart Calendar -->
                  <div 
                    onclick="window.openHotelCalendarPicker()"
                    class="travora-date-trigger glass-input-card p-3.5 rounded-2xl space-y-1 hover:border-[#810B38] cursor-pointer transition group shadow-xs">
                    <div class="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1">
                      <i data-lucide="calendar" class="w-3 h-3 text-amber-500"></i>
                      <span>Check-in Date</span>
                    </div>
                    <div class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between">
                      <span>${new Date((window.landingDepDate || '2026-10-28') + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                      <i data-lucide="calendar-days" class="w-4 h-4 text-amber-500"></i>
                    </div>
                    <div class="text-[11px] text-slate-400">From 14:00 PM Check-in</div>
                  </div>

                  <div 
                    onclick="window.openHotelCalendarPicker()"
                    class="travora-date-trigger glass-input-card p-3.5 rounded-2xl space-y-1 hover:border-[#810B38] cursor-pointer transition group shadow-xs">
                    <div class="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1">
                      <i data-lucide="calendar" class="w-3 h-3 text-amber-500"></i>
                      <span>Check-out Date</span>
                    </div>
                    <div class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between">
                      <span>${new Date((window.landingRetDate || '2026-10-31') + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                      <i data-lucide="calendar-days" class="w-4 h-4 text-amber-500"></i>
                    </div>
                    <div class="text-[11px] text-slate-400">3 Nights Stay Window</div>
                  </div>

                  <div class="glass-input-card p-3.5 rounded-2xl space-y-1 shadow-xs">
                    <div class="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-between">
                      <span>Rooms & Guests</span>
                      <span class="text-[10px] text-emerald-600 font-bold">Free Cancellation</span>
                    </div>
                    ${renderCustomDropdown({
                      id: 'landing-hotel-rooms',
                      name: 'hotel_rooms_guests',
                      selectedValue: '1 Room, 2 Adults',
                      options: [
                        { value: '1 Room, 2 Adults', icon: 'bed', title: '1 Room, 2 Adults', sub: 'Standard Couple Stay', selected: true },
                        { value: '1 Room, 2 Adults + 1 Child', icon: 'users', title: '1 Room, 2 Adults + 1 Child', sub: 'Family Suite' },
                        { value: '2 Rooms, 4 Adults', icon: 'building', title: '2 Rooms, 4 Adults', sub: 'Double Deluxe Stays' },
                        { value: 'Private Luxury Villa', icon: 'home', title: 'Private Luxury Villa', sub: 'Up to 8 Guests • Private Pool' }
                      ]
                    })}
                  </div>
                </div>

                <!-- Quick Destination Pills for Hotels -->
                <div class="glass-pill-container p-2.5 rounded-2xl flex flex-wrap items-center gap-1.5 text-xs">
                  <span class="text-[11px] font-bold text-slate-400 uppercase">Popular Stays:</span>
                  ${[
                    { name: 'Goa', full: 'Goa, India' },
                    { name: 'Jaipur', full: 'Jaipur, Rajasthan' },
                    { name: 'Kerala', full: 'Munnar & Alleppey, Kerala' },
                    { name: 'Manali', full: 'Manali, Himachal Pradesh' },
                    { name: 'Srinagar', full: 'Srinagar, Kashmir' },
                    { name: 'Udaipur', full: 'Udaipur, Rajasthan' },
                    { name: 'Varanasi', full: 'Varanasi, Uttar Pradesh' },
                    { name: 'Coorg', full: 'Coorg, Karnataka' },
                    { name: 'Ooty', full: 'Ooty, Tamil Nadu' },
                    { name: 'Rishikesh', full: 'Rishikesh, Uttarakhand' },
                    { name: 'Puri', full: 'Puri, Odisha' },
                    { name: 'Andaman', full: 'Havelock, Andaman' }
                  ].map(p => `
                    <button 
                      type="button" 
                      onclick="window.setHotelDestination('${p.full}')"
                      class="px-2.5 py-1 rounded-xl border ${hotelCity.includes(p.name) ? 'border-red-600 bg-red-500/10 text-red-600 font-black' : 'border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-700 dark:text-slate-300'} hover:border-red-500 text-[11px] transition backdrop-blur-sm">
                      ${p.name}
                    </button>
                  `).join('')}
                  <button 
                    type="button"
                    onclick="window.openPlacePicker({ type: 'hotels', targetInputId: 'hotel-city', title: 'Choose Indian Stay City / Resort' })"
                    class="px-3 py-1 rounded-xl border border-[#810B38] bg-red-500/10 text-[#810B38] dark:text-red-300 font-extrabold text-[11px] hover:bg-[#810B38] hover:text-white transition flex items-center space-x-1 shadow-sm backdrop-blur-sm ml-auto">
                    <i data-lucide="compass" class="w-3.5 h-3.5"></i>
                    <span>Explore All Indian Destinations</span>
                  </button>
                </div>

                <div class="pt-3 flex justify-center">
                  <button type="button" onclick="window.executeLandingSearch('hotels')" class="w-full sm:w-auto px-16 py-4 rounded-2xl bg-gradient-to-r from-[#ea2330] via-[#d91b28] to-[#880808] hover:from-[#d91b28] hover:to-[#5c0606] text-white font-black text-base shadow-xl shadow-red-600/30 transition flex items-center justify-center space-x-2">
                    <i data-lucide="building" class="w-5 h-5"></i>
                    <span>Search Verified Hotels in ${hotelCity.split(',')[0]}</span>
                  </button>
                </div>
              </div>
            ` : activeSearchTab === 'packages' ? `
              <!-- TAB 3: HOLIDAY PACKAGES -->
              <div class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div 
                    onclick="window.openPlacePicker({ type: 'packages', targetInputId: 'package-dest', title: 'Choose Holiday Tour Destination' })"
                    class="glass-input-card p-3.5 rounded-2xl space-y-1 hover:border-[#810B38] cursor-pointer transition group shadow-xs">
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span class="flex items-center space-x-1">
                        <i data-lucide="palmtree" class="w-3 h-3 text-[#810B38] dark:text-red-400"></i>
                        <span>Tour Destination</span>
                      </span>
                      <span class="text-red-600 font-bold text-[10px]">All-Inclusive</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <input type="text" id="package-dest" value="${packageDest}" readonly onchange="window.landingPackageDest = this.value; window.landingToCity = this.value;" class="w-full font-black text-sm sm:text-base text-slate-900 dark:text-white bg-transparent outline-none cursor-pointer" />
                      <i data-lucide="search" class="w-4 h-4 text-slate-400 group-hover:text-[#810B38] transition shrink-0 ml-1"></i>
                    </div>
                    <div class="text-[11px] text-slate-400">Curated Itinerary + Flight + Stays + Transfers</div>
                  </div>
                  <div class="glass-input-card p-3.5 rounded-2xl space-y-1 shadow-xs">
                    <div class="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-between">
                      <span>Duration</span>
                      <span class="text-[10px] text-teal-600 font-bold">Guide & Fleet Included</span>
                    </div>
                    ${renderCustomDropdown({
                      id: 'landing-pkg-duration',
                      name: 'package_duration',
                      selectedValue: '5 Days / 4 Nights',
                      options: [
                        { value: '3 Days / 2 Nights', icon: 'clock', title: '3 Days / 2 Nights', sub: 'Weekend Express Escape' },
                        { value: '4 Days / 3 Nights', icon: 'clock', title: '4 Days / 3 Nights', sub: 'Bestseller Getaway' },
                        { value: '5 Days / 4 Nights', icon: 'clock', title: '5 Days / 4 Nights', sub: 'Classic Exploration & Leisure', selected: true },
                        { value: '7 Days / 6 Nights', icon: 'clock', title: '7 Days / 6 Nights', sub: 'Grand Signature Discovery' },
                        { value: '10 Days / 9 Nights', icon: 'clock', title: '10 Days / 9 Nights', sub: 'Comprehensive Multi-District Expedition' }
                      ]
                    })}
                  </div>
                  <div class="glass-input-card p-3.5 rounded-2xl space-y-1 shadow-xs">
                    <div class="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-between">
                      <span>Travel Style</span>
                      <span class="text-[10px] text-red-600 font-bold">Certified Operator</span>
                    </div>
                    ${renderCustomDropdown({
                      id: 'landing-pkg-style',
                      name: 'package_style',
                      selectedValue: 'Beach, Water Sports & Sunsets',
                      options: [
                        { value: 'Beach, Water Sports & Sunsets', icon: 'palmtree', title: 'Beach, Water Sports & Sunsets', sub: 'Coastal & Marine Adventures', selected: true },
                        { value: 'Royal Forts, Palaces & Heritage', icon: 'shield', title: 'Royal Forts, Palaces & Heritage', sub: 'Palace Stays & Cultural Walks' },
                        { value: 'Himalayan Snow Peaks & Valleys', icon: 'mountain', title: 'Himalayan Snow Peaks & Valleys', sub: 'High-Altitude Scenic Trails' },
                        { value: 'Sacred River Ghats & Spiritual Temples', icon: 'sparkles', title: 'Sacred River Ghats & Temples', sub: 'Pilgrimage & Serenity' },
                        { value: 'Wildlife Safari & Nature Reserves', icon: 'compass', title: 'Wildlife Safari & Nature Reserves', sub: 'National Parks & Jungle Lodges' },
                        { value: 'Emerald Tea Estates & Houseboats', icon: 'coffee', title: 'Emerald Tea Estates & Houseboats', sub: 'Plantation Retreats' }
                      ]
                    })}
                  </div>
                </div>

                <!-- Quick Package Destination Pills -->
                <div class="glass-pill-container p-2.5 rounded-2xl flex flex-wrap items-center gap-1.5 text-xs">
                  <span class="text-[11px] font-bold text-slate-400 uppercase">Popular Packages:</span>
                  ${[
                    { name: 'Goa Coastal', full: 'Goa Coastal & Heritage' },
                    { name: 'Jaipur Forts', full: 'Jaipur Royal Palaces' },
                    { name: 'Kerala Backwaters', full: 'Kerala Backwaters & Tea Gardens' },
                    { name: 'Manali Snow Valley', full: 'Manali Himalayan Solang' },
                    { name: 'Kashmir Shikara', full: 'Kashmir Valley & Gulmarg' },
                    { name: 'Varanasi Aarti', full: 'Varanasi Ghats & Sarnath' },
                    { name: 'Leh Monasteries', full: 'Leh Ladakh High Passes' },
                    { name: 'Andaman Coral', full: 'Andaman Havelock Scuba Trail' },
                    { name: 'Puri Heritage', full: 'Puri & Konark Temple Circuit' }
                  ].map(p => `
                    <button 
                      type="button" 
                      onclick="window.setPackageDestination('${p.full}')"
                      class="px-2.5 py-1 rounded-xl border ${packageDest.includes(p.name) ? 'border-red-600 bg-red-500/10 text-red-600 font-black' : 'border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-700 dark:text-slate-300'} hover:border-red-500 text-[11px] transition backdrop-blur-sm">
                      ${p.name}
                    </button>
                  `).join('')}
                  <button 
                    type="button"
                    onclick="window.openPlacePicker({ type: 'packages', targetInputId: 'package-dest', title: 'Choose From All Holiday Destinations' })"
                    class="px-3 py-1 rounded-xl border border-[#810B38] bg-red-500/10 text-[#810B38] dark:text-red-300 font-extrabold text-[11px] hover:bg-[#810B38] hover:text-white transition flex items-center space-x-1 shadow-sm backdrop-blur-sm ml-auto">
                    <i data-lucide="compass" class="w-3.5 h-3.5"></i>
                    <span>All Indian Packages</span>
                  </button>
                </div>

                <div class="pt-3 flex justify-center">
                  <button type="button" onclick="window.executeLandingSearch('packages')" class="w-full sm:w-auto px-16 py-4 rounded-2xl bg-gradient-to-r from-[#ea2330] via-[#d91b28] to-[#880808] hover:from-[#d91b28] hover:to-[#5c0606] text-white font-black text-base shadow-xl shadow-red-600/30 transition flex items-center justify-center space-x-2">
                    <i data-lucide="palmtree" class="w-5 h-5"></i>
                    <span>Explore Packages for ${packageDest}</span>
                  </button>
                </div>
              </div>
            ` : activeSearchTab === 'buses_cabs' ? `
              <!-- TAB 4: BUSES & CABS -->
              <div class="space-y-4">
                <div class="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <!-- Pick-up City -->
                  <div 
                    onclick="window.openPlacePicker({ type: 'buses', targetInputId: 'cab-pickup', title: 'Pick-up City: Select Bus / Cab Terminal' })"
                    class="glass-input-card p-3.5 rounded-2xl space-y-1 hover:border-[#810B38] cursor-pointer transition group shadow-xs">
                    <div class="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1">
                      <i data-lucide="map-pin" class="w-3 h-3 text-[#810B38]"></i>
                      <span>Pick-up City</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <input type="text" id="cab-pickup" value="${cabPickup}" readonly onchange="window.landingCabPickup = this.value;" class="w-full font-black text-sm sm:text-base text-slate-900 dark:text-white bg-transparent outline-none cursor-pointer" />
                      <i data-lucide="search" class="w-4 h-4 text-slate-400 group-hover:text-[#810B38] transition shrink-0 ml-1"></i>
                    </div>
                    <div class="text-[11px] text-slate-400">Doorstep & Bus Stand Pickup</div>
                  </div>

                  <!-- Swap Button -->
                  <div class="hidden sm:flex absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <button 
                      type="button" 
                      onclick="window.swapCabCities()" 
                      class="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-600 shadow-md flex items-center justify-center transition hover:rotate-180">
                      <i data-lucide="arrow-left-right" class="w-4 h-4"></i>
                    </button>
                  </div>

                  <!-- Drop Destination -->
                  <div 
                    onclick="window.openPlacePicker({ type: 'buses', targetInputId: 'cab-drop', title: 'Drop Destination: Select City / Terminal' })"
                    class="glass-input-card p-3.5 rounded-2xl space-y-1 hover:border-[#810B38] cursor-pointer transition group shadow-xs">
                    <div class="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1">
                      <i data-lucide="navigation" class="w-3 h-3 text-emerald-500"></i>
                      <span>Drop Destination</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <input type="text" id="cab-drop" value="${cabDrop}" readonly onchange="window.landingCabDrop = this.value; window.landingToCity = this.value;" class="w-full font-black text-sm sm:text-base text-slate-900 dark:text-white bg-transparent outline-none cursor-pointer" />
                      <i data-lucide="search" class="w-4 h-4 text-slate-400 group-hover:text-[#810B38] transition shrink-0 ml-1"></i>
                    </div>
                    <div class="text-[11px] text-slate-400">Highway & Interstate Volvo Terminal</div>
                  </div>

                  <!-- Travel Date -->
                  <div 
                    onclick="window.openBusCabCalendarPicker()"
                    class="travora-date-trigger glass-input-card p-3.5 rounded-2xl space-y-1 hover:border-[#810B38] cursor-pointer transition group shadow-xs">
                    <div class="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1">
                      <i data-lucide="calendar" class="w-3 h-3 text-amber-500"></i>
                      <span>Travel Date</span>
                    </div>
                    <div class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between">
                      <span>${new Date((window.landingDepDate || '2026-10-28') + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                      <i data-lucide="calendar-days" class="w-4 h-4 text-amber-500"></i>
                    </div>
                    <div class="text-[11px] text-slate-400">GPS Monitored Fleet</div>
                  </div>

                  <div class="glass-input-card p-3.5 rounded-2xl space-y-1 shadow-xs">
                    <div class="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-between">
                      <span>Vehicle Type</span>
                      <span class="text-[10px] text-emerald-600 font-bold">Sanitized Fleet</span>
                    </div>
                    ${renderCustomDropdown({
                      id: 'landing-cab-vehicle',
                      name: 'vehicle_type',
                      selectedValue: 'Volvo Multi-Axle AC Sleeper',
                      options: [
                        { value: 'Volvo Multi-Axle AC Sleeper', icon: 'bus', title: 'Volvo Multi-Axle AC Sleeper', sub: '2+1 Luxury Coach', selected: true },
                        { value: 'Toyota Innova Crysta', icon: 'car', title: 'Toyota Innova Crysta', sub: '6 Seater Chauffeur Driven' },
                        { value: 'Prime Sedan Chauffeur', icon: 'car', title: 'Prime Sedan Chauffeur', sub: '4 Seater AC Sedan' },
                        { value: 'Luxury Tempo Traveller', icon: 'truck', title: 'Luxury Tempo Traveller', sub: '12 Seater Executive' },
                        { value: 'Premium EV SUV', icon: 'zap', title: 'Premium EV SUV', sub: 'Eco Clean Chauffeur' }
                      ]
                    })}
                  </div>
                </div>

                <!-- Quick Route Pills for Cabs & Buses -->
                <div class="glass-pill-container p-2.5 rounded-2xl flex flex-wrap items-center gap-1.5 text-xs">
                  <span class="text-[11px] font-bold text-slate-400 uppercase">Popular Routes:</span>
                  ${[
                    { from: 'Mumbai', to: 'Goa', label: 'Mumbai → Goa' },
                    { from: 'Delhi', to: 'Manali', label: 'Delhi → Manali' },
                    { from: 'Delhi', to: 'Rishikesh', label: 'Delhi → Rishikesh' },
                    { from: 'Delhi', to: 'Jaipur', label: 'Delhi → Jaipur' },
                    { from: 'Bengaluru', to: 'Coorg', label: 'Bengaluru → Coorg' },
                    { from: 'Bengaluru', to: 'Ooty', label: 'Bengaluru → Ooty' },
                    { from: 'Chennai', to: 'Pondicherry', label: 'Chennai → Pondicherry' },
                    { from: 'Mumbai', to: 'Pune', label: 'Mumbai → Pune' },
                    { from: 'Kolkata', to: 'Digha', label: 'Kolkata → Digha' },
                    { from: 'Chandigarh', to: 'Shimla', label: 'Chandigarh → Shimla' }
                  ].map(r => `
                    <button 
                      type="button" 
                      onclick="window.setCabRoute('${r.from}', '${r.to}')"
                      class="px-2.5 py-1 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:border-red-500 text-[11px] transition backdrop-blur-sm">
                      ${r.label}
                    </button>
                  `).join('')}
                  <button 
                    type="button"
                    onclick="window.openPlacePicker({ type: 'buses', targetInputId: 'cab-drop', title: 'Choose From 40+ Bus Terminals Across India' })"
                    class="px-3 py-1 rounded-xl border border-[#810B38] bg-red-500/10 text-[#810B38] dark:text-red-300 font-extrabold text-[11px] hover:bg-[#810B38] hover:text-white transition flex items-center space-x-1 shadow-sm backdrop-blur-sm ml-auto">
                    <i data-lucide="compass" class="w-3.5 h-3.5"></i>
                    <span>All Bus Hubs</span>
                  </button>
                </div>

                <div class="pt-3 flex justify-center">
                  <button type="button" onclick="window.executeLandingSearch('buses_cabs')" class="w-full sm:w-auto px-16 py-4 rounded-2xl bg-gradient-to-r from-[#ea2330] via-[#d91b28] to-[#880808] hover:from-[#d91b28] hover:to-[#5c0606] text-white font-black text-base shadow-xl shadow-red-600/30 transition flex items-center justify-center space-x-2">
                    <i data-lucide="bus" class="w-5 h-5"></i>
                    <span>Find Buses & Cabs to ${cabDrop.split(' ')[0]}</span>
                  </button>
                </div>
              </div>
            ` : `
              <!-- TAB 5: TRAINS -->
              <div class="space-y-4">
                <div class="relative grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <!-- From Station -->
                  <div 
                    onclick="window.openPlacePicker({ type: 'trains', targetInputId: 'train-from', title: 'Origin: Select IRCTC Railway Station' })"
                    class="glass-input-card p-3.5 rounded-2xl space-y-1 hover:border-[#810B38] cursor-pointer transition group shadow-xs">
                    <div class="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1">
                      <i data-lucide="train" class="w-3 h-3 text-[#810B38]"></i>
                      <span>From Station</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <input type="text" id="train-from" value="${trainFrom}" readonly onchange="window.landingTrainFrom = this.value;" class="w-full font-black text-sm sm:text-base text-slate-900 dark:text-white bg-transparent outline-none cursor-pointer" />
                      <i data-lucide="search" class="w-4 h-4 text-slate-400 group-hover:text-[#810B38] transition shrink-0 ml-1"></i>
                    </div>
                    <div class="text-[11px] text-slate-400">IRCTC Station Code Hub</div>
                  </div>

                  <!-- Swap Button -->
                  <div class="hidden sm:flex absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <button 
                      type="button" 
                      onclick="window.swapTrainStations()" 
                      class="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-600 shadow-md flex items-center justify-center transition hover:rotate-180">
                      <i data-lucide="arrow-left-right" class="w-4 h-4"></i>
                    </button>
                  </div>

                  <!-- To Station -->
                  <div 
                    onclick="window.openPlacePicker({ type: 'trains', targetInputId: 'train-to', title: 'Destination: Select IRCTC Railway Station' })"
                    class="glass-input-card p-3.5 rounded-2xl space-y-1 hover:border-[#810B38] cursor-pointer transition group shadow-xs">
                    <div class="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1">
                      <i data-lucide="train" class="w-3 h-3 text-emerald-500"></i>
                      <span>To Station</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <input type="text" id="train-to" value="${trainTo}" readonly onchange="window.landingTrainTo = this.value; window.landingToCity = this.value;" class="w-full font-black text-sm sm:text-base text-slate-900 dark:text-white bg-transparent outline-none cursor-pointer" />
                      <i data-lucide="search" class="w-4 h-4 text-slate-400 group-hover:text-[#810B38] transition shrink-0 ml-1"></i>
                    </div>
                    <div class="text-[11px] text-slate-400">Destination Terminus</div>
                  </div>

                  <div class="glass-input-card p-3.5 rounded-2xl space-y-1 shadow-xs">
                    <div class="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-between">
                      <span>Class & Quota</span>
                      <span class="text-[10px] text-emerald-600 font-bold">Confirmed Berths</span>
                    </div>
                    ${renderCustomDropdown({
                      id: 'landing-train-class',
                      name: 'train_class',
                      selectedValue: 'AC 2 Tier (2A)',
                      options: [
                        { value: 'Vande Bharat Express', icon: 'train', title: 'Vande Bharat Express', sub: 'Executive EC / Chair Car' },
                        { value: 'AC 2 Tier (2A)', icon: 'armchair', title: 'AC 2 Tier (2A)', sub: 'Confirmed Berths', selected: true },
                        { value: 'AC 3 Tier (3A)', icon: 'armchair', title: 'AC 3 Tier (3A)', sub: 'Deluxe Family' },
                        { value: 'AC Chair Car (CC)', icon: 'armchair', title: 'AC Chair Car (CC)', sub: 'Superfast Day Express' },
                        { value: 'First AC (1A)', icon: 'crown', title: 'First AC (1A)', sub: 'Coupe Cabin' }
                      ]
                    })}
                  </div>
                </div>

                <!-- Quick Rail Route Pills -->
                <div class="glass-pill-container p-2.5 rounded-2xl flex flex-wrap items-center gap-1.5 text-xs">
                  <span class="text-[11px] font-bold text-slate-400 uppercase">Popular Trains:</span>
                  ${[
                    { from: 'New Delhi (NDLS)', to: 'Madgaon Goa (MAO)', label: 'Delhi ⇄ Goa' },
                    { from: 'Mumbai CST (CSMT)', to: 'Madgaon Goa (MAO)', label: 'Mumbai ⇄ Goa' },
                    { from: 'New Delhi (NDLS)', to: 'Varanasi Junction (BSB)', label: 'Delhi ⇄ Varanasi' },
                    { from: 'New Delhi (NDLS)', to: 'Jaipur Junction (JP)', label: 'Delhi ⇄ Jaipur' },
                    { from: 'Howrah Junction (HWH)', to: 'Puri (PURI)', label: 'Kolkata ⇄ Puri' },
                    { from: 'Chennai Central (MAS)', to: 'KSR Bengaluru (SBC)', label: 'Chennai ⇄ Bengaluru' },
                    { from: 'New Delhi (NDLS)', to: 'Shri Mata Vaishno Devi (SVDK)', label: 'Delhi ⇄ Katra' },
                    { from: 'Mumbai Central (MMCT)', to: 'Ahmedabad (ADI)', label: 'Mumbai ⇄ Ahmedabad' }
                  ].map(r => `
                    <button 
                      type="button" 
                      onclick="window.setTrainRoute('${r.from}', '${r.to}')"
                      class="px-2.5 py-1 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:border-red-500 text-[11px] transition backdrop-blur-sm">
                      ${r.label}
                    </button>
                  `).join('')}
                  <button 
                    type="button" 
                    onclick="window.openPlacePicker({ type: 'trains', targetInputId: 'train-to', title: 'Choose From 40+ Major IRCTC Stations Across India' })"
                    class="px-3 py-1 rounded-xl border border-[#810B38] bg-red-500/10 text-[#810B38] dark:text-red-300 font-extrabold text-[11px] hover:bg-[#810B38] hover:text-white transition flex items-center space-x-1 shadow-sm backdrop-blur-sm ml-auto">
                    <i data-lucide="compass" class="w-3.5 h-3.5"></i>
                    <span>All IRCTC Stations</span>
                  </button>
                </div>

                <div class="pt-3 flex justify-center">
                  <button type="button" onclick="window.executeLandingSearch('trains')" class="w-full sm:w-auto px-16 py-4 rounded-2xl bg-gradient-to-r from-[#ea2330] via-[#d91b28] to-[#880808] hover:from-[#d91b28] hover:to-[#5c0606] text-white font-black text-base shadow-xl shadow-red-600/30 transition flex items-center justify-center space-x-2">
                    <i data-lucide="train" class="w-5 h-5"></i>
                    <span>Check Live Trains to ${trainTo.split(' ')[0]}</span>
                  </button>
                </div>
              </div>
            `}

          </div>

        </div>
      </section>

      <!-- ===================================================================
           NEW VISUAL FEATURE: TOP 8 INDIAN DREAM DESTINATIONS (HIGH-RES CARDS)
           =================================================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div class="flex items-end justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div class="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center space-x-1.5">
              <i data-lucide="map-pin" class="w-4 h-4"></i>
              <span>Trending Across India</span>
            </div>
            <h2 class="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Top Indian Dream Destinations
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Hand-verified flight & resort rates with live weather telemetry and instant 1-click booking.
            </p>
          </div>
          <button 
            type="button" 
            onclick="window.executeLandingSearch('flights')" 
            class="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center space-x-1">
            <span>Explore All 28 States</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${topDestinations.map(dest => `
            <div 
              onclick="window.selectDestinationCard('${dest.name}', '${dest.cityFull}')"
              class="group surface-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-red-500/80 shadow-xl flex flex-col justify-between cursor-pointer transition transform hover:-translate-y-1.5 duration-300">
              
              <!-- Card Photo Header -->
              <div class="relative h-56 w-full overflow-hidden bg-slate-900">
                <img 
                  src="${dest.img}" 
                  alt="${dest.name} - ${dest.tagline}" 
                  class="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                  loading="lazy"
                />
                
                <!-- Dark Red Vignette Gradient -->
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
                
                <!-- Category Tag Badge -->
                <div class="absolute top-3 left-3">
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#ea2330] to-[#880808] text-white shadow-md">
                    ${dest.tag}
                  </span>
                </div>

                <!-- Weather Pill -->
                <div class="absolute top-3 right-3">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-amber-300 border border-white/10 flex items-center space-x-1">
                    <i data-lucide="${dest.weatherIcon}" class="w-3 h-3 text-amber-400"></i>
                    <span>${dest.weather}</span>
                  </span>
                </div>

                <!-- City & Tagline on Image -->
                <div class="absolute bottom-3 left-3 right-3 text-white">
                  <h3 class="font-black text-xl tracking-tight leading-tight">${dest.name}</h3>
                  <p class="text-[11px] text-slate-200 truncate mt-0.5">${dest.tagline}</p>
                </div>
              </div>

              <!-- Card Bottom Details -->
              <div class="p-4 space-y-3 bg-white dark:bg-slate-900 flex-1 flex flex-col justify-between">
                
                <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span class="flex items-center space-x-1 font-semibold">
                    <i data-lucide="hotel" class="w-3.5 h-3.5 text-red-600"></i>
                    <span>${dest.hotelsCount}</span>
                  </span>
                  <span class="text-[11px] text-emerald-600 font-bold flex items-center space-x-1">
                    <i data-lucide="check" class="w-3 h-3"></i>
                    <span>Verified Routes</span>
                  </span>
                </div>

                <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span class="text-[10px] text-slate-400 block font-semibold">Flights starting from</span>
                    <span class="text-lg font-black text-red-600 dark:text-red-400">
                      ₹${dest.fare.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <span class="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/60 group-hover:bg-red-600 group-hover:text-white text-red-600 dark:text-red-300 font-extrabold text-xs transition border border-red-200 dark:border-red-900/50 flex items-center space-x-1 shadow-sm">
                    <span>Explore</span>
                    <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                  </span>
                </div>

              </div>

            </div>
          `).join('')}
        </div>

      </section>

      <!-- ===================================================================
           NEW VISUAL FEATURE: EXPLORE INDIA BY THEME (PHOTO TILES)
           =================================================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        <div class="flex items-end justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div class="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center space-x-1.5">
              <i data-lucide="compass" class="w-4 h-4"></i>
              <span>Curated Travel Experiences</span>
            </div>
            <h2 class="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Explore India by Vibe & Theme
            </h2>
          </div>
          <span class="text-xs text-slate-500 hidden sm:inline">8 Specialized Holiday Vibe Categories</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          ${travelThemes.map(theme => `
            <div 
              onclick="window.setQuickDestination('${theme.dest}')"
              class="relative rounded-2xl h-44 overflow-hidden group cursor-pointer border border-slate-200 dark:border-slate-800 shadow-lg">
              <img 
                src="${theme.img}" 
                alt="${theme.title}" 
                class="w-full h-full object-cover group-hover:scale-115 transition duration-700 brightness-[0.75] group-hover:brightness-[0.9]"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[#260406]/95 via-[#5c0606]/40 to-transparent"></div>
              
              <div class="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                <span class="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[9px] uppercase tracking-wider inline-block">
                  ${theme.count}
                </span>
                <h4 class="font-extrabold text-sm sm:text-base leading-tight group-hover:text-red-300 transition">
                  ${theme.title}
                </h4>
              </div>
            </div>
          `).join('')}
        </div>

      </section>

      <!-- ===================================================================
           LIVE INTERACTIVE FLIGHT SEARCH RESULTS (YATRA REAL TIME ENGINE)
           =================================================================== -->
      ${(isSearchActive || activeSearchTab) ? `
        <section id="search-results-section" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          ${resultsCategory === 'hotels' ? `
            <!-- HOTELS SEARCH RESULTS -->
            <div class="surface-card rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div class="flex items-center space-x-2 text-xs font-bold text-red-600 dark:text-red-400">
                    <i data-lucide="building" class="w-4 h-4 text-emerald-500"></i>
                    <span>${liveHotelResults.length} Verified Luxury & Boutique Stays in ${targetPlace}</span>
                  </div>
                  <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                    Check-in: Wed, 28 Oct 2026 • 3 Nights • 2 Guests • Free Breakfast & WiFi
                  </h3>
                </div>
                <div class="flex items-center space-x-2 text-xs">
                  <span class="text-slate-400 font-semibold">Filter:</span>
                  <span class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ea2330] to-[#880808] text-white font-extrabold shadow-sm">
                    All Verified Stays
                  </span>
                  <span class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                    Beachfront & Palaces
                  </span>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              ${liveHotelResults.map(hotel => `
                <div class="surface-card rounded-3xl p-4 sm:p-5 flex flex-col lg:flex-row items-center justify-between gap-5 border border-slate-200 dark:border-slate-800 hover:border-red-500/60 shadow-lg hover:shadow-xl transition">
                  <div class="w-full lg:w-64 h-48 rounded-2xl overflow-hidden shrink-0 relative bg-slate-900">
                    <img src="${hotel.image}" alt="${hotel.name}" onerror="this.onerror=null; this.src='/static/assets/destinations/goa_beach_sunset.jpg';" class="w-full h-full object-cover hover:scale-105 transition duration-500" />
                    <span class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-[#ea2330] to-[#880808] text-white shadow">
                      ${hotel.tag}
                    </span>
                  </div>
                  <div class="flex-1 space-y-2">
                    <div class="flex items-center space-x-2">
                      <div class="flex text-amber-400">
                        ${[...Array(5)].map(() => '<i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i>').join('')}
                      </div>
                      <span class="text-xs font-bold text-slate-700 dark:text-slate-300">${hotel.rating} / 5.0</span>
                      <span class="text-[11px] text-slate-400">(${hotel.reviewsCount})</span>
                    </div>
                    <h4 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">${hotel.name}</h4>
                    <p class="text-xs text-slate-500 flex items-center space-x-1">
                      <i data-lucide="map-pin" class="w-3.5 h-3.5 text-red-500"></i>
                      <span>${hotel.location}</span>
                    </p>
                    <div class="text-xs font-bold text-slate-700 dark:text-slate-200 pt-1">
                      Room: <span class="text-red-600 dark:text-red-400">${hotel.roomType}</span>
                    </div>
                    <div class="flex flex-wrap gap-1.5 pt-1">
                      ${hotel.amenities.map(am => `
                        <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                          ✓ ${am}
                        </span>
                      `).join('')}
                    </div>
                  </div>
                  <div class="w-full lg:w-48 text-right flex flex-col justify-between space-y-3 lg:border-l lg:border-slate-100 lg:dark:border-slate-800 lg:pl-5">
                    <div>
                      <span class="text-[11px] text-slate-400 block">Per Night Rate</span>
                      <div class="flex items-baseline justify-end space-x-1.5">
                        <span class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">₹${hotel.price.toLocaleString('en-IN')}</span>
                        <span class="text-xs text-slate-400 line-through">₹${hotel.originalPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <span class="text-[10px] font-bold text-emerald-600 block mt-0.5">${hotel.discount} • Free Cancellation</span>
                    </div>
                    <button 
                      type="button" 
                      onclick="window.bookHotelDirectly('${hotel.name}', ${hotel.price}, '${hotel.roomType}')"
                      class="w-full py-3 rounded-xl bg-gradient-to-r from-[#ea2330] to-[#880808] hover:from-[#d91b28] hover:to-[#5c0606] text-white font-black text-xs shadow-md shadow-red-600/30 transition flex items-center justify-center space-x-1.5">
                      <span>Book Stay</span>
                      <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : resultsCategory === 'packages' ? `
            <!-- HOLIDAY PACKAGES SEARCH RESULTS -->
            <div class="surface-card rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div class="flex items-center space-x-2 text-xs font-bold text-red-600 dark:text-red-400">
                    <i data-lucide="palmtree" class="w-4 h-4 text-emerald-500"></i>
                    <span>${livePackageResults.length} Curated Holiday Packages for ${targetPlace}</span>
                  </div>
                  <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                    All-Inclusive • Verified Tour Operators • Dynamic Adaptation Active
                  </h3>
                </div>
                <div class="flex items-center space-x-2 text-xs">
                  <span class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ea2330] to-[#880808] text-white font-extrabold shadow-sm">
                    Guaranteed Departure
                  </span>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              ${livePackageResults.map(pkg => `
                <div class="surface-card rounded-3xl p-4 sm:p-5 flex flex-col lg:flex-row items-center justify-between gap-5 border border-slate-200 dark:border-slate-800 hover:border-red-500/60 shadow-lg hover:shadow-xl transition">
                  <div class="w-full lg:w-64 h-48 rounded-2xl overflow-hidden shrink-0 relative bg-slate-900">
                    <img src="${pkg.image}" alt="${pkg.title}" onerror="this.onerror=null; this.src='/static/assets/destinations/goa_beach_sunset.jpg';" class="w-full h-full object-cover hover:scale-105 transition duration-500" />
                    <span class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-[#ea2330] to-[#880808] text-white shadow">
                      ${pkg.tag}
                    </span>
                    <span class="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-black/70 text-white backdrop-blur-md">
                      ${pkg.duration}
                    </span>
                  </div>
                  <div class="flex-1 space-y-2">
                    <div class="flex items-center space-x-2 text-xs text-slate-500">
                      <span class="font-bold text-red-600">Operator: ${pkg.operator}</span>
                      <span>•</span>
                      <span class="flex items-center text-amber-400 font-bold">
                        <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 mr-1"></i> ${pkg.operatorRating}
                      </span>
                    </div>
                    <h4 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">${pkg.title}</h4>
                    <div class="space-y-1 pt-1">
                      <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Package Inclusions:</span>
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                        ${pkg.inclusions.map(inc => `<div>✓ ${inc}</div>`).join('')}
                      </div>
                    </div>
                  </div>
                  <div class="w-full lg:w-48 text-right flex flex-col justify-between space-y-3 lg:border-l lg:border-slate-100 lg:dark:border-slate-800 lg:pl-5">
                    <div>
                      <span class="text-[11px] text-slate-400 block">Total Package / Person</span>
                      <div class="flex items-baseline justify-end space-x-1.5">
                        <span class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">₹${pkg.price.toLocaleString('en-IN')}</span>
                        <span class="text-xs text-slate-400 line-through">₹${pkg.originalPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <span class="text-[10px] font-bold text-emerald-600 block mt-0.5">${pkg.discount} • Taxes Included</span>
                    </div>
                    <button 
                      type="button" 
                      onclick="window.bookPackageDirectly('${pkg.title}', ${pkg.price}, '${pkg.duration}')"
                      class="w-full py-3 rounded-xl bg-gradient-to-r from-[#ea2330] to-[#880808] hover:from-[#d91b28] hover:to-[#5c0606] text-white font-black text-xs shadow-md shadow-red-600/30 transition flex items-center justify-center space-x-1.5">
                      <span>Book Package</span>
                      <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : resultsCategory === 'buses_cabs' ? `
            <!-- BUSES & CABS SEARCH RESULTS -->
            <div class="surface-card rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div class="flex items-center space-x-2 text-xs font-bold text-red-600 dark:text-red-400">
                    <i data-lucide="bus" class="w-4 h-4 text-emerald-500"></i>
                    <span>${liveBusCabResults.length} Available Cabs & Luxury Coaches • ${cabPickup} ➔ ${cabDrop}</span>
                  </div>
                  <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                    Live GPS Monitored • Verified Chauffeurs & Sleeper Berths
                  </h3>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              ${liveBusCabResults.map(cab => `
                <div class="surface-card rounded-3xl p-4 sm:p-5 flex flex-col lg:flex-row items-center justify-between gap-5 border border-slate-200 dark:border-slate-800 hover:border-red-500/60 shadow-lg hover:shadow-xl transition">
                  <div class="flex items-center space-x-4 w-full lg:w-56">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ea2330] to-[#880808] text-white flex items-center justify-center shadow-md shrink-0">
                      <i data-lucide="${cab.category === 'Private Cab' ? 'car' : 'bus'}" class="w-6 h-6"></i>
                    </div>
                    <div>
                      <span class="text-[10px] font-black uppercase text-red-600">${cab.category}</span>
                      <h4 class="text-base font-black text-slate-900 dark:text-white leading-tight">${cab.title}</h4>
                      <span class="text-xs text-slate-500 font-semibold">${cab.operator} • ★ ${cab.rating}</span>
                    </div>
                  </div>
                  <div class="flex-1 flex items-center justify-between sm:justify-around text-center w-full px-4">
                    <div>
                      <span class="text-[10px] text-slate-400 block font-bold">Pickup Time</span>
                      <span class="text-base font-black text-slate-900 dark:text-white">${cab.depTime}</span>
                      <span class="text-[11px] text-slate-500 block truncate max-w-[120px]">${cab.from}</span>
                    </div>
                    <div class="flex flex-col items-center px-2">
                      <span class="text-[10px] text-slate-400 font-bold">${cab.duration}</span>
                      <div class="w-20 sm:w-28 h-[2px] bg-slate-200 dark:bg-slate-700 relative my-1">
                        <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-600"></div>
                      </div>
                      <span class="text-[10px] text-emerald-600 font-bold">${cab.seatsLeft}</span>
                    </div>
                    <div>
                      <span class="text-[10px] text-slate-400 block font-bold">Drop Time</span>
                      <span class="text-base font-black text-slate-900 dark:text-white">${cab.arrTime}</span>
                      <span class="text-[11px] text-slate-500 block truncate max-w-[120px]">${cab.to}</span>
                    </div>
                  </div>
                  <div class="w-full lg:w-44 text-right flex flex-col justify-between space-y-3 lg:border-l lg:border-slate-100 lg:dark:border-slate-800 lg:pl-5">
                    <div>
                      <span class="text-[11px] text-slate-400 block">Total Fare</span>
                      <span class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">₹${cab.price.toLocaleString('en-IN')}</span>
                      <span class="text-[10px] text-emerald-600 block mt-0.5">Tolls & Taxes Included</span>
                    </div>
                    <button 
                      type="button" 
                      onclick="window.bookBusCabDirectly('${cab.title}', ${cab.price}, '${cab.from}', '${cab.to}')"
                      class="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ea2330] to-[#880808] hover:from-[#d91b28] hover:to-[#5c0606] text-white font-black text-xs shadow-md shadow-red-600/30 transition flex items-center justify-center space-x-1.5">
                      <span>Book Transit</span>
                      <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : resultsCategory === 'trains' ? `
            <!-- TRAIN SEARCH RESULTS -->
            <div class="surface-card rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div class="flex items-center space-x-2 text-xs font-bold text-red-600 dark:text-red-400">
                    <i data-lucide="train" class="w-4 h-4 text-emerald-500"></i>
                    <span>${liveTrainResults.length} Superfast Trains Found • ${trainFrom} ➔ ${trainTo}</span>
                  </div>
                  <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                    IRCTC Authorized Live Berth Confirmation Engine
                  </h3>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              ${liveTrainResults.map(train => `
                <div class="surface-card rounded-3xl p-4 sm:p-5 flex flex-col lg:flex-row items-center justify-between gap-5 border border-slate-200 dark:border-slate-800 hover:border-red-500/60 shadow-lg hover:shadow-xl transition">
                  <div class="w-full lg:w-56 space-y-1">
                    <div class="flex items-center space-x-2">
                      <span class="px-2 py-0.5 rounded font-mono font-black text-xs bg-red-600 text-white">${train.trainNumber}</span>
                      <span class="text-[10px] text-slate-400 font-bold">${train.runsOn}</span>
                    </div>
                    <h4 class="text-base font-black text-slate-900 dark:text-white leading-tight">${train.trainName}</h4>
                    <span class="text-xs text-slate-500 font-semibold">${train.from} ➔ ${train.to}</span>
                  </div>
                  <div class="flex-1 flex items-center justify-between sm:justify-around text-center w-full px-4">
                    <div>
                      <span class="text-[10px] text-slate-400 block font-bold">Departure</span>
                      <span class="text-base font-black text-slate-900 dark:text-white">${train.depTime}</span>
                    </div>
                    <div class="flex flex-col items-center px-2">
                      <span class="text-[10px] text-slate-400 font-bold">${train.duration}</span>
                      <div class="w-20 sm:w-28 h-[2px] bg-slate-200 dark:bg-slate-700 relative my-1">
                        <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-600"></div>
                      </div>
                      <span class="text-[10px] text-emerald-600 font-bold">Superfast</span>
                    </div>
                    <div>
                      <span class="text-[10px] text-slate-400 block font-bold">Arrival</span>
                      <span class="text-base font-black text-slate-900 dark:text-white">${train.arrTime}</span>
                    </div>
                  </div>
                  <div class="w-full lg:w-56 flex flex-col space-y-2 lg:border-l lg:border-slate-100 lg:dark:border-slate-800 lg:pl-5">
                    ${train.classes.map(cls => `
                      <div class="flex items-center justify-between p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
                        <div>
                          <span class="font-bold text-slate-900 dark:text-white block">${cls.name}</span>
                          <span class="text-[10px] text-emerald-600 font-bold">${cls.status}</span>
                        </div>
                        <div class="text-right">
                          <span class="font-black text-slate-900 dark:text-white">₹${cls.price}</span>
                          <button 
                            type="button" 
                            onclick="window.bookTrainDirectly('${train.trainNumber}', '${train.trainName}', ${cls.price}, '${cls.name}')"
                            class="mt-1 px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] block transition">
                            Book
                          </button>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <!-- FLIGHT SEARCH RESULTS -->
            <div class="surface-card rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div class="flex items-center space-x-2 text-xs font-bold text-red-600 dark:text-red-400">
                    <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-500"></i>
                    <span>${liveFlightResults.length} Verified Flights Found • ${fromCity} ➔ ${toCity}</span>
                  </div>
                  <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                    Departing ${new Date((window.landingDepDate || '2026-10-28') + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} • ${totalTravellers} Traveller${totalTravellers > 1 ? 's' : ''} (${adults} Adult${adults > 1 ? 's' : ''}${children ? `, ${children} Child` : ''}${infants ? `, ${infants} Infant` : ''}) • ${cabinClass}
                  </h3>
                </div>

                <!-- Quick Fare Sort / Filters -->
                <div class="flex items-center space-x-2 text-xs">
                  <span class="text-slate-400 font-semibold">Sort By:</span>
                  <button 
                    onclick="window.executeLandingSearch('flights')" 
                    class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ea2330] to-[#880808] text-white font-extrabold shadow-sm">
                    Cheapest First (₹${(liveFlightResults[0] ? liveFlightResults[0].price : 3590).toLocaleString('en-IN')})
                  </button>
                  <button onclick="window.sortFlightsByDuration()" class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400">
                    Fastest (${liveFlightResults[0] ? liveFlightResults[0].duration : '2h 10m'})
                  </button>
                </div>
              </div>

              <!-- 7-Day Dynamic Fare Slider Strip -->
              <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
                ${[-2, -1, 0, 1, 2, 3, 4].map(offset => {
                  const baseDt = new Date((window.landingDepDate || '2026-10-28') + 'T00:00:00');
                  const slotDate = new Date(baseDt.getTime() + offset * 86400000);
                  const isCurrent = offset === 0;
                  const dateStr = slotDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
                  const yyyy = slotDate.getFullYear();
                  const mm = String(slotDate.getMonth() + 1).padStart(2, '0');
                  const dd = String(slotDate.getDate()).padStart(2, '0');
                  const isoDateStr = `${yyyy}-${mm}-${dd}`;
                  const baseFare = liveFlightResults[0] ? liveFlightResults[0].price : 3590;
                  const slotFare = isCurrent ? baseFare : Math.round(baseFare * (1 + ((offset * 137) % 25 - 12) / 100));
                  const tag = isCurrent ? 'Selected' : (offset === 1 ? 'Cheapest' : '');
                  return `
                    <div 
                      onclick="window.selectDateFare('${isoDateStr}', ${slotFare})"
                      class="p-2.5 rounded-xl border cursor-pointer transition ${isCurrent ? 'bg-gradient-to-r from-[#ea2330] to-[#880808] text-white border-red-600 shadow-md font-black ring-2 ring-red-400' : 'border-slate-200 dark:border-slate-700 hover:border-red-500 surface-card text-slate-700 dark:text-slate-300'}">
                      <div class="text-[10px] ${isCurrent ? 'text-red-100' : 'text-slate-400'}">${dateStr}</div>
                      <div class="font-extrabold text-xs sm:text-sm mt-0.5">₹${slotFare.toLocaleString('en-IN')}</div>
                      ${tag ? `<span class="inline-block text-[9px] px-1.5 rounded ${isCurrent ? 'bg-white text-red-600 font-black' : 'bg-emerald-500/20 text-emerald-600 font-bold'} mt-0.5">${tag}</span>` : ''}
                    </div>
                  `;
                }).join('')}
              </div>

            </div>

            <!-- Flight Result Cards with Location-Specific Origin and Destination -->
            <div class="space-y-3">
              ${liveFlightResults.map(flight => `
                <div class="flight-card p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm hover:shadow-md transition">
                  
                  <!-- Airline Info -->
                  <div class="flex items-center space-x-3 sm:w-48">
                    <div class="w-10 h-10 rounded-xl ${flight.color} text-white font-black flex items-center justify-center text-xs shadow-md shrink-0">
                      ${flight.airlineLogo}
                    </div>
                    <div>
                      <h4 class="font-black text-sm text-slate-900 dark:text-white leading-tight">
                        ${flight.airline}
                      </h4>
                      <span class="text-[11px] font-mono text-slate-400">${flight.code} &bull; ${flight.aircraft.split(' ')[0]}</span>
                    </div>
                  </div>

                  <!-- Schedule Strip (Strictly Location Specific) -->
                  <div class="flex items-center justify-between sm:justify-center sm:space-x-8 flex-1">
                    
                    <!-- Departure -->
                    <div class="text-left sm:text-right">
                      <div class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">${flight.depTime}</div>
                      <div class="text-[11px] font-bold text-slate-500">${flight.fromCode} &bull; ${flight.fromCity}</div>
                    </div>

                    <!-- Flight Duration & Flight Track -->
                    <div class="flex flex-col items-center px-2 sm:px-4">
                      <span class="text-[10px] text-slate-400 font-bold">${flight.duration}</span>
                      <div class="w-24 sm:w-32 h-[2px] bg-slate-200 dark:bg-slate-700 relative my-1">
                        <div class="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-600"></div>
                      </div>
                      <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">${flight.stops}</span>
                    </div>

                    <!-- Arrival -->
                    <div class="text-right sm:text-left">
                      <div class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">${flight.arrTime}</div>
                      <div class="text-[11px] font-bold text-slate-500">${flight.toCode} &bull; ${flight.toCity}</div>
                    </div>

                  </div>

                  <!-- Baggage & Amenities Badges -->
                  <div class="hidden xl:flex flex-col text-left space-y-1 text-[11px] text-slate-500 w-48">
                    <span class="flex items-center space-x-1">
                      <i data-lucide="briefcase" class="w-3 h-3 text-slate-400"></i>
                      <span>${flight.baggage}</span>
                    </span>
                    <span class="text-emerald-600 dark:text-emerald-400 font-semibold">${flight.refundable}</span>
                    <span class="text-[10px] text-slate-400 truncate" title="${flight.terminal}">${flight.terminal}</span>
                  </div>

                  <!-- Pricing & Book Now CTA -->
                  <div class="flex items-center justify-between lg:justify-end lg:space-x-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                    <div class="text-left lg:text-right">
                      <div class="flex items-baseline space-x-1.5">
                        <span class="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
                          ₹${flight.price.toLocaleString('en-IN')}
                        </span>
                        <span class="text-xs text-slate-400 line-through">₹${flight.originalPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <span class="text-[10px] font-bold text-emerald-600 block leading-none mt-0.5">
                        ${flight.discount} • ₹0 Convenience Fee
                      </span>
                    </div>

                    <button 
                      type="button" 
                      onclick="window.bookFlightDirectly('${flight.code}', '${flight.airline}', ${flight.price}, '${flight.depTime}', '${flight.arrTime}')"
                      class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ea2330] to-[#880808] hover:from-[#d91b28] hover:to-[#5c0606] text-white font-black text-xs shadow-md shadow-red-600/30 transition flex items-center space-x-1.5 hover:-translate-y-0.5">
                      <span>Book Now</span>
                      <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>

                </div>
              `).join('')}
            </div>
          `}

        </section>
      ` : ''}

      <!-- ===================================================================
           POPULAR DOMESTIC FLIGHT ROUTES (YATRA ICONIC GRID)
           =================================================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        <div class="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div class="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center space-x-1.5">
              <i data-lucide="compass" class="w-4 h-4"></i>
              <span>Most Booked Flights</span>
            </div>
            <h2 class="text-lg sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              Popular Domestic Flight Routes
            </h2>
          </div>
          <span class="text-xs text-slate-500 hidden sm:inline">Tap any route to search lowest fare</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          ${popularRoutes.map(route => `
            <div 
              onclick="window.selectPopularRoute('${route.from}', '${route.to}')"
              class="yatra-route-pill surface-card rounded-2xl p-4 cursor-pointer shadow-sm flex items-center justify-between group">
              <div class="space-y-1">
                <div class="flex items-center space-x-1 text-xs font-black text-slate-900 dark:text-white group-hover:text-red-600 transition">
                  <span>${route.fromName}</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600"></i>
                  <span>${route.toName}</span>
                </div>
                <div class="text-[11px] text-slate-400 flex items-center space-x-1.5">
                  <span>${route.airline}</span>
                  <span class="opacity-40">•</span>
                  <span>${route.duration}</span>
                </div>
              </div>

              <div class="text-right">
                <span class="text-[10px] text-slate-400 block">Starting at</span>
                <span class="text-sm font-black text-red-600 dark:text-red-400">
                  ₹${route.fare.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          `).join('')}
        </div>

      </section>

      <!-- ===================================================================
           YATRA-STYLE SPECIAL BANK OFFERS & PROMO COUPONS
           =================================================================== -->
      <section id="yatra-offers-section" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        <div class="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div class="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center space-x-1.5">
              <i data-lucide="tag" class="w-4 h-4"></i>
              <span>Bank Discounts & Promo Codes</span>
            </div>
            <h2 class="text-lg sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              Exclusive Offers on Flights, Hotels & Tours
            </h2>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          ${promoOffers.map(offer => `
            <div class="yatra-coupon-card p-5 flex flex-col justify-between space-y-4 shadow-sm">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60">
                    ${offer.bank}
                  </span>
                  <i data-lucide="${offer.icon}" class="w-4 h-4 text-red-600"></i>
                </div>
                <h4 class="font-black text-base text-slate-900 dark:text-white">
                  ${offer.discount}
                </h4>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  ${offer.desc}
                </p>
              </div>

              <div class="pt-3 border-t border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div class="font-mono text-xs font-black tracking-wider text-slate-800 dark:text-slate-200 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 select-all">
                  ${offer.code}
                </div>
                <button 
                  type="button" 
                  onclick="window.copyPromoCode('${offer.code}')" 
                  class="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center space-x-1">
                  <span>Copy Code</span>
                  <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>

      </section>

      <!-- ===================================================================
           INDIA LUXURY HOTELS SPOTLIGHT (8 HIGH-RES PROPERTIES)
           =================================================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div class="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center space-x-1.5">
              <i data-lucide="hotel" class="w-4 h-4"></i>
              <span>TRAVORA Premier Collection</span>
            </div>
            <h2 class="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Top Rated Luxury Resorts & Heritage Palaces
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Hand-verified 5-star beachfront villas and royal palace suites with free cancellation.
            </p>
          </div>
          <button 
            type="button" 
            onclick="window.setLandingSearchTab('hotels')" 
            class="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center space-x-1">
            <span>View All Hotels</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${luxuryHotels.map(h => `
            <div class="surface-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between group hover:border-red-500 transition">
              <div>
                <div class="h-48 w-full relative overflow-hidden bg-slate-900">
                  <img 
                    src="${h.img}" 
                    alt="${h.name}" 
                    class="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                    loading="lazy"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  
                  <div class="absolute top-3 left-3">
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-black/60 backdrop-blur-md text-amber-300 border border-white/10">
                      ${h.tag}
                    </span>
                  </div>

                  <div class="absolute bottom-3 left-3 text-white">
                    <div class="font-extrabold text-base tracking-tight leading-snug">${h.name}</div>
                    <div class="text-[11px] text-slate-300 font-medium">${h.location}</div>
                  </div>
                </div>

                <div class="p-5 space-y-3 text-xs">
                  <div class="flex items-center justify-between text-slate-500 text-[11px]">
                    <span class="font-bold text-slate-800 dark:text-slate-200">${h.rating}/5 Rating</span>
                    <span>${h.reviews}</span>
                  </div>

                  <div class="flex flex-wrap gap-1">
                    ${h.amenities.map(a => `
                      <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                        ${a}
                      </span>
                    `).join('')}
                  </div>

                  <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span class="text-[10px] text-slate-400 block">Starting per night</span>
                      <span class="font-black text-base text-slate-900 dark:text-white">₹${h.price}</span>
                    </div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Free Cancellation
                    </span>
                  </div>
                </div>
              </div>

              <div class="p-5 pt-0">
                <button 
                  type="button" 
                  onclick="window.startPlanningFor('${h.location.split(',')[1] ? h.location.split(',')[1].trim() : 'Goa'}')" 
                  class="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-gradient-to-r hover:from-[#ea2330] hover:to-[#880808] hover:text-white text-slate-800 dark:text-slate-200 font-bold text-xs transition border border-slate-200 dark:border-slate-700 flex items-center justify-center space-x-1.5">
                  <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
                  <span>Reserve Stay</span>
                </button>
              </div>

            </div>
          `).join('')}
        </div>

      </section>

      <!-- ===================================================================
           HANDCRAFTED HOLIDAY PACKAGES (6 ALL-INCLUSIVE ITINERARIES)
           =================================================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div class="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center space-x-1.5">
              <i data-lucide="palmtree" class="w-4 h-4"></i>
              <span>Holiday Packages</span>
            </div>
            <h2 class="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Curated Indian Escapes with Flights & Operator Included
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified ground fleets and daily excursions backed by dynamic disruption adaptation.
            </p>
          </div>
          <button 
            type="button" 
            onclick="window.setLandingSearchTab('packages')" 
            class="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center space-x-1">
            <span>Explore All Packages</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${holidayPackages.map(pkg => `
            <div class="surface-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between group hover:border-red-500 transition">
              <div>
                <div class="h-52 w-full relative overflow-hidden bg-slate-900">
                  <img 
                    src="${pkg.img}" 
                    alt="${pkg.name}" 
                    class="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                    loading="lazy"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  
                  <div class="absolute top-3 left-3">
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-gradient-to-r from-[#ea2330] to-[#880808] text-white shadow-sm">
                      ${pkg.tag}
                    </span>
                  </div>

                  <div class="absolute bottom-3 left-3 right-3 text-white">
                    <div class="font-extrabold text-base tracking-tight leading-snug">${pkg.name}</div>
                    <div class="text-[11px] text-slate-300 font-medium">${pkg.duration}</div>
                  </div>
                </div>

                <div class="p-5 space-y-3 text-xs">
                  <div class="flex items-center justify-between text-slate-500 text-[11px]">
                    <span class="font-bold text-slate-800 dark:text-slate-200">${pkg.rating} Rating</span>
                    <span>${pkg.operator}</span>
                  </div>

                  <div class="space-y-1.5">
                    ${pkg.inclusions.slice(0, 3).map(inc => `
                      <div class="flex items-center space-x-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                        <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500 shrink-0"></i>
                        <span>${inc}</span>
                      </div>
                    `).join('')}
                  </div>

                  <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span class="text-[10px] text-slate-400 block font-semibold">Starting per person</span>
                      <span class="font-black text-lg text-red-600 dark:text-red-400">₹${pkg.price.toLocaleString('en-IN')}</span>
                    </div>
                    <span class="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Flights Included
                    </span>
                  </div>
                </div>
              </div>

              <div class="p-5 pt-0">
                <button 
                  type="button" 
                  onclick="window.startPlanningFor('${pkg.dest}')" 
                  class="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 dark:from-[#260406] dark:to-[#5c0606]/30 hover:from-[#ea2330] hover:to-[#880808] hover:text-white text-red-600 dark:text-red-300 font-bold text-xs transition border border-red-200 dark:border-red-800 flex items-center justify-center space-x-1.5">
                  <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                  <span>Customize in AI Planner</span>
                </button>
              </div>

            </div>
          `).join('')}
        </div>

      </section>

      <!-- ===================================================================
           NEW VISUAL FEATURE: TRAVELER STORIES & LIVE COMMUNITY PHOTO WALL
           =================================================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div class="text-center space-y-2 max-w-2xl mx-auto">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wider">
            <i data-lucide="camera" class="w-3.5 h-3.5"></i>
            <span>Real Traveler Photo Moments</span>
          </div>
          <h2 class="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Loved by 50 Million+ Explorers
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real photos and genuine feedback from travelers exploring India with TRAVORA.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${travelerStories.map(story => `
            <div class="surface-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between group hover:border-red-500 transition">
              
              <!-- Trip Visual -->
              <div class="h-44 w-full relative overflow-hidden bg-slate-900">
                <img 
                  src="${story.img}" 
                  alt="${story.trip}" 
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                
                <div class="absolute top-3 left-3">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-black/60 backdrop-blur-md text-white border border-white/20">
                    ${story.badge}
                  </span>
                </div>

                <div class="absolute bottom-3 left-3 text-white text-xs font-bold flex items-center space-x-1.5">
                  <i data-lucide="map-pin" class="w-3.5 h-3.5 text-red-400"></i>
                  <span>${story.trip}</span>
                </div>
              </div>

              <!-- Quote & User Avatar -->
              <div class="p-5 space-y-4 flex-1 flex flex-col justify-between bg-white dark:bg-slate-900">
                <div class="space-y-2">
                  <div class="flex items-center space-x-1 text-amber-400">
                    ${Array.from({ length: story.rating }).map(() => `
                      <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
                    `).join('')}
                  </div>
                  <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "${story.quote}"
                  </p>
                </div>

                <div class="flex items-center space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <img 
                    src="${story.avatar}" 
                    alt="${story.name}" 
                    class="w-10 h-10 rounded-full object-cover border-2 border-red-500 shadow-sm"
                  />
                  <div>
                    <h4 class="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">${story.name}</h4>
                    <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                      <i data-lucide="shield-check" class="w-3 h-3"></i>
                      <span>Verified Traveller</span>
                    </span>
                  </div>
                </div>

              </div>

            </div>
          `).join('')}
        </div>

      </section>

      <!-- ===================================================================
           AIRLINE & HOSPITALITY BRAND PARTNERS STRIP
           =================================================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="surface-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div class="text-center">
            <span class="text-[11px] font-black tracking-widest text-slate-400 uppercase">
              OFFICIAL AIRLINE & HOSPITALITY NETWORK PARTNERS
            </span>
          </div>

          <div class="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-70 dark:opacity-60 text-slate-700 dark:text-slate-300 font-black text-xs sm:text-sm">
            <span class="flex items-center space-x-1.5"><i data-lucide="plane" class="w-4 h-4 text-indigo-600"></i><span>IndiGo</span></span>
            <span class="flex items-center space-x-1.5"><i data-lucide="plane" class="w-4 h-4 text-red-600"></i><span>Air India</span></span>
            <span class="flex items-center space-x-1.5"><i data-lucide="plane" class="w-4 h-4 text-purple-700"></i><span>Vistara</span></span>
            <span class="flex items-center space-x-1.5"><i data-lucide="plane" class="w-4 h-4 text-orange-600"></i><span>Akasa Air</span></span>
            <span class="flex items-center space-x-1.5"><i data-lucide="plane" class="w-4 h-4 text-red-500"></i><span>SpiceJet</span></span>
            <span class="flex items-center space-x-1.5"><i data-lucide="hotel" class="w-4 h-4 text-amber-600"></i><span>Taj Hotels</span></span>
            <span class="flex items-center space-x-1.5"><i data-lucide="hotel" class="w-4 h-4 text-emerald-600"></i><span>Oberoi Resorts</span></span>
            <span class="flex items-center space-x-1.5"><i data-lucide="hotel" class="w-4 h-4 text-blue-600"></i><span>Marriott Bonvoy</span></span>
            <span class="flex items-center space-x-1.5"><i data-lucide="hotel" class="w-4 h-4 text-rose-600"></i><span>ITC Luxury</span></span>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           WHY BOOK WITH TRAVORA (YATRA TRUST BADGES)
           =================================================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="surface-card rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
          
          <div class="text-center space-y-2 max-w-2xl mx-auto">
            <h3 class="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Why 50 Million+ Travellers Choose TRAVORA
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              India's premier travel technology platform with zero hidden fees and real-time disruption adaptation.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            
            <div class="space-y-3 p-4">
              <div class="w-12 h-12 mx-auto rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center">
                <i data-lucide="shield-check" class="w-6 h-6"></i>
              </div>
              <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">100% Price Transparency</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">No surprise convenience fees or hidden baggage charges at final checkout.</p>
            </div>

            <div class="space-y-3 p-4">
              <div class="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <i data-lucide="users" class="w-6 h-6"></i>
              </div>
              <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">517 Verified Operators</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">Directly connected with certified local ground tour operators across 802 districts.</p>
            </div>

            <div class="space-y-3 p-4">
              <div class="w-12 h-12 mx-auto rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <i data-lucide="zap" class="w-6 h-6"></i>
              </div>
              <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">Autonomous Adaptation</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">Instant alternative itinerary re-routing when flights delay or roads close.</p>
            </div>

            <div class="space-y-3 p-4">
              <div class="w-12 h-12 mx-auto rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <i data-lucide="headset" class="w-6 h-6"></i>
              </div>
              <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">24/7 Dedicated Support</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">Round-the-clock priority customer hotline (+91 124 4180810) and operator dispatch.</p>
            </div>

          </div>

        </div>
      </section>

      <!-- ===================================================================
           DOWNLOAD TRAVORA MOBILE APP (FEATURING HIGH-RES SMARTPHONE MOCKUP)
           =================================================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#880808] via-[#ea2330] to-[#260406] text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <!-- Subtle Glow Graphic -->
          <div class="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>

          <!-- Left Description -->
          <div class="space-y-4 text-left max-w-xl relative z-10">
            <span class="px-3 py-1 rounded-full bg-black/30 text-amber-300 font-black text-xs uppercase tracking-wider border border-white/20 inline-block">
              MOBILE APP EXCLUSIVE DEALS
            </span>
            <h2 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Get Up to ₹1,500 OFF on Your First App Booking
            </h2>
            <p class="text-xs sm:text-sm text-red-100 leading-relaxed">
              Download the TRAVORA mobile app for real-time flight radar tracking, live WhatsApp notifications, and exclusive flash sales.
            </p>

            <div class="grid grid-cols-2 gap-3 pt-2 text-xs font-semibold text-white/90">
              <div class="flex items-center space-x-2">
                <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400 shrink-0"></i>
                <span>Live Flight Radar & Gate Alerts</span>
              </div>
              <div class="flex items-center space-x-2">
                <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400 shrink-0"></i>
                <span>Offline E-Tickets & Boarding Pass</span>
              </div>
              <div class="flex items-center space-x-2">
                <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400 shrink-0"></i>
                <span>Autonomous Reschedule in 1-Click</span>
              </div>
              <div class="flex items-center space-x-2">
                <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400 shrink-0"></i>
                <span>4.9 ★ Rating (1.2M Reviews)</span>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-3 pt-2">
              <button 
                type="button"
                onclick="window.startPlanningFor('Goa')" 
                class="px-8 py-4 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-sm shadow-xl transition transform hover:-translate-y-0.5 flex items-center space-x-2">
                <i data-lucide="sparkles" class="w-4 h-4 text-red-600"></i>
                <span>Book Trip on Web</span>
              </button>
              <button 
                type="button"
                onclick="window.copyPromoCode('FIRSTFLY')" 
                class="px-6 py-4 rounded-2xl bg-black/40 hover:bg-black/60 text-white font-bold text-sm border border-white/20 transition flex items-center space-x-2">
                <i data-lucide="tag" class="w-4 h-4 text-amber-300"></i>
                <span>Use Code FIRSTFLY</span>
              </button>
            </div>
          </div>

          <!-- Right Smartphone App Render Photo -->
          <div class="relative z-10 shrink-0 w-64 sm:w-72 lg:w-80">
            <div class="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-slate-950 transform hover:scale-105 transition duration-500">
              <img 
                src="/static/assets/app/travora_app_preview.jpg" 
                alt="TRAVORA Luxury Travel Mobile App Screen" 
                class="w-full h-auto object-cover"
              />
            </div>
          </div>

        </div>
      </section>

    </div>
  `;
}

// Interactive helper functions for Yatra + Travora
window.setLandingSearchTab = function (tab) {
  window.landingSearchTab = tab;
  window.landingResultsCategory = tab;
  window.landingIsSearchActive = true;
  store.setState({ 
    landingSearchTab: tab,
    landingResultsCategory: tab,
    landingIsSearchActive: true
  });
  setTimeout(() => {
    const el = document.getElementById('search-results-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
};

window.setLandingFlightTripType = function (type) {
  window.landingFlightTripType = type;
  const badge = document.getElementById('flight-trip-type-badge');
  const retArrow = document.getElementById('flight-ret-date-arrow');
  const retDisplay = document.getElementById('flight-ret-date-display');
  if (badge) badge.innerText = type === 'roundtrip' ? 'Round Trip' : (type === 'multicity' ? 'Multi-City' : 'One Way');
  if (type === 'roundtrip') {
    if (retArrow) retArrow.classList.remove('hidden');
    if (retDisplay) retDisplay.classList.remove('hidden');
  } else {
    if (retArrow) retArrow.classList.add('hidden');
    if (retDisplay) retDisplay.classList.add('hidden');
  }
  store.setState({ landingFlightTripType: type });
};

window.setLandingSpecialFare = function (fare) {
  window.landingSpecialFare = fare;
  store.setState({ landingSpecialFare: fare });
  store.addToast(`Special Fare applied: ${fare.toUpperCase()}`, 'info');
};

window.swapLandingCities = function () {
  const fromInput = document.getElementById('search-from-city');
  const toInput = document.getElementById('search-to-city');
  if (fromInput && toInput) {
    const temp = fromInput.value;
    fromInput.value = toInput.value;
    toInput.value = temp;
    window.landingFromCity = fromInput.value;
    window.landingToCity = toInput.value;
    store.addToast(`Swapped origin & destination: ${fromInput.value} ⇄ ${toInput.value}`, 'info');
    store.setState({});
  }
};

window.setQuickDestination = function (cityFull) {
  const toInput = document.getElementById('search-to-city');
  if (toInput) toInput.value = cityFull;
  window.landingToCity = cityFull;
  store.addToast(`Destination set to ${cityFull}`, 'success');
  store.setState({});
};

window.setHotelDestination = function(fullCity) {
  window.landingHotelCity = fullCity;
  window.landingToCity = fullCity;
  const inp = document.getElementById('hotel-city');
  if (inp) inp.value = fullCity;
  store.addToast(`Hotel search set to ${fullCity}`, 'info');
  window.executeLandingSearch('hotels');
};

window.setPackageDestination = function(fullPkg) {
  window.landingPackageDest = fullPkg;
  window.landingToCity = fullPkg;
  const inp = document.getElementById('package-dest');
  if (inp) inp.value = fullPkg;
  store.addToast(`Package destination set to ${fullPkg}`, 'info');
  window.executeLandingSearch('packages');
};

window.swapCabCities = function() {
  const p = window.landingCabPickup || 'Mumbai City Center';
  const d = window.landingCabDrop || 'Goa (Panaji / Calangute)';
  window.landingCabPickup = d;
  window.landingCabDrop = p;
  const pInp = document.getElementById('cab-pickup');
  const dInp = document.getElementById('cab-drop');
  if (pInp) pInp.value = d;
  if (dInp) dInp.value = p;
  store.addToast(`Swapped cab route: ${d} ⇄ ${p}`, 'info');
  store.setState({});
};

window.setCabRoute = function(from, to) {
  window.landingCabPickup = from;
  window.landingCabDrop = to;
  window.landingToCity = to;
  const pInp = document.getElementById('cab-pickup');
  const dInp = document.getElementById('cab-drop');
  if (pInp) pInp.value = from;
  if (dInp) dInp.value = to;
  store.addToast(`Cab route set to ${from} ➔ ${to}`, 'info');
  window.executeLandingSearch('buses_cabs');
};

window.swapTrainStations = function() {
  const f = window.landingTrainFrom || 'New Delhi (NDLS)';
  const t = window.landingTrainTo || 'Madgaon Goa (MAO)';
  window.landingTrainFrom = t;
  window.landingTrainTo = f;
  const fInp = document.getElementById('train-from');
  const tInp = document.getElementById('train-to');
  if (fInp) fInp.value = t;
  if (tInp) tInp.value = f;
  store.addToast(`Swapped train stations: ${t} ⇄ ${f}`, 'info');
  store.setState({});
};

window.setTrainRoute = function(from, to) {
  window.landingTrainFrom = from;
  window.landingTrainTo = to;
  window.landingToCity = to;
  const fInp = document.getElementById('train-from');
  const tInp = document.getElementById('train-to');
  if (fInp) fInp.value = from;
  if (tInp) tInp.value = to;
  store.addToast(`Train route set to ${from} ➔ ${to}`, 'info');
  window.executeLandingSearch('trains');
};

window.selectDestinationCard = function (destName, cityFull) {
  window.setQuickDestination(cityFull);
  window.executeLandingSearch('flights');
};

window.selectPopularRoute = function (fromCity, toCity) {
  window.landingFromCity = fromCity;
  window.landingToCity = toCity;
  window.landingSearchTab = 'flights';
  window.landingResultsCategory = 'flights';
  window.landingIsSearchActive = true;
  store.setState({ 
    landingSearchTab: 'flights',
    landingResultsCategory: 'flights',
    landingIsSearchActive: true
  });
  store.addToast(`Loaded cheapest flights for ${fromCity} ➔ ${toCity}`, 'success');
  setTimeout(() => {
    const el = document.getElementById('search-results-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
};

window.toggleLandingFlexibleDates = function (checked) {
  window.landingFlexibleDates = checked;
  store.setState({ landingFlexibleDates: checked });
  store.addToast(checked ? 'Flexible Dates Matrix enabled' : 'Switched to exact date mode', 'info');
};

window.toggleDirectFlights = function (checked) {
  window.landingDirectOnly = checked;
  store.setState({ landingDirectOnly: checked });
  store.addToast(checked ? 'Showing non-stop flights only' : 'Showing all flights', 'info');
};

function updateTravellerDisplay() {
  const adults = typeof window.landingAdults === 'number' ? window.landingAdults : 1;
  const children = typeof window.landingChildren === 'number' ? window.landingChildren : 0;
  const infants = typeof window.landingInfants === 'number' ? window.landingInfants : 0;
  const cabinClass = window.landingCabinClass || 'Economy';
  const total = adults + children + infants;

  const aCount = document.getElementById('traveller-adults-count');
  const cCount = document.getElementById('traveller-children-count');
  const iCount = document.getElementById('traveller-infants-count');
  if (aCount) aCount.innerText = adults;
  if (cCount) cCount.innerText = children;
  if (iCount) iCount.innerText = infants;

  const titleEl = document.getElementById('traveller-summary-title');
  const subEl = document.getElementById('traveller-summary-sub');
  const badgeEl = document.getElementById('traveller-badge-class');
  if (titleEl) titleEl.innerText = `${total} Traveller${total > 1 ? 's' : ''}`;
  if (subEl) subEl.innerText = `${cabinClass} • Standard Baggage`;
  if (badgeEl) badgeEl.innerText = cabinClass;

  // Update cabin class button active states
  const btnGroup = document.getElementById('cabin-class-btn-group');
  if (btnGroup) {
    btnGroup.querySelectorAll('.cabin-class-btn').forEach(btn => {
      const cls = btn.getAttribute('data-cabin-class');
      if (cls === cabinClass) {
        btn.className = 'cabin-class-btn py-2 px-1.5 rounded-xl text-center border font-bold text-xs transition cursor-pointer bg-gradient-to-r from-[#ea2330] to-[#880808] text-white border-red-600 shadow-md font-black ring-2 ring-red-400/50';
      } else {
        btn.className = 'cabin-class-btn py-2 px-1.5 rounded-xl text-center border font-bold text-xs transition cursor-pointer border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400';
      }
    });
  }
}

window.toggleTravellerDropdown = function (e) {
  if (e && e.stopPropagation) e.stopPropagation();
  window.isTravellerDropdownOpen = !window.isTravellerDropdownOpen;
  const popover = document.getElementById('traveller-selection-popover');
  const card = document.getElementById('travellers-dropdown-card');
  const chevron = document.getElementById('traveller-chevron');

  if (window.isTravellerDropdownOpen) {
    if (popover) popover.classList.remove('hidden');
    if (card) {
      card.classList.add('z-50', 'ring-2', 'ring-red-500/50', 'shadow-2xl', 'bg-white', 'dark:bg-slate-900');
      card.classList.remove('z-20');
    }
    if (chevron) chevron.classList.add('rotate-180', 'text-red-600');
    updateTravellerDisplay();
  } else {
    window.closeTravellerDropdown();
  }
};

window.closeTravellerDropdown = function () {
  window.isTravellerDropdownOpen = false;
  const popover = document.getElementById('traveller-selection-popover');
  const card = document.getElementById('travellers-dropdown-card');
  const chevron = document.getElementById('traveller-chevron');

  if (popover) popover.classList.add('hidden');
  if (card) {
    card.classList.remove('z-50', 'ring-2', 'ring-red-500/50', 'shadow-2xl', 'bg-white', 'dark:bg-slate-900');
    card.classList.add('z-20');
  }
  if (chevron) chevron.classList.remove('rotate-180', 'text-red-600');

  const adults = typeof window.landingAdults === 'number' ? window.landingAdults : 1;
  const children = typeof window.landingChildren === 'number' ? window.landingChildren : 0;
  const infants = typeof window.landingInfants === 'number' ? window.landingInfants : 0;
  const cabinClass = window.landingCabinClass || 'Economy';

  store.setState({
    landingAdults: adults,
    landingChildren: children,
    landingInfants: infants,
    landingCabinClass: cabinClass
  });

  if (window.landingIsSearchActive) {
    window.executeLandingSearch('flights');
  }
};

window.changeAdults = function (delta) {
  const current = typeof window.landingAdults === 'number' ? window.landingAdults : 1;
  window.landingAdults = Math.max(1, Math.min(9, current + delta));
  updateTravellerDisplay();
};

window.changeChildren = function (delta) {
  const current = typeof window.landingChildren === 'number' ? window.landingChildren : 0;
  window.landingChildren = Math.max(0, Math.min(6, current + delta));
  updateTravellerDisplay();
};

window.changeInfants = function (delta) {
  const current = typeof window.landingInfants === 'number' ? window.landingInfants : 0;
  window.landingInfants = Math.max(0, Math.min(4, current + delta));
  updateTravellerDisplay();
};

window.setCabinClass = function (cls) {
  window.landingCabinClass = cls;
  updateTravellerDisplay();
};

// Document click listener to close traveller dropdown when clicking outside
if (!window._travellerDocClickBound) {
  window._travellerDocClickBound = true;
  document.addEventListener('click', function (e) {
    if (window.isTravellerDropdownOpen) {
      const card = document.getElementById('travellers-dropdown-card');
      if (card && !card.contains(e.target)) {
        window.closeTravellerDropdown();
      }
    }
  });
}

// Interactive Smart Calendar Pickers for Flights, Hotels, Cabs
window.openFlightCalendarPicker = function () {
  const tripType = window.landingFlightTripType || 'roundtrip';
  const isRange = tripType === 'roundtrip';
  const depVal = window.landingDepDate || '2026-10-28';
  const retVal = window.landingRetDate || '2026-10-31';

  openCalendarPicker({
    startInputId: 'search-dep-date',
    endInputId: 'search-ret-date',
    isRange: isRange,
    title: isRange ? 'Choose Flight Departure & Return Dates' : 'Choose Flight Departure Date',
    initialStartDate: depVal,
    initialEndDate: retVal,
    onDatesSelected: function (s, e) {
      window.landingDepDate = s;
      window.landingRetDate = e;
      const depInp = document.getElementById('search-dep-date');
      const retInp = document.getElementById('search-ret-date');
      if (depInp) depInp.value = s;
      if (retInp) retInp.value = e;

      const depDisp = document.getElementById('flight-dep-date-display');
      const retDisp = document.getElementById('flight-ret-date-display');
      if (depDisp) depDisp.innerText = new Date(s + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      if (retDisp) retDisp.innerText = new Date(e + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

      store.setState({ landingDepDate: s, landingRetDate: e });
      if (window.landingIsSearchActive) {
        window.executeLandingSearch('flights');
      }
    }
  });
};

window.openHotelCalendarPicker = function () {
  openCalendarPicker({
    startInputId: 'hotel-checkin-date',
    endInputId: 'hotel-checkout-date',
    isRange: true,
    title: 'Select Hotel Check-in & Check-out Dates',
    initialStartDate: window.landingDepDate || '2026-10-28',
    initialEndDate: window.landingRetDate || '2026-10-31',
    onDatesSelected: function (s, e) {
      window.landingDepDate = s;
      window.landingRetDate = e;
      store.setState({ landingDepDate: s, landingRetDate: e });
      if (window.landingIsSearchActive) {
        window.executeLandingSearch('hotels');
      }
    }
  });
};

window.openBusCabCalendarPicker = function () {
  openCalendarPicker({
    startInputId: 'cab-date',
    isRange: false,
    title: 'Select Bus / Cab Travel Date',
    initialStartDate: window.landingDepDate || '2026-10-28',
    onDatesSelected: function (s) {
      window.landingDepDate = s;
      store.setState({ landingDepDate: s });
      if (window.landingIsSearchActive) {
        window.executeLandingSearch('buses_cabs');
      }
    }
  });
};

window.executeLandingSearch = function (category) {
  category = category || window.landingSearchTab || 'flights';
  let from = window.landingFromCity || 'Mumbai (BOM)';
  let to = window.landingToCity || 'New Delhi (DEL)';
  
  if (category === 'flights') {
    const fromInp = document.getElementById('search-from-city');
    const toInp = document.getElementById('search-to-city');
    if (fromInp && fromInp.value) from = fromInp.value;
    if (toInp && toInp.value) to = toInp.value;
    const depInp = document.getElementById('search-dep-date');
    const retInp = document.getElementById('search-ret-date');
    if (depInp && depInp.value) window.landingDepDate = depInp.value;
    if (retInp && retInp.value) window.landingRetDate = retInp.value;
  } else if (category === 'hotels') {
    const hCityInp = document.getElementById('hotel-city');
    to = (hCityInp && hCityInp.value) ? hCityInp.value : (window.landingHotelCity || 'Goa, India');
    from = 'Direct Stay';
    window.landingHotelCity = to;
  } else if (category === 'packages') {
    const pDestInp = document.getElementById('package-dest');
    to = (pDestInp && pDestInp.value) ? pDestInp.value : (window.landingPackageDest || 'Goa Coastal & Heritage');
    from = 'All-Inclusive';
    window.landingPackageDest = to;
  } else if (category === 'buses_cabs') {
    const cabPInp = document.getElementById('cab-pickup');
    const cabDInp = document.getElementById('cab-drop');
    from = (cabPInp && cabPInp.value) ? cabPInp.value : (window.landingCabPickup || 'Mumbai City Center');
    to = (cabDInp && cabDInp.value) ? cabDInp.value : (window.landingCabDrop || 'Goa');
    window.landingCabPickup = from;
    window.landingCabDrop = to;
  } else if (category === 'trains') {
    const trFInp = document.getElementById('train-from');
    const trTInp = document.getElementById('train-to');
    from = (trFInp && trFInp.value) ? trFInp.value : (window.landingTrainFrom || 'New Delhi (NDLS)');
    to = (trTInp && trTInp.value) ? trTInp.value : (window.landingTrainTo || 'Madgaon Goa (MAO)');
    window.landingTrainFrom = from;
    window.landingTrainTo = to;
  }

  window.landingIsSearchActive = true;
  window.landingResultsCategory = category;
  window.landingFromCity = from;
  window.landingToCity = to;

  store.addToast(`Loaded verified ${category.replace('_', ' ')} results for ${to}`, 'success');
  store.setState({
    landingIsSearchActive: true,
    landingResultsCategory: category,
    landingFromCity: from,
    landingToCity: to,
    landingDepDate: window.landingDepDate,
    landingRetDate: window.landingRetDate
  });

  setTimeout(() => {
    const el = document.getElementById('search-results-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
};

window.selectDateFare = function (isoDate, fare) {
  if (!isoDate) return;
  window.landingDepDate = isoDate;
  const depInp = document.getElementById('search-dep-date');
  if (depInp) depInp.value = isoDate;

  // Persist into store
  store.setState({
    landingDepDate: isoDate
  });

  // Re-run flight search with new date
  window.executeLandingSearch('flights');

  const dt = new Date(isoDate + 'T00:00:00');
  const formatted = dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  store.addToast(`Switched flight departure to ${formatted} (Fare: ₹${(fare || 3590).toLocaleString('en-IN')})`, 'success');
};

window.sortFlightsByDuration = function () {
  store.addToast('Sorted by fastest flight duration', 'info');
};

window.bookFlightDirectly = function (flightCode, airline, price, depTime, arrTime) {
  const from = window.landingFromCity || 'Mumbai (BOM)';
  const to = window.landingToCity || 'New Delhi (DEL)';
  store.addToast(`Selected ${airline} (${flightCode}). Opening booking summary...`, 'success');
  store.setState({
    isBookingModalOpen: true,
    bookingDetails: {
      title: `${airline} Flight ${flightCode}`,
      category: 'flight',
      price: price,
      depTime: depTime,
      arrTime: arrTime,
      route: `${from} to ${to}`,
      convenienceFee: 0
    }
  });
};

window.bookHotelDirectly = function(hotelName, price, roomType) {
  store.setState({
    isBookingModalOpen: true,
    bookingDetails: {
      title: hotelName,
      category: 'hotel',
      price: price,
      route: window.landingHotelCity || 'Goa, India',
      roomType: roomType,
      convenienceFee: 0
    }
  });
  store.addToast(`Selected stay at ${hotelName}. Opening booking summary...`, 'success');
};

window.bookPackageDirectly = function(pkgTitle, price, duration) {
  store.setState({
    isBookingModalOpen: true,
    bookingDetails: {
      title: pkgTitle,
      category: 'package',
      price: price,
      route: window.landingPackageDest || 'Goa Coastal & Heritage',
      duration: duration,
      convenienceFee: 0
    }
  });
  store.addToast(`Selected package: ${pkgTitle}. Opening booking summary...`, 'success');
};

window.bookBusCabDirectly = function(vehicleTitle, price, from, to) {
  store.setState({
    isBookingModalOpen: true,
    bookingDetails: {
      title: vehicleTitle,
      category: 'bus',
      price: price,
      route: `${from} to ${to}`,
      convenienceFee: 0
    }
  });
  store.addToast(`Selected transit: ${vehicleTitle}. Opening booking summary...`, 'success');
};

window.bookTrainDirectly = function(trainNumber, trainName, price, travelClass) {
  store.setState({
    isBookingModalOpen: true,
    bookingDetails: {
      title: `${trainName} (${trainNumber}) - ${travelClass}`,
      category: 'train',
      price: price,
      route: `${window.landingTrainFrom || 'NDLS'} to ${window.landingTrainTo || 'MAO'}`,
      convenienceFee: 0
    }
  });
  store.addToast(`Selected train: ${trainName}. Opening booking summary...`, 'success');
};

window.trackFlightPrices = function () {
  store.addToast('Price Alert activated! You will receive instant notifications when fares drop.', 'success');
};

let couponTimer = null;

window.initCouponBannerAutoFade = function () {
  const banner = document.getElementById('travora-coupon-banner');
  const progress = document.getElementById('coupon-fade-progress');
  if (!banner) return;

  if (progress && progress.style) {
    progress.style.width = '100%';
    setTimeout(() => {
      if (progress && progress.style) {
        progress.style.transition = 'width 6s linear';
        progress.style.width = '0%';
      }
    }, 50);
  }

  if (couponTimer) clearTimeout(couponTimer);
  couponTimer = setTimeout(() => {
    window.dismissCouponBanner();
  }, 6500);
};

window.pauseCouponFadeTimer = function () {
  if (couponTimer) clearTimeout(couponTimer);
  const progress = document.getElementById('coupon-fade-progress');
  if (progress && progress.style) {
    progress.style.transition = 'none';
  }
};

window.resumeCouponFadeTimer = function () {
  const progress = document.getElementById('coupon-fade-progress');
  if (progress) {
    progress.style.transition = 'width 3s linear';
    progress.style.width = '0%';
  }
  if (couponTimer) clearTimeout(couponTimer);
  couponTimer = setTimeout(() => {
    window.dismissCouponBanner();
  }, 3000);
};

window.dismissCouponBanner = function () {
  if (couponTimer) {
    clearTimeout(couponTimer);
    couponTimer = null;
  }
  const wrapper = document.getElementById('travora-coupon-banner-wrapper');
  const banner = document.getElementById('travora-coupon-banner');
  if (banner) {
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(-10px) scale(0.98)';
  }
  if (wrapper) {
    setTimeout(() => {
      wrapper.style.maxHeight = '0px';
      wrapper.style.paddingTop = '0px';
      wrapper.style.paddingBottom = '0px';
      wrapper.style.marginTop = '0px';
      wrapper.style.marginBottom = '0px';
      wrapper.style.overflow = 'hidden';
      wrapper.style.opacity = '0';
    }, 350);
    setTimeout(() => {
      wrapper.style.display = 'none';
    }, 850);
  }
};

window.copyPromoCode = function (code, btnEl) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).then(() => {
      store.addToast(`Coupon "${code}" copied to clipboard! Zero Convenience Fees applied.`, 'success', 3500);
      if (btnEl) {
        btnEl.classList.remove('bg-[#810B38]');
        btnEl.classList.add('bg-emerald-600');
        btnEl.innerHTML = `<span class="font-mono">COPIED!</span><i data-lucide="check" class="w-3 h-3 text-white"></i>`;
        if (window.lucide) window.lucide.createIcons();
        setTimeout(() => {
          btnEl.classList.remove('bg-emerald-600');
          btnEl.classList.add('bg-[#810B38]');
          btnEl.innerHTML = `<span class="font-mono">${code}</span><i data-lucide="copy" class="w-3 h-3 text-amber-300"></i>`;
          if (window.lucide) window.lucide.createIcons();
        }, 2500);
      }
    }).catch(() => {
      store.addToast(`Coupon code: ${code}`, 'info');
    });
  } else {
    store.addToast(`Coupon code: ${code}`, 'info');
  }
};

// Start the coupon auto-fade countdown after page mounts
setTimeout(() => {
  if (window.initCouponBannerAutoFade) {
    window.initCouponBannerAutoFade();
  }
}, 150);

window.startPlanningFor = function (destName) {
  store.addToast(`Customizing tour package for ${destName}...`, 'info');
  window.navigateView('planner');
};

window.scrollToOffersSection = async function () {
  const state = store.getState();
  if (state.currentView !== 'landing') {
    await window.navigateView('landing');
  }

  const tryScroll = (attempts = 0) => {
    const el = document.getElementById('yatra-offers-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-4', 'ring-red-500/60', 'transition-all', 'duration-500', 'rounded-3xl');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-red-500/60');
      }, 2500);
      store.addToast('Viewing Exclusive Bank & Airline Promo Offers', 'info', 3000);
    } else if (attempts < 12) {
      setTimeout(() => tryScroll(attempts + 1), 60);
    }
  };

  setTimeout(() => tryScroll(0), 80);
};

