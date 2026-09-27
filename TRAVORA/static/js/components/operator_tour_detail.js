import { store } from '../store.js';

export function renderOperatorTourDetail() {
  const state = store.getState();
  const tour = state.currentTour;

  if (!tour) {
    return `
      <div class="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <p class="text-sm text-slate-500">Loading tour operational specifications...</p>
      </div>
    `;
  }

  const items = tour.itinerary_items || [];
  const pricing = tour.pricing || { total: 20500, budget_total: 25000, remaining: 4500 };

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- HEADER WITH BACK NAVIGATION -->
      <div class="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div class="flex items-center space-x-3">
          <button onclick="window.navigateView('operator_dash')" class="p-2 rounded-xl surface-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition">
            <i data-lucide="arrow-left" class="w-4 h-4"></i>
          </button>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold font-mono text-teal-600 dark:text-teal-400">TOUR #${tour.code}</span>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${(tour.status === 'alert' || tour.status === 'attention') ? 'bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/40 animate-pulse' : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'}">
                ${(tour.status === 'alert' || tour.status === 'attention') ? 'ALERT' : 'ACTIVE'}
              </span>
            </div>
            <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">
              ${tour.title}
            </h1>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          ${(tour.status === 'alert' || tour.status === 'attention') ? `
            <button 
              type="button"
              onclick="window.openDisruptionModal(${tour.id})" 
              class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow transition flex items-center space-x-1.5">
              <i data-lucide="wrench" class="w-3.5 h-3.5"></i>
              <span>Resolve Disruption Alert</span>
            </button>
          ` : ''}
          <button 
            type="button"
            onclick="window.navigateView('operator_dash')" 
            class="px-4 py-2 rounded-xl surface-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-300 dark:border-slate-700 transition">
            Back to Roster
          </button>
        </div>
      </div>

      <!-- 8-TAB OPERATIONAL INSPECTOR -->
      <div class="surface-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        <!-- Tab Headers -->
        <div class="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto text-xs font-bold">
          <button class="px-4 py-2 rounded-xl bg-teal-600 text-white shadow">Overview</button>
          <button class="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Itinerary Timeline (${items.length})</button>
          <button class="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Bookings & Payments</button>
          <button class="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Hotels & Rooms</button>
          <button class="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Transport Fleet</button>
          <button class="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Change History</button>
        </div>

        <!-- Overview Content Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 class="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">Traveler Profile</h3>
            <div class="space-y-1.5">
              <div class="flex justify-between"><span class="text-slate-400">Lead Customer:</span> <span class="font-bold text-slate-800 dark:text-slate-200">${tour.customer_name}</span></div>
              <div class="flex justify-between"><span class="text-slate-400">Email:</span> <span class="font-mono text-slate-600 dark:text-slate-300">${tour.customer_email}</span></div>
              <div class="flex justify-between"><span class="text-slate-400">Phone:</span> <span class="text-slate-600 dark:text-slate-300">${tour.customer_phone}</span></div>
              <div class="flex justify-between"><span class="text-slate-400">Party Size:</span> <span class="font-bold text-slate-800 dark:text-slate-200">${tour.travelers_count} Travelers</span></div>
            </div>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 class="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">Tour Logistics</h3>
            <div class="space-y-1.5">
              <div class="flex justify-between"><span class="text-slate-400">Destination:</span> <span class="font-bold text-slate-800 dark:text-slate-200">${tour.destination_name}</span></div>
              <div class="flex justify-between"><span class="text-slate-400">Duration:</span> <span class="text-slate-600 dark:text-slate-300">${tour.duration_days} Days / ${tour.duration_days - 1} Nights</span></div>
              <div class="flex justify-between"><span class="text-slate-400">Coordinator:</span> <span class="font-bold text-teal-600 dark:text-teal-400">${tour.coordinator_name}</span></div>
              <div class="flex justify-between"><span class="text-slate-400">Assigned Group:</span> <span class="font-mono text-slate-800 dark:text-slate-200">Group TR-G-024</span></div>
            </div>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 class="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">Financial Summary</h3>
            <div class="space-y-1.5">
              <div class="flex justify-between"><span class="text-slate-400">Total Budget:</span> <span class="font-bold text-slate-800 dark:text-slate-200">Rs ${pricing.budget_total.toLocaleString('en-IN')}</span></div>
              <div class="flex justify-between"><span class="text-slate-400">Billed Total:</span> <span class="font-extrabold text-teal-600 dark:text-teal-400">Rs ${pricing.total.toLocaleString('en-IN')}</span></div>
              <div class="flex justify-between"><span class="text-slate-400">Payment Status:</span> <span class="px-2 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">Captured (UPI)</span></div>
              <div class="flex justify-between"><span class="text-slate-400">Booking Code:</span> <span class="font-mono text-slate-600 dark:text-slate-300">${tour.booking_code || 'BK-TR1024-99'}</span></div>
            </div>
          </div>

        </div>

        <!-- Schedule Items Table -->
        <div class="space-y-3 pt-2">
          <h3 class="font-bold text-sm text-slate-800 dark:text-slate-200">
            Assigned Schedule & Activity Manifest
          </h3>
          <div class="divide-y divide-slate-100 dark:divide-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden">
            ${items.map(it => `
              <div class="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition text-xs">
                <div class="flex items-center space-x-3">
                  <span class="font-mono font-bold text-teal-600 dark:text-teal-400 w-14">Day ${it.day_number}</span>
                  <div>
                    <div class="font-bold text-slate-800 dark:text-slate-200">${it.title}</div>
                    <div class="text-[10px] text-slate-400">${it.time_start} - ${it.time_end} - ${it.location_name}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-slate-900 dark:text-white">Rs ${it.cost.toLocaleString('en-IN')}</div>
                  <span class="text-[10px] uppercase font-semibold text-slate-400">${it.item_type}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

    </div>
  `;
}
