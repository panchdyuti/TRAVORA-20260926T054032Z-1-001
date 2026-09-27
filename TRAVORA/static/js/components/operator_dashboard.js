import { store } from '../store.js';
import { api } from '../api.js';

export function renderOperatorDashboard() {
  const state = store.getState();
  const user = state.user || { id: 1, name: 'Aarav Mehta', role: 'operator', company_name: 'Goa Coastal Expeditions' };
  const operatorData = state.operatorData || {
    operator_profile: {
      id: user.id || 1,
      name: user.name || "Aarav Mehta",
      company_name: user.company_name || "Goa Coastal Expeditions & Watersports",
      rating: 4.9,
      fleet_size: "14 Speedboats & Jet Skis, 8 AC Vans",
      response_time_minutes: 4,
      is_isolated_view: true
    },
    kpis: {
      active_tours: 4,
      today_checkins: 2,
      pending_changes: 0,
      alerts: 0,
      revenue: "Rs 1,45,000",
      resolution_time: "4 min",
      success_rate: "100%"
    },
    active_tours: [
      { id: 1, code: "TR1024", customer_name: "Krishna Singh", destination: "Goa", dates: "09-12 to 09-15", coordinator: "Aarav Mehta", status: "active", travelers: 2, cost: 20500 },
      { id: 2, code: "TR1029", customer_name: "Sneha Reddy", destination: "Goa", dates: "09-18 to 09-22", coordinator: "Aarav Mehta", status: "active", travelers: 4, cost: 48000 }
    ]
  };

  const kpis = operatorData.kpis || {};
  const tours = operatorData.active_tours || [];
  const operatorPackages = state.operatorPackages || [];
  const placeRequests = state.operatorPlaceRequests || [];
  const alerts = state.operatorAlerts || [];
  const pendingAlerts = alerts.filter(a => a.status === 'pending');
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved');
  const vendors = state.vendors || [];
  const activeTab = state.operatorActiveTab || 'tours'; // 'tours', 'alerts', 'fleet', 'packages', 'requests'

  // Total pending alert count across tours and alert feed
  const activeAlertToursCount = tours.filter(t => t.status === 'alert' || t.status === 'attention' || t.has_pending_alert).length;
  const totalPendingAlerts = Math.max(activeAlertToursCount, pendingAlerts.length, kpis.alerts || 0);

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      <!-- TOP OPERATIONS HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div class="flex items-center space-x-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              OPERATOR COMMAND HUB
            </span>
            <span class="text-xs text-slate-400 font-mono">Isolated Operator Profile: #${operatorData.operator_profile ? operatorData.operator_profile.id : 1}</span>
            ${totalPendingAlerts > 0 ? `
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-600 text-white animate-pulse">
                ${totalPendingAlerts} Active Disruption Alert${totalPendingAlerts > 1 ? 's' : ''}
              </span>
            ` : `
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                <i data-lucide="shield-check" class="w-3 h-3"></i>
                <span>All Clear & Synced</span>
              </span>
            `}
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            ${operatorData.operator_profile ? operatorData.operator_profile.company_name : 'Tour Operator Dispatch'}
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Operator Lead: <strong>${operatorData.operator_profile ? operatorData.operator_profile.name : 'Aarav Mehta'}</strong> - Rating: 4.9 - Fleet: ${operatorData.operator_profile ? operatorData.operator_profile.fleet_size : '14 Speedboats & Jet Skis, 8 AC Vans'}
          </p>
        </div>

        <div class="flex items-center space-x-3">
          <button 
            type="button"
            onclick="window.refreshAlertsFeed()" 
            class="px-3.5 py-2 rounded-xl surface-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-300 dark:border-slate-700 transition flex items-center space-x-1.5 shadow-sm">
            <i data-lucide="refresh-cw" class="w-3.5 h-3.5 text-amber-500"></i>
            <span>Sync Live</span>
          </button>
          <button 
            type="button"
            onclick="window.openNewPackageModal()" 
            class="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center space-x-1.5">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>Create New Package</span>
          </button>
        </div>
      </div>

      <!-- CRITICAL OPERATOR ALERT: CONTACT TRAVELLER (If triggered) -->
      ${(state.urgentTravellerIssue || (state.notifications || []).find(n => n.role === 'operator' && !n.is_read && n.message && n.message.toLowerCase().includes('contact traveller'))) ? `
        <div class="p-5 rounded-3xl bg-red-500/10 border-2 border-red-500 shadow-xl space-y-3">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-start sm:items-center space-x-3.5">
              <div class="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold shrink-0 shadow-lg shadow-red-500/40">
                <i data-lucide="phone-call" class="w-6 h-6"></i>
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-600 text-white tracking-wider">
                    CRITICAL DISRUPTION ALERT
                  </span>
                  <span class="text-xs font-bold text-red-600 dark:text-red-400">
                    CONTACT TRAVELLER IMMEDIATELY
                  </span>
                </div>
                <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  ${(state.urgentTravellerIssue && state.urgentTravellerIssue.customer_name) ? `Traveller ${state.urgentTravellerIssue.customer_name} (Tour #${state.urgentTravellerIssue.tour_code || 'TR1024'}) reported an issue` : 'Traveller On-Ground Disruption Alert'}
                </h3>
                <p class="text-xs text-slate-600 dark:text-slate-300">
                  ${(state.urgentTravellerIssue && state.urgentTravellerIssue.message) ? state.urgentTravellerIssue.message : 'Contact traveller: he/she has an issue. Immediate phone assistance required.'}
                </p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 shrink-0">
              <a 
                href="tel:${(state.urgentTravellerIssue && state.urgentTravellerIssue.phone) || '+919876543210'}" 
                class="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-md transition flex items-center space-x-1.5">
                <i data-lucide="phone" class="w-3.5 h-3.5"></i>
                <span>Call Traveller (${(state.urgentTravellerIssue && state.urgentTravellerIssue.phone) || '+91 98765 43210'})</span>
              </a>
              <button 
                type="button" 
                onclick="window.markTravellerContacted()" 
                class="px-4 py-2.5 rounded-xl surface-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 transition flex items-center space-x-1">
                <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500"></i>
                <span>Mark Contacted</span>
              </button>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- KPI METRIC CARDS -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div class="surface-card p-5 rounded-2xl space-y-1 cursor-pointer hover:border-amber-500 transition" onclick="window.setOperatorActiveTab('tours')">
          <div class="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>My Active Tours</span>
            <i data-lucide="compass" class="w-4 h-4 text-teal-500"></i>
          </div>
          <div class="text-2xl font-black text-slate-900 dark:text-white">${kpis.active_tours || tours.length}</div>
          <div class="text-[10px] text-emerald-500 font-medium">100% Isolated Dispatch Scope</div>
        </div>

        <div class="surface-card p-5 rounded-2xl space-y-1 cursor-pointer hover:border-red-500 transition" onclick="window.setOperatorActiveTab('alerts')">
          <div class="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Operations Alerts</span>
            <i data-lucide="alert-triangle" class="w-4 h-4 ${totalPendingAlerts > 0 ? 'text-red-500' : 'text-slate-400'}"></i>
          </div>
          <div class="text-2xl font-black ${totalPendingAlerts > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}">
            ${totalPendingAlerts}
          </div>
          <div class="text-[10px] ${totalPendingAlerts > 0 ? 'text-red-500 font-bold' : 'text-emerald-500 font-medium'}">
            ${totalPendingAlerts > 0 ? 'Action Required' : 'All Clear — Zero Pending'}
          </div>
        </div>

        <div class="surface-card p-5 rounded-2xl space-y-1 cursor-pointer hover:border-amber-500 transition" onclick="window.setOperatorActiveTab('fleet')">
          <div class="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Fleet & Vendors</span>
            <i data-lucide="truck" class="w-4 h-4 text-indigo-500"></i>
          </div>
          <div class="text-2xl font-black text-slate-900 dark:text-white">${vendors.length > 0 ? vendors.length : 20}</div>
          <div class="text-[10px] text-slate-400">Boats, Vans & Hotel Suppliers</div>
        </div>

        <div class="surface-card p-5 rounded-2xl space-y-1 cursor-pointer hover:border-amber-500 transition" onclick="window.setOperatorActiveTab('packages')">
          <div class="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Published Packages</span>
            <i data-lucide="package" class="w-4 h-4 text-blue-500"></i>
          </div>
          <div class="text-2xl font-black text-slate-900 dark:text-white">${operatorPackages.length}</div>
          <div class="text-[10px] text-slate-400">Standard, Group & Festival</div>
        </div>

        <div class="surface-card p-5 rounded-2xl space-y-1 col-span-2 lg:col-span-1">
          <div class="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Tour Revenue</span>
            <i data-lucide="credit-card" class="w-4 h-4 text-emerald-500"></i>
          </div>
          <div class="text-2xl font-black text-slate-900 dark:text-white">${kpis.revenue || 'Rs 1,45,000'}</div>
          <div class="text-[10px] text-emerald-500 font-medium">${kpis.success_rate || '100%'} success rate</div>
        </div>

      </div>

      <!-- OPERATOR WORKSPACE TABS: SYNCHRONIZED -->
      <div class="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button 
          onclick="window.setOperatorActiveTab('tours')"
          class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 whitespace-nowrap ${(activeTab === 'tours' || activeTab === 'roster') ? 'bg-amber-600 text-white shadow-md' : 'surface-card text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}">
          <i data-lucide="compass" class="w-4 h-4"></i>
          <span>Active Tours (${tours.length})</span>
        </button>

        <button 
          onclick="window.setOperatorActiveTab('alerts')"
          class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 whitespace-nowrap ${activeTab === 'alerts' ? 'bg-red-600 text-white shadow-md' : 'surface-card text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}">
          <i data-lucide="alert-triangle" class="w-4 h-4 ${totalPendingAlerts > 0 ? 'text-amber-300' : 'text-slate-400'}"></i>
          <span>Operations Alert</span>
          ${totalPendingAlerts > 0 ? `
            <span class="px-2 py-0.2 rounded-full text-[10px] font-black uppercase bg-white text-red-600 animate-pulse">${totalPendingAlerts} Active</span>
          ` : `
            <span class="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">All Clear</span>
          `}
        </button>

        <button 
          onclick="window.setOperatorActiveTab('fleet')"
          class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 whitespace-nowrap ${activeTab === 'fleet' ? 'bg-amber-600 text-white shadow-md' : 'surface-card text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}">
          <i data-lucide="truck" class="w-4 h-4"></i>
          <span>Fleet & Vendors</span>
        </button>

        <button 
          onclick="window.setOperatorActiveTab('packages')"
          class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 whitespace-nowrap ${activeTab === 'packages' ? 'bg-amber-600 text-white shadow-md' : 'surface-card text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}">
          <i data-lucide="package" class="w-4 h-4"></i>
          <span>Package Builder (${operatorPackages.length})</span>
        </button>

        <button 
          onclick="window.setOperatorActiveTab('requests')"
          class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 whitespace-nowrap ${activeTab === 'requests' ? 'bg-amber-600 text-white shadow-md' : 'surface-card text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}">
          <i data-lucide="map-pin" class="w-4 h-4"></i>
          <span>Place Requests (${placeRequests.filter(r => r.status === 'Pending').length})</span>
        </button>
      </div>

      <!-- TAB 1: ACTIVE TOURS & TRAVELLER LOGS -->
      ${(activeTab === 'tours' || activeTab === 'roster') ? `
        <div class="surface-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 class="text-base font-extrabold text-slate-900 dark:text-white">
                Assigned Traveller Tour Roster
              </h2>
              <p class="text-xs text-slate-400">
                Direct traveller itineraries assigned to your fleet dispatch. Disruption alerts appear only when active collisions occur.
              </p>
            </div>
            <div class="text-xs text-slate-400">
              Showing ${tours.length} active traveller itineraries
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th class="py-3 px-3">Tour ID</th>
                  <th class="py-3 px-3">Traveler</th>
                  <th class="py-3 px-3">Destination</th>
                  <th class="py-3 px-3">Dates</th>
                  <th class="py-3 px-3">Coordinator</th>
                  <th class="py-3 px-3">Value</th>
                  <th class="py-3 px-3">Status</th>
                  <th class="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                ${tours.map(t => {
                  const isAlert = t.status === 'alert' || t.status === 'attention' || t.has_pending_alert;
                  return `
                    <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition ${isAlert ? 'bg-red-50/40 dark:bg-red-950/20' : ''}">
                      <td class="py-3 px-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                        #${t.code}
                      </td>
                      <td class="py-3 px-3">
                        <div class="font-bold text-slate-800 dark:text-slate-200">${t.customer_name}</div>
                        <div class="text-[10px] text-slate-400">${t.travelers} Guests - ${t.customer_phone || '+91 98765 43210'}</div>
                      </td>
                      <td class="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                        ${t.destination}
                      </td>
                      <td class="py-3 px-3 text-slate-500 font-mono">
                        ${t.dates}
                      </td>
                      <td class="py-3 px-3 font-medium text-slate-600 dark:text-slate-300">
                        ${t.coordinator}
                      </td>
                      <td class="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        Rs ${(t.cost || 0).toLocaleString('en-IN')}
                      </td>
                      <td class="py-3 px-3">
                        ${isAlert ? `
                          <span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/40 animate-pulse">
                            <i data-lucide="alert-triangle" class="w-3 h-3 text-red-600 dark:text-red-400"></i>
                            <span>ALERT</span>
                          </span>
                        ` : `
                          <span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>Active</span>
                          </span>
                        `}
                      </td>
                      <td class="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                        ${isAlert ? `
                          <button 
                            type="button"
                            onclick="window.openDisruptionModal(${t.id}, ${t.active_change_event_id || ''})" 
                            class="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-black text-[11px] shadow-sm transition inline-flex items-center space-x-1">
                            <i data-lucide="wrench" class="w-3.5 h-3.5"></i>
                            <span>Resolve Alert</span>
                          </button>
                        ` : ''}
                        <button 
                          type="button"
                          onclick="window.inspectTourDetail(${t.id})" 
                          class="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-600 hover:text-white text-teal-600 dark:text-teal-400 font-bold transition border border-teal-200 dark:border-teal-800 text-[11px]">
                          Inspect
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      <!-- TAB 2: OPERATIONS ALERT FEED -->
      ${activeTab === 'alerts' ? `
        <div class="surface-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div class="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center space-x-1.5">
                <i data-lucide="shield-alert" class="w-4 h-4"></i>
                <span>Operations Alert Center</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Real-Time Disruption & Resolution Feed
              </h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Meteorological and supply chain collision detections with 1-click alternative resolution.
              </p>
            </div>

            <div class="flex items-center space-x-2">
              <button 
                type="button"
                onclick="window.refreshAlertsFeed()" 
                class="px-3.5 py-2 rounded-xl surface-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-300 dark:border-slate-700 transition flex items-center space-x-1.5">
                <i data-lucide="refresh-cw" class="w-3.5 h-3.5 text-amber-500"></i>
                <span>Sync Live Feed</span>
              </button>
            </div>
          </div>

          <!-- PENDING ALERTS SECTION -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center space-x-2">
                <span>Active Pending Alerts (${pendingAlerts.length})</span>
              </h3>
            </div>

            ${pendingAlerts.length === 0 ? `
              <div class="p-8 surface-card rounded-2xl border border-dashed border-emerald-500/30 text-center space-y-2 bg-emerald-500/5">
                <div class="w-12 h-12 mx-auto rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <i data-lucide="shield-check" class="w-6 h-6"></i>
                </div>
                <h4 class="text-sm font-extrabold text-slate-900 dark:text-white">All Clear! No Active Pending Alerts</h4>
                <p class="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  All traveler itineraries and supply chain dependencies are operating normally with 100% synchronization.
                </p>
              </div>
            ` : `
              <div class="space-y-3">
                ${pendingAlerts.map(a => `
                  <div class="surface-card rounded-2xl p-5 border-2 border-red-500/50 bg-red-50/20 dark:bg-red-950/20 shadow-md space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div class="flex items-center space-x-3">
                        <div class="w-9 h-9 rounded-xl bg-red-500 text-white flex items-center justify-center font-bold shrink-0">
                          <i data-lucide="alert-octagon" class="w-5 h-5"></i>
                        </div>
                        <div>
                          <div class="flex items-center space-x-2">
                            <span class="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">#${a.tour_code}</span>
                            <span class="text-xs font-bold text-slate-800 dark:text-slate-200">- ${a.customer_name}</span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-600 text-white animate-pulse">
                              ALERT PENDING
                            </span>
                          </div>
                          <h4 class="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                            ${a.title}
                          </h4>
                        </div>
                      </div>

                      <div class="text-left sm:text-right">
                        <div class="text-xs font-bold text-slate-800 dark:text-slate-200">
                          ${a.cost_delta > 0 ? '+Rs ' + a.cost_delta : (a.cost_delta < 0 ? '-Rs ' + Math.abs(a.cost_delta) : 'Rs 0 Impact')}
                        </div>
                        <div class="text-[10px] text-slate-400 font-mono">Financial Delta</div>
                      </div>
                    </div>

                    <div class="text-xs text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-900/70 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <span class="font-bold text-slate-800 dark:text-slate-200">Impact Analysis: </span>${a.impact_summary}
                    </div>

                    <div class="flex items-center justify-between pt-1">
                      <div class="text-[10px] text-slate-400">
                        ${a.created_at ? 'Detected: ' + a.created_at.slice(0, 19).replace('T', ' ') : ''}
                      </div>

                      <div class="flex items-center space-x-2">
                        <button 
                          type="button"
                          onclick="window.inspectTourDetail(${a.tour_id || 1})" 
                          class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                          Inspect Tour
                        </button>
                        <button 
                          type="button"
                          onclick="window.openDisruptionModal(${a.tour_id || 1}, ${a.id})" 
                          class="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow transition flex items-center space-x-1.5">
                          <i data-lucide="wrench" class="w-3.5 h-3.5"></i>
                          <span>Review & Resolve</span>
                        </button>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- RESOLVED ARCHIVE SECTION -->
          ${resolvedAlerts.length > 0 ? `
            <div class="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <i data-lucide="check-circle" class="w-4 h-4 text-emerald-500"></i>
                <span>Resolved Alerts Archive (${resolvedAlerts.length})</span>
              </h3>
              <div class="space-y-2">
                ${resolvedAlerts.map(a => `
                  <div class="surface-card rounded-xl p-3.5 border border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-950/10 flex items-center justify-between">
                    <div>
                      <div class="flex items-center space-x-2">
                        <span class="font-mono text-xs font-bold text-slate-500">#${a.tour_code}</span>
                        <span class="text-xs font-bold text-slate-700 dark:text-slate-300">${a.customer_name}</span>
                        <span class="px-2 py-0.2 rounded text-[9.5px] font-bold uppercase bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                          RESOLVED
                        </span>
                      </div>
                      <p class="text-xs text-slate-600 dark:text-slate-400 mt-0.5">${a.title}</p>
                    </div>
                    <div class="flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
                      <span>Synced</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

        </div>
      ` : ''}

      <!-- TAB 3: FLEET & VENDORS -->
      ${activeTab === 'fleet' ? `
        <div class="surface-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div class="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center space-x-1.5">
                <i data-lucide="truck" class="w-4 h-4"></i>
                <span>Supply Chain & Fleet Network</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Fleet Roster & Vendor Suppliers
              </h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Active transport fleets, drivers, hotel suppliers, and verified activity partners.
              </p>
            </div>
            
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                100% Operational
              </span>
            </div>
          </div>

          <!-- OPERATOR FLEET HIGHLIGHT -->
          <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <i data-lucide="ship" class="w-5 h-5"></i>
              </div>
              <div>
                <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">Active Dispatch Fleet</h4>
                <p class="text-xs text-slate-600 dark:text-slate-300">
                  ${operatorData.operator_profile ? operatorData.operator_profile.fleet_size : '14 Speedboats & Jet Skis, 8 AC Vans'}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2 text-xs font-bold text-amber-700 dark:text-amber-300">
              <i data-lucide="radio" class="w-4 h-4 text-emerald-500 animate-pulse"></i>
              <span>Live GPS Telemetry Connected</span>
            </div>
          </div>

          <!-- VENDORS DIRECTORY GRID -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${(vendors.length > 0 ? vendors : [
              { id: 1, name: "Paradise Hospitality Group", category: "Hotels", rating: 4.8, availability: "High (42 Rooms)", status: "Active", contact: "+91 98201 54321", location: "North Goa (Baga)" },
              { id: 2, name: "Goa Aqua Adventures & Water Sports", category: "Activities", rating: 4.9, availability: "High", status: "Active", contact: "+91 98333 77889", location: "Calangute Watersports Jetty" },
              { id: 3, name: "Royal Konkan Express Coach Fleet", category: "Transport", rating: 4.7, availability: "Operational", status: "Active", contact: "+91 98111 44556", location: "Mumbai - Goa Highway" },
              { id: 4, name: "Spice Coast Heritage Guides", category: "Guides", rating: 4.9, availability: "High", status: "Active", contact: "+91 98444 66778", location: "Panjim Latin Quarter" },
              { id: 5, name: "Himalayan Highs 4x4 Mountain Fleets", category: "Transport", rating: 4.9, availability: "Operational (12 Vehicles)", status: "Active", contact: "+91 98160 55221", location: "Manali Mall Road" },
              { id: 6, name: "Backwater Breeze Houseboat & Cruiser Fleet", category: "Transport", rating: 4.9, availability: "Operational (8 Houseboats)", status: "Active", contact: "+91 477 2244100", location: "Alleppey, Kerala" }
            ]).map(v => `
              <div class="surface-card rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-amber-500 transition">
                <div class="flex items-start justify-between">
                  <div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${v.category === 'Hotels' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' : (v.category === 'Transport' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300')}">
                      ${v.category}
                    </span>
                    <h4 class="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                      ${v.name}
                    </h4>
                    <p class="text-xs text-slate-400">${v.location || 'Operating Hub'}</p>
                  </div>
                  <div class="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 text-xs font-bold">
                    <i data-lucide="star" class="w-3 h-3 fill-amber-500 text-amber-500"></i>
                    <span>${v.rating || 4.8}</span>
                  </div>
                </div>

                <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Inventory Status:</span>
                    <span class="font-bold text-emerald-500">${v.availability || 'Operational'}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Contact:</span>
                    <a href="tel:${v.contact || '+91 98201 54321'}" class="font-bold text-teal-600 dark:text-teal-400 hover:underline">
                      ${v.contact || '+91 98201 54321'}
                    </a>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- TAB 4: OPERATOR PACKAGE BUILDER -->
      ${activeTab === 'packages' ? `
        <div class="surface-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 class="text-base font-extrabold text-slate-900 dark:text-white">
                My Tour Packages (Standard, Festival & Group)
              </h2>
              <p class="text-xs text-slate-400">
                Create and manage custom packages with transparent seat capacities and fixed pricing.
              </p>
            </div>
            <button 
              type="button" 
              onclick="window.openNewPackageModal()"
              class="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm transition flex items-center space-x-1.5">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i>
              <span>Add Package</span>
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            ${operatorPackages.map(pkg => `
              <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 flex flex-col justify-between shadow-sm">
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${pkg.is_festival_package ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' : 'bg-teal-500/20 text-teal-700 dark:text-teal-300'}">
                      ${pkg.package_type}
                    </span>
                    <span class="text-xs font-extrabold text-slate-900 dark:text-white">Rs ${(pkg.price_per_person || 0).toLocaleString('en-IN')} / person</span>
                  </div>
                  <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">${pkg.title}</h4>
                  <div class="text-[11px] text-slate-400">${pkg.destination_name} - ${pkg.duration_days} Days</div>
                  <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">${pkg.description}</p>
                </div>
                <div class="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] flex justify-between items-center text-slate-400">
                  <span>Capacity: ${pkg.available_seats || pkg.capacity} Seats</span>
                  <button 
                    type="button" 
                    onclick="window.deleteOperatorPackage(${pkg.id})"
                    class="text-red-500 hover:underline font-bold text-[10px]">
                    Delete
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- TAB 5: ADDITIONAL PLACE REQUESTS -->
      ${activeTab === 'requests' ? `
        <div class="surface-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 class="text-base font-extrabold text-slate-900 dark:text-white">
                Traveller Additional Place Modification Requests
              </h2>
              <p class="text-xs text-slate-400">
                Review, approve, or deny requested destinations with computed impact analysis.
              </p>
            </div>
          </div>

          ${placeRequests.length === 0 ? `
            <div class="text-center py-10 text-xs text-slate-400">
              No pending place requests from travellers.
            </div>
          ` : `
            <div class="space-y-3">
              ${placeRequests.map(req => `
                <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div class="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                        <span>Requested Spot: ${req.place_name}</span>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${req.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-amber-500/20 text-amber-600'}">
                          ${req.status}
                        </span>
                      </div>
                      <div class="text-xs text-slate-400 mt-0.5">Tour #${req.tour_code || 'TR1024'} - Target Day ${req.day_number}</div>
                    </div>
                    <div class="text-right">
                      <div class="font-black text-sm text-teal-600 dark:text-teal-400">+Rs ${(req.estimated_price_delta || 2000).toLocaleString('en-IN')}</div>
                      <div class="text-[10px] text-slate-400">+${req.travel_time_hours || 3.0} hrs - ~${req.distance_km || 28} km</div>
                    </div>
                  </div>

                  <div class="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl">
                    ${req.notes ? `Traveller Notes: "${req.notes}"` : 'Standard traveler additional landmark request.'}
                  </div>

                  ${req.status === 'Pending' ? `
                    <div class="flex items-center space-x-2 pt-1">
                      <button 
                        type="button" 
                        onclick="window.actionPlaceRequest(${req.id}, 'Approved')"
                        class="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition">
                        Approve & Sync Itinerary
                      </button>
                      <button 
                        type="button" 
                        onclick="window.actionPlaceRequest(${req.id}, 'Denied')"
                        class="px-4 py-1.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-bold text-xs transition">
                        Deny
                      </button>
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          `}
        </div>
      ` : ''}

      <!-- MODAL: OPERATOR PACKAGE BUILDER -->
      <div id="new-package-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
        <div class="surface-card rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 modal-content">
          <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div class="flex items-center space-x-2">
              <i data-lucide="package" class="w-5 h-5 text-amber-500"></i>
              <h3 class="font-extrabold text-base text-slate-900 dark:text-white">Create Operator Tour Package</h3>
            </div>
            <button onclick="window.closeNewPackageModal()" class="p-1 rounded-lg text-slate-400 hover:text-slate-600">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <form onsubmit="window.submitCreateOperatorPackage(event)" class="space-y-3 text-xs">
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Package Title</label>
              <input type="text" name="title" required placeholder="e.g. 4-Day Coastal Goa Scuba & Heritage Special" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Destination</label>
                <input type="text" name="destination_name" required value="Goa" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Package Type</label>
                <select name="package_type" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold">
                  <option value="private">Private Bespoke Package</option>
                  <option value="group">Group Package</option>
                  <option value="festival">Festival Special Package</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Duration (Days)</label>
                <input type="number" name="duration_days" required value="4" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Price / Person (INR)</label>
                <input type="number" name="price_per_person" required value="18500" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Capacity (Seats)</label>
                <input type="number" name="capacity" required value="12" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs" />
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Package Description & Inclusions</label>
              <textarea name="description" rows="2" placeholder="Detail the vehicles, hotel tiers, and activities included..." class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"></textarea>
            </div>

            <div class="pt-2">
              <button type="submit" class="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition">
                Publish Package to Traveller Discovery
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `;
}

window.setOperatorActiveTab = async function(tab) {
  store.setState({ operatorActiveTab: tab });
  const user = store.getState().user;
  const operatorId = user ? user.id : 1;

  if (tab === 'tours' || tab === 'roster') {
    const data = await api.getOperatorDashboard(operatorId).catch(() => null);
    if (data) store.setState({ operatorData: data });
  } else if (tab === 'alerts') {
    const [alerts, data] = await Promise.all([
      api.getOperatorAlerts(operatorId).catch(() => []),
      api.getOperatorDashboard(operatorId).catch(() => null)
    ]);
    store.setState({ operatorAlerts: alerts, operatorData: data || store.getState().operatorData });
  } else if (tab === 'fleet') {
    const vendors = await api.getVendors().catch(() => []);
    if (vendors && vendors.length > 0) store.setState({ vendors: vendors });
  } else if (tab === 'packages') {
    const pkgs = await api.getMyPackages(operatorId).catch(() => []);
    store.setState({ operatorPackages: pkgs });
  } else if (tab === 'requests') {
    const reqs = await api.getOperatorPlaceRequests(operatorId).catch(() => []);
    store.setState({ operatorPlaceRequests: reqs });
  }
};

window.refreshAlertsFeed = async function() {
  const user = store.getState().user;
  const operatorId = user ? user.id : 1;
  store.addToast('Syncing real-time disruption & alert feed...', 'info', 1500);
  const [alerts, data, vendors] = await Promise.all([
    api.getOperatorAlerts(operatorId).catch(() => []),
    api.getOperatorDashboard(operatorId).catch(() => null),
    api.getVendors().catch(() => [])
  ]);
  store.setState({
    operatorAlerts: alerts,
    operatorData: data || store.getState().operatorData,
    vendors: (vendors && vendors.length > 0) ? vendors : store.getState().vendors
  });
  store.addToast('Operations feed synchronized!', 'success', 2000);
};

window.openNewPackageModal = function() {
  const modal = document.getElementById('new-package-modal');
  if (modal) modal.classList.remove('hidden');
};

window.closeNewPackageModal = function() {
  const modal = document.getElementById('new-package-modal');
  if (modal) modal.classList.add('hidden');
};

window.submitCreateOperatorPackage = async function(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const user = store.getState().user;

  const payload = {
    title: formData.get('title'),
    destination_name: formData.get('destination_name'),
    package_type: formData.get('package_type'),
    duration_days: parseInt(formData.get('duration_days') || '3'),
    price_per_person: parseFloat(formData.get('price_per_person') || '15000'),
    capacity: parseInt(formData.get('capacity') || '10'),
    available_seats: parseInt(formData.get('capacity') || '10'),
    description: formData.get('description') || '',
    is_festival_package: formData.get('package_type') === 'festival',
    operator_id: user ? user.id : 1
  };

  try {
    store.addToast('Publishing operator package to database...', 'info');
    await api.createPackage(payload);
    window.closeNewPackageModal();
    const pkgs = await api.getMyPackages(user ? user.id : 1).catch(() => []);
    store.setState({ operatorPackages: pkgs });
    store.addToast('Package published successfully!', 'success');
  } catch (err) {
    console.error(err);
    store.addToast('Failed to create package: ' + err.message, 'critical');
  }
};

window.deleteOperatorPackage = async function(pkgId) {
  if (!confirm('Are you sure you want to remove this package?')) return;
  try {
    await api.deletePackage(pkgId);
    const user = store.getState().user;
    const pkgs = await api.getMyPackages(user ? user.id : 1).catch(() => []);
    store.setState({ operatorPackages: pkgs });
    store.addToast('Package removed.', 'info');
  } catch (err) {
    console.error(err);
    store.addToast('Delete failed: ' + err.message, 'critical');
  }
};

window.actionPlaceRequest = async function(requestId, action) {
  try {
    store.addToast(`Processing ${action.toLowerCase()} for place request...`, 'info');
    await api.actionPlaceRequest(requestId, { action: action });
    const user = store.getState().user;
    const reqs = await api.getOperatorPlaceRequests(user ? user.id : 1).catch(() => []);
    store.setState({ operatorPlaceRequests: reqs });
    store.addToast(`Place request has been ${action} and traveller notified.`, 'success');
  } catch (err) {
    console.error(err);
    store.addToast('Action failed: ' + err.message, 'critical');
  }
};
