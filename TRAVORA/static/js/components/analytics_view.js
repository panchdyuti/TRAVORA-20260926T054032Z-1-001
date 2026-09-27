import { store } from '../store.js';

export function renderAnalyticsView() {
  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div class="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div class="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
            Operational Intelligence & Telemetry
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Tour Operations Analytics
          </h1>
        </div>
        <div class="flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <span>Reporting Window: Last 30 Days</span>
        </div>
      </div>

      <!-- HIGHLIGHT METRICS -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="surface-card p-5 rounded-2xl space-y-1">
          <div class="text-xs text-slate-400 font-medium">Total Booking Volume</div>
          <div class="text-2xl font-black text-slate-900 dark:text-white">Rs 4,20,000</div>
          <div class="text-[10px] text-emerald-500 font-medium">^ 22% growth vs prior period</div>
        </div>
        <div class="surface-card p-5 rounded-2xl space-y-1">
          <div class="text-xs text-slate-400 font-medium">Operation Success Rate</div>
          <div class="text-2xl font-black text-emerald-500">93.8%</div>
          <div class="text-[10px] text-slate-400">24/25 scheduled tours executed</div>
        </div>
        <div class="surface-card p-5 rounded-2xl space-y-1">
          <div class="text-xs text-slate-400 font-medium">Avg. Change Resolution</div>
          <div class="text-2xl font-black text-teal-600 dark:text-teal-400">7.6 min</div>
          <div class="text-[10px] text-teal-500 font-medium">4x faster than manual dispatch</div>
        </div>
        <div class="surface-card p-5 rounded-2xl space-y-1">
          <div class="text-xs text-slate-400 font-medium">Customer Satisfaction</div>
          <div class="text-2xl font-black text-amber-500">4.9 / 5.0</div>
          <div class="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Based on 148 verified reviews</div>
        </div>
      </div>

      <!-- CHARTS GRID -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Destination Revenue Share -->
        <div class="surface-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Revenue by Destination</h3>
            <span class="text-xs text-slate-400">Top Indian Circuits</span>
          </div>
          <div class="h-64 flex items-center justify-center">
            <canvas id="destRevenueChart"></canvas>
          </div>
        </div>

        <!-- Disruption Root Causes Breakdown -->
        <div class="surface-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Disruption Root Causes</h3>
            <span class="text-xs text-slate-400">Dynamic Events (N=14)</span>
          </div>
          <div class="h-64 flex items-center justify-center">
            <canvas id="disruptionCausesChart"></canvas>
          </div>
        </div>

      </div>

    </div>
  `;
}
