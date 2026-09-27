import { store } from '../store.js';
import { api } from '../api.js';

export function renderAuthView() {
  const state = store.getState();
  const authMode = state.authMode || 'login'; // 'login', 'signup', or 'forgot'
  const selectedRole = state.authRole || 'traveler'; // 'traveler', 'operator', 'business_operator', or 'admin'
  const isDark = state.theme === 'dark';
  const showSplash = !window.__travoraIntroPlayed;

  // Auto-dismiss splash animation after 1.5s
  if (showSplash) {
    setTimeout(() => {
      if (typeof window.dismissSplashIntro === 'function') {
        window.dismissSplashIntro();
      }
    }, 1500);
  }

  // Role metadata with Yatra-aligned color themes & demo accounts
  const roleMeta = {
    traveler: {
      name: 'Traveller Studio',
      badge: 'Personal & Family',
      tagline: 'Book flights, hotels, trains & custom holiday packages with Zero Convenience Fees.',
      color: 'red',
      accentBg: 'bg-[#ea2330]',
      hoverBg: 'hover:bg-[#d91b28]',
      activeText: 'text-[#ea2330]',
      activeBorder: 'border-[#ea2330]',
      icon: 'compass',
      demoEmail: 'traveler@travora.demo',
      demoPass: 'password123',
      demoSubtitle: 'Krishna Singh &bull; Active Tour #TR1024',
      badgeText: 'EXPLORER PORTAL'
    },
    operator: {
      name: 'Tour Operator Dispatch',
      badge: '517+ Certified Operators',
      tagline: 'Fleet scheduling, tour booking dispatch & real-time passenger telemetry.',
      color: 'amber',
      accentBg: 'bg-amber-600',
      hoverBg: 'hover:bg-amber-700',
      activeText: 'text-amber-600',
      activeBorder: 'border-amber-500',
      icon: 'building-2',
      demoEmail: 'operator@travora.demo',
      demoPass: 'password123',
      demoSubtitle: 'Aarav Mehta &bull; Goa Coastal Expeditions',
      badgeText: 'COMMAND DISPATCH'
    },
    business_operator: {
      name: 'Corporate Mobility Hub',
      badge: 'GST Invoices & SME Fares',
      tagline: 'Corporate travel management, GST compliance, employee allowances & fast approvals.',
      color: 'blue',
      accentBg: 'bg-blue-600',
      hoverBg: 'hover:bg-blue-700',
      activeText: 'text-blue-600',
      activeBorder: 'border-blue-500',
      icon: 'briefcase',
      demoEmail: 'corporate@travora.demo',
      demoPass: 'password123',
      demoSubtitle: 'Vikram Oberoi &bull; Tata Enterprise Travel',
      badgeText: 'ENTERPRISE HUB'
    },
    admin: {
      name: 'System Admin Console',
      badge: 'Platform Telemetry',
      tagline: '802 Districts live engine, compliance oversight & platform-wide security.',
      color: 'purple',
      accentBg: 'bg-purple-600',
      hoverBg: 'hover:bg-purple-700',
      activeText: 'text-purple-600',
      activeBorder: 'border-purple-500',
      icon: 'shield-alert',
      demoEmail: 'admin@travora.demo',
      demoPass: 'password123',
      demoSubtitle: 'Platform HQ &bull; 802 Districts Telemetry',
      badgeText: 'OPS HQ'
    }
  };

  const currentRole = roleMeta[selectedRole] || roleMeta.traveler;

  return `
    <!-- ===================================================================
         CINEMATIC BRAND SPLASH TRANSITION WITH USER'S 3D EMBLEM
         =================================================================== -->
    ${showSplash ? `
      <div id="auth-splash-overlay" onclick="window.dismissSplashIntro()" class="cursor-pointer select-none">
        
        <!-- Ambient Orbit Ring & Deep Crimson Glow -->
        <div class="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none"></div>
        <div class="absolute w-[600px] h-[600px] rounded-full bg-red-600/15 blur-[120px] pointer-events-none animate-pulse"></div>
        <div class="absolute w-[450px] h-[450px] rounded-full bg-amber-500/10 blur-[100px] -bottom-24 -right-24 pointer-events-none"></div>

        <!-- Central Animated Brand Emblem -->
        <div class="relative flex flex-col items-center text-center space-y-6 z-10 px-4">
          
          <!-- Supersonic Flight Path Arc -->
          <div class="relative w-80 h-24 flex items-center justify-center">
            <svg class="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 320 90" fill="none">
              <path 
                d="M 20 75 Q 160 5 300 45" 
                stroke="url(#splashTrailRed)" 
                stroke-width="3" 
                stroke-dasharray="8 8" 
                class="flight-dash-animated opacity-80"
              />
              <defs>
                <linearGradient id="splashTrailRed" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#ea2330" stop-opacity="0" />
                  <stop offset="60%" stop-color="#ea2330" stop-opacity="1" />
                  <stop offset="100%" stop-color="#fbbf24" stop-opacity="1" />
                </linearGradient>
              </defs>
            </svg>
            <div class="splash-flight-sweep flex items-center justify-center">
              <i data-lucide="plane" class="w-8 h-8 text-white filter drop-shadow-[0_0_15px_rgba(234,35,48,0.9)]"></i>
            </div>
          </div>

          <!-- 3D Red Ribbon Emblem with Radiant Bloom -->
          <div class="splash-logo-core relative">
            <div class="absolute -inset-6 rounded-full bg-gradient-to-r from-red-600/30 via-amber-500/20 to-red-600/30 blur-2xl animate-pulse"></div>
            <img 
              src="/static/assets/logo/travora_emblem.png" 
              alt="TRAVORA 3D Emblem" 
              class="w-28 h-28 sm:w-32 sm:h-32 object-contain relative z-10 filter drop-shadow-[0_10px_35px_rgba(234,35,48,0.85)]"
            />
          </div>

          <!-- Wordmark & Tagline -->
          <div class="splash-brand-title space-y-2">
            <h1 class="text-4xl sm:text-5xl font-black tracking-[0.22em] text-white">
              TRAVORA
            </h1>
            <p class="text-xs sm:text-sm font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-300">
              Plan Freely. Travel Personally. Adapt Instantly.
            </p>
          </div>

          <!-- Yatra Red Progress Sweep -->
          <div class="splash-progress-track">
            <div class="splash-progress-fill"></div>
          </div>

          <!-- Skip hint -->
          <p class="text-[11px] text-slate-400/90 pt-3 tracking-wide flex items-center space-x-1.5 hover:text-white transition">
            <span>Tap anywhere to continue to Login</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </p>

        </div>
      </div>
    ` : ''}

    <!-- ===================================================================
         MAIN REDESIGNED YATRA.COM-STYLE LOGIN & AUTH VIEW
         =================================================================== -->
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between relative overflow-hidden transition-colors duration-300">
      
      <!-- Subtle Decorative Background Glows -->
      <div class="absolute inset-0 bg-grid-pattern opacity-25 dark:opacity-10 pointer-events-none"></div>
      <div class="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-red-600/5 dark:bg-red-600/10 blur-[130px] pointer-events-none"></div>
      <div class="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-amber-500/5 dark:bg-amber-500/5 blur-[120px] pointer-events-none"></div>

      <!-- =================================================================
           TOP UTILITY & NAVIGATION BAR
           ================================================================= -->
      <header class="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm relative z-30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <!-- Left: TRAVORA Full Logo with Tagline -->
          <div class="flex items-center space-x-4">
            <a href="javascript:void(0)" onclick="window.navigateView('landing')" class="flex items-center space-x-2.5 group">
              <img 
                src="/static/assets/logo/travora_logo_horizontal.png" 
                alt="TRAVORA" 
                class="h-10 sm:h-11 w-auto object-contain transition group-hover:scale-105"
              />
            </a>
            <div class="hidden md:flex items-center space-x-2 pl-4 border-l border-slate-200 dark:border-slate-800">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-[#ea2330] dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-900">
                <i data-lucide="shield-check" class="w-3 h-3 mr-1"></i>
                Official Portal Access
              </span>
            </div>
          </div>

          <!-- Center Promo Ticker (Desktop) -->
          <div class="hidden lg:flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400">
            <i data-lucide="tag" class="w-3.5 h-3.5 text-[#ea2330]"></i>
            <span>Use code <strong class="text-slate-900 dark:text-white font-mono font-black text-[#ea2330]">YATRAFREE</strong> for Zero Convenience Fees on your first 3 bookings!</span>
          </div>

          <!-- Right Actions: Support, Theme & Back to Explore -->
          <div class="flex items-center space-x-2 sm:space-x-3">
            
            <!-- 24x7 Customer Support Helpline -->
            <a 
              href="tel:18001029900" 
              class="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#ea2330] hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="24x7 Customer Helpline">
              <i data-lucide="phone-call" class="w-3.5 h-3.5 text-[#ea2330]"></i>
              <span class="font-mono">1800 102 9900</span>
            </a>

            <!-- Replay Intro -->
            <button 
              type="button" 
              onclick="window.replayIntro()" 
              class="p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition flex items-center space-x-1"
              title="Replay Brand Intro">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-[#ea2330]"></i>
              <span class="hidden md:inline">Intro</span>
            </button>

            <!-- Theme Switcher -->
            <button 
              type="button" 
              onclick="window.toggleTheme()" 
              class="p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition flex items-center space-x-1"
              title="Toggle Theme">
              <i data-lucide="${isDark ? 'sun' : 'moon'}" class="w-3.5 h-3.5 text-amber-500"></i>
              <span class="hidden sm:inline">${isDark ? 'Light' : 'Dark'}</span>
            </button>

            <!-- Back to Landing -->
            <button 
              type="button" 
              onclick="window.navigateView('landing')" 
              class="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center space-x-1.5">
              <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
              <span>Explore</span>
            </button>

          </div>

        </div>
      </header>

      <!-- =================================================================
           MAIN BODY: SPLIT HERO CONTAINER
           ================================================================= -->
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center relative z-20">
        <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl">
          
          <!-- ===============================================================
               LEFT COLUMN: CINEMATIC LOOPING VIDEO + BRAND OVERLAY
               =============================================================== -->
          <div class="hidden lg:flex lg:col-span-5 flex-col justify-between rounded-3xl text-white shadow-2xl relative overflow-hidden auth-video-panel">

            <!-- LOOPING BACKGROUND VIDEO -->
            <video
              id="auth-bg-video"
              class="auth-video-bg"
              src="/static/assets/videos/login_bg.mp4"
              autoplay
              muted
              loop
              playsinline
              poster="/static/assets/hero/hero_travel_banner.jpg"
            ></video>

            <!-- Cinematic Gradient Veil (ensures text legibility) -->
            <div class="auth-video-veil"></div>

            <!-- Subtle grid texture on top -->
            <div class="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-10"></div>

            <!-- BRANDED OVERLAY CONTENT -->

            <!-- Top Header & Logo Lockup -->
            <div class="space-y-6 relative z-20 p-8">
              
              <div class="flex items-center justify-between">
                <div class="bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/20 inline-flex items-center space-x-2">
                  <img 
                    src="/static/assets/logo/travora_emblem.png" 
                    alt="Emblem" 
                    class="w-6 h-6 object-contain"
                  />
                  <span class="text-xs font-black tracking-widest text-white uppercase">TRAVORA PRIME</span>
                </div>

                <div class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/40 text-white text-[11px] font-bold">
                  <span class="live-pulse-dot bg-white"></span>
                  <span>ENGINE LIVE</span>
                </div>
              </div>

              <!-- Main Hero Heading -->
              <div class="space-y-2">
                <h2 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-white drop-shadow-lg">
                  Unlock Exclusive Fares &amp; Dynamic Travel Care
                </h2>
                <p class="text-xs text-red-100/90 font-medium leading-relaxed drop-shadow">
                  Join over 1.4 million travellers and 517 certified tour operators across 802 Indian districts.
                </p>
              </div>

            </div>

            <!-- Showcase Value Bullets -->
            <div class="px-8 space-y-3 relative z-20">
              
              <div class="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start space-x-3">
                <div class="w-8 h-8 rounded-xl bg-white text-[#ea2330] flex items-center justify-center shrink-0 font-bold shadow">
                  <i data-lucide="percent" class="w-4 h-4"></i>
                </div>
                <div>
                  <div class="text-xs font-bold text-white">Zero Convenience Fees</div>
                  <div class="text-[11px] text-red-100/80">Save up to &#x20B9;450 per passenger on domestic flights, trains &amp; hotels.</div>
                </div>
              </div>

              <div class="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start space-x-3">
                <div class="w-8 h-8 rounded-xl bg-white text-[#ea2330] flex items-center justify-center shrink-0 font-bold shadow">
                  <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                </div>
                <div>
                  <div class="text-xs font-bold text-white">Dynamic Disruption Recovery</div>
                  <div class="text-[11px] text-red-100/80">Auto-rerouting &amp; instant replacement vouchers during weather or transit delays.</div>
                </div>
              </div>

              <div class="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start space-x-3">
                <div class="w-8 h-8 rounded-xl bg-white text-[#ea2330] flex items-center justify-center shrink-0 font-bold shadow">
                  <i data-lucide="gift" class="w-4 h-4"></i>
                </div>
                <div>
                  <div class="text-xs font-bold text-white">eCash &amp; Instant Bank Discounts</div>
                  <div class="text-[11px] text-red-100/80">Earn up to &#x20B9;2,500 eCash per booking with ICICI, HDFC, SBI &amp; Axis bank cards.</div>
                </div>
              </div>

              <!-- Live Disruption Resolution Snapshot -->
              <div class="p-3 rounded-2xl bg-black/35 border border-white/15 text-[11px] space-y-1.5">
                <div class="flex items-center justify-between text-[10px] text-red-200">
                  <span class="font-bold flex items-center space-x-1">
                    <i data-lucide="cpu" class="w-3 h-3 text-amber-300"></i>
                    <span>LIVE ENGINE TELEMETRY</span>
                  </span>
                  <span class="font-mono text-white/80">#TR1024</span>
                </div>
                <div class="font-bold text-white">Goa Coastal &amp; Heritage Expedition</div>
                <div class="flex items-center justify-between text-[10px] text-white font-semibold pt-1 border-t border-white/10">
                  <span>Weather Delay Rerouted in 1.4s</span>
                  <span class="bg-white/20 px-2 py-0.5 rounded text-white border border-white/40">96% MATCH</span>
                </div>
              </div>

            </div>

            <!-- Bottom Accreditations Strip -->
            <div class="px-8 pb-8 pt-4 border-t border-white/15 relative z-20 space-y-2">
              <div class="flex items-center justify-between text-[11px] text-red-100/90 font-bold">
                <span class="flex items-center space-x-1">
                  <i data-lucide="award" class="w-3.5 h-3.5 text-amber-300"></i>
                  <span>IATA Accredited</span>
                </span>
                <span class="flex items-center space-x-1">
                  <i data-lucide="check-circle" class="w-3.5 h-3.5 text-white"></i>
                  <span>IRCTC Authorized</span>
                </span>
                <span class="flex items-center space-x-1">
                  <i data-lucide="lock" class="w-3.5 h-3.5 text-white"></i>
                  <span>256-Bit SSL</span>
                </span>
              </div>
              <div class="text-[10px] text-red-200/70 text-center italic">
                Plan Freely. Travel Personally. Adapt Instantly.
              </div>
            </div>

          </div>

          <!-- ===============================================================
               RIGHT COLUMN: AUTHENTICATION FORM & ROLE CONSOLE
               =============================================================== -->
          <div class="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-3xl yatra-auth-card animate-enter">
            
            <div class="space-y-5">
              
              <!-- Card Header: Title & Logo on Mobile -->
              <div class="flex items-start justify-between">
                <div>
                  <div class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#ea2330] dark:bg-red-950/60 dark:text-red-400 mb-1.5 border border-red-200 dark:border-red-900">
                    <i data-lucide="${currentRole.icon}" class="w-3 h-3"></i>
                    <span>${currentRole.badgeText}</span>
                  </div>
                  <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    ${authMode === 'login' ? `Welcome to ${currentRole.name}` : (authMode === 'signup' ? 'Create Your Account' : 'Reset Account Password')}
                  </h1>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    ${currentRole.tagline}
                  </p>
                </div>

                <!-- 3D Logo on Mobile -->
                <div class="lg:hidden shrink-0 pl-2">
                  <img 
                    src="/static/assets/logo/travora_emblem.png" 
                    alt="TRAVORA" 
                    class="w-12 h-12 object-contain"
                  />
                </div>
              </div>

              <!-- 4-ROLE SELECTOR CAPSULES -->
              ${authMode !== 'forgot' ? `
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <span>Select Account Type</span>
                    <span class="font-mono text-[#ea2330]">${currentRole.badge}</span>
                  </div>

                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-[11px]">
                    
                    <button 
                      type="button" 
                      onclick="window.setAuthRole('traveler')"
                      class="yatra-role-pill py-2.5 px-2 rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 ${selectedRole === 'traveler' ? 'active' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}">
                      <i data-lucide="compass" class="w-3.5 h-3.5"></i>
                      <span>Traveller</span>
                    </button>

                    <button 
                      type="button" 
                      onclick="window.setAuthRole('operator')"
                      class="yatra-role-pill py-2.5 px-2 rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 ${selectedRole === 'operator' ? 'active' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}">
                      <i data-lucide="building-2" class="w-3.5 h-3.5"></i>
                      <span>Operator</span>
                    </button>

                    <button 
                      type="button" 
                      onclick="window.setAuthRole('business_operator')"
                      class="yatra-role-pill py-2.5 px-2 rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 ${selectedRole === 'business_operator' ? 'active' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}">
                      <i data-lucide="briefcase" class="w-3.5 h-3.5"></i>
                      <span>Corporate</span>
                    </button>

                    <button 
                      type="button" 
                      onclick="window.setAuthRole('admin')"
                      class="yatra-role-pill py-2.5 px-2 rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 ${selectedRole === 'admin' ? 'active' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}">
                      <i data-lucide="shield-alert" class="w-3.5 h-3.5"></i>
                      <span>Admin</span>
                    </button>

                  </div>
                </div>

                <!-- 1-CLICK INSTANT DEMO LOGIN ACCELERATOR -->
                <div class="p-3.5 rounded-2xl bg-gradient-to-r from-red-500/10 via-amber-500/5 to-red-500/10 border border-red-500/20 dark:border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 animate-enter-1">
                  <div class="flex items-center space-x-3 text-left w-full sm:w-auto">
                    <div class="w-9 h-9 rounded-xl ${currentRole.accentBg} text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                      <i data-lucide="${currentRole.icon}" class="w-4 h-4"></i>
                    </div>
                    <div>
                      <div class="font-extrabold text-xs text-slate-900 dark:text-white">${currentRole.demoEmail}</div>
                      <div class="text-[10px] text-slate-500 dark:text-slate-400">${currentRole.demoSubtitle}</div>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onclick="window.oneClickLogin('${currentRole.demoEmail}', '${currentRole.demoPass}', '${selectedRole}')"
                    class="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ea2330] to-[#d91b28] hover:from-[#d91b28] hover:to-[#b91c1c] text-white font-extrabold text-xs transition shadow-md shadow-red-500/20 flex items-center justify-center space-x-2 shrink-0 transform hover:-translate-y-0.5">
                    <i data-lucide="zap" class="w-4 h-4 fill-white text-white"></i>
                    <span>1-Click Demo Login</span>
                  </button>
                </div>

                <!-- TAB SWITCHER: LOGIN VS SIGN UP -->
                <div class="flex border-b border-slate-200 dark:border-slate-800 text-center pt-1">
                  <button 
                    type="button" 
                    onclick="window.setAuthMode('login')"
                    class="flex-1 pb-3 text-xs font-extrabold border-b-2 transition flex items-center justify-center space-x-1.5 ${authMode === 'login' ? 'border-[#ea2330] text-[#ea2330]' : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}">
                    <i data-lucide="log-in" class="w-3.5 h-3.5"></i>
                    <span>Sign In with Password</span>
                  </button>
                  <button 
                    type="button" 
                    onclick="window.setAuthMode('signup')"
                    class="flex-1 pb-3 text-xs font-extrabold border-b-2 transition flex items-center justify-center space-x-1.5 ${authMode === 'signup' ? 'border-[#ea2330] text-[#ea2330]' : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}">
                    <i data-lucide="user-plus" class="w-3.5 h-3.5"></i>
                    <span>Create New Account</span>
                  </button>
                </div>
              ` : `
                <!-- FORGOT PASSWORD BANNER -->
                <div class="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs flex items-center space-x-2">
                  <i data-lucide="help-circle" class="w-4 h-4 shrink-0"></i>
                  <span>Enter your registered email address to set a new password and regain access to your bookings.</span>
                </div>
              `}

              <!-- =============================================================
                   MAIN FORM
                   ============================================================= -->
              <form id="auth-main-form" onsubmit="window.handleAuthFormSubmit(event)" class="space-y-3.5 text-xs">
                
                ${authMode === 'signup' ? `
                  <div class="space-y-1">
                    <label class="block font-bold text-slate-700 dark:text-slate-300 text-[11px]">Full Name</label>
                    <div class="relative">
                      <i data-lucide="user" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                      <input 
                        type="text" 
                        name="name" 
                        id="auth-name" 
                        placeholder="e.g. Krishna Singh" 
                        class="w-full pl-10 pr-4 py-2.5 rounded-xl yatra-auth-input bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>
                ` : ''}

                <!-- Registered Email Field -->
                <div class="space-y-1">
                  <label class="block font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                    ${authMode === 'signup' ? 'Email Address' : 'Registered Email ID'}
                  </label>
                  <div class="relative">
                    <i data-lucide="mail" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                    <input 
                      type="email" 
                      name="email" 
                      id="auth-email" 
                      placeholder="${currentRole.demoEmail}" 
                      class="w-full pl-10 pr-4 py-2.5 rounded-xl yatra-auth-input bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                <!-- Password Field -->
                ${authMode !== 'forgot' ? `
                  <div class="space-y-1">
                    <div class="flex items-center justify-between">
                      <label class="block font-bold text-slate-700 dark:text-slate-300 text-[11px]">Account Password</label>
                      ${authMode === 'login' ? `
                        <button 
                          type="button" 
                          onclick="window.setAuthMode('forgot')"
                          class="text-[#ea2330] hover:underline text-[11px] font-bold transition">
                          Forgot Password?
                        </button>
                      ` : ''}
                    </div>
                    <div class="relative">
                      <i data-lucide="lock" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                      <input 
                        type="password" 
                        name="password" 
                        id="auth-password" 
                        placeholder="Enter your password" 
                        class="w-full pl-10 pr-10 py-2.5 rounded-xl yatra-auth-input bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs placeholder:text-slate-400"
                        required
                      />
                      <button 
                        type="button" 
                        onclick="window.togglePasswordVisibility('auth-password', 'eye-toggle-icon')" 
                        class="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <i id="eye-toggle-icon" data-lucide="eye" class="w-4 h-4"></i>
                      </button>
                    </div>
                  </div>
                ` : `
                  <!-- Reset Password Mode Fields -->
                  <div class="space-y-1">
                    <label class="block font-bold text-slate-700 dark:text-slate-300 text-[11px]">New Password</label>
                    <div class="relative">
                      <i data-lucide="lock" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                      <input 
                        type="password" 
                        name="new_password" 
                        id="auth-new-password" 
                        placeholder="Enter new password (min 4 characters)" 
                        class="w-full pl-10 pr-4 py-2.5 rounded-xl yatra-auth-input bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>

                  <div class="space-y-1">
                    <label class="block font-bold text-slate-700 dark:text-slate-300 text-[11px]">Confirm New Password</label>
                    <div class="relative">
                      <i data-lucide="shield-check" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                      <input 
                        type="password" 
                        name="confirm_password" 
                        id="auth-confirm-password" 
                        placeholder="Confirm new password" 
                        class="w-full pl-10 pr-4 py-2.5 rounded-xl yatra-auth-input bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>
                `}

                <!-- Extra Signup Fields depending on role -->
                ${authMode === 'signup' ? `
                  <div class="space-y-1">
                    <label class="block font-bold text-slate-700 dark:text-slate-300 text-[11px]">Mobile Number (for SMS & WhatsApp E-Tickets)</label>
                    <div class="relative">
                      <i data-lucide="phone" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                      <input 
                        type="text" 
                        name="phone" 
                        id="auth-phone" 
                        placeholder="+91 98765 43210" 
                        class="w-full pl-10 pr-4 py-2.5 rounded-xl yatra-auth-input bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  ${selectedRole === 'operator' ? `
                    <div class="space-y-1">
                      <label class="block font-bold text-slate-700 dark:text-slate-300 text-[11px]">Tour Operator Business Name</label>
                      <div class="relative">
                        <i data-lucide="building" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                        <input 
                          type="text" 
                          name="company_name" 
                          id="auth-company" 
                          placeholder="e.g. Goa Coastal Expeditions" 
                          class="w-full pl-10 pr-4 py-2.5 rounded-xl yatra-auth-input bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  ` : ''}

                  ${selectedRole === 'business_operator' ? `
                    <div class="space-y-1">
                      <label class="block font-bold text-slate-700 dark:text-slate-300 text-[11px]">Company Name & GSTIN</label>
                      <div class="relative">
                        <i data-lucide="briefcase" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                        <input 
                          type="text" 
                          name="company_name" 
                          id="auth-company" 
                          placeholder="e.g. Tata Enterprise Mobility (GSTIN 27AAACT2727Q1ZB)" 
                          class="w-full pl-10 pr-4 py-2.5 rounded-xl yatra-auth-input bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  ` : ''}
                ` : ''}

                <!-- Remember Me & Terms Checkbox for Login -->
                ${authMode === 'login' ? `
                  <div class="flex items-center justify-between pt-1">
                    <label class="flex items-center space-x-2 cursor-pointer text-slate-600 dark:text-slate-400 text-[11px]">
                      <input type="checkbox" name="remember" checked class="rounded text-[#ea2330] focus:ring-[#ea2330] w-3.5 h-3.5" />
                      <span>Remember my login on this device</span>
                    </label>
                  </div>
                ` : ''}

                <!-- SUBMIT BUTTON -->
                <div class="pt-2">
                  <button 
                    type="submit" 
                    class="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ea2330] via-[#ea2330] to-[#d91b28] hover:from-[#d91b28] hover:to-[#b91c1c] text-white font-black text-sm shadow-xl shadow-red-500/25 transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2">
                    <i data-lucide="${authMode === 'login' ? 'log-in' : (authMode === 'signup' ? 'user-plus' : 'check-circle')}" class="w-4 h-4"></i>
                    <span>${authMode === 'login' ? `Sign In to ${currentRole.name}` : (authMode === 'signup' ? 'Complete Registration' : 'Save New Password')}</span>
                  </button>
                </div>

                ${authMode === 'forgot' ? `
                  <div class="text-center pt-2">
                    <button 
                      type="button" 
                      onclick="window.setAuthMode('login')"
                      class="text-xs text-slate-500 dark:text-slate-400 hover:text-[#ea2330] font-bold transition flex items-center justify-center space-x-1 mx-auto">
                      <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
                      <span>Return to Sign In</span>
                    </button>
                  </div>
                ` : ''}

              </form>

              <!-- SOCIAL / ALTERNATE QUICK LOGIN BUTTONS -->
              ${authMode !== 'forgot' ? `
                <div class="space-y-3 pt-2">
                  <div class="relative flex items-center justify-center">
                    <div class="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                    <span class="bg-white dark:bg-slate-900 px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400 absolute">
                      Or continue with
                    </span>
                  </div>

                  <div class="grid grid-cols-2 gap-2.5 pt-1">
                    <button 
                      type="button" 
                      onclick="window.oneClickLogin('${currentRole.demoEmail}', '${currentRole.demoPass}', '${selectedRole}')"
                      class="yatra-social-btn hover:border-slate-400">
                      <svg class="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>Google</span>
                    </button>

                    <button 
                      type="button" 
                      onclick="window.oneClickLogin('${currentRole.demoEmail}', '${currentRole.demoPass}', '${selectedRole}')"
                      class="yatra-social-btn hover:border-slate-400">
                      <i data-lucide="smartphone" class="w-4 h-4 text-[#ea2330]"></i>
                      <span>Mobile OTP</span>
                    </button>
                  </div>
                </div>
              ` : ''}

            </div>

            <!-- Card Bottom Trust & Legal Links -->
            <div class="pt-5 mt-5 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center space-x-2">
                <i data-lucide="lock" class="w-3.5 h-3.5 text-[#ea2330]"></i>
                <span>256-Bit SSL Encrypted &bull; PCI-DSS Level 1</span>
              </div>
              <div class="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
                <a href="javascript:void(0)" onclick="store.addToast('TRAVORA Terms of Service: Compliant with Indian Consumer Protection (E-Commerce) Rules 2020.', 'info', 4000)" class="hover:underline">Terms</a>
                <span>&bull;</span>
                <a href="javascript:void(0)" onclick="store.addToast('TRAVORA Privacy Policy: Digital Personal Data Protection (DPDP) Act 2023 Compliant.', 'info', 4000)" class="hover:underline">Privacy</a>
              </div>
            </div>

          </div>

        </div>
      </main>

      <!-- =================================================================
           BOTTOM COMPLIANCE & PARTNERS FOOTER STRIP
           ================================================================= -->
      <footer class="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-3.5 text-[11px] text-slate-500 dark:text-slate-400 relative z-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          
          <div class="flex items-center space-x-2">
            <span class="font-bold text-slate-700 dark:text-slate-300">&copy; 2026 TRAVORA Online Travel Pvt. Ltd.</span>
            <span class="hidden sm:inline">&bull;</span>
            <span class="hidden sm:inline">Inspired by Yatra.com Experience</span>
          </div>

          <div class="flex items-center space-x-4 text-[10px] font-semibold">
            <span class="flex items-center space-x-1">
              <i data-lucide="shield-check" class="w-3 h-3 text-[#ea2330]"></i>
              <span>Verified 517 Operators</span>
            </span>
            <span class="flex items-center space-x-1">
              <i data-lucide="map-pin" class="w-3 h-3 text-[#ea2330]"></i>
              <span>802 Districts</span>
            </span>
            <span class="flex items-center space-x-1">
              <i data-lucide="headphones" class="w-3 h-3 text-blue-500"></i>
              <span>24x7 Helpline Support</span>
            </span>
          </div>

        </div>
      </footer>

    </div>
  `;
}