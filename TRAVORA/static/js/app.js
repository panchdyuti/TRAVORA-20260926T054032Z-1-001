import { store } from './store.js';
import { api } from './api.js';

import { renderNavbar, renderDistrictCommandModal } from './components/navbar.js';
import { renderAuthView } from './components/auth_view.js';
import { renderLanding } from './components/landing.js';
import { renderTravelerDashboard } from './components/traveler_dashboard.js';
import { renderTripPlanner } from './components/trip_planner.js';
import { renderItineraryView } from './components/itinerary_view.js';
import { renderDisruptionModal } from './components/disruption_hub.js';
import { renderOperatorDashboard } from './components/operator_dashboard.js';
import { renderOperatorTourDetail } from './components/operator_tour_detail.js';
import { renderAlertCenter } from './components/alert_center.js';
import { renderVendorManagement } from './components/vendor_management.js';
import { renderAnalyticsView } from './components/analytics_view.js';
import { renderTripTracker } from './components/trip_tracker.js';
import { renderBookingModal } from './components/booking_modal.js';
import { renderReviewModal } from './components/review_modal.js';
import { renderAIAssistant } from './components/ai_assistant.js';
import { renderProfileModal } from './components/profile_modal.js';
import { renderAddExperienceModal } from './components/add_experience_modal.js';
import { renderOperatorRegistrationModal } from './components/operator_registration_modal.js';
import { renderOperatorDetailModal } from './components/operator_detail_modal.js';
import { renderAbout } from './components/about.js';
import { renderFooter } from './components/footer.js';
import { renderBusinessOperator } from './components/business_operator.js';
import { renderAdminDashboard } from './components/admin_dashboard.js';
import { renderFeedbackModal } from './components/feedback_modal.js';
import { renderLoginPopup } from './components/login_popup.js';
import { renderMyBookings } from './components/my_bookings.js';
import { renderWeatherDigitalTwin } from './components/weather_digital_twin.js';


let leafletMap = null;
let destRevenueChart = null;
let disruptionCausesChart = null;

// ==============================================================================
// AUTHENTICATION & SESSION HANDLERS
// ==============================================================================

window.setAuthRole = function (role) {
  store.setState({ authRole: role });
};

window.setAuthMode = function (mode) {
  store.setState({ authMode: mode });
};

window.replayIntro = function () {
  window.__travoraIntroPlayed = false;
  store.setState({ showSplashIntro: true });
};

window.openLoginPopup = function (mode) {
  store.setState({ isLoginPopupOpen: true, authMode: mode || 'login' });
};

window.closeLoginPopup = function () {
  const overlay = document.getElementById('login-popup-overlay');
  if (overlay) {
    overlay.classList.add('closing');
    setTimeout(() => { store.setState({ isLoginPopupOpen: false }); }, 350);
  } else {
    store.setState({ isLoginPopupOpen: false });
  }
};

window.advanceToIntroStage2 = function () {
  const stage1 = document.getElementById('intro-stage-1');
  const stage2 = document.getElementById('intro-stage-2');
  if (stage1 && stage2) {
    stage1.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    stage1.style.opacity = '0';
    stage1.style.transform = 'scale(0.92)';
    setTimeout(() => {
      stage1.classList.add('hidden');
      stage2.classList.remove('hidden');
      stage2.style.opacity = '0';
      stage2.style.transform = 'scale(1.08)';
      stage2.style.transition = 'all 0.75s cubic-bezier(0.16, 1, 0.3, 1)';
      requestAnimationFrame(() => {
        stage2.style.opacity = '1';
        stage2.style.transform = 'scale(1)';
        if (window.lucide) window.lucide.createIcons();
      });
    }, 400);
  }
};

window.dismissSplashIntro = function () {
  const overlay = document.getElementById('auth-splash-overlay');
  window.__travoraIntroPlayed = true;
  if (overlay) {
    overlay.classList.add('splash-exit');
    setTimeout(() => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      store.setState({ showSplashIntro: false });
    }, 450);
  } else {
    store.setState({ showSplashIntro: false });
  }
};

window.togglePasswordVisibility = function (inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (icon) icon.setAttribute('data-lucide', 'eye-off');
  } else {
    input.type = 'password';
    if (icon) icon.setAttribute('data-lucide', 'eye');
  }
  if (window.lucide) window.lucide.createIcons();
};

window.oneClickLogin = async function (email, password, role) {
  window.quickFillDemo(email, password, role);
  store.addToast(`Authenticating demo ${role.replace('_', ' ')}...`, 'info', 2000);
  try {
    const res = await api.login({ email, password, role });
    store.login(res.user);
    const targetView = res.user.role === 'admin' ? 'admin_dash' : 
                      (res.user.role === 'business_operator' ? 'business_operator' : 
                      (res.user.role === 'operator' ? 'operator_dash' : 'dashboard'));
    await window.navigateView(targetView);
    store.addToast(`Welcome back, ${res.user.name}!`, 'success', 4000);
  } catch (err) {
    store.addToast(err.message || 'Login failed', 'critical');
  }
};

window.quickFillDemo = function (email, password, role) {
  store.setState({ authRole: role, authMode: 'login' });
  setTimeout(() => {
    const emailEl = document.getElementById('auth-email');
    const passEl = document.getElementById('auth-password');
    if (emailEl) emailEl.value = email;
    if (passEl) passEl.value = password;
  }, 50);
};

window.handleAuthFormSubmit = async function (e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const state = store.getState();
  const mode = state.authMode || 'login';
  const role = state.authRole || 'traveler';

  const email = (formData.get('email') || '').trim();
  const password = formData.get('password') || '';
  const name = (formData.get('name') || '').trim();
  const phone = (formData.get('phone') || '').trim();
  const newPassword = formData.get('new_password') || '';
  const confirmPassword = formData.get('confirm_password') || '';

  if (mode === 'forgot') {
    if (!email) {
      store.addToast('Please enter your registered email address', 'critical');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      store.addToast('New password must be at least 4 characters long', 'critical');
      return;
    }
    if (newPassword !== confirmPassword) {
      store.addToast('New password and confirm password do not match', 'critical');
      return;
    }

    try {
      store.addToast('Verifying registered email and updating password...', 'info');
      const res = await api.resetPassword({
        email: email,
        new_password: newPassword
      });
      store.setState({ authMode: 'login' });
      store.addToast('' + res.message, 'success', 6000);
      setTimeout(() => {
        const emailEl = document.getElementById('auth-email');
        if (emailEl) emailEl.value = email;
      }, 50);
    } catch (err) {
      console.error(err);
      store.addToast(err.message || 'Failed to update password. Check registered email.', 'critical', 6000);
    }
    return;
  }

  if (!email || !password) {
    store.addToast('Please enter both email and password', 'critical');
    return;
  }

  try {
    if (mode === 'signup') {
      store.addToast('Creating your account...', 'info');
      const companyName = (formData.get('company_name') || '').trim();
      const operatingDests = (formData.get('operating_destinations') || '').trim();
      const fleetSize = (formData.get('fleet_size') || '').trim();
      const specialties = (formData.get('specialties') || '').trim();

      const res = await api.register({
        name: name || (role === 'operator' ? 'Operator Partner' : 'Traveler User'),
        email: email,
        password: password,
        role: role,
        phone: phone || '+91 98765 43210',
        company_name: companyName || undefined,
        operating_destinations: operatingDests || undefined,
        fleet_size: fleetSize || undefined,
        specialties: specialties || undefined
      });
      store.login(res.user);
      store.addToast(role === 'operator' ? 'Tour Operator Partner registered and signed in!' : 'Account registered and signed in!', 'success');
    } else {
      store.addToast('Authenticating credentials...', 'info');
      const res = await api.login({
        email: email,
        password: password,
        role: role
      });
      store.login(res.user);

      if (res.user.role === 'traveler') {
        const userTours = await api.getTours({ user_id: res.user.id }).catch(() => []);
        let activeTour = null;
        if (userTours.length > 0) {
          activeTour = await api.getTourDetail(userTours[0].id).catch(() => null);
        }
        store.setState({
          tours: userTours,
          currentTourId: activeTour ? activeTour.id : null,
          currentTour: activeTour,
          currentView: 'dashboard',
          activeRole: 'traveler',
          isLoginPopupOpen: false
        });
        await window.navigateView('dashboard');
      } else if (res.user.role === 'admin') {
        const [metrics, events, logs, corporateBookings] = await Promise.all([
          api.getAdminMetrics().catch(() => null),
          api.getAdminEvents().catch(() => []),
          api.getAdminAuditLogs().catch(() => []),
          api.getAdminCorporateBookings().catch(() => [])
        ]);
        store.setState({
          adminMetrics: metrics,
          adminEvents: events,
          adminAuditLogs: logs,
          adminCorporateBookings: corporateBookings,
          currentView: 'admin_dash',
          activeRole: 'admin',
          isLoginPopupOpen: false
        });
        await window.navigateView('admin_dash');
      } else if (res.user.role === 'business_operator') {
        const bookings = await api.getCorporateBookings().catch(() => []);
        store.setState({
          corporateBookings: bookings,
          currentView: 'business_operator',
          activeRole: 'business_operator',
          isLoginPopupOpen: false
        });
        await window.navigateView('business_operator');
      } else {
        const [allTours, opDash, opAlerts] = await Promise.all([
          api.getTours().catch(() => []),
          api.getOperatorDashboard().catch(() => null),
          api.getOperatorAlerts().catch(() => [])
        ]);
        let activeTour = null;
        if (allTours.length > 0) {
          activeTour = await api.getTourDetail(allTours[0].id).catch(() => null);
        }
        store.setState({
          tours: allTours,
          currentTourId: activeTour ? activeTour.id : null,
          currentTour: activeTour,
          operatorData: opDash,
          operatorAlerts: opAlerts,
          currentView: 'operator_dash',
          activeRole: 'operator',
          isLoginPopupOpen: false
        });
        await window.navigateView('operator_dash');
      }
    }
  } catch (err) {
    console.error(err);
    store.addToast(err.message || 'Authentication failed. Please check email and password.', 'critical', 6000);
  }
};

