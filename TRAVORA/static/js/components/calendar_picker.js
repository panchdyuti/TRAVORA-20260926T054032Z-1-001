// TRAVORA CALENDAR DATE & RANGE PICKER
// High-performance, luxury interactive date picker with Indian Festival Intelligence & Quick Presets

import { store } from '../store.js';

let activeCalendarModal = null;

// Major Indian Festivals Calendar Data (Year-round mapping)
export const INDIAN_FESTIVALS_MAP = {
  // Key festival dates across seasons
  '2026-10-20': { name: 'Dussehra / Vijayadashami', type: 'Spiritual Grandeur', crowd: 'High Peak', icon: '🛕' },
  '2026-10-28': { name: 'Pushkar Camel Fair Begins', type: 'Cultural Fair & Desert', crowd: 'Peak Tourism', icon: '🐪' },
  '2026-10-29': { name: 'Pushkar Camel Fair', type: 'Cultural Fair', crowd: 'Peak Tourism', icon: '🐪' },
  '2026-10-30': { name: 'Pushkar Camel Fair', type: 'Cultural Fair', crowd: 'Peak Tourism', icon: '🐪' },
  '2026-10-31': { name: 'Pushkar Fair & Desert Camp', type: 'Desert Festivities', crowd: 'Peak Tourism', icon: '🐪' },
  '2026-11-08': { name: 'Dhanteras & Diwali Shopping', type: 'Shopping & Lights', crowd: 'Festive Surge', icon: '✨' },
  '2026-11-09': { name: 'Chhoti Diwali / Kali Puja', type: 'Festival of Lights', crowd: 'High Surge', icon: '🪔' },
  '2026-11-10': { name: 'Diwali (Deepavali)', type: 'National Grand Festival', crowd: 'Maximum Peak', icon: '🪔' },
  '2026-11-11': { name: 'Govardhan Puja / New Year', type: 'Temple Annakut', crowd: 'High Peak', icon: '✨' },
  '2026-11-12': { name: 'Bhai Dooj', type: 'Family Gatherings', crowd: 'Heavy Transit', icon: '🌸' },
  '2026-11-15': { name: 'Chhath Puja Mahaparv', type: 'Sacred River Ghats', crowd: 'Extremely High', icon: '🌅' },
  '2026-11-24': { name: 'Dev Deepawali (Varanasi)', type: 'Million Earthen Diyas', crowd: 'Global Tourist Peak', icon: '🪔' },
  '2026-12-01': { name: 'Hornbill Festival (Nagaland)', type: 'Tribal Cultural Heritage', crowd: 'International Peak', icon: '🪶' },
  '2026-12-02': { name: 'Hornbill Festival (Nagaland)', type: 'Tribal Cultural Heritage', crowd: 'International Peak', icon: '🪶' },
  '2026-12-03': { name: 'Hornbill Festival (Nagaland)', type: 'Tribal Cultural Heritage', crowd: 'International Peak', icon: '🪶' },
  '2026-12-15': { name: 'Rann Utsav (White Desert)', type: 'White Desert Full Moon', crowd: 'High Peak', icon: '🌕' },
  '2026-12-25': { name: 'Christmas Celebrations (Goa & Kerala)', type: 'Beach & Church Carnival', crowd: 'Peak Holiday', icon: '🎄' },
  '2026-12-31': { name: 'New Year’s Eve Grand Gala', type: 'Celebration Across India', crowd: 'Maximum Peak', icon: '🎉' },
  '2027-01-01': { name: 'New Year Day', type: 'Global Holiday', crowd: 'Peak Travel', icon: '🌟' },
  '2027-01-14': { name: 'Makar Sankranti & Pongal', type: 'Kite Festival & Harvest', crowd: 'Cultural High', icon: '🪁' },
  '2027-01-26': { name: 'Republic Day Long Weekend', type: 'National Holiday', crowd: 'High Tourism', icon: '🇮🇳' },
  '2027-02-14': { name: 'Goa Carnival', type: 'Street Float Parade & Music', crowd: 'High Peak', icon: '🎭' },
  '2027-03-22': { name: 'Holi Festival of Colors', type: 'Colors & Braj Mathura Fest', crowd: 'Maximum Peak', icon: '🎨' }
};

