import { store } from '../store.js';

export function renderAddExperienceModal() {
  const state = store.getState();
  if (!state.isAddExperienceModalOpen) return '';

  const tour = state.currentTour || { id: 1, duration_days: 4, destination_name: 'Goa' };
  const currentDay = state.selectedDay === 'all' ? (state.addExperienceTargetDay || 1) : state.selectedDay;
  const daysCount = tour.duration_days || 4;

  const popularExperiences = [
    {
      title: 'Scuba Diving & Coral Reef Safari',
      subtitle: 'Includes PADI certified guide, equipment & HD underwater video',
      cost: 2500,
      time_start: '09:00 AM',
      time_end: '01:30 PM',
      item_type: 'activity',
      location_name: 'Grand Island Jetty, Goa',
      icon: 'zap'
    },
    {
      title: 'Mandovi Luxury Sunset Cruise & Folk Dance',
      subtitle: '2-hour scenic river sailing with Goan folk music & refreshments',
      cost: 950,
      time_start: '05:30 PM',
      time_end: '07:30 PM',
      item_type: 'activity',
      location_name: 'Panaji Riverfront, Goa',
      icon: 'compass'
    },
    {
      title: 'Authentic Goan Seafood Feast',
      subtitle: 'Multi-course local Konkani delicacies & fresh catch of the day',
      cost: 1200,
      time_start: '01:00 PM',
      time_end: '02:30 PM',
      item_type: 'food',
      location_name: "Fisherman's Wharf, Salcete",
      icon: 'utensils'
    },
    {
      title: 'Chapora Fort & Cliff Sunset Walk',
      subtitle: 'Panoramic 360° Arabian Sea views and heritage photography',
      cost: 450,
      time_start: '04:30 PM',
      time_end: '06:30 PM',
      item_type: 'activity',
      location_name: 'Chapora Fort, Vagator',
      icon: 'map-pin'
    },
    {
      title: 'High-Octane Go-Karting Challenge',
      subtitle: '300m asphalt track with precision lap timing & safety helmets',
      cost: 800,
      time_start: '03:00 PM',
      time_end: '04:30 PM',
      item_type: 'activity',
      location_name: 'Arpora Track, North Goa',
      icon: 'zap'
    },
    {
      title: 'Sahakari Spice Plantation Guided Tour',
      subtitle: 'Walk through organic vanilla & cardamom groves with buffet lunch',
      cost: 850,
      time_start: '11:00 AM',
      time_end: '02:00 PM',
      item_type: 'activity',
      location_name: 'Ponda Spice Valley',
      icon: 'compass'
    }
  ];

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div class="surface-card rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-8">
        
        <!-- CLOSE BUTTON -->
        <button 
          onclick="window.closeAddActivityModal()" 
          class="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <!-- HEADER -->
        <div class="space-y-1">
          <div class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
            <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
            <span>CUSTOM ITINERARY ENHANCEMENT</span>
          </div>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white">
            Add Experience to Day ${currentDay}
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Choose a popular curated experience or create your own custom scheduled activity.
          </p>
        </div>

        <!-- 1-CLICK QUICK ADD POPULAR EXPERIENCES -->
        <div class="space-y-3">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <i data-lucide="flame" class="w-3.5 h-3.5 text-amber-500"></i>
            <span>1-Click Popular Experiences (${tour.destination_name || 'Local'})</span>
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
            ${popularExperiences.map((exp, idx) => `
              <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 transition flex flex-col justify-between group">
                <div class="space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-teal-500 transition line-clamp-1">
                      ${exp.title}
                    </span>
                    <span class="text-xs font-bold text-teal-600 dark:text-teal-400 shrink-0 font-mono">
                      Rs ${exp.cost.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p class="text-[10px] text-slate-400 line-clamp-1">${exp.subtitle}</p>
                  <div class="text-[10px] text-slate-500 dark:text-slate-400 flex items-center space-x-2 pt-1">
                    <span>${exp.time_start} - ${exp.time_end}</span>
                  </div>
                </div>
                
                <button 
                  type="button"
                  onclick="window.handleQuickAddExperience(${currentDay}, '${exp.title.replace(/'/g, "\\'")}', '${exp.subtitle.replace(/'/g, "\\'")}', '${exp.item_type}', '${exp.time_start}', '${exp.time_end}', ${exp.cost}, '${exp.location_name.replace(/'/g, "\\'")}', '${exp.icon}')" 
                  class="mt-2.5 w-full py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-600 hover:text-white text-teal-600 dark:text-teal-400 text-xs font-bold transition flex items-center justify-center space-x-1 border border-teal-500/20">
                  <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                  <span>Add to Day ${currentDay}</span>
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="relative flex py-1 items-center">
          <div class="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span class="flex-shrink mx-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Or Create Custom Activity</span>
          <div class="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        <!-- CUSTOM EXPERIENCE FORM -->
        <form onsubmit="window.handleCreateCustomExperience(event)" class="space-y-4">
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Day</label>
              <select name="day_number" class="w-full px-3 py-2 rounded-xl surface-card border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:ring-2 focus:ring-teal-500">
                ${Array.from({ length: daysCount }, (_, i) => i + 1).map(d => `
                  <option value="${d}" ${d === currentDay ? 'selected' : ''}>Day ${d}</option>
                `).join('')}
              </select>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Experience Title *</label>
              <input 
                type="text" 
                name="title" 
                required 
                placeholder="e.g. Parasailing at Calangute Beach" 
                class="w-full px-3 py-2 rounded-xl surface-card border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500" 
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select name="item_type" class="w-full px-3 py-2 rounded-xl surface-card border border-slate-300 dark:border-slate-700 text-xs font-semibold focus:ring-2 focus:ring-teal-500">
                <option value="activity">Activity / Adventure</option>
                <option value="food">Food & Dining</option>
                <option value="sightseeing">Sightseeing & Heritage</option>
                <option value="transport">Local Transport / Cab</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
              <input 
                type="text" 
                name="time_start" 
                value="02:30 PM" 
                class="w-full px-3 py-2 rounded-xl surface-card border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500" 
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">End Time</label>
              <input 
                type="text" 
                name="time_end" 
                value="05:00 PM" 
                class="w-full px-3 py-2 rounded-xl surface-card border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500" 
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Estimated Cost (Rs ) *</label>
              <input 
                type="number" 
                name="cost" 
                required 
                value="1200" 
                min="0"
                step="50"
                class="w-full px-3 py-2 rounded-xl surface-card border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500" 
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Location / Landmark</label>
              <input 
                type="text" 
                name="location_name" 
                placeholder="e.g. North Goa Coast" 
                class="w-full px-3 py-2 rounded-xl surface-card border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500" 
              />
            </div>
          </div>

          <div class="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button 
              type="button" 
              onclick="window.closeAddActivityModal()" 
              class="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-lg shadow-teal-500/20 transition flex items-center space-x-2">
              <i data-lucide="sparkles" class="w-4 h-4"></i>
              <span>Add Custom Experience</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  `;
}
