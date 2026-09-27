import { store } from '../store.js';
import { api } from '../api.js';

/**
 * Renders the Login / Sign-Up popup modal overlay.
 * Triggered by window.openLoginPopup('login'|'signup', role).
 * Closed by window.closeLoginPopup().
 */
export function renderLoginPopup() {
  const state = store.getState();
  const authMode = state.authMode || 'login';
  const selectedRole = state.authRole || 'traveler';

  const demoAccounts = {
    traveler:          { email: 'traveler@travora.demo',  pass: 'password123', label: 'Krishna Singh • Explorer' },
    operator:          { email: 'operator@travora.demo',  pass: 'password123', label: 'Aarav Mehta • Operator' },
    business_operator: { email: 'corporate@travora.demo', pass: 'password123', label: 'Vikram Oberoi • Corporate' },
    admin:             { email: 'admin@travora.demo',     pass: 'password123', label: 'Platform Admin • HQ' }
  };
  const demo = demoAccounts[selectedRole] || demoAccounts.traveler;

  const roleTitles = {
    traveler: 'Traveller Portal',
    operator: 'Operator Dispatch Hub',
    business_operator: 'TRAVORA for Business',
    admin: 'Central Platform Administration'
  };

  const roles = [
    { id: 'traveler',          icon: 'compass',       label: 'Traveller' },
    { id: 'operator',          icon: 'building-2',    label: 'Operator' },
    { id: 'business_operator', icon: 'briefcase',     label: 'Corporate' },
    { id: 'admin',             icon: 'shield-alert',  label: 'Admin' }
  ];

  return `
    <div id="login-popup-overlay" onclick="if(event.target===this)window.closeLoginPopup()" role="dialog" aria-modal="true" aria-label="Login to TRAVORA">
      <div class="login-popup-card" style="max-width:860px;width:100%;margin:auto;">
        <div style="background:linear-gradient(135deg,#810B38 0%,#541A1A 60%,#3D1212 100%);border-radius:1.75rem 1.75rem 0 0;padding:2rem 2rem 1.5rem;position:relative;overflow:hidden;">
          <div style="position:absolute;top:-60px;right:-60px;width:220px;height:220px;border-radius:50%;background:rgba(241,226,209,0.07);"></div>
          <div style="position:absolute;bottom:-40px;left:-30px;width:160px;height:160px;border-radius:50%;background:rgba(220,195,170,0.05);"></div>
          <button onclick="window.closeLoginPopup()" style="position:absolute;top:1rem;right:1rem;width:2rem;height:2rem;border-radius:50%;background:rgba(241,226,209,0.18);border:1px solid rgba(241,226,209,0.25);color:#F1E2D1;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;" aria-label="Close">
            <i data-lucide="x" style="width:14px;height:14px;"></i>
          </button>
          <div style="display:flex;align-items:center;gap:1rem;position:relative;z-index:1;">
            <img src="/static/assets/logo/travora_emblem.png" alt="TRAVORA" style="width:52px;height:52px;object-fit:contain;filter:drop-shadow(0 4px 16px rgba(220,195,170,0.5));"/>
            <div>
              <div style="display:inline-block;padding:2px 8px;border-radius:999px;background:rgba(241,226,209,0.2);color:#F1E2D1;font-size:0.65rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">
                ${roleTitles[selectedRole] || 'Portal Sign In'}
              </div>
              <h2 style="font-size:1.5rem;font-weight:900;letter-spacing:0.12em;color:#F1E2D1;line-height:1.1;">
                ${authMode === 'signup' ? 'Create Account' : (selectedRole === 'traveler' ? 'Sign In to Continue' : `Sign In to ${roles.find(r=>r.id===selectedRole)?.label} Phase`)}
              </h2>
              <p style="font-size:0.75rem;color:rgba(220,195,170,0.8);margin-top:0.25rem;">
                ${authMode === 'signup' ? 'Join TRAVORA — Plan Freely, Travel Personally' : 'Please log in to explore and operate on the TRAVORA platform.'}
              </p>
            </div>
          </div>
          <div style="display:flex;gap:0.5rem;margin-top:1.25rem;flex-wrap:wrap;position:relative;z-index:1;">
            ${roles.map(r => `
              <button type="button" onclick="window.selectPopupRole('${r.id}')" style="display:flex;align-items:center;gap:0.35rem;padding:0.4rem 0.85rem;border-radius:9999px;font-size:0.7rem;font-weight:700;cursor:pointer;transition:all 0.2s;border:1.5px solid ${selectedRole === r.id ? '#F1E2D1' : 'rgba(241,226,209,0.25)'};background:${selectedRole === r.id ? 'rgba(241,226,209,0.25)' : 'transparent'};color:${selectedRole === r.id ? '#F1E2D1' : 'rgba(241,226,209,0.6)'};">
                <i data-lucide="${r.icon}" style="width:11px;height:11px;"></i>
                <span>${r.label}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div style="padding:1.75rem 2rem;display:grid;grid-template-columns:1fr 1fr;gap:2rem;" class="popup-form-grid">
          <div>
            <div style="display:flex;background:#F1E2D1;border-radius:0.75rem;padding:0.25rem;margin-bottom:1.25rem;">
              <button onclick="store.setState({authMode:'login'})" style="flex:1;padding:0.5rem;border-radius:0.5rem;font-size:0.75rem;font-weight:700;cursor:pointer;transition:all 0.2s;background:${authMode==='login'?'#810B38':'transparent'};color:${authMode==='login'?'#F1E2D1':'#541A1A'};border:none;">Sign In</button>
              <button onclick="store.setState({authMode:'signup'})" style="flex:1;padding:0.5rem;border-radius:0.5rem;font-size:0.75rem;font-weight:700;cursor:pointer;transition:all 0.2s;background:${authMode==='signup'?'#810B38':'transparent'};color:${authMode==='signup'?'#F1E2D1':'#541A1A'};border:none;">Create Account</button>
            </div>
            <form onsubmit="window.handlePopupLoginSubmit(event)" style="display:flex;flex-direction:column;gap:1rem;">
              ${authMode === 'signup' ? `<div><label style="display:block;font-size:0.7rem;font-weight:700;color:#541A1A;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.35rem;">Full Name</label><input type="text" name="full_name" placeholder="Your full name" style="width:100%;padding:0.65rem 0.85rem;border-radius:0.65rem;border:1.5px solid #DCC3AA;font-size:0.85rem;outline:none;background:#fff;box-sizing:border-box;" /></div>` : ''}
              <div>
                <label style="display:block;font-size:0.7rem;font-weight:700;color:#541A1A;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.35rem;">Email Address</label>
                <input type="email" name="email" id="popup-email" placeholder="you@email.com" value="${demo.email}" style="width:100%;padding:0.65rem 0.85rem;border-radius:0.65rem;border:1.5px solid #DCC3AA;font-size:0.85rem;outline:none;background:#fff;box-sizing:border-box;" required/>
              </div>
              <div>
                <label style="display:block;font-size:0.7rem;font-weight:700;color:#541A1A;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.35rem;">Password</label>
                <input type="password" name="password" id="popup-password" placeholder="••••••••" value="${demo.pass}" style="width:100%;padding:0.65rem 0.85rem;border-radius:0.65rem;border:1.5px solid #DCC3AA;font-size:0.85rem;outline:none;background:#fff;box-sizing:border-box;" required/>
              </div>
              <button type="submit" id="popup-submit-btn" style="width:100%;padding:0.75rem;border-radius:0.75rem;background:linear-gradient(135deg,#810B38,#541A1A);color:#F1E2D1;font-weight:800;font-size:0.85rem;cursor:pointer;border:none;letter-spacing:0.04em;box-shadow:0 6px 20px rgba(129,11,56,0.35);">
                ${authMode === 'signup' ? '✦ Create My Account' : `→ Sign In as ${roles.find(r=>r.id===selectedRole)?.label || 'User'}`}
              </button>
            </form>
            
            <div style="display:flex;align-items:center;gap:0.75rem;margin:0.85rem 0;">
              <div style="flex:1;height:1px;background:#DCC3AA;"></div>
              <span style="font-size:0.68rem;color:#810B38;font-weight:800;text-transform:uppercase;">or instant 1-click</span>
              <div style="flex:1;height:1px;background:#DCC3AA;"></div>
            </div>

            <button type="button" onclick="window.quickDemoLogin('${selectedRole}')" style="width:100%;padding:0.7rem;border-radius:0.75rem;background:linear-gradient(135deg,#f59e0b,#ea2330);color:#ffffff;font-size:0.75rem;font-weight:900;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.5rem;border:none;box-shadow:0 4px 14px rgba(234,35,48,0.25);">
              <i data-lucide="zap" style="width:13px;height:13px;"></i>
              <span>⚡ 1-Click Instant Demo Login (${demo.label})</span>
            </button>
          </div>

          <div style="background:linear-gradient(160deg,#FDF6F0,#F1E2D1);border-radius:1rem;padding:1.5rem;display:flex;flex-direction:column;justify-content:space-between;border:1px solid #DCC3AA;">
            <div>
              <div style="width:2.5rem;height:2.5rem;border-radius:0.75rem;background:linear-gradient(135deg,#810B38,#541A1A);display:flex;align-items:center;justify-content:center;margin-bottom:1rem;">
                <i data-lucide="sparkles" style="width:16px;height:16px;color:#F1E2D1;"></i>
              </div>
              <h3 style="font-size:0.95rem;font-weight:800;color:#1A0707;margin-bottom:0.75rem;">Platform Access</h3>
              <div style="display:flex;flex-direction:column;gap:0.6rem;">
                <div style="display:flex;align-items:flex-start;gap:0.5rem;"><span style="font-size:0.85rem;">✈️</span><span style="font-size:0.72rem;color:#541A1A;line-height:1.5;"><strong>Traveller:</strong> Flights, Hotels, Dynamic Itineraries & Live Tracker</span></div>
                <div style="display:flex;align-items:flex-start;gap:0.5rem;"><span style="font-size:0.85rem;">🏢</span><span style="font-size:0.72rem;color:#541A1A;line-height:1.5;"><strong>Operator:</strong> Fleet Dispatch Hub, Tour Roster & Operations Alerts</span></div>
                <div style="display:flex;align-items:flex-start;gap:0.5rem;"><span style="font-size:0.85rem;">💼</span><span style="font-size:0.72rem;color:#541A1A;line-height:1.5;"><strong>Corporate:</strong> TRAVORA for Business, Delegations & Cost Center Policy</span></div>
                <div style="display:flex;align-items:flex-start;gap:0.5rem;"><span style="font-size:0.85rem;">🛡️</span><span style="font-size:0.72rem;color:#541A1A;line-height:1.5;"><strong>Admin:</strong> 802 Districts Telemetry, 500+ Operators & Audit Logs</span></div>
              </div>
            </div>
            <div style="margin-top:1rem;padding:0.85rem;background:rgba(129,11,56,0.08);border-radius:0.75rem;border:1px solid rgba(129,11,56,0.15);">
              <p style="font-size:0.68rem;color:#810B38;font-weight:700;margin-bottom:0.2rem;">✦ DEMO CREDENTIALS LOADED</p>
              <p style="font-size:0.65rem;color:#541A1A;">Click "⚡ 1-Click Instant Demo Login" to enter immediately!</p>
            </div>
          </div>
        </div>

        <style>
          @media (max-width:640px) {
            .popup-form-grid { grid-template-columns:1fr !important; }
            .popup-form-grid > div:last-child { display:none !important; }
          }
        </style>
      </div>
    </div>
  `;
}

window.selectPopupRole = function (role) {
  const demos = {
    traveler:          { email: 'traveler@travora.demo',  pass: 'password123' },
    operator:          { email: 'operator@travora.demo',  pass: 'password123' },
    business_operator: { email: 'corporate@travora.demo', pass: 'password123' },
    admin:             { email: 'admin@travora.demo',     pass: 'password123' }
  };
  const d = demos[role] || demos.traveler;
  store.setState({ authRole: role });
  setTimeout(() => {
    const emailEl = document.getElementById('popup-email');
    const passEl  = document.getElementById('popup-password');
    if (emailEl) emailEl.value = d.email;
    if (passEl)  passEl.value  = d.pass;
  }, 50);
};

window.quickDemoLogin = async function (role) {
  const demos = {
    traveler:          { email: 'traveler@travora.demo',  pass: 'password123' },
    operator:          { email: 'operator@travora.demo',  pass: 'password123' },
    business_operator: { email: 'corporate@travora.demo', pass: 'password123' },
    admin:             { email: 'admin@travora.demo',     pass: 'password123' }
  };
  const targetRole = role || store.getState().authRole || 'traveler';
  const d = demos[targetRole] || demos.traveler;
  
  store.addToast(`Signing into ${targetRole.replace('_', ' ')} phase...`, 'info', 2000);
  try {
    const res = await api.login({ email: d.email, password: d.pass, role: targetRole });
    const user = res.user || res;
    localStorage.setItem('travora_user', JSON.stringify(user));

    const initView = user.role === 'admin' ? 'admin_dash'
      : user.role === 'business_operator' ? 'business_operator'
      : user.role === 'operator' ? 'operator_dash'
      : 'landing';

    store.setState({
      isAuthenticated: true,
      user,
      activeRole: user.role,
      isLoginPopupOpen: false,
      currentView: initView,
      authMode: 'login'
    });
    store.addToast(`Welcome back, ${user.name || user.email}!`, 'success', 3500);
    await window.navigateView(initView);
  } catch (err) {
    store.addToast('Login error: ' + (err.message || 'Invalid credentials'), 'critical');
  }
};

window.handlePopupLoginSubmit = async function (e) {
  e.preventDefault();
  const form = e.target;
  const emailEl = form.querySelector('[name="email"]');
  const passEl  = form.querySelector('[name="password"]');
  const email   = emailEl ? emailEl.value.trim() : '';
  const password = passEl ? passEl.value.trim() : '';
  const state   = store.getState();
  const role    = state.authRole || 'traveler';

  if (!email || !password) {
    store.addToast('Please enter email and password.', 'critical');
    return;
  }

  const btn = document.getElementById('popup-submit-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Signing in...'; }

  try {
    const res = await api.login({ email, password, role });
    const user = res.user || res;
    localStorage.setItem('travora_user', JSON.stringify(user));

    const initView = user.role === 'admin' ? 'admin_dash'
      : user.role === 'business_operator' ? 'business_operator'
      : user.role === 'operator' ? 'operator_dash'
      : 'landing';

    store.setState({
      isAuthenticated: true,
      user,
      activeRole: user.role,
      isLoginPopupOpen: false,
      currentView: initView,
      authMode: 'login'
    });
    store.addToast('Welcome back, ' + (user.name || user.email) + '! Your journey continues. ✈️', 'success', 4000);
    await window.navigateView(initView);
  } catch (err) {
    store.addToast('Login failed: ' + (err.message || 'Invalid credentials'), 'critical');
    if (btn) { btn.disabled = false; btn.textContent = `→ Sign In as ${role}`; }
  }
};

window.fillPopupDemoCredentials = function () {
  const role = (store.getState().authRole) || 'traveler';
  window.selectPopupRole(role);
  store.addToast('Demo credentials filled! Click Sign In or 1-Click Login.', 'info');
};