window.handleLogout = function () {
  store.logout();
};

window.handleDeleteAccount = async function () {
  const state = store.getState();
  const user = state.user;
  if (!user) return;

  const confirmed = confirm(`DANGER: Are you sure you want to permanently delete your account (${user.email})?\n\nAll your personalized trips, bookings, and records will be erased.\nYou will NOT be able to log in and will need to create a new account.`);
  if (!confirmed) return;

  try {
    store.addToast('Deleting your account from database...', 'info');
    const res = await api.deleteAccount({ user_id: user.id, email: user.email });

    // Clear local session storage and reset store to registration screen
    localStorage.removeItem('travora_user');
    store.setState({
      isAuthenticated: false,
      user: null,
      currentView: 'auth',
      authMode: 'signup'
    });

    store.addToast('' + res.message, 'critical', 8000);
  } catch (err) {
    console.error(err);
    store.addToast('Failed to delete account: ' + err.message, 'critical');
  }
};

window.openOperatorRegistrationModal = function () {
  store.setState({ isOperatorRegisterModalOpen: true });
};

window.closeOperatorRegistrationModal = function () {
  store.setState({ isOperatorRegisterModalOpen: false });
};

window.handleOperatorRegistrationSubmit = async function (e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const name = (formData.get('name') || '').trim();
  const companyName = (formData.get('company_name') || '').trim();
  const email = (formData.get('email') || '').trim();
  const password = formData.get('password') || '';
  const phone = (formData.get('phone') || '').trim();
  const operatingDests = (formData.get('operating_destinations') || '').trim();
  const fleetSize = (formData.get('fleet_size') || '').trim();
  const specialties = (formData.get('specialties') || '').trim();
  const bio = (formData.get('bio') || '').trim();

  if (!name || !companyName || !email || !password) {
    store.addToast('Please fill in all required fields (Name, Company, Email, Password)', 'critical');
    return;
  }

  try {
    store.addToast('Registering new verified Tour Operator...', 'info');
    const res = await api.register({
      name: name,
      email: email,
      password: password,
      role: 'operator',
      phone: phone || '+91 98765 43210',
      company_name: companyName,
      operating_destinations: operatingDests || 'Goa, Jaipur, Kerala, Manali',
      fleet_size: fleetSize || '10 Vehicles',
      specialties: specialties || 'Custom Tours, Sightseeing',
      bio: bio || `Certified Tour Operator based in ${operatingDests || 'India'}.`
    });

    const newOp = {
      id: res.user.id,
      name: res.user.name,
      company_name: res.user.company_name || companyName,
      email: res.user.email,
      phone: res.user.phone || phone,
      rating: 4.9,
      tours_completed: 25,
      fleet_size: fleetSize || '10 Vehicles',
      response_time_minutes: 3,
      badge: 'New Verified Operator',
      bio: bio || `Certified Tour Operator specializing in ${specialties || 'custom tours'}.`,
      specialties: (specialties || 'Custom Tours').split(',').map(s => s.trim()),
      operating_destinations: (operatingDests || 'Goa, Jaipur').split(',').map(d => d.trim()),
      match_score: 96,
      is_recommended: false,
      ai_recommendation_reason: `96% Match: ${companyName} just joined TRAVORA's verified network! Equipped with ${fleetSize || 'on-ground fleet'} and specialized in ${specialties || 'custom tours'}.`
    };

    // Prepend to planner operators and auto-assign if in planner
    if (window.plannerState) {
      window.plannerState.matchedOperators = [newOp, ...(window.plannerState.matchedOperators || [])];
      window.plannerState.selectedOperatorId = newOp.id;
      window.plannerState.userHasManuallySelectedOperator = true;
    }

    store.setState({ isOperatorRegisterModalOpen: false });
    store.addToast(`Welcome ${companyName}! Operator registered and assigned to your planner.`, 'success', 6000);
  } catch (err) {
    console.error(err);
    store.addToast(err.message || 'Failed to register operator', 'critical');
  }
};

window.openProfileModal = function () {
  store.setState({ isProfileModalOpen: true });
};

window.closeProfileModal = function () {
  store.setState({ isProfileModalOpen: false });
};

window.handleSaveProfile = async function (e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const state = store.getState();
  const user = state.user;
  if (!user) return;

  const name = (formData.get('name') || '').trim();
  const email = (formData.get('email') || '').trim();
  const phone = (formData.get('phone') || '').trim();
  const newPassword = formData.get('new_password') || '';
  const confirmPassword = formData.get('confirm_password') || '';

  if (!name || !email) {
    store.addToast('Name and email are required', 'critical');
    return;
  }

  if (newPassword) {
    if (newPassword.length < 4) {
      store.addToast('New password must be at least 4 characters long', 'critical');
      return;
    }
    if (newPassword !== confirmPassword) {
      store.addToast('New password and confirm password do not match', 'critical');
      return;
    }
  }

  try {
    store.addToast('Updating profile in database...', 'info');
    const res = await api.updateProfile({
      user_id: user.id,
      name: name,
      email: email,
      phone: phone,
      new_password: newPassword || undefined
    });

    // Update session store and local storage
    const updatedUser = { ...user, ...res.user };
    localStorage.setItem('travora_user', JSON.stringify(updatedUser));
    store.setState({
      user: updatedUser,
      isProfileModalOpen: false
    });

    store.addToast('' + res.message, 'success', 5000);
  } catch (err) {
    console.error(err);
    store.addToast(err.message || 'Failed to update profile', 'critical');
  }
};

