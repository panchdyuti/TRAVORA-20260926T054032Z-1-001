// TRAVORA PLACES AUTOCOMPLETE & DIRECTORY PICKER
// Enhanced interactive place selection for Flights, Trains, Buses, Stays across India with Rich Images

import { INDIA_AIRPORTS, INDIA_TRAIN_STATIONS, INDIA_BUS_STATIONS, POPULAR_INDIAN_DESTINATIONS } from './india_places_data.js';
import { store } from '../store.js';

let activePickerModal = null;

// Curated high-resolution destination images for Indian transit hubs and cities
export const CITY_IMAGES = {
  'delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80',
  'new delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80',
  'mumbai': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80',
  'bengaluru': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80',
  'bangalore': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80',
  'hyderabad': 'https://images.unsplash.com/photo-1605335198108-9df2438b4887?w=600&q=80',
  'kolkata': 'https://images.unsplash.com/photo-1558431382-27e303142255?w=600&q=80',
  'chennai': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80',
  'goa': '/static/assets/destinations/goa_beach_sunset.jpg',
  'jaipur': '/static/assets/destinations/jaipur_royal_palace.jpg',
  'udaipur': '/static/assets/destinations/udaipur_lake_palace.jpg',
  'jodhpur': 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=600&q=80',
  'jaisalmer': 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=600&q=80',
  'srinagar': '/static/assets/destinations/kashmir_snow_resort.jpg',
  'kashmir': '/static/assets/destinations/kashmir_snow_resort.jpg',
  'gulmarg': '/static/assets/destinations/kashmir_snow_resort.jpg',
  'leh': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=600&q=80',
  'ladakh': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=600&q=80',
  'manali': '/static/assets/destinations/manali_snow_peaks.jpg',
  'kullu': '/static/assets/destinations/manali_snow_peaks.jpg',
  'shimla': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80',
  'rishikesh': 'https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?w=600&q=80',
  'dehradun': 'https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?w=600&q=80',
  'amritsar': 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=600&q=80',
  'chandigarh': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80',
  'varanasi': '/static/assets/destinations/varanasi_ganga_ghats.jpg',
  'lucknow': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80',
  'ayodhya': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80',
  'agra': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80',
  'pune': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80',
  'ahmedabad': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&q=80',
  'surat': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&q=80',
  'vadodara': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&q=80',
  'indore': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80',
  'bhopal': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80',
  'nagpur': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80',
  'kochi': 'https://images.unsplash.com/photo-1584282479904-4c47fb9dc873?w=600&q=80',
  'cochin': 'https://images.unsplash.com/photo-1584282479904-4c47fb9dc873?w=600&q=80',
  'kerala': '/static/assets/destinations/kerala_houseboat_lake.jpg',
  'alleppey': '/static/assets/destinations/kerala_houseboat_lake.jpg',
  'munnar': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&q=80',
  'ooty': 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=600&q=80',
  'kodaikanal': 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=600&q=80',
  'coimbatore': 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=600&q=80',
  'madurai': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80',
  'tirupati': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80',
  'visakhapatnam': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80',
  'port blair': '/static/assets/destinations/andaman_havelock_beach.jpg',
  'andaman': '/static/assets/destinations/andaman_havelock_beach.jpg',
  'havelock': '/static/assets/destinations/andaman_havelock_beach.jpg',
  'bhubaneswar': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&q=80',
  'puri': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&q=80',
  'darjeeling': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80',
  'bagdogra': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80',
  'gangtok': 'https://images.unsplash.com/photo-1626014303757-64665421a8d0?w=600&q=80',
  'sikkim': 'https://images.unsplash.com/photo-1626014303757-64665421a8d0?w=600&q=80',
  'guwahati': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&q=80',
  'shillong': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&q=80',
  'hampi': 'https://images.unsplash.com/photo-1600100397608-f010f443b749?w=600&q=80',
  'coorg': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80',
  'gokarna': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80',
  'mysuru': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80',
  'mysore': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80',
  'patna': 'https://images.unsplash.com/photo-1558431382-27e303142255?w=600&q=80',
  'gaya': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80',
  'ranchi': 'https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?w=600&q=80',
  'imphal': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&q=80',
  'agartala': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&q=80',
  'pondicherry': 'https://images.unsplash.com/photo-1584282479904-4c47fb9dc873?w=600&q=80',
  'puducherry': 'https://images.unsplash.com/photo-1584282479904-4c47fb9dc873?w=600&q=80'
};

