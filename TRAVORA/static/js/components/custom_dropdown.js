// TRAVORA CUSTOM DROPDOWN SYSTEM
// Premium replacement for native browser selects with Lucide icons, clean typography, zero emojis

let activeDropdownId = null;

export function renderCustomDropdown(config = {}) {
  const {
    id = 'dropdown-' + Math.random().toString(36).substr(2, 9),
    name = '',
    options = [], // [{ value, title, sub, icon, selected: boolean }]
    selectedValue = '',
    customClass = '',
    onChange = ''
  } = config;

  let selectedOption = options.find(o => o.value === selectedValue) || options.find(o => o.selected) || options[0] || {
    value: '',
    title: 'Select an option',
    sub: '',
    icon: 'chevron-down'
  };

  return `
    <div class="travora-custom-dropdown relative ${customClass}" id="dd-wrapper-${id}">
      <!-- Form Input for FormData & Serialization -->
      <input type="hidden" name="${name}" id="dd-input-${id}" value="${selectedOption.value}" />

      <!-- Trigger Button -->
      <button 
        type="button" 
        id="dd-trigger-${id}"
        onclick="window.toggleCustomDropdown('${id}')"
        class="w-full px-3.5 py-2.5 sm:py-3 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-900 hover:border-[#810B38] dark:hover:border-red-500 text-left flex items-center justify-between shadow-xs hover:shadow-md transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#810B38]/30">
        
        <div class="flex items-center space-x-3 min-w-0">
          <div class="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#810B38] dark:text-red-400 flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900/30 group-hover:scale-105 transition-transform" id="dd-icon-${id}">
            <i data-lucide="${selectedOption.icon || 'sparkles'}" class="w-4 h-4"></i>
          </div>
          <div class="min-w-0 pr-1">
            <div class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate" id="dd-title-${id}">
              ${selectedOption.title}
            </div>
            ${selectedOption.sub ? `
              <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate" id="dd-sub-${id}">
                ${selectedOption.sub}
              </div>
            ` : `<div class="hidden" id="dd-sub-${id}"></div>`}
          </div>
        </div>

        <div class="shrink-0 ml-2">
          <i data-lucide="chevron-down" id="dd-chevron-${id}" class="w-4 h-4 text-slate-400 group-hover:text-[#810B38] transition-transform duration-200"></i>
        </div>
      </button>

      <!-- Floating Menu -->
      <div 
        id="dd-menu-${id}" 
        class="hidden absolute left-0 right-0 top-full mt-2 z-[100] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 space-y-1 max-h-72 overflow-y-auto backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 no-scrollbar">
        ${options.map(opt => {
          const isSelected = opt.value === selectedOption.value;
          return `
            <div 
              onclick="window.selectCustomDropdownOption('${id}', '${opt.value}', '${(opt.title || '').replace(/'/g, "\\'")}', '${(opt.sub || '').replace(/'/g, "\\'")}', '${opt.icon || 'check'}', '${onChange || ''}')"
              class="dd-option-${id} p-2.5 rounded-xl hover:bg-red-50/70 dark:hover:bg-red-950/30 cursor-pointer transition flex items-center justify-between group ${isSelected ? 'bg-red-50/90 dark:bg-red-950/40' : ''}">
              
              <div class="flex items-center space-x-3 min-w-0">
                <div class="w-7 h-7 rounded-lg ${isSelected ? 'bg-[#810B38] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'} group-hover:bg-[#810B38] group-hover:text-white flex items-center justify-center shrink-0 transition">
                  <i data-lucide="${opt.icon || 'check'}" class="w-3.5 h-3.5"></i>
                </div>
                <div class="min-w-0">
                  <div class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#810B38] dark:group-hover:text-red-400 transition truncate">
                    ${opt.title}
                  </div>
                  ${opt.sub ? `
                    <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      ${opt.sub}
                    </div>
                  ` : ''}
                </div>
              </div>

              <div class="shrink-0 ml-2">
                <i data-lucide="check" class="w-4 h-4 text-[#810B38] dark:text-red-400 ${isSelected ? '' : 'opacity-0'}"></i>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// Global functions
window.toggleCustomDropdown = function(id) {
  const menu = document.getElementById(`dd-menu-${id}`);
  const chevron = document.getElementById(`dd-chevron-${id}`);
  const wrapper = document.getElementById(`dd-wrapper-${id}`);
  if (!menu) return;

  const isClosed = menu.classList.contains('hidden');
  
  // Close any other open dropdowns first
  window.closeAllCustomDropdowns();

  if (isClosed) {
    menu.classList.remove('hidden');
    if (chevron) chevron.style.transform = 'rotate(180deg)';
    if (wrapper) {
      wrapper.style.zIndex = '100';
      wrapper.classList.add('z-[100]');
      const parentCard = wrapper.closest('.glass-input-card') || wrapper.parentElement;
      if (parentCard) parentCard.style.zIndex = '100';
    }
    activeDropdownId = id;
    if (window.lucide) window.lucide.createIcons();
  }
};

window.closeAllCustomDropdowns = function() {
  document.querySelectorAll('[id^="dd-menu-"]').forEach(m => {
    m.classList.add('hidden');
  });
  document.querySelectorAll('[id^="dd-chevron-"]').forEach(c => {
    c.style.transform = 'rotate(0deg)';
  });
  document.querySelectorAll('[id^="dd-wrapper-"]').forEach(w => {
    w.style.zIndex = '';
    w.classList.remove('z-[100]');
    const parentCard = w.closest('.glass-input-card') || w.parentElement;
    if (parentCard) parentCard.style.zIndex = '';
  });
  activeDropdownId = null;
};

window.selectCustomDropdownOption = function(id, value, title, sub, icon, onChange) {
  // Update hidden input
  const input = document.getElementById(`dd-input-${id}`);
  if (input) {
    input.value = value;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // Update button visual state
  const titleEl = document.getElementById(`dd-title-${id}`);
  if (titleEl) titleEl.textContent = title;

  const subEl = document.getElementById(`dd-sub-${id}`);
  if (subEl) {
    if (sub) {
      subEl.textContent = sub;
      subEl.classList.remove('hidden');
    } else {
      subEl.classList.add('hidden');
    }
  }

  const iconEl = document.getElementById(`dd-icon-${id}`);
  if (iconEl && icon) {
    iconEl.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4"></i>`;
  }

  // Update checkmarks in menu
  const options = document.querySelectorAll(`.dd-option-${id}`);
  options.forEach(opt => {
    opt.classList.remove('bg-red-50/90', 'dark:bg-red-950/40');
    const check = opt.querySelector('[data-lucide="check"]');
    if (check) check.classList.add('opacity-0');
  });

  // Close menu
  window.closeAllCustomDropdowns();

  if (window.lucide) window.lucide.createIcons();

  // Execute custom callback if provided
  if (onChange) {
    const fnName = onChange.replace(/^window\./, '');
    if (typeof window[fnName] === 'function') {
      window[fnName](value, title, sub);
    } else if (typeof window[onChange] === 'function') {
      window[onChange](value, title, sub);
    }
  }
};


// Close dropdown on outside click or ESC key
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.travora-custom-dropdown')) {
      window.closeAllCustomDropdowns();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeAllCustomDropdowns();
    }
  });
}
