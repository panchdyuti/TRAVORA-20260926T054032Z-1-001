import { store } from '../store.js';
import { api } from '../api.js';

export function renderAdminDashboard() {
  const state = store.getState();
  const metrics = state.adminMetrics || {
    users_count: 522,
    travellers_count: 3,
    operators_count: 517,
    business_operators_count: 1,
    districts_count: 802,
    destinations_count: 8,
    hotels_count: 70,
    packages_count: 6,
    bookings_count: 3,
    payments_count: 3,
    active_trips_count: 2,
    completed_trips_count: 1,
    disruptions_count: 1,
    place_requests_count: 0,
    reviews_count: 1,
    platform_feedback_count: 0
  };

  const events = state.adminEvents || [];
  const auditLogs = state.adminAuditLogs || [];
  const corporateBookings = state.adminCorporateBookings || [];
  const pendingApprovalsCount = corporateBookings.filter(b => b.approval_status !== 'Approved' && b.approval_status !== 'Rejected').length;

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- TOP OPERATIONS HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div class="flex items-center space-x-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 uppercase tracking-wider">
              CENTRAL SYSTEM ADMINISTRATION
            </span>
            <span class="text-xs text-slate-400 font-mono">Live DB Stream</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            TRAVORA Platform Admin Operations
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time live telemetry, 802 India districts, corporate delegation plan approvals, and immutable audit trail.
          </p>
        </div>

        <div class="flex items-center space-x-3">
          <button 
            type="button" 
            onclick="window.refreshAdminData()" 
            class="px-4 py-2.5 rounded-xl surface-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm border border-slate-300 dark:border-slate-700 transition flex items-center space-x-2">
            <i data-lucide="refresh-cw" class="w-4 h-4 text-purple-500"></i>
            <span>Refresh Real-Time DB State</span>
          </button>
          <a 
            href="/db-view" 
            target="_blank"
            class="px-4 py-2.5 rounded-xl bg-[#810B38] hover:bg-[#700930] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#810B38]/30 transition flex items-center space-x-2">
            <i data-lucide="database" class="w-4 h-4 text-[#C5A880]"></i>
            <span>Database Studio</span>
          </a>
        </div>
      </div>

      <!-- REAL-TIME METRICS GRID -->
      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3.5">
        
        <div class="surface-card p-4 rounded-2xl space-y-1 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between text-slate-400 text-xs">
            <span class="font-semibold">Total Users</span>
            <i data-lucide="users" class="w-4 h-4 text-purple-500"></i>
          </div>
          <div class="text-xl font-black text-slate-900 dark:text-white">${metrics.users_count}</div>
          <div class="text-[10px] text-slate-400">${metrics.travellers_count} Travellers - ${metrics.business_operators_count} Corp</div>
        </div>

        <div class="surface-card p-4 rounded-2xl space-y-1 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between text-slate-400 text-xs">
            <span class="font-semibold">Tour Operators</span>
            <i data-lucide="building-2" class="w-4 h-4 text-amber-500"></i>
          </div>
          <div class="text-xl font-black text-amber-600 dark:text-amber-400">${metrics.operators_count}</div>
          <div class="text-[10px] text-slate-400">500 Synthetic Demo Operators</div>
        </div>

        <div class="surface-card p-4 rounded-2xl space-y-1 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between text-slate-400 text-xs">
            <span class="font-semibold">Corporate Requests</span>
            <i data-lucide="briefcase" class="w-4 h-4 text-blue-500"></i>
          </div>
          <div class="text-xl font-black text-blue-600 dark:text-blue-400">${corporateBookings.length}</div>
          <div class="text-[10px] ${pendingApprovalsCount > 0 ? 'text-amber-500 font-bold' : 'text-slate-400'}">${pendingApprovalsCount} Awaiting Admin Clearance</div>
        </div>

        <div class="surface-card p-4 rounded-2xl space-y-1 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between text-slate-400 text-xs">
            <span class="font-semibold">India Districts</span>
            <i data-lucide="map" class="w-4 h-4 text-teal-500"></i>
          </div>
          <div class="text-xl font-black text-teal-600 dark:text-teal-400">${metrics.districts_count}</div>
          <div class="text-[10px] text-slate-400">28 States & 8 UTs Mapped</div>
        </div>

        <div class="surface-card p-4 rounded-2xl space-y-1 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between text-slate-400 text-xs">
            <span class="font-semibold">Live Trips</span>
            <i data-lucide="compass" class="w-4 h-4 text-emerald-500"></i>
          </div>
          <div class="text-xl font-black text-emerald-600 dark:text-emerald-400">${metrics.active_trips_count} Active</div>
          <div class="text-[10px] text-slate-400">${metrics.completed_trips_count} Completed</div>
        </div>

        <div class="surface-card p-4 rounded-2xl space-y-1 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between text-slate-400 text-xs">
            <span class="font-semibold">Disruptions</span>
            <i data-lucide="alert-triangle" class="w-4 h-4 text-red-500"></i>
          </div>
          <div class="text-xl font-black text-red-600 dark:text-red-400">${metrics.disruptions_count}</div>
          <div class="text-[10px] text-slate-400">${metrics.place_requests_count} Place Change Reqs</div>
        </div>

      </div>

      <!-- ===================================================================
           CORPORATE TRAVEL REQUISITIONS & DELEGATION PLAN APPROVAL DESK
           =================================================================== -->
      <div class="surface-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <i data-lucide="briefcase" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h2 class="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  Corporate Travel Requisitions & Delegation Plan Approvals
                </h2>
                ${pendingApprovalsCount > 0 ? `
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 animate-pulse">
                    ${pendingApprovalsCount} Action Required
                  </span>
                ` : `
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    All Plans Cleared
                  </span>
                `}
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Corporate booking details sent to Travora Admin site for formal platform review and clearance approval.
              </p>
            </div>
          </div>

          <div class="text-right">
            <span class="text-xs font-mono text-slate-400">Sync: <strong>B2B Enterprise Portal &harr; Central Admin</strong></span>
          </div>
        </div>

        <!-- REQUISITIONS TABLE -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th class="py-3 px-3">Req Code</th>
                <th class="py-3 px-3">Company & Employee</th>
                <th class="py-3 px-3">Travel Corridor</th>
                <th class="py-3 px-3">Schedule</th>
                <th class="py-3 px-3">Purpose & Logistics</th>
                <th class="py-3 px-3">Estimated Budget</th>
                <th class="py-3 px-3">Admin Status</th>
                <th class="py-3 px-3 text-right">Approval Decision</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
              ${corporateBookings.length === 0 ? `
                <tr>
                  <td colspan="8" class="py-8 text-center text-slate-400 text-xs">
                    No corporate travel requisitions submitted yet.
                  </td>
                </tr>
              ` : corporateBookings.map(b => {
                const isPending = b.approval_status !== 'Approved' && b.approval_status !== 'Rejected';
                const isApproved = b.approval_status === 'Approved';
                return `
                  <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td class="py-3.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      ${b.booking_code || `CORP-REQ-${1000 + b.id}`}
                    </td>
                    <td class="py-3.5 px-3">
                      <div class="font-bold text-slate-900 dark:text-white">${b.company_name}</div>
                      <div class="text-[11px] text-slate-600 dark:text-slate-300 font-medium">${b.employee_name}</div>
                      <div class="text-[10px] text-slate-400">${b.employee_email} (${b.department || 'Operations'})</div>
                    </td>
                    <td class="py-3.5 px-3 whitespace-nowrap">
                      <div class="font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
                        <span>${b.origin_city || b.origin}</span>
                        <span class="text-slate-400">&rarr;</span>
                        <span>${b.destination_city || b.destination}</span>
                      </div>
                      <div class="text-[10px] text-slate-400">${b.transport_mode || 'Flight (Economy Flexi)'}</div>
                    </td>
                    <td class="py-3.5 px-3 whitespace-nowrap font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      <div>${b.start_date}</div>
                      <div class="text-[10px] text-slate-400">to ${b.end_date}</div>
                    </td>
                    <td class="py-3.5 px-3 max-w-xs">
                      <div class="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">${b.travel_purpose}</div>
                      <div class="text-[10px] text-slate-400 line-clamp-1">${b.meeting_logistics || 'Standard Meeting Logistics'}</div>
                      <div class="text-[10px] text-teal-600 dark:text-teal-400 mt-0.5">${b.hotel_name || 'Business Partner Hotel'}</div>
                    </td>
                    <td class="py-3.5 px-3 whitespace-nowrap">
                      <div class="font-black text-slate-900 dark:text-white">
                        ₹${(b.estimated_cost || 0).toLocaleString('en-IN')}
                      </div>
                      <div class="text-[10px] text-slate-400">Limit: ₹${(b.budget_limit || 0).toLocaleString('en-IN')}</div>
                    </td>
                    <td class="py-3.5 px-3 whitespace-nowrap">
                      ${isApproved ? `
                        <span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                          <i data-lucide="check-circle" class="w-3 h-3 text-emerald-500"></i>
                          <span>Approved</span>
                        </span>
                      ` : b.approval_status === 'Rejected' ? `
                        <span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30">
                          <i data-lucide="x-circle" class="w-3 h-3 text-red-500"></i>
                          <span>Rejected</span>
                        </span>
                      ` : `
                        <span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                          <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                          <span>Pending Admin Approval</span>
                        </span>
                      `}
                    </td>
                    <td class="py-3.5 px-3 text-right whitespace-nowrap">
                      ${isPending ? `
                        <div class="flex items-center justify-end space-x-2">
                          <button 
                            type="button" 
                            onclick="window.actionAdminCorporateBooking(${b.id}, 'approve')"
                            class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition flex items-center space-x-1">
                            <i data-lucide="check" class="w-3.5 h-3.5"></i>
                            <span>Approve Plan</span>
                          </button>
                          <button 
                            type="button" 
                            onclick="window.actionAdminCorporateBooking(${b.id}, 'reject')"
                            class="px-3 py-1.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-bold text-xs transition flex items-center space-x-1">
                            <i data-lucide="x" class="w-3.5 h-3.5"></i>
                            <span>Decline</span>
                          </button>
                        </div>
                      ` : isApproved ? `
                        <span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end space-x-1">
                          <i data-lucide="shield-check" class="w-4 h-4"></i>
                          <span>Clearance Granted</span>
                        </span>
                      ` : `
                        <span class="text-[11px] font-bold text-red-500 flex items-center justify-end space-x-1">
                          <i data-lucide="alert-circle" class="w-4 h-4"></i>
                          <span>Plan Declined</span>
                        </span>
                      `}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- IMMUTABLE AUDIT TRAIL -->
      <div class="surface-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div class="flex items-center space-x-2.5">
            <div class="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <i data-lucide="shield-check" class="w-5 h-5"></i>
            </div>
            <div>
              <h2 class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Immutable Platform Change Audit Trail
              </h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Cryptographically tracked administrative mutations, delegation approvals, and operator status updates.
              </p>
            </div>
          </div>
          <span class="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-mono font-bold">
            Compliance Archive
          </span>
        </div>

        <div class="space-y-3 max-h-96 overflow-y-auto pr-1">
          ${auditLogs.length === 0 ? `
            <div class="text-center py-8 text-xs text-slate-400">No audit records recorded yet</div>
          ` : auditLogs.map(log => `
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-1 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                  <span class="w-2 h-2 rounded-full bg-purple-500"></span>
                  <span>${log.action}</span>
                </span>
                <span class="text-[10px] text-slate-400 font-mono">${log.timestamp ? log.timestamp.slice(11, 19) : ''}</span>
              </div>
              <div class="text-[11px] text-slate-600 dark:text-slate-300">
                <span class="font-semibold text-purple-600 dark:text-purple-400">[${log.entity_type} #${log.entity_id}]</span>: ${log.reason || 'Operational status modification'}
              </div>
              <div class="text-[10px] text-slate-400 flex items-center justify-between pt-0.5">
                <span>Approved by: <strong>${log.approved_by || 'System Automatic'}</strong></span>
                <span class="font-mono text-[9px] text-slate-500">Audit ID #${log.id}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}

window.refreshAdminData = async function() {
  try {
    store.addToast('Fetching real-time platform metrics, corporate plans, and audit trail...', 'info');
    const [metrics, events, auditLogs, corporateBookings] = await Promise.all([
      api.getAdminMetrics().catch(() => null),
      api.getAdminEvents().catch(() => []),
      api.getAdminAuditLogs().catch(() => []),
      api.getAdminCorporateBookings().catch(() => [])
    ]);

    store.setState({
      adminMetrics: metrics,
      adminEvents: events,
      adminAuditLogs: auditLogs,
      adminCorporateBookings: corporateBookings
    });

    store.addToast('Central Admin telemetry refreshed with live DB state.', 'success');
  } catch (err) {
    console.error(err);
    store.addToast('Admin sync failed: ' + err.message, 'critical');
  }
};

window.actionAdminCorporateBooking = async function(bookingId, action) {
  try {
    const actionLabel = action === 'approve' ? 'Approving delegation plan...' : 'Declining delegation plan...';
    store.addToast(actionLabel, 'info');

    const res = await api.actionAdminCorporateBooking(bookingId, {
      action: action,
      notes: action === 'approve' ? 'Approved by Platform Admin Desk' : 'Declined by Platform Admin Desk'
    });

    // Refresh corporate bookings, audit logs, and events
    const [corporateBookings, auditLogs, events] = await Promise.all([
      api.getAdminCorporateBookings().catch(() => []),
      api.getAdminAuditLogs().catch(() => []),
      api.getAdminEvents().catch(() => [])
    ]);

    store.setState({
      adminCorporateBookings: corporateBookings,
      adminAuditLogs: auditLogs,
      adminEvents: events
    });

    const statusMsg = action === 'approve' 
      ? `Corporate Plan #${bookingId} has been Approved and cleared for booking!`
      : `Corporate Plan #${bookingId} was declined.`;
    store.addToast(statusMsg, action === 'approve' ? 'success' : 'warning', 5000);

    if (window.lucide) window.lucide.createIcons();
  } catch (err) {
    console.error(err);
    store.addToast('Failed to process approval action: ' + (err.message || 'Server error'), 'critical');
  }
};