export function getPlacePhoto(name = '', state = '', fallback = '/static/assets/destinations/goa_beach_sunset.jpg') {
  const combined = `${name || ''} ${state || ''}`.toLowerCase();
  for (const [key, url] of Object.entries(CITY_IMAGES)) {
    if (combined.includes(key)) {
      return url;
    }
  }
  return fallback;
}

// Popular Trending Hubs for Top Visual Carousel in Picker
const TRENDING_HUBS = [
  { name: 'Goa', code: 'GOI', state: 'Goa', tag: '🏖️ Beach', img: '/static/assets/destinations/goa_beach_sunset.jpg' },
  { name: 'Jaipur', code: 'JAI', state: 'Rajasthan', tag: '🏛️ Heritage', img: '/static/assets/destinations/jaipur_royal_palace.jpg' },
  { name: 'Manali', code: 'KUU', state: 'Himachal', tag: '🏔️ Snow', img: '/static/assets/destinations/manali_snow_peaks.jpg' },
  { name: 'Srinagar', code: 'SXR', state: 'Kashmir', tag: '🛶 Shikara', img: '/static/assets/destinations/kashmir_snow_resort.jpg' },
  { name: 'Kochi & Kerala', code: 'COK', state: 'Kerala', tag: '🌴 Houseboats', img: '/static/assets/destinations/kerala_houseboat_lake.jpg' },
  { name: 'Varanasi', code: 'VNS', state: 'Uttar Pradesh', tag: '🕉️ Ghats', img: '/static/assets/destinations/varanasi_ganga_ghats.jpg' },
  { name: 'Udaipur', code: 'UDR', state: 'Rajasthan', tag: '🏰 Lake Palace', img: '/static/assets/destinations/udaipur_lake_palace.jpg' },
  { name: 'Andaman Islands', code: 'IXZ', state: 'Andaman', tag: '🤿 Corals', img: '/static/assets/destinations/andaman_havelock_beach.jpg' },
  { name: 'Mumbai', code: 'BOM', state: 'Maharashtra', tag: '🏙️ Metro', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80' },
  { name: 'New Delhi', code: 'DEL', state: 'Delhi', tag: '✈️ Mega Hub', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80' },
  { name: 'Leh Ladakh', code: 'IXL', state: 'Ladakh', tag: '🏍️ Passes', img: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=600&q=80' }
];

export function openPlacePicker(config = {}) {
  const {
    type = 'flights', // 'flights', 'trains', 'buses', 'hotels', 'packages'
    targetInputId = '',
    title = 'Choose Indian Destination',
    onSelect = null
  } = config;

  // Remove any existing picker modal
  closePlacePicker();

  let dataset = [];
  let iconName = 'plane';
  let placeholderText = 'Search Indian city, airport code, or state...';

  if (type === 'flights') {
    dataset = INDIA_AIRPORTS.map(a => ({
      primary: `${a.name} (${a.code})`,
      secondary: a.airport,
      badge: a.state,
      code: a.code,
      tag: a.tag,
      region: a.region,
      img: getPlacePhoto(a.name, a.state),
      raw: a
    }));
    iconName = 'plane';
    placeholderText = 'Search Mumbai, Delhi, Goa, Srinagar, Bangalore, Kochi, Jaipur...';
  } else if (type === 'trains') {
    dataset = INDIA_TRAIN_STATIONS.map(t => ({
      primary: `${t.city} - ${t.name} (${t.code})`,
      secondary: `IRCTC Hub: ${t.name}`,
      badge: t.state,
      code: t.code,
      tag: t.tag,
      region: t.region,
      img: getPlacePhoto(t.city || t.name, t.state),
      raw: t
    }));
    iconName = 'train';
    placeholderText = 'Search NDLS, Howrah, Mumbai CSMT, Madgaon Goa, Varanasi...';
  } else if (type === 'buses') {
    dataset = INDIA_BUS_STATIONS.map(b => ({
      primary: b.name,
      secondary: `${b.city} Interstate Terminal`,
      badge: b.state,
      code: 'BUS',
      tag: b.tag,
      region: b.region,
      img: getPlacePhoto(b.city || b.name, b.state),
      raw: b
    }));
    iconName = 'bus';
    placeholderText = 'Search Manali, Rishikesh, Mumbai, Pune, Goa, Bangalore, Ooty...';
  } else {
    // Destinations / Hotels / Packages
    dataset = POPULAR_INDIAN_DESTINATIONS.map(d => ({
      primary: d.full || d.name,
      secondary: d.desc,
      badge: d.state,
      code: d.name,
      tag: d.region,
      region: d.region,
      img: d.img || getPlacePhoto(d.name, d.state),
      raw: d
    }));
    iconName = 'map-pin';
    placeholderText = 'Search Goa, Jaipur, Kerala, Kashmir, Varanasi, Andaman, Manali...';
  }

  // Create Modal element
  const modalEl = document.createElement('div');
  modalEl.id = 'travora-place-picker-modal';
  modalEl.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md transition-opacity duration-200';
  modalEl.onclick = (e) => {
    if (e.target === modalEl) closePlacePicker();
  };

  modalEl.innerHTML = `
    <div class="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-200">
      
      <!-- HEADER -->
      <div class="p-4 sm:p-5 bg-gradient-to-r from-red-600/10 via-[#810B38]/10 to-transparent border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-2xl bg-[#810B38] text-white flex items-center justify-center shadow-lg shadow-red-900/30">
            <i data-lucide="${iconName}" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
              ${title}
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              High-speed visual search with live photos across 28 Indian States & 8 Union Territories
            </p>
          </div>
        </div>
        <button 
          type="button" 
          onclick="window.closePlacePicker()"
          class="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- SEARCH BAR & TRENDING STRIP -->
      <div class="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 space-y-3 shrink-0">
        <div class="relative">
          <i data-lucide="search" class="w-5 h-5 text-slate-400 absolute left-3.5 top-3"></i>
          <input 
            type="text" 
            id="place-picker-search-input" 
            placeholder="${placeholderText}" 
            autocomplete="off"
            class="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-[#810B38] focus:border-[#810B38] focus:outline-none shadow-sm"
          />
          <button 
            type="button" 
            onclick="const inp = document.getElementById('place-picker-search-input'); if(inp){ inp.value=''; inp.dispatchEvent(new Event('input')); inp.focus(); }"
            class="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <!-- TRENDING DESTINATIONS VISUAL CHIPS -->
        <div class="space-y-1.5 pt-0.5">
          <div class="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span class="flex items-center space-x-1">
              <i data-lucide="sparkles" class="w-3 h-3 text-amber-500"></i>
              <span>Popular Indian Destinations with Photos</span>
            </span>
            <span class="text-[9.5px] font-medium text-slate-400">One-tap auto fill</span>
          </div>
          
          <div class="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
            ${TRENDING_HUBS.map(hub => `
              <div 
                onclick="window.quickSelectPickerItem('${hub.name}', '${hub.code}')"
                class="flex items-center space-x-2 pl-1 pr-2.5 py-1 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-[#810B38] dark:hover:border-red-500 cursor-pointer shadow-xs hover:shadow-sm shrink-0 transition group">
                <img 
                  src="${hub.img}" 
                  alt="${hub.name}" 
                  class="w-6 h-6 rounded-xl object-cover shrink-0 shadow-xs group-hover:scale-105 transition"
                  onerror="this.src='/static/assets/destinations/goa_beach_sunset.jpg';"
                />
                <span class="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#810B38] dark:group-hover:text-red-400 whitespace-nowrap">${hub.name}</span>
                <span class="text-[9px] font-mono text-slate-400">${hub.code}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- REGION FILTER PILLS -->
        <div class="flex items-center space-x-1.5 overflow-x-auto pt-1 text-xs no-scrollbar">
          <button type="button" data-region="all" class="place-region-btn px-3 py-1 rounded-xl font-bold bg-[#810B38] text-white transition whitespace-nowrap shadow-sm">
            All (${dataset.length})
          </button>
          <button type="button" data-region="North" class="place-region-btn px-3 py-1 rounded-xl font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition whitespace-nowrap">
            North
          </button>
          <button type="button" data-region="South" class="place-region-btn px-3 py-1 rounded-xl font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition whitespace-nowrap">
            South
          </button>
          <button type="button" data-region="West" class="place-region-btn px-3 py-1 rounded-xl font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition whitespace-nowrap">
            West & Coast
          </button>
          <button type="button" data-region="East" class="place-region-btn px-3 py-1 rounded-xl font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition whitespace-nowrap">
            East
          </button>
          <button type="button" data-region="North-East" class="place-region-btn px-3 py-1 rounded-xl font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition whitespace-nowrap">
            North-East
          </button>
          <button type="button" data-region="Central" class="place-region-btn px-3 py-1 rounded-xl font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition whitespace-nowrap">
            Central
          </button>
        </div>
      </div>

      <!-- RESULTS LIST CONTAINER WITH LOADED IMAGES -->
      <div id="place-picker-results" class="p-3 sm:p-4 overflow-y-auto flex-1 space-y-2.5 max-h-[50vh]">
        <!-- Items rendered by renderItems() -->
      </div>

      <!-- FOOTER -->
      <div class="p-3 sm:px-5 sm:py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
        <span class="flex items-center space-x-1.5">
          <i data-lucide="shield-check" class="w-4 h-4 text-emerald-500"></i>
          <span>DGCA, IRCTC & State Transport Hubs Synchronized</span>
        </span>
        <span class="font-mono text-[11px] text-slate-400">Press ESC to dismiss</span>
      </div>

    </div>
  `;

  document.body.appendChild(modalEl);
  activePickerModal = modalEl;
  if (window.lucide) window.lucide.createIcons();

  const searchInput = document.getElementById('place-picker-search-input');
  const resultsContainer = document.getElementById('place-picker-results');
  let selectedRegion = 'all';

  function renderItems(filterQuery = '') {
    const q = filterQuery.toLowerCase().trim();
    const filtered = dataset.filter(item => {
      const matchRegion = selectedRegion === 'all' || item.region === selectedRegion || (selectedRegion === 'East' && (item.region === 'East' || item.region === 'North-East'));
      if (!matchRegion) return false;
      if (!q) return true;
      return (
        item.primary.toLowerCase().includes(q) ||
        item.secondary.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q)) ||
        (item.code && item.code.toLowerCase().includes(q)) ||
        (item.tag && item.tag.toLowerCase().includes(q))
      );
    });

    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <div class="py-12 text-center space-y-2">
          <i data-lucide="map-pin-off" class="w-8 h-8 mx-auto text-slate-400"></i>
          <p class="font-bold text-slate-700 dark:text-slate-300">No matching transit hubs found for "${filterQuery}"</p>
          <p class="text-xs text-slate-400">Try searching another city (e.g. Goa, Jaipur, Mumbai, Manali) or select 'All Regions'</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    resultsContainer.innerHTML = filtered.map(item => `
      <div 
        class="place-item group flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#810B38] dark:hover:border-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 cursor-pointer transition-all duration-200 hover:shadow-md"
        data-primary="${item.primary.replace(/"/g, '&quot;')}"
        data-code="${item.code || ''}">
        
        <div class="flex items-center space-x-3.5 min-w-0">
          <!-- Loaded High Quality Destination / Transit Hub Image -->
          <div class="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-slate-200/60 dark:border-slate-700/60 group-hover:scale-105 transition-transform duration-200 bg-slate-100 dark:bg-slate-800">
            <img 
              src="${item.img || getPlacePhoto(item.primary, item.badge)}" 
              alt="${item.primary}" 
              loading="lazy"
              class="w-full h-full object-cover" 
              onerror="this.onerror=null; this.src='/static/assets/destinations/goa_beach_sunset.jpg';"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
            <span class="absolute bottom-1 left-1.5 font-mono text-[9px] font-black text-white px-1 py-0.2 rounded bg-black/50 backdrop-blur-xs">
              ${item.code && item.code.length <= 4 ? item.code : (item.badge || 'IND').slice(0, 4)}
            </span>
          </div>

          <div class="min-w-0">
            <div class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-[#810B38] dark:group-hover:text-red-400 transition truncate">
              ${item.primary}
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              ${item.secondary}
            </div>
            <div class="flex items-center space-x-1.5 mt-1 text-[10.5px]">
              <span class="font-bold text-slate-600 dark:text-slate-300">${item.badge || ''}</span>
              ${item.tag ? `
                <span class="text-slate-300 dark:text-slate-600">&bull;</span>
                <span class="font-semibold text-amber-600 dark:text-amber-400">${item.tag}</span>
              ` : ''}
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-2 shrink-0 ml-3">
          <span class="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-[#810B38] group-hover:text-white transition shadow-xs">
            <span>Select</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </span>
          <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 group-hover:text-[#810B38] group-hover:translate-x-0.5 transition sm:hidden"></i>
        </div>

      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();

    // Attach click listeners to cards
    resultsContainer.querySelectorAll('.place-item').forEach(el => {
      el.addEventListener('click', () => {
        const val = el.getAttribute('data-primary');
        const code = el.getAttribute('data-code');
        selectPlace(val, code);
      });
    });
  }

  function selectPlace(value, code) {
    if (targetInputId) {
      const inp = document.getElementById(targetInputId);
      if (inp) {
        inp.value = value;
        inp.dispatchEvent(new Event('change', { bubbles: true }));
        inp.dispatchEvent(new Event('input', { bubbles: true }));
      }

      // Sync specific window search variables so the card updates instantly
      if (targetInputId === 'search-from-city') window.landingFromCity = value;
      else if (targetInputId === 'search-to-city') window.landingToCity = value;
      else if (targetInputId === 'hotel-city') { window.landingHotelCity = value; window.landingToCity = value; }
      else if (targetInputId === 'package-dest') { window.landingPackageDest = value; window.landingToCity = value; }
      else if (targetInputId === 'cab-pickup') window.landingCabPickup = value;
      else if (targetInputId === 'cab-drop') { window.landingCabDrop = value; window.landingToCity = value; }
      else if (targetInputId === 'train-from') window.landingTrainFrom = value;
      else if (targetInputId === 'train-to') { window.landingTrainTo = value; window.landingToCity = value; }

      // Also set in state to trigger live reactivity
      store.setState({ searchToCity: value });
    }

    if (typeof onSelect === 'function') {
      onSelect(value, code);
    }

    store.addToast(`Selected: ${value}`, 'success', 2500);
    closePlacePicker();
  }

  // Quick select helper from trending chips
  window.quickSelectPickerItem = function(name, code) {
    const match = dataset.find(d => d.primary.toLowerCase().includes(name.toLowerCase()) || (d.code && d.code === code));
    if (match) {
      selectPlace(match.primary, match.code);
    } else {
      selectPlace(`${name} (${code})`, code);
    }
  };

  // Handle Input typing
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderItems(e.target.value);
    });
    setTimeout(() => { searchInput.focus(); }, 100);
  }

  // Handle Region filter pill clicks
  modalEl.querySelectorAll('.place-region-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modalEl.querySelectorAll('.place-region-btn').forEach(b => {
        b.className = 'place-region-btn px-3 py-1 rounded-xl font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition whitespace-nowrap';
      });
      btn.className = 'place-region-btn px-3 py-1 rounded-xl font-bold bg-[#810B38] text-white transition whitespace-nowrap shadow-sm';
      selectedRegion = btn.getAttribute('data-region') || 'all';
      renderItems(searchInput ? searchInput.value : '');
    });
  });

  // Handle Escape key
  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      closePlacePicker();
      document.removeEventListener('keydown', handleKeydown);
    }
  };
  document.addEventListener('keydown', handleKeydown);

  // Initial render
  renderItems();
}

export function closePlacePicker() {
  if (activePickerModal) {
    activePickerModal.remove();
    activePickerModal = null;
  }
}

// Global window exposure
window.openPlacePicker = openPlacePicker;
window.closePlacePicker = closePlacePicker;
