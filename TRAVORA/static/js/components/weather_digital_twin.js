// TRAVORA WEATHER-DRIVEN DIGITAL TWIN & IMPACT SIMULATION MODULE
// Architecture: Live Weather API -> Weather State -> Digital Twin State -> AI Impact Analysis -> Visualization

import { store } from '../store.js';
import { api } from '../api.js';
import { renderCustomDropdown } from './custom_dropdown.js';

let digitalTwinMap = null;
let twinMarkers = [];
let weatherRadarCircle = null;

export function renderWeatherDigitalTwin() {
  const state = store.getState();
  const currentDestId = state.weatherTwinDestinationId || 1;
  const twinData = state.weatherTwinData;
  const simResult = state.weatherTwinSimResult;
  const viewMode = state.weatherTwinViewMode || 'live';
  const filterType = state.weatherTwinFilterType || 'all';

  // Active state to display: either simulated scenario or live baseline
  const activeState = (viewMode === 'scenario' && simResult) ? simResult.simulated_state : twinData;
  const baselineState = (viewMode === 'scenario' && simResult) ? simResult.baseline_state : twinData;
  const compDelta = simResult ? simResult.comparison_delta : null;

  if (!activeState) {
    return `
      <div class="min-h-screen bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-8">
        <div class="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
          <div class="w-16 h-16 mx-auto rounded-2xl bg-[#810B38]/10 text-[#810B38] dark:text-red-400 flex items-center justify-center animate-pulse">
            <i data-lucide="cloud-lightning" class="w-8 h-8"></i>
          </div>
          <h2 class="text-xl font-black text-slate-900 dark:text-white">Ingesting Digital Twin Telemetry...</h2>
          <p class="text-xs text-slate-500">Connecting to real-time Open-Meteo meteorological stream and synchronizing destination infrastructure nodes.</p>
          <div class="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div class="bg-[#810B38] h-full w-2/3 animate-pulse"></div>
          </div>
        </div>
      </div>
    `;
  }

  const weather = activeState.weather_state || {};
  const metrics = activeState.metrics || {};
  const destination = activeState.destination || { name: 'Goa', state: 'Goa' };
  const chain = activeState.impact_chain || [];
  const aiReport = activeState.ai_impact_analysis || {};
  const allEntities = activeState.entities || [];


  // Filter entities for display
  const filteredEntities = allEntities.filter(e => {
    if (filterType === 'all') return true;
    if (filterType === 'outdoor') return e.is_outdoor;
    if (filterType === 'hotels') return e.entity_type === 'hotel';
    if (filterType === 'transports') return e.entity_type === 'transport';
    if (filterType === 'dining') return e.entity_type === 'restaurant' || e.category === 'Restaurants';
    return true;
  });

  // Destinations list for selector
  const destList = (state.weatherTwinDestinations && state.weatherTwinDestinations.length > 0)
    ? state.weatherTwinDestinations
    : [
        { id: 1, name: 'Goa', state: 'Goa' },
        { id: 2, name: 'Jaipur', state: 'Rajasthan' },
        { id: 3, name: 'Kerala (Alleppey & Munnar)', state: 'Kerala' },
        { id: 4, name: 'Manali', state: 'Himachal Pradesh' },
        { id: 5, name: 'Udaipur', state: 'Rajasthan' },
        { id: 6, name: 'Kashmir (Srinagar & Gulmarg)', state: 'Jammu & Kashmir' },
        { id: 7, name: 'Rishikesh', state: 'Uttarakhand' }
      ];

  const destinationOptions = destList.map(d => ({
    value: String(d.id),
    title: d.name,
    sub: `${d.state} Destination Hub`,
    icon: 'map-pin',
    selected: d.id === currentDestId
  }));

  const simParams = state.weatherTwinSimParams || {
    rainfall_mm_h: 25.0,
    temperature_c: 28.0,
    wind_speed_kmh: 35.0,
    storm_duration_h: 4.0
  };

  return `
    <div class="min-h-screen bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 transition-colors pb-24">
      
      <!-- SUB-HEADER / TELEMETRY HERO -->
      <section class="relative bg-gradient-to-b from-[#810B38]/15 via-white/50 to-transparent dark:from-[#541A1A]/40 dark:via-[#0b1120] border-b border-slate-200/80 dark:border-slate-800 pt-7 pb-6 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          
          <!-- Top Row: Breadcrumb & Mode Pills -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div class="space-y-1">
              <div class="flex items-center space-x-2 text-xs font-bold tracking-wide uppercase text-[#810B38] dark:text-red-400">
                <i data-lucide="activity" class="w-4 h-4 animate-pulse"></i>
                <span>Dynamic Travel Ecosystem</span>
                <span class="text-slate-400">&bull;</span>
                <span class="text-slate-600 dark:text-slate-400">Weather-Driven Digital Twin</span>
              </div>
              <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-3">
                <span>Weather Intelligence Twin</span>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  LIVE TELEMETRY
                </span>
              </h1>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                Simulated real-time operational state of destination infrastructure, direct activity hazards, traveler behavioral migration, and multi-tier demand surges.
              </p>
            </div>

            <!-- Destination Switcher & Telemetry Mode -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div class="w-full sm:w-64">
                ${renderCustomDropdown({
                  id: 'weather-twin-dest-select',
                  name: 'destination_id',
                  options: destinationOptions,
                  selectedValue: String(currentDestId),
                  onChange: 'handleTwinDestinationChange'
                })}
              </div>

              <!-- Live vs Scenario Toggle -->
              <div class="inline-flex rounded-2xl bg-white dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800 shadow-xs">
                <button 
                  onclick="window.toggleWeatherTwinViewMode('live')"
                  class="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${viewMode === 'live' ? 'bg-[#810B38] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}">
                  <i data-lucide="radio" class="w-3.5 h-3.5"></i>
                  <span>Live Baseline</span>
                </button>
                <button 
                  onclick="window.toggleWeatherTwinViewMode('scenario')"
                  class="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${viewMode === 'scenario' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}">
                  <i data-lucide="sliders" class="w-3.5 h-3.5"></i>
                  <span>What-If Scenario</span>
                  ${simResult ? '<span class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>' : ''}
                </button>
              </div>
            </div>
          </div>

          <!-- Live Weather Telemetry Ribbon -->
          <div class="rounded-3xl p-4 sm:p-5 bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-lg backdrop-blur-xl">
            <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500/20 to-amber-500/20 text-[#810B38] dark:text-red-400 flex items-center justify-center shrink-0 border border-red-200/40 dark:border-red-900/30">
                  <i data-lucide="${weather.icon || 'cloud-sun'}" class="w-5 h-5"></i>
                </div>
                <div>
                  <div class="text-sm font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                    <span>${destination.name || 'Goa'}, ${destination.state || 'India'}</span>
                    <span class="text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      ${weather.condition || 'Mainly Clear'}
                    </span>
                    ${weather.is_scenario ? '<span class="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">Simulation Override</span>' : ''}
                  </div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span>Lat: ${weather.latitude ? Number(weather.latitude).toFixed(3) : '15.299'}°, Lng: ${weather.longitude ? Number(weather.longitude).toFixed(3) : '74.124'}°</span>
                    <span>&bull;</span>
                    <span class="text-emerald-600 dark:text-emerald-400 font-medium">Source: ${weather.source || 'Open-Meteo API'}</span>
                  </div>
                </div>
              </div>

              <!-- Timestamp badge -->
              <div class="text-right">
                <div class="text-[10px] uppercase font-bold tracking-wider text-slate-400">Telemetry Ingest Timestamp</div>
                <div class="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-end gap-1.5">
                  <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-400"></i>
                  <span>${weather.timestamp || 'Real-time UTC'}</span>
                </div>
              </div>
            </div>

            <!-- Weather Metric Gauges Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <!-- Temperature -->
              <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80">
                <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
                  <span>Temperature</span>
                  <i data-lucide="thermometer" class="w-4 h-4 text-rose-500"></i>
                </div>
                <div class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  ${weather.temperature_c ?? 28}°<span class="text-xs font-semibold text-slate-400">C</span>
                </div>
                <div class="text-[10px] text-slate-500">Feels like ${weather.feels_like_c ?? 29}°C</div>
              </div>

              <!-- Precipitation -->
              <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80">
                <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
                  <span>Precipitation</span>
                  <i data-lucide="cloud-rain" class="w-4 h-4 text-blue-500"></i>
                </div>
                <div class="text-xl sm:text-2xl font-black ${Number(weather.precipitation_mm || 0) > 15 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}">
                  ${weather.precipitation_mm ?? 0.0} <span class="text-xs font-semibold text-slate-400">mm/h</span>
                </div>
                <div class="text-[10px] text-slate-500">${Number(weather.precipitation_mm || 0) > 10 ? 'High Runoff Risk' : 'Dry / Low Rain'}</div>
              </div>

              <!-- Wind Speed -->
              <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80">
                <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
                  <span>Wind Speed</span>
                  <i data-lucide="wind" class="w-4 h-4 text-teal-500"></i>
                </div>
                <div class="text-xl sm:text-2xl font-black ${Number(weather.wind_speed_kmh || 0) > 40 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}">
                  ${weather.wind_speed_kmh ?? 12} <span class="text-xs font-semibold text-slate-400">km/h</span>
                </div>
                <div class="text-[10px] text-slate-500">${Number(weather.wind_speed_kmh || 0) > 35 ? 'Marine Wave Warning' : 'Calm / Gentle Breeze'}</div>
              </div>

              <!-- Humidity -->
              <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80">
                <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
                  <span>Humidity</span>
                  <i data-lucide="droplets" class="w-4 h-4 text-cyan-500"></i>
                </div>
                <div class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  ${weather.humidity_pct ?? 65}<span class="text-xs font-semibold text-slate-400">%</span>
                </div>
                <div class="text-[10px] text-slate-500">Relative Saturation</div>
              </div>

              <!-- Resilience Score -->
              <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80">
                <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
                  <span>Twin Resilience</span>
                  <i data-lucide="shield-check" class="w-4 h-4 text-emerald-500"></i>
                </div>
                <div class="text-xl sm:text-2xl font-black ${Number(metrics.resilience_score || 95) < 60 ? 'text-rose-600' : (Number(metrics.resilience_score || 95) < 80 ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400')}">
                  ${metrics.resilience_score ?? 96}<span class="text-xs font-semibold text-slate-400">/100</span>
                </div>
                <div class="text-[10px] text-slate-500">Ecosystem Stability</div>
              </div>

              <!-- Disrupted Entities -->
              <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80">
                <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
                  <span>Disrupted Entities</span>
                  <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-500"></i>
                </div>
                <div class="text-xl sm:text-2xl font-black ${Number(metrics.disrupted_entities_count || 0) > 0 ? 'text-amber-500' : 'text-slate-900 dark:text-white'}">
                  ${metrics.disrupted_entities_count ?? 0} <span class="text-xs font-normal text-slate-400">/ ${metrics.total_entities_count || 0}</span>
                </div>
                <div class="text-[10px] text-slate-500">${metrics.disrupted_entities_count > 0 ? 'Capacity constrained' : 'All systems normal'}</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- MAIN INTERACTIVE CONTENT AREA -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">

        <!-- SECTION 1: WHAT-IF SIMULATION CONTROL COCKPIT -->
        <section class="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md p-6">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <div class="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <i data-lucide="sliders" class="w-4 h-4"></i>
                <span>Digital Twin Scenario Laboratory</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                What-If Atmospheric Perturbation Simulation
              </h2>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Adjust weather parameters to simulate impact propagation on this destination's ecosystem. Does not alter real bookings or user records.
              </p>
            </div>

            <!-- Quick Presets -->
            <div class="flex items-center flex-wrap gap-2">
              <span class="text-xs font-bold text-slate-400 mr-1">Presets:</span>
              <button 
                onclick="window.applyWeatherTwinPreset('clear')"
                class="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition">
                Clear Sky
              </button>
              <button 
                onclick="window.applyWeatherTwinPreset('monsoon')"
                class="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-600 dark:text-blue-400 border border-blue-200/40 transition">
                Monsoon Rain (28 mm/h)
              </button>
              <button 
                onclick="window.applyWeatherTwinPreset('cyclone')"
                class="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200/40 transition">
                Severe Cyclone (55 mm/h)
              </button>
              <button 
                onclick="window.applyWeatherTwinPreset('heatwave')"
                class="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-600 dark:text-amber-400 border border-amber-200/40 transition">
                Heatwave (42°C)
              </button>
              <button 
                onclick="window.resetWeatherTwinToLive()"
                class="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#810B38]/10 hover:bg-[#810B38]/20 text-[#810B38] dark:text-red-400 border border-[#810B38]/30 transition">
                Reset to Live
              </button>
            </div>
          </div>

          <!-- Simulation Sliders Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80 mb-6">
            
            <!-- 1. Rainfall Slider -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs font-bold">
                <span class="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <i data-lucide="cloud-rain" class="w-4 h-4 text-blue-500"></i>
                  <span>Rainfall Rate</span>
                </span>
                <span class="font-mono text-blue-600 dark:text-blue-400 text-sm" id="twin-val-rain">${simParams.rainfall_mm_h} mm/h</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="80" 
                step="1" 
                value="${simParams.rainfall_mm_h}" 
                id="twin-slider-rain"
                oninput="document.getElementById('twin-val-rain').innerText = this.value + ' mm/h'"
                class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              <div class="flex justify-between text-[10px] text-slate-400">
                <span>0 mm/h (Dry)</span>
                <span>25 (Heavy)</span>
                <span>80 (Extreme)</span>
              </div>
            </div>

            <!-- 2. Wind Speed Slider -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs font-bold">
                <span class="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <i data-lucide="wind" class="w-4 h-4 text-teal-500"></i>
                  <span>Wind Speed</span>
                </span>
                <span class="font-mono text-teal-600 dark:text-teal-400 text-sm" id="twin-val-wind">${simParams.wind_speed_kmh} km/h</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="90" 
                step="2" 
                value="${simParams.wind_speed_kmh}" 
                id="twin-slider-wind"
                oninput="document.getElementById('twin-val-wind').innerText = this.value + ' km/h'"
                class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600" />
              <div class="flex justify-between text-[10px] text-slate-400">
                <span>0 km/h (Calm)</span>
                <span>40 (Gale)</span>
                <span>90 (Storm)</span>
              </div>
            </div>

            <!-- 3. Temperature Slider -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs font-bold">
                <span class="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <i data-lucide="thermometer" class="w-4 h-4 text-rose-500"></i>
                  <span>Temperature</span>
                </span>
                <span class="font-mono text-rose-600 dark:text-rose-400 text-sm" id="twin-val-temp">${simParams.temperature_c} °C</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="48" 
                step="1" 
                value="${simParams.temperature_c}" 
                id="twin-slider-temp"
                oninput="document.getElementById('twin-val-temp').innerText = this.value + ' °C'"
                class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600" />
              <div class="flex justify-between text-[10px] text-slate-400">
                <span>5°C (Chilly)</span>
                <span>28°C (Ideal)</span>
                <span>48°C (Extreme)</span>
              </div>
            </div>

            <!-- 4. Storm Duration Slider -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs font-bold">
                <span class="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <i data-lucide="clock" class="w-4 h-4 text-purple-500"></i>
                  <span>Storm Duration</span>
                </span>
                <span class="font-mono text-purple-600 dark:text-purple-400 text-sm" id="twin-val-dur">${simParams.storm_duration_h} hrs</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="12" 
                step="0.5" 
                value="${simParams.storm_duration_h}" 
                id="twin-slider-dur"
                oninput="document.getElementById('twin-val-dur').innerText = this.value + ' hrs'"
                class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600" />
              <div class="flex justify-between text-[10px] text-slate-400">
                <span>0 hrs (Passing)</span>
                <span>4 hrs (Heavy)</span>
                <span>12 hrs (Prolonged)</span>
              </div>
            </div>

          </div>

          <!-- Execution Action & Comparison Delta Ribbon -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button 
              id="twin-run-sim-btn"
              onclick="window.runWeatherTwinSimulation()"
              class="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#810B38] to-[#541A1A] text-white font-extrabold text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center space-x-2">
              <i data-lucide="play" class="w-4 h-4 fill-white"></i>
              <span>Execute What-If Propagation Engine</span>
            </button>

            ${compDelta ? `
              <!-- Comparative Delta Chips -->
              <div class="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span class="text-slate-400">Scenario vs Baseline:</span>
                <span class="px-2.5 py-1 rounded-xl ${compDelta.resilience_delta < 0 ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30' : 'bg-emerald-500/10 text-emerald-600'}">
                  Resilience: ${compDelta.resilience_delta >= 0 ? '+' : ''}${compDelta.resilience_delta} pts
                </span>
                <span class="px-2.5 py-1 rounded-xl ${compDelta.disrupted_entities_delta > 0 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30' : 'bg-slate-100 text-slate-600'}">
                  Disrupted: ${compDelta.disrupted_entities_delta >= 0 ? '+' : ''}${compDelta.disrupted_entities_delta}
                </span>
                <span class="px-2.5 py-1 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                  Traveler Shift: ${compDelta.traveler_shift_delta_pct >= 0 ? '+' : ''}${compDelta.traveler_shift_delta_pct}%
                </span>
                <span class="px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                  Avg Delay: +${compDelta.delay_delta_minutes}m
                </span>
              </div>
            ` : `
              <div class="text-xs text-slate-400 flex items-center gap-1.5">
                <i data-lucide="info" class="w-4 h-4"></i>
                <span>Currently viewing live baseline state. Run simulation to project changes.</span>
              </div>
            `}
          </div>
        </section>

        <!-- SECTION 2: MULTI-TIER PROBABILISTIC IMPACT CHAIN VISUALIZATION -->
        <section class="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md p-6">
          <div class="mb-5">
            <div class="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
              <i data-lucide="git-merge" class="w-4 h-4"></i>
              <span>Multi-Tier Impact Propagation Chain</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
              Causal Weather Dependency Flow
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Probabilistic multi-order propagation: Heavy Rain &rarr; Outdoor Activity Impact &rarr; Traveler Shift &rarr; Transport Impact &rarr; Restaurant/Hotel Demand.
            </p>
          </div>

          <!-- Impact Chain Connected Pipeline -->
          <div class="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            ${chain.map((c, idx) => `
              <div class="relative p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                c.status === 'critical' ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-950 dark:text-rose-100' :
                c.status === 'warning' ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-950 dark:text-amber-100' :
                'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800 text-slate-900 dark:text-slate-200'
              }">
                <!-- Step number & connector badge -->
                <div class="flex items-center justify-between mb-2">
                  <div class="w-6 h-6 rounded-lg bg-white/80 dark:bg-slate-900/80 text-xs font-black flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    ${c.step}
                  </div>
                  <i data-lucide="${c.icon || 'arrow-right'}" class="w-4 h-4 ${c.status === 'critical' ? 'text-rose-600' : (c.status === 'warning' ? 'text-amber-500' : 'text-slate-400')}"></i>
                </div>

                <div class="space-y-1">
                  <div class="text-[10px] font-black uppercase tracking-wider text-slate-400">${c.title}</div>
                  <div class="text-xs sm:text-sm font-extrabold leading-tight">${c.headline}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 pt-1 leading-snug">${c.detail}</div>
                </div>

                <!-- Arrow indicator for md screens -->
                ${idx < 4 ? `
                  <div class="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center text-[10px]">
                    <i data-lucide="chevron-right" class="w-3 h-3"></i>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>

        <!-- SECTION 3: INTERACTIVE GEOGRAPHIC DIGITAL TWIN MAP & SPATIAL RISK RADAR -->
        <section class="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md p-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div class="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                <i data-lucide="map" class="w-4 h-4"></i>
                <span>Geographic Information System (GIS) Digital Twin</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                Live Destination Ecosystem Radar
              </h2>
            </div>

            <!-- Map legend -->
            <div class="flex items-center space-x-3 text-xs font-semibold">
              <span class="flex items-center space-x-1">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Operational</span>
              </span>
              <span class="flex items-center space-x-1">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Weather Advisory</span>
              </span>
              <span class="flex items-center space-x-1">
                <span class="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                <span>Suspended / High Risk</span>
              </span>
            </div>
          </div>

          <!-- Leaflet Map Mount Container -->
          <div class="relative w-full h-[420px] sm:h-[480px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner z-0">
            <div id="weather-twin-map" class="w-full h-full z-0"></div>
            
            <!-- Map Overlay Quick Telemetry Badge -->
            <div class="absolute bottom-4 left-4 z-10 p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg text-xs space-y-1">
              <div class="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <i data-lucide="radar" class="w-4 h-4 text-emerald-500"></i>
                <span>Spatial Radar: ${destination.name} Hub</span>
              </div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400">
                Tracking ${allEntities.length} catalog entities &bull; Precipitation: ${weather.precipitation_mm || 0} mm/h
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION 4: DIGITAL TWIN ECOSYSTEM ENTITIES GRID -->
        <section class="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md p-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div class="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#810B38] dark:text-red-400">
                <i data-lucide="layers" class="w-4 h-4"></i>
                <span>Catalog Infrastructure Breakdown</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                Simulated Travel Ecosystem Entities (${filteredEntities.length})
              </h2>
            </div>

            <!-- Filter Tabs -->
            <div class="inline-flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
              <button 
                onclick="window.filterWeatherTwinEntities('all')"
                class="px-3 py-1.5 rounded-xl transition ${filterType === 'all' ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}">
                All
              </button>
              <button 
                onclick="window.filterWeatherTwinEntities('outdoor')"
                class="px-3 py-1.5 rounded-xl transition ${filterType === 'outdoor' ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}">
                Outdoor Activities
              </button>
              <button 
                onclick="window.filterWeatherTwinEntities('hotels')"
                class="px-3 py-1.5 rounded-xl transition ${filterType === 'hotels' ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}">
                Hotels & Stays
              </button>
              <button 
                onclick="window.filterWeatherTwinEntities('transports')"
                class="px-3 py-1.5 rounded-xl transition ${filterType === 'transports' ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}">
                Transports
              </button>
              <button 
                onclick="window.filterWeatherTwinEntities('dining')"
                class="px-3 py-1.5 rounded-xl transition ${filterType === 'dining' ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}">
                Dining
              </button>
            </div>
          </div>

          <!-- Entity Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${filteredEntities.slice(0, 15).map(e => `
              <div class="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:shadow-md transition-shadow flex flex-col justify-between">
                <div class="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      e.entity_type === 'activity' ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600' :
                      e.entity_type === 'hotel' ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600' :
                      e.entity_type === 'transport' ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-600' :
                      'bg-amber-50 dark:bg-amber-950/40 text-amber-600'
                    }">
                      ${e.category || e.entity_type} ${e.is_outdoor ? '&bull; Outdoor' : '&bull; Indoor'}
                    </span>
                    <h3 class="text-sm font-extrabold text-slate-950 dark:text-white mt-1">${e.name}</h3>
                  </div>

                  <!-- Status Badge -->
                  <span class="shrink-0 text-[10px] font-bold px-2 py-1 rounded-xl ${
                    e.status === 'suspended' ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30' :
                    e.status === 'restricted' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
                    e.status === 'advisory' ? 'bg-yellow-500/15 text-yellow-600 border border-yellow-500/30' :
                    'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  }">
                    ${e.status.toUpperCase()}
                  </span>
                </div>

                <div class="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                  ${e.impact_reason}
                </div>

                <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div class="text-slate-500">
                    Capacity: <span class="font-bold text-slate-900 dark:text-white">${e.simulated_capacity ?? 100}%</span>
                    ${e.simulated_delay_minutes ? `<span class="text-amber-500 font-bold ml-1">(+${e.simulated_delay_minutes}m delay)</span>` : ''}
                  </div>
                  <div class="font-extrabold text-[#810B38] dark:text-red-400">
                    Risk: ${e.disruption_risk_pct}%
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          ${filteredEntities.length > 15 ? `
            <div class="text-center pt-4 text-xs text-slate-500">
              Showing 15 of ${filteredEntities.length} active digital twin entities. Select different categories to inspect specific sectors.
            </div>
          ` : ''}
        </section>

      </main>

    </div>
  `;
}

// ==============================================================================
// CLIENT-SIDE CONTROLLERS & MAP INITIALIZATION HANDLERS
// ==============================================================================

window.initWeatherDigitalTwin = async function () {
  const state = store.getState();
  const destId = state.weatherTwinDestinationId || 1;

  try {
    let needsUpdate = false;
    const updates = {};

    // 1. Fetch destination options if not yet loaded
    if (!state.weatherTwinDestinations || state.weatherTwinDestinations.length === 0) {
      const destResp = await api.getDigitalTwinDestinations().catch(() => null);
      if (destResp && destResp.destinations) {
        updates.weatherTwinDestinations = destResp.destinations;
        needsUpdate = true;
      }
    }

    // 2. Fetch baseline digital twin state for destination if not yet loaded
    if (!state.weatherTwinData || (state.weatherTwinData.destination && state.weatherTwinData.destination.id !== destId)) {
      const twinResp = await api.getDigitalTwinState(destId).catch(() => null);
      if (twinResp && twinResp.digital_twin) {
        updates.weatherTwinData = twinResp.digital_twin;
        updates.weatherTwinDestinationId = destId;
        updates.weatherTwinViewMode = 'live';
        updates.weatherTwinSimResult = null;
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      store.setState(updates);
    } else {
      window.mountWeatherTwinMap();
    }
  } catch (err) {
    console.error('Error initializing weather digital twin:', err);
  }
};

window.mountWeatherTwinMap = function () {
  const mapContainer = document.getElementById('weather-twin-map');
  if (!mapContainer || !window.L) return;

  const state = store.getState();
  const viewMode = state.weatherTwinViewMode || 'live';
  const activeState = (viewMode === 'scenario' && state.weatherTwinSimResult)
    ? state.weatherTwinSimResult.simulated_state
    : state.weatherTwinData;

  if (!activeState) return;

  const dest = activeState.destination || { lat: 15.2993, lng: 74.1240, name: 'Goa' };
  const entities = activeState.entities || [];
  const weather = activeState.weather_state || {};

  // Safely clean up previous Leaflet instance
  if (digitalTwinMap) {
    try {
      digitalTwinMap.remove();
    } catch (e) {}
    digitalTwinMap = null;
    twinMarkers = [];
    weatherRadarCircle = null;
  }
  if (mapContainer._leaflet_id) {
    mapContainer._leaflet_id = null;
  }

  try {
    // Create Leaflet Map centered on destination
    digitalTwinMap = window.L.map('weather-twin-map', {
      center: [dest.lat, dest.lng],
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: false
    });

    // Base Map Tiles (Using standard OpenStreetMap - free, reliable, no API key required)
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    window.L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(digitalTwinMap);

    // Invalidate size to guarantee tile rendering without grey edges
    setTimeout(() => {
      if (digitalTwinMap) digitalTwinMap.invalidateSize();
    }, 200);

    // Atmospheric Radar Pulse Circle around destination
    const rain = Number(weather.precipitation_mm || 0);
    const radarColor = rain > 30 ? '#e11d48' : (rain > 10 ? '#f59e0b' : '#0ea5e9');
    weatherRadarCircle = window.L.circle([dest.lat, dest.lng], {
      color: radarColor,
      fillColor: radarColor,
      fillOpacity: 0.12,
      radius: 7500,
      weight: 2,
      dashArray: '6, 6'
    }).addTo(digitalTwinMap);

    // Plot Destination Entities as Color-Coded Pins
    entities.forEach(ent => {
      if (!ent.lat || !ent.lng) return;

      const isSuspended = ent.status === 'suspended';
      const isRestricted = ent.status === 'restricted';
      const isAdvisory = ent.status === 'advisory';

      const pinBg = isSuspended ? '#e11d48' : (isRestricted ? '#f59e0b' : (isAdvisory ? '#eab308' : '#10b981'));

      const pinHtml = `
        <div style="background:${pinBg}; width:32px; height:32px; border-radius:50%; border:2px solid white; box-shadow:0 3px 12px rgba(0,0,0,0.35); display:flex; align-items:center; justify-content:center; color:white; font-size:12px; font-weight:800; transform:translate(-16px, -16px);">
          ${isSuspended ? '!' : (isRestricted ? '&bull;' : '&checkmark;')}
        </div>
      `;

      const customIcon = window.L.divIcon({
        className: 'twin-pin-marker',
        html: pinHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = window.L.marker([ent.lat, ent.lng], { icon: customIcon }).addTo(digitalTwinMap);

      // Interactive popup
      marker.bindPopup(`
        <div style="font-family:'Plus Jakarta Sans',sans-serif; min-width:210px; padding:4px;">
          <div style="font-size:11px; font-weight:800; text-transform:uppercase; color:${pinBg}; margin-bottom:2px;">
            ${ent.status.toUpperCase()} &bull; ${ent.category || ent.entity_type}
          </div>
          <div style="font-size:13px; font-weight:800; color:#0f172a; margin-bottom:4px;">
            ${ent.name}
          </div>
          <div style="font-size:11px; color:#64748b; line-height:1.4; margin-bottom:6px;">
            ${ent.impact_reason}
          </div>
          <div style="display:flex; justify-content:space-between; font-size:11px; border-top:1px solid #e2e8f0; padding-top:4px;">
            <span>Capacity: <strong>${ent.simulated_capacity ?? 100}%</strong></span>
            <span style="color:#810B38; font-weight:bold;">Risk: ${ent.disruption_risk_pct}%</span>
          </div>
        </div>
      `);

      twinMarkers.push(marker);
    });
  } catch (mapErr) {
    console.warn('Map initialization caught non-fatal warning:', mapErr);
  }
};

window.handleTwinDestinationChange = async function (destIdVal) {
  const destId = parseInt(destIdVal, 10);
  store.setState({ 
    weatherTwinDestinationId: destId,
    weatherTwinViewMode: 'live',
    weatherTwinSimResult: null
  });

  try {
    const resp = await api.getDigitalTwinState(destId);
    if (resp && resp.digital_twin) {
      store.setState({ 
        weatherTwinData: resp.digital_twin,
        weatherTwinDestinationId: destId
      });
      setTimeout(() => {
        window.mountWeatherTwinMap();
      }, 100);
    }
  } catch (err) {
    console.error('Error switching destination:', err);
  }
};


window.toggleWeatherTwinViewMode = function (mode) {
  store.setState({ weatherTwinViewMode: mode });
  setTimeout(() => window.mountWeatherTwinMap(), 50);
};

window.runWeatherTwinSimulation = async function () {
  const state = store.getState();
  const destId = state.weatherTwinDestinationId || 1;

  const rainEl = document.getElementById('twin-slider-rain');
  const windEl = document.getElementById('twin-slider-wind');
  const tempEl = document.getElementById('twin-slider-temp');
  const durEl = document.getElementById('twin-slider-dur');

  const simParams = {
    rainfall_mm_h: rainEl ? parseFloat(rainEl.value) : 25.0,
    wind_speed_kmh: windEl ? parseFloat(windEl.value) : 35.0,
    temperature_c: tempEl ? parseFloat(tempEl.value) : 28.0,
    storm_duration_h: durEl ? parseFloat(durEl.value) : 4.0
  };

  store.setState({ weatherTwinSimParams: simParams });

  const btn = document.getElementById('twin-run-sim-btn');
  if (btn) btn.innerHTML = '<span class="inline-block animate-spin mr-2">&circlearrowright;</span> Propagating Digital Twin...';

  try {
    const payload = {
      destination_id: destId,
      ...simParams
    };
    const result = await api.simulateDigitalTwin(payload);
    if (result && result.success) {
      store.setState({
        weatherTwinSimResult: result,
        weatherTwinViewMode: 'scenario'
      });
      store.addToast('What-If Scenario propagated across Digital Twin ecosystem.', 'success');
      setTimeout(() => window.mountWeatherTwinMap(), 60);
    }
  } catch (err) {
    store.addToast('Simulation error: ' + (err.message || 'Failed to run'), 'critical');
  } finally {
    if (btn) btn.innerHTML = '<i data-lucide="play" class="w-4 h-4 fill-white"></i><span>Execute What-If Propagation Engine</span>';
    if (window.lucide) window.lucide.createIcons();
  }
};

window.resetWeatherTwinToLive = function () {
  store.setState({
    weatherTwinViewMode: 'live',
    weatherTwinSimResult: null,
    weatherTwinSimParams: {
      rainfall_mm_h: 0.0,
      temperature_c: 28.0,
      wind_speed_kmh: 12.0,
      storm_duration_h: 0.0
    }
  });
  store.addToast('Reset to Live Weather Telemetry baseline.', 'info');
  setTimeout(() => window.mountWeatherTwinMap(), 50);
};

window.applyWeatherTwinPreset = function (preset) {
  let params = { rainfall_mm_h: 0, temperature_c: 28, wind_speed_kmh: 10, storm_duration_h: 0 };
  
  if (preset === 'monsoon') {
    params = { rainfall_mm_h: 28, temperature_c: 26, wind_speed_kmh: 38, storm_duration_h: 5 };
  } else if (preset === 'cyclone') {
    params = { rainfall_mm_h: 55, temperature_c: 24, wind_speed_kmh: 68, storm_duration_h: 8 };
  } else if (preset === 'heatwave') {
    params = { rainfall_mm_h: 0, temperature_c: 42, wind_speed_kmh: 18, storm_duration_h: 0 };
  } else if (preset === 'clear') {
    params = { rainfall_mm_h: 0, temperature_c: 27, wind_speed_kmh: 12, storm_duration_h: 0 };
  }

  // Update slider UI
  const rainEl = document.getElementById('twin-slider-rain');
  const windEl = document.getElementById('twin-slider-wind');
  const tempEl = document.getElementById('twin-slider-temp');
  const durEl = document.getElementById('twin-slider-dur');

  if (rainEl) rainEl.value = params.rainfall_mm_h;
  if (windEl) windEl.value = params.wind_speed_kmh;
  if (tempEl) tempEl.value = params.temperature_c;
  if (durEl) durEl.value = params.storm_duration_h;

  const rVal = document.getElementById('twin-val-rain');
  const wVal = document.getElementById('twin-val-wind');
  const tVal = document.getElementById('twin-val-temp');
  const dVal = document.getElementById('twin-val-dur');

  if (rVal) rVal.innerText = params.rainfall_mm_h + ' mm/h';
  if (wVal) wVal.innerText = params.wind_speed_kmh + ' km/h';
  if (tVal) tVal.innerText = params.temperature_c + ' °C';
  if (dVal) dVal.innerText = params.storm_duration_h + ' hrs';

  store.setState({ weatherTwinSimParams: params });
  window.runWeatherTwinSimulation();
};

window.filterWeatherTwinEntities = function (filterType) {
  store.setState({ weatherTwinFilterType: filterType });
};