window.startPlanningFor = function (destName) {
  store.setState({ currentView: 'planner' });
  setTimeout(() => {
    const radio = document.querySelector(`input[name="destination_name"][value="${destName}"]`);
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 60);
};

window.handleDeleteTour = async function (tourId, tourTitle) {
  const confirmed = confirm(`Are you sure you want to permanently delete planned itinerary:\n\n"${tourTitle}" (ID #${tourId})?\n\nThis will remove this trip from your planned records.`);
  if (!confirmed) return;

  try {
    store.addToast('Deleting planned itinerary from database...', 'info');
    const res = await api.deleteTour(tourId);

    const state = store.getState();
    const userId = state.user ? state.user.id : null;
    const userTours = userId
      ? await api.getTours({ user_id: userId }).catch(() => [])
      : await api.getTours().catch(() => []);

    let nextTour = null;
    if (userTours && userTours.length > 0) {
      nextTour = await api.getTourDetail(userTours[0].id).catch(() => null);
    }

    store.setState({
      tours: userTours,
      currentTourId: nextTour ? nextTour.id : null,
      currentTour: nextTour,
      currentView: 'dashboard'
    });

    store.addToast('' + res.message, 'success', 6000);
  } catch (err) {
    console.error(err);
    store.addToast('Failed to delete itinerary: ' + err.message, 'critical');
  }
};

// ==============================================================================
// GLOBAL NAVIGATION & UI ACTIONS
// ==============================================================================

window.openPhase = async function (phase) {
  const phaseViewMap = {
    traveler: 'landing',
    operator: 'operator_dash',
    business_operator: 'business_operator',
    admin: 'admin_dash'
  };
  const targetView = phaseViewMap[phase] || 'landing';
  const state = store.getState();

  // If user is not authenticated:
  if (!state.isAuthenticated) {
    store.setState({
      isLoginPopupOpen: true,
      authMode: 'login',
      authRole: phase
    });
    const roleName = phase === 'business_operator' ? 'Corporate' : phase.replace('_', ' ').toUpperCase();
    store.addToast(`Please sign in to access the ${roleName} portal.`, 'info', 3000);
    return;
  }

  // If user is already authenticated:
  const demoUsers = {
    traveler: { name: 'Krishna Singh', email: 'traveler@travora.demo', role: 'traveler', id: 1 },
    operator: { name: 'Aarav Mehta', email: 'operator@travora.demo', role: 'operator', id: 22, company_name: 'Goa Coastal Expeditions & Watersports' },
    business_operator: { name: 'Vikram Oberoi', email: 'corporate@travora.demo', role: 'business_operator', id: 23, company_name: 'Tata Enterprise Corporate Travel' },
    admin: { name: 'Panchdyuti Admin', email: 'admin@travora.demo', role: 'admin', id: 24, company_name: 'TRAVORA Platform Headquarters' }
  };

  const nextUser = demoUsers[phase] || { ...state.user, role: phase };
  localStorage.setItem('travora_user', JSON.stringify(nextUser));

  store.setState({
    user: nextUser,
    activeRole: phase,
    currentView: targetView
  });

  const roleName = phase === 'business_operator' ? 'Corporate' : phase.replace('_', ' ').toUpperCase();
  store.addToast(`Switched to ${roleName} phase`, 'success', 2500);
  await window.navigateView(targetView);
};

window.navigateView = async function (view, payload = {}) {
  store.navigate(view, payload);

  // Real-time bidirectional sync
  try {
    const state = store.getState();
    const user = state.user;
    const userId = user ? user.id : null;
    const isOperator = state.activeRole === 'operator' || (user && user.role === 'operator') || (view && view.startsWith('operator'));
    const isBusiness = state.activeRole === 'business_operator' || (user && user.role === 'business_operator') || view === 'business_operator';
    const isAdmin = state.activeRole === 'admin' || (user && user.role === 'admin') || view === 'admin_dash';

    const tourId = payload.tour_id || state.currentTourId;

    const [tourDetail, operatorData, operatorAlerts, tours, notifications] = await Promise.all([
      tourId ? api.getTourDetail(tourId).catch(() => null) : Promise.resolve(null),
      isOperator ? api.getOperatorDashboard(user ? user.id : undefined).catch(() => null) : Promise.resolve(null),
      isOperator ? api.getOperatorAlerts().catch(() => []) : Promise.resolve([]),
      isOperator
        ? api.getTours().catch(() => [])
        : (userId ? api.getTours({ user_id: userId }).catch(() => []) : Promise.resolve([])),
      api.getNotifications(state.activeRole, userId || 1).catch(() => [])
    ]);

    if (view === 'admin_dash' || isAdmin) {
      const [metrics, events, logs, corporateBookings] = await Promise.all([
        api.getAdminMetrics().catch(() => null),
        api.getAdminEvents().catch(() => []),
        api.getAdminAuditLogs().catch(() => []),
        api.getAdminCorporateBookings().catch(() => [])
      ]);
      store.setState({ 
        adminMetrics: metrics, 
        adminEvents: events, 
        adminAuditLogs: logs,
        adminCorporateBookings: corporateBookings 
      });
    } else if (view === 'business_operator' || isBusiness) {
      const bookings = await api.getCorporateBookings().catch(() => []);
      store.setState({ corporateBookings: bookings });
    } else if (view === 'my_bookings') {
      const userBookings = await api.getUserBookings({
        user_id: user ? user.id : undefined,
        user_email: user ? user.email : undefined
      }).catch(() => []);
      store.setState({ userBookings: userBookings });
    } else if (view === 'weather_twin') {
      const destId = payload.destination_id || state.weatherTwinDestinationId || 1;
      const [destResp, twinResp, nugenResp] = await Promise.all([
        (!state.weatherTwinDestinations || state.weatherTwinDestinations.length === 0)
          ? api.getDigitalTwinDestinations().catch(() => null)
          : Promise.resolve(null),
        (!state.weatherTwinData || state.weatherTwinData.destination.id !== destId)
          ? api.getDigitalTwinState(destId).catch(() => null)
          : Promise.resolve({ digital_twin: state.weatherTwinData }),
        (!state.nugenStatus)
          ? api.getNugenStatus().catch(() => null)
          : Promise.resolve(null)
      ]);
      const updates = {};
      if (destResp && destResp.destinations) {
        updates.weatherTwinDestinations = destResp.destinations;
      }
      if (twinResp && twinResp.digital_twin) {
        updates.weatherTwinData = twinResp.digital_twin;
        updates.weatherTwinDestinationId = destId;
      }
      if (nugenResp && nugenResp.nugen) {
        updates.nugenStatus = nugenResp.nugen;
      }
      if (Object.keys(updates).length > 0) {
        store.setState(updates);
      }
    }


    store.setState({
      currentTourId: tourDetail ? tourDetail.id : (payload.tour_id ? payload.tour_id : state.currentTourId),
      currentTour: tourDetail || (payload.tour_id ? null : store.getState().currentTour),
      operatorData: operatorData || store.getState().operatorData,
      operatorAlerts: operatorAlerts,
      tours: tours,
      notifications: notifications
    });
  } catch (e) {
    // Non-blocking sync
  }
};

window.scrollToOffersSection = async function () {
  const state = store.getState();
  if (state.currentView !== 'landing') {
    await window.navigateView('landing');
  }

  const tryScroll = (attempts = 0) => {
    const el = document.getElementById('yatra-offers-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-4', 'ring-red-500/60', 'transition-all', 'duration-500', 'rounded-3xl');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-red-500/60');
      }, 2500);
      store.addToast('Viewing Exclusive Bank & Airline Promo Offers', 'info', 3000);
    } else if (attempts < 12) {
      setTimeout(() => tryScroll(attempts + 1), 60);
    }
  };

  setTimeout(() => tryScroll(0), 80);
};

window.toggleTheme = function () {
  store.toggleTheme();
};

window.toggleNotificationsDropdown = function () {
  const dropdown = document.getElementById('notif-dropdown');
  if (dropdown) dropdown.classList.toggle('hidden');
};

window.markAllNotifsRead = async function () {
  try {
    await api.markNotificationsRead();
    const notifs = store.getState().notifications.map(n => ({ ...n, is_read: true }));
    store.setState({ notifications: notifs });
    store.addToast('All notifications marked as read', 'success');
  } catch (err) {
    console.error(err);
  }
};

