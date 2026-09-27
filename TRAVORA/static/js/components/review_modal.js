import { store } from '../store.js';

export function renderReviewModal() {
  const state = store.getState();
  if (!state.isReviewModalOpen) return '';

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div class="surface-card rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 modal-content">
        
        <div class="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <i data-lucide="star" class="w-5 h-5 fill-amber-500"></i>
            </div>
            <div>
              <h3 class="font-extrabold text-lg text-slate-900 dark:text-white">
                Review Your Goa Journey
              </h3>
              <p class="text-xs text-slate-400">Rate your experience across all journey dimensions</p>
            </div>
          </div>
          <button onclick="window.closeReviewModal()" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- RATING DIMENSIONS -->
        <form onsubmit="window.handleReviewSubmit(event)" class="space-y-4 text-xs">
          
          <div class="space-y-2">
            <div class="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
              <span>Overall Experience & Adaptability</span>
              <span class="text-amber-500 font-bold">5.0 / 5.0</span>
            </div>
            <input type="range" min="1" max="5" step="0.5" value="5" class="w-full" />
          </div>

          <div class="space-y-2">
            <div class="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
              <span>Hotel & Room Quality</span>
              <span class="text-amber-500 font-bold">4.8 / 5.0</span>
            </div>
            <input type="range" min="1" max="5" step="0.5" value="5" class="w-full" />
          </div>

          <div class="space-y-2">
            <div class="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
              <span>Watersports & Scuba Activities</span>
              <span class="text-amber-500 font-bold">5.0 / 5.0</span>
            </div>
            <input type="range" min="1" max="5" step="0.5" value="5" class="w-full" />
          </div>

          <div class="space-y-2">
            <div class="flex justify-between font-semibold text-slate-700 dark:text-slate-300">
              <span>On-Ground Operator Support</span>
              <span class="text-amber-500 font-bold">5.0 / 5.0</span>
            </div>
            <input type="range" min="1" max="5" step="0.5" value="5" class="w-full" />
          </div>

          <div class="space-y-1.5 pt-1">
            <label class="block font-bold text-slate-700 dark:text-slate-300">
              Written Testimonial
            </label>
            <textarea 
              rows="3" 
              placeholder="Tell other travelers about your dynamic experience with TRAVORA..."
              class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              required>When our initial hotel had an inventory clash on Day 2, TRAVORA instantly replaced it with Hotel Paradise Goa (250m from Baga Beach) without delaying our scuba session. Exceptional adaptation!</textarea>
          </div>

          <div class="pt-3">
            <button 
              type="submit" 
              class="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold shadow-md transition">
              Submit Review
            </button>
          </div>

        </form>

      </div>
    </div>
  `;
}
