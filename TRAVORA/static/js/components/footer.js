import { store } from '../store.js';

export function renderFooter() {
  return `
    <footer class="surface-card border-t border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 transition-colors mt-20">
      
      <!-- YATRA-STYLE TRAVEL DIRECTORY STRIP -->
      <div class="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs text-slate-500 dark:text-slate-400">
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div class="space-y-3">
              <h5 class="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <i data-lucide="plane" class="w-3.5 h-3.5 text-red-600"></i>
                <span>Popular Domestic Flights</span>
              </h5>
              <ul class="space-y-1.5 text-[11px]">
                <li><a href="#" onclick="event.preventDefault(); window.selectPopularRoute('New Delhi (DEL)', 'Goa (GOI / GOX)');" class="hover:text-red-600 transition flex items-center justify-between"><span>Delhi to Goa Flights</span><span class="font-bold text-red-600">from ₹3,499</span></a></li>
                <li><a href="#" onclick="event.preventDefault(); window.selectPopularRoute('Mumbai (BOM)', 'New Delhi (DEL)');" class="hover:text-red-600 transition flex items-center justify-between"><span>Mumbai to Delhi Flights</span><span class="font-bold text-red-600">from ₹3,850</span></a></li>
                <li><a href="#" onclick="event.preventDefault(); window.selectPopularRoute('Bengaluru (BLR)', 'Goa (GOI / GOX)');" class="hover:text-red-600 transition flex items-center justify-between"><span>Bangalore to Goa Flights</span><span class="font-bold text-red-600">from ₹2,499</span></a></li>
                <li><a href="#" onclick="event.preventDefault(); window.selectPopularRoute('New Delhi (DEL)', 'Srinagar (SXR)');" class="hover:text-red-600 transition flex items-center justify-between"><span>Delhi to Srinagar Flights</span><span class="font-bold text-red-600">from ₹4,990</span></a></li>
                <li><a href="#" onclick="event.preventDefault(); window.selectPopularRoute('Mumbai (BOM)', 'Jaipur (JAI)');" class="hover:text-red-600 transition flex items-center justify-between"><span>Mumbai to Jaipur Flights</span><span class="font-bold text-red-600">from ₹3,200</span></a></li>
                <li><a href="#" onclick="event.preventDefault(); window.selectPopularRoute('Kolkata (CCU)', 'Port Blair (IXZ)');" class="hover:text-red-600 transition flex items-center justify-between"><span>Kolkata to Port Blair Flights</span><span class="font-bold text-red-600">from ₹6,800</span></a></li>
              </ul>
            </div>

            <div class="space-y-3">
              <h5 class="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <i data-lucide="hotel" class="w-3.5 h-3.5 text-red-600"></i>
                <span>Top Hotel Destinations</span>
              </h5>
              <ul class="space-y-1.5 text-[11px]">
                <li><a href="#" onclick="event.preventDefault(); window.startPlanningFor('Goa');" class="hover:text-red-600 transition">Goa Beachfront Resorts & Villas</a></li>
                <li><a href="#" onclick="event.preventDefault(); window.startPlanningFor('Jaipur');" class="hover:text-red-600 transition">Jaipur Heritage Palaces & Havelis</a></li>
                <li><a href="#" onclick="event.preventDefault(); window.startPlanningFor('Munnar');" class="hover:text-red-600 transition">Munnar Tea Hill Mountain Resorts</a></li>
                <li><a href="#" onclick="event.preventDefault(); window.startPlanningFor('Manali');" class="hover:text-red-600 transition">Manali Riverside Cottages & Chalets</a></li>
                <li><a href="#" onclick="event.preventDefault(); window.startPlanningFor('Udaipur');" class="hover:text-red-600 transition">Udaipur Lake View 5-Star Luxury</a></li>
                <li><a href="#" onclick="event.preventDefault(); window.startPlanningFor('Varanasi');" class="hover:text-red-600 transition">Varanasi Ghats Heritage Hotels</a></li>
              </ul>
            </div>

            <div class="space-y-3">
              <h5 class="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <i data-lucide="palmtree" class="w-3.5 h-3.5 text-amber-500"></i>
                <span>Handcrafted Holiday Packages</span>
              </h5>
              <ul class="space-y-1.5 text-[11px]">
                <li><a href="#" onclick="event.preventDefault(); window.startPlanningFor('Kerala');" class="hover:text-red-600 transition">Kerala Backwaters & Tea Hills 5D/4N</a></li>
                <li><a href="#" onclick="event.preventDefault(); window.startPlanningFor('Rajasthan');" class="hover:text-red-600 transition">Royal Rajasthan Forts & Deserts 6D/5N</a></li>
                <li><a href="#" onclick="event.preventDefault(); window.startPlanningFor('Kashmir');" class="hover:text-red-600 transition">Kashmir Valley & Gulmarg Snow 5D/4N</a></li>
                <li><a href="#" onclick="event.preventDefault(); window.startPlanningFor('Andaman');" class="hover:text-red-600 transition">Andaman Island Scuba & Beaches 6D/5N</a></li>
                <li><a href="#" onclick="event.preventDefault(); window.startPlanningFor('Goa');" class="hover:text-red-600 transition">Goa Coastal & Heritage Tour 4D/3N</a></li>
                <li><a href="#" onclick="event.preventDefault(); window.startPlanningFor('Himachal');" class="hover:text-red-600 transition">Shimla & Manali Adventure 5D/4N</a></li>
              </ul>
            </div>

            <div class="space-y-3">
              <h5 class="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <i data-lucide="shield-check" class="w-3.5 h-3.5 text-[#ea2330]"></i>
                <span>Yatra & TRAVORA Prime Features</span>
              </h5>
              <ul class="space-y-1.5 text-[11px]">
                <li><a href="#" onclick="event.preventDefault(); window.switchYatraServiceTab('flights');" class="hover:text-red-600 transition">Zero Convenience Fee with Prime</a></li>
                <li><a href="#" onclick="event.preventDefault(); window.trackFlightPrices();" class="hover:text-red-600 transition">Live Price Predictor & Alerts</a></li>
                <li><a href="#" onclick="event.preventDefault(); window.switchYatraServiceTab('flights');" class="hover:text-red-600 transition">Hacker Fares Price Match Engine</a></li>
                <li><a href="#" onclick="event.preventDefault(); window.navigateView('planner');" class="hover:text-red-600 transition">Autonomous Disruption Engine (5-Factor)</a></li>
                <li><a href="#" onclick="event.preventDefault(); window.navigateView('dashboard');" class="hover:text-red-600 transition">802 Indian Districts Directory</a></li>
                <li><a href="#" onclick="event.preventDefault(); window.navigateView('business_operator');" class="hover:text-red-600 transition">TRAVORA for Corporate Mobility</a></li>
              </ul>
            </div>

          </div>

        </div>
      </div>

      <!-- MAIN FOOTER COLUMNS -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          <!-- Column 1: Brand & Tagline -->
          <div class="lg:col-span-2 space-y-4">
            <div class="flex items-center space-x-3 cursor-pointer" onclick="window.navigateView('landing')">
              <img 
                src="/static/assets/logo/travora_logo_horizontal.png" 
                alt="TRAVORA" 
                class="h-9 w-auto object-contain dark:brightness-110"
              />
            </div>
            <p class="text-sm font-bold text-red-600 dark:text-red-400">
              India's Leading AI-Powered Travel & Dynamic Tour Operations Platform
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Connecting millions of travellers with cheap flights, luxury hotels, verified tour operators, and real-time autonomous itinerary recovery across 802 Indian districts.
            </p>
            
            <!-- Accreditations & Trust Badges -->
            <div class="pt-2 flex flex-wrap gap-2 text-xs text-slate-400 dark:text-slate-500">
              <span class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                <i data-lucide="shield-check" class="w-3 h-3 text-red-600"></i>
                <span>IATA Accredited Agency</span>
              </span>
              <span class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                <i data-lucide="train" class="w-3 h-3 text-blue-500"></i>
                <span>IRCTC Authorized Partner</span>
              </span>
            </div>
          </div>

          <!-- Column 2: Company -->
          <div class="space-y-3">
            <h4 class="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white">
              Company
            </h4>
            <ul class="space-y-2 text-xs">
              <li><button onclick="window.navigateView('about')" class="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition">About TRAVORA</button></li>
              <li><button onclick="window.navigateView('about', { section: 'vision' })" class="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition">Our Vision & Values</button></li>
              <li><button onclick="window.navigateView('about', { section: 'mission' })" class="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition">Corporate Governance</button></li>
              <li><button onclick="window.navigateView('about', { section: 'team' })" class="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition font-bold text-red-600 dark:text-red-400">Team Panchdyuti</button></li>
              <li><button onclick="window.navigateView('about')" class="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition">Careers at TRAVORA</button></li>
            </ul>
          </div>

          <!-- Column 3: Platform Services -->
          <div class="space-y-3">
            <h4 class="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white">
              Our Portals
            </h4>
            <ul class="space-y-2 text-xs">
              <li><button onclick="window.switchYatraServiceTab('flights')" class="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition">Domestic & Intl Flights</button></li>
              <li><button onclick="window.switchYatraServiceTab('hotels')" class="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition">5-Star Luxury Resorts</button></li>
              <li><button onclick="window.navigateView('planner')" class="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition">AI Dynamic Tour Planner</button></li>
              <li><button data-phase-btn="operator" onclick="window.openPhase('operator')" class="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition font-semibold text-amber-600">Tour Operator Command</button></li>
              <li><button data-phase-btn="business_operator" onclick="window.openPhase('business_operator')" class="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition">TRAVORA for Business</button></li>
              <li><button data-phase-btn="admin" onclick="window.openPhase('admin')" class="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition">Admin Telemetry Hub</button></li>
            </ul>
          </div>

          <!-- Column 4: Support & Legal -->
          <div class="space-y-3">
            <h4 class="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white">
              Support & Trust
            </h4>
            <ul class="space-y-2 text-xs">
              <li><button onclick="window.openSupportModal ? window.openSupportModal('contact') : window.navigateView('about')" class="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition">24x7 Customer Helpline</button></li>
              <li><button onclick="window.openSupportModal ? window.openSupportModal('faq') : window.navigateView('about')" class="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition">Help & FAQs</button></li>
              <li><button onclick="window.openFeedbackModal ? window.openFeedbackModal() : window.navigateView('about')" class="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition">Platform Feedback</button></li>
              <li><a href="#privacy" onclick="event.preventDefault(); window.navigateView('about', { section: 'legal' });" class="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition">Privacy Policy</a></li>
              <li><a href="#terms" onclick="event.preventDefault(); window.navigateView('about', { section: 'legal' });" class="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition">Terms of Service</a></li>
              <li><a href="#cancellation" onclick="event.preventDefault(); window.navigateView('about', { section: 'legal' });" class="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition">Cancellation & Refunds</a></li>
            </ul>
          </div>

        </div>

        <!-- PAYMENT PARTNERS & TRUST STRIP (YATRA ICONIC STRIP) -->
        <div class="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs text-slate-500">
            <span class="font-bold text-slate-700 dark:text-slate-300">100% Secure Payments:</span>
            <div class="flex items-center space-x-3 text-[11px] font-bold">
              <span class="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">VISA</span>
              <span class="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">MasterCard</span>
              <span class="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">RuPay</span>
              <span class="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">UPI / GPay</span>
              <span class="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">NetBanking</span>
            </div>
          </div>

          <div class="flex items-center space-x-2 text-xs text-slate-400">
            <i data-lucide="lock" class="w-4 h-4 text-[#ea2330]"></i>
            <span>256-Bit SSL Bank Grade Encryption</span>
          </div>
        </div>

        <!-- Bottom Copyright -->
        <div class="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div class="flex items-center space-x-2">
            <span class="font-black text-red-600 dark:text-red-500">TRAVORA</span>
            <span>(c) 2026. Built with pride by</span>
            <span class="font-extrabold text-slate-900 dark:text-white">Team Panchdyuti</span>
            <span class="opacity-40">|</span>
            <span>All rights reserved.</span>
          </div>
          <div class="flex items-center space-x-4">
            <span class="font-mono text-[11px] text-slate-400">v2.5.0-yatra-edition</span>
            <button onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" class="p-2 rounded-xl surface-card hover:text-red-600 transition" title="Back to top">
              <i data-lucide="arrow-up" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

      </div>
    </footer>
  `;
}
