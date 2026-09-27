import { store } from '../store.js';

// Curated Popular Indian Destinations for Instant Search Palette with Real Imagery
const POPULAR_DISTRICTS = [
  { name: 'Goa', state: 'Goa', region: 'West India', tag: '🏖️ Beach & Coastal', image: '/static/assets/destinations/goa_beach_sunset.jpg', desc: 'Pristine beaches, Portuguese forts, watersports & vibrant nightlife' },
  { name: 'Jaipur', state: 'Rajasthan', region: 'North India', tag: '🏛️ Royal Heritage', image: '/static/assets/destinations/jaipur_royal_palace.jpg', desc: 'Amer Fort, Hawa Mahal, royal Rajputana palaces & bazaars' },
  { name: 'Manali', state: 'Himachal Pradesh', region: 'North India', tag: '🏔️ Snow Peaks', image: '/static/assets/destinations/manali_snow_peaks.jpg', desc: 'Snow-capped Rohtang Pass, apple orchards & alpine pine ridges' },
  { name: 'Srinagar', state: 'Jammu & Kashmir', region: 'North India', tag: '🛶 Dal Lake Shikara', image: '/static/assets/destinations/kashmir_snow_resort.jpg', desc: 'Dal Lake houseboats, Mughal gardens & snowy Gulmarg peaks' },
  { name: 'Kerala Backwaters', state: 'Kerala', region: 'South India', tag: '🌴 Houseboats & Mist', image: '/static/assets/destinations/kerala_houseboat_lake.jpg', desc: 'Rolling emerald tea plantations, Alleppey houseboats & Ayurveda' },
  { name: 'Udaipur', state: 'Rajasthan', region: 'North India', tag: '🏰 Lake Palace City', image: '/static/assets/destinations/udaipur_lake_palace.jpg', desc: 'City of Lakes, grand City Palace & romantic royal sunset cruises' },
  { name: 'Varanasi', state: 'Uttar Pradesh', region: 'North India', tag: '🕉️ Sacred Ghats', image: '/static/assets/destinations/varanasi_ganga_ghats.jpg', desc: 'Ancient Ganga ghats, sacred evening Aarti & Banarasi silk heritage' },
  { name: 'Andaman & Nicobar', state: 'Andaman', region: 'Islands', tag: '🤿 Coral Reefs', image: '/static/assets/destinations/andaman_havelock_beach.jpg', desc: 'Radhanagar white sand beach, scuba diving & turquoise waters' },
  { name: 'Leh Ladakh', state: 'Ladakh', region: 'North India', tag: '🏍️ Himalayan Passes', image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=500&q=80', desc: 'High-altitude passes, Pangong Tso, Nubra valley & monasteries' },
  { name: 'Agra', state: 'Uttar Pradesh', region: 'North India', tag: '🕌 Taj Mahal Wonder', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&q=80', desc: 'UNESCO Taj Mahal, Agra Fort, Mehtab Bagh & Mughal legacy' },
  { name: 'Amritsar', state: 'Punjab', region: 'North India', tag: '✨ Golden Temple', image: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=500&q=80', desc: 'Sri Harmandir Sahib, Wagah border ceremony & rich Punjabi food' },
  { name: 'Rishikesh', state: 'Uttarakhand', region: 'North India', tag: '🌊 White Water Rafting', image: 'https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?w=500&q=80', desc: 'Yoga capital of the world, white water river rafting & Ganga beaches' },
  { name: 'Munnar', state: 'Kerala', region: 'South India', tag: '🍵 Tea Gardens', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=500&q=80', desc: 'Rolling emerald tea plantations, waterfalls & Western Ghats mist' },
  { name: 'Hampi', state: 'Karnataka', region: 'South India', tag: '🛕 UNESCO Ancient Ruins', image: 'https://images.unsplash.com/photo-1600100397608-f010f443b749?w=500&q=80', desc: 'Vijayanagara empire stone temples, giant boulders & Tungabhadra' },
  { name: 'Darjeeling', state: 'West Bengal', region: 'East India', tag: '🚂 Toy Train & Kanchenjunga', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&q=80', desc: 'UNESCO Himalayan Toy Train, Tiger Hill sunrise & premier tea estates' },
  { name: 'Puri', state: 'Odisha', region: 'East India', tag: '🌊 Jagannath & Coast', image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=500&q=80', desc: 'Shree Jagannath sacred temple, Konark Sun Temple chariot & beaches' },
  { name: 'Jaisalmer', state: 'Rajasthan', region: 'North India', tag: '🐪 Golden Sand Dunes', image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=500&q=80', desc: 'Thar desert camel safaris, Sonar Qila living fort & campfires' },
  { name: 'Ooty & Nilgiris', state: 'Tamil Nadu', region: 'South India', tag: '🌲 Blue Mountain Pines', image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=500&q=80', desc: 'UNESCO Nilgiri Mountain Toy Train, botanical gardens & tea hills' },
  { name: 'Coorg', state: 'Karnataka', region: 'South India', tag: '☕ Coffee Valleys', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=500&q=80', desc: 'Misty hills, coffee plantations, Abbey Falls & Tibetan monastery' },
  { name: 'Mumbai', state: 'Maharashtra', region: 'West India', tag: '🏙️ Gateway & Coast', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&q=80', desc: 'Marine Drive Queen necklace, Gateway of India & street food' },
  { name: 'New Delhi', state: 'Delhi', region: 'North India', tag: '🇮🇳 Capital Monuments', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&q=80', desc: 'India Gate, Red Fort, Qutub Minar & premier airport connectivity' }
];

export function renderNavbar() {
  const state = store.getState();
  const user = state.user || { name: 'Krishna Singh', email: 'traveler@travora.demo', role: 'traveler' };
  const role = state.activeRole || (user ? user.role : 'traveler');
  const isOperator = role === 'operator';
  const isBusiness = role === 'business_operator';
  const isAdmin = role === 'admin';
  const isDark = state.theme === 'dark';
  const unreadCount = (state.notifications || []).filter(n => !n.is_read).length;
  const isMobileNavOpen = !!window.isMobileNavOpen;
  const isCommandSearchOpen = !!window.isCommandSearchOpen;
  const isProfileDropdownOpen = !!window.isProfileDropdownOpen;
  const currentView = state.currentView;
  const landingSearchTab = window.landingSearchTab || state.landingSearchTab || 'flights';
  const operatorPendingAlertsCount = ((state.operatorAlerts || []).filter(a => a.status === 'pending').length) ||
    ((state.operatorData && state.operatorData.active_tours) ? state.operatorData.active_tours.filter(t => t.status === 'alert' || t.status === 'attention' || t.has_pending_alert).length : 0);

  // Role badges & styling configuration
  const roleConfig = {
    traveler: {
      label: 'VERIFIED TRAVELLER',
      color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      dot: 'bg-emerald-500',
      icon: 'compass',
      homeView: 'landing'
    },
    operator: {
      label: 'CERTIFIED OPERATOR',
      color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
      dot: 'bg-amber-500',
      icon: 'building-2',
      homeView: 'operator_dash'
    },
    business_operator: {
      label: 'CORPORATE PARTNER',
      color: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
      dot: 'bg-blue-500',
      icon: 'briefcase',
      homeView: 'business_operator'
    },
    admin: {
      label: 'PLATFORM ADMIN',
      color: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
      dot: 'bg-purple-500',
      icon: 'shield-check',
      homeView: 'admin_dash'
    }
  }[role] || {
    label: 'TRAVELLER',
    color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    dot: 'bg-emerald-500',
    icon: 'compass',
    homeView: 'landing'
  };

  const userName = user.name || 'Krishna Singh';
  const userInitials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'KS';

  return `
    <header class="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-md transition-all duration-300">
      
      <!-- TOP MICRO BAR -->
      <div class="hidden md:block bg-[#1f0308] text-slate-200 text-[11px] py-1 border-b border-[#3b0810]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          <!-- LEFT: Official Brand Indicator -->
          <div class="flex items-center space-x-2">
            <span class="relative flex h-1.5 w-1.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span class="text-white font-extrabold tracking-wider uppercase text-[10px]">
              TRAVORA Official
            </span>
            <span class="text-slate-400 font-medium text-[9.5px] hidden sm:inline">&bull; India's #1 Dynamic Tour Platform</span>
          </div>

          <!-- RIGHT: Prime Perk Badge, 24x7 Helpline & Quick Links -->
          <div class="flex items-center space-x-3 text-[10px]">
            
            <!-- Shimmering TRAVORA Prime Badge -->
            <div 
              onclick="window.switchYatraServiceTab('flights')" 
              class="cursor-pointer flex items-center space-x-1 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/25 bg-amber-500/10 hover:border-amber-400 transition"
              title="TRAVORA Prime: Zero Convenience Fees on Flights & Stays">
              <i data-lucide="crown" class="w-2.5 h-2.5 text-amber-400"></i>
              <span class="text-[9.5px]">TRAVORA Prime &bull; Zero Convenience Fees</span>
            </div>

            <span class="opacity-20 text-[9px]">|</span>

            <!-- Concierge Helpline -->
            <a 
              href="tel:+911244180810" 
              class="flex items-center space-x-1 text-slate-300 hover:text-white transition"
              title="24×7 Emergency Concierge & Booking Support">
              <i data-lucide="phone-call" class="w-2.5 h-2.5 text-[#ea2330]"></i>
              <span class="text-slate-400">24×7 Concierge:</span>
              <strong class="text-white font-mono font-bold">+91 124 4180810</strong>
            </a>

            ${!isAdmin && currentView !== 'admin_dash' ? `
              <span class="opacity-20 text-[9px]">|</span>

              <!-- Quick My Bookings Link -->
              <button 
                onclick="window.navigateView('my_bookings')" 
                class="flex items-center space-x-1 text-slate-200 hover:text-white font-bold transition hover:underline"
                title="Access your booked itineraries, flight e-tickets and vouchers">
                <i data-lucide="ticket" class="w-2.5 h-2.5 text-emerald-400"></i>
                <span>My Bookings</span>
              </button>
            ` : ''}

            <span class="opacity-20 text-[9px]">|</span>

            <!-- Mobile 9:16 Studio Link -->
            <a 
              href="http://localhost:8001" 
              target="_blank"
              class="flex items-center space-x-1 text-amber-300 hover:text-white font-bold px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 hover:border-amber-400 transition"
              title="Open Dedicated Mobile View 9:16 Ratio on http://localhost:8001">
              <i data-lucide="smartphone" class="w-2.5 h-2.5 text-amber-400"></i>
              <span>📱 Mobile 9:16 (8001)</span>
            </a>

          </div>
        </div>
      </div>

      <!-- MAIN HEADER ROW -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 sm:gap-4">
        
        <!-- LEFT: BRAND LOGO & CONTEXTUAL ROLE BADGE -->
        <div class="flex items-center space-x-3 shrink-0">
          <div 
            onclick="window.navigateView('${roleConfig.homeView}')" 
            class="flex items-center space-x-2.5 cursor-pointer group select-none"
            title="TRAVORA — Home">
            <img 
              src="/static/assets/logo/travora_logo_horizontal.png" 
              alt="TRAVORA" 
              class="h-8 sm:h-9 w-auto object-contain dark:brightness-110 group-hover:scale-[1.02] transition duration-200"
            />
            
            ${role !== 'traveler' ? `
              <span class="hidden xl:inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase border shadow-sm ${roleConfig.color}">
                <span class="w-1.5 h-1.5 rounded-full ${roleConfig.dot} animate-pulse"></span>
                <span>${roleConfig.label}</span>
              </span>
            ` : ''}
          </div>
        </div>

        <!-- CENTER: PRIMARY CATEGORY SERVICE TABS -->
        <nav class="hidden lg:flex items-center space-x-0.5 xl:space-x-1">
          ${role === 'traveler' ? `
            <!-- 1. FLIGHTS TAB -->
            <button 
              onclick="window.switchYatraServiceTab('flights')" 
              class="yatra-nav-tab ${(currentView === 'landing' && (!landingSearchTab || landingSearchTab === 'flights')) ? 'active' : ''}"
              title="Search Cheap Domestic & International Flights">
              <i data-lucide="plane" class="w-4 h-4 mb-1 ${(currentView === 'landing' && (!landingSearchTab || landingSearchTab === 'flights')) ? 'text-[#810B38] dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}"></i>
              <span class="text-[11.5px] tracking-tight">Flights</span>
            </button>

            <!-- 2. HOTELS TAB -->
            <button 
              onclick="window.switchYatraServiceTab('hotels')" 
              class="yatra-nav-tab ${(currentView === 'landing' && landingSearchTab === 'hotels') ? 'active' : ''}"
              title="Book 5-Star Luxury Resorts, Heritage Haveli & Budget Hotels">
              <i data-lucide="hotel" class="w-4 h-4 mb-1 ${(currentView === 'landing' && landingSearchTab === 'hotels') ? 'text-[#810B38] dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}"></i>
              <span class="text-[11.5px] tracking-tight">Hotels</span>
            </button>

            <!-- 3. HOLIDAYS TAB -->
            <button 
              onclick="window.switchYatraServiceTab('packages')" 
              class="yatra-nav-tab ${(currentView === 'landing' && landingSearchTab === 'packages') ? 'active' : ''}"
              title="Explore Curated All-Inclusive Indian Holiday Packages">
              <i data-lucide="palmtree" class="w-4 h-4 mb-1 ${(currentView === 'landing' && landingSearchTab === 'packages') ? 'text-[#810B38] dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}"></i>
              <span class="text-[11.5px] tracking-tight">Holidays</span>
            </button>

            <!-- 4. AI PLANNER TAB (HIGHLIGHTED WITH GRADIENT AI BADGE) -->
            <button 
              onclick="window.navigateView('planner')" 
              class="yatra-nav-tab ${currentView === 'planner' ? 'active' : ''}"
              title="TRAVORA AI Autonomous Dynamic Tour & Multi-Day Itinerary Engine">
              <div class="flex items-center space-x-1 mb-1">
                <i data-lucide="sparkles" class="w-4 h-4 ${currentView === 'planner' ? 'text-[#810B38] dark:text-red-400' : 'text-amber-500'}"></i>
                <span class="px-1 py-0.1 rounded text-[8.5px] font-black uppercase tracking-wider bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-sm">AI</span>
              </div>
              <span class="text-[11.5px] tracking-tight">AI Planner</span>
            </button>

            <!-- 5. BUSES & CABS TAB -->
            <button 
              onclick="window.switchYatraServiceTab('buses_cabs')" 
              class="yatra-nav-tab ${(currentView === 'landing' && landingSearchTab === 'buses_cabs') ? 'active' : ''}"
              title="Book Intercity Volvo AC Sleeper Buses & Outstation Cabs">
              <i data-lucide="bus" class="w-4 h-4 mb-1 ${(currentView === 'landing' && landingSearchTab === 'buses_cabs') ? 'text-[#810B38] dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}"></i>
              <span class="text-[11.5px] tracking-tight">Buses & Cabs</span>
            </button>

            <!-- 6. TRAINS TAB -->
            <button 
              onclick="window.switchYatraServiceTab('trains')" 
              class="yatra-nav-tab ${(currentView === 'landing' && landingSearchTab === 'trains') ? 'active' : ''}"
              title="Check Live IRCTC Train Berth Availability & PNR Status">
              <i data-lucide="train" class="w-4 h-4 mb-1 ${(currentView === 'landing' && landingSearchTab === 'trains') ? 'text-[#810B38] dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}"></i>
              <span class="text-[11.5px] tracking-tight">Trains</span>
            </button>

            <!-- 7. 802 DISTRICTS EXPLORER TAB -->
            <button 
              onclick="window.openDistrictCommandModal()" 
              class="yatra-nav-tab ${currentView === 'dashboard' ? 'active' : ''}"
              title="Explore all 802 Indian Districts with Live Weather, Festivals & Sensed Places">
              <div class="flex items-center space-x-1 mb-1">
                <i data-lucide="compass" class="w-4 h-4 ${currentView === 'dashboard' ? 'text-[#810B38] dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}"></i>
                <span class="px-1 py-0.1 rounded text-[8.5px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">802</span>
              </div>
              <span class="text-[11.5px] tracking-tight">802 Districts</span>
            </button>

            <!-- 8. OFFERS TAB -->
            <button 
              data-phase-btn="offers"
              onclick="window.scrollToOffersSection ? window.scrollToOffersSection() : window.switchYatraServiceTab('flights')" 
              class="yatra-nav-tab"
              title="Bank Discounts, Promo Codes & Special Airline Fares">
              <i data-lucide="tag" class="w-4 h-4 mb-1 text-slate-600 dark:text-slate-400"></i>
              <span class="text-[11.5px] tracking-tight">Offers</span>
            </button>

            <!-- 9. LIVE TRACKER TAB (WITH PULSING RADAR) -->
            <button 
              onclick="window.navigateView('tracker')" 
              class="yatra-nav-tab ${currentView === 'tracker' ? 'active' : ''}"
              title="Live Tour GPS Radar & Disruption Sense Tracker">
              <div class="relative flex items-center justify-center mb-1">
                <i data-lucide="navigation" class="w-4 h-4 ${currentView === 'tracker' ? 'text-[#810B38] dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}"></i>
                <span class="absolute -top-1 -right-1 flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <span class="text-[11.5px] tracking-tight">Live Tracker</span>
            </button>

            <!-- 10. WEATHER DIGITAL TWIN TAB (AI METEOROLOGICAL LAB) -->
            <button 
              onclick="window.navigateView('weather_twin')" 
              class="yatra-nav-tab ${currentView === 'weather_twin' ? 'active' : ''}"
              title="Weather-Driven Digital Twin & Impact Simulation Engine">
              <div class="relative flex items-center justify-center mb-1">
                <i data-lucide="cloud-lightning" class="w-4 h-4 ${currentView === 'weather_twin' ? 'text-[#810B38] dark:text-red-400' : 'text-blue-500'}"></i>
                <span class="absolute -top-1 -right-1.5 px-1 py-0.1 rounded text-[7.5px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs">Twin</span>
              </div>
              <span class="text-[11.5px] tracking-tight">Weather Twin</span>
            </button>
          ` : isOperator ? `
            <!-- OPERATOR PORTAL NAVIGATION -->
            <!-- 1. ACTIVE TOURS -->
            <button 
              onclick="window.navigateView('operator_dash'); window.setOperatorActiveTab('tours');" 
              class="yatra-nav-tab ${(currentView === 'operator_dash' && (!state.operatorActiveTab || state.operatorActiveTab === 'tours' || state.operatorActiveTab === 'roster')) ? 'active' : ''}"
              title="Monitor Real-Time Live Itineraries & Tour Rosters">
              <i data-lucide="compass" class="w-4 h-4 mb-1 ${(currentView === 'operator_dash' && (!state.operatorActiveTab || state.operatorActiveTab === 'tours' || state.operatorActiveTab === 'roster')) ? 'text-[#810B38] dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}"></i>
              <span class="text-[11.5px] tracking-tight">Active Tours</span>
            </button>

            <!-- 2. OPERATIONS ALERT -->
            <button 
              onclick="window.navigateView('operator_dash'); window.setOperatorActiveTab('alerts');" 
              class="yatra-nav-tab ${(currentView === 'operator_alerts' || (currentView === 'operator_dash' && state.operatorActiveTab === 'alerts')) ? 'active' : ''}"
              title="Critical Incident Response, Hotel Collisions & Emergency Alerts">
              <div class="relative flex items-center justify-center mb-1">
                <i data-lucide="alert-triangle" class="w-4 h-4 ${(currentView === 'operator_alerts' || (currentView === 'operator_dash' && state.operatorActiveTab === 'alerts')) ? 'text-[#810B38] dark:text-red-400' : (operatorPendingAlertsCount > 0 ? 'text-red-500 animate-pulse' : 'text-amber-500')}"></i>
                ${operatorPendingAlertsCount > 0 ? `
                  <span class="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[8px] font-black bg-red-600 text-white shadow-xs animate-bounce">${operatorPendingAlertsCount}</span>
                ` : ''}
              </div>
              <span class="text-[11.5px] tracking-tight">Operations Alert</span>
            </button>

            <!-- 3. FLEET & VENDORS -->
            <button 
              onclick="window.navigateView('operator_dash'); window.setOperatorActiveTab('fleet');" 
              class="yatra-nav-tab ${(currentView === 'operator_vendors' || (currentView === 'operator_dash' && state.operatorActiveTab === 'fleet')) ? 'active' : ''}"
              title="Transport Drivers, Cab Fleet & Verified Hotel Partners">
              <i data-lucide="truck" class="w-4 h-4 mb-1 ${(currentView === 'operator_vendors' || (currentView === 'operator_dash' && state.operatorActiveTab === 'fleet')) ? 'text-[#810B38] dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}"></i>
              <span class="text-[11.5px] tracking-tight">Fleet & Vendors</span>
            </button>

            <!-- 4. ANALYTICS -->
            <button 
              onclick="window.navigateView('operator_analytics')" 
              class="yatra-nav-tab ${currentView === 'operator_analytics' ? 'active' : ''}"
              title="Occupancy Ratios, Disruption Trends & Revenue Performance">
              <i data-lucide="bar-chart-3" class="w-4 h-4 mb-1 ${currentView === 'operator_analytics' ? 'text-[#810B38] dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}"></i>
              <span class="text-[11.5px] tracking-tight">Analytics</span>
            </button>

            <!-- 5. WEATHER TWIN -->
            <button 
              onclick="window.navigateView('weather_twin')" 
              class="yatra-nav-tab ${currentView === 'weather_twin' ? 'active' : ''}"
              title="Digital Weather Twin & Climate Hazard Telemetry">
              <div class="relative flex items-center justify-center mb-1">
                <i data-lucide="cloud-lightning" class="w-4 h-4 ${currentView === 'weather_twin' ? 'text-[#810B38] dark:text-red-400' : 'text-blue-500'}"></i>
                <span class="absolute -top-1 -right-1.5 px-1 py-0.1 rounded text-[7.5px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs">Twin</span>
              </div>
              <span class="text-[11.5px] tracking-tight">Weather Twin</span>
            </button>
          ` : isAdmin ? `
            <!-- ADMIN CONSOLE NAVIGATION -->
            <button 
              onclick="window.navigateView('admin_dash')" 
              class="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${currentView === 'admin_dash' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
              <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
              <span>Platform Telemetry</span>
            </button>
            <button 
              onclick="window.navigateView('weather_twin')" 
              class="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${currentView === 'weather_twin' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
              <i data-lucide="cloud-lightning" class="w-4 h-4 text-blue-400"></i>
              <span>Weather Twin</span>
            </button>
            <a 
              href="/db-view" 
              target="_blank"
              class="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              <i data-lucide="database" class="w-4 h-4 text-amber-500"></i>
              <span>Database Studio</span>
            </a>

          ` : isBusiness ? `
            <!-- CORPORATE TRAVEL NAVIGATION -->
            <button 
              onclick="window.navigateView('business_operator')" 
              class="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${currentView === 'business_operator' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}">
              <i data-lucide="briefcase" class="w-4 h-4"></i>
              <span>Corporate Delegations</span>
            </button>
            <button 
              onclick="window.navigateView('dashboard')" 
              class="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              <i data-lucide="compass" class="w-4 h-4 text-emerald-500"></i>
              <span>District Intelligence</span>
            </button>
          ` : ''}

          ${!isAdmin && currentView !== 'admin_dash' ? `
            <!-- ABOUT PLATFORM LINK -->
            <button 
              onclick="window.navigateView('about')" 
              class="yatra-nav-tab ${currentView === 'about' ? 'active' : ''}"
              title="About TRAVORA Architecture & Team">
              <i data-lucide="info" class="w-4 h-4 mb-1 text-slate-600 dark:text-slate-400"></i>
              <span class="text-[11.5px] tracking-tight">About</span>
            </button>
          ` : ''}
        </nav>

        <!-- RIGHT: DISTRICT COMMAND SEARCH TRIGGER, NOTIFICATIONS, THEME, ACCOUNT CAPSULE -->
        <div class="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
          
          <!-- QUICK DISTRICT & TRAVEL COMMAND SEARCH TRIGGER BUTTON -->
          <button 
            onclick="window.openDistrictCommandModal()"
            class="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-red-500 bg-slate-50 dark:bg-slate-900/90 text-xs text-slate-600 dark:text-slate-300 transition group hover:shadow-sm"
            title="Search 802 Indian Districts, Flights & Tours (Press Ctrl + K)">
            <i data-lucide="search" class="w-3.5 h-3.5 text-[#ea2330] group-hover:scale-110 transition"></i>
            <span class="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">Search Districts...</span>
            <kbd class="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-[9.5px] font-mono font-bold text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700">Ctrl K</kbd>
          </button>

          <!-- NOTIFICATIONS BELL & RICH DROPDOWN -->
          <div class="relative">
            <button 
              id="notif-btn" 
              onclick="window.toggleNotificationsDropdown()"
              class="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition relative"
              title="Notifications & Disruption Alerts">
              <i data-lucide="bell" class="w-4 h-4"></i>
              ${unreadCount > 0 ? `
                <span class="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
              ` : ''}
            </button>
            
            <div id="notif-dropdown" class="hidden absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl z-50 p-4 border border-slate-200 dark:border-slate-800">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div class="flex items-center space-x-2">
                  <span class="font-extrabold text-sm text-slate-900 dark:text-white">Notifications & Alerts</span>
                  <span class="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-bold">${unreadCount} unread</span>
                </div>
                <button onclick="window.markAllNotifsRead()" class="text-xs text-[#ea2330] hover:underline font-bold">Mark all read</button>
              </div>

              <div class="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-72 overflow-y-auto mt-2 pr-1">
                ${(state.notifications || []).length === 0 ? `
                  <div class="py-8 text-center text-xs text-slate-400">
                    <i data-lucide="check-circle-2" class="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60"></i>
                    <p class="font-semibold text-slate-700 dark:text-slate-300">All systems running smoothly</p>
                    <p class="text-[11px] text-slate-400 mt-0.5">No disruptions or flight alerts detected right now</p>
                  </div>
                ` : state.notifications.map(n => `
                  <div class="py-2.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl transition ${!n.is_read ? 'bg-red-50/40 dark:bg-red-950/20' : ''}">
                    <div class="flex items-start justify-between">
                      <p class="text-xs font-bold ${n.type === 'critical' ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}">${n.title}</p>
                      <span class="text-[9.5px] text-slate-400">Recent</span>
                    </div>
                    <p class="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">${n.message}</p>
                  </div>
                `).join('')}
              </div>

              <!-- Quick action in notifications -->
              <div class="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button 
                  onclick="window.navigateView('tracker')" 
                  class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1">
                  <i data-lucide="navigation" class="w-3 h-3"></i>
                  <span>Open Live Radar</span>
                </button>
                ${!isAdmin && currentView !== 'admin_dash' ? `
                <button 
                  onclick="window.navigateView('my_bookings')" 
                  class="text-[11px] font-bold text-[#810B38] dark:text-red-400 hover:underline">
                  View Bookings &rarr;
                </button>
                ` : ''}
              </div>
            </div>
          </div>

          <!-- THEME TOGGLE (SUN / MOON) -->
          <button 
            onclick="window.toggleTheme()" 
            class="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition"
            title="Toggle Light / Dark Mode">
            <i data-lucide="${isDark ? 'sun' : 'moon'}" class="w-4 h-4 transition transform hover:rotate-45"></i>
          </button>

          ${state.isAuthenticated ? `
            <!-- USER ACCOUNT CAPSULE WITH RICH DROPDOWN MENU -->
            <div class="relative">
              <button 
                onclick="window.toggleProfileDropdown()" 
                class="flex items-center space-x-2 pl-1.5 pr-2.5 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500 transition group text-left shadow-sm"
                title="Account Menu, Bookings & Portal Settings">
                
                <!-- Avatar Circle with Verified Ring -->
                <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#810B38] via-[#ea2330] to-amber-400 p-[2px] shadow-sm shrink-0">
                  <div class="w-full h-full rounded-[10px] bg-slate-950 text-white flex items-center justify-center text-xs font-black">
                    ${userInitials}
                  </div>
                </div>

                <div class="hidden sm:block text-left">
                  <div class="text-xs font-extrabold text-slate-900 dark:text-white truncate max-w-[110px] leading-tight group-hover:text-[#ea2330] transition">
                    ${userName.split(' ')[0]}
                  </div>
                  <div class="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 leading-none mt-0.5 flex items-center space-x-0.5">
                    <span>Verified</span>
                    <i data-lucide="check" class="w-2.5 h-2.5"></i>
                  </div>
                </div>

                <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400 group-hover:text-[#ea2330] transition"></i>
              </button>

              <!-- Interactive User Account Dropdown -->
              <div 
                id="profile-dropdown-menu" 
                class="${isProfileDropdownOpen ? '' : 'hidden'} absolute right-0 mt-3 w-64 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl z-50 p-3 border border-slate-200 dark:border-slate-800 animate-fadeIn">
                
                <div class="p-3 rounded-2xl bg-gradient-to-r from-red-500/10 to-amber-500/10 dark:from-red-950/30 dark:to-slate-800 mb-2">
                  <p class="text-xs font-black text-slate-900 dark:text-white truncate">${userName}</p>
                  <p class="text-[10px] text-slate-500 dark:text-slate-400 truncate">${user.email}</p>
                  <span class="mt-2 inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${roleConfig.color}">
                    <span class="w-1.5 h-1.5 rounded-full ${roleConfig.dot}"></span>
                    <span>${roleConfig.label}</span>
                  </span>
                </div>

                <div class="space-y-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <button 
                    onclick="window.openProfileModal(); window.toggleProfileDropdown();" 
                    class="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2 transition">
                    <i data-lucide="user" class="w-4 h-4 text-[#ea2330]"></i>
                    <span>Profile & Preferences</span>
                  </button>

                  ${!isAdmin && currentView !== 'admin_dash' ? `
                    <button 
                      onclick="window.navigateView('my_bookings'); window.toggleProfileDropdown();" 
                      class="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2 transition">
                      <i data-lucide="ticket" class="w-4 h-4 text-emerald-500"></i>
                      <span>My Trips & Tickets</span>
                    </button>
                  ` : ''}

                  <button 
                    onclick="window.navigateView('tracker'); window.toggleProfileDropdown();" 
                    class="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2 transition">
                    <i data-lucide="navigation" class="w-4 h-4 text-blue-500"></i>
                    <span>Live GPS Tour Tracker</span>
                  </button>

                  <div class="my-1.5 border-t border-slate-100 dark:border-slate-800"></div>

                  <div class="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 px-3 py-0.5">Switch Portal View</div>
                  ${!isOperator ? `
                  <button 
                    data-phase-btn="traveler"
                    onclick="window.openPhase('traveler'); window.toggleProfileDropdown();" 
                    class="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2 text-[11.5px] transition ${role === 'traveler' ? 'text-emerald-600 font-extrabold' : ''}">
                    <i data-lucide="compass" class="w-3.5 h-3.5 text-emerald-500"></i>
                    <span>Traveller Platform</span>
                  </button>
                  ` : ''}
                  <button 
                    data-phase-btn="operator"
                    onclick="window.openPhase('operator'); window.toggleProfileDropdown();" 
                    class="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2 text-[11.5px] transition ${role === 'operator' ? 'text-amber-600 font-extrabold' : ''}">
                    <i data-lucide="building-2" class="w-3.5 h-3.5 text-amber-500"></i>
                    <span>Operator Dispatch Hub</span>
                  </button>
                  <button 
                    data-phase-btn="business_operator"
                    onclick="window.openPhase('business_operator'); window.toggleProfileDropdown();" 
                    class="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2 text-[11.5px] transition ${role === 'business_operator' ? 'text-blue-600 font-extrabold' : ''}">
                    <i data-lucide="briefcase" class="w-3.5 h-3.5 text-blue-500"></i>
                    <span>Corporate Travel</span>
                  </button>
                  <button 
                    data-phase-btn="admin"
                    onclick="window.openPhase('admin'); window.toggleProfileDropdown();" 
                    class="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2 text-[11.5px] transition ${role === 'admin' ? 'text-purple-600 font-extrabold' : ''}">
                    <i data-lucide="shield-check" class="w-3.5 h-3.5 text-purple-500"></i>
                    <span>Platform Admin</span>
                  </button>

                  <div class="my-1.5 border-t border-slate-100 dark:border-slate-800"></div>

                  <button 
                    onclick="window.handleLogout(); window.toggleProfileDropdown();" 
                    class="w-full text-left px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center space-x-2 transition font-bold">
                    <i data-lucide="log-out" class="w-4 h-4"></i>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          ` : `
            <!-- SIGN IN BUTTON (PREMIUM TRAVORA BURGUNDY-WINE GRADIENT) -->
            <button 
              data-auth-trigger="true"
              onclick="window.openLoginPopup('login')" 
              class="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-white text-xs font-black shadow-md transition flex items-center space-x-1.5 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 cursor-pointer"
              style="background:linear-gradient(135deg,#810B38,#541A1A);box-shadow:0 4px 14px rgba(129,11,56,0.35);"
              title="Sign in to your TRAVORA account">
              <i data-lucide="log-in" class="w-3.5 h-3.5"></i>
              <span>Login / Sign Up</span>
            </button>
          `}

          <!-- MOBILE MENU HAMBURGER -->
          <button 
            type="button" 
            onclick="window.toggleMobileNav()" 
            class="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition"
            title="Toggle Navigation Menu">
            <i data-lucide="${isMobileNavOpen ? 'x' : 'menu'}" class="w-5 h-5"></i>
          </button>

        </div>
      </div>

    <!-- ===================================================================
         MOBILE RESPONSIVE NAVIGATION DRAWER
         =================================================================== -->
    ${isMobileNavOpen ? `
        <div class="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-[#120206]/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3 animate-fadeIn shadow-2xl">
          
          <!-- Mobile Search Trigger -->
          <button 
            onclick="window.openDistrictCommandModal(); window.toggleMobileNav();"
            class="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm">
            <div class="flex items-center space-x-2">
              <i data-lucide="search" class="w-4 h-4 text-[#ea2330]"></i>
              <span>Search 802 Indian Districts...</span>
            </div>
            <span class="px-2 py-0.5 rounded bg-red-500/10 text-red-600 font-mono font-bold text-[10px]">802</span>
          </button>

          <!-- Category Quick Grid -->
          <div class="grid grid-cols-3 gap-2 pt-1">
            ${isOperator ? `
              <button 
                onclick="window.navigateView('operator_dash'); window.setOperatorActiveTab('tours'); window.toggleMobileNav();" 
                class="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col items-center justify-center space-y-1 hover:border-red-500 transition">
                <i data-lucide="compass" class="w-5 h-5 text-red-600"></i>
                <span class="text-[11px] font-bold text-slate-800 dark:text-slate-200">Active Tours</span>
              </button>

              <button 
                onclick="window.navigateView('operator_dash'); window.setOperatorActiveTab('alerts'); window.toggleMobileNav();" 
                class="p-3 rounded-2xl border ${operatorPendingAlertsCount > 0 ? 'border-red-500/50 bg-red-500/5' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60'} flex flex-col items-center justify-center space-y-1 hover:border-red-500 transition relative">
                <i data-lucide="alert-triangle" class="w-5 h-5 ${operatorPendingAlertsCount > 0 ? 'text-red-600' : 'text-amber-500'}"></i>
                <span class="text-[11px] font-bold text-slate-800 dark:text-slate-200">Alerts</span>
                ${operatorPendingAlertsCount > 0 ? `<span class="absolute top-1.5 right-1.5 px-1.5 py-0.2 rounded-full text-[8px] font-black bg-red-600 text-white">${operatorPendingAlertsCount}</span>` : ''}
              </button>

              <button 
                onclick="window.navigateView('operator_dash'); window.setOperatorActiveTab('fleet'); window.toggleMobileNav();" 
                class="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col items-center justify-center space-y-1 hover:border-red-500 transition">
                <i data-lucide="truck" class="w-5 h-5 text-indigo-500"></i>
                <span class="text-[11px] font-bold text-slate-800 dark:text-slate-200">Fleet & Vendors</span>
              </button>

              <button 
                onclick="window.navigateView('operator_analytics'); window.toggleMobileNav();" 
                class="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col items-center justify-center space-y-1 hover:border-red-500 transition">
                <i data-lucide="bar-chart-3" class="w-5 h-5 text-emerald-500"></i>
                <span class="text-[11px] font-bold text-slate-800 dark:text-slate-200">Analytics</span>
              </button>

              <button 
                onclick="window.navigateView('weather_twin'); window.toggleMobileNav();" 
                class="p-3 rounded-2xl border border-blue-500/30 bg-blue-500/5 flex flex-col items-center justify-center space-y-1 hover:border-blue-500 transition">
                <i data-lucide="cloud-lightning" class="w-5 h-5 text-blue-500"></i>
                <span class="text-[11px] font-bold text-blue-600 dark:text-blue-400">Weather Twin</span>
              </button>

              <button 
                onclick="window.openDistrictCommandModal(); window.toggleMobileNav();" 
                class="p-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex flex-col items-center justify-center space-y-1 hover:border-amber-500 transition">
                <i data-lucide="search" class="w-5 h-5 text-amber-500"></i>
                <span class="text-[11px] font-bold text-amber-600 dark:text-amber-400">802 Districts</span>
              </button>
            ` : `
              <button 
                onclick="window.switchYatraServiceTab('flights'); window.toggleMobileNav();" 
                class="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col items-center justify-center space-y-1 hover:border-red-500 transition">
                <i data-lucide="plane" class="w-5 h-5 text-red-600"></i>
                <span class="text-[11px] font-bold text-slate-800 dark:text-slate-200">Flights</span>
              </button>

              <button 
                onclick="window.switchYatraServiceTab('hotels'); window.toggleMobileNav();" 
                class="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col items-center justify-center space-y-1 hover:border-red-500 transition">
                <i data-lucide="hotel" class="w-5 h-5 text-amber-500"></i>
                <span class="text-[11px] font-bold text-slate-800 dark:text-slate-200">Hotels</span>
              </button>

              <button 
                onclick="window.switchYatraServiceTab('packages'); window.toggleMobileNav();" 
                class="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col items-center justify-center space-y-1 hover:border-red-500 transition">
                <i data-lucide="palmtree" class="w-5 h-5 text-emerald-500"></i>
                <span class="text-[11px] font-bold text-slate-800 dark:text-slate-200">Holidays</span>
              </button>

              <button 
                onclick="window.navigateView('planner'); window.toggleMobileNav();" 
                class="p-3 rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-500/10 to-amber-500/10 flex flex-col items-center justify-center space-y-1">
                <i data-lucide="sparkles" class="w-5 h-5 text-[#810B38] dark:text-red-400"></i>
                <span class="text-[11px] font-extrabold text-[#810B38] dark:text-red-400">AI Planner</span>
              </button>

              <button 
                onclick="window.switchYatraServiceTab('buses_cabs'); window.toggleMobileNav();" 
                class="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col items-center justify-center space-y-1 hover:border-red-500 transition">
                <i data-lucide="bus" class="w-5 h-5 text-indigo-500"></i>
                <span class="text-[11px] font-bold text-slate-800 dark:text-slate-200">Buses & Cabs</span>
              </button>

              <button 
                onclick="window.switchYatraServiceTab('trains'); window.toggleMobileNav();" 
                class="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col items-center justify-center space-y-1 hover:border-red-500 transition">
                <i data-lucide="train" class="w-5 h-5 text-blue-500"></i>
                <span class="text-[11px] font-bold text-slate-800 dark:text-slate-200">Trains</span>
              </button>
            `}
          </div>

          <!-- Secondary Links List -->
          <div class="space-y-1 border-t border-slate-100 dark:border-slate-800 pt-2 font-bold text-xs">
            ${!isAdmin && currentView !== 'admin_dash' ? `
              <button 
                onclick="window.navigateView('my_bookings'); window.toggleMobileNav();" 
                class="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center space-x-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                <i data-lucide="ticket" class="w-4 h-4 text-emerald-500"></i>
                <span>My Trips & Bookings</span>
              </button>
            ` : ''}

            <button 
              data-phase-btn="offers"
              onclick="window.scrollToOffersSection ? window.scrollToOffersSection() : window.switchYatraServiceTab('flights'); window.toggleMobileNav();" 
              class="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center space-x-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
              <i data-lucide="tag" class="w-4 h-4 text-amber-500"></i>
              <span>Special Offers & Bank Discounts</span>
            </button>

            <button 
              onclick="window.navigateView('tracker'); window.toggleMobileNav();" 
              class="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center space-x-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
              <i data-lucide="navigation" class="w-4 h-4 text-emerald-500"></i>
              <span>Live Tour GPS Radar</span>
            </button>

            <button 
              onclick="window.navigateView('weather_twin'); window.toggleMobileNav();" 
              class="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center space-x-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
              <i data-lucide="cloud-lightning" class="w-4 h-4 text-blue-500"></i>
              <span>Weather-Driven Digital Twin</span>
            </button>


            ${!isAdmin && currentView !== 'admin_dash' ? `
              <button 
                onclick="window.navigateView('about'); window.toggleMobileNav();" 
                class="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center space-x-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                <i data-lucide="info" class="w-4 h-4 text-blue-500"></i>
                <span>About TRAVORA Platform</span>
              </button>
            ` : ''}
          </div>

          <!-- Mobile Portal Switcher Section -->
          <div class="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3.5 py-1">Platform Portals</div>
            <div class="grid grid-cols-2 gap-2">
              ${!isOperator ? `
              <button data-phase-btn="traveler" onclick="window.openPhase('traveler'); window.toggleMobileNav();" class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-slate-50 dark:bg-slate-900/40">
                <i data-lucide="compass" class="w-4 h-4"></i>
                <span>Traveller View</span>
              </button>
              ` : ''}
              <button data-phase-btn="operator" onclick="window.openPhase('operator'); window.toggleMobileNav();" class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 bg-slate-50 dark:bg-slate-900/40">
                <i data-lucide="building-2" class="w-4 h-4"></i>
                <span>Operator Hub</span>
              </button>
              <button data-phase-btn="business_operator" onclick="window.openPhase('business_operator'); window.toggleMobileNav();" class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-slate-900/40">
                <i data-lucide="briefcase" class="w-4 h-4"></i>
                <span>TRAVORA Business</span>
              </button>
              <button data-phase-btn="admin" onclick="window.openPhase('admin'); window.toggleMobileNav();" class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-xs font-bold text-purple-600 dark:text-purple-400 bg-slate-50 dark:bg-slate-900/40">
                <i data-lucide="shield-check" class="w-4 h-4"></i>
                <span>Admin Console</span>
              </button>
            </div>
          </div>

          <!-- Helpline & Prime Perks in Mobile -->
          <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span class="flex items-center space-x-1">
              <i data-lucide="phone-call" class="w-3.5 h-3.5 text-[#ea2330]"></i>
              <span>+91 124 4180810</span>
            </span>
            <span class="text-amber-500 font-bold flex items-center space-x-1">
              <i data-lucide="crown" class="w-3.5 h-3.5"></i>
              <span>TRAVORA Prime</span>
            </span>
          </div>

        </div>
      ` : ''}

    </header>
  `;
}

// ===================================================================
// INSTANT DISTRICT & TRAVEL COMMAND PALETTE SPOTLIGHT MODAL
// ===================================================================
export function renderDistrictCommandModal() {
  const isCommandSearchOpen = !!window.isCommandSearchOpen;
  if (!isCommandSearchOpen) return '';

  return `
    <div 
      id="nav-command-search-modal" 
      onclick="window.closeDistrictCommandModal()"
      class="fixed inset-0 z-[9999] flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/80 backdrop-blur-md transition-all duration-200">
      
      <div 
        onclick="event.stopPropagation()" 
        class="command-palette-modal w-full max-w-2xl rounded-3xl bg-white dark:bg-[#18040a] border border-slate-200 dark:border-[#4d0c1c] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Modal Search Header -->
        <div class="p-4 sm:p-5 border-b border-slate-100 dark:border-[#380715] flex items-center space-x-3 bg-slate-50/80 dark:bg-black/40">
          <div class="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-[#ea2330] shrink-0">
            <i data-lucide="search" class="w-5 h-5"></i>
          </div>
          <input 
            id="command-district-input"
            type="text" 
            placeholder="Search across 802 Indian districts, states or spots (e.g. Goa, Ladakh, Manali)..." 
            oninput="window.filterCommandDistricts(this.value)"
            class="w-full bg-transparent text-sm sm:text-base font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            autocomplete="off"
          />
          <div class="flex items-center space-x-1.5 shrink-0">
            <span class="hidden sm:inline-block px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">ESC</span>
            <button 
              onclick="window.closeDistrictCommandModal()" 
              class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              title="Close (Esc)">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <!-- Quick Filter Category Chips -->
        <div class="px-4 py-2.5 border-b border-slate-100 dark:border-[#28050e] flex items-center space-x-2 overflow-x-auto text-xs font-bold no-scrollbar bg-slate-50/40 dark:bg-black/20">
          <button onclick="window.filterCommandDistricts('')" class="px-3 py-1 rounded-full bg-[#810B38] text-white shrink-0 shadow-sm">All 802 Districts</button>
          <button onclick="window.filterCommandDistricts('Beach')" class="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0">🏖️ Beaches & Coastal</button>
          <button onclick="window.filterCommandDistricts('Himalayan')" class="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0">🏔️ Himalayan Peaks</button>
          <button onclick="window.filterCommandDistricts('Heritage')" class="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0">🏛️ Royal Heritage</button>
          <button onclick="window.filterCommandDistricts('Spiritual')" class="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0">🕉️ Spiritual Ghats</button>
        </div>

        <!-- Results Scroll Area -->
        <div id="command-results-container" class="overflow-y-auto p-3 sm:p-4 divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[50vh]">
          ${POPULAR_DISTRICTS.map((dist, idx) => `
            <div 
              onclick="window.selectCommandDistrict('${dist.name}')" 
              class="py-3 px-3 rounded-2xl hover:bg-red-50/60 dark:hover:bg-red-950/30 cursor-pointer transition flex items-center justify-between group">
              <div class="flex items-center space-x-3.5 min-w-0">
                <img src="${dist.image}" alt="${dist.name}" onerror="this.onerror=null; this.src='/static/assets/destinations/goa_beach_sunset.jpg';" class="w-12 h-12 rounded-xl object-cover shrink-0 shadow-sm group-hover:scale-105 transition" />
                <div class="min-w-0">
                  <div class="flex items-center space-x-2 flex-wrap gap-1">
                    <span class="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-[#ea2330] transition">${dist.name}</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">${dist.state}</span>
                    <span class="text-[9.5px] font-semibold text-amber-600 dark:text-amber-400">${dist.tag}</span>
                  </div>
                  <p class="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">${dist.desc}</p>
                </div>
              </div>

              <div class="flex items-center space-x-1 shrink-0 ml-3">
                <button 
                  onclick="event.stopPropagation(); window.planForDistrict('${dist.name}')" 
                  class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ea2330] to-[#810B38] text-white text-[11px] font-black hover:opacity-90 shadow-sm flex items-center space-x-1">
                  <i data-lucide="sparkles" class="w-3 h-3"></i>
                  <span>Explore</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Modal Footer with Keyboard Shortcuts -->
        <div class="px-5 py-3 bg-slate-50 dark:bg-black/50 border-t border-slate-100 dark:border-[#380715] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
          <div class="flex items-center space-x-4">
            <span>Press <kbd class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono">ESC</kbd> to exit</span>
            <span class="hidden sm:inline">Tap any destination to auto-explore</span>
          </div>
          <button 
            onclick="window.navigateView('dashboard'); window.closeDistrictCommandModal();" 
            class="text-[#810B38] dark:text-red-400 font-bold hover:underline flex items-center space-x-1">
            <span>All 802 Indian Districts &rarr;</span>
          </button>
        </div>

      </div>
    </div>
  `;
}

// Global UI Navigation Helpers
window.toggleMobileNav = function () {
  window.isMobileNavOpen = !window.isMobileNavOpen;
  store.setState({});
};

window.toggleProfileDropdown = function () {
  window.isProfileDropdownOpen = !window.isProfileDropdownOpen;
  const menu = document.getElementById('profile-dropdown-menu');
  if (menu) {
    menu.classList.toggle('hidden', !window.isProfileDropdownOpen);
  }
};

window.openDistrictCommandModal = function () {
  window.isCommandSearchOpen = true;
  store.setState({});
  setTimeout(() => {
    const el = document.getElementById('command-district-input');
    if (el) el.focus();
    if (window.lucide) window.lucide.createIcons();
  }, 50);
};

window.closeDistrictCommandModal = function () {
  window.isCommandSearchOpen = false;
  store.setState({});
};

window.filterCommandDistricts = function (query) {
  const q = (query || '').toLowerCase().trim();
  const container = document.getElementById('command-results-container');
  if (!container) return;

  const matches = POPULAR_DISTRICTS.filter(d => 
    !q || 
    d.name.toLowerCase().includes(q) || 
    d.state.toLowerCase().includes(q) || 
    d.region.toLowerCase().includes(q) || 
    d.tag.toLowerCase().includes(q) ||
    d.desc.toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-xs text-slate-400">
        <i data-lucide="map-pin-off" class="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50"></i>
        <p class="font-bold text-slate-700 dark:text-slate-300">No popular district found matching "${query}"</p>
        <p class="text-[11px] mt-1">Want to plan for this district anyway?</p>
        <button 
          onclick="window.planForDistrict('${query}')" 
          class="mt-3 px-4 py-2 rounded-xl bg-[#810B38] text-white font-extrabold text-xs shadow-md hover:bg-[#700930]">
          Plan Custom AI Itinerary for "${query}" &rarr;
        </button>
      </div>
    `;
  } else {
    container.innerHTML = matches.map(dist => `
      <div 
        onclick="window.selectCommandDistrict('${dist.name}')" 
        class="py-3 px-3 rounded-2xl hover:bg-red-50/50 dark:hover:bg-red-950/20 cursor-pointer transition flex items-center justify-between group">
        <div class="flex items-center space-x-3.5">
          <img src="${dist.image}" alt="${dist.name}" onerror="this.onerror=null; this.src='/static/assets/destinations/goa_beach_sunset.jpg';" class="w-12 h-12 rounded-xl object-cover shrink-0 shadow-sm group-hover:scale-105 transition" />
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-[#ea2330] transition">${dist.name}</span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">${dist.state}</span>
              <span class="text-[9.5px] font-semibold text-amber-600 dark:text-amber-400">${dist.tag}</span>
            </div>
            <p class="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">${dist.desc}</p>
          </div>
        </div>

        <div class="flex items-center space-x-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
          <button 
            onclick="event.stopPropagation(); window.planForDistrict('${dist.name}')" 
            class="px-2.5 py-1 rounded-lg bg-[#810B38] text-white text-[11px] font-bold hover:bg-[#700930] shadow-sm flex items-center space-x-1">
            <i data-lucide="sparkles" class="w-3 h-3"></i>
            <span>Plan AI Trip</span>
          </button>
        </div>
      </div>
    `).join('');
  }

  if (window.lucide) window.lucide.createIcons();
};

window.selectCommandDistrict = function (districtName) {
  window.closeDistrictCommandModal();
  window.landingToCity = districtName;
  window.landingHotelCity = districtName;
  window.landingPackageDest = districtName;
  store.setState({ searchToCity: districtName });
  window.switchYatraServiceTab('flights');
  store.addToast(`Selected destination: ${districtName}`, 'success', 2500);
};

window.planForDistrict = function (districtName) {
  window.closeDistrictCommandModal();
  if (window.startPlanningFor) {
    window.startPlanningFor(districtName);
  } else {
    window.navigateView('planner');
  }
};

window.startExploreDistricts = function () {
  window.openDistrictCommandModal();
};

window.switchYatraServiceTab = function (tab) {
  window.landingSearchTab = tab;
  store.setState({ landingSearchTab: tab });
  const state = store.getState();
  if (state.currentView !== 'landing') {
    window.navigateView('landing');
  }
  setTimeout(() => {
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }, 100);
};

// Global Hotkeys for Command Search (Ctrl + K or Ctrl + Q) and Escape
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function' && !window.__travoraNavKeysAttached) {
  window.__travoraNavKeysAttached = true;
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K' || e.key === 'q' || e.key === 'Q')) {
      e.preventDefault();
      if (window.isCommandSearchOpen) {
        window.closeDistrictCommandModal();
      } else {
        window.openDistrictCommandModal();
      }
    }
    if (e.key === 'Escape') {
      if (window.isCommandSearchOpen) {
        window.closeDistrictCommandModal();
      }
      if (window.isProfileDropdownOpen) {
        window.toggleProfileDropdown();
      }
    }
  });

  // Global click outside listener to close dropdowns
  window.addEventListener('click', (e) => {
    if (window.isProfileDropdownOpen && !e.target.closest('#profile-dropdown-menu') && !e.target.closest('button[onclick*="toggleProfileDropdown"]')) {
      window.isProfileDropdownOpen = false;
      const menu = document.getElementById('profile-dropdown-menu');
      if (menu) menu.classList.add('hidden');
    }

    const notifBtn = document.getElementById('notif-btn');
    const notifDropdown = document.getElementById('notif-dropdown');
    if (notifDropdown && !notifDropdown.classList.contains('hidden')) {
      if (!notifDropdown.contains(e.target) && notifBtn && !notifBtn.contains(e.target)) {
        notifDropdown.classList.add('hidden');
      }
    }

    const commandModal = document.getElementById('nav-command-search-modal');
    if (window.isCommandSearchOpen && e.target === commandModal) {
      window.closeDistrictCommandModal();
    }
  });
}
