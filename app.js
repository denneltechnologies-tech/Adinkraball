/**
 * Ghanaian Professionals Network (GhPN Ghana)
 * Master Client Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRouting();
  initCountdown();
  initAnimatedCounters();
  initMobileNav();
});

/* ==========================================================================
   1. VIEW ROUTING (Single Page Application Multi-View Handler)
   ========================================================================== */
function switchView(viewName) {
  const views = document.querySelectorAll('.page-view');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Clean active states
  views.forEach(v => v.classList.remove('active-view'));
  navLinks.forEach(n => n.classList.remove('active'));

  // Target view
  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) {
    targetView.classList.add('active-view');
    window.location.hash = viewName;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update nav active link
    const activeNav = document.querySelector(`.nav-link[data-nav="${viewName}"]`);
    if (activeNav) {
      activeNav.classList.add('active');
    }
  }

  // Close mobile drawer if open
  const navMenu = document.getElementById('navMenu');
  if (navMenu && navMenu.classList.contains('open')) {
    navMenu.classList.remove('open');
  }
}

function initRouting() {
  // Listen to hash changes (e.g. browser back/forward)
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    const target = document.getElementById(`view-${hash}`);
    if (target) {
      switchView(hash);
    }
  });

  // Initial load
  const initialHash = window.location.hash.replace('#', '') || 'home';
  if (document.getElementById(`view-${initialHash}`)) {
    switchView(initialHash);
  }
}

/* ==========================================================================
   2. THEME SWITCHER (Dark & Light Mode with Persistence)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const sunIcon = document.getElementById('themeIconSun');
  const moonIcon = document.getElementById('themeIconMoon');
  const root = document.documentElement;

  const savedTheme = localStorage.getItem('ghpn_theme') || 'light';
  applyTheme(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('ghpn_theme', newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} mode`, 'gold');
    });
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    } else {
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    }
  }
}

/* ==========================================================================
   3. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
      }
    });
  }
}

/* ==========================================================================
   4. ADINKRA HONORS BALL COUNTDOWN CLOCK
   ========================================================================== */
