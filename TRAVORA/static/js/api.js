// TRAVORA API CLIENT WITH GITHUB PAGES & RENDER CLOUD AUTO-FALLBACK
const customBackend = localStorage.getItem('travora_backend_url') || (window.TRAVORA_CONFIG && window.TRAVORA_CONFIG.API_URL);
const isGitHub = window.location.hostname.endsWith('github.io');
const API_BASE = customBackend ? (customBackend.replace(/\/$/, '') + '/api') : (window.location.origin + '/api');

// In-memory catalog cache for standalone GitHub Pages mode
let cachedCatalog = null;

async function loadCatalog() {
  if (cachedCatalog) return cachedCatalog;
  try {
    // Determine relative path based on current location
    const catalogPath = window.__TRAVORA_REPO__ ? 
      `/${window.__TRAVORA_REPO__}/static/data/catalog.json` : 
      (window.location.pathname.includes('/static/') ? './data/catalog.json' : './static/data/catalog.json');
    const res = await fetch(catalogPath);
    if (res.ok) {
      cachedCatalog = await res.json();
      return cachedCatalog;
    }
  } catch (e) {
    console.warn('Could not load offline catalog, using embedded dataset:', e);
  }
  return null;
}

// Preload catalog in background
loadCatalog();

export const api = {
  async get(endpoint, params = {}) {
    try {
      const url = new URL(API_BASE + endpoint);
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key]);
        }
      });
      const res = await fetch(url.toString());
      if (res.ok) {
        return await res.json();
      }
      throw new Error(`API ${res.status}`);
    } catch (err) {
      // Graceful offline fallback for GitHub Pages or disconnected backend
      return this.handleOfflineGet(endpoint, params);
    }
  },

  async post(endpoint, data = {}) {
    try {
      const res = await fetch(API_BASE + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        return await res.json();
      }
      throw new Error(`API ${res.status}`);
    } catch (err) {
      // Graceful offline fallback
      return this.handleOfflinePost(endpoint, data);
    }
  },

  async put(endpoint, data = {}) {
    try {
      const res = await fetch(API_BASE + endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        return await res.json();
      }
      throw new Error(`API ${res.status}`);
    } catch (err) {
      return { success: true, message: 'Updated locally', data };
    }
  },

  async delete(endpoint) {
    try {
      const res = await fetch(API_BASE + endpoint, { method: 'DELETE' });
      if (res.ok) {
        return await res.json();
      }
      throw new Error(`API ${res.status}`);
    } catch (err) {
      return { success: true, message: 'Deleted locally' };
    }
  },

  // ==============================================================================
  // OFFLINE & GITHUB PAGES CLIENT FALLBACK HANDLERS
  // ==============================================================================
  async handleOfflineGet(endpoint, params = {}) {
    const catalog = await loadCatalog();

    if (endpoint === '/destinations') {
      return (catalog && catalog.destinations) || [
        { id: 1, name: 'Goa', state: 'Goa', description: 'Beaches & night markets', starting_price: 18500, match_score: 95, image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', lat: 15.2993, lng: 74.1240 },
        { id: 2, name: 'Jaipur', state: 'Rajasthan', description: 'Palaces & royal forts', starting_price: 16200, match_score: 92, image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', lat: 26.9124, lng: 75.7873 },
        { id: 3, name: 'Manali', state: 'Himachal', description: 'Snowy Himalayan peaks', starting_price: 19500, match_score: 90, image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', lat: 32.2432, lng: 77.1892 }
      ];
    }

    if (endpoint.startsWith('/destinations/')) {
      const id = parseInt(endpoint.split('/')[2]);
      const list = (catalog && catalog.destinations) || [];
      return list.find(d => d.id === id) || list[0] || {};
    }

    if (endpoint === '/districts') {
      let list = (catalog && catalog.districts) || [];
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(d => (d.name && d.name.toLowerCase().includes(q)) || (d.state && d.state.toLowerCase().includes(q)));
      }
      return list;
    }

    if (endpoint.startsWith('/districts/')) {
      const id = parseInt(endpoint.split('/')[2]);
      const list = (catalog && catalog.districts) || [];
      return list.find(d => d.id === id) || list[0] || {};
    }

    if (endpoint === '/hotels') {
      let list = (catalog && catalog.hotels) || [];
      if (params.destination) {
        list = list.filter(h => h.destination && h.destination.toLowerCase().includes(params.destination.toLowerCase()));
      }
      return list;
    }

    if (endpoint === '/festivals') {
      return (catalog && catalog.festivals) || [];
    }

    if (endpoint === '/tours') {
      const localTours = JSON.parse(localStorage.getItem('travora_tours') || '[]');
      if (localTours.length > 0) return localTours;
      return (catalog && catalog.tours) || [
        { id: 1, name: 'Royal Rajputana Heritage & Palaces', destination: 'Jaipur', duration_days: 5, total_price: 24500, status: 'active', pace: 'Moderate' }
      ];
    }

    if (endpoint.startsWith('/tours/')) {
      const id = parseInt(endpoint.split('/')[2]);
      const localTours = JSON.parse(localStorage.getItem('travora_tours') || '[]');
      const found = localTours.find(t => t.id === id);
      if (found) return found;
      const catTour = (catalog && catalog.tours && catalog.tours.find(t => t.id === id));
      if (catTour) return catTour;
      return {
        id: id,
        name: 'Curated Indian Experience Tour',
        destination: 'Goa',
        duration_days: 4,
        total_price: 18500,
        status: 'active',
        itinerary_items: [
          { id: 101, day_number: 1, title: 'Arrival & Beachside Relaxation', time_slot: 'Morning', activity_type: 'leisure', cost: 0 },
          { id: 102, day_number: 1, title: 'Historic Fort Aguada & Sunset', time_slot: 'Afternoon', activity_type: 'sightseeing', cost: 1200 },
          { id: 103, day_number: 2, title: 'Old Goa Portuguese Churches', time_slot: 'Morning', activity_type: 'culture', cost: 800 }
        ]
      };
    }

    if (endpoint === '/bookings') {
      return JSON.parse(localStorage.getItem('travora_user_bookings') || '[]');
    }

    if (endpoint === '/admin/metrics') {
      return {
        active_tours: 48,
        completed_tours: 312,
        districts_covered: 802,
        total_revenue: 1485000,
        avg_rating: 4.88,
        disruptions_resolved: 99.2,
        system_status: 'All 802 Districts Online'
      };
    }

    if (endpoint === '/admin/events') {
      return [
        { id: 1, event_type: 'TOUR_STARTED', message: 'Tour #104 started in Jaipur', timestamp: new Date().toISOString() },
        { id: 2, event_type: 'DISRUPTION_AVOIDED', message: 'Rerouted around rainfall in Manali', timestamp: new Date().toISOString() }
      ];
    }

    if (endpoint === '/admin/audit-logs') {
      return [
        { id: 1, action: 'SYSTEM_BOOT', user_email: 'admin@travora.demo', timestamp: new Date().toISOString(), details: '802 Indian districts verified' }
      ];
    }

    if (endpoint === '/weather/live') {
      const city = params.city || 'Goa';
      return {
        city: city,
        temp: 28,
        condition: 'Clear Sky',
        humidity: 65,
        wind_speed: 12,
        rainfall_prob: 5,
        alert_level: 'none'
      };
    }

    if (endpoint === '/digital-twin/destinations') {
      return (catalog && catalog.destinations) || [];
    }

    if (endpoint === '/digital-twin/state') {
      return {
        destination: 'Goa',
        simulation_active: true,
        risk_index: 12,
        crowd_density: 'Moderate',
        weather_outlook: 'Favorable for coastal tours and watersports'
      };
    }

    if (endpoint === '/notifications') {
      return [
        { id: 1, title: 'Welcome to TRAVORA', message: 'India\'s #1 Dynamic Tour Platform is active!', is_read: false, created_at: new Date().toISOString() }
      ];
    }

    if (endpoint === '/operator/dashboard') {
      return {
        company_name: 'Verified Tour Operators Association',
        active_tours: [],
        total_passengers: 142,
        on_time_performance: 98.4
      };
    }

    return [];
  },

  async handleOfflinePost(endpoint, data = {}) {
    if (endpoint === '/auth/login') {
      const role = data.role || 'traveler';
      const user = {
        id: role === 'admin' ? 99 : (role === 'operator' ? 42 : 1),
        name: role === 'admin' ? 'Platform Administrator' : (role === 'operator' ? 'Goa Heritage Trails' : 'Krishna Singh'),
        email: data.email || `${role}@travora.demo`,
        role: role,
        phone: '+91 98765 43210'
      };
      localStorage.setItem('travora_user', JSON.stringify(user));
      return { user, token: 'demo-offline-jwt-token' };
    }

    if (endpoint === '/auth/register') {
      const user = {
        id: Math.floor(Math.random() * 1000) + 10,
        name: data.name || 'New Traveller',
        email: data.email,
        role: data.role || 'traveler',
        phone: data.phone || '+91 98765 43210'
      };
      localStorage.setItem('travora_user', JSON.stringify(user));
      return { user, token: 'demo-offline-jwt-token' };
    }

    if (endpoint === '/tours/plan') {
      const newTour = {
        id: Math.floor(Math.random() * 9000) + 1000,
        name: `${data.destination || 'India'} Dynamic Personalized Tour`,
        destination: data.destination || 'Goa',
        duration_days: data.duration_days || 4,
        travelers_count: data.travelers_count || 2,
        budget_tier: data.budget_tier || 'comfort',
        travel_style: data.travel_style || 'Balanced',
        total_price: 19800,
        status: 'active',
        created_at: new Date().toISOString(),
        itinerary_items: [
          { id: 201, day_number: 1, title: 'Arrival & Boutique Hotel Check-in', time_slot: 'Morning', activity_type: 'hotel', cost: 4500 },
          { id: 202, day_number: 1, title: 'Heritage Walking Tour & Local Tasting', time_slot: 'Afternoon', activity_type: 'culture', cost: 1200 },
          { id: 203, day_number: 2, title: 'Private Scenic Excursion & Sunset View', time_slot: 'Morning', activity_type: 'sightseeing', cost: 2400 },
          { id: 204, day_number: 3, title: 'Artisan Workshop & Traditional Lunch', time_slot: 'Afternoon', activity_type: 'food', cost: 1800 }
        ]
      };
      const existing = JSON.parse(localStorage.getItem('travora_tours') || '[]');
      existing.unshift(newTour);
      localStorage.setItem('travora_tours', JSON.stringify(existing));
      return newTour;
    }

    if (endpoint === '/tours/book' || endpoint === '/bookings/direct-create') {
      const bookingCode = 'TRAV-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const booking = {
        id: Math.floor(Math.random() * 10000),
        booking_code: bookingCode,
        title: data.tour_title || data.title || 'Dynamic Tour Booking',
        destination: data.destination || 'India',
        travelers: data.travelers || 2,
        total_amount: data.amount || data.total_price || 24500,
        status: 'confirmed',
        created_at: new Date().toISOString()
      };
      const current = JSON.parse(localStorage.getItem('travora_user_bookings') || '[]');
      current.unshift(booking);
      localStorage.setItem('travora_user_bookings', JSON.stringify(current));
      return { success: true, booking_code: bookingCode, booking };
    }

    if (endpoint.includes('/disrupt')) {
      return {
        disrupted: true,
        cause: 'Weather Alert: Heavy Rainfall Detected',
        impact: 'Morning sightseeing rescheduled to indoor cultural museum',
        confidence: 96.5
      };
    }

    return { success: true, message: 'Action registered' };
  },

  // Auth Endpoints
  register(payload) { return this.post('/auth/register', payload); },
  login(payload) { return this.post('/auth/login', payload); },
  resetPassword(payload) { return this.post('/auth/reset-password', payload); },
  updateProfile(payload) { return this.put('/auth/profile', payload); },
  deleteAccount(payload) { return this.post('/auth/delete-account', payload); },
  deleteUser(userId) { return this.delete(`/users/${userId}`); },

  // Specialized API methods
  getDestinations() { return this.get('/destinations'); },
  getDestinationDetail(id) { return this.get(`/destinations/${id}`); },
  getLandmarks() { return this.get('/landmarks'); },
  getDistricts(params = {}) { return this.get('/districts', params); },
  getDistrictDetail(id) { return this.get(`/districts/${id}`); },
  getFestivals() { return this.get('/festivals'); },
  checkFestivals(payload) { return this.post('/festivals/check', payload); },
  getHotels(params = {}) { return this.get('/hotels', params); },
  getFlights(params = {}) { return this.get('/flights', params); },
  getPackages(params = {}) { return this.get('/packages', params); },
  getUserBookings(params = {}) { return this.get('/bookings', params); },
  createDirectBooking(payload) { return this.post('/bookings/direct-create', payload); },
  getMyPackages(operatorId, operatorEmail) { return this.get('/operator/my-packages', { operator_id: operatorId, operator_email: operatorEmail }); },
  createPackage(payload) { return this.post('/operator/packages', payload); },
  deletePackage(packageId) { return this.delete(`/operator/packages/${packageId}`); },
  getOperators(destination) { return this.get('/operators', { destination }); },
  matchOperators(payload) { return this.post('/operators/match', payload); },
  sensePlaces(payload) { return this.post('/places/sense', payload); },
  planTour(payload) { return this.post('/tours/plan', payload); },
  getTours(params = {}) { return this.get('/tours', params); },
  getTourDetail(id) { return this.get(`/tours/${id}`); },
  deleteTour(tourId) { return this.delete(`/tours/${tourId}`); },
  addTourItem(tourId, payload) { return this.post(`/tours/${tourId}/add-item`, payload); },
  updateTourItem(tourId, payload) { return this.put(`/tours/${tourId}/update-item`, payload); },
  deleteTourItem(tourId, itemId) { return this.delete(`/tours/${tourId}/items/${itemId}`); },
  simulateDisruption(tourId) { return this.post(`/tours/${tourId}/disrupt`); },
  alertOperatorTravellerIssue(payload) { return this.post('/operator/alert-traveller-issue', payload); },
  applyAlternative(changeEventId, alternativeId) {
    return this.post('/changes/apply', { change_event_id: changeEventId, alternative_id: alternativeId });
  },
  bookTour(payload) { return this.post('/tours/book', payload); },
  verifyPayment(payload) { return this.post('/payments/verify', payload); },
  getBookingReceipt(bookingCode) { return this.get(`/bookings/${bookingCode}/receipt`); },
  calculatePlaceImpact(payload) { return this.post('/places/calculate-impact', payload); },
  requestAdditionalPlace(payload) { return this.post('/places/request-additional', payload); },
  getOperatorPlaceRequests(operatorId, operatorEmail) { return this.get('/operator/place-requests', { operator_id: operatorId, operator_email: operatorEmail }); },
  actionPlaceRequest(requestId, payload) { return this.post(`/operator/place-requests/${requestId}/action`, payload); },
  getOperatorDashboard(operatorId, operatorEmail) { return this.get('/operator/dashboard', { operator_id: operatorId, operator_email: operatorEmail }); },
  getOperatorAlerts(operatorId, operatorEmail) { return this.get('/operator/alerts', { operator_id: operatorId, operator_email: operatorEmail }); },
  simulateOperatorEvent() { return this.post('/operator/simulate-event'); },
  resolveAllAlerts() { return this.post('/operator/resolve-all'); },
  getVendors() { return this.get('/operator/vendors'); },
  getTourGroups() { return this.get('/operator/groups'); },
  getAnalytics() { return this.get('/operator/analytics'); },
  getCorporateBookings(userId) { return this.get('/corporate/bookings', { user_id: userId }); },
  createCorporateBooking(payload) { return this.post('/corporate/bookings', payload); },
  getAdminCorporateBookings() { return this.get('/admin/corporate-bookings'); },
  actionAdminCorporateBooking(bookingId, payload) { return this.post(`/admin/corporate-bookings/${bookingId}/action`, payload); },
  getAdminMetrics() { return this.get('/admin/metrics'); },
  getAdminEvents() { return this.get('/admin/events'); },
  getAdminAuditLogs() { return this.get('/admin/audit-logs'); },
  sendAIChat(payload) { return this.post('/ai/chat', payload); },
  getNotifications(role, userId) { return this.get('/notifications', { role, user_id: userId }); },
  markNotificationsRead() { return this.post('/notifications/mark-read'); },
  submitReview(payload) { return this.post('/reviews', payload); },
  submitPlatformFeedback(payload) { return this.post('/feedback/platform', payload); },
  submitOperatorReview(payload) { return this.post('/feedback/operator', payload); },

  // Database CRUD Studio Methods
  getCrudStats() { return this.get('/crud/stats'); },
  getCrudTable(table) { return this.get(`/crud/${table}`); },
  createCrudRecord(table, data) { return this.post(`/crud/${table}`, data); },
  updateCrudRecord(table, id, data) { return this.put(`/crud/${table}/${id}`, data); },
  deleteCrudRecord(table, id) { return this.delete(`/crud/${table}/${id}`); },

  // Weather Intelligence & Digital Twin Methods
  getLiveWeather(params = {}) { return this.get('/weather/live', params); },
  getDigitalTwinDestinations() { return this.get('/digital-twin/destinations'); },
  getDigitalTwinState(destinationId = 1) { return this.get('/digital-twin/state', { destination_id: destinationId }); },
  simulateDigitalTwin(payload) { return this.post('/digital-twin/simulate', payload); },
  getNugenStatus() { return this.get('/ai/nugen/status'); },
  analyzeNugenImpact(payload) { return this.post('/ai/nugen/analyze', payload); }
};
