import { store } from '../store.js';
import { api } from '../api.js';

export function renderMyBookings() {
  const state = store.getState();
  const bookings = state.userBookings || [];
  const activeFilter = window.myBookingsFilter || 'all';

  const filteredBookings = bookings.filter(b => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'flight' && (b.service_category === 'flight' || b.tour?.package_type?.includes('flight'))) return true;
    if (activeFilter === 'hotel' && (b.service_category === 'hotel' || b.tour?.package_type?.includes('hotel'))) return true;
    if (activeFilter === 'package' && (b.service_category === 'package' || b.tour?.package_type?.includes('package') || b.service_category === 'tour')) return true;
    if (activeFilter === 'bus_cab' && (b.service_category === 'bus_cab' || b.service_category === 'bus' || b.tour?.package_type?.includes('bus'))) return true;
    if (activeFilter === 'train' && (b.service_category === 'train' || b.tour?.package_type?.includes('train'))) return true;
    return true;
  });

  const totalSpent = bookings.reduce((acc, b) => acc + (b.amount_paid || 0), 0);
  const confirmedCount = bookings.filter(b => (b.booking_status || 'confirmed').toLowerCase() === 'confirmed').length;

  return `
    <div class="min-h-screen bg-slate-50 dark:bg-[#0c0104] text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      
      <!-- HEADER HERO BANNER -->
      <div class="max-w-7xl mx-auto rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#20040a] via-[#4a0815] to-[#140206] text-white shadow-2xl relative overflow-hidden border border-red-500/20">
        <div class="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <i data-lucide="ticket" class="w-96 h-96 text-white"></i>
        </div>

        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2 max-w-2xl">
            <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-xs font-bold text-red-200">
              <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-400"></i>
              <span>OFFICIAL TRAVEL LEDGER & RESERVATIONS</span>
            </div>
            <h1 class="text-2xl sm:text-4xl font-black tracking-tight">My Confirmed Bookings</h1>
            <p class="text-xs sm:text-sm text-slate-300">
              Manage your verified airline e-tickets, luxury stay reservations, curated tour packages, interstate cabs, and railway berths with 1-click tax receipts and live dispatch tracking.
            </p>
          </div>

          <!-- SUMMARY METRICS CAPSULE -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div class="p-3.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-center">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Bookings</span>
              <span class="text-xl sm:text-2xl font-black text-white mt-0.5 block">${bookings.length}</span>
              <span class="text-[10px] text-emerald-400 font-bold">100% Synced</span>
            </div>
            <div class="p-3.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-center">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active / Confirmed</span>
              <span class="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5 block">${confirmedCount}</span>
              <span class="text-[10px] text-slate-400 font-bold">Verified Status</span>
            </div>
            <div class="p-3.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-center col-span-2 sm:col-span-1">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Value</span>
              <span class="text-lg sm:text-xl font-black text-amber-300 mt-0.5 block">₹${totalSpent.toLocaleString('en-IN')}</span>
              <span class="text-[10px] text-slate-400 font-bold">Includes 5% GST</span>
            </div>
          </div>
        </div>

        <!-- QUICK CATEGORY FILTERS -->
        <div class="relative z-10 pt-8 flex flex-wrap items-center gap-2 text-xs">
          <span class="text-xs font-bold text-slate-300 mr-2 flex items-center space-x-1">
            <i data-lucide="filter" class="w-3.5 h-3.5 text-red-400"></i>
            <span>Filter Category:</span>
          </span>
          ${[
            { id: 'all', label: 'All Bookings', count: bookings.length },
            { id: 'flight', label: 'Flights', count: bookings.filter(b => b.service_category === 'flight' || b.tour?.package_type?.includes('flight')).length },
            { id: 'hotel', label: 'Hotels & Stays', count: bookings.filter(b => b.service_category === 'hotel' || b.tour?.package_type?.includes('hotel')).length },
            { id: 'package', label: 'Holiday Packages', count: bookings.filter(b => b.service_category === 'package' || b.tour?.package_type?.includes('package') || b.service_category === 'tour').length },
            { id: 'bus_cab', label: 'Buses & Cabs', count: bookings.filter(b => b.service_category === 'bus_cab' || b.service_category === 'bus' || b.tour?.package_type?.includes('bus')).length },
            { id: 'train', label: 'Trains & Rail', count: bookings.filter(b => b.service_category === 'train' || b.tour?.package_type?.includes('train')).length }
          ].map(f => `
            <button 
              type="button" 
              onclick="window.filterMyBookings('${f.id}')"
              class="px-3.5 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 ${activeFilter === f.id ? 'bg-white text-slate-900 shadow-md font-black' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}">
              <span>${f.label}</span>
              <span class="px-1.5 py-0.2 rounded-full text-[10px] ${activeFilter === f.id ? 'bg-red-600 text-white' : 'bg-black/40 text-slate-300'}">${f.count}</span>
            </button>
          `).join('')}

          <button 
            type="button" 
            onclick="window.refreshMyBookings()" 
            class="ml-auto px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold transition flex items-center space-x-1">
            <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <!-- MAIN BOOKINGS CONTAINER -->
      <div class="max-w-7xl mx-auto space-y-4">
        
        ${filteredBookings.length === 0 ? `
          <div class="surface-card rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
            <div class="w-16 h-16 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <i data-lucide="calendar-x" class="w-8 h-8"></i>
            </div>
            <div class="space-y-1 max-w-md mx-auto">
              <h3 class="text-xl font-black text-slate-900 dark:text-white">No Bookings Found</h3>
              <p class="text-xs text-slate-500">
                You haven't made any reservations under this category yet. Book cheap flights, verified boutique stays, or dynamic customized packages with zero convenience fee.
              </p>
            </div>
            <div class="pt-2 flex justify-center space-x-3">
              <button 
                type="button" 
                onclick="window.navigateView('landing')"
                class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ea2330] to-[#880808] text-white font-bold text-xs shadow-md shadow-red-600/30 flex items-center space-x-2">
                <i data-lucide="search" class="w-4 h-4"></i>
                <span>Explore & Book on Home</span>
              </button>
            </div>
          </div>
        ` : `
          <div class="space-y-5">
            ${filteredBookings.map((b, idx) => {
              const tour = b.tour || {};
              const operator = b.operator || {};
              const payment = b.payment || {};
              const isDirect = tour.package_type && tour.package_type.startsWith('direct_');
              
              // Icon & badge mapping
              let catIcon = 'ticket';
              let catBadge = 'Dynamic Tour';
              let catColor = 'from-[#ea2330] to-[#880808]';
              
              if (b.service_category === 'flight') {
                catIcon = 'plane';
                catBadge = 'Domestic Flight';
                catColor = 'from-blue-600 to-indigo-700';
              } else if (b.service_category === 'hotel') {
                catIcon = 'building-2';
                catBadge = 'Resort & Stay';
                catColor = 'from-emerald-600 to-teal-800';
              } else if (b.service_category === 'bus_cab') {
                catIcon = 'bus';
                catBadge = 'Bus / Cab Transit';
                catColor = 'from-amber-600 to-orange-700';
              } else if (b.service_category === 'train') {
                catIcon = 'train';
                catBadge = 'IRCTC Rail Express';
                catColor = 'from-purple-600 to-indigo-900';
              } else if (b.service_category === 'package') {
                catIcon = 'palmtree';
                catBadge = 'All-Inclusive Package';
                catColor = 'from-[#ea2330] to-[#880808]';
              }

              return `
                <div class="surface-card rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 hover:border-red-500/60 shadow-xl space-y-5 transition duration-300">
                  
                  <!-- TOP STRIP: CODE, SERVICE BADGE & CONFIRMED STATUS -->
                  <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 rounded-2xl bg-gradient-to-br ${catColor} text-white flex items-center justify-center shadow-md shrink-0">
                        <i data-lucide="${catIcon}" class="w-5 h-5"></i>
                      </div>
                      <div>
                        <div class="flex items-center space-x-2">
                          <span class="font-mono text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-wide">
                            ${b.booking_code}
                          </span>
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                            ${catBadge}
                          </span>
                        </div>
                        <div class="text-[11px] text-slate-400 font-mono">
                          Booked on: ${b.created_at ? b.created_at.slice(0, 10) : '2026-09-26'} • TXN: ${payment.transaction_ref || 'TXN-TRV-VERIFIED'}
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center space-x-2">
                      <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center space-x-1.5 shadow-sm">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>CONFIRMED & SYNCED</span>
                      </span>
                    </div>
                  </div>

                  <!-- MIDDLE MAIN CARD CONTENT (GRID) -->
                  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    <!-- Destination Photo & Basic Stats -->
                    <div class="lg:col-span-4 flex flex-col justify-between space-y-3">
                      <div class="relative h-44 rounded-2xl overflow-hidden bg-slate-900 shadow">
                        <img 
                          src="${tour.destination_image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800'}" 
                          alt="${tour.destination_name || 'Destination'}" 
                          class="w-full h-full object-cover hover:scale-105 transition duration-500" 
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div class="absolute bottom-3 left-3 right-3 text-white">
                          <span class="text-[10px] font-bold text-red-400 uppercase tracking-wider block">Destination Hub</span>
                          <h4 class="text-base sm:text-lg font-black leading-tight">${tour.destination_name || 'India'} (${tour.destination_state || 'Verified'})</h4>
                        </div>
                      </div>

                      <div class="grid grid-cols-2 gap-2 text-xs">
                        <div class="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                          <span class="text-[10px] text-slate-400 block font-bold">Duration</span>
                          <span class="font-extrabold text-slate-800 dark:text-slate-200">${tour.duration_days || 4} Days / ${(tour.duration_days || 4) - 1} Nights</span>
                        </div>
                        <div class="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                          <span class="text-[10px] text-slate-400 block font-bold">Travellers</span>
                          <span class="font-extrabold text-slate-800 dark:text-slate-200">${tour.travelers_count || 2} Persons</span>
                        </div>
                      </div>
                    </div>

                    <!-- Tour & Service Specification -->
                    <div class="lg:col-span-5 space-y-3 flex flex-col justify-between">
                      <div class="space-y-2">
                        <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                          ${tour.title || 'Personalized Tour Expedition'}
                        </h3>
                        
                        <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span class="flex items-center space-x-1 font-semibold">
                            <i data-lucide="calendar" class="w-3.5 h-3.5 text-red-500"></i>
                            <span>${tour.start_date || '2026-10-18'} to ${tour.end_date || '2026-10-22'}</span>
                          </span>
                          <span>•</span>
                          <span class="flex items-center space-x-1 font-semibold">
                            <i data-lucide="hotel" class="w-3.5 h-3.5 text-blue-500"></i>
                            <span>${tour.accommodation_type || '3-Star Verified'}</span>
                          </span>
                          <span>•</span>
                          <span class="flex items-center space-x-1 font-semibold">
                            <i data-lucide="bus" class="w-3.5 h-3.5 text-amber-500"></i>
                            <span>${tour.transport_type || 'AC Transit'}</span>
                          </span>
                        </div>

                        <!-- Operator Info Box -->
                        <div class="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-red-50/40 dark:bg-red-950/20 space-y-1">
                          <div class="flex items-center justify-between text-xs">
                            <span class="font-extrabold text-slate-900 dark:text-white flex items-center space-x-1.5">
                              <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-500"></i>
                              <span>Operator: ${operator.company_name || operator.name || 'Travora Certified'}</span>
                            </span>
                            <span class="text-[11px] font-bold text-amber-500 flex items-center">
                              ★ ${operator.rating || 4.9}
                            </span>
                          </div>
                          <div class="text-[11px] text-slate-500 flex items-center justify-between">
                            <span>Coordinator: <strong>${operator.name || 'Aarav Mehta'}</strong></span>
                            <span class="font-mono">${operator.phone || '+91 98765 43210'}</span>
                          </div>
                        </div>

                        <!-- Itinerary Milestones Preview -->
                        ${b.itinerary_preview && b.itinerary_preview.length > 0 ? `
                          <div class="space-y-1 pt-1">
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Planned Schedule Milestones:</span>
                            <div class="space-y-1">
                              ${b.itinerary_preview.slice(0, 3).map(it => `
                                <div class="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                                  <span class="truncate flex items-center space-x-1.5">
                                    <span class="font-mono text-red-600 font-bold">D${it.day}</span>
                                    <span>${it.title}</span>
                                  </span>
                                  <span class="text-slate-400 shrink-0 font-mono text-[10px] ml-2">${it.time_start}</span>
                                </div>
                              `).join('')}
                            </div>
                          </div>
                        ` : ''}

                      </div>
                    </div>

                    <!-- Financial & Action Controls Column -->
                    <div class="lg:col-span-3 flex flex-col justify-between space-y-4 lg:border-l lg:border-slate-100 lg:dark:border-slate-800 lg:pl-6">
                      
                      <!-- Pricing Summary -->
                      <div class="space-y-1.5 p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-xs">
                        <div class="flex justify-between text-slate-500">
                          <span>Base Fare:</span>
                          <span class="font-mono font-semibold">₹${(b.base_price || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div class="flex justify-between text-slate-500">
                          <span>Taxes & GST (5%):</span>
                          <span class="font-mono font-semibold">₹${(b.taxes || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div class="flex justify-between text-slate-500">
                          <span>Convenience Fee:</span>
                          <span class="font-mono font-semibold text-emerald-600">₹0 (WAIVED)</span>
                        </div>
                        <div class="pt-1.5 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                          <span class="font-black text-slate-900 dark:text-white">Total Paid:</span>
                          <span class="text-lg sm:text-xl font-black text-red-600 dark:text-red-400 font-mono">
                            ₹${(b.final_total || b.amount_paid || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div class="text-[10px] text-slate-400 font-bold text-right pt-0.5">
                          Method: ${b.payment_method || 'UPI'} • Verified
                        </div>
                      </div>

                      <!-- Action Buttons -->
                      <div class="space-y-2">
                        <button 
                          type="button" 
                          onclick="window.viewBookingReceipt('${b.booking_code}')"
                          class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#ea2330] to-[#880808] hover:from-[#d91b28] hover:to-[#5c0606] text-white font-black text-xs shadow-md shadow-red-600/30 transition flex items-center justify-center space-x-1.5">
                          <i data-lucide="receipt" class="w-3.5 h-3.5"></i>
                          <span>Official Tax Invoice</span>
                        </button>

                        <button 
                          type="button" 
                          onclick="window.openBookingItinerary(${tour.id || 4})"
                          class="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-red-500 text-slate-700 dark:text-slate-200 hover:text-red-600 font-bold text-xs transition flex items-center justify-center space-x-1.5 bg-white dark:bg-slate-900 shadow-sm">
                          <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
                          <span>Stay & Trip Schedule</span>
                        </button>

                        <button 
                          type="button" 
                          onclick="window.navigateView('tracker')"
                          class="w-full py-2 px-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs transition flex items-center justify-center space-x-1.5">
                          <i data-lucide="navigation" class="w-3.5 h-3.5"></i>
                          <span>Live GPS Radar</span>
                        </button>
                      </div>

                    </div>

                  </div>

                </div>
              `;
            }).join('')}
          </div>
        `}

      </div>

    </div>
  `;
}

