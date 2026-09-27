import { store } from '../store.js';
import { api } from '../api.js';

export function renderBusinessOperator() {
  const state = store.getState();
  const user = state.user || { name: 'Corporate Travel Lead', email: 'corporate@travora.demo' };
  const corporateBookings = state.corporateBookings || [
    {
      id: 1,
      booking_code: "CORP-BLR-8921",
      employee_name: "Rahul Verma",
      employee_email: "rahul.v@techcorp.in",
      origin_city: "Mumbai",
      destination_city: "Bengaluru",
      start_date: "2026-10-05",
      end_date: "2026-10-07",
      travel_purpose: "Quarterly Board Review & Enterprise Client Pitch",
      accommodation_pref: "Executive Business Hotel (Marriott Whitefield)",
      transport_pref: "Business Class Air + Dedicated Airport Transit",
      estimated_cost: 42500,
      approval_status: "Approved",
      cost_center: "CC-ENGINEERING-702",
      policy_compliant: true,
      meeting_logistics: "Whitefield Tech Park Conf Room 4B; Audio/Video Bridge Setup"
    },
    {
      id: 2,
      booking_code: "CORP-DEL-9143",
      employee_name: "Meera Sen",
      employee_email: "meera.s@techcorp.in",
      origin_city: "Bengaluru",
      destination_city: "New Delhi",
      start_date: "2026-10-12",
      end_date: "2026-10-14",
      travel_purpose: "Regulatory Compliance Summit & Legal Review",
      accommodation_pref: "Central Business Hotel (Taj Vivanta)",
      transport_pref: "Vande Bharat Executive / Economy Flight",
      estimated_cost: 28900,
      approval_status: "Pending Approval",
      cost_center: "CC-LEGAL-104",
      policy_compliant: true,
      meeting_logistics: "Barakhamba Road Legal Chambers; Document Courier Sync"
    },
    {
      id: 3,
      booking_code: "CORP-HYD-7734",
      employee_name: "Vikramaditya Roy",
      employee_email: "v.roy@techcorp.in",
      origin_city: "Pune",
      destination_city: "Hyderabad",
      start_date: "2026-10-18",
      end_date: "2026-10-20",
      travel_purpose: "Data Center Infrastructure Migration Audit",
      accommodation_pref: "Hi-Tech City Business Hotel",
      transport_pref: "Direct Flight + Pre-booked EV Sedan",
      estimated_cost: 35000,
      approval_status: "Approved",
      cost_center: "CC-DEVOPS-501",
      policy_compliant: true,
      meeting_logistics: "Gachibowli Server Facility; Security Badges Pre-cleared"
    }
  ];

  const totalExpense = corporateBookings.reduce((sum, b) => sum + (b.estimated_cost || 0), 0);
  const approvedCount = corporateBookings.filter(b => b.approval_status === 'Approved').length;
  const pendingCount = corporateBookings.filter(b => b.approval_status === 'Pending Approval').length;

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- TOP OPERATIONS HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div class="flex items-center space-x-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-wider">
              ENTERPRISE CORPORATE MOBILITY
            </span>
            <span class="text-xs text-slate-400 font-mono">B2B Portal</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Corporate Travel Operations
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage business requirements, meetings, employee delegations, expense approvals, and compliance policies.
          </p>
        </div>

        <div class="flex items-center space-x-3">
          <button 
            type="button"
            onclick="window.openNewCorporateBookingModal()" 
            class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition flex items-center space-x-2">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>New Corporate Travel Requisition</span>
          </button>
        </div>
      </div>

      <!-- KPI METRIC CARDS -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div class="surface-card p-5 rounded-2xl space-y-1 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Corporate Bookings</span>
            <i data-lucide="briefcase" class="w-4 h-4 text-blue-500"></i>
          </div>
          <div class="text-2xl font-black text-slate-900 dark:text-white">${corporateBookings.length}</div>
          <div class="text-[10px] text-emerald-500 font-medium">100% Policy Compliant</div>
        </div>

        <div class="surface-card p-5 rounded-2xl space-y-1 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Approved Itineraries</span>
            <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-500"></i>
          </div>
          <div class="text-2xl font-black text-emerald-600 dark:text-emerald-400">${approvedCount}</div>
          <div class="text-[10px] text-slate-400">Tickets & Logistics Dispatched</div>
        </div>

        <div class="surface-card p-5 rounded-2xl space-y-1 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Pending Approvals</span>
            <i data-lucide="clock" class="w-4 h-4 text-amber-500"></i>
          </div>
          <div class="text-2xl font-black text-amber-600 dark:text-amber-400">${pendingCount}</div>
          <div class="text-[10px] text-slate-400">Awaiting Finance Signoff</div>
        </div>

        <div class="surface-card p-5 rounded-2xl space-y-1 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Committed Budget</span>
            <i data-lucide="credit-card" class="w-4 h-4 text-indigo-500"></i>
          </div>
          <div class="text-2xl font-black text-slate-900 dark:text-white">Rs ${totalExpense.toLocaleString('en-IN')}</div>
          <div class="text-[10px] text-blue-500 font-medium">Q3 Fiscal Forecast: Rs 12.5L</div>
        </div>

      </div>

      <!-- CORPORATE BOOKINGS ROSTER -->
      <div class="surface-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 class="text-base font-extrabold text-slate-900 dark:text-white">
              Corporate Travel Requisitions & Delegations
            </h2>
            <p class="text-xs text-slate-400">
              Employee travel schedules, meeting itineraries, logistics, and company cost-center attribution.
            </p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th class="py-3 px-3">Req ID</th>
                <th class="py-3 px-3">Employee</th>
                <th class="py-3 px-3">Route</th>
                <th class="py-3 px-3">Dates</th>
                <th class="py-3 px-3">Business Purpose & Meeting Logistics</th>
                <th class="py-3 px-3">Cost Center</th>
                <th class="py-3 px-3">Est. Budget</th>
                <th class="py-3 px-3">Status</th>
                <th class="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
              ${corporateBookings.map(b => `
                <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                  <td class="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                    ${b.booking_code}
                  </td>
                  <td class="py-3 px-3">
                    <div class="font-bold text-slate-800 dark:text-slate-200">${b.employee_name}</div>
                    <div class="text-[10px] text-slate-400">${b.employee_email}</div>
                  </td>
                  <td class="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                    ${b.origin_city} -> ${b.destination_city}
                  </td>
                  <td class="py-3 px-3 text-slate-500 font-mono text-[11px]">
                    ${b.start_date} to ${b.end_date}
                  </td>
                  <td class="py-3 px-3 max-w-xs">
                    <div class="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">${b.travel_purpose}</div>
                    <div class="text-[10px] text-slate-400 line-clamp-1">${b.meeting_logistics || 'Standard Meeting Protocol'}</div>
                  </td>
                  <td class="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    ${b.cost_center || 'CC-GEN-100'}
                  </td>
                  <td class="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    Rs ${(b.estimated_cost || 0).toLocaleString('en-IN')}
                  </td>
                  <td class="py-3 px-3">
                    ${b.approval_status === 'Approved' ? `
                      <span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        <i data-lucide="check-circle" class="w-3 h-3 text-emerald-500"></i>
                        <span>Approved by Platform Admin</span>
                      </span>
                    ` : b.approval_status === 'Rejected' ? `
                      <span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30">
                        <i data-lucide="x-circle" class="w-3 h-3 text-red-500"></i>
                        <span>Declined by Admin</span>
                      </span>
                    ` : `
                      <span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                        <span>Pending Admin Approval</span>
                      </span>
                    `}
                  </td>
                  <td class="py-3 px-3 text-right">
                    <button 
                      type="button"
                      onclick="window.inspectCorporateBooking('${b.booking_code}', '${b.approval_status}')"
                      class="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 font-bold transition border border-blue-200 dark:border-blue-800 text-[11px]">
                      Details
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

      </div>

      <!-- MODAL: NEW CORPORATE REQUISITION -->
      <div id="corporate-requisition-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
        <div class="surface-card rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 modal-content">
          <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div class="flex items-center space-x-2.5">
              <div class="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                <i data-lucide="briefcase" class="w-4 h-4"></i>
              </div>
              <div>
                <h3 class="font-extrabold text-base text-slate-900 dark:text-white">Create Business Travel Requisition</h3>
                <p class="text-[11px] text-slate-400">Formal B2B submission with cost-center tracking</p>
              </div>
            </div>
            <button onclick="window.closeNewCorporateBookingModal()" class="p-1 rounded-lg text-slate-400 hover:text-slate-600">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <form onsubmit="window.submitNewCorporateBooking(event)" class="space-y-4 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Employee Name</label>
                <input type="text" name="employee_name" required placeholder="e.g. Siddharth Joshi" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Corporate Email</label>
                <input type="email" name="employee_email" required placeholder="siddharth.j@corp.in" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Origin City</label>
                <input type="text" name="origin_city" required placeholder="e.g. Mumbai" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Destination City</label>
                <input type="text" name="destination_city" required placeholder="e.g. Bengaluru" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                <input type="date" name="start_date" required value="2026-10-25" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                <input type="date" name="end_date" required value="2026-10-27" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Est. Cost (INR)</label>
                <input type="number" name="estimated_cost" required value="32000" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs" />
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Business Purpose & Client Meeting</label>
              <input type="text" name="travel_purpose" required placeholder="e.g. Client Security Architecture Review" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Cost Center Code</label>
                <input type="text" name="cost_center" value="CC-OPERATIONS-401" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Meeting Venue Logistics</label>
                <input type="text" name="meeting_logistics" placeholder="Room 2A, Electronic City" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs" />
              </div>
            </div>

            <div class="pt-2">
              <button type="submit" class="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5">
                <i data-lucide="send" class="w-4 h-4"></i>
                <span>Submit Requisition for Approval</span>
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `;
}

// Window actions for corporate travel
window.openNewCorporateBookingModal = function() {
  const modal = document.getElementById('corporate-requisition-modal');
  if (modal) modal.classList.remove('hidden');
};

window.closeNewCorporateBookingModal = function() {
  const modal = document.getElementById('corporate-requisition-modal');
  if (modal) modal.classList.add('hidden');
};

window.submitNewCorporateBooking = async function(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const payload = {
    employee_name: formData.get('employee_name'),
    employee_email: formData.get('employee_email'),
    origin_city: formData.get('origin_city'),
    destination_city: formData.get('destination_city'),
    start_date: formData.get('start_date'),
    end_date: formData.get('end_date'),
    travel_purpose: formData.get('travel_purpose'),
    estimated_cost: parseFloat(formData.get('estimated_cost') || '0'),
    cost_center: formData.get('cost_center') || 'CC-GEN-100',
    meeting_logistics: formData.get('meeting_logistics') || '',
    approval_status: 'Pending Admin Approval'
  };

  try {
    store.addToast('Submitting corporate travel plan to Travora Admin site...', 'info');
    const res = await api.createCorporateBooking(payload);
    
    // Refresh corporate bookings
    const bookings = await api.getCorporateBookings().catch(() => []);
    store.setState({ corporateBookings: bookings });
    window.closeNewCorporateBookingModal();
    const bCode = res.booking ? res.booking.booking_code : 'CORP-REQ';
    store.addToast(`Plan ${bCode} sent to Travora Admin Site! Status: Pending Admin Approval`, 'success', 5000);
  } catch (err) {
    console.error(err);
    store.addToast('Submission failed: ' + err.message, 'critical');
  }
};

window.inspectCorporateBooking = function(code, status) {
  const statusLabel = status || 'Pending Admin Approval';
  store.addToast(`Corporate Requisition ${code}: Policy Compliant. Status: ${statusLabel}.`, 'info', 4000);
};
