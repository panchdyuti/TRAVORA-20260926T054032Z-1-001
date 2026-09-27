// TRAVORA CENTRAL STATE STORE

class Store {
  constructor() {
    const savedUserJson = localStorage.getItem('travora_user');
    let savedUser = null;
    try {
      if (savedUserJson) {
        savedUser = JSON.parse(savedUserJson);
        if (savedUser && typeof savedUser === 'object') {
          if (!savedUser.name) savedUser.name = (savedUser.email ? savedUser.email.split('@')[0] : 'User');
          if (!savedUser.role) savedUser.role = 'traveler';
        } else {
          savedUser = null;
        }
      }
    } catch (e) {
      savedUser = null;
    }

    const isAuthenticated = savedUser !== null;
    const initialRole = savedUser ? (savedUser.role || 'traveler') : 'traveler';
    const initialView = isAuthenticated ? (initialRole === 'operator' ? 'operator_dash' : (initialRole === 'admin' ? 'admin_dash' : (initialRole === 'business_operator' ? 'business_operator' : 'landing'))) : 'landing';

    this.state = {
      isAuthenticated: isAuthenticated,
      user: savedUser,
      activeRole: initialRole, // 'traveler' or 'operator'
      authMode: 'login',       // 'login' or 'signup'
      isLoginPopupOpen: false,  // popup-based login modal
      currentView: initialView,
      currentTourId: null,
      currentTour: null,
      tours: [],
      destinations: [],
      notifications: [],
      unreadCount: 0,
      theme: localStorage.getItem('travora_theme') || 'light',
      isDisruptionModalOpen: false,
      activeChangeEvent: null,
      isBookingModalOpen: false,
      isReviewModalOpen: false,
      isProfileModalOpen: false,
      isAddExperienceModalOpen: false,
      isOperatorRegisterModalOpen: false,
      selectedOperatorForModal: null,
      addExperienceTargetDay: 1,
      selectedDay: 1,
      toasts: [],
      landingSearchTab: 'flights',
      landingFlightTripType: 'roundtrip',
      landingSpecialFare: 'regular',
      isSearchActive: false,
      searchCategory: 'flights',
      searchFromCity: 'New Delhi (DEL)',
      searchToCity: 'Goa (GOI / GOX)',
      
      // CRUD Database Studio State
      crudActiveTable: 'users',
      crudTableData: [],
      crudStats: {
        users: 0, destinations: 0, hotels: 0, activities: 0, tours: 0,
        itinerary_items: 0, vendors: 0, bookings: 0, reviews: 0
      },

      // Weather-Driven Digital Twin State
      weatherTwinDestinationId: 1,
      weatherTwinData: null,
      weatherTwinSimResult: null,
      weatherTwinSimParams: {
        rainfall_mm_h: 25.0,
        temperature_c: 28.0,
        wind_speed_kmh: 35.0,
        storm_duration_h: 4.0
      },
      weatherTwinViewMode: 'live', // 'live' or 'scenario'
      weatherTwinFilterType: 'all',
      weatherTwinSelectedEntity: null,
      weatherTwinDestinations: []
    };
    this.listeners = [];

  }

  getState() {
    return this.state;
  }

  setState(partialState) {
    this.state = { ...this.state, ...partialState };
    if (partialState.theme) {
      localStorage.setItem('travora_theme', partialState.theme);
      this.applyTheme(partialState.theme);
    }
    if (partialState.user) {
      localStorage.setItem('travora_user', JSON.stringify(partialState.user));
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  toggleTheme() {
    const nextTheme = this.state.theme === 'dark' ? 'light' : 'dark';
    this.setState({ theme: nextTheme });
  }

  login(user) {
    localStorage.setItem('travora_user', JSON.stringify(user));
    let view = 'dashboard';
    if (user.role === 'admin') view = 'admin_dash';
    else if (user.role === 'business_operator') view = 'business_operator';
    else if (user.role === 'operator') view = 'operator_dash';

    this.setState({
      isAuthenticated: true,
      user: user,
      activeRole: user.role,
      currentTourId: null,
      currentTour: null,
      tours: [],
      currentView: view,
      isLoginPopupOpen: false
    });
    this.addToast(`Welcome, ${user.name}! Signed in as ${user.role.toUpperCase()}`, 'success');
  }

  logout() {
    localStorage.removeItem('travora_user');
    this.setState({
      isAuthenticated: false,
      user: null,
      currentTourId: null,
      currentTour: null,
      tours: [],
      currentView: 'landing',
      authMode: 'login',
      isLoginPopupOpen: false
    });
    this.addToast('Logged out successfully. See you soon!', 'info');
  }

  switchRole(role) {
    if (!this.state.isAuthenticated) {
      this.setState({ authRole: role, currentView: 'auth', isLoginPopupOpen: true });
      return;
    }
    const user = this.state.user;
    if (user && user.role !== role) {
      this.addToast(`Switched view to ${role.toUpperCase()} mode`, 'info');
    }
    let view = 'dashboard';
    if (role === 'admin') view = 'admin_dash';
    else if (role === 'business_operator') view = 'business_operator';
    else if (role === 'operator') view = 'operator_dash';

    this.setState({
      activeRole: role,
      currentView: view,
      isLoginPopupOpen: false
    });
  }

  navigate(view, payload = {}) {
    const roleForView = {
      operator_dash: 'operator',
      operator_tour: 'operator',
      operator_alerts: 'operator',
      operator_vendors: 'operator',
      operator_analytics: 'operator',
      business_operator: 'business_operator',
      admin_dash: 'admin'
    }[view];

    const isPublicView = view === 'landing' || view === 'about' || view === 'weather_twin';

    if (!this.state.isAuthenticated && !isPublicView) {
      this.setState({
        isLoginPopupOpen: true,
        authMode: 'login',
        authRole: roleForView || 'traveler'
      });
      return;
    }


    const updates = {
      currentView: view,
      isLoginPopupOpen: false,
      ...payload
    };
    if (roleForView) {
      updates.activeRole = roleForView;
    }

    this.setState(updates);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addToast(message, type = 'info', duration = 4000) {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type };
    const updatedToasts = [...this.state.toasts, newToast];
    this.setState({ toasts: updatedToasts });

    setTimeout(() => {
      this.removeToast(id);
    }, duration);
  }

  removeToast(id) {
    this.setState({
      toasts: this.state.toasts.filter(t => t.id !== id)
    });
  }
}

export const store = new Store();
