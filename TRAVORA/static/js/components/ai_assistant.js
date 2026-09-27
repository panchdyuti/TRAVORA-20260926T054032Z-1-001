import { store } from '../store.js';
import { api } from '../api.js';

export function renderAIAssistant() {
  const state = store.getState();
  const role = state.activeRole || (state.user ? state.user.role : 'traveler');

  // Only show chatbot on Traveller Platform views (Personal Dashboard, Itinerary, Trip Planner, Live Tracker, My Trips, etc.)
  // Hide on Landing page, Operator views, Corporate Travel, and Admin views
  const isOperatorView = state.currentView && state.currentView.startsWith('operator');
  const isCorporateView = state.currentView === 'business_operator';
  const isAdminView = state.currentView === 'admin_dash';
  const isLandingView = state.currentView === 'landing' || !state.currentView;

  if (role !== 'traveler' || isLandingView || isOperatorView || isCorporateView || isAdminView) {
    return '';
  }

  const userName = (state.user && state.user.name) ? state.user.name.split(' ')[0] : 'Traveler';
  const currentTour = state.currentTour;
  const tourCode = currentTour ? currentTour.code : 'TR1024';
  const destName = (currentTour && currentTour.destination) ? currentTour.destination.name : 'Incredible India';

  return `
    <!-- FLOATING TOGGLE BUTTON -->
    <div class="fixed bottom-6 right-6 z-40">
      <button 
        id="ai-assistant-toggle"
        onclick="window.toggleAIAssistantDrawer()"
        class="group relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#810B38] via-[#ea2330] to-amber-500 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/30 cursor-pointer"
        title="Ask TRAVORA AI: FAQs, Live Weather, Bookings & Emergency SOS">
        <i data-lucide="sparkles" class="w-6 h-6 animate-spin-slow group-hover:rotate-45 transition"></i>
        <span class="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900 flex items-center justify-center">
          <span class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
        </span>
      </button>
    </div>

    <!-- FLOATING CHAT DRAWER (INTEGRATED COPILOT) -->
    <div id="ai-chat-drawer" class="hidden fixed bottom-24 right-4 sm:right-6 z-40 w-[420px] max-w-[calc(100vw-2rem)] surface-card rounded-3xl shadow-2xl border border-red-500/30 flex flex-col h-[600px] max-h-[85vh] overflow-hidden modal-content">
      
      <!-- CHAT HEADER -->
      <div class="p-4 bg-gradient-to-r from-[#541A1A] via-[#810B38] to-[#ea2330] text-white flex items-center justify-between shrink-0 shadow-md">
        <div class="flex items-center space-x-2.5">
          <div class="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold shadow-inner">
            <i data-lucide="bot" class="w-5 h-5 text-amber-300"></i>
          </div>
          <div>
            <div class="font-extrabold text-sm leading-tight flex items-center space-x-1.5">
              <span>TRAVORA AI Assistant</span>
              <span class="px-1.5 py-0.2 rounded text-[8.5px] font-black uppercase bg-emerald-500 text-white">Live 24/7</span>
            </div>
            <div class="text-[10px] text-amber-200/90 font-medium">FAQ • SOS • Weather • Bookings • Planner</div>
          </div>
        </div>
        <div class="flex items-center space-x-1">
          <button onclick="window.clearAIChat()" class="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition" title="Clear Chat History">
            <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
          </button>
          <button onclick="window.toggleAIAssistantDrawer()" class="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
      </div>

      <!-- TOP INTERACTIVE SERVICES BAR -->
      <div class="grid grid-cols-5 text-center text-[10px] font-bold border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 shrink-0">
        <button onclick="window.sendAIPrompt('Top FAQs about cancellation, baggage and check-in')" class="py-2 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 transition flex flex-col items-center">
          <i data-lucide="help-circle" class="w-3.5 h-3.5 mb-0.5 text-amber-500"></i>
          <span>FAQs</span>
        </button>
        <button onclick="window.sendAIPrompt('Emergency operator contact and coordinator phone number')" class="py-2 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 transition flex flex-col items-center">
          <i data-lucide="phone-call" class="w-3.5 h-3.5 mb-0.5 text-red-500"></i>
          <span>SOS / Help</span>
        </button>
        <button onclick="window.sendAIPrompt('Show my recent bookings and trip vouchers')" class="py-2 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 transition flex flex-col items-center">
          <i data-lucide="ticket" class="w-3.5 h-3.5 mb-0.5 text-emerald-500"></i>
          <span>Bookings</span>
        </button>
        <button onclick="window.sendAIPrompt('Live weather and travel safety forecast for ${destName}')" class="py-2 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 transition flex flex-col items-center">
          <i data-lucide="cloud-sun" class="w-3.5 h-3.5 mb-0.5 text-sky-500"></i>
          <span>Weather</span>
        </button>
        <button onclick="window.sendAIPrompt('Quick AI 3-day itinerary planner for ${destName}')" class="py-2 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition flex flex-col items-center">
          <i data-lucide="sparkles" class="w-3.5 h-3.5 mb-0.5 text-purple-500"></i>
          <span>Planner</span>
        </button>
      </div>

      <!-- CHAT MESSAGES STREAM -->
      <div id="ai-chat-messages" class="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
        
        <!-- INITIAL BOT WELCOME CARD -->
        <div class="flex items-start space-x-2">
          <div class="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#810B38] to-[#ea2330] text-white flex items-center justify-center shrink-0 text-xs font-black shadow-sm">
            AI
          </div>
          <div class="p-3.5 rounded-2xl rounded-tl-none bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 space-y-2 max-w-[90%] border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
            <p class="leading-relaxed">
              Namaste <strong>${userName}</strong>! I am your <strong>TRAVORA Copilot</strong>. How can I help you today?
            </p>

            <!-- 6 Interactive Quick Capability Grid -->
            <div class="grid grid-cols-2 gap-1.5 pt-1">
              <button onclick="window.sendAIPrompt('What is the cancellation and refund policy?')" class="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-red-500 text-left transition flex items-center space-x-1.5">
                <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-500 shrink-0"></i>
                <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">100% Refund FAQ</span>
              </button>

              <button onclick="window.sendAIPrompt('Contact 24/7 emergency coordinator hotline')" class="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-red-500 text-left transition flex items-center space-x-1.5">
                <i data-lucide="phone-call" class="w-3.5 h-3.5 text-red-500 shrink-0"></i>
                <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">Emergency SOS</span>
              </button>

              <button onclick="window.sendAIPrompt('Show my recent bookings and active tours')" class="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-red-500 text-left transition flex items-center space-x-1.5">
                <i data-lucide="ticket" class="w-3.5 h-3.5 text-blue-500 shrink-0"></i>
                <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">My Recent Trips</span>
              </button>

              <button onclick="window.sendAIPrompt('Live weather and storm forecast for ${destName}')" class="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-red-500 text-left transition flex items-center space-x-1.5">
                <i data-lucide="cloud-lightning" class="w-3.5 h-3.5 text-amber-500 shrink-0"></i>
                <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">Live Weather</span>
              </button>

              <button onclick="window.sendAIPrompt('Plan a 3-day itinerary for Jaipur with budget')" class="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-red-500 text-left transition flex items-center space-x-1.5">
                <i data-lucide="sparkles" class="w-3.5 h-3.5 text-purple-500 shrink-0"></i>
                <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">Quick AI Planner</span>
              </button>

              <button onclick="window.sendAIPrompt('I want to leave feedback for my trip experience')" class="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-red-500 text-left transition flex items-center space-x-1.5">
                <i data-lucide="star" class="w-3.5 h-3.5 text-amber-400 shrink-0"></i>
                <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">Share Feedback</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- QUICK ACTION SCROLLABLE CHIPS -->
      <div class="px-3 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 overflow-x-auto whitespace-nowrap space-x-1.5 shrink-0 scrollbar-none">
        <button onclick="window.sendAIPrompt('What is the baggage limit and hotel check-in time?')" class="copilot-action-pill px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
          ❓ Baggage & Check-in FAQ
        </button>
        <button onclick="window.sendAIPrompt('Emergency operator coordinator contact number')" class="copilot-action-pill px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-red-500/10 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 border border-red-500/20">
          📞 24/7 SOS (+91 98765 43210)
        </button>
        <button onclick="window.sendAIPrompt('Show my recent bookings')" class="copilot-action-pill px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-emerald-500/10 hover:bg-emerald-600 hover:text-white text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          🎫 My Bookings
        </button>
        <button onclick="window.sendAIPrompt('Live weather and climate status in Jaipur')" class="copilot-action-pill px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-sky-500/10 hover:bg-sky-600 hover:text-white text-sky-600 dark:text-sky-400 border border-sky-500/20">
          🌦️ Live Weather
        </button>
        <button onclick="window.sendAIPrompt('Plan a 3-day luxury tour to Jaipur')" class="copilot-action-pill px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-purple-500/10 hover:bg-purple-600 hover:text-white text-purple-600 dark:text-purple-400 border border-purple-500/20">
          ✨ Quick AI Planner
        </button>
        <button onclick="window.sendAIPrompt('Great trip experience! Rating 5 stars')" class="copilot-action-pill px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-amber-500/10 hover:bg-amber-600 hover:text-slate-900 text-amber-700 dark:text-amber-300 border border-amber-500/20">
          ⭐ Leave Feedback
        </button>
        <button onclick="window.sendAIPrompt('Make my trip cheaper and save budget')" class="copilot-action-pill px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-teal-500/10 hover:bg-teal-600 hover:text-white text-teal-600 dark:text-teal-400 border border-teal-500/20">
          💰 Save Rs 2,000+
        </button>
      </div>

      <!-- INPUT BAR -->
      <form onsubmit="window.handleAIChatSubmit(event)" class="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center space-x-2 shrink-0">
        <input 
          type="text" 
          id="ai-chat-input"
          placeholder="Ask FAQ, Weather, Emergency, Bookings..." 
          class="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ea2330]"
        />
        <button 
          type="submit" 
          class="p-2.5 rounded-xl bg-gradient-to-r from-[#810B38] to-[#ea2330] hover:opacity-90 text-white shadow-md transition flex items-center justify-center shrink-0">
          <i data-lucide="send" class="w-4 h-4"></i>
        </button>
      </form>

    </div>
  `;
}