export function openCalendarPicker(config = {}) {
  const {
    startInputId = 'plan_start_date',
    endInputId = 'plan_end_date',
    isRange = true,
    title = 'Select Travel Dates',
    initialStartDate = null,
    initialEndDate = null,
    onDatesSelected = null
  } = config;

  closeCalendarPicker();

  const startEl = document.getElementById(startInputId);
  const endEl = document.getElementById(endInputId);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentStart = initialStartDate || (startEl && startEl.value) || window.landingDepDate || formatDate(new Date(today.getTime() + 86400000 * 2));
  let currentEnd = initialEndDate || (endEl && endEl.value) || window.landingRetDate || formatDate(new Date(today.getTime() + 86400000 * 5));

  if (!isRange) {
    currentEnd = currentStart;
  }

  // Calendar viewing state
  const parseStartDate = new Date(currentStart + 'T00:00:00');
  let viewYear = !isNaN(parseStartDate.getFullYear()) ? parseStartDate.getFullYear() : today.getFullYear();
  let viewMonth = !isNaN(parseStartDate.getMonth()) ? parseStartDate.getMonth() : today.getMonth();

  let selectingStep = 'start'; // 'start' or 'end'

  // Create Modal Element
  const modal = document.createElement('div');
  modal.id = 'travora-calendar-modal';
  modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md transition-opacity duration-200';
  modal.onclick = (e) => {
    if (e.target === modal) closeCalendarPicker();
  };

  modal.innerHTML = `
    <div class="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
      
      <!-- HEADER -->
      <div class="p-4 sm:p-5 bg-gradient-to-r from-red-600/15 via-[#810B38]/15 to-transparent border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-2xl bg-[#810B38] text-white flex items-center justify-center shadow-lg shadow-red-900/30">
            <i data-lucide="calendar" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
              ${title}
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400" id="calendar-subtitle">
              ${isRange ? 'Choose departure and return dates' : 'Choose your travel date'}
            </p>
          </div>
        </div>
        <button 
          type="button" 
          onclick="window.closeCalendarPicker()"
          class="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- ACTIVE DATES BAR & PRESETS -->
      <div class="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 space-y-3 shrink-0">
        
        <!-- DATES DISPLAY CHIPS -->
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="p-2.5 rounded-xl border border-[#810B38]/40 bg-white dark:bg-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <div class="text-[10px] font-bold uppercase text-slate-400">Departure Date</div>
              <div class="font-black text-sm text-[#810B38] dark:text-red-400" id="cal-start-display">
                ${formatPretty(currentStart)}
              </div>
            </div>
            <i data-lucide="plane-takeoff" class="w-4 h-4 text-[#810B38] dark:text-red-400"></i>
          </div>

          ${isRange ? `
            <div class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <div class="text-[10px] font-bold uppercase text-slate-400">Return Date</div>
                <div class="font-black text-sm text-slate-800 dark:text-white" id="cal-end-display">
                  ${formatPretty(currentEnd)}
                </div>
              </div>
              <i data-lucide="plane-landing" class="w-4 h-4 text-emerald-500"></i>
            </div>
          ` : `
            <div class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <div class="text-[10px] font-bold uppercase text-slate-400">Trip Format</div>
                <div class="font-black text-sm text-slate-800 dark:text-white">One-Way Journey</div>
              </div>
              <i data-lucide="check-circle" class="w-4 h-4 text-emerald-500"></i>
            </div>
          `}
        </div>

        <!-- QUICK PRESET SHORTCUTS -->
        <div class="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span class="text-[10px] font-bold uppercase text-slate-400 mr-1 shrink-0">Presets:</span>
          <button type="button" onclick="window.applyCalendarPreset('tomorrow')" class="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#810B38] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold whitespace-nowrap transition">
            Tomorrow
          </button>
          <button type="button" onclick="window.applyCalendarPreset('this_weekend')" class="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#810B38] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold whitespace-nowrap transition">
            This Weekend
          </button>
          <button type="button" onclick="window.applyCalendarPreset('next_weekend')" class="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#810B38] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold whitespace-nowrap transition">
            Next Weekend
          </button>
          <button type="button" onclick="window.applyCalendarPreset('3_days')" class="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#810B38] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold whitespace-nowrap transition">
            3-Day Getaway
          </button>
          <button type="button" onclick="window.applyCalendarPreset('5_days')" class="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#810B38] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold whitespace-nowrap transition">
            5-Day Tour
          </button>
          <button type="button" onclick="window.applyCalendarPreset('7_days')" class="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#810B38] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold whitespace-nowrap transition">
            7-Day Holiday
          </button>
          <button type="button" onclick="window.applyCalendarPreset('diwali')" class="px-2.5 py-1 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-black whitespace-nowrap transition flex items-center space-x-1">
            <span>✨ Diwali Week</span>
          </button>
        </div>

      </div>

      <!-- MONTH & YEAR NAVIGATION -->
      <div class="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
        <button 
          type="button" 
          onclick="window.navCalendarMonth(-1)"
          class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#810B38] transition">
          <i data-lucide="chevron-left" class="w-5 h-5"></i>
        </button>

        <div class="text-center">
          <div class="font-extrabold text-base text-slate-900 dark:text-white" id="cal-month-year-label">
            ${getMonthName(viewMonth)} ${viewYear}
          </div>
          <div class="text-[10px] text-slate-400 font-medium">Click a date to select</div>
        </div>

        <button 
          type="button" 
          onclick="window.navCalendarMonth(1)"
          class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#810B38] transition">
          <i data-lucide="chevron-right" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- CALENDAR GRID -->
      <div class="p-4 sm:p-5 overflow-y-auto flex-1">
        
        <!-- WEEKDAY HEADERS -->
        <div class="grid grid-cols-7 gap-1 text-center font-extrabold text-[11px] text-slate-400 uppercase mb-2">
          <span class="text-red-500">Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span class="text-blue-500">Sa</span>
        </div>

        <!-- DAYS CELLS CONTAINER -->
        <div id="calendar-days-grid" class="grid grid-cols-7 gap-1.5 text-center text-xs">
          <!-- Populated by renderGrid() -->
        </div>

        <!-- FESTIVAL ALERT STRIP (IF DETECTED IN MONTH) -->
        <div id="calendar-festival-notice" class="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-800 dark:text-amber-200 flex items-start space-x-2">
          <i data-lucide="sparkles" class="w-4 h-4 text-amber-500 shrink-0 mt-0.5"></i>
          <div>
            <span class="font-extrabold">Festival Alert:</span>
            <span id="calendar-festival-text">Dates with golden dots coincide with verified Indian cultural festivals.</span>
          </div>
        </div>

      </div>

      <!-- FOOTER ACTIONS -->
      <div class="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div class="text-xs text-slate-500 dark:text-slate-400 font-medium" id="cal-duration-text">
          ${calculateDurationText(currentStart, currentEnd)}
        </div>

        <div class="flex items-center space-x-2">
          <button 
            type="button" 
            onclick="window.closeCalendarPicker()"
            class="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition">
            Cancel
          </button>
          <button 
            type="button" 
            onclick="window.confirmCalendarSelection()"
            class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-[#810B38] to-[#541A1A] text-white text-xs font-black shadow-lg shadow-red-900/30 hover:opacity-95 transition transform hover:scale-[1.02] flex items-center space-x-1.5">
            <i data-lucide="check" class="w-4 h-4"></i>
            <span>Apply Dates</span>
          </button>
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(modal);
  activeCalendarModal = modal;
  if (window.lucide) window.lucide.createIcons();

  function renderGrid() {
    const grid = document.getElementById('calendar-days-grid');
    const label = document.getElementById('cal-month-year-label');
    const festNotice = document.getElementById('calendar-festival-text');
    if (!grid) return;

    if (label) label.innerText = `${getMonthName(viewMonth)} ${viewYear}`;

    grid.innerHTML = '';

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    let monthFestivals = [];

    // Empty spaces / Prev month days
    for (let i = 0; i < firstDay; i++) {
      const prevDateNum = daysInPrevMonth - firstDay + 1 + i;
      const cell = document.createElement('div');
      cell.className = 'py-2 text-slate-300 dark:text-slate-700 text-xs font-medium cursor-not-allowed opacity-40 select-none';
      cell.innerText = prevDateNum;
      grid.appendChild(cell);
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const thisDate = new Date(viewYear, viewMonth, d);
      thisDate.setHours(0, 0, 0, 0);

      const isPast = thisDate < today;
      const isStart = dateStr === currentStart;
      const isEnd = isRange && dateStr === currentEnd;
      const isInRange = isRange && currentStart && currentEnd && dateStr > currentStart && dateStr < currentEnd;
      const isToday = thisDate.getTime() === today.getTime();

      const festival = INDIAN_FESTIVALS_MAP[dateStr];
      if (festival) {
        monthFestivals.push(`${d} ${getMonthName(viewMonth).slice(0, 3)}: ${festival.name}`);
      }

      const cell = document.createElement('div');
      cell.className = 'relative py-2.5 rounded-xl font-bold text-xs select-none transition flex flex-col items-center justify-center cursor-pointer';

      if (isPast) {
        cell.className += ' text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40';
      } else if (isStart || isEnd) {
        cell.className += ' bg-[#810B38] text-white shadow-md shadow-red-900/40 ring-2 ring-red-400/40 scale-105 z-10';
      } else if (isInRange) {
        cell.className += ' bg-red-100/70 dark:bg-red-950/50 text-[#810B38] dark:text-red-200 rounded-none first:rounded-l-xl last:rounded-r-xl';
      } else {
        cell.className += ' text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#810B38] dark:hover:text-red-400';
        if (isToday) {
          cell.className += ' ring-1.5 ring-emerald-500 font-black';
        }
      }

      let dayHtml = `<span>${d}</span>`;
      if (festival) {
        dayHtml += `<span class="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm" title="${festival.name}"></span>`;
      }
      cell.innerHTML = dayHtml;

      if (!isPast) {
        cell.onclick = () => onCellClick(dateStr);
      }

      grid.appendChild(cell);
    }

    if (festNotice) {
      if (monthFestivals.length > 0) {
        festNotice.innerHTML = `<strong>Festivals this month:</strong> ${monthFestivals.join(' • ')}`;
      } else {
        festNotice.innerText = 'Dates with golden dots coincide with verified Indian cultural festivals.';
      }
    }

    updateHeaderChips();
  }

  function onCellClick(dateStr) {
    if (!isRange) {
      currentStart = dateStr;
      currentEnd = dateStr;
      renderGrid();
      return;
    }

    if (selectingStep === 'start') {
      currentStart = dateStr;
      if (currentEnd && currentEnd < currentStart) {
        // Shift end date automatically +3 days
        const dt = new Date(currentStart);
        dt.setDate(dt.getDate() + 3);
        currentEnd = formatDate(dt);
      }
      selectingStep = 'end';
      const sub = document.getElementById('calendar-subtitle');
      if (sub) sub.innerText = 'Now click your Return date';
    } else {
      if (dateStr < currentStart) {
        currentStart = dateStr;
      } else {
        currentEnd = dateStr;
        selectingStep = 'start';
        const sub = document.getElementById('calendar-subtitle');
        if (sub) sub.innerText = 'Dates selected! Click Apply Dates or adjust anytime.';
      }
    }

    renderGrid();
  }

  function updateHeaderChips() {
    const sChip = document.getElementById('cal-start-display');
    const eChip = document.getElementById('cal-end-display');
    const durText = document.getElementById('cal-duration-text');

    if (sChip) sChip.innerText = formatPretty(currentStart);
    if (eChip) eChip.innerText = formatPretty(currentEnd);
    if (durText) durText.innerText = calculateDurationText(currentStart, currentEnd);
  }

  // Window helper actions
  window.navCalendarMonth = function (delta) {
    viewMonth += delta;
    if (viewMonth > 11) {
      viewMonth = 0;
      viewYear += 1;
    } else if (viewMonth < 0) {
      viewMonth = 11;
      viewYear -= 1;
    }
    renderGrid();
  };

  window.applyCalendarPreset = function (preset) {
    const base = new Date();
    base.setHours(0, 0, 0, 0);

    if (preset === 'tomorrow') {
      const s = new Date(base.getTime() + 86400000);
      const e = new Date(base.getTime() + 86400000 * 3);
      currentStart = formatDate(s);
      currentEnd = formatDate(e);
    } else if (preset === 'this_weekend') {
      const day = base.getDay();
      const diffToSat = (6 - day + 7) % 7 || 7;
      const sat = new Date(base.getTime() + diffToSat * 86400000);
      const sun = new Date(sat.getTime() + 86400000);
      currentStart = formatDate(sat);
      currentEnd = formatDate(sun);
    } else if (preset === 'next_weekend') {
      const day = base.getDay();
      const diffToSat = ((6 - day + 7) % 7 || 7) + 7;
      const sat = new Date(base.getTime() + diffToSat * 86400000);
      const sun = new Date(sat.getTime() + 86400000 * 2);
      currentStart = formatDate(sat);
      currentEnd = formatDate(sun);
    } else if (preset === '3_days') {
      const s = new Date(base.getTime() + 86400000 * 2);
      const e = new Date(s.getTime() + 86400000 * 3);
      currentStart = formatDate(s);
      currentEnd = formatDate(e);
    } else if (preset === '5_days') {
      const s = new Date(base.getTime() + 86400000 * 3);
      const e = new Date(s.getTime() + 86400000 * 5);
      currentStart = formatDate(s);
      currentEnd = formatDate(e);
    } else if (preset === '7_days') {
      const s = new Date(base.getTime() + 86400000 * 3);
      const e = new Date(s.getTime() + 86400000 * 7);
      currentStart = formatDate(s);
      currentEnd = formatDate(e);
    } else if (preset === 'diwali') {
      currentStart = '2026-11-08';
      currentEnd = '2026-11-15';
    }

    viewYear = new Date(currentStart).getFullYear();
    viewMonth = new Date(currentStart).getMonth();
    renderGrid();
    store.addToast(`Applied preset dates: ${formatPretty(currentStart)} to ${formatPretty(currentEnd)}`, 'info', 2500);
  };

  window.confirmCalendarSelection = function () {
    if (startEl) {
      startEl.value = currentStart;
      startEl.dispatchEvent(new Event('change', { bubbles: true }));
      startEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (endEl) {
      endEl.value = currentEnd;
      endEl.dispatchEvent(new Event('change', { bubbles: true }));
      endEl.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Also synchronize all landing search inputs if they exist
    const depInp = document.getElementById('search-dep-date');
    if (depInp) depInp.value = currentStart;
    const retInp = document.getElementById('search-ret-date');
    if (retInp) retInp.value = currentEnd;
    const hInInp = document.getElementById('hotel-checkin-date');
    if (hInInp) hInInp.value = currentStart;
    const hOutInp = document.getElementById('hotel-checkout-date');
    if (hOutInp) hOutInp.value = currentEnd;

    // Update global variables for planner and landing
    window.plannerStartDate = currentStart;
    window.plannerEndDate = currentEnd;
    window.landingDepDate = currentStart;
    window.landingRetDate = currentEnd;

    // Trigger AI festival checker if present
    if (window.triggerDateChangeCheck) {
      window.triggerDateChangeCheck();
    }

    if (typeof onDatesSelected === 'function') {
      onDatesSelected(currentStart, currentEnd);
    }

    store.addToast(`Travel dates applied: ${formatPretty(currentStart)}${isRange ? ` — ${formatPretty(currentEnd)}` : ''}`, 'success', 3000);
    closeCalendarPicker();

    // Trigger reactive re-render of UI
    store.setState({ landingDepDate: currentStart, landingRetDate: currentEnd });
  };

  renderGrid();
}

export function closeCalendarPicker() {
  if (activeCalendarModal) {
    activeCalendarModal.remove();
    activeCalendarModal = null;
  }
}

// Helpers
function formatDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatPretty(dateStr) {
  if (!dateStr) return 'Select Date';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function getMonthName(m) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[m] || '';
}

function calculateDurationText(s, e) {
  if (!s || !e) return '';
  const d1 = new Date(s + 'T00:00:00');
  const d2 = new Date(e + 'T00:00:00');
  const diffDays = Math.max(1, Math.round((d2 - d1) / 86400000));
  const nights = Math.max(0, diffDays);
  const days = nights + 1;
  return `Selected Duration: ${days} Days / ${nights} Night${nights > 1 ? 's' : ''}`;
}

// Global window exposure
window.openCalendarPicker = openCalendarPicker;
window.closeCalendarPicker = closeCalendarPicker;