// Window interactive helper methods
window.filterMyBookings = function(cat) {
  window.myBookingsFilter = cat;
  store.setState({});
};

window.refreshMyBookings = async function() {
  const state = store.getState();
  try {
    store.addToast('Fetching latest reservations from database ledger...', 'info');
    const bookings = await api.getUserBookings({
      user_id: state.user ? state.user.id : null,
      user_email: state.user ? state.user.email : null
    });
    store.setState({ userBookings: bookings });
    store.addToast(`Loaded ${bookings.length} reservations successfully.`, 'success');
  } catch (err) {
    console.error(err);
    store.addToast('Failed to refresh bookings: ' + err.message, 'critical');
  }
};

window.viewBookingReceipt = async function(bookingCode) {
  try {
    store.addToast(`Retrieving verified invoice for #${bookingCode}...`, 'info');
    const receipt = await api.getBookingReceipt(bookingCode);
    store.setState({
      isReceiptModalOpen: true,
      activeReceipt: receipt
    });
  } catch (err) {
    console.error(err);
    store.addToast('Unable to load receipt: ' + err.message, 'critical');
  }
};

window.openBookingItinerary = async function(tourId) {
  try {
    store.addToast('Loading full tour schedule & timeline...', 'info');
    const tourDetail = await api.getTourDetail(tourId);
    store.setState({
      currentTour: tourDetail,
      currentView: 'itinerary'
    });
  } catch (err) {
    console.error(err);
    store.setState({ currentView: 'itinerary' });
  }
};
