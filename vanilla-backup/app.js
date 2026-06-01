/* -------------------------------------------------------------
   TOURISTA - INTERACTIVE JS CONTROLLER & STATE MANAGER
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  let currentUser = JSON.parse(localStorage.getItem('tourista_user')) || null;
  let savedTrips = JSON.parse(localStorage.getItem('tourista_saved_trips')) || [];

  // Default mock trips for empty dashboards to display aesthetic density immediately
  const defaultMockTrips = [
    {
      id: 'mock-1',
      title: 'Bespoke Rajasthan Heritage Odyssey',
      destination: 'Rajasthan',
      dates: 'Oct 12 - Oct 20, 2026',
      budget: 'luxury',
      duration: 8,
      status: 'upcoming',
      progress: 60,
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'mock-2',
      title: 'Tropical Calm: Ayurvedic Stays in Kerala',
      destination: 'Kerala',
      dates: 'Jan 05 - Jan 11, 2026',
      budget: 'moderate',
      duration: 6,
      status: 'completed',
      progress: 100,
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80'
    }
  ];

  if (savedTrips.length === 0) {
    savedTrips = [...defaultMockTrips];
    localStorage.setItem('tourista_saved_trips', JSON.stringify(savedTrips));
  }

  // ==========================================
  // TOAST NOTIFICATION SYSTEM
  // ==========================================
  const toastContainer = document.getElementById('toast-container');

  const toastIcons = {
    success: '<svg class="toast-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
    error: '<svg class="toast-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
    info: '<svg class="toast-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>'
  };

  function showToast(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      ${toastIcons[type] || toastIcons.info}
      <span>${message}</span>
      <button class="toast-close" aria-label="Close notification">
        <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => dismissToast(toast));
    toastContainer.appendChild(toast);

    const timer = setTimeout(() => dismissToast(toast), duration);
    toast._timer = timer;
  }

  function dismissToast(toast) {
    if (toast._dismissed) return;
    toast._dismissed = true;
    clearTimeout(toast._timer);
    toast.classList.add('toast-exit');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 350);
  }


  // ==========================================
  // DESTINATIONS DIRECTORY DATA (MOCKS)
  // ==========================================
  const destinationsData = [
    {
      id: 'rajasthan',
      title: 'Rajasthan',
      category: 'heritage',
      duration: 8,
      durationType: 'medium',
      price: 2400,
      rating: 4.9,
      description: 'Wander through golden deserts, colossal palaces, and local craft bazaars. Sleep in ancient fortresses converted to luxury resorts.',
      images: [
        'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1477584322904-48618db51a7a?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1524492449527-180b7e44b8d6?auto=format&fit=crop&w=600&q=80'
      ]
    },
    {
      id: 'kerala',
      title: 'Kerala',
      category: 'wildlife',
      duration: 6,
      durationType: 'medium',
      price: 1900,
      rating: 4.8,
      description: 'Glide silently down winding backwaters on luxury houseboats, and experience authentic Ayurvedic healing therapies in dense rainforests.',
      images: [
        'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1506461883276-594a12b11cc3?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1546967191-fdfb13ed6b1e?auto=format&fit=crop&w=600&q=80'
      ]
    },
    {
      id: 'ladakh',
      title: 'Leh-Ladakh',
      category: 'mountains',
      duration: 9,
      durationType: 'long',
      price: 2800,
      rating: 4.95,
      description: 'Ascend into the sky. Experience striking high-altitude salt lakes, centuries-old Buddhist monasteries, and private glamping under stars.',
      images: [
        'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1526761122248-c81e93f6244f?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80'
      ]
    },
    {
      id: 'goa',
      title: 'Goa',
      category: 'beaches',
      duration: 4,
      durationType: 'short',
      price: 1200,
      rating: 4.7,
      description: 'Relax on quiet white-sand beaches, stroll through Portuguese colonial heritage villas, and dine on fresh local coastal seafood.',
      images: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1614082242765-7c98cdc0d2df?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1546967191-fdfb13ed6b1e?auto=format&fit=crop&w=600&q=80'
      ]
    },
    {
      id: 'andaman',
      title: 'Andaman Islands',
      category: 'beaches',
      duration: 5,
      durationType: 'short',
      price: 2200,
      rating: 4.85,
      description: 'Submerge in tropical isolation. Explore crystal coral reefs, dive deep shipwrecks, and sleep in private eco-luxury thatch chalets.',
      images: [
        'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
      ]
    },
    {
      id: 'corbett',
      title: 'Jim Corbett',
      category: 'wildlife',
      duration: 3,
      durationType: 'short',
      price: 1400,
      rating: 4.65,
      description: 'Trace the path of the Bengal tiger on private open safaris, staying in modern riverwood wilderness lodges bordering deep forests.',
      images: [
        'https://images.unsplash.com/photo-1615959189197-484e03aa3b1b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1581852017103-e3acca7ea1a8?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80'
      ]
    }
  ];

  // ==========================================
  // VIEW NAVIGATION ENGINE (SPA SINGLE PAGE APP)
  // ==========================================
  const viewSections = document.querySelectorAll('.view-section');
  const desktopNavItems = document.querySelectorAll('.nav-links li');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-panel li');
  const footerNavLinks = document.querySelectorAll('.footer-col li, .footer-brand');

  // Flag to prevent recursive hash changes
  let _suppressHashChange = false;

  function switchView(viewId, updateHash = true) {
    // Hide active sticky action bar if switching away from planner itinerary
    if (viewId !== 'planner' || !document.getElementById('planner-itinerary-dashboard').classList.contains('active')) {
      document.getElementById('itinerary-sticky-action-bar').classList.remove('active');
    } else {
      document.getElementById('itinerary-sticky-action-bar').classList.add('active');
    }

    // Deactivate scroll header styling unless on homepage with scroll
    if (viewId !== 'home') {
      document.getElementById('global-header').classList.add('scrolled');
    } else if (window.scrollY <= 50) {
      document.getElementById('global-header').classList.remove('scrolled');
    }

    // Toggle sections active states
    viewSections.forEach(section => {
      if (section.id === `view-${viewId}`) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    // Update Desktop Nav Active States
    desktopNavItems.forEach(item => {
      if (item.getAttribute('data-view') === viewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update Mobile Nav Panel Active States
    mobileNavItems.forEach(item => {
      if (item.getAttribute('data-view') === viewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Close Mobile Drawer if open
    document.getElementById('mobile-nav-drawer').classList.remove('active');
    document.getElementById('mobile-menu-toggle').classList.remove('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update URL hash for browser history
    if (updateHash) {
      _suppressHashChange = true;
      window.location.hash = viewId === 'home' ? '' : viewId;
      // Reset flag after the hashchange event would have fired
      setTimeout(() => { _suppressHashChange = false; }, 50);
    }
  }

  // Hash-based routing: handle browser back/forward and direct URL entry
  function handleHashRoute() {
    if (_suppressHashChange) return;
    const hash = window.location.hash.replace('#', '').trim();
    const validViews = ['home', 'explore', 'planner', 'saved', 'blog', 'contact'];
    if (hash && validViews.includes(hash)) {
      switchView(hash, false);
    } else {
      switchView('home', false);
    }
  }

  window.addEventListener('hashchange', handleHashRoute);

  // Register Event Triggers on Nav Bar Click
  desktopNavItems.forEach(li => {
    li.addEventListener('click', (e) => {
      e.preventDefault();
      const view = li.getAttribute('data-view');
      switchView(view);
    });
  });

  mobileNavItems.forEach(li => {
    li.addEventListener('click', (e) => {
      e.preventDefault();
      const view = li.getAttribute('data-view');
      switchView(view);
    });
  });

  footerNavLinks.forEach(item => {
    item.addEventListener('click', (e) => {
      const view = item.getAttribute('data-view');
      if (view) {
        e.preventDefault();
        switchView(view);
      }
    });
  });

  // Dynamic profile dropdown redirect
  document.querySelectorAll('.user-dropdown .dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const view = item.getAttribute('data-view');
      if (view) {
        e.stopPropagation();
        document.getElementById('user-dropdown-menu').classList.remove('active');
        switchView(view);
      }
    });
  });

  // Logo Link click resets home
  document.getElementById('logo-link').addEventListener('click', (e) => {
    e.preventDefault();
    switchView('home');
  });

  // Inline buttons switches
  document.getElementById('hero-planner-btn').addEventListener('click', () => switchView('planner'));
  document.getElementById('hero-explore-btn').addEventListener('click', () => switchView('explore'));

  // Homepage featured destination cards click-through
  document.querySelectorAll('.featured-dest-card').forEach(card => {
    card.addEventListener('click', () => {
      const dest = card.getAttribute('data-dest');
      if (dest) {
        document.getElementById('planner-destination-input').value = dest;
        switchView('planner');
      }
    });
    // Also handle keyboard Enter/Space for accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Header Scroll Class management
  window.addEventListener('scroll', () => {
    const currentView = document.querySelector('.view-section.active');
    if (!currentView) return;
    if (window.scrollY > 50 || currentView.id !== 'view-home') {
      document.getElementById('global-header').classList.add('scrolled');
    } else {
      document.getElementById('global-header').classList.remove('scrolled');
    }
  });

  // Mobile Hamburger Toggle Click
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    mobileDrawer.classList.toggle('active');
  });

  // Close mobile drawer when clicking content body outside
  document.addEventListener('click', (e) => {
    if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target) && mobileDrawer.classList.contains('active')) {
      mobileDrawer.classList.remove('active');
      mobileToggle.classList.remove('active');
    }
  });

  // ==========================================
  // DARK MODE TOGGLE
  // ==========================================
  const darkModeBtn = document.getElementById('dark-mode-toggle-btn');
  const moonIcon = darkModeBtn.querySelector('.dm-icon-moon');
  const sunIcon = darkModeBtn.querySelector('.dm-icon-sun');

  function applyDarkMode(isDark) {
    if (isDark) {
      document.body.classList.add('dark-mode');
      moonIcon.style.display = 'none';
      sunIcon.style.display = 'block';
    } else {
      document.body.classList.remove('dark-mode');
      moonIcon.style.display = 'block';
      sunIcon.style.display = 'none';
    }
  }

  // Load saved preference
  const savedDarkMode = localStorage.getItem('tourista_dark_mode') === 'true';
  applyDarkMode(savedDarkMode);

  darkModeBtn.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    applyDarkMode(isDark);
    localStorage.setItem('tourista_dark_mode', isDark.toString());
    showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled', 'info', 2000);
  });


  // ==========================================
  // AUTHENTICATION MODAL & STATES
  // ==========================================
  const authModal = document.getElementById('global-auth-modal');
  const authTriggers = document.querySelectorAll('.auth-trigger-btn');
  const authClose = document.getElementById('auth-modal-close');
  
  const signinForm = document.getElementById('signin-form-element');
  const signupForm = document.getElementById('signup-form-element');
  
  const authViewSignin = document.getElementById('auth-view-signin');
  const authViewSignup = document.getElementById('auth-view-signup');
  
  const switchToSignup = document.getElementById('auth-switch-to-signup');
  const switchToSignin = document.getElementById('auth-switch-to-signin');

  // Open auth popup modal
  authTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      authModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock scrolling
    });
  });

  // Close modal
  function closeAuthModal() {
    authModal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Free scroll
    // Clear validation error highlights
    document.querySelectorAll('.input-wrap-saas').forEach(div => div.classList.remove('error-state'));
  }
  
  authClose.addEventListener('click', closeAuthModal);
  
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) closeAuthModal();
  });

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (authModal.classList.contains('active')) closeAuthModal();
      if (document.getElementById('blog-reader-modal').classList.contains('active')) closeBlogReader();
    }
  });

  // Switch modal view states (clear errors on switch)
  switchToSignup.addEventListener('click', () => {
    document.querySelectorAll('.input-wrap-saas').forEach(div => div.classList.remove('error-state'));
    authViewSignin.classList.remove('active');
    authViewSignup.classList.add('active');
  });

  switchToSignin.addEventListener('click', () => {
    document.querySelectorAll('.input-wrap-saas').forEach(div => div.classList.remove('error-state'));
    authViewSignup.classList.remove('active');
    authViewSignin.classList.add('active');
  });

  // Update navbar layout items based on auth states
  function updateAuthUI() {
    const navAuthBtn = document.getElementById('nav-auth-btn');
    const userProfileBtn = document.getElementById('user-profile-btn');
    const userAvatar = document.getElementById('user-avatar');
    const dropdownName = document.getElementById('dropdown-user-name');
    const dropdownEmail = document.getElementById('dropdown-user-email');
    
    const profileName = document.getElementById('profile-user-name');
    const profileEmail = document.getElementById('profile-user-email');
    const profileAvatarLarge = document.getElementById('profile-avatar-node');
    const profileBtnActions = document.getElementById('profile-btn-actions');
    
    const footerSignout = document.getElementById('footer-signout-trigger-btn');
    const drawerSignout = document.getElementById('mobile-drawer-signout-btn');
    const drawerAuth = document.getElementById('mobile-drawer-auth-btn');

    if (currentUser) {
      // User logged in
      navAuthBtn.style.display = 'none';
      drawerAuth.style.display = 'none';
      userProfileBtn.style.display = 'flex';
      
      const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
      userAvatar.textContent = initials;
      dropdownName.textContent = currentUser.name;
      dropdownEmail.textContent = currentUser.email;

      // Dashboard
      profileName.textContent = currentUser.name;
      profileEmail.textContent = currentUser.email;
      profileAvatarLarge.textContent = initials;
      profileBtnActions.innerHTML = `<button class="btn btn-outline" id="profile-signout-btn">Sign Out</button>`;
      
      // Footer discrete and Mobile Drawer triggers
      footerSignout.style.display = 'inline-block';
      drawerSignout.style.display = 'block';

      // Attach dynamic click trigger to newly created dashboard signout button
      document.getElementById('profile-signout-btn').addEventListener('click', handleLogout);

    } else {
      // User logged out
      navAuthBtn.style.display = 'inline-flex';
      drawerAuth.style.display = 'block';
      userProfileBtn.style.display = 'none';
      
      // Dashboard empty
      profileName.textContent = 'Guest Traveler';
      profileEmail.textContent = 'Sign in to save and access itineraries.';
      profileAvatarLarge.textContent = 'GT';
      profileBtnActions.innerHTML = `<button class="btn btn-primary auth-trigger-btn" id="dashboard-signin-btn">Sign In</button>`;
      
      // Footer discrete and Mobile Drawer triggers
      footerSignout.style.display = 'none';
      drawerSignout.style.display = 'none';

      // Re-attach modal trigger
      document.getElementById('dashboard-signin-btn').addEventListener('click', () => {
        authModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    // Refresh trips display
    renderSavedTrips();
  }

  // Handle Log Out Action
  function handleLogout() {
    currentUser = null;
    localStorage.removeItem('tourista_user');
    updateAuthUI();
    document.getElementById('user-dropdown-menu').classList.remove('active');
    switchView('home');
    showToast('You have been signed out successfully.', 'info');
  }

  document.getElementById('dropdown-signout-btn').addEventListener('click', handleLogout);
  document.getElementById('footer-signout-trigger-btn').addEventListener('click', handleLogout);
  document.getElementById('mobile-drawer-signout-btn').addEventListener('click', handleLogout);

  // Toggle user profile dropdown window
  const userProfileBtn = document.getElementById('user-profile-btn');
  const userDropdownMenu = document.getElementById('user-dropdown-menu');
  
  userProfileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdownMenu.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    userDropdownMenu.classList.remove('active');
  });

  // Email validation helper
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Sign-in form validation & login
  signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('signin-email');
    const passInput = document.getElementById('signin-password');
    const email = emailInput.value.trim();
    const password = passInput.value;
    let valid = true;

    // Clear previous errors
    document.querySelectorAll('#signin-form-element .input-wrap-saas').forEach(div => div.classList.remove('error-state'));

    // Email validation
    if (!isValidEmail(email)) {
      emailInput.closest('.input-wrap-saas').classList.add('error-state');
      valid = false;
    }

    // Password validation
    if (password.length < 6) {
      passInput.closest('.input-wrap-saas').classList.add('error-state');
      valid = false;
    }

    if (valid) {
      currentUser = {
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        email: email
      };
      localStorage.setItem('tourista_user', JSON.stringify(currentUser));
      updateAuthUI();
      closeAuthModal();
      showToast(`Welcome back, ${currentUser.name}!`, 'success');
      
      // Save pending itinerary if any exists in local wizard state
      const tempIti = localStorage.getItem('temp_itinerary_payload');
      if (tempIti) {
        saveItineraryAction(JSON.parse(tempIti));
        localStorage.removeItem('temp_itinerary_payload');
      }
    }
  });

  // Sign-up form validation & registration
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const passInput = document.getElementById('signup-password');
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passInput.value;
    let valid = true;

    // Clear previous errors
    document.querySelectorAll('#signup-form-element .input-wrap-saas').forEach(div => div.classList.remove('error-state'));

    // Name validation
    if (name.length < 2) {
      nameInput.closest('.input-wrap-saas').classList.add('error-state');
      valid = false;
    }

    // Email validation
    if (!isValidEmail(email)) {
      emailInput.closest('.input-wrap-saas').classList.add('error-state');
      valid = false;
    }

    // Password validation
    if (password.length < 6) {
      passInput.closest('.input-wrap-saas').classList.add('error-state');
      valid = false;
    }

    if (valid) {
      currentUser = {
        name: name,
        email: email
      };
      localStorage.setItem('tourista_user', JSON.stringify(currentUser));
      updateAuthUI();
      closeAuthModal();
      showToast(`Welcome to Tourista, ${currentUser.name}!`, 'success');
      
      const tempIti = localStorage.getItem('temp_itinerary_payload');
      if (tempIti) {
        saveItineraryAction(JSON.parse(tempIti));
        localStorage.removeItem('temp_itinerary_payload');
      }
    }
  });

  // Social Auth Simulation (Google / Apple)
  function simulateSocialLogin(provider) {
    const mockNames = {
      google: ['Arjun Mehta', 'Priya Sharma', 'Vikram Patel', 'Anita Reddy'],
      apple: ['Karan Singh', 'Neha Kapoor', 'Rohit Verma', 'Sunita Nair']
    };
    const names = mockNames[provider] || mockNames.google;
    const randomName = names[Math.floor(Math.random() * names.length)];
    const emailHandle = randomName.toLowerCase().replace(' ', '.') + '@' + (provider === 'apple' ? 'icloud.com' : 'gmail.com');

    currentUser = { name: randomName, email: emailHandle };
    localStorage.setItem('tourista_user', JSON.stringify(currentUser));
    updateAuthUI();
    closeAuthModal();
    showToast(`Signed in with ${provider.charAt(0).toUpperCase() + provider.slice(1)} as ${randomName}`, 'success');

    const tempIti = localStorage.getItem('temp_itinerary_payload');
    if (tempIti) {
      saveItineraryAction(JSON.parse(tempIti));
      localStorage.removeItem('temp_itinerary_payload');
    }
  }

  document.getElementById('signin-google-btn').addEventListener('click', () => simulateSocialLogin('google'));
  document.getElementById('signin-apple-btn').addEventListener('click', () => simulateSocialLogin('apple'));
  document.getElementById('signup-google-btn').addEventListener('click', () => simulateSocialLogin('google'));
  document.getElementById('signup-apple-btn').addEventListener('click', () => simulateSocialLogin('apple'));

  // Forgot password handler
  document.getElementById('forgot-password-link').addEventListener('click', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('signin-email');
    const email = emailInput.value.trim();
    if (email && isValidEmail(email)) {
      showToast(`Password reset link sent to ${email}. Check your inbox.`, 'success');
    } else {
      showToast('Enter your email address above first, then click Forgot Password.', 'info');
      emailInput.focus();
    }
  });

  // Initialize UI auth controls
  updateAuthUI();


  // ==========================================
  // DESTINATIONS BROWSE & MULTI-IMAGE CAROUSELS
  // ==========================================
  let activeFilters = {
    category: 'all',
    budget: 5000,
    duration: 'all'
  };

  const exploreGrid = document.getElementById('explore-results-grid');
  const budgetSlider = document.getElementById('budget-range-input');
  const budgetValueDisplay = document.getElementById('budget-value-display');
  const durationGroup = document.getElementById('duration-filter-group');

  // Format currency output helper
  function formatUSD(num) {
    return '$' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Update budget slider outputs
  budgetSlider.addEventListener('input', (e) => {
    activeFilters.budget = parseInt(e.target.value);
    budgetValueDisplay.textContent = formatUSD(activeFilters.budget);
    renderExploreDestinations();
  });

  // Register categories selector triggers
  document.querySelectorAll('.filter-sidebar .category-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-sidebar .category-chip-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters.category = btn.getAttribute('data-category');
      renderExploreDestinations();
    });
  });

  // Mobile horizontal category scroll triggers
  document.querySelectorAll('#mobile-filter-chips button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#mobile-filter-chips button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters.category = btn.getAttribute('data-category');
      renderExploreDestinations();
    });
  });

  // Duration selection chips triggers
  durationGroup.querySelectorAll('.duration-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      durationGroup.querySelectorAll('.duration-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters.duration = btn.getAttribute('data-duration');
      renderExploreDestinations();
    });
  });

  // Track carousel current images mapping by destination card
  let cardCarouselIndices = {};

  function renderExploreDestinations() {
    exploreGrid.innerHTML = '';
    
    // Filter array based on settings
    const filteredList = destinationsData.filter(item => {
      const matchCategory = activeFilters.category === 'all' || item.category === activeFilters.category;
      const matchBudget = item.price <= activeFilters.budget;
      
      let matchDuration = true;
      if (activeFilters.duration === 'short') {
        matchDuration = item.duration >= 3 && item.duration <= 5;
      } else if (activeFilters.duration === 'medium') {
        matchDuration = item.duration >= 6 && item.duration <= 8;
      } else if (activeFilters.duration === 'long') {
        matchDuration = item.duration >= 9;
      }

      return matchCategory && matchBudget && matchDuration;
    });

    if (filteredList.length === 0) {
      exploreGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 0;">
          <h4 class="serif-text" style="font-size:1.8rem; margin-bottom:0.5rem;">No Escapes Matched</h4>
          <p style="color:var(--text-muted);">Try adjusting your filters or raising your max budget caps.</p>
        </div>
      `;
      return;
    }

    filteredList.forEach(item => {
      cardCarouselIndices[item.id] = cardCarouselIndices[item.id] || 0;

      // Construct slide images HTML
      let slidesHtml = '';
      item.images.forEach(img => {
        slidesHtml += `
          <div class="carousel-slide">
            <img src="${img}" alt="${item.title}">
          </div>
        `;
      });

      // Construct dots indicator pagination dots
      let dotsHtml = '';
      item.images.forEach((_, idx) => {
        dotsHtml += `
          <button class="carousel-dot ${idx === cardCarouselIndices[item.id] ? 'active' : ''}" data-idx="${idx}"></button>
        `;
      });

      const card = document.createElement('article');
      card.className = 'dest-card';
      card.innerHTML = `
        <!-- Image Slider Carousel -->
        <div class="carousel-container" id="carousel-${item.id}">
          <div class="carousel-track" style="transform: translateX(-${cardCarouselIndices[item.id] * 100}%);">
            ${slidesHtml}
          </div>
          
          <!-- Slider Controls Arrows on hover -->
          <button class="carousel-btn carousel-btn-left" aria-label="Previous Slide">
            <svg class="carousel-arrow-svg" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
          </button>
          <button class="carousel-btn carousel-btn-right" aria-label="Next Slide">
            <svg class="carousel-arrow-svg" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
          </button>
          
          <!-- Rating badge & categories label -->
          <span class="dest-rating">
            <svg class="star-icon" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            ${item.rating}
          </span>
          <span class="dest-tag badge badge-accent">${item.category}</span>

          <!-- Pagination indicators -->
          <div class="carousel-dots">
            ${dotsHtml}
          </div>
        </div>

        <div class="dest-info">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <div class="dest-meta">
            <span class="dest-days">${item.duration} Days</span>
            <span class="dest-price">${formatUSD(item.price)}</span>
          </div>
          <button class="btn btn-primary btn-sm" style="margin-top: 1.5rem; width: 100%;" data-planner-dest="${item.title}">
            Plan Trip
          </button>
        </div>
      `;

      // Set up click triggers on carousel controls
      const track = card.querySelector('.carousel-track');
      const dots = card.querySelectorAll('.carousel-dot');
      const totalSlides = item.images.length;

      function shiftSlider(newIdx) {
        cardCarouselIndices[item.id] = newIdx;
        track.style.transform = `translateX(-${newIdx * 100}%)`;
        dots.forEach((dot, dIdx) => {
          if (dIdx === newIdx) dot.classList.add('active');
          else dot.classList.remove('active');
        });
      }

      card.querySelector('.carousel-btn-left').addEventListener('click', () => {
        let newIdx = cardCarouselIndices[item.id] - 1;
        if (newIdx < 0) newIdx = totalSlides - 1;
        shiftSlider(newIdx);
      });

      card.querySelector('.carousel-btn-right').addEventListener('click', () => {
        let newIdx = cardCarouselIndices[item.id] + 1;
        if (newIdx >= totalSlides) newIdx = 0;
        shiftSlider(newIdx);
      });

      dots.forEach((dot, dotIdx) => {
        dot.addEventListener('click', () => {
          shiftSlider(dotIdx);
        });
      });

      // Quick inline CTA trigger: "Plan Trip" buttons
      card.querySelector('button[data-planner-dest]').addEventListener('click', () => {
        document.getElementById('planner-destination-input').value = item.title;
        switchView('planner');
      });

      exploreGrid.appendChild(card);
    });

    // Update filter counts
    updateSidebarCountDisplay();
  }

  function updateSidebarCountDisplay() {
    const counts = {
      all: destinationsData.length,
      beaches: 0,
      mountains: 0,
      heritage: 0,
      wildlife: 0
    };

    destinationsData.forEach(item => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }
    });

    for (let key in counts) {
      const displayNode = document.getElementById(`count-${key}`);
      if (displayNode) displayNode.textContent = `(${counts[key]})`;
    }
  }

  // Initial explore render
  renderExploreDestinations();


  // ==========================================
  // AI TRIP PLANNER PAGE WIZARD & CALENDAR
  // ==========================================
  let activeStep = 1;
  const plannerForm = document.getElementById('ai-planner-form');
  const wizardSteps = document.querySelectorAll('.wizard-form-step');
  const progressNodes = document.querySelectorAll('.wizard-step-node');
  const progressBarTrackLine = document.getElementById('wizard-track-line');
  
  const nextBtn = document.getElementById('wizard-next-btn');
  const backBtn = document.getElementById('wizard-back-btn');
  
  const destInput = document.getElementById('planner-destination-input');
  const suggestionsList = document.getElementById('planner-suggestions-list');

  // Destination autocomplete triggers
  const destinationsListOptions = ['Goa', 'Kerala', 'Rajasthan', 'Leh-Ladakh', 'Andaman Islands', 'Jim Corbett', 'Mumbai', 'Delhi', 'Agra', 'Varanasi'];

  destInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    suggestionsList.innerHTML = '';
    
    if (!val) {
      suggestionsList.classList.remove('active');
      return;
    }

    const matches = destinationsListOptions.filter(item => item.toLowerCase().includes(val));
    if (matches.length === 0) {
      suggestionsList.classList.remove('active');
      return;
    }

    matches.forEach(item => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.textContent = item;
      div.addEventListener('click', () => {
        destInput.value = item;
        suggestionsList.classList.remove('active');
      });
      suggestionsList.appendChild(div);
    });

    suggestionsList.classList.add('active');
  });

  document.addEventListener('click', (e) => {
    if (!destInput.contains(e.target) && !suggestionsList.contains(e.target)) {
      suggestionsList.classList.remove('active');
    }
  });

  // ==========================================
  // CALENDAR WITH MONTH NAVIGATION
  // ==========================================
  const calendarGrid = document.getElementById('calendar-days-element');
  const startDateInput = document.getElementById('planner-start-date');
  const endDateInput = document.getElementById('planner-end-date');
  const calendarMonthTitle = document.getElementById('calendar-month-title');

  // Calendar state
  let calendarMonth = 9;  // 0-indexed, October = 9
  let calendarYear = 2026;
  let calendarStartDate = 12; // Default mock date start day number
  let calendarEndDate = 15; // Default mock date end day number

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  }

  function renderCalendarDays() {
    calendarGrid.innerHTML = '';
    calendarMonthTitle.textContent = `${monthNames[calendarMonth]} ${calendarYear}`;
    
    const offset = getFirstDayOfMonth(calendarYear, calendarMonth);
    const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);

    // Today for disabling past dates
    const today = new Date();
    const currentMonthIsNow = (calendarYear === today.getFullYear() && calendarMonth === today.getMonth());

    for (let i = 0; i < offset; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'calendar-day-node muted';
      calendarGrid.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayBtn = document.createElement('button');
      dayBtn.type = 'button';
      dayBtn.className = 'calendar-day-node';
      dayBtn.textContent = day;

      // Lock dates before today for the current month
      if (currentMonthIsNow && day < today.getDate()) {
        dayBtn.classList.add('muted');
        dayBtn.disabled = true;
      }

      // Add selection classes
      if (calendarStartDate && day === calendarStartDate) {
        dayBtn.classList.add('selected-range-start');
      } else if (calendarEndDate && day === calendarEndDate) {
        dayBtn.classList.add('selected-range-end');
      } else if (calendarStartDate && calendarEndDate && day > calendarStartDate && day < calendarEndDate) {
        dayBtn.classList.add('selected-range-mid');
      }

      dayBtn.addEventListener('click', () => {
        handleCalendarDayClick(day);
      });

      calendarGrid.appendChild(dayBtn);
    }
  }

  function handleCalendarDayClick(day) {
    if (!calendarStartDate || (calendarStartDate && calendarEndDate)) {
      // First click: sets start date and clears end date
      calendarStartDate = day;
      calendarEndDate = null;
    } else if (calendarStartDate && !calendarEndDate) {
      if (day < calendarStartDate) {
        // Clicked day is before start date: reset start date
        calendarStartDate = day;
      } else if (day === calendarStartDate) {
        // Same day: do nothing or reset
        calendarStartDate = day;
        calendarEndDate = null;
      } else {
        // Set end date
        calendarEndDate = day;
      }
    }

    // Save inputs (pad with zero for form value)
    const monthStr = (calendarMonth + 1).toString().padStart(2, '0');
    startDateInput.value = calendarStartDate ? `${calendarYear}-${monthStr}-${calendarStartDate.toString().padStart(2, '0')}` : '';
    endDateInput.value = calendarEndDate ? `${calendarYear}-${monthStr}-${calendarEndDate.toString().padStart(2, '0')}` : '';

    renderCalendarDays();
  }

  // Calendar navigation arrows
  document.getElementById('cal-prev-month').addEventListener('click', () => {
    calendarMonth--;
    if (calendarMonth < 0) {
      calendarMonth = 11;
      calendarYear--;
    }
    // Reset selection when changing months
    calendarStartDate = null;
    calendarEndDate = null;
    startDateInput.value = '';
    endDateInput.value = '';
    renderCalendarDays();
  });

  document.getElementById('cal-next-month').addEventListener('click', () => {
    calendarMonth++;
    if (calendarMonth > 11) {
      calendarMonth = 0;
      calendarYear++;
    }
    // Reset selection when changing months
    calendarStartDate = null;
    calendarEndDate = null;
    startDateInput.value = '';
    endDateInput.value = '';
    renderCalendarDays();
  });

  renderCalendarDays();

  // Wizard Step 2: Budget Select Cards click
  const budgetSelectCards = document.querySelectorAll('.budget-select-card');
  const budgetHiddenInput = document.getElementById('planner-budget-value');

  budgetSelectCards.forEach(card => {
    card.addEventListener('click', () => {
      budgetSelectCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      budgetHiddenInput.value = card.getAttribute('data-budget');
    });
  });

  // Wizard Step 2: Style Selector Chips
  const styleChips = document.querySelectorAll('.tag-select-chip');
  const styleHiddenInput = document.getElementById('planner-style-value');

  styleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      styleChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      styleHiddenInput.value = chip.getAttribute('data-style');
    });
  });

  // Wizard Step 3: Pace Segmented Options
  const paceButtons = document.querySelectorAll('.pace-option-btn');
  const paceHiddenInput = document.getElementById('planner-pace-value');

  paceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      paceButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      paceHiddenInput.value = btn.getAttribute('data-pace');
    });
  });

  // Handle Wizard steps transitions
  function updateWizardStepUI() {
    // Show/hide steps elements
    wizardSteps.forEach(step => {
      if (parseInt(step.getAttribute('data-step')) === activeStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    // Update header progress items
    progressNodes.forEach(node => {
      const stepNum = parseInt(node.getAttribute('data-step'));
      if (stepNum === activeStep) {
        node.className = 'wizard-step-node active';
      } else if (stepNum < activeStep) {
        node.className = 'wizard-step-node completed';
      } else {
        node.className = 'wizard-step-node';
      }
    });

    // Animate progress line width
    const percentage = ((activeStep - 1) / (progressNodes.length - 1)) * 80;
    progressBarTrackLine.style.width = `${percentage}%`;

    // Manage button visibilities
    if (activeStep === 1) {
      backBtn.style.visibility = 'hidden';
      nextBtn.textContent = 'Next Step';
    } else {
      backBtn.style.visibility = 'visible';
      if (activeStep === progressNodes.length) {
        nextBtn.textContent = 'Craft Plan';
      } else {
        nextBtn.textContent = 'Next Step';
      }
    }
  }

  nextBtn.addEventListener('click', () => {
    // Simple verification check on inputs
    if (activeStep === 1) {
      if (!destInput.value.trim()) {
        destInput.focus();
        destInput.style.borderColor = 'var(--error)';
        showToast('Please enter a destination to continue.', 'error');
        return;
      } else {
        destInput.style.borderColor = 'var(--glass-border)';
      }

      if (!calendarStartDate || !calendarEndDate) {
        showToast('Please pick a start and end date from the calendar.', 'error');
        return;
      }
    }

    if (activeStep < progressNodes.length) {
      activeStep++;
      updateWizardStepUI();
    } else {
      // Completed, trigger loading simulation and yield itinerary
      triggerItineraryGeneration();
    }
  });

  backBtn.addEventListener('click', () => {
    if (activeStep > 1) {
      activeStep--;
      updateWizardStepUI();
    }
  });


  // ==========================================
  // ITINERARY GENERATOR ENGINE & SKELETON LOADER
  // ==========================================
  const loaderScreen = document.getElementById('planner-loader-screen');
  const wizardCardElement = document.getElementById('wizard-card-element');
  const itineraryDashboard = document.getElementById('planner-itinerary-dashboard');
  const loadingTextNode = document.getElementById('loading-slogan-text');
  
  const loadingSlogans = [
    'Analyzing regional transport timings...',
    'Selecting heritage hotels & boutique palace rooms...',
    'Curating private excursions & museum escorts...',
    'Optimizing transit routes & local driving times...',
    'Finalizing bespoke dining tables...'
  ];

  let currentActiveItineraryPayload = null;

  function triggerItineraryGeneration() {
    // Reset save button state for fresh itinerary
    resetSaveButtons();

    wizardCardElement.style.display = 'none';
    document.getElementById('wizard-progress-bar').style.display = 'none';
    loaderScreen.classList.add('active');

    // Cycle text messages
    let textIdx = 0;
    const sloganCycle = setInterval(() => {
      textIdx = (textIdx + 1) % loadingSlogans.length;
      loadingTextNode.textContent = loadingSlogans[textIdx];
    }, 700);

    // Dynamic timeout loading simulation
    setTimeout(() => {
      clearInterval(sloganCycle);
      loaderScreen.classList.remove('active');
      itineraryDashboard.classList.add('active');
      
      // Calculate selected days duration
      const durationDays = calendarEndDate && calendarStartDate ? (calendarEndDate - calendarStartDate) + 1 : 4;
      
      // Build core payload model
      currentActiveItineraryPayload = buildCustomItinerary(
        destInput.value.trim(),
        durationDays,
        budgetHiddenInput.value,
        styleHiddenInput.value,
        paceHiddenInput.value
      );

      renderItineraryDashboard(currentActiveItineraryPayload);

    }, 2500);
  }

  // Reset save buttons to their default state
  function resetSaveButtons() {
    const saveMainBtn = document.getElementById('iti-save-btn');
    const saveStickyBtn = document.getElementById('iti-save-sticky-btn');

    saveMainBtn.innerHTML = 'Save Itinerary';
    saveMainBtn.disabled = false;
    saveMainBtn.style.backgroundColor = '';
    saveMainBtn.style.borderColor = '';
    saveMainBtn.style.color = '';

    saveStickyBtn.innerHTML = 'Save Plan';
    saveStickyBtn.disabled = false;
    saveStickyBtn.style.backgroundColor = '';
    saveStickyBtn.style.borderColor = '';
  }

  // Itinerary builders based on parameters
  function buildCustomItinerary(destination, days, budget, style, pace) {
    const cleanDest = destination.trim();
    
    // Build date range string from calendar state
    const startMonthName = monthNames[calendarMonth];
    const dateRangeStr = calendarStartDate && calendarEndDate
      ? `${startMonthName} ${calendarStartDate} - ${startMonthName} ${calendarEndDate}, ${calendarYear}`
      : `${startMonthName} 12 - ${startMonthName} 15, ${calendarYear}`;

    // Baseline itinerary scaffold
    const itinerary = {
      id: 'plan_' + Date.now(),
      destination: cleanDest,
      dates: dateRangeStr,
      budget: budget,
      style: style,
      pace: pace,
      days: []
    };

    // Database of mock templates
    const activitiesDb = {
      rajasthan: {
        hotel: { budget: 'Haveli Guest House', moderate: 'Alsisar Haveli Palace', luxury: 'The Rambagh Palace (Taj)' },
        restaurants: [
          { name: 'Peacock Rooftop Restaurant', desc: 'Folk music, local thalis.' },
          { name: '1135 AD inside Amber Fort', desc: 'Royalty dining under gold leaf ceilings.' },
          { name: 'Caffe Palladio', desc: 'Chic Italian-inspired salon.' }
        ],
        days: [
          {
            title: 'Welcome to the Pink City',
            morning: { title: 'Arrival & Palace Check-in', desc: 'Private arrival transfer from airport to your palace quarters. Rest after flight.', duration: '2 hrs' },
            afternoon: { title: 'Old City Walking Bazaar Tour', desc: 'Walk through Jantar Mantar and historic bazaars accompanied by a private guide.', duration: '3 hrs' },
            evening: { title: 'Traditional Rajasthani Welcome Dinner', desc: 'Enjoy local cuisine dining with a live puppet show and classical Sitar recital.', duration: '3 hrs', restaurant: 0 }
          },
          {
            title: 'Fortresses & Royal Heritage',
            morning: { title: 'Amber Fort Elephant Private Ride', desc: 'Ascend to the hilltop Amber Fort. Tour the Sheesh Mahal (Hall of Mirrors) before general entry.', duration: '4 hrs' },
            afternoon: { title: 'City Palace Curated Archives', desc: 'Step inside the private residential chambers of the Jaipur Royal family with a curator.', duration: '2.5 hrs' },
            evening: { title: 'Sunset Cocktails Over Nahargarh Fort', desc: 'Watch the entire pink city light up from the high battlements of Nahargarh.', duration: '3 hrs', restaurant: 1 }
          },
          {
            title: 'Astronomy & Textile Audits',
            morning: { title: 'Observatory Private Tour', desc: 'Explore the geometric celestial instruments of Maharaja Jai Singh II.', duration: '2 hrs' },
            afternoon: { title: 'Block Printing Workshops at Bagru', desc: 'Create your own fabric patterns using traditional dye recipes in a village guild.', duration: '4 hrs' },
            evening: { title: 'Fine Dining at Palladio Gardens', desc: 'Indulge in a fusion culinary experience under historic arches.', duration: '2.5 hrs', restaurant: 2 }
          }
        ]
      },
      kerala: {
        hotel: { budget: 'Munnar Valley Homestay', moderate: 'Brunton Boatyard (Cochin)', luxury: 'Kumarakom Lake Resort' },
        restaurants: [
          { name: 'Fort Kochi Seafood Harbour', desc: 'Fresh tiger prawns, coconut curries.' },
          { name: 'Cassia Elegant Dining', desc: 'Modern fusion interpretations.' },
          { name: 'The Backwater Pavilion', desc: 'Bespoke floating lake dining.' }
        ],
        days: [
          {
            title: 'Historic Fort Kochi Strolls',
            morning: { title: 'Chinese Fishing Nets Walking Audit', desc: 'Explore historic ports, spice warehouses, and St. Francis church.', duration: '2.5 hrs' },
            afternoon: { title: 'Jew Town Antiques Audit', desc: 'Explore vintage clocks, carved pillars, and private synagogues.', duration: '3 hrs' },
            evening: { title: 'Coastal Seafood Dinner Cruise', desc: 'Savor freshly cooked coconut cod while sailing through Cochin harbor.', duration: '3 hrs', restaurant: 0 }
          },
          {
            title: 'Into the Tea Valleys',
            morning: { title: 'Drive to Munnar Tea Slopes', desc: 'Scenic mountain climb past waterfalls and deep cardamom forests.', duration: '4.5 hrs' },
            afternoon: { title: 'Tea Leaves Harvesting Workshop', desc: 'Bespoke walk in plantation fields with local estate leaf experts.', duration: '2 hrs' },
            evening: { title: 'Campfire Dinner under Forest Canopy', desc: 'Private dining set in high altitude valley clearing.', duration: '2 hrs', restaurant: 1 }
          },
          {
            title: 'Floating Lake Retreat',
            morning: { title: 'Embark on Private Lake Houseboat', desc: 'Check in on a premium double-deck houseboat. Sail Vembanad lake.', duration: '3 hrs' },
            afternoon: { title: 'Kayaking in Narrow Canal Enclaves', desc: 'Quiet paddle under bending coconut palms. Watch village life up close.', duration: '2 hrs' },
            evening: { title: 'Traditional Toddy House Feast', desc: 'Savor spicy pearl spot fish cooked in banana leaves directly on the boat.', duration: '2 hrs', restaurant: 2 }
          }
        ]
      },
      goa: {
        hotel: { budget: 'Fontainhas Art Hotel', moderate: 'Cidade de Goa Taj', luxury: 'The Leela Goa (Cavelossim)' },
        restaurants: [
          { name: "Mum's Kitchen Panaji", desc: 'Authentic Goan Saraswat fish curry.' },
          { name: 'Thalassa Cliffside Salon', desc: 'Sunset ocean dining.' },
          { name: 'Gunpowder Assagao', desc: 'Stylish South Indian coastal dishes.' }
        ],
        days: [
          {
            title: 'Colonial Latin Quarters Walk',
            morning: { title: 'Fontainhas Walking Architecture Tour', desc: 'Explore pastel-coloured villas, tiled roofs, and art galleries.', duration: '2 hrs' },
            afternoon: { title: 'Spice Plantation Tour & Elephant Bathing', desc: 'Traditional lunch on banana leaves, followed by guided walk of spice groves.', duration: '4 hrs' },
            evening: { title: 'Traditional Goan Vindaloo Dinner', desc: 'Bespoke dinner in a restored 200-year-old Portuguese mansion.', duration: '2.5 hrs', restaurant: 0 }
          },
          {
            title: 'Sunsets & Coastal Cruising',
            morning: { title: 'Old Goa Historical Churches', desc: 'Visit Basilica of Bom Jesus containing the body of St. Francis Xavier.', duration: '2.5 hrs' },
            afternoon: { title: 'Catamaran Sailing & Snorkeling', desc: 'Charter a private yacht across Mandovi river out to open sea channels.', duration: '4.5 hrs' },
            evening: { title: 'Cliffside Sunset Cocktails', desc: 'Sip champagne on ocean cliffs overlooking Vagator beach.', duration: '3 hrs', restaurant: 1 }
          },
          {
            title: 'Slow Beach Lounging',
            morning: { title: 'Cavelossim Beach Private Beach Walk', desc: 'Morning shells search and yoga session directly on white sands.', duration: '2 hrs' },
            afternoon: { title: 'Dolphin Watching Boat Safari', desc: 'Spot humpback dolphins swimming near the mouth of the Sal river.', duration: '2 hrs' },
            evening: { title: 'Seafood Barbecue directly on Beach sands', desc: 'Fresh lobster and kingfish grilled over open wood fires.', duration: '3.5 hrs', restaurant: 2 }
          }
        ]
      }
    };

    // Identify templates based on typed keywords
    const lowerDest = cleanDest.toLowerCase();
    let templateKey = 'rajasthan'; // Default fallback
    if (lowerDest.includes('kerala')) templateKey = 'kerala';
    if (lowerDest.includes('goa') || lowerDest.includes('beach') || lowerDest.includes('andaman')) templateKey = 'goa';

    const selectedTemplate = activitiesDb[templateKey];

    // Build days dynamically based on selection length
    for (let dayNum = 1; dayNum <= days; dayNum++) {
      // Modulo loops over mock templates array if selected dates exceed template data length
      const templateDayIdx = (dayNum - 1) % selectedTemplate.days.length;
      const tDay = selectedTemplate.days[templateDayIdx];

      // Deep copy day items
      const dayObj = {
        number: dayNum,
        title: `Day ${dayNum}: ${tDay.title}`,
        hotel: selectedTemplate.hotel[budget],
        morning: { ...tDay.morning },
        afternoon: { ...tDay.afternoon },
        evening: { ...tDay.evening }
      };

      // Map restaurant text details
      if (typeof tDay.evening.restaurant === 'number') {
        dayObj.restaurant = selectedTemplate.restaurants[tDay.evening.restaurant];
      }

      itinerary.days.push(dayObj);
    }

    return itinerary;
  }

  // Render the generated dashboard UI
  function renderItineraryDashboard(payload) {
    document.getElementById('iti-dest-title').textContent = `${payload.destination} Custom Route`;
    document.getElementById('iti-meta-dates').textContent = payload.dates;
    document.getElementById('iti-meta-budget').textContent = `${payload.budget} • ${payload.style} style`;

    const tabsList = document.getElementById('iti-day-tabs-list');
    const scheduleContainer = document.getElementById('iti-schedule-days-container');

    tabsList.innerHTML = '';
    scheduleContainer.innerHTML = '';

    payload.days.forEach((day, idx) => {
      // 1. Day tabs item
      const tabLi = document.createElement('li');
      tabLi.className = `timeline-nav-item ${idx === 0 ? 'active' : ''}`;
      tabLi.innerHTML = `
        <button class="timeline-nav-btn" data-day-index="${idx}">
          Day ${day.number}
        </button>
      `;
      tabsList.appendChild(tabLi);

      // Connect tab click
      tabLi.querySelector('button').addEventListener('click', () => {
        document.querySelectorAll('#iti-day-tabs-list li').forEach(li => li.classList.remove('active'));
        tabLi.classList.add('active');

        document.querySelectorAll('.day-schedule-block').forEach(block => block.classList.remove('active'));
        document.getElementById(`day-block-${idx}`).classList.add('active');
      });

      // 2. Day Schedule Detail Card
      const dayBlock = document.createElement('div');
      dayBlock.className = `day-schedule-block ${idx === 0 ? 'active' : ''}`;
      dayBlock.id = `day-block-${idx}`;
      
      // Determine image based on destination
      let mapUrl = 'https://images.unsplash.com/photo-1524492449527-180b7e44b8d6?auto=format&fit=crop&w=800&q=80';
      if (payload.destination.toLowerCase().includes('kerala')) {
        mapUrl = 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80';
      } else if (payload.destination.toLowerCase().includes('goa')) {
        mapUrl = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
      }

      dayBlock.innerHTML = `
        <h3 class="day-title-head">${day.title}</h3>
        
        <!-- Morning block -->
        <div class="time-group-block">
          <div class="time-header-label">
            <svg class="time-icon-svg" viewBox="0 0 24 24"><path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm1-17.93c3.95.49 7 3.85 7 7.93 0 .62-.08 1.21-.21 1.79L15 9V7c0-1.1-.9-2-2-2v-.93zM5.07 7.57C6.18 6.02 7.97 5 10 5v1c0 1.1-.9 2-2 2H7v1c0 1.1-.9 2-2 2h-.93c-.04-.33-.07-.66-.07-1 0-1.46.41-2.83 1.07-3.93zM4.07 14H6c1.1 0 2 .9 2 2v1h2c1.1 0 2 .9 2 2v2.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79zm12.14 4.43A7.938 7.938 0 0 0 20 12c0-1.46-.41-2.83-1.07-3.93L16 12v1c0 1.1-.9 2-2 2h-1v1c0 1.1-.9 2-2 2h-.93c.39.59.88 1.1 1.45 1.5l1.09-1.09c.39-.39.9-.59 1.41-.59h1.18c.55 0 1.05.22 1.41.59l.06.06z"/></svg>
            Morning
          </div>
          <div class="time-activities-list">
            <div class="activity-card">
              <div class="activity-header">
                <h4>${day.morning.title}</h4>
                <span class="badge badge-accent">${day.morning.duration}</span>
              </div>
              <p>${day.morning.desc}</p>
            </div>
          </div>
        </div>

        <!-- Afternoon block -->
        <div class="time-group-block">
          <div class="time-header-label">
            <svg class="time-icon-svg" viewBox="0 0 24 24"><path d="M12 6.5c-2.48 0-4.5 2.02-4.5 4.5 0 2.48 2.02 4.5 4.5 4.5s4.5-2.02 4.5-4.5c0-2.48-2.02-4.5-4.5-4.5zM12 18c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm0-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
            Afternoon
          </div>
          <div class="time-activities-list">
            <div class="activity-card">
              <div class="activity-header">
                <h4>${day.afternoon.title}</h4>
                <span class="badge badge-accent">${day.afternoon.duration}</span>
              </div>
              <p>${day.afternoon.desc}</p>
            </div>
          </div>
        </div>

        <!-- Evening block -->
        <div class="time-group-block">
          <div class="time-header-label">
            <svg class="time-icon-svg" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.07 19.67 10.48 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>
            Evening
          </div>
          <div class="time-activities-list">
            <div class="activity-card">
              <div class="activity-header">
                <h4>${day.evening.title}</h4>
                <span class="badge badge-accent">${day.evening.duration}</span>
              </div>
              <p>${day.evening.desc}</p>

              <!-- Dining card integration -->
              ${day.restaurant ? `
                <div class="dining-card">
                  <div class="dining-info">
                    <svg class="fork-knife-svg" viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3h8v2h-8V6zm0 5h8v2h-8v-2zm0 5h8v2h-8v-2zM16 2v2h8V2h-8z"/></svg>
                    <div class="dining-details">
                      <h5>${day.restaurant.name}</h5>
                      <p>${day.restaurant.desc}</p>
                    </div>
                  </div>
                  <span class="dining-tag">Curated Reservation</span>
                </div>
              ` : ''}

            </div>
          </div>
        </div>

        <!-- Curated Stay details -->
        <div style="margin-top:2.5rem; padding: 1.5rem 2rem; border-radius:var(--radius-md); background-color: var(--bg-secondary); border: 1px solid var(--glass-border); display:flex; align-items:center; justify-content:space-between;">
          <div style="display:flex; align-items:center; gap:1rem;">
            <svg class="meta-icon-svg" viewBox="0 0 24 24" style="width:22px; height:22px;"><path d="M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm12-3h-8v8H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4zm2 8H11V9h8c1.1 0 2 .9 2 2v4z"/></svg>
            <div>
              <h5 style="font-weight:700; margin-bottom: 0.1rem;">Lodging Spotlight</h5>
              <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0;">Overnight reservation at: <strong style="color:var(--primary);">${day.hotel}</strong></p>
            </div>
          </div>
          <span class="badge badge-accent">Selected Stay</span>
        </div>

        <!-- Mock Map card -->
        <div class="map-placeholder-card">
          <img class="map-mock-bg" src="${mapUrl}" alt="Static map routes">
          <div class="map-overlay-center">
            <!-- Location Pin -->
            <svg class="map-pin-svg" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <h5>Day Route Active Tracking</h5>
            <p>GPS positioning active. Private vehicle transit logged from Lodging to afternoon excursions.</p>
          </div>
        </div>
      `;

      scheduleContainer.appendChild(dayBlock);
    });

    // Reveal sticky bottom action row
    document.getElementById('itinerary-sticky-action-bar').classList.add('active');
  }

  // Back trigger to planner inputs from dashboard
  document.getElementById('iti-modify-btn').addEventListener('click', () => {
    itineraryDashboard.classList.remove('active');
    document.getElementById('itinerary-sticky-action-bar').classList.remove('active');
    
    wizardCardElement.style.display = 'block';
    document.getElementById('wizard-progress-bar').style.display = 'flex';
    activeStep = 1;
    updateWizardStepUI();
  });

  // Save actions
  function saveItineraryAction(payload) {
    if (!payload) {
      showToast('No itinerary to save. Generate one first.', 'error');
      return;
    }

    if (!currentUser) {
      // Store payload temporarily, trigger login popup
      localStorage.setItem('temp_itinerary_payload', JSON.stringify(payload));
      authModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      showToast('Sign in to save your itinerary to your profile.', 'info');
      return;
    }

    // Check duplicate
    if (savedTrips.some(t => t.id === payload.id)) {
      showToast('This plan is already saved to your profile.', 'info');
      return;
    }

    // Add to saved list
    const newTrip = {
      id: payload.id,
      title: `${payload.destination} Custom ${payload.days.length}-Day Plan`,
      destination: payload.destination,
      dates: payload.dates,
      budget: payload.budget,
      duration: payload.days.length,
      status: 'drafts',
      progress: 0,
      image: payload.destination.toLowerCase().includes('kerala') 
        ? 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80'
        : (payload.destination.toLowerCase().includes('goa') 
          ? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' 
          : 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80')
    };

    savedTrips.unshift(newTrip);
    localStorage.setItem('tourista_saved_trips', JSON.stringify(savedTrips));

    // Update buttons status to success
    const saveMainBtn = document.getElementById('iti-save-btn');
    const saveStickyBtn = document.getElementById('iti-save-sticky-btn');

    saveMainBtn.innerHTML = '✓ Plan Saved';
    saveMainBtn.disabled = true;
    saveMainBtn.style.backgroundColor = 'var(--success)';
    saveMainBtn.style.borderColor = 'var(--success)';
    saveMainBtn.style.color = 'var(--bg-primary)';

    saveStickyBtn.innerHTML = '✓ Saved';
    saveStickyBtn.disabled = true;
    saveStickyBtn.style.backgroundColor = 'var(--success)';
    saveStickyBtn.style.borderColor = 'var(--success)';

    // Update profile UI lists
    renderSavedTrips();

    showToast('Itinerary saved to your profile! Redirecting to dashboard...', 'success');
    
    // Redirect view to dashboard
    setTimeout(() => {
      switchView('saved');
    }, 1200);
  }

  document.getElementById('iti-save-btn').addEventListener('click', () => {
    saveItineraryAction(currentActiveItineraryPayload);
  });

  document.getElementById('iti-save-sticky-btn').addEventListener('click', () => {
    saveItineraryAction(currentActiveItineraryPayload);
  });

  // Download PDF Action Trigger
  document.getElementById('iti-pdf-btn').addEventListener('click', () => {
    showToast('Preparing PDF download... Your browser print dialog will open.', 'info');
    setTimeout(() => { window.print(); }, 500);
  });


  // ==========================================
  // SAVED TRIPS / USER DASHBOARD VIEW
  // ==========================================
  const dashboardTabs = document.querySelectorAll('#dashboard-tab-headers button');
  const tripsGrid = document.getElementById('dashboard-trips-grid');
  let activeDashboardTab = 'upcoming';

  dashboardTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dashboardTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeDashboardTab = tab.getAttribute('data-tab');
      renderSavedTrips();
    });
  });

  function renderSavedTrips() {
    tripsGrid.innerHTML = '';

    // Filter based on active tab
    const filteredSaved = savedTrips.filter(t => t.status === activeDashboardTab);

    if (filteredSaved.length === 0) {
      tripsGrid.innerHTML = `
        <div class="dashboard-empty-state">
          <svg viewBox="0 0 24 24" style="width:48px; height:48px; fill:var(--text-light); margin-bottom:1rem;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          <h4>No itineraries in this category</h4>
          <p>Plans you customize using the AI Wizard will appear here.</p>
          <button class="btn btn-primary btn-sm" id="empty-state-planner-btn">Plan a Trip</button>
        </div>
      `;
      
      const emptyBtn = document.getElementById('empty-state-planner-btn');
      if (emptyBtn) {
        emptyBtn.addEventListener('click', () => {
          switchView('planner');
        });
      }
      return;
    }

    filteredSaved.forEach(trip => {
      const card = document.createElement('article');
      card.className = 'dest-card';
      card.innerHTML = `
        <div class="dest-img-container" style="height:180px;">
          <img class="dest-img" src="${trip.image}" alt="${trip.destination}">
          <span class="dest-tag badge badge-accent" style="text-transform:capitalize;">${trip.budget}</span>
        </div>
        <div class="dest-info" style="padding:1.5rem;">
          <h4 class="serif-text" style="font-size:1.3rem; margin-bottom:0.25rem;">${trip.title}</h4>
          <p style="font-size:0.8rem; color:var(--text-light); margin-bottom:1rem;">Dates: ${trip.dates}</p>

          <!-- Linear progress bar -->
          <div class="trip-progress-container">
            <div class="progress-bar-label">
              <span>Proximity Completion</span>
              <span>${trip.progress}%</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width: ${trip.progress}%;"></div>
            </div>
          </div>

          <div class="trip-card-footer">
            <span style="font-size:0.8rem; font-weight:700; color:var(--accent-hover);">${trip.duration} Days trip</span>
            <div class="trip-collaborators">
              <button class="invite-collab-btn" title="Invite travel collaborators" data-trip-id="${trip.id}">
                <!-- Collab plus SVG -->
                <svg class="collab-icon-svg" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              </button>
            </div>
          </div>
        </div>
      `;

      // Set up collaborator event
      card.querySelector('.invite-collab-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const email = prompt("Enter your friend's email address to invite them to this itinerary:");
        if (email) {
          if (isValidEmail(email)) {
            showToast(`Invitation sent to ${email} successfully!`, 'success');
          } else {
            showToast('Please enter a valid email address.', 'error');
          }
        }
      });

      tripsGrid.appendChild(card);
    });
  }


  // ==========================================
  // NATURAL LANGUAGE INLINE HOME QUERY PARSER
  // ==========================================
  const homeQueryForm = document.getElementById('quick-search-bar-form');
  const nlInput = document.getElementById('nl-search-input');

  homeQueryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = nlInput.value.trim().toLowerCase();
    if (!query) return;

    // Direct parsing keywords
    let destination = 'Rajasthan';
    if (query.includes('goa') || query.includes('beach')) destination = 'Goa';
    if (query.includes('kerala')) destination = 'Kerala';
    if (query.includes('ladakh') || query.includes('mountain')) destination = 'Leh-Ladakh';
    if (query.includes('corbett') || query.includes('tiger')) destination = 'Jim Corbett';

    let durationDays = 4;
    // Extract numbers from text query
    const numberMatches = query.match(/\d+/);
    if (numberMatches) {
      durationDays = parseInt(numberMatches[0]);
    } else {
      if (query.includes('week')) durationDays = 7;
    }

    // Lock parameters to inputs
    destInput.value = destination;
    calendarStartDate = 12;
    calendarEndDate = 12 + durationDays - 1;

    // Budget matching
    if (query.includes('luxury') || query.includes('palace') || query.includes('expensive')) {
      budgetHiddenInput.value = 'luxury';
      budgetSelectCards.forEach(c => {
        if (c.getAttribute('data-budget') === 'luxury') c.classList.add('active');
        else c.classList.remove('active');
      });
    }

    // Go directly to step 3 or compile immediately
    activeStep = 1;
    switchView('planner');
    
    // Automatically submit steps programmatically to render results dashboard
    triggerItineraryGeneration();
  });


  // ==========================================
  // BLOG ARTICLE READER MODAL
  // ==========================================
  const blogArticlesData = [
    {
      id: 0,
      title: "Inside India's Palace Hotels",
      meta: 'June 2026 • Hotel Review',
      image: 'https://images.unsplash.com/photo-1546967191-fdfb13ed6b1e?auto=format&fit=crop&w=1200&q=80',
      content: `
        <p>India's palace hotels represent a unique fusion of historical grandeur and modern luxury hospitality. From the golden sandstone corridors of Rajasthan to the tranquil lakeside retreats of Udaipur, these converted royal residences offer guests an experience that transcends ordinary accommodation.</p>
        <blockquote>"To sleep in a palace is to dream in the footsteps of kings. Every corridor whispers centuries of history, and every courtyard holds the memory of a thousand moonlit gatherings."</blockquote>
        <p>The Taj Lake Palace, floating ethereally on the waters of Lake Pichola, remains one of India's most iconic luxury properties. Originally built in 1746 as a pleasure palace for Maharana Jagat Singh II, it was converted into a heritage hotel in the 1960s. Today, each of its 65 rooms and 18 suites is individually decorated with antique furniture, silk furnishings, and hand-painted murals.</p>
        <p>Moving to Jodhpur, the Umaid Bhawan Palace stands as the last of the great palaces of India. Completed in 1943 after 15 years of construction, this Art Deco masterpiece employs a private butler system where each guest is assigned a personal attendant for their entire stay. The palace's underground swimming pool, marble squash courts, and extensive gardens create an atmosphere of unparalleled exclusivity.</p>
        <p>Our team spent three weeks conducting detailed audits of twelve palace properties across four states. We evaluated architectural conservation efforts, service quality, cuisine authenticity, and the delicate balance between preserving heritage character and meeting contemporary luxury expectations.</p>
        <p>The verdict: India's palace hotels are not merely accommodations — they are living museums that invite guests to participate in centuries of royal tradition. For the discerning traveler, they represent the pinnacle of experiential luxury.</p>
      `
    },
    {
      id: 1,
      title: 'Slow Travel in Kerala',
      meta: 'May 2026 • Destination Guide',
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
      content: `
        <p>Kerala, often called "God's Own Country," is best experienced at a pace that allows its lush landscapes and rich culture to fully unfold. Slow travel here means trading tourist buses for kayaks, replacing chain restaurants with family kitchens, and choosing village homestays over resort complexes.</p>
        <blockquote>"The backwaters of Kerala move at the speed of the tide. To rush through them is to miss their entire purpose — the invitation to slow down, breathe, and simply exist."</blockquote>
        <p>The Western Ghats mountain range, a UNESCO World Heritage Site, stretches along Kerala's eastern border and creates one of the most biodiverse regions on the planet. Instead of driving through, we recommend multi-day treks through the Periyar Tiger Reserve, where experienced tribal guides lead visitors through dense forest canopies and past hidden waterfalls.</p>
        <p>The coastal lagoons of Alleppey provide another dimension of slow travel. Rather than the popular two-hour houseboat tours, consider chartering a traditional kettuvallam for a full two-day journey through narrow canals that most tourists never see. Your crew cooks fresh catch directly on board, and you'll fall asleep to the gentle lapping of water against the hull.</p>
        <p>For those seeking wellness, the traditional Ayurvedic centers of Varkala offer treatments that have been refined over thousands of years. Unlike spa resorts that offer abbreviated versions, authentic Ayurvedic programs require a minimum two-week commitment and include customized herbal remedies, dietary plans, and daily yoga and meditation sessions.</p>
        <p>Our recommendation: allocate at least ten days for Kerala, spread across three distinct regions. Begin in Fort Kochi for its colonial history and seafood, move to the mountains of Munnar for tea plantation walks, and conclude with a houseboat journey through the backwaters.</p>
      `
    },
    {
      id: 2,
      title: 'The Art of the Monsoons',
      meta: 'April 2026 • Cultural Spotlight',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      content: `
        <p>The Indian monsoon is not merely a weather phenomenon — it is a cultural event that transforms the entire subcontinent. For centuries, the arrival of the rains has inspired music, cuisine, literature, and spiritual practice. Traveling during the monsoon season reveals an India that few tourists ever witness.</p>
        <blockquote>"When the first rains arrive, India doesn't hide indoors. It celebrates. The monsoon is not an obstacle to travel — it is the destination itself."</blockquote>
        <p>In Madhya Pradesh, the ancient town of Mandu comes alive during the monsoons. Its 15th-century Afghan architecture, including the romantically named Ship Palace (Jahaz Mahal), appears to float on the swollen lakes that surround it. Local musicians perform classical ragas specifically composed for the rainy season — Raag Megh Malhar and Raag Miyan ki Malhar — in open-air concerts that combine the music of instruments with the percussion of rainfall.</p>
        <p>The culinary traditions of monsoon India are equally compelling. In Maharashtra, street vendors prepare steaming bhajias (vegetable fritters) and cutting chai (strong tea) that taste fundamentally different consumed against a backdrop of pouring rain. In Gujarat, the Undhiyu harvest coincides with the early monsoon, and families gather to prepare this elaborate mixed vegetable dish using recipes passed down through generations.</p>
        <p>The Western Ghats during monsoon transform into one of the most spectacular natural displays on earth. Waterfalls that are mere trickles during summer become thundering cascades. The Dudhsagar Falls in Goa and the Jog Falls in Karnataka reach their full power only during July and August, offering a sight that is both humbling and exhilarating.</p>
        <p>Our editorial team traveled through seven states during the 2025 monsoon season. This article distills our findings into a practical guide for travelers willing to embrace the rain and discover an India that exists for only four months each year.</p>
      `
    }
  ];

  const blogReaderModal = document.getElementById('blog-reader-modal');

  function openBlogReader(blogId) {
    const article = blogArticlesData.find(a => a.id === parseInt(blogId));
    if (!article) return;

    document.getElementById('blog-reader-img').src = article.image;
    document.getElementById('blog-reader-meta').textContent = article.meta;
    document.getElementById('blog-reader-title').textContent = article.title;
    document.getElementById('blog-reader-content').innerHTML = article.content;

    blogReaderModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeBlogReader() {
    blogReaderModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // Wire up all blog "Read Article" buttons
  document.querySelectorAll('.blog-open-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const blogId = btn.getAttribute('data-blog-id');
      openBlogReader(blogId);
    });
  });

  document.getElementById('blog-reader-close').addEventListener('click', closeBlogReader);
  blogReaderModal.addEventListener('click', (e) => {
    if (e.target === blogReaderModal) closeBlogReader();
  });


  // ==========================================
  // CONTACT Accordion FAQ & support submit
  // ==========================================
  const faqAccordionItems = document.querySelectorAll('.accordion-item');

  faqAccordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const panel = item.querySelector('.accordion-panel');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all open panels
      faqAccordionItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.accordion-panel').style.maxHeight = null;
        otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        // Set dynamic max-height based on scroll height for smooth transition
        panel.style.maxHeight = panel.scrollHeight + "px";
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Support Enquiry form submit handler with inline success
  const contactForm = document.getElementById('customer-support-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('support-name-input');
    const emailInput = document.getElementById('support-email-input');
    const msgInput = document.getElementById('support-message-input');

    // Basic validation
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      showToast('Please enter your full name.', 'error');
      nameInput.focus();
      return;
    }
    if (!isValidEmail(emailInput.value.trim())) {
      showToast('Please enter a valid email address.', 'error');
      emailInput.focus();
      return;
    }
    if (!msgInput.value.trim() || msgInput.value.trim().length < 10) {
      showToast('Please describe your enquiry in detail (at least 10 characters).', 'error');
      msgInput.focus();
      return;
    }

    // Show inline success message
    const existingMsg = contactForm.querySelector('.form-success-msg');
    if (existingMsg) existingMsg.remove();

    const successDiv = document.createElement('div');
    successDiv.className = 'form-success-msg';
    successDiv.innerHTML = `
      <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
      <span>Your bespoke travel enquiry has been registered. A luxury concierge editor will reach out within 12 hours.</span>
    `;
    contactForm.insertBefore(successDiv, contactForm.firstChild);

    showToast('Enquiry submitted successfully!', 'success');
    contactForm.reset();

    // Remove success message after 8 seconds
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.style.opacity = '0';
        successDiv.style.transition = 'opacity 0.3s ease';
        setTimeout(() => { if (successDiv.parentNode) successDiv.remove(); }, 300);
      }
    }, 8000);
  });

  // Newsletter subscription footer submit handler
  const newsletterForm = document.getElementById('newsletter-form-element');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('.newsletter-input');
    if (!isValidEmail(emailInput.value.trim())) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast('Subscribed! Seasonal travel dispatches will be delivered to your inbox.', 'success');
    newsletterForm.reset();
  });

  // Footer dead link handlers
  document.getElementById('footer-privacy-link').addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Privacy Policy page is coming soon. Contact our concierge for details.', 'info');
  });

  document.getElementById('footer-terms-link').addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Terms of Service page is coming soon. Contact our concierge for details.', 'info');
  });


  // ==========================================
  // INITIAL ROUTE HANDLING
  // ==========================================
  // Handle initial page load route from URL hash
  handleHashRoute();

});
