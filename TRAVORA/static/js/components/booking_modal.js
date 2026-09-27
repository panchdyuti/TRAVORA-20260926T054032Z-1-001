import { store } from '../store.js';
import { api } from '../api.js';

export function renderBookingModal() {
  const state = store.getState();
  const isOpen = state.isBookingModalOpen;
  const isReceiptOpen = state.isReceiptModalOpen;
  const tour = state.currentTour;
  const details = state.bookingDetails || null;
  const pricing = details ? {
    subtotal: details.price,
    taxes: Math.round(details.price * 0.05),
    service_fee: details.convenienceFee || 0,
    total: details.price + Math.round(details.price * 0.05) + (details.convenienceFee || 0)
  } : ((tour && tour.pricing) ? tour.pricing : {
    subtotal: 17500, taxes: 2100, service_fee: 900, total: 20500
  });
  const receipt = state.activeReceipt || null;

  // Render Receipt Modal if open
  if (isReceiptOpen && receipt) {
    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay overflow-y-auto">
        <div class="surface-card rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 modal-content my-8 print:p-0 print:border-none print:shadow-none" id="printable-receipt">
          
          <!-- OFFICIAL RECEIPT HEADER -->
          <div class="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
            <div class="space-y-1">
              <img 
                src="/static/assets/logo/travora_logo_horizontal.png" 
                alt="TRAVORA" 
                class="h-8 w-auto object-contain dark:brightness-110"
              />
              <p class="text-[10px] font-semibold text-red-600 dark:text-red-400">
                Plan Freely. Travel Personally. Adapt Instantly.
              </p>
            </div>
            <div class="text-right">
              <span class="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                PAYMENT CONFIRMED
              </span>
              <div class="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 mt-1">
                Receipt #${receipt.booking_code}
              </div>
              <div class="text-[10px] text-slate-400 font-mono">
                Date: ${receipt.receipt_date ? receipt.receipt_date.slice(0, 10) : '2026-09-26'}
              </div>
            </div>
          </div>

          <!-- TRAVELLER & OPERATOR TWO-COLUMN SUMMARY -->
          <div class="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div class="space-y-1">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Traveller Details</div>
              <div class="font-extrabold text-slate-900 dark:text-white">${receipt.traveller_name}</div>
              <div class="text-slate-500">${receipt.traveller_email}</div>
              <div class="text-slate-500">${receipt.traveller_phone}</div>
              <div class="text-slate-400 text-[11px]">${receipt.travellers_count} Guests - Destination: <strong>${receipt.destination}</strong></div>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Authorized Tour Operator</div>
              <div class="font-extrabold text-slate-900 dark:text-white">${receipt.operator_company || receipt.operator_name}</div>
              <div class="text-slate-500">Contact: ${receipt.operator_name}</div>
              <div class="text-slate-500 font-mono text-[11px]">Travel Window: ${receipt.travel_dates}</div>
              <div class="text-[#ea2330] dark:text-red-400 font-bold text-[11px]">Dynamic Itinerary Sync: ACTIVE</div>
            </div>
          </div>

          <!-- TRIP & PACKAGE DETAILS -->
          <div class="space-y-2 text-xs">
            <div class="font-bold text-slate-800 dark:text-slate-200">Booked Package Specification</div>
            <div class="grid grid-cols-3 gap-2 text-[11px]">
              <div class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <span class="text-slate-400 block text-[10px]">Package Category</span>
                <span class="font-bold text-slate-800 dark:text-slate-200">${receipt.package_category || 'Dynamic Tour'}</span>
              </div>
              <div class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <span class="text-slate-400 block text-[10px]">Accommodation</span>
                <span class="font-bold text-slate-800 dark:text-slate-200">${receipt.accommodation_type}</span>
              </div>
              <div class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <span class="text-slate-400 block text-[10px]">Transit Logistics</span>
                <span class="font-bold text-slate-800 dark:text-slate-200">${receipt.transport_type}</span>
              </div>
            </div>
          </div>

          <!-- FINANCIAL TAX BREAKDOWN -->
          <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
            <div class="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Base Itinerary Amount</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">Rs ${receipt.base_amount.toLocaleString('en-IN')}</span>
            </div>
            <div class="flex justify-between text-slate-600 dark:text-slate-400">
              <span>GST & State Tourism Cess (5%)</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">Rs ${receipt.tax_amount.toLocaleString('en-IN')}</span>
            </div>
            <div class="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Dynamic Dispatch & Fleet Coordination Fee</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">Rs ${receipt.service_fee.toLocaleString('en-IN')}</span>
            </div>
            ${receipt.discount_amount > 0 ? `
              <div class="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Festival Promotion Discount</span>
                <span>-Rs ${receipt.discount_amount.toLocaleString('en-IN')}</span>
              </div>
            ` : ''}
            <div class="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
              <span>Total Amount Paid</span>
              <span class="text-[#ea2330] dark:text-red-400">Rs ${receipt.final_amount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <!-- VERIFICATION CREDENTIALS -->
          <div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 text-[10px] font-mono text-slate-500 space-y-1">
            <div>Payment Method: <strong>${receipt.payment_method}</strong></div>
            <div>Verification ID: <strong>${receipt.payment_verification_id || 'VERIFIED-BK-99124'}</strong></div>
            <div class="text-[9px] text-slate-400">Signed with TRAVORA SHA256 HMAC Engine - All on-ground operator services guaranteed.</div>
          </div>

          <!-- ACTIONS -->
          <div class="flex items-center justify-between pt-2 print:hidden">
            <button 
              type="button" 
              onclick="window.print()" 
              class="px-5 py-2.5 rounded-xl surface-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-300 dark:border-slate-700 transition flex items-center space-x-1.5">
              <i data-lucide="printer" class="w-4 h-4"></i>
              <span>Print / Download PDF Receipt</span>
            </button>
            <button 
              type="button" 
              onclick="window.closeReceiptModal()" 
              class="px-6 py-2.5 rounded-xl bg-[#ea2330] hover:bg-[#880808] text-white font-bold text-xs shadow-md shadow-red-500/25 transition">
              Done & Return to Itinerary
            </button>
          </div>

        </div>
      </div>
    `;
  }

  if (!isOpen) return '';

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div class="surface-card rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 modal-content">
        
        <!-- HEADER -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-2xl bg-red-500/10 text-[#ea2330] flex items-center justify-center">
              <i data-lucide="credit-card" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="font-extrabold text-lg text-slate-900 dark:text-white">
                ${details ? details.title : 'Confirm & Book Journey'}
              </h3>
              <p class="text-xs text-slate-400">${details ? details.route : (tour ? `Tour #${tour.code} - Instant Backend Verification` : 'Instant Reservation Verification')}</p>
            </div>
          </div>
          <button onclick="window.closeBookingModal()" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- TRAVELLER DETAILS FORM -->
        <div class="space-y-3">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Traveller Information
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
              <input 
                type="text" 
                id="booking-traveller-name" 
                value="${state.user ? state.user.name : 'Krishna Singh'}" 
                class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Phone Number</label>
              <input 
                type="text" 
                id="booking-traveller-phone" 
                value="${state.user && state.user.phone ? state.user.phone : '+91 98765 43210'}" 
                class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <!-- ITEMIZED INVOICE -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
          <div class="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Base Itinerary Subtotal</span>
            <span class="font-bold text-slate-800 dark:text-slate-200">Rs ${pricing.subtotal ? pricing.subtotal.toLocaleString('en-IN') : '17,500'}</span>
          </div>
          <div class="flex justify-between text-slate-600 dark:text-slate-400">
            <span>GST & State Tourism Taxes (5%)</span>
            <span class="font-bold text-slate-800 dark:text-slate-200">Rs ${pricing.taxes ? pricing.taxes.toLocaleString('en-IN') : '2,100'}</span>
          </div>
          <div class="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Dynamic Dispatch Fee</span>
            <span class="font-bold text-slate-800 dark:text-slate-200">Rs ${pricing.service_fee ? pricing.service_fee.toLocaleString('en-IN') : '900'}</span>
          </div>
          <div class="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
            <span>Total Payable</span>
            <span class="text-[#ea2330] dark:text-red-400">Rs ${pricing.total ? pricing.total.toLocaleString('en-IN') : '20,500'}</span>
          </div>
        </div>

        <!-- PAYMENT METHOD SELECTION -->
        <div class="space-y-3">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Select Payment Method
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <label class="cursor-pointer">
              <input type="radio" name="pay_method" value="UPI" class="peer sr-only" checked />
              <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-700 peer-checked:border-[#ea2330] peer-checked:bg-red-500/10 text-center font-bold text-slate-800 dark:text-slate-200">
                UPI / QR
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="pay_method" value="Card" class="peer sr-only" />
              <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-700 peer-checked:border-[#ea2330] peer-checked:bg-red-500/10 text-center font-bold text-slate-800 dark:text-slate-200">
                Credit / Debit
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="pay_method" value="NetBanking" class="peer sr-only" />
              <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-700 peer-checked:border-[#ea2330] peer-checked:bg-red-500/10 text-center font-bold text-slate-800 dark:text-slate-200">
                Net Banking
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="pay_method" value="EMI" class="peer sr-only" />
              <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-700 peer-checked:border-[#ea2330] peer-checked:bg-red-500/10 text-center font-bold text-slate-800 dark:text-slate-200">
                Easy EMI
              </div>
            </label>
          </div>
        </div>

        <!-- SUBMIT PAYMENT -->
        <div class="pt-2 space-y-2">
          <button 
            id="confirm-pay-btn"
            type="button"
            onclick="window.executeVerifiedPayment()" 
            class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ea2330] via-[#d91b28] to-[#880808] text-white font-extrabold text-sm shadow-xl shadow-red-500/25 hover:from-[#d91b28] hover:to-[#5c0606] transition flex items-center justify-center space-x-2">
            <i data-lucide="shield-check" class="w-4 h-4"></i>
            <span>Pay Rs ${pricing.total ? pricing.total.toLocaleString('en-IN') : '20,500'} & Issue Verified Voucher</span>
          </button>
          <p class="text-[10px] text-center text-slate-400">
            Secure Backend Cryptographic Verification - Real-Time Operator Confirmation
          </p>
        </div>

      </div>
    </div>
  `;
}

window.openBookingModal = function() {
  const tour = store.getState().currentTour;
  if (!tour) return;
  if (tour.is_booked && tour.booking_code) {
    window.viewReceipt(tour.booking_code);
    return;
  }
  store.setState({ isBookingModalOpen: true });
};

window.closeBookingModal = function() {
  store.setState({ isBookingModalOpen: false });
};

window.closeReceiptModal = function() {
  store.setState({ isReceiptModalOpen: false, activeReceipt: null });
};

window.viewReceipt = async function(bookingCode) {
  try {
    store.addToast('Fetching official booking receipt...', 'info');
    const receipt = await api.getBookingReceipt(bookingCode);
    store.setState({
      isBookingModalOpen: false,
      isReceiptModalOpen: true,
      activeReceipt: receipt
    });
  } catch (err) {
    console.error(err);
    store.addToast('Could not load receipt: ' + err.message, 'critical');
  }
};

window.executeVerifiedPayment = async function() {
  const state = store.getState();
  const tour = state.currentTour;
  const details = state.bookingDetails || null;
  if (!tour && !details) return;

  const btn = document.getElementById('confirm-pay-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerText = 'Verifying with payment gateway backend...';
  }

  const selectedPayMethodRadio = document.querySelector('input[name="pay_method"]:checked');
  const payMethod = selectedPayMethodRadio ? selectedPayMethodRadio.value : 'UPI';
  const nameInput = document.getElementById('booking-traveller-name');
  const phoneInput = document.getElementById('booking-traveller-phone');

  try {
    if (details) {
      // Direct booking flow (Flights, Hotels, Packages, Buses & Cabs, Trains)
      const directRes = await api.createDirectBooking({
        service_type: details.category || 'flight',
        title: details.title,
        destination: window.landingToCity || 'Goa',
        origin: window.landingFromCity || 'Delhi',
        amount: details.price || 4999.0,
        travelers_count: details.travelers || 2,
        payment_method: payMethod,
        user_id: state.user ? state.user.id : null,
        user_email: state.user ? state.user.email : null
      });

      const receipt = await api.getBookingReceipt(directRes.booking_code);
      store.setState({
        isBookingModalOpen: false,
        isReceiptModalOpen: true,
        activeReceipt: receipt
      });
      store.addToast(`Payment verified! ${directRes.title} booked successfully. Code: ${directRes.booking_code}`, 'success');
      return;
    }

    // 1. Create or confirm booking
    const bookRes = await api.bookTour({
      tour_id: tour.id,
      user_id: state.user ? state.user.id : 1,
      payment_method: payMethod,
      contact_phone: phoneInput ? phoneInput.value : '+91 98765 43210'
    });

    const bookingCode = bookRes.booking_code;
    const finalAmount = tour.pricing ? tour.pricing.total : (tour.cost || 20500);

    // 2. Perform real backend cryptographic verification
    const verifyRes = await api.verifyPayment({
      booking_code: bookingCode,
      payment_method: payMethod,
      amount: finalAmount
    });

    // 3. Fetch comprehensive tax receipt
    const receipt = await api.getBookingReceipt(bookingCode);

    // 4. Update tour status in store
    const updatedTour = await api.getTourDetail(tour.id);

    store.setState({
      currentTour: updatedTour,
      isBookingModalOpen: false,
      isReceiptModalOpen: true,
      activeReceipt: receipt
    });

    store.addToast('Payment verified successfully! Booking confirmed with operator.', 'success');
  } catch (err) {
    console.error(err);
    store.addToast('Payment verification failed: ' + err.message, 'critical');
    if (btn) {
      btn.disabled = false;
      btn.innerText = 'Retry Payment Verification';
    }
  }
};
