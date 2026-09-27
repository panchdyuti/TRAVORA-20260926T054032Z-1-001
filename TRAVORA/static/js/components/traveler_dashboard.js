import { store } from '../store.js';

export function renderTravelerDashboard() {
  const state = store.getState();
  const destinations = state.destinations || [];
  const currentTour = state.currentTour;
  const allTours = state.tours || [];

  // Filter tours strictly owned by the current logged-in traveler
  const userTours = (allTours || []).filter(t => state.user && (t.customer_email === state.user.email || t.user_id === state.user.id));
  const activeTour = userTours.length > 0 ? (userTours.find(t => t.status === 'booked' || t.status === 'active') || userTours[0]) : null;

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      <!-- WELCOME HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 mb-1">
            <i data-lucide="compass" class="w-3.5 h-3.5"></i>
            <span>PERSONAL TRAVEL SUITE</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2 mt-1">
            <span>Welcome, ${(state.user && state.user.name ? state.user.name : 'Explorer').split(' ')[0]}</span>
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your personal vacations, custom planned trips, and live interactive schedules.
          </p>
        </div>

        <!-- Quick Action Buttons -->
        <div class="flex items-center space-x-3">
          <button 
            onclick="window.navigateView('planner')" 
            class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-teal-500/20 transition flex items-center space-x-2">
            <i data-lucide="sparkles" class="w-4 h-4"></i>
            <span>Plan a New Trip</span>
          </button>
        </div>
      </div>

      <!-- CURRENT / UPCOMING JOURNEY -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400">
            Featured / Active Itinerary
          </h2>
          ${activeTour ? `
            <span class="text-xs text-teal-600 dark:text-teal-400 font-bold cursor-pointer hover:underline" onclick="window.navigateView('itinerary', { tour_id: ${activeTour.id} })">
              Manage Full Schedule &rarr;
            </span>
          ` : ''}
        </div>

        ${activeTour ? `
          <div class="p-6 sm:p-8 rounded-3xl surface-card relative overflow-hidden group border border-slate-200 dark:border-slate-800 shadow-xl">
            <!-- Ambient Background Glow -->
            <div class="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              
              <!-- Left Info -->
              <div class="lg:col-span-2 space-y-4">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30 font-mono">
                    Tour #${activeTour.code || 'TR1024'}
                  </span>
                  <span class="px-3 py-1 rounded-full text-xs font-bold ${activeTour.status === 'booked' || activeTour.status === 'active' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'} flex items-center space-x-1">
                    <span class="w-2 h-2 rounded-full ${activeTour.status === 'booked' || activeTour.status === 'active' ? 'bg-emerald-500' : 'bg-blue-500'}"></span>
                    <span class="capitalize">${activeTour.status || 'Planned'}</span>
                  </span>
                  <span class="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center space-x-1">
                    <i data-lucide="award" class="w-3.5 h-3.5 text-amber-500"></i>
                    <span>${activeTour.match_percentage || 94}% Preference Match</span>
                  </span>
                </div>

                <div>
                  <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    ${activeTour.title || 'Personalized Holiday Discovery'}
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    ${activeTour.destination_name || 'India'} - ${activeTour.duration_days || 4} Days - ${activeTour.travelers_count || 2} Travelers - ${activeTour.accommodation_type || '3-Star'} - ${activeTour.transport_type || 'AC Transit'}
                  </p>
                </div>

                <!-- Key Features Mini Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                    <div class="text-[10px] text-slate-400 font-medium">Hotel Tier</div>
                    <div class="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">${activeTour.accommodation_type || 'Comfort'}</div>
                  </div>
                  <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                    <div class="text-[10px] text-slate-400 font-medium">Transit Mode</div>
                    <div class="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">${activeTour.transport_type || 'Express Transit'}</div>
                  </div>
                  <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                    <div class="text-[10px] text-slate-400 font-medium">Trip Budget</div>
                    <div class="text-xs font-bold text-teal-600 dark:text-teal-400 mt-0.5">Rs ${(activeTour.estimated_cost || activeTour.budget_total || 25000).toLocaleString('en-IN')}</div>
                  </div>
                  <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                    <div class="text-[10px] text-slate-400 font-medium">Assigned Coordinator</div>
                    <div class="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">${activeTour.coordinator_name || 'Aarav Mehta'}</div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex flex-wrap gap-2.5 pt-2">
                  <button 
                    onclick="window.navigateView('itinerary', { tour_id: ${activeTour.id} })" 
                    class="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center space-x-1.5">
                    <i data-lucide="eye" class="w-4 h-4"></i>
                    <span>View Itinerary</span>
                  </button>
                  <button 
                    onclick="window.navigateView('tracker', { tour_id: ${activeTour.id} })" 
                    class="px-4 py-2.5 rounded-xl surface-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm border border-slate-300 dark:border-slate-700 transition flex items-center space-x-1.5">
                    <i data-lucide="navigation" class="w-4 h-4 text-teal-500"></i>
                    <span>Live Tracker</span>
                  </button>
                  <button 
                    onclick="window.handleDeleteTour(${activeTour.id}, '${(activeTour.title || '').replace(/'/g, "\\'")}')" 
                    class="px-4 py-2.5 rounded-xl border border-red-500/30 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 font-bold text-xs sm:text-sm transition flex items-center space-x-1.5"
                    title="Delete this planned itinerary">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                    <span>Delete Itinerary</span>
                  </button>
                </div>
              </div>

              <!-- Right Image Thumbnail -->
              <div class="relative h-48 lg:h-full rounded-2xl overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800" 
                  alt="Destination Preview" 
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                  <span class="text-xs font-semibold text-white">${activeTour.destination_name || 'Goa Beach Hub'}</span>
                </div>
              </div>

            </div>
          </div>
        ` : `
          <div class="p-8 sm:p-12 rounded-3xl surface-card text-center border-2 border-dashed border-slate-300 dark:border-slate-800 space-y-4 shadow-sm">
            <div class="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-inner">
              <i data-lucide="map" class="w-7 h-7"></i>
            </div>
            <div class="space-y-1.5 max-w-md mx-auto">
              <h3 class="font-extrabold text-lg text-slate-900 dark:text-white">No Planned Itineraries Yet</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your journey calendar is clean. Explore the handpicked Indian destinations below and design your personalized dynamic tour!
              </p>
            </div>
            <button 
              onclick="window.navigateView('planner')" 
              class="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 hover:from-teal-500 text-white font-extrabold text-xs shadow-lg shadow-teal-500/20 transition flex items-center space-x-2 mx-auto">
              <i data-lucide="sparkles" class="w-4 h-4"></i>
              <span>Create My First Journey</span>
            </button>
          </div>
        `}
      </div>

      <!-- MY PLANNED TOURS LIST SECTION (IF MULTIPLE) -->
      ${userTours.length > 1 ? `
        <div class="space-y-4">
          <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400">
            All My Saved & Planned Itineraries (${userTours.length})
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${userTours.map(t => `
              <div class="surface-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md space-y-3 flex flex-col justify-between">
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold">
                      #${t.code}
                    </span>
                    <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${t.status === 'booked' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}">
                      ${t.status}
                    </span>
                  </div>
                  <h4 class="font-bold text-sm text-slate-900 dark:text-white">${t.title}</h4>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400">${t.destination_name} - ${t.duration_days} Days - ${t.travelers_count} Travelers</p>
                  <div class="text-xs font-extrabold text-teal-600 dark:text-teal-400">
                    Est. Total: Rs ${(t.estimated_cost || t.budget_total || 20000).toLocaleString('en-IN')}
                  </div>
                </div>

                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button 
                    onclick="window.navigateView('itinerary', { tour_id: ${t.id} })"
                    class="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-600 hover:text-white text-xs font-bold text-slate-700 dark:text-slate-300 transition text-center">
                    Open Itinerary
                  </button>
                  <button 
                    onclick="window.handleDeleteTour(${t.id}, '${(t.title || '').replace(/'/g, "\\'")}')"
                    class="p-2 rounded-xl border border-red-500/30 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 transition"
                    title="Delete Itinerary">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- RECOMMENDED INDIAN DESTINATIONS -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-extrabold text-slate-900 dark:text-white">
              Curated Destinations For You
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Personalized based on Beach, Adventure, Culture, and Heritage preferences
            </p>
          </div>
          <button onclick="window.navigateView('planner')" class="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline">
            Custom Search &rarr;
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          ${destinations.map(d => `
            <div class="surface-card rounded-2xl overflow-hidden group hover:-translate-y-1 transition duration-200 flex flex-col justify-between border border-slate-200 dark:border-slate-800 shadow-md">
              
              <!-- Image & Badge -->
              <div class="relative h-44 overflow-hidden">
                <img 
                  src="${d.image_url}" 
                  alt="${d.name}" 
                  class="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-extrabold bg-slate-900/80 backdrop-blur-md text-teal-400 border border-teal-500/30">
                  ${d.match_score}% Match
                </div>
                <div class="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/70 text-white backdrop-blur-sm">
                  ${d.state}
                </div>
              </div>

              <!-- Card Content -->
              <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 class="font-bold text-base text-slate-900 dark:text-white">${d.name}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">${d.description}</p>
                </div>

                <!-- Tags -->
                <div class="flex flex-wrap gap-1">
                  ${d.travel_styles.split(',').map(tag => `
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      ${tag.trim()}
                    </span>
                  `).join('')}
                </div>

                <!-- Price & Plan Button -->
                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div class="text-[10px] text-slate-400 uppercase font-semibold">Starting from</div>
                    <div class="text-sm font-extrabold text-slate-900 dark:text-white">Rs ${d.starting_price.toLocaleString('en-IN')}</div>
                  </div>
                  <button 
                    onclick="window.startPlanningFor('${d.name}')" 
                    class="px-3.5 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-600 hover:text-white text-teal-600 dark:text-teal-400 font-bold text-xs transition border border-teal-200 dark:border-teal-800">
                    Plan Trip
                  </button>
                </div>

              </div>

            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}
