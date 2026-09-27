import { store } from '../store.js';
import { api } from '../api.js';

export function renderDisruptionModal() {
  const state = store.getState();
  if (!state.isDisruptionModalOpen) return '';

  const tour = state.currentTour;
  const events = (tour && tour.change_events) ? tour.change_events : [];
  let activeEvent = null;
  if (state.activeChangeEventId) {
    activeEvent = events.find(e => e.id === state.activeChangeEventId);
  }
  if (!activeEvent) {
    activeEvent = events.find(e => e.status === 'pending');
  }

  if (!activeEvent) {
    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
        <div class="surface-card rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-emerald-500/30 text-center space-y-5 modal-content">
          <div class="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <i data-lucide="shield-check" class="w-8 h-8"></i>
          </div>
          <div class="space-y-1.5">
            <h2 class="text-xl font-extrabold text-slate-900 dark:text-white">
              All Disruptions Resolved
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              There are no pending changes requiring review. The itinerary, accommodation, and vendor reservations are operating normally with 100% synchronization.
            </p>
          </div>
          <button 
            onclick="window.closeDisruptionModal()" 
            class="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition">
            Close Disruption Hub
          </button>
        </div>
      </div>
    `;
  }

  const alternatives = activeEvent.alternatives || [];
  const travelerName = (tour && tour.user && tour.user.name) ? tour.user.name : (state.user ? state.user.name : 'Traveler');
  const destName = (tour && tour.destination && tour.destination.name) ? tour.destination.name : ((tour && tour.title) ? tour.title.replace(' Personalized Discovery', '').replace(' Discovery', '') : 'Jaipur');
  const coordinatorName = tour ? (tour.coordinator_name || 'Aarav Mehta') : 'Aarav Mehta';
  const isOperatorAlerted = !!(state.urgentTravellerIssue && state.urgentTravellerIssue.tour_id === (tour ? tour.id : null));

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div class="surface-card rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-red-200 dark:border-red-900/60 max-h-[92vh] overflow-y-auto space-y-6 modal-content">
        
        <!-- HEADER -->
        <div class="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div class="flex items-center space-x-3">
            <div class="w-11 h-11 rounded-2xl bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center font-bold shadow-sm shrink-0">
              <i data-lucide="alert-triangle" class="w-6 h-6 animate-pulse"></i>
            </div>
            <div>
              <div class="flex items-center space-x-2 flex-wrap gap-1">
                <span class="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wider">Dynamic Disruption Active</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">Tour #${tour ? tour.code : 'TR1024'}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center space-x-1">
                  <i data-lucide="map-pin" class="w-2.5 h-2.5"></i>
                  <span>${destName}</span>
                </span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Traveler: ${travelerName}</span>
              </div>
              <h2 class="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                ${activeEvent.title}
              </h2>
            </div>
          </div>
          <button onclick="window.closeDisruptionModal()" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- 4-PILLAR FRAMEWORK INDICATOR BAR -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10.5px] font-extrabold uppercase tracking-wider">
          <div class="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center justify-center space-x-1.5">
            <i data-lucide="phone-call" class="w-3.5 h-3.5"></i>
            <span>1. Operator Alert</span>
          </div>
          <div class="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center space-x-1.5">
            <i data-lucide="building" class="w-3.5 h-3.5"></i>
            <span>2. Hotel Collision</span>
          </div>
          <div class="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 flex items-center justify-center space-x-1.5">
            <i data-lucide="cloud-lightning" class="w-3.5 h-3.5"></i>
            <span>3. Weather/Climate</span>
          </div>
          <div class="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center space-x-1.5">
            <i data-lucide="truck" class="w-3.5 h-3.5"></i>
            <span>4. Transit Delay</span>
          </div>
        </div>

        <!-- ============================================================================== -->
        <!-- PILLAR 1: ALERT - DIRECT CONTACT OPERATOR -->
        <!-- ============================================================================== -->
        <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-500/10 via-amber-500/10 to-red-500/10 border-2 border-red-500/40 dark:border-red-500/60 shadow-lg space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                <i data-lucide="phone-call" class="w-5 h-5"></i>
              </div>
              <div>
                <div class="flex items-center space-x-2 flex-wrap gap-1">
                  <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase ${isOperatorAlerted ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}">
                    ${isOperatorAlerted ? 'Operator Alerted &bull; Direct Sync Active' : 'Pillar 1: Alert - Direct Contact Operator'}
                  </span>
                  <span class="text-xs text-slate-600 dark:text-slate-300">
                    Coordinator: <strong>${coordinatorName}</strong>
                  </span>
                  <span class="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    <a href="tel:+919876543210" class="hover:underline text-red-600 dark:text-red-400">+91 98765 43210</a>
                  </span>
                </div>
                <h3 class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  Direct Emergency Operator Protocol Activated
                </h3>
                <p class="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  Sends priority incident notification to tour operator command center: <em>"Contact traveller: he/she has an issue."</em> Dedicated local team calls or dispatches on-ground assistance immediately in ${destName}.
                </p>
              </div>
            </div>

            <div class="flex items-center space-x-2 shrink-0">
              <button 
                type="button" 
                onclick="window.triggerAlertOperatorForTravellerIssue(${tour ? tour.id : 1})" 
                class="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition flex items-center justify-center space-x-2 shadow-lg shadow-red-600/30">
                <i data-lucide="bell" class="w-4 h-4 ${isOperatorAlerted ? '' : 'animate-bounce'}"></i>
                <span>${isOperatorAlerted ? 'Alert Operator Again' : 'Alert Operator'}</span>
              </button>
              <a 
                href="tel:+919876543210" 
                class="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs transition flex items-center justify-center space-x-1 shadow"
                title="Call tour coordinator directly">
                <i data-lucide="phone" class="w-3.5 h-3.5"></i>
                <span>Call</span>
              </a>
            </div>
          </div>
        </div>

        <!-- ============================================================================== -->
        <!-- PILLAR 2: HOTEL COLLISION -->
        <!-- ============================================================================== -->
        <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 dark:border-amber-500/40 space-y-2.5">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center space-x-2 text-xs font-black uppercase text-amber-700 dark:text-amber-300">
              <i data-lucide="building" class="w-4 h-4 text-amber-600 dark:text-amber-400"></i>
              <span>Pillar 2: Hotel Collision in ${destName}</span>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/30">
              Room Inventory Lock Active
            </span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div class="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-500/20">
              <span class="text-[10px] font-bold text-slate-400 uppercase block">Collided Accommodation</span>
              <strong class="text-slate-900 dark:text-white font-extrabold text-sm">${activeEvent.affected_accommodation}</strong>
            </div>
            <div class="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-500/20">
              <span class="text-[10px] font-bold text-slate-400 uppercase block">Immediate Reassignment Action</span>
              <strong class="text-amber-600 dark:text-amber-400 font-extrabold text-sm">${activeEvent.affected_checkin}</strong>
            </div>
          </div>
          <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            The property in <strong>${destName}</strong> encountered an environmental check-in collision under municipal structural safety regulations. Below are 3 verified replacement properties situated in certified safe zones of <strong>${destName}</strong>.
          </p>
        </div>

        <!-- ============================================================================== -->
        <!-- PILLAR 3: WEATHER / CLIMATE CHANGES & NATURAL CONDITIONS -->
        <!-- ============================================================================== -->
        <div class="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-teal-500/10 to-sky-500/10 border border-sky-500/30 dark:border-sky-500/40 space-y-2">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center space-x-2 text-xs font-black uppercase text-sky-700 dark:text-sky-300">
              <i data-lucide="cloud-lightning" class="w-4 h-4 text-sky-500 animate-pulse"></i>
              <span>Pillar 3: Weather & Climate Hazard Alert</span>
            </div>
            <div class="text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-sky-500/20">
              <span>Location: <strong>${destName}</strong></span>
              <span class="mx-1">&bull;</span>
              <span>Traveler: <strong>${travelerName}</strong></span>
            </div>
          </div>
          <p class="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            ${activeEvent.reason.includes('[3. WEATHER') ? activeEvent.reason.split('[3. WEATHER')[1].split('[4.')[0].replace('CLIMATE CHANGES]', '').trim() : activeEvent.reason}
          </p>
        </div>

        <!-- ============================================================================== -->
        <!-- PILLAR 4: TRANSPORTATION CHANGE / DELAY -->
        <!-- ============================================================================== -->
        <div class="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-500/30 dark:border-indigo-500/40 space-y-2">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center space-x-2 text-xs font-black uppercase text-indigo-700 dark:text-indigo-300">
              <i data-lucide="navigation" class="w-4 h-4 text-indigo-500"></i>
              <span>Pillar 4: Transportation Change & Reroute Delay</span>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-800 dark:text-indigo-200 border border-indigo-500/30">
              Operator-Covered Detour
            </span>
          </div>
          <div class="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-indigo-500/20 text-xs">
            <span class="text-[10px] font-bold text-slate-400 uppercase block">Active Transit Detour Corridor</span>
            <strong class="text-slate-900 dark:text-white font-extrabold text-sm">${activeEvent.affected_transport}</strong>
          </div>
          <p class="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
            All emergency cab / all-weather shuttle rerouting expenses in <strong>${destName}</strong> are fully covered and monitored in real-time by your tour operator.
          </p>
        </div>

        <!-- ============================================================================== -->
        <!-- EXPLAINABLE 5-FACTOR ALTERNATIVES IN THAT SPECIFIC AREA -->
        <!-- ============================================================================== -->
        <div class="space-y-4 pt-1">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
              <i data-lucide="sparkles" class="w-4 h-4 text-teal-600 dark:text-teal-400"></i>
              <span>Safe-Zone Replacement Hotels in ${destName}</span>
            </div>
            <span class="text-[10.5px] text-slate-400 font-mono">
              Score = 30% Pref + 25% Budget + 20% Loc + 15% Avail + 10% Time
            </span>
          </div>

          <div class="space-y-3">
            ${alternatives.map((alt, idx) => `
              <div class="p-4 sm:p-5 rounded-2xl border transition ${alt.is_recommended ? 'border-teal-500 bg-teal-50/20 dark:bg-teal-950/20 shadow-lg shadow-teal-500/10' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'} space-y-3">
                
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-xl ${alt.is_recommended ? 'bg-teal-500 text-white font-black' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold'} flex items-center justify-center text-sm shadow">
                      ${alt.overall_score}%
                    </div>
                    <div>
                      <div class="flex items-center space-x-2 flex-wrap gap-1">
                        <h4 class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                          ${alt.title}
                        </h4>
                        ${alt.is_recommended ? `
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-500 text-white flex items-center space-x-1 shadow-sm">
                            <i data-lucide="star" class="w-3 h-3 fill-white"></i>
                            <span>BEST MATCH</span>
                          </span>
                        ` : ''}
                      </div>
                      
                      <!-- Specific Area Location (Location Specific with Map Pin, NO Beach in Jaipur) -->
                      <p class="text-xs text-slate-600 dark:text-slate-300 mt-0.5 flex items-center space-x-1 flex-wrap gap-1">
                        <span class="font-bold text-slate-800 dark:text-slate-200">${alt.category}</span>
                        <span>&bull;</span>
                        <span class="flex items-center text-red-600 dark:text-red-400 font-medium">
                          <i data-lucide="map-pin" class="w-3 h-3 mr-1 inline shrink-0"></i>
                          <span>${alt.beach_proximity || alt.safe_zone || destName}</span>
                        </span>
                        <span>&bull;</span>
                        <span class="text-slate-500 font-mono">${alt.distance_km} km away</span>
                      </p>
                    </div>
                  </div>

                  <div class="text-left sm:text-right">
                    <div class="text-sm font-extrabold ${alt.price_delta > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-500'}">
                      ${alt.price_delta > 0 ? '+Rs ' + alt.price_delta : (alt.price_delta < 0 ? '-Rs ' + Math.abs(alt.price_delta) : 'Same Price')}
                    </div>
                    <div class="text-[10px] text-slate-400">price difference</div>
                  </div>
                </div>

                <!-- 5-Factor Score Matrix Pills -->
                <div class="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[10px] bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <div>
                    <span class="text-slate-400 block">Style Match (30%)</span>
                    <span class="font-bold text-slate-700 dark:text-slate-300">${alt.preference_match}%</span>
                  </div>
                  <div>
                    <span class="text-slate-400 block">Budget Fit (25%)</span>
                    <span class="font-bold text-slate-700 dark:text-slate-300">${alt.budget_match}%</span>
                  </div>
                  <div>
                    <span class="text-slate-400 block">Location (20%)</span>
                    <span class="font-bold text-slate-700 dark:text-slate-300">${alt.location_match}%</span>
                  </div>
                  <div>
                    <span class="text-slate-400 block">Availability (15%)</span>
                    <span class="font-bold text-slate-700 dark:text-slate-300">${alt.availability_match}%</span>
                  </div>
                  <div>
                    <span class="text-slate-400 block">Timing (10%)</span>
                    <span class="font-bold text-slate-700 dark:text-slate-300">${alt.time_match}%</span>
                  </div>
                </div>

                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  ${alt.description}
                </p>

                <!-- Select / Apply Button -->
                <div class="pt-1 flex justify-end">
                  <button 
                    onclick="window.applyChangeResolution(${activeEvent.id}, ${alt.id})" 
                    class="px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${alt.is_recommended ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-500/20' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'}">
                    <i data-lucide="check" class="w-3.5 h-3.5"></i>
                    <span>${alt.is_recommended ? 'Apply Recommended Alternative' : 'Select This Alternative'}</span>
                  </button>
                </div>

              </div>
            `).join('')}
          </div>
        </div>

      </div>
    </div>
  `;
}