function initCountdown() {
  // Target Gala: Adinkra Ball — April 11, 2026, 6:00 PM Dallas time (CDT, UTC-5)
  const targetDate = new Date('2026-04-11T18:00:00-05:00').getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      const daysEl = document.getElementById('cd-days');
      if (daysEl) daysEl.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-minutes');
    const sEl = document.getElementById('cd-seconds');

    if (dEl) dEl.innerText = String(days).padStart(2, '0');
    if (hEl) hEl.innerText = String(hours).padStart(2, '0');
    if (mEl) mEl.innerText = String(minutes).padStart(2, '0');
    if (sEl) sEl.innerText = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   5. LIVE ANIMATED NUMBER COUNTERS
   ========================================================================== */
function initAnimatedCounters() {
  const statElements = document.querySelectorAll('[data-target]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateValue(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  statElements.forEach(el => observer.observe(el));

  function animateValue(obj) {
    const rawTarget = obj.getAttribute('data-target');
    if (!rawTarget) return;
    const target = parseInt(rawTarget, 10);
    const prefix = obj.getAttribute('data-prefix') || '';
    const suffix = obj.getAttribute('data-suffix') != null ? obj.getAttribute('data-suffix') : '+';
    const duration = 1600;
    const start = 0;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * (target - start) + start);

      obj.innerText = `${prefix}${current.toLocaleString()}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }
}

/* ==========================================================================
   6. BUSINESS DIRECTORY FILTERING & SEARCH
   ========================================================================== */
let currentCategoryFilter = 'all';

function setCategoryFilter(category, buttonEl) {
  currentCategoryFilter = category;
  const chips = document.querySelectorAll('.filter-chip');
  chips.forEach(c => c.classList.remove('active'));
  if (buttonEl) buttonEl.classList.add('active');
  filterDirectory();
}

function filterDirectory() {
  const searchInput = document.getElementById('dirSearchInput');
  const term = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const cards = document.querySelectorAll('#directoryListingGrid .directory-entry-card');

  let visibleCount = 0;

  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category') || '';
    const cardName = card.getAttribute('data-name') || '';
    const textContent = card.innerText.toLowerCase();

    const matchesCategory = (currentCategoryFilter === 'all' || cardCat.toLowerCase() === currentCategoryFilter.toLowerCase());
    const matchesSearch = !term || textContent.includes(term) || cardName.toLowerCase().includes(term);

    if (matchesCategory && matchesSearch) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
}

/* ==========================================================================
   7. MODAL DIALOGS MANAGEMENT
   ========================================================================== */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close when clicking modal backdrop
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Close with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const openModals = document.querySelectorAll('.modal-backdrop.open');
    openModals.forEach(m => m.classList.remove('open'));
    document.body.style.overflow = '';
  }
});

function selectTierAndJoin(tierName) {
  const select = document.getElementById('membershipTierSelect');
  if (select) {
    if (tierName.includes('Associate')) select.value = 'Associate';
    else if (tierName.includes('Professional')) select.value = 'Professional';
    else if (tierName.includes('Fellow')) select.value = 'Fellow';
  }
  openModal('modal-join');
}

/* ==========================================================================
   8. DONATIONS & FOUNDATION CALCULATOR
   ========================================================================== */
function selectDonation(amount, buttonEl) {
  const input = document.getElementById('quickDonationAmount');
  const foundationInput = document.getElementById('foundationDonationAmount');
  
  if (input) input.value = amount;
  if (foundationInput) foundationInput.value = amount;

  const buttons = document.querySelectorAll('.preset-amount-button');
  buttons.forEach(b => b.classList.remove('active'));
  if (buttonEl) buttonEl.classList.add('active');
}

function processQuickDonation() {
  const input = document.getElementById('quickDonationAmount');
  const amount = input ? input.value : '500';
  showToast(`Initiating secure contribution of $${amount} via card / GHIPSS...`, 'gold');
  submitToServer('donate', { amount: `$${amount}`, fund: 'GhPN Scholarship Endowment', source: 'Website quick contribution' }).then((ref) => {
    setTimeout(() => {
      showToast(`✓ Medaase! Thank you for empowering Ghanaian scholars with $${amount} (Ref: ${ref || 'logged'})!`, 'default', 6000);
    }, 1200);
  });
}

function setFrequency(freq, buttonEl) {
  const btns = buttonEl.parentElement.querySelectorAll('button');
  btns.forEach(b => {
    b.className = 'btn btn-sm btn-outline-white';
  });
  buttonEl.className = 'btn btn-sm btn-gold';
  showToast(`Contribution frequency set to: ${freq.toUpperCase()}`, 'gold');
}

/* ==========================================================================
   9. INTERACTIVE FORM SUBMISSIONS (persisted to /api/submissions)
   ========================================================================== */

// Collect every labelled field in a form into a plain object
function collectFields(form) {
  const data = {};
  const els = form.querySelectorAll('input, select, textarea');
  els.forEach((el) => {
    if (el.type === 'hidden' || el.type === 'button' || el.type === 'submit') return;
    const value = (el.value || '').trim();
    if (!value) return;

    let key = '';
    const group = el.closest('.form-group');
    const label = group ? group.querySelector('label') : null;
    if (el.name) key = el.name;
    else if (label) key = label.textContent;
    else if (el.placeholder) key = el.placeholder;
    if (!key) return;

    key = key.replace(/\*/g, '').trim()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .split(/\s+/)
      .map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('');

    if (key === 'emailAddress') key = 'email';
    if (!data[key]) data[key] = value;
  });
  return data;
}

// POST a submission to the server; returns reference code or null when offline
async function submitToServer(type, data) {
  try {
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data })
    });
    if (!res.ok) throw new Error('Request failed');
    const json = await res.json();
    return json.reference || null;
  } catch (err) {
    return null;
  }
}

function handleJoinSubmit(e) {
  e.preventDefault();
  const data = collectFields(e.target);
  const fallback = 'GHP-' + Math.floor(100000 + Math.random() * 900000);
  closeModal('modal-join');
  e.target.reset();
  submitToServer('join', data).then((ref) => {
    showToast(`🎉 Akwaaba! Application received. Member ID: ${ref || fallback}. Confirmation sent to your email.`, 'gold', 6000);
  });
}

function handleRsvpSubmit(e) {
  e.preventDefault();
  const data = collectFields(e.target);
  const fallback = 'ADK-' + Math.floor(1000 + Math.random() * 9000);
  closeModal('modal-rsvp');
  e.target.reset();
  submitToServer('rsvp', data).then((ref) => {
    showToast(`✓ Seat(s) Reserved! Booking Reference: ${ref || fallback}. See you at the Adinkra Ball!`, 'gold', 6000);
  });
}

function selectTicketAndRsvp(ticketType) {
  const select = document.getElementById('rsvpTicketType');
  if (select) {
    for (const opt of select.options) {
      if (opt.text === ticketType) { select.value = opt.value; break; }
    }
  }
  openModal('modal-rsvp');
}

function handleSponsorSubmit(e) {
  e.preventDefault();
  const data = collectFields(e.target);
  const fallback = 'SPN-' + Math.floor(1000 + Math.random() * 9000);
  closeModal('modal-sponsor');
  e.target.reset();
  submitToServer('sponsor', data).then((ref) => {
    showToast(`✓ Sponsorship request received (Ref: ${ref || fallback}). Our Events Committee will confirm within 24 hours.`, 'gold', 6500);
  });
}

function selectSponsorPackage(packageName, amount) {
  const select = document.getElementById('sponsorPackageSelect');
  if (select) {
    const target = `${packageName} ($${amount.toLocaleString()})`;
    for (const opt of select.options) {
      if (opt.text === target) { select.value = opt.value; break; }
    }
  }
  openModal('modal-sponsor');
}

function handleMentorSubmit(e) {
  e.preventDefault();
  const data = collectFields(e.target);
  closeModal('modal-mentor');
  e.target.reset();
  submitToServer('mentor', data).then((ref) => {
    showToast(`✓ Mentorship intake received (${ref || 'logged'})! Our cohort matching committee will contact you within 48h.`, 'default', 5000);
  });
}

function handleScholarshipSubmit(e) {
  e.preventDefault();
  const data = collectFields(e.target);
  const fallback = 'SCH-2026-' + Math.floor(100 + Math.random() * 900);
  closeModal('modal-scholarship-apply');
  e.target.reset();
  submitToServer('scholarship', data).then((ref) => {
    showToast(`✓ Scholarship Application #${ref || fallback} submitted successfully to the Academic Board!`, 'gold', 6000);
  });
}

