import { store } from '../store.js';
import { api } from '../api.js';

export function renderOperatorRegistrationModal() {
  const isDark = store.getState().theme === 'dark';

  return `
    <div id="operator-register-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all duration-300">
      
      <div class="relative w-full max-w-2xl surface-card bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        <!-- CLOSE BUTTON -->
        <button 
          type="button" 
          onclick="window.closeOperatorRegistrationModal()" 
          class="absolute top-5 right-5 w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>

        <!-- HEADER -->
        <div class="space-y-1.5 pr-8">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
            <i data-lucide="shield" class="w-3.5 h-3.5"></i>
            <span>TRAVORA PARTNER NETWORK</span>
          </div>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Register as a Certified Tour Operator
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Join 15+ verified tour operators across India. Get matched with traveler itineraries in real-time, dispatch fleets, and manage bookings.
          </p>
        </div>

        <!-- REGISTRATION FORM -->
        <form id="operator-direct-register-form" onsubmit="window.handleOperatorRegistrationSubmit(event)" class="space-y-4 text-xs">
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- FULL NAME -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-700 dark:text-slate-300">Lead Representative / Guide Name *</label>
              <input 
                type="text" 
                name="name" 
                id="op-reg-name" 
                placeholder="e.g. Rajesh Khurana" 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <!-- COMPANY NAME -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-700 dark:text-slate-300">Agency / Tour Company Name *</label>
              <input 
                type="text" 
                name="company_name" 
                id="op-reg-company" 
                placeholder="e.g. Khurana Desert & Heritage Caravans" 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- EMAIL -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-700 dark:text-slate-300">Business Email Address *</label>
              <input 
                type="email" 
                name="email" 
                id="op-reg-email" 
                placeholder="rajesh@khuranatours.in" 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <!-- PASSWORD -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-700 dark:text-slate-300">Account Password (min 4 chars) *</label>
              <input 
                type="password" 
                name="password" 
                id="op-reg-password" 
                placeholder="Create password" 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- PHONE -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-700 dark:text-slate-300">Emergency Dispatch Phone *</label>
              <input 
                type="text" 
                name="phone" 
                id="op-reg-phone" 
                placeholder="+91 98980 12345" 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <!-- OPERATING DESTINATIONS -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-700 dark:text-slate-300">Operating Destinations *</label>
              <input 
                type="text" 
                name="operating_destinations" 
                id="op-reg-destinations" 
                placeholder="e.g. Goa, Jaipur, Udaipur" 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
              <p class="text-[10px] text-slate-400">Comma-separated regions (e.g. Goa, Jaipur, Kerala, Manali)</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- FLEET SIZE -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-700 dark:text-slate-300">Fleet & Equipment Details *</label>
              <input 
                type="text" 
                name="fleet_size" 
                id="op-reg-fleet" 
                placeholder="e.g. 10 Volvo AC Buses, 4 4x4 Jeeps" 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <!-- SPECIALTIES -->
            <div class="space-y-1">
              <label class="block font-bold text-slate-700 dark:text-slate-300">Specialties & Activities *</label>
              <input 
                type="text" 
                name="specialties" 
                id="op-reg-specialties" 
                placeholder="e.g. Desert Safari, Forts, Beach, Scuba" 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <!-- BIO -->
          <div class="space-y-1">
            <label class="block font-bold text-slate-700 dark:text-slate-300">Company Bio & On-Ground Experience (Optional)</label>
            <textarea 
              name="bio" 
              id="op-reg-bio" 
              rows="2" 
              placeholder="Tell travelers and TRAVORA's AI about your agency's experience, safety protocols, and personalized perks..."
              class="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"></textarea>
          </div>

          <!-- SUBMIT ACTION -->
          <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1">
              <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-500"></i>
              <span>Instantly verified & indexed into AI recommendation engine upon submission.</span>
            </div>
            <button 
              type="submit" 
              id="submit-op-register-btn"
              class="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-teal-600 hover:from-amber-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2">
              <i data-lucide="shield-check" class="w-4 h-4"></i>
              <span>COMPLETE OPERATOR REGISTRATION</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  `;
}
