import { store } from '../store.js';

export function renderAbout() {
  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      <!-- HERO -->
      <section class="text-center space-y-6 max-w-4xl mx-auto">
        <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-[#ea2330] dark:text-red-400 text-xs font-bold uppercase tracking-wider">
          <i data-lucide="compass" class="w-3.5 h-3.5"></i>
          <span>Architecture & Vision</span>
        </div>
        
        <div class="space-y-4">
          <div class="flex justify-center mb-6">
            <img 
              src="/static/assets/logo/travora_logo_stacked.png" 
              alt="TRAVORA" 
              class="h-28 w-auto object-contain dark:brightness-110"
            />
          </div>
          <h1 class="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            About <span class="bg-gradient-to-r from-[#ea2330] via-[#d91b28] to-[#880808] bg-clip-text text-transparent">TRAVORA</span>
          </h1>
          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The next-generation dynamic travel intelligence and tour operations platform connecting personalized discovery with on-ground operational agility.
          </p>
        </div>

        <div class="inline-block p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-200 text-sm font-bold">
          TRAVORA &mdash; Plan Freely. Travel Personally. Adapt Instantly.
        </div>
      </section>

      <!-- VISION & MISSION GRID -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div id="vision" class="surface-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 relative overflow-hidden group hover:border-[#ea2330] transition">
          <div class="w-12 h-12 rounded-2xl bg-red-500/15 text-[#ea2330] flex items-center justify-center font-bold">
            <i data-lucide="eye" class="w-6 h-6"></i>
          </div>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white">Our Vision</h2>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            To liberate travel from rigid, one-size-fits-all packages. We envision a future where every Indian and global explorer journeys on an itinerary crafted specifically around their passions, schedule, and budget &mdash; backed by an intelligent operating system that absorbs every real-world disruption seamlessly in real time.
          </p>
        </div>

        <div id="mission" class="surface-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 relative overflow-hidden group hover:border-[#880808] transition">
          <div class="w-12 h-12 rounded-2xl bg-red-900/20 text-[#880808] dark:text-red-400 flex items-center justify-center font-bold">
            <i data-lucide="target" class="w-6 h-6"></i>
          </div>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white">Our Mission</h2>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            To empower travellers with unprecedented personalization while equipping India's 500+ local tour operators, fleet coordinators, and hoteliers with enterprise-grade operational intelligence, dynamic bidding, automated dependency calculation, and verified digital workflows.
          </p>
        </div>

      </section>

      <!-- HOW TRAVORA WORKS -->
      <section class="surface-card rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-10">
        <div class="text-center max-w-2xl mx-auto space-y-3">
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            How TRAVORA Works
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            A cohesive 14-step journey engine bridging traveller intent with on-ground execution.
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          ${[
            { step: '1', title: 'Discover', icon: 'compass', desc: '800+ districts' },
            { step: '2', title: 'Personalize', icon: 'sliders', desc: 'Style & budget' },
            { step: '3', title: 'Plan', icon: 'calendar', desc: 'Timeline slots' },
            { step: '4', title: 'Match', icon: 'users', desc: 'Top operator' },
            { step: '5', title: 'Price', icon: 'calculator', desc: 'Live GST ledger' },
            { step: '6', title: 'Compare', icon: 'layers', desc: 'Group vs private' },
            { step: '7', title: 'Book', icon: 'check-circle-2', desc: 'Instant lock' },
            { step: '8', title: 'Pay', icon: 'credit-card', desc: 'UPI & cards' },
            { step: '9', title: 'Prepare', icon: 'clipboard-list', desc: 'Voucher & map' },
            { step: '10', title: 'Operate', icon: 'activity', desc: 'Live dispatch' },
            { step: '11', title: 'Assist', icon: 'bot', desc: 'AI Copilot' },
            { step: '12', title: 'Adapt', icon: 'refresh-cw', desc: '5-factor AI' },
            { step: '13', title: 'Complete', icon: 'flag', desc: 'Journey wrap' },
            { step: '14', title: 'Review', icon: 'star', desc: 'Dual feedback' }
          ].map(s => `
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-[#ea2330] transition">
              <div class="w-8 h-8 mx-auto rounded-xl bg-red-500/10 text-[#ea2330] flex items-center justify-center font-mono font-bold text-xs">
                ${s.step}
              </div>
              <div class="font-extrabold text-xs text-slate-800 dark:text-slate-200">${s.title}</div>
              <div class="text-[10px] text-slate-400">${s.desc}</div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- 4 PILLARS -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Pillar 1 -->
        <div class="surface-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-red-500/15 text-[#ea2330] flex items-center justify-center">
            <i data-lucide="sparkles" class="w-5 h-5"></i>
          </div>
          <h3 class="font-extrabold text-base text-slate-900 dark:text-white">Traveller Experience</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Personalized trip planning matching real constraints: budget limits, pace, accommodation stars, verified local attractions, and festival timing across India.
          </p>
        </div>

        <!-- Pillar 2 -->
        <div class="surface-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-red-900/15 text-[#880808] dark:text-red-400 flex items-center justify-center">
            <i data-lucide="shield" class="w-5 h-5"></i>
          </div>
          <h3 class="font-extrabold text-base text-slate-900 dark:text-white">Operator Ecosystem</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Isolated control centers for 500+ regional operators to build packages, manage fleets, allocate coordinators, track margins, and dispatch live trip solutions.
          </p>
        </div>

        <!-- Pillar 3 -->
        <div class="surface-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <i data-lucide="briefcase" class="w-5 h-5"></i>
          </div>
          <h3 class="font-extrabold text-base text-slate-900 dark:text-white">Business Travel</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Dedicated enterprise corporate travel management: policy compliance, employee booking approvals, meeting room logistics, and integrated expense reporting.
          </p>
        </div>

        <!-- Pillar 4 -->
        <div class="surface-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-red-600/15 text-[#ea2330] flex items-center justify-center">
            <i data-lucide="refresh-cw" class="w-5 h-5"></i>
          </div>
          <h3 class="font-extrabold text-base text-slate-900 dark:text-white">Dynamic Adaptation</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Multi-component dependency engine that instantly recalculates transit, check-in, cost, and schedule trade-offs when weather, cancellations, or delays occur.
          </p>
        </div>

      </section>

      <!-- TEAM PANCHDYUTI -->
      <section id="team" class="surface-card rounded-3xl p-8 sm:p-12 border-2 border-red-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-500/10 text-[#ea2330] text-xs font-bold">
          <i data-lucide="award" class="w-4 h-4"></i>
          <span>Engineering & Product Leadership</span>
        </div>
        
        <div class="max-w-2xl mx-auto space-y-3">
          <h2 class="text-3xl font-black text-slate-900 dark:text-white">
            Built by Team Panchdyuti
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Conceived and engineered with an obsession for resilient travel systems, high-concurrency operations, and intelligent Indian tourism infrastructure.
          </p>
        </div>

        <div class="pt-4 flex flex-wrap justify-center gap-4">
          <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-left max-w-xs space-y-1">
            <div class="font-bold text-sm text-slate-900 dark:text-white">Team Panchdyuti</div>
            <div class="text-[11px] text-[#ea2330] font-semibold">Core Product & Engineering</div>
            <div class="text-[11px] text-slate-500">Autonomous tour operations, adaptive intelligence, & full-stack development.</div>
          </div>
        </div>

        <div class="pt-6 border-t border-slate-200 dark:border-slate-800 max-w-xl mx-auto text-xs text-slate-500 font-mono">
          TRAVORA &mdash; Plan Freely. Travel Personally. Adapt Instantly.
        </div>
      </section>

    </div>
  `;
}