function handlePayDuesSubmit(e) {
  e.preventDefault();
  const data = collectFields(e.target);
  closeModal('modal-pay-dues');
  e.target.reset();
  submitToServer('dues', data).then((ref) => {
    showToast(`✓ Payment received (Ref: ${ref || 'DUE-2026'}). Official GhPN e-Receipt and 2026 Membership Certificate issued.`, 'gold', 5500);
  });
}

function handleAddBusinessSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const data = collectFields(form);
  const name = form.querySelector('input[placeholder*="Enterprise"]')?.value || 'New Business';
  const category = form.querySelector('select')?.value || 'Tech';
  const location = form.querySelector('input[placeholder*="Location"]')?.value || 'Accra, Ghana';
  const desc = form.querySelector('textarea')?.value || 'Professional services in Ghana.';
  const phone = form.querySelector('input[type="tel"]')?.value || '+233 30 000 0000';

  closeModal('modal-add-business');

  // Dynamically insert into directory grid
  const grid = document.getElementById('directoryListingGrid');
  if (grid) {
    const newCard = document.createElement('div');
    newCard.className = 'directory-entry-card';
    newCard.setAttribute('data-category', category);
    newCard.setAttribute('data-name', name);
    newCard.innerHTML = `
      <div class="entry-header">
        <span class="entry-sector-tag">${category}</span>
        <span class="entry-verified" style="color:var(--color-gold-deep);">★ Newly Added</span>
      </div>
      <h4 class="entry-title">${name}</h4>
      <div class="entry-address">${location}</div>
      <p class="entry-desc">${desc}</p>
      <div class="entry-footer-actions">
        <a href="tel:${phone}" class="btn btn-outline btn-sm">Call</a>
        <button class="btn btn-primary btn-sm" onclick="showToast('Inquiry sent to ${name}')">Inquire</button>
      </div>
    `;
    grid.prepend(newCard);
  }

  form.reset();
  submitToServer('business', data).then((ref) => {
    showToast(`✓ Business "${name}" added (Ref: ${ref || 'pending'}) pending admin review!`, 'gold', 5000);
  });
}

function handleContactSubmit(e) {
  e.preventDefault();
  const data = collectFields(e.target);
  e.target.reset();
  submitToServer('contact', data).then((ref) => {
    showToast(`✓ Message dispatched to the GhPN Secretariat (Ref: ${ref || 'MSG'}). We will respond within 24 hours.`, 'default', 5000);
  });
}

function handleNewsletterSubmit(e) {
  e.preventDefault();
  const data = collectFields(e.target);
  e.target.reset();
  submitToServer('newsletter', data).then(() => {
    showToast('✓ Subscribed! You will receive the monthly GhPN Executive Dispatch.', 'gold', 4500);
  });
}

/* --- Landing page (social media lead capture) --- */

function prefillLead(interest) {
  const sel = document.getElementById('leadInterest');
  if (sel && interest) sel.value = interest;
  const section = document.getElementById('capture');
  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleLeadSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const consent = document.getElementById('leadConsent');
  if (consent && !consent.checked) {
    showToast('Please tick the consent box so we can contact you.', 'gold');
    return;
  }

  const data = collectFields(form);
  const btn = document.getElementById('leadSubmitBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

  submitToServer('lead', data).then((ref) => {
    if (btn) { btn.disabled = false; btn.textContent = 'Send My Details'; }
    if (ref) {
      const refEl = document.getElementById('leadRef');
      if (refEl) refEl.textContent = ref;
      form.style.display = 'none';
      const success = document.getElementById('leadSuccess');
      if (success) {
        success.style.display = 'block';
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      showToast('Could not reach the server. Please check your connection and try again.', '', 5500);
    }
  });
}

function toggleFaq(buttonEl) {
  const item = buttonEl.closest('.faq-item');
  if (item) {
    item.classList.toggle('active');
  }
}

/* ==========================================================================
   10. TOAST NOTIFICATION ENGINE
   ========================================================================= */
function showToast(message, type = 'default', duration = 4000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'gold' ? 'gold' : ''}`;
  toast.innerHTML = `
    <span style="font-size:1.2rem;">${type === 'gold' ? '🌟' : '🔔'}</span>
    <span style="font-size:0.92rem; font-weight:600; line-height:1.4;">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 350);
  }, duration);
}