window.startPlanningFor = function (destinationName) {
  store.navigate('planner');
  setTimeout(() => {
    const radio = document.querySelector(`input[name="destination_name"][value="${destinationName}"]`);
    if (radio) {
      radio.checked = true;
      radio.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
};

window.selectItineraryDay = function (day) {
  store.setState({ selectedDay: day });
};

window.openBookingModal = function () {
  store.setState({ isBookingModalOpen: true });
};

window.closeBookingModal = function () {
  store.setState({ isBookingModalOpen: false });
};

window.openReviewModal = function (tourId) {
  store.setState({ isReviewModalOpen: true });
};

window.closeReviewModal = function () {
  store.setState({ isReviewModalOpen: false });
};

window.openDisruptionModal = async function (tourId, changeEventId) {
  const state = store.getState();
  const targetTourId = tourId || state.currentTourId || 1;
  try {
    const tourDetail = await api.getTourDetail(targetTourId);
    store.setState({
      currentTourId: targetTourId,
      currentTour: tourDetail,
      activeChangeEventId: changeEventId || null,
      isDisruptionModalOpen: true
    });
  } catch (e) {
    store.setState({
      activeChangeEventId: changeEventId || null,
      isDisruptionModalOpen: true
    });
  }
};

window.closeDisruptionModal = function () {
  store.setState({
    isDisruptionModalOpen: false,
    activeChangeEventId: null
  });
};

window.setAlertFilterTab = function (tab) {
  store.setState({ alertFilterTab: tab });
};

window.refreshAlertsFeed = async function () {
  try {
    store.addToast('Syncing real-time operations feed...', 'info');
    const [alerts, operatorData, vendors] = await Promise.all([
      api.getOperatorAlerts().catch(() => []),
      api.getOperatorDashboard().catch(() => null),
      api.getVendors().catch(() => [])
    ]);
    store.setState({
      operatorAlerts: alerts,
      operatorData: operatorData || store.getState().operatorData,
      vendors: (vendors && vendors.length > 0) ? vendors : store.getState().vendors
    });
    store.addToast('Operations alert feed synchronized.', 'success');
  } catch (err) {
    console.error(err);
  }
};

window.openAddActivityModal = function (day) {
  const state = store.getState();
  const targetDay = day || (state.selectedDay === 'all' ? 1 : state.selectedDay);
  store.setState({
    isAddExperienceModalOpen: true,
    addExperienceTargetDay: targetDay
  });
};

window.closeAddActivityModal = function () {
  store.setState({ isAddExperienceModalOpen: false });
};

window.handleQuickAddExperience = async function (day, title, subtitle, itemType, timeStart, timeEnd, cost, locationName, icon) {
  const state = store.getState();
  const tourId = state.currentTourId || (state.currentTour ? state.currentTour.id : 1);

  try {
    store.addToast(`Adding "${title}" to Day ${day}...`, 'info');
    const res = await api.addTourItem(tourId, {
      day_number: parseInt(day) || 1,
      title: title,
      subtitle: subtitle,
      item_type: itemType || 'activity',
      time_start: timeStart || '02:30 PM',
      time_end: timeEnd || '05:00 PM',
      cost: parseFloat(cost) || 1200,
      location_name: locationName || 'Goa Landmark',
      icon: icon || 'sparkles'
    });

    const updatedTour = await api.getTourDetail(tourId);
    store.setState({
      currentTour: updatedTour,
      isAddExperienceModalOpen: false
    });

    store.addToast(`Added "${title}" to Day ${day} itinerary!`, 'success', 5000);
  } catch (err) {
    console.error(err);
    store.addToast('Failed to add experience: ' + err.message, 'critical');
  }
};

window.handleCreateCustomExperience = async function (e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const state = store.getState();
  const tourId = state.currentTourId || (state.currentTour ? state.currentTour.id : 1);

  const dayNumber = parseInt(formData.get('day_number') || '1');
  const title = (formData.get('title') || '').trim();
  const itemType = formData.get('item_type') || 'activity';
  const timeStart = (formData.get('time_start') || '02:30 PM').trim();
  const timeEnd = (formData.get('time_end') || '05:00 PM').trim();
  const cost = parseFloat(formData.get('cost') || '1200');
  const locationName = (formData.get('location_name') || '').trim();

  if (!title) {
    store.addToast('Please enter an experience title', 'critical');
    return;
  }

  try {
    store.addToast('Adding custom experience to itinerary...', 'info');
    const res = await api.addTourItem(tourId, {
      day_number: dayNumber,
      title: title,
      subtitle: `Custom ${itemType.toUpperCase()} on Day ${dayNumber}`,
      item_type: itemType,
      time_start: timeStart,
      time_end: timeEnd,
      cost: cost,
      location_name: locationName || 'Custom Location',
      icon: itemType === 'food' ? 'utensils' : (itemType === 'transport' ? 'bus' : 'sparkles')
    });

    const updatedTour = await api.getTourDetail(tourId);
    store.setState({
      currentTour: updatedTour,
      isAddExperienceModalOpen: false
    });

    store.addToast(`Added "${title}" to Day ${dayNumber} itinerary!`, 'success', 5000);
  } catch (err) {
    console.error(err);
    store.addToast('Failed to add experience: ' + err.message, 'critical');
  }
};

window.deleteItem = async function (itemId) {
  const state = store.getState();
  const tourId = state.currentTourId || (state.currentTour ? state.currentTour.id : 1);

  const confirmed = confirm('Are you sure you want to remove this item from your itinerary?');
  if (!confirmed) return;

  try {
    store.addToast('Removing item from itinerary...', 'info');
    await api.deleteTourItem(tourId, itemId);
    const updatedTour = await api.getTourDetail(tourId);
    store.setState({ currentTour: updatedTour });
    store.addToast('Item removed from itinerary and budget updated.', 'success');
  } catch (err) {
    console.error(err);
    store.addToast('Failed to remove item: ' + err.message, 'critical');
  }
};

window.toggleAIAssistantDrawer = function () {
  const drawer = document.getElementById('ai-chat-drawer');
  if (drawer) drawer.classList.toggle('hidden');
};

// ==============================================================================
// THE SIGNATURE KILLER DEMO: Trigger Disruption Simulation
// ==============================================================================

window.triggerKillerDemo = async function (explicitTourId) {
  const state = store.getState();
  const tourId = explicitTourId || (state.currentTour ? state.currentTour.id : (state.currentTourId || 1));
  try {
    const destName = (state.currentTour && state.currentTour.destination) ? state.currentTour.destination.name : 'Destination';
    store.addToast(`Sensing live weather & natural conditions for ${destName}...`, 'warning', 2500);
    const res = await api.simulateDisruption(tourId);

    const tourDetail = await api.getTourDetail(tourId);
    const notifications = await api.getNotifications(state.activeRole, state.user ? state.user.id : 1);
    const operatorData = await api.getOperatorDashboard();

    store.setState({
      currentTourId: tourId,
      currentTour: tourDetail,
      notifications: notifications,
      operatorData: operatorData,
      isDisruptionModalOpen: true
    });

    store.addToast(`Meteorological hazard alert detected in ${destName}! Safe-zone relocation generated.`, 'critical', 4000);
  } catch (err) {
    console.error(err);
    store.addToast('Failed to trigger disruption: ' + err.message, 'critical');
  }
};

window.applyChangeResolution = async function (changeEventId, alternativeId) {
  try {
    store.addToast('Applying selected alternative...', 'info');
    const res = await api.applyAlternative(changeEventId, alternativeId);

    const state = store.getState();
    const tourId = state.currentTourId || 1;
    const [tourDetail, notifications, operatorData, operatorAlerts, tours] = await Promise.all([
      api.getTourDetail(tourId).catch(() => null),
      api.getNotifications(state.activeRole, state.user ? state.user.id : 1).catch(() => []),
      api.getOperatorDashboard().catch(() => null),
      api.getOperatorAlerts().catch(() => []),
      api.getTours().catch(() => [])
    ]);

    store.setState({
      currentTour: tourDetail || state.currentTour,
      notifications: notifications,
      operatorData: operatorData || state.operatorData,
      operatorAlerts: operatorAlerts,
      tours: tours,
      isDisruptionModalOpen: false,
      activeChangeEventId: null
    });

    store.addToast(`Disruption resolved! Itinerary, pricing & alert feeds synchronized.`, 'success', 5000);
  } catch (err) {
    console.error(err);
    store.addToast('Failed to apply change: ' + err.message, 'critical');
  }
};

window.triggerAlertOperatorForTravellerIssue = async function (tourId) {
  const state = store.getState();
  const id = tourId || state.currentTourId || 1;
  const tour = state.currentTour;
  const user = state.user || { name: 'Krishna Singh', phone: '+91 98765 43210' };

  try {
    store.addToast('Broadcasting urgent alert to tour operator command center...', 'warning');
    const res = await api.alertOperatorTravellerIssue({
      tour_id: id,
      traveller_name: user.name || 'Krishna Singh',
      traveller_phone: user.phone || '+91 98765 43210',
      issue_details: 'Traveller is experiencing an on-ground disruption issue. Immediate contact required.'
    });

    const [tourDetail, notifications, operatorData, operatorAlerts] = await Promise.all([
      api.getTourDetail(id).catch(() => null),
      api.getNotifications(state.activeRole, user.id || 1).catch(() => []),
      api.getOperatorDashboard().catch(() => null),
      api.getOperatorAlerts().catch(() => [])
    ]);

    store.setState({
      currentTour: tourDetail || state.currentTour,
      notifications: notifications,
      operatorData: operatorData || state.operatorData,
      operatorAlerts: operatorAlerts,
      urgentTravellerIssue: {
        tour_id: id,
        tour_code: tour ? tour.code : 'TR1024',
        customer_name: user.name || 'Krishna Singh',
        phone: user.phone || '+91 98765 43210',
        message: 'Contact traveller: he/she has an issue. Immediate phone contact required.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    });

    store.addToast(
      "OPERATOR ALERT DISPATCHED: 'Contact traveller: he/she has an issue'. Operator Aarav Mehta alerted to contact " + (user.name || 'Krishna Singh') + " (" + (user.phone || '+91 98765 43210') + ") immediately!",
      'critical',
      8000
    );
  } catch (err) {
    console.error(err);
    store.addToast('Failed to alert operator: ' + err.message, 'critical');
  }
};

window.markTravellerContacted = function () {
  store.setState({ urgentTravellerIssue: null });
  store.addToast('Traveller marked as contacted. Updated in operator dispatch feed.', 'success');
};

// ==============================================================================
// TRIP PLANNER & BOOKING
// ==============================================================================

window.handleCreateTripSubmit = async function (e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const destName = (formData.get('destination_name') || window.plannerSelectedDest || 'Goa').trim();
  const today = new Date().toISOString().split('T')[0];
  const startDate = formData.get('start_date') || window.plannerStartDate || today;
  const endDate = formData.get('end_date') || window.plannerEndDate || (() => { const d = new Date(); d.setDate(d.getDate()+3); return d.toISOString().split('T')[0]; })();
  const travelers = parseInt(formData.get('travelers_count') || '2');
  const budget = parseFloat(formData.get('budget_total') || window.plannerBudget || '25000');
  const travelStyle = formData.get('travel_style') || 'Beach + Adventure + Food';
  const accommodation = formData.get('accommodation_type') || '3-Star';
  const transport = formData.get('transport_type') || 'Volvo Bus';

  const interests = formData.getAll('interests');
  if (interests.length === 0) interests.push('Beach', 'Adventure', 'Food');

  const formEl = document.getElementById('trip-planner-form');
  const loaderEl = document.getElementById('ai-planner-loader');
  const loaderText = document.getElementById('loader-status-text');
  const loaderBar = document.getElementById('loader-progress-bar');

  if (formEl && loaderEl) {
    formEl.classList.add('hidden');
    loaderEl.classList.remove('hidden');
  }

  const operatorId = formData.get('operator_id') ? parseInt(formData.get('operator_id')) : (window.plannerState ? window.plannerState.selectedOperatorId : null);
  const desiredPlaces = window.plannerState ? window.plannerState.selectedPlaces : [];
  const customPlacesText = window.plannerState && window.plannerState.customPlaces ? window.plannerState.customPlaces.join(', ') : '';

  const steps = [
    { text: "Sensing your requested landmarks & calculating coordinates...", pct: "25%" },
    { text: "Matching best-certified operator with on-ground fleet...", pct: "50%" },
    { text: "Weaving personalized timeline slots & transport transfers...", pct: "75%" },
    { text: "Finalizing live pricing and adaptable safety buffers...", pct: "100%" }
  ];

  for (let i = 0; i < steps.length; i++) {
    if (loaderText) loaderText.innerText = steps[i].text;
    if (loaderBar) loaderBar.style.width = steps[i].pct;
    await new Promise(r => setTimeout(r, 400));
  }

  try {
    const res = await api.planTour({
      destination_name: destName,
      start_date: startDate,
      end_date: endDate,
      travelers_count: travelers,
      budget_total: budget,
      travel_style: travelStyle,
      interests: interests,
      accommodation_type: accommodation,
      transport_type: transport,
      operator_id: operatorId || undefined,
      desired_places: desiredPlaces,
      custom_places_text: customPlacesText || undefined,
      user_id: store.getState().user ? store.getState().user.id : 1
    });

    const userId = store.getState().user ? store.getState().user.id : null;
    const [tourDetail, userTours] = await Promise.all([
      api.getTourDetail(res.tour_id),
      userId ? api.getTours({ user_id: userId }).catch(() => []) : api.getTours().catch(() => [])
    ]);

    store.setState({
      currentTourId: res.tour_id,
      currentTour: tourDetail,
      tours: userTours,
      currentView: 'itinerary',
      selectedDay: 1
    });

    store.addToast('Personalized journey created with dynamic live pricing!', 'success');
  } catch (err) {
    console.error(err);
    store.addToast('Error generating journey: ' + err.message, 'critical');
    if (formEl && loaderEl) {
      formEl.classList.remove('hidden');
      loaderEl.classList.add('hidden');
    }
  }
};

window.processMockBooking = async function () {
  const state = store.getState();
  const tour = state.currentTour;
  if (!tour) return;

  try {
    const res = await api.bookTour({
      tour_id: tour.id,
      user_id: state.user ? state.user.id : 1,
      payment_method: 'UPI / NetBanking',
      contact_phone: state.user ? state.user.phone : '+91 98765 43210'
    });

    const updatedTour = await api.getTourDetail(tour.id);
    store.setState({
      currentTour: updatedTour,
      isBookingModalOpen: false
    });

    store.addToast(`Booking Confirmed! Code: ${res.booking_code}`, 'success', 6000);
  } catch (err) {
    console.error(err);
    store.addToast('Booking failed: ' + err.message, 'critical');
  }
};

window.handleReviewSubmit = async function (e) {
  e.preventDefault();
  const state = store.getState();
  try {
    await api.submitReview({
      tour_id: state.currentTourId || 1,
      user_id: state.user ? state.user.id : 1,
      overall_rating: 5.0,
      hotel_rating: 4.8,
      activity_rating: 5.0,
      transport_rating: 4.7,
      operator_rating: 5.0,
      comment: "Outstanding dynamic tour adaptation! When Day 2 hotel changed, TRAVORA immediately replaced it with Hotel Paradise with zero delay."
    });
    store.setState({ isReviewModalOpen: false });
    store.addToast('Review submitted successfully! Thank you for rating TRAVORA.', 'success');
  } catch (err) {
    console.error(err);
    store.addToast('Review submission error: ' + err.message, 'critical');
  }
};

// ==============================================================================
// AI CHAT ASSISTANT
// ==============================================================================

window.handleAIChatSubmit = async function (e) {
  e.preventDefault();
  const input = document.getElementById('ai-chat-input');
  if (!input || !input.value.trim()) return;
  const query = input.value.trim();
  input.value = '';
  await window.sendAIPrompt(query);
};

window.clearAIChat = function () {
  const container = document.getElementById('ai-chat-messages');
  if (container) {
    const state = store.getState();
    const userName = (state.user && state.user.name) ? state.user.name.split(' ')[0] : 'Traveler';
    container.innerHTML = `
      <div class="flex items-start space-x-2">
        <div class="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#810B38] to-[#ea2330] text-white flex items-center justify-center shrink-0 text-xs font-black shadow-sm">
          AI
        </div>
        <div class="p-3.5 rounded-2xl rounded-tl-none bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 space-y-2 max-w-[90%] border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
          <p class="leading-relaxed">
            Chat cleared! Namaste <strong>${userName}</strong>. How may I assist your travel today? You can ask about <strong>FAQs, Emergency Contact, Recent Bookings, Live Weather,</strong> or <strong>Quick Itinerary Planning</strong>.
          </p>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }
};

window.sendAIPrompt = async function (promptText) {
  const container = document.getElementById('ai-chat-messages');
  const drawer = document.getElementById('ai-chat-drawer');
  if (drawer && drawer.classList.contains('hidden')) {
    drawer.classList.remove('hidden');
  }

  if (container) {
    container.innerHTML += `
      <div class="flex items-start justify-end space-x-2">
        <div class="p-3 rounded-2xl rounded-tr-none bg-gradient-to-r from-[#810B38] to-[#ea2330] text-white space-y-1 max-w-[85%] shadow-md">
          <p class="font-medium">${promptText}</p>
        </div>
      </div>
    `;
    // Add temporary typing indicator
    const typingId = 'typing-' + Date.now();
    container.innerHTML += `
      <div id="${typingId}" class="flex items-start space-x-2 animate-pulse">
        <div class="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0 text-xs font-bold">
          AI
        </div>
        <div class="p-3 rounded-2xl rounded-tl-none bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs flex items-center space-x-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style="animation-delay:0.2s"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style="animation-delay:0.4s"></span>
          <span class="text-[11px] font-medium ml-1">Analyzing...</span>
        </div>
      </div>
    `;
    container.scrollTop = container.scrollHeight;
  }

  try {
    const state = store.getState();
    const res = await api.sendAIChat({
      message: promptText,
      tour_id: state.currentTourId || 1,
      context_type: state.activeRole
    });

    // Remove typing indicator
    const typingEl = container ? container.querySelector('[id^="typing-"]') : null;
    if (typingEl && typingEl.parentNode) {
      typingEl.parentNode.removeChild(typingEl);
    }

    if (container) {
      // Build Rich Interactive Cards based on action_type
      let richCardsHtml = '';

      if (res.action_type === 'contact_info' && res.contact_data) {
        const cd = res.contact_data;
        richCardsHtml = `
          <div class="mt-2.5 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-2 text-slate-900 dark:text-slate-100">
            <div class="flex items-center justify-between text-xs font-bold text-red-600 dark:text-red-400">
              <span class="flex items-center space-x-1"><i data-lucide="phone-call" class="w-3.5 h-3.5"></i><span>Direct Support Channels</span></span>
              <span class="px-2 py-0.2 rounded-full text-[9px] bg-red-600 text-white uppercase font-black">24/7 Verified</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-[11px]">
              <a href="tel:${cd.phone}" class="p-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center justify-center space-x-1.5 transition shadow">
                <i data-lucide="phone" class="w-3.5 h-3.5"></i>
                <span>Call Coordinator</span>
              </a>
              <a href="https://wa.me/919876543210" target="_blank" class="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center space-x-1.5 transition shadow">
                <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
                <span>WhatsApp SOS</span>
              </a>
            </div>
          </div>
        `;
      } else if (res.action_type === 'weather_monitoring' && res.weather_data) {
        const wd = res.weather_data;
        richCardsHtml = `
          <div class="mt-2.5 p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 space-y-2">
            <div class="flex items-center justify-between text-xs font-bold text-sky-700 dark:text-sky-300">
              <span>🌦️ Meteorological Telemetry</span>
              <span class="px-2 py-0.2 rounded-full text-[9px] bg-sky-500 text-white font-bold">${wd.city}</span>
            </div>
            <div class="grid grid-cols-3 gap-1.5 text-center text-[10px]">
              <div class="p-1.5 rounded-xl bg-white/80 dark:bg-slate-900 border border-sky-500/20">
                <span class="text-slate-400 block">Temperature</span>
                <strong class="text-xs text-sky-600 dark:text-sky-400">${wd.temperature}°C</strong>
              </div>
              <div class="p-1.5 rounded-xl bg-white/80 dark:bg-slate-900 border border-sky-500/20">
                <span class="text-slate-400 block">Wind Velocity</span>
                <strong class="text-xs text-slate-800 dark:text-slate-200">${wd.wind_speed} km/h</strong>
              </div>
              <div class="p-1.5 rounded-xl bg-white/80 dark:bg-slate-900 border border-sky-500/20">
                <span class="text-slate-400 block">Humidity</span>
                <strong class="text-xs text-slate-800 dark:text-slate-200">${wd.humidity}%</strong>
              </div>
            </div>
          </div>
        `;
      } else if (res.action_type === 'recent_bookings' && res.bookings_data) {
        richCardsHtml = `
          <div class="mt-2.5 space-y-1.5">
            ${res.bookings_data.map(b => `
              <div class="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]">
                <div>
                  <strong class="text-slate-900 dark:text-white">Tour #${b.code} (${b.destination})</strong>
                  <div class="text-[10px] text-slate-400">Rs ${Number(b.cost).toLocaleString()} &bull; ${b.travelers} Guests</div>
                </div>
                <button onclick="window.navigateView('itinerary'); window.toggleAIAssistantDrawer();" class="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[10px] transition">
                  View Tour
                </button>
              </div>
            `).join('')}
          </div>
        `;
      } else if (res.action_type === 'quick_planner' && res.planner_data) {
        const pd = res.planner_data;
        richCardsHtml = `
          <div class="mt-2.5 p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-2">
            <div class="flex items-center justify-between text-xs font-bold text-purple-700 dark:text-purple-300">
              <span>✨ AI 3-Day Blueprint</span>
              <span class="px-2 py-0.2 rounded-full text-[9px] bg-purple-600 text-white">${pd.destination}</span>
            </div>
            <button onclick="window.navigateView('planner'); window.toggleAIAssistantDrawer();" class="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-[#ea2330] text-white font-bold text-xs shadow transition flex items-center justify-center space-x-1.5">
              <i data-lucide="compass" class="w-3.5 h-3.5"></i>
              <span>Open in Full AI Planner</span>
            </button>
          </div>
        `;
      } else if (res.action_type === 'feedback_submitted' && res.promo_code) {
        richCardsHtml = `
          <div class="mt-2.5 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-center space-y-1.5">
            <div class="text-xs font-bold text-amber-800 dark:text-amber-200">🎁 World Tourism Day Travel Reward</div>
            <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-amber-500 text-slate-900 font-black text-xs font-mono">
              <span>${res.promo_code}</span>
              <i data-lucide="check" class="w-3.5 h-3.5"></i>
            </div>
            <p class="text-[10px] text-amber-700 dark:text-amber-300">15% Discount Voucher saved to your account</p>
          </div>
        `;
      }

      container.innerHTML += `
        <div class="flex items-start space-x-2 animate-fadeIn">
          <div class="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#810B38] to-[#ea2330] text-white flex items-center justify-center shrink-0 text-xs font-black shadow-sm">
            AI
          </div>
          <div class="p-3.5 rounded-2xl rounded-tl-none bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 space-y-1.5 max-w-[88%] border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
            <div class="whitespace-pre-line leading-relaxed text-xs">${res.reply}</div>
            ${richCardsHtml}
          </div>
        </div>
      `;
      container.scrollTop = container.scrollHeight;
      if (window.lucide) window.lucide.createIcons();
    }

    if (res.action_taken) {
      const updatedTour = await api.getTourDetail(state.currentTourId || 1);
      store.setState({ currentTour: updatedTour });
      store.addToast('Itinerary dynamically updated by Travora AI Copilot!', 'success');
    }
  } catch (err) {
    console.error(err);
    const typingEl = container ? container.querySelector('[id^="typing-"]') : null;
    if (typingEl && typingEl.parentNode) {
      typingEl.parentNode.removeChild(typingEl);
    }
    if (container) {
      container.innerHTML += `
        <div class="flex items-start space-x-2 text-red-500 text-xs p-2">
          <i data-lucide="alert-circle" class="w-4 h-4 mr-1 shrink-0"></i>
          <span>Unable to reach copilot engine. Please retry.</span>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  }
};

window.askAiToFindDeals = function () {
  const drawer = document.getElementById('ai-chat-drawer');
  if (drawer && drawer.classList.contains('hidden')) {
    drawer.classList.remove('hidden');
  }
  window.sendAIPrompt('Find the best available deals for this itinerary');
};

window.askAiToHelpEmergency = function () {
  const drawer = document.getElementById('ai-chat-drawer');
  if (drawer && drawer.classList.contains('hidden')) {
    drawer.classList.remove('hidden');
  }
  window.sendAIPrompt('I need immediate support with my Day 2 check-in schedule');
};

window.inspectTourDetail = async function (tourId) {
  try {
    const tour = await api.getTourDetail(tourId);
    store.setState({
      currentTourId: tourId,
      currentTour: tour,
      currentView: 'operator_tour'
    });
  } catch (err) {
    console.error(err);
  }
};

window.deleteItem = async function (itemId) {
  const state = store.getState();
  try {
    await api.deleteTourItem(state.currentTourId || 1, itemId);
    const updatedTour = await api.getTourDetail(state.currentTourId || 1);
    store.setState({ currentTour: updatedTour });
    store.addToast('Activity removed & budget recalculated.', 'info');
  } catch (err) {
    console.error(err);
  }
};

window.openEditItemModal = function (itemId) {
  const newTitle = prompt('Enter new activity or hotel title:');
  if (newTitle && newTitle.trim()) {
    const state = store.getState();
    api.updateTourItem(state.currentTourId || 1, {
      item_id: itemId,
      new_title: newTitle.trim()
    }).then(async () => {
      const updatedTour = await api.getTourDetail(state.currentTourId || 1);
      store.setState({ currentTour: updatedTour });
      store.addToast('Schedule item updated successfully.', 'success');
    });
  }
};

// ==============================================================================
// LEAFLET MAP & CHART.JS INITIALIZERS
// ==============================================================================

function initLeafletMap(tour) {
  const mapContainer = document.getElementById('itinerary-map');
  if (!mapContainer || !window.L) return;

  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }

  const lat = tour ? (tour.destination_lat || 15.5494) : 15.5494;
  const lng = tour ? (tour.destination_lng || 73.7535) : 73.7535;

  leafletMap = window.L.map('itinerary-map').setView([lat, lng], 12);

  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(leafletMap);

  const items = (tour && tour.itinerary_items) ? tour.itinerary_items : [];
  const points = [];

  items.forEach(it => {
    if (it.lat && it.lng) {
      points.push([it.lat, it.lng]);
      const marker = window.L.marker([it.lat, it.lng]).addTo(leafletMap);
      marker.bindPopup(`
        <div class="text-xs p-1">
          <strong class="text-teal-600 block">${it.title}</strong>
          <span class="text-slate-500">${it.time_start} - Rs ${it.cost}</span>
        </div>
      `);
    }
  });

  if (points.length > 1) {
    const polyline = window.L.polyline(points, { color: '#0d9488', weight: 3, opacity: 0.8, dashArray: '6, 8' }).addTo(leafletMap);
    leafletMap.fitBounds(polyline.getBounds(), { padding: [30, 30] });
  }
}

function initAnalyticsCharts() {
  const destCanvas = document.getElementById('destRevenueChart');
  const disruptionCanvas = document.getElementById('disruptionCausesChart');
  if (!window.Chart) return;

  if (destRevenueChart) destRevenueChart.destroy();
  if (disruptionCausesChart) disruptionCausesChart.destroy();

  if (destCanvas) {
    destRevenueChart = new window.Chart(destCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Goa (38%)', 'Kerala (24%)', 'Jaipur (18%)', 'Manali (12%)', 'Others (8%)'],
        datasets: [{
          data: [160000, 105000, 78000, 52000, 25000],
          backgroundColor: ['#0d9488', '#0ea5e9', '#f59e0b', '#8b5cf6', '#64748b'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } }
      }
    });
  }

  if (disruptionCanvas) {
    disruptionCausesChart = new window.Chart(disruptionCanvas, {
      type: 'bar',
      data: {
        labels: ['Hotel Inventory Locks', 'Flight/Transit Delays', 'Weather Adjustments'],
        datasets: [{
          label: 'Incidents Handled',
          data: [8, 4, 2],
          backgroundColor: ['#ef4444', '#f59e0b', '#0d9488'],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    });
  }
}

// ==============================================================================
// MOBILE BOTTOM NAVIGATION (9:16 & SMARTPHONE VIEWPORT)
// ==============================================================================

function renderMobileBottomNav(state) {
  const currentView = state.currentView || 'landing';
  return `
    <nav id="travora-mobile-bottom-nav" class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1C050D]/95 backdrop-blur-2xl border-t border-slate-200 dark:border-[#4A0D22] shadow-[0_-4px_25px_rgba(0,0,0,0.15)] pb-safe transition-all duration-200">
      <div class="flex items-center justify-around h-16 max-w-md mx-auto px-1">
        
        <!-- 1. Explore -->
        <button 
          onclick="window.navigateView('landing')"
          class="flex flex-col items-center justify-center flex-1 py-1 transition ${currentView === 'landing' ? 'text-[#810B38] dark:text-red-400 font-extrabold' : 'text-slate-500 dark:text-slate-400 font-medium'}">
          <i data-lucide="compass" class="w-5 h-5 mb-0.5"></i>
          <span class="text-[10px] tracking-tight">Explore</span>
        </button>

        <!-- 2. AI Planner -->
        <button 
          onclick="window.navigateView('planner')"
          class="flex flex-col items-center justify-center flex-1 py-1 transition ${currentView === 'planner' ? 'text-[#810B38] dark:text-red-400 font-extrabold' : 'text-slate-500 dark:text-slate-400 font-medium'}">
          <div class="relative">
            <i data-lucide="sparkles" class="w-5 h-5 mb-0.5 text-amber-500"></i>
          </div>
          <span class="text-[10px] tracking-tight">AI Plan</span>
        </button>

        <!-- 3. Radar Tracker -->
        <button 
          onclick="window.navigateView('tracker')"
          class="flex flex-col items-center justify-center flex-1 py-1 transition ${currentView === 'tracker' ? 'text-[#810B38] dark:text-red-400 font-extrabold' : 'text-slate-500 dark:text-slate-400 font-medium'}">
          <div class="relative">
            <i data-lucide="navigation" class="w-5 h-5 mb-0.5"></i>
            <span class="absolute -top-1 -right-1 flex h-1.5 w-1.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
          </div>
          <span class="text-[10px] tracking-tight">Radar</span>
        </button>

        <!-- 4. Weather Twin -->
        <button 
          onclick="window.navigateView('weather_twin')"
          class="flex flex-col items-center justify-center flex-1 py-1 transition ${currentView === 'weather_twin' ? 'text-[#810B38] dark:text-red-400 font-extrabold' : 'text-slate-500 dark:text-slate-400 font-medium'}">
          <i data-lucide="cloud-lightning" class="w-5 h-5 mb-0.5 text-blue-500"></i>
          <span class="text-[10px] tracking-tight">Twin</span>
        </button>

        <!-- 5. My Bookings -->
        <button 
          onclick="window.navigateView('my_bookings')"
          class="flex flex-col items-center justify-center flex-1 py-1 transition ${currentView === 'my_bookings' ? 'text-[#810B38] dark:text-red-400 font-extrabold' : 'text-slate-500 dark:text-slate-400 font-medium'}">
          <i data-lucide="ticket" class="w-5 h-5 mb-0.5"></i>
          <span class="text-[10px] tracking-tight">Bookings</span>
        </button>

        <!-- 6. Menu / Districts -->
        <button 
          onclick="window.toggleMobileNav ? window.toggleMobileNav() : (window.openDistrictCommandModal ? window.openDistrictCommandModal() : window.openProfileModal())"
          class="flex flex-col items-center justify-center flex-1 py-1 transition text-slate-500 dark:text-slate-400 font-medium hover:text-[#810B38]">
          <i data-lucide="menu" class="w-5 h-5 mb-0.5"></i>
          <span class="text-[10px] tracking-tight">Menu</span>
        </button>

      </div>
    </nav>
  `;
}

// ==============================================================================
// MAIN RENDER DISPATCHER
// ==============================================================================

function renderApp() {
  try {
    const state = store.getState();
    const root = document.getElementById('app-root');
    if (!root) return;

    const isIntroActive = (state.currentView === 'landing' || state.showSplashIntro) && !window.__travoraIntroPlayed;

    const heroGlobalVideoHtml = (state.currentView === 'landing' && !isIntroActive) ? `
      <!-- HERO FULL BACKGROUND VIDEO: STARTS FROM ABOVE TOP BLACK BAR (PAGE TOP 0) -->
      <div id="hero-global-video-bg" class="absolute top-0 left-0 right-0 w-full h-[960px] sm:h-[1020px] lg:h-[1080px] overflow-hidden pointer-events-none z-0">
        <video 
          id="hero-bg-video"
          autoplay 
          loop 
          muted 
          playsinline 
          poster="/static/assets/hero/hero_travel_banner.jpg"
          class="w-full h-full object-cover object-center brightness-[0.82] dark:brightness-[0.55] filter saturate-110">
          <source src="/static/assets/videos/login_bg.mp4" type="video/mp4">
          <img 
            src="/static/assets/hero/hero_travel_banner.jpg" 
            alt="TRAVORA Scenic Indian Travel Landscape" 
            class="w-full h-full object-cover object-center brightness-[0.70] dark:brightness-[0.45] filter saturate-110"
          />
        </video>
        <!-- Radiant Multi-Stop Veil: Translucent behind top black bar and white glass nav, subtle wine vignette, smooth fade to page background -->
        <div class="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent via-15% via-[#541A1A]/20 via-55% to-[var(--bg-main)]"></div>
        <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-[850px] h-[380px] blur-3xl pointer-events-none rounded-full" style="background:rgba(129,11,56,0.22);"></div>
      </div>
    ` : '';

    // If user is not authenticated, show landing with a login popup overlay
    if (!state.isAuthenticated) {
      let viewHtml = renderLanding();
      const toastsHtml = `
        <div id="toast-container" class="fixed top-6 right-4 z-[300] flex flex-col space-y-2 pointer-events-none">
          ${state.toasts.map(t => `
            <div class="toast-item pointer-events-auto px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center space-x-2 ${t.type === 'critical' ? 'bg-[#810B38] text-white border-[#541A1A]' :
          t.type === 'warning' ? 'bg-amber-500 text-slate-950 border-amber-600' :
            t.type === 'success' ? 'bg-emerald-600 text-white border-emerald-700' :
              'bg-[#541A1A] text-[#F1E2D1] border-[#810B38]'
        }">
              <i data-lucide="${t.type === 'critical' ? 'alert-triangle' : (t.type === 'success' ? 'check' : 'info')}" class="w-4 h-4"></i>
              <span>${t.message}</span>
            </div>
          `).join('')}
        </div>
      `;
      root.innerHTML = `
        ${heroGlobalVideoHtml}
        ${!isIntroActive ? renderNavbar() : ''}
        <main class="min-h-screen relative z-10 pb-16 md:pb-0">${viewHtml}</main>
        ${!isIntroActive ? renderFooter() : ''}
        ${!isIntroActive ? renderMobileBottomNav(state) : ''}
        ${state.isLoginPopupOpen ? renderLoginPopup() : ''}
        ${state.isOperatorRegisterModalOpen ? renderOperatorRegistrationModal() : ''}
        ${renderDistrictCommandModal()}
        ${toastsHtml}
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // Legacy auth view for direct /auth navigation
    if (state.currentView === 'auth') {
      root.innerHTML = `
        ${renderAuthView()}
        <div id="toast-container" class="fixed top-6 right-4 z-50 flex flex-col space-y-2 pointer-events-none">
          ${state.toasts.map(t => `
            <div class="toast-item pointer-events-auto px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center space-x-2 ${t.type === 'critical' ? 'bg-[#810B38] text-white border-[#541A1A]' :
          t.type === 'warning' ? 'bg-amber-500 text-slate-950 border-amber-600' :
            t.type === 'success' ? 'bg-emerald-600 text-white border-emerald-700' :
              'bg-[#541A1A] text-[#F1E2D1] border-[#810B38]'
        }">  
              <i data-lucide="${t.type === 'critical' ? 'alert-triangle' : (t.type === 'success' ? 'check' : 'info')}" class="w-4 h-4"></i>
              <span>${t.message}</span>
            </div>
          `).join('')}
        </div>
        ${state.isOperatorRegisterModalOpen ? renderOperatorRegistrationModal() : ''}
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    let viewHtml = '';
    switch (state.currentView) {
      case 'landing':
        viewHtml = renderLanding();
        break;
      case 'dashboard':
        viewHtml = renderTravelerDashboard();
        break;
      case 'planner':
        viewHtml = renderTripPlanner();
        break;
      case 'itinerary':
        viewHtml = renderItineraryView();
        break;
      case 'tracker':
        viewHtml = renderTripTracker();
        break;
      case 'operator_dash':
        viewHtml = renderOperatorDashboard();
        break;
      case 'operator_tour':
        viewHtml = renderOperatorTourDetail();
        break;
      case 'operator_alerts':
        viewHtml = renderAlertCenter();
        break;
      case 'operator_vendors':
        viewHtml = renderVendorManagement();
        break;
      case 'operator_analytics':
        viewHtml = renderAnalyticsView();
        break;
      case 'about':
        viewHtml = renderAbout();
        break;
      case 'business_operator':
        viewHtml = renderBusinessOperator();
        break;
      case 'admin_dash':
        viewHtml = renderAdminDashboard();
        break;
      case 'my_bookings':
        viewHtml = renderMyBookings();
        break;
      case 'weather_twin':
        viewHtml = renderWeatherDigitalTwin();
        break;
      default:
        viewHtml = state.activeRole === 'admin' ? renderAdminDashboard() : (state.activeRole === 'business_operator' ? renderBusinessOperator() : (state.activeRole === 'operator' ? renderOperatorDashboard() : renderTravelerDashboard()));
    }


    const toastsHtml = `
      <div id="toast-container" class="fixed top-20 right-4 z-50 flex flex-col space-y-2 pointer-events-none">
        ${state.toasts.map(t => `
          <div class="toast-item pointer-events-auto px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center space-x-2 ${t.type === 'critical' ? 'bg-red-600 text-white border-red-700' :
        t.type === 'warning' ? 'bg-amber-500 text-slate-950 border-amber-600' :
          t.type === 'success' ? 'bg-emerald-600 text-white border-emerald-700' :
            'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-700'
      }">
            <i data-lucide="${t.type === 'critical' ? 'alert-triangle' : (t.type === 'success' ? 'check' : 'info')}" class="w-4 h-4"></i>
            <span>${t.message}</span>
          </div>
        `).join('')}
      </div>
    `;

    root.innerHTML = `
      ${heroGlobalVideoHtml}
      ${!isIntroActive ? renderNavbar() : ''}
      <main class="min-h-screen relative z-10 pb-16 md:pb-0">
        ${viewHtml}
      </main>
      ${!isIntroActive && state.currentView !== 'admin_dash' && state.activeRole !== 'admin' ? renderFooter() : ''}
      ${!isIntroActive ? renderMobileBottomNav(state) : ''}
      ${renderDisruptionModal()}
      ${renderBookingModal()}
      ${renderReviewModal()}
      ${renderAIAssistant()}
      ${renderProfileModal()}
      ${renderAddExperienceModal()}
      ${renderFeedbackModal()}
      ${state.isOperatorRegisterModalOpen ? renderOperatorRegistrationModal() : ''}
      ${state.selectedOperatorForModal ? renderOperatorDetailModal(state.selectedOperatorForModal) : ''}
      ${state.isLoginPopupOpen ? renderLoginPopup() : ''}
      ${renderDistrictCommandModal()}
      ${toastsHtml}
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }

    if (state.currentView === 'landing') {
      setTimeout(() => {
        const v = document.getElementById('hero-bg-video');
        if (v) {
          v.muted = true;
          v.play().catch(() => {});
        }
      }, 100);
    } else if (state.currentView === 'itinerary') {
      setTimeout(() => { initLeafletMap(state.currentTour); }, 150);
    } else if (state.currentView === 'tracker') {
      setTimeout(() => { if (window.initTrackerMap) window.initTrackerMap(state.currentTour); }, 150);
    } else if (state.currentView === 'operator_analytics') {
      setTimeout(() => { initAnalyticsCharts(); }, 150);
    } else if (state.currentView === 'weather_twin') {
      setTimeout(() => { if (window.mountWeatherTwinMap) window.mountWeatherTwinMap(); }, 120);
    }


  } catch (err) {
    console.error('Render error:', err);
    const root = document.getElementById('app-root');
    if (root) {
      root.innerHTML = renderAuthView();
      if (window.lucide) window.lucide.createIcons();
    }
  }
}

// ==============================================================================
// BOOTSTRAP APPLICATION
// ==============================================================================

async function bootstrap() {
  store.applyTheme(store.getState().theme);
  store.subscribe(renderApp);

  // Render immediately with initial store state so the page never stays blank
  renderApp();

  try {
    const state = store.getState();
    const user = state.user;
    const userId = user ? user.id : null;
    const isOperator = user && user.role === 'operator';

    const [destinations, tours, notifications, operatorData, operatorAlerts, operators, adminMetrics, adminEvents, adminAuditLogs, corporateBookings, twinResp, twinDestsResp, nugenStatusResp] = await Promise.all([
      api.getDestinations().catch(() => []),
      isOperator
        ? api.getTours().catch(() => [])
        : (userId ? api.getTours({ user_id: userId }).catch(() => []) : Promise.resolve([])),
      api.getNotifications(state.activeRole, userId || 1).catch(() => []),
      isOperator ? api.getOperatorDashboard().catch(() => null) : Promise.resolve(null),
      isOperator ? api.getOperatorAlerts().catch(() => []) : Promise.resolve([]),
      api.getOperators().catch(() => []),
      api.getAdminMetrics().catch(() => null),
      api.getAdminEvents().catch(() => []),
      api.getAdminAuditLogs().catch(() => []),
      api.getCorporateBookings().catch(() => []),
      api.getAdminCorporateBookings().catch(() => []),
      api.getDigitalTwinState(1).catch(() => null),
      api.getDigitalTwinDestinations().catch(() => null),
      api.getNugenStatus().catch(() => null)
    ]);

    let activeTour = null;
    if (tours && tours.length > 0) {
      activeTour = await api.getTourDetail(tours[0].id).catch(() => null);
    }

    const initView = user && user.role === 'admin' ? 'admin_dash' : (user && user.role === 'business_operator' ? 'business_operator' : (user && user.role === 'operator' ? 'operator_dash' : (store.getState().currentView || 'landing')));

    store.setState({
      destinations: destinations,
      tours: tours || [],
      currentTourId: activeTour ? activeTour.id : null,
      currentTour: activeTour,
      notifications: notifications,
      operatorData: operatorData,
      operatorAlerts: operatorAlerts,
      operators: operators || [],
      adminMetrics: adminMetrics,
      adminEvents: adminEvents,
      adminAuditLogs: adminAuditLogs,
      corporateBookings: corporateBookings,
      adminCorporateBookings: adminCorporateBookings || [],
      weatherTwinData: twinResp?.digital_twin || null,
      weatherTwinDestinations: twinDestsResp?.destinations || [],
      nugenStatus: nugenStatusResp?.nugen || null,
      currentView: initView
    });


    if (window.triggerRealtimePlacesSensing) {
      window.triggerRealtimePlacesSensing();
    }
  } catch (err) {
    console.error('Initialization error:', err);
  }

  renderApp();
}

// Global click interceptor: If traveller clicks anywhere on website and is not logged in, ask to login first
document.addEventListener('click', function (e) {
  const state = store.getState();
  if (state.isAuthenticated) return; // Already logged in: all features and clicks work normally!

  // Allow clicking on splash intro overlay (to dismiss/explore)
  if (e.target.closest('#auth-splash-overlay')) return;

  // Allow clicking inside the login popup modal
  if (e.target.closest('#login-popup-overlay')) return;

  // Allow clicking toasts
  if (e.target.closest('#toast-container')) return;

  // Allow theme toggle
  if (e.target.closest('button[onclick*="toggleTheme"]')) return;

  // Allow offers button
  if (e.target.closest('button[onclick*="scrollToOffersSection"]')) {
    e.preventDefault();
    e.stopPropagation();
    if (window.scrollToOffersSection) window.scrollToOffersSection();
    return;
  }

  // Check if clicking on explicit phase navigation buttons or portal switchers
  const phaseBtn = e.target.closest('[data-phase-btn]');
  if (phaseBtn) {
    const phase = phaseBtn.getAttribute('data-phase-btn');
    e.preventDefault();
    e.stopPropagation();
    if (phase === 'offers') {
      if (window.scrollToOffersSection) window.scrollToOffersSection();
    } else {
      window.openPhase(phase);
    }
    return;
  }

  // Allow clicking calendar modal, place picker modal, search hero, dropdowns, and tabs
  if (
    e.target.closest('#travora-calendar-modal') ||
    e.target.closest('#travora-place-picker-modal') ||
    e.target.closest('.travora-date-trigger') ||
    e.target.closest('#flight-calendar-trigger') ||
    e.target.closest('#travellers-dropdown-card') ||
    e.target.closest('#traveller-selection-popover') ||
    e.target.closest('.travora-custom-dropdown') ||
    e.target.closest('[id^="dd-"]') ||
    e.target.closest('[onclick*="openPlacePicker"]') ||
    e.target.closest('[onclick*="openCalendarPicker"]') ||
    e.target.closest('[onclick*="openFlightCalendarPicker"]') ||
    e.target.closest('[onclick*="openHotelCalendarPicker"]') ||
    e.target.closest('[onclick*="openBusCabCalendarPicker"]') ||
    e.target.closest('[onclick*="closeCalendarPicker"]') ||
    e.target.closest('[onclick*="confirmCalendarSelection"]') ||
    e.target.closest('[onclick*="applyCalendarPreset"]') ||
    e.target.closest('[onclick*="navCalendarMonth"]') ||
    e.target.closest('[onclick*="toggleTravellerDropdown"]') ||
    e.target.closest('[onclick*="changeAdults"]') ||
    e.target.closest('[onclick*="changeChildren"]') ||
    e.target.closest('[onclick*="changeInfants"]') ||
    e.target.closest('[onclick*="setCabinClass"]') ||
    e.target.closest('[onclick*="setLandingSpecialFare"]') ||
    e.target.closest('[onclick*="setLandingFlightTripType"]') ||
    e.target.closest('[onclick*="swapLandingCities"]') ||
    e.target.closest('[onclick*="swapCabCities"]') ||
    e.target.closest('[onclick*="swapTrainStations"]') ||
    e.target.closest('[onclick*="setHotelDestination"]') ||
    e.target.closest('[onclick*="setFlightHub"]') ||
    e.target.closest('[onclick*="toggleFlightDetails"]') ||
    e.target.closest('[onclick*="toggleHotelDetails"]') ||
    e.target.closest('.glass-pill-container') ||
    e.target.closest('.glass-input-card') ||
    e.target.closest('.travora-select') ||
    e.target.closest('select') ||
    e.target.closest('input') ||
    e.target.closest('label') ||
    e.target.closest('.yatra-search-hero') ||
    e.target.closest('.yatra-nav-tab') ||
    e.target.closest('#district-results-container') ||
    e.target.closest('#travora-coupon-banner') ||
    e.target.closest('button[onclick*="setLandingSearchTab"]') ||
    e.target.closest('button[onclick*="setQuickDestination"]') ||
    e.target.closest('button[onclick*="executeLandingSearch"]')
  ) {
    return;
  }

  // Allow explicit auth triggers (e.g. login buttons, one-click demo login, quick fill)
  if (e.target.closest('[data-auth-trigger]') || e.target.closest('button[onclick*="openLoginPopup"]') || e.target.closest('button[onclick*="oneClickLogin"]') || e.target.closest('button[onclick*="quickFillDemo"]')) {
    return;
  }

  // Any other click on website: ask traveller to login first!
  e.preventDefault();
  e.stopPropagation();
  store.setState({ isLoginPopupOpen: true, authMode: 'login', authRole: 'traveler' });
  store.addToast('Please login first to continue exploring TRAVORA!', 'info', 3000);
}, true);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

// Listen for postMessage commands from Parent (Mobile 9:16 Studio Toolbar)
window.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'TRAVORA_NAVIGATE') {
    if (event.data.view && window.navigateView) {
      window.navigateView(event.data.view);
    }
  } else if (event.data.type === 'TRAVORA_COMMAND') {
    if (event.data.command === 'openDistrictCommandModal' && window.openDistrictCommandModal) {
      window.openDistrictCommandModal();
    }
  }
});
