/**
 * NSERS - National Smart Emergency Response System
 * Core Application Script for click-through high-fidelity mockup.
 */

// Global Application State
const state = {
  currentRole: 'citizen', // citizen, operator, police, ambulance, fire, disaster_authority, administrator
  currentScreen: 'landing-page',
  theme: 'light',
  audioCtx: null,
  isSOSActive: false,
  sosCountdown: 5,
  sosTimer: null,
  activeIncidentIndex: 0,
  incidents: [
    {
      id: "INC-8891",
      type: "Road Accident",
      icon: "minor_crash",
      severity: "critical",
      victimCount: 4,
      location: "NH-48, Sector 15, Gurugram, Haryana",
      coords: { x: 260, y: 190 },
      confidence: 96,
      aiSummary: "Collision between a commercial bus and a sedan. AI detects smoke emission and vehicle cabin intrusion. Airbags deployed.",
      status: "Verified",
      timestamp: "5 mins ago",
      assignedUnit: "Ambulance UP16-A220, Highway Patrol G-4",
      eta: "6 mins",
      evidence: {
        img: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934ff?w=600&auto=format&fit=crop",
        video: "Simulated traffic CCTV camera feed"
      }
    },
    {
      id: "INC-8892",
      type: "Fire Emergency",
      icon: "local_fire_department",
      severity: "high",
      victimCount: 0,
      location: "Commercial Complex, Block C, Connaught Place, New Delhi",
      coords: { x: 275, y: 175 },
      confidence: 94,
      aiSummary: "Thermal sensor and optical analysis detect active electrical panel fire on the second floor. Rapid smoke progression.",
      status: "Submitted",
      timestamp: "Just now",
      assignedUnit: "Fire Engine DL1-F3",
      eta: "8 mins",
      evidence: {
        img: "https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?w=600&auto=format&fit=crop",
        video: "Mobile upload - MP4 attachment"
      }
    },
    {
      id: "INC-8893",
      type: "Flood Emergency",
      icon: "water",
      severity: "critical",
      victimCount: 12,
      location: "Tejpur Outer Suburbs, Sonitpur District, Assam",
      coords: { x: 380, y: 160 },
      confidence: 98,
      aiSummary: "River Brahmaputra water level breach detected. Severe inundation of low-lying settlements. Multiple stranded residents in water flow.",
      status: "Units Assigned",
      timestamp: "12 mins ago",
      assignedUnit: "NDRF Team 4 (Guwahati Division)",
      eta: "18 mins",
      evidence: {
        img: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop",
        video: "Satellite SAR image anomaly"
      }
    },
    {
      id: "INC-8894",
      type: "Gas Leak",
      icon: "gas_meter",
      severity: "high",
      victimCount: 2,
      location: "Industrial Area Phase II, Chennai, Tamil Nadu",
      coords: { x: 220, y: 310 },
      confidence: 89,
      aiSummary: "Chemical sensor alerts paired with acoustic microphone detecting high-frequency valve leak hiss. Ammonia vapor tracking simulation.",
      status: "En Route",
      timestamp: "8 mins ago",
      assignedUnit: "SDRF HAZMAT Unit Chennai",
      eta: "4 mins",
      evidence: {
        img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop",
        video: "Industrial CCTV sensor log"
      }
    },
    {
      id: "INC-8895",
      type: "Crime / Security",
      icon: "policy",
      severity: "high",
      victimCount: 1,
      location: "Gold Shop jewelry market, Karol Bagh, Delhi",
      coords: { x: 190, y: 140 },
      confidence: 91,
      aiSummary: "Active panic button trigger from commercial jewelry establishment. Audio analysis detects vocal screams and glass shatter.",
      status: "Submitted",
      timestamp: "3 mins ago",
      assignedUnit: "Local Beat Patrol DL-9",
      eta: "3 mins",
      evidence: {
        img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop",
        video: "Shop panic feed audio stream"
      }
    },
    {
      id: "INC-8896",
      type: "Medical Emergency",
      icon: "medical_services",
      severity: "critical",
      victimCount: 1,
      location: "Residential Complex, Sector 21, Noida",
      coords: { x: 290, y: 210 },
      confidence: 95,
      aiSummary: "Citizen heart rate sensor telemetry anomaly flagged. Wearable detects 180bpm pulse accompanied by user fall detection trigger.",
      status: "En Route",
      timestamp: "10 mins ago",
      assignedUnit: "ICU Ambulance DL-4S",
      eta: "2 mins",
      evidence: {
        img: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=600&auto=format&fit=crop",
        video: "Telehealth ECG sensor stream"
      }
    }
  ],
  hazards: [
    {
      id: "HAZ-401",
      type: "Open Electric Wire",
      location: "Near Metro Gate 3, Sector 56, Noida",
      severity: "high",
      reportedBy: "Suresh Kumar",
      date: "04 Jul 2026",
      status: "Assigned to Discom"
    },
    {
      id: "HAZ-402",
      type: "Broken Bridge Railing",
      location: "Yamuna Canal Link Bridge, Greater Noida",
      severity: "critical",
      reportedBy: "Anil Sharma",
      date: "05 Jul 2026",
      status: "Under Assessment"
    },
    {
      id: "HAZ-403",
      type: "Deep Pothole Grid",
      location: "Outer Ring Road (westbound lane), Delhi",
      severity: "medium",
      reportedBy: "Meera Patel",
      date: "03 Jul 2026",
      status: "Scheduled for Repair"
    }
  ],
  resources: [
    { name: "Ambulance Units", available: 18, busy: 32, total: 50, status: "Normal" },
    { name: "Police Patrol Vehicles", available: 42, busy: 58, total: 100, status: "Optimal" },
    { name: "Fire Engines", available: 12, busy: 8, total: 20, status: "Normal" },
    { name: "NDRF Squad Teams", available: 4, busy: 6, total: 10, status: "Critical Strain" },
    { name: "Hospital ICU Beds Available", available: 142, total: 500, status: "High Demand" },
    { name: "Paramedics Active", available: 60, busy: 140, total: 200, status: "Optimal" }
  ],
  logs: [
    "23:01:05 - System initialized in New Delhi HQ.",
    "23:01:06 - GPS feeds successfully queried from active mobile user clients.",
    "23:01:10 - Connected to IMD (India Meteorological Department) Weather API.",
    "23:01:25 - Event INC-8892 (Fire CP) raised. Triggering AI confidence parsing...",
    "23:01:28 - Operator CP-Area logged in. Dispatch route calculations loaded."
  ]
};

// Start application
window.addEventListener('DOMContentLoaded', () => {
  initRouting();
  initTheme();
  initMapSimulators();
  initSOSModule();
  initForms();
  initAnalyticsCharts();
  renderDynamicContent();
  setupRoleSelectors();
  
  // Log message to admin console
  logSystem("NSERS Core services started. 15 Screens loaded.");
});

// Setup audio context on first user click
function initAudio() {
  if (!state.audioCtx) {
    state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// System Logging Utility
function logSystem(msg) {
  const timestamp = new Date().toLocaleTimeString();
  const logLine = `[${timestamp}] - ${msg}`;
  state.logs.unshift(logLine);
  
  // Update log display on admin screen if visible
  const logsBox = document.getElementById('admin-logs-box');
  if (logsBox) {
    logsBox.innerHTML = state.logs.map(line => `<div>${line}</div>`).join('');
  }
}

// Synthesize alert sound via Web Audio API
function playBeep(frequency, duration, type = 'sine') {
  try {
    initAudio();
    if (!state.audioCtx) return;
    
    const osc = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, state.audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.3, state.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, state.audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(state.audioCtx.destination);
    
    osc.start();
    osc.stop(state.audioCtx.currentTime + duration);
  } catch (e) {
    console.warn("Audio playback not allowed or supported yet.", e);
  }
}

// Router and Screen Manager
function initRouting() {
  const links = document.querySelectorAll('[data-target]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-target');
      navigateTo(target);
    });
  });
}

function navigateTo(screenId) {
  // Hide all screens
  const screens = document.querySelectorAll('.screen-container');
  screens.forEach(s => s.classList.add('hidden-screen'));
  
  // Auto-close mobile sidebar and backdrop if open
  const sidebar = document.getElementById('app-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar) {
    sidebar.classList.remove('mobile-open');
  }
  if (backdrop) {
    backdrop.classList.remove('active');
  }
  
  // Show target screen
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.remove('hidden-screen');
    targetScreen.classList.add('anim-fade-in');
    state.currentScreen = screenId;
    logSystem(`Navigated to ${screenId}`);
  }
  
  // Update sidebar active highlights
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  sidebarItems.forEach(item => {
    const a = item.querySelector('a');
    if (a && a.getAttribute('data-target') === screenId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Specific screen loading behaviors
  if (screenId === 'authority-dashboard') {
    renderAuthorityFeed();
    startTrackingMap('authority-live-map');
  } else if (screenId === 'live-tracking-page') {
    startTrackingMap('tracking-live-map', true); // animated vehicle dispatch
  } else if (screenId === 'citizen-dashboard') {
    startTrackingMap('citizen-live-map');
  } else if (screenId === 'landing-page') {
    startTrackingMap('hero-live-map');
  } else if (screenId === 'analytics-page') {
    drawAnalytics();
  } else if (screenId === 'admin-panel') {
    logSystem("Admin console view loaded.");
  }
}

// Dynamic Theme Selector (Dark/Light)
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      state.theme = themeToggle.checked ? 'dark' : 'light';
      document.body.setAttribute('data-theme', state.theme);
      logSystem(`Theme toggled to ${state.theme}`);
      // Redraw charts if we are on analytics page
      if (state.currentScreen === 'analytics-page') {
        drawAnalytics();
      }
    });
  }
}

// Role setup and UI layout adjustment
function setupRoleSelectors() {
  const roleInputs = document.querySelectorAll('input[name="role-select"]');
  roleInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const selectedRole = e.target.value;
      switchRole(selectedRole);
      
      // Automatically login and redirect to appropriate page
      if (selectedRole === 'citizen') {
        navigateTo('citizen-dashboard');
      } else if (selectedRole === 'administrator') {
        navigateTo('admin-panel');
      } else {
        navigateTo('authority-dashboard');
      }
    });
  });

  // Top nav role badge trigger
  const topBadge = document.getElementById('role-badge-picker');
  if (topBadge) {
    topBadge.addEventListener('click', () => {
      navigateTo('login-signup-page');
    });
  }
}

function handleSecureLogin() {
  const selectedRole = document.querySelector('input[name="role-select"]:checked').value;
  switchRole(selectedRole);
  if (selectedRole === 'citizen') {
    navigateTo('citizen-dashboard');
  } else if (selectedRole === 'administrator') {
    navigateTo('admin-panel');
  } else {
    navigateTo('authority-dashboard');
  }
}

function switchRole(roleName) {
  state.currentRole = roleName;
  
  // Update header UI badge
  const roleLabel = document.getElementById('current-role-label');
  if (roleLabel) {
    roleLabel.textContent = roleName.replace('_', ' ').toUpperCase();
  }
  
  // Toggle sidebar actions depending on role
  const citizenItems = document.querySelectorAll('.sidebar-citizen-only');
  const authorityItems = document.querySelectorAll('.sidebar-authority-only');
  const adminItems = document.querySelectorAll('.sidebar-admin-only');

  if (roleName === 'citizen') {
    citizenItems.forEach(el => el.style.display = 'block');
    authorityItems.forEach(el => el.style.display = 'none');
    adminItems.forEach(el => el.style.display = 'none');
  } else if (roleName === 'administrator') {
    citizenItems.forEach(el => el.style.display = 'none');
    authorityItems.forEach(el => el.style.display = 'none');
    adminItems.forEach(el => el.style.display = 'block');
  } else {
    // Government Authority (Police, Ambulance, Operator, NDRF etc)
    citizenItems.forEach(el => el.style.display = 'none');
    authorityItems.forEach(el => el.style.display = 'block');
    adminItems.forEach(el => el.style.display = 'none');
  }

  logSystem(`Active role switched to: ${roleName}`);
}

window.handleSecureLogin = handleSecureLogin;

// Form Handlers (Emergency Submission)
function initForms() {
  const fileInput = document.getElementById('incident-file');
  const uploadZone = document.getElementById('upload-zone');
  const preview = document.getElementById('upload-preview-box');

  if (uploadZone && fileInput) {
    uploadZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        preview.innerHTML = '';
        Array.from(fileInput.files).forEach(file => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const thumb = document.createElement('img');
            thumb.className = 'upload-thumb';
            thumb.src = e.target.result;
            preview.appendChild(thumb);
          };
          reader.readAsDataURL(file);
        });
        logSystem(`${fileInput.files.length} evidence file(s) attached.`);
      }
    });
  }

  // Emergency Form Submit button
  const form = document.getElementById('emergency-report-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const type = document.getElementById('incident-type').value;
      const severityVal = document.getElementById('severity-slider').value;
      const victims = document.getElementById('victim-count').value;
      const description = document.getElementById('incident-desc').value;
      
      let severity = 'medium';
      if (severityVal > 75) severity = 'critical';
      else if (severityVal > 45) severity = 'high';
      else if (severityVal < 20) severity = 'low';

      // Insert new incident into database state
      const newInc = {
        id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
        type: type,
        icon: getIconForType(type),
        severity: severity,
        victimCount: parseInt(victims) || 0,
        location: "Detected near Sector 4, Dwarka, New Delhi",
        coords: { x: 180 + Math.random()*100, y: 150 + Math.random()*80 },
        confidence: Math.floor(88 + Math.random() * 11),
        aiSummary: `Multimodal scan: ${description || 'No user comments'}. GPS locks consistent. Immediate deployment recommended.`,
        status: "Submitted",
        timestamp: "Just now",
        assignedUnit: "Pending Dispatch",
        eta: "Calculating...",
        evidence: {
          img: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop",
          video: "Attached"
        }
      };

      state.incidents.unshift(newInc);
      logSystem(`Report generated: ${newInc.id} (${type})`);
      
      // Navigate to AI screen
      runAIAnalyzer(newInc);
    });
  }

  // Hazard report submission
  const hazardForm = document.getElementById('hazard-report-form');
  if (hazardForm) {
    hazardForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.getElementById('hazard-type').value;
      const location = document.getElementById('hazard-loc').value || "Sector 12, Noida";
      const severity = document.getElementById('hazard-severity').value;
      const comment = document.getElementById('hazard-comments').value;

      const newHaz = {
        id: `HAZ-${Math.floor(400 + Math.random() * 500)}`,
        type: type,
        location: location,
        severity: severity,
        reportedBy: "You (Citizen Portal)",
        date: "Today",
        status: "Submitted"
      };

      state.hazards.unshift(newHaz);
      logSystem(`Hazard logged: ${newHaz.id} (${type})`);
      
      alert(`Thank you! Your preventive hazard report [${newHaz.id}] has been logged by the Disaster Prevention Authority.`);
      navigateTo('citizen-dashboard');
      renderDynamicContent();
    });
  }
}

function getIconForType(type) {
  switch (type) {
    case 'Road Accident': return 'minor_crash';
    case 'Fire': return 'local_fire_department';
    case 'Medical': return 'medical_services';
    case 'Flood': return 'water';
    case 'Earthquake': return 'landslide';
    case 'Gas Leak': return 'gas_meter';
    case 'Crime': return 'policy';
    default: return 'warning';
  }
}

// AI Screen scan script simulation
function runAIAnalyzer(incident) {
  navigateTo('ai-analysis-screen');
  
  const consoleEl = document.getElementById('ai-console-feed');
  const resultsEl = document.getElementById('ai-analysis-results');
  const loaderEl = document.getElementById('ai-loading-view');
  
  consoleEl.innerHTML = '';
  resultsEl.style.display = 'none';
  loaderEl.style.display = 'flex';

  const logLines = [
    "NSERS Neural Network Node #4 connected...",
    "Querying location cell triangulation...",
    "Analyzing uploaded image metadata...",
    "Object Detection: Deployed YOLOv11 Model...",
    "Confidence mapping: Detected deformation vectors (96.4%)",
    "Acoustic NLP: Parsing vocal pitch / distress cues...",
    "Metadata Verification: EXIF coordinates match GPS lock (Authentic)",
    "Compiling critical disaster routing metrics...",
    "Verification complete. Dispatch route generated."
  ];

  let lineIdx = 0;
  playBeep(440, 0.15, 'triangle');
  
  const timer = setInterval(() => {
    if (lineIdx < logLines.length) {
      const div = document.createElement('div');
      div.className = 'ai-console-line';
      div.textContent = `> ${logLines[lineIdx]}`;
      consoleEl.appendChild(div);
      consoleEl.scrollTop = consoleEl.scrollHeight;
      playBeep(600 + (lineIdx * 50), 0.05, 'sine');
      lineIdx++;
    } else {
      clearInterval(timer);
      
      // Load completed results
      document.getElementById('ai-res-type').textContent = incident.type;
      document.getElementById('ai-res-confidence').textContent = `${incident.confidence}%`;
      document.getElementById('ai-res-severity').textContent = incident.severity.toUpperCase();
      document.getElementById('ai-res-eta').textContent = incident.severity === 'critical' ? '5-7 Mins' : '8-12 Mins';
      
      // Severity color formatting
      const severityEl = document.getElementById('ai-res-severity');
      severityEl.className = 'ai-metric-value';
      if (incident.severity === 'critical') severityEl.style.color = 'var(--danger-color)';
      else if (incident.severity === 'high') severityEl.style.color = 'var(--warning-color)';
      else severityEl.style.color = 'var(--primary-color)';

      // Auto recommends
      const depts = document.getElementById('ai-res-depts');
      depts.innerHTML = '';
      if (incident.type === 'Road Accident') {
        depts.innerHTML = '<li>Highway Patrol & Traffic Police</li><li>Emergency Trauma Ambulance</li>';
      } else if (incident.type === 'Fire') {
        depts.innerHTML = '<li>Fire Brigade Rescue Unit</li><li>Police Perimeter Unit</li>';
      } else if (incident.type === 'Flood' || incident.type === 'Earthquake') {
        depts.innerHTML = '<li>NDRF Rescue Battalion</li><li>Local Medical Wing</li>';
      } else {
        depts.innerHTML = '<li>Municipal Emergency Wing</li><li>Emergency Trauma Support</li>';
      }

      loaderEl.style.display = 'none';
      resultsEl.style.display = 'block';
      playBeep(880, 0.3, 'sine');
      
      // Wire up dispatch button
      const dispatchBtn = document.getElementById('ai-btn-dispatch');
      const cancelBtn = document.getElementById('ai-btn-cancel');

      dispatchBtn.onclick = () => {
        incident.status = 'Verified';
        logSystem(`Incident ${incident.id} verified. Tracking active.`);
        navigateTo('live-tracking-page');
      };

      cancelBtn.onclick = () => {
        logSystem(`Incident ${incident.id} request cancelled by user.`);
        navigateTo('citizen-dashboard');
      };
    }
  }, 450);
}

// SOS emergency countdown screen
function initSOSModule() {
  const sosBtn = document.getElementById('sos-trigger-btn');
  const cancelBtn = document.getElementById('sos-cancel-btn');
  const progressCircle = document.getElementById('sos-countdown');
  
  if (sosBtn) {
    sosBtn.addEventListener('click', () => {
      startSOSSequence();
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      cancelSOSSequence();
    });
  }
}

// SOS sequence start
function startSOSSequence() {
  initAudio();
  navigateTo('emergency-sos-page');
  
  state.isSOSActive = true;
  state.sosCountdown = 5;
  
  const countEl = document.getElementById('sos-countdown-number');
  const pulseRings = document.querySelectorAll('.sos-outer-ring, .sos-outer-ring-2');
  
  countEl.textContent = state.sosCountdown;
  pulseRings.forEach(r => r.style.animationPlayState = 'running');

  // Trigger warning beep
  playBeep(988, 0.4, 'sawtooth');

  state.sosTimer = setInterval(() => {
    state.sosCountdown--;
    countEl.textContent = state.sosCountdown;
    
    // Play alert tick sound
    playBeep(800 + (5 - state.sosCountdown)*100, 0.1, 'square');

    if (state.sosCountdown <= 0) {
      clearInterval(state.sosTimer);
      triggerActiveSOS();
    }
  }, 1000);
}

function cancelSOSSequence() {
  if (state.sosTimer) {
    clearInterval(state.sosTimer);
  }
  state.isSOSActive = false;
  logSystem("SOS trigger cancelled by user.");
  navigateTo('citizen-dashboard');
}

function triggerActiveSOS() {
  state.isSOSActive = false;
  
  // Add direct SOS alarm into database
  const sosInc = {
    id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
    type: "SOS - Critical Beacon",
    icon: "emergency",
    severity: "critical",
    victimCount: 1,
    location: "GPS Lock: 28.5355° N, 77.3910° E (Noida Expressway)",
    coords: { x: 230, y: 220 },
    confidence: 100,
    aiSummary: "AUTOMATIC SOS BEACON TRIGGERED. High priority dispatch command initiated. GPS continuous streaming.",
    status: "Verified",
    timestamp: "Just now",
    assignedUnit: "Local Highway Patrol Wing 2",
    eta: "4 Mins",
    evidence: {
      img: "",
      video: ""
    }
  };

  state.incidents.unshift(sosInc);
  logSystem(`CRITICAL ALERT: SOS Beacon active! ${sosInc.id}`);
  
  // Trigger long alarm sound
  playBeep(1200, 0.8, 'sawtooth');
  setTimeout(() => playBeep(1000, 0.8, 'sawtooth'), 400);

  alert("SOS TRANSMITTED. Emergency Services (Police, Medical Wing) are en route to your active GPS location.");
  navigateTo('live-tracking-page');
}

// Render dynamic elements like stats and logs
function renderDynamicContent() {
  // Update resource managers UI cards
  const resourceGrid = document.getElementById('resource-cards-grid');
  if (resourceGrid) {
    resourceGrid.innerHTML = state.resources.map(res => {
      const availPct = Math.round((res.available / res.total) * 100);
      let barClass = 'success';
      if (availPct < 30) barClass = 'danger';
      
      let badgeClass = 'available';
      if (res.status === 'Critical Strain') badgeClass = 'busy';
      else if (res.status === 'High Demand') badgeClass = 'busy';

      return `
        <div class="resource-card premium-card">
          <div class="resource-header">
            <span class="resource-title">${res.name}</span>
            <span class="resource-availability-pill ${badgeClass}">${res.status}</span>
          </div>
          <div style="font-size: 24px; font-weight: 700; margin: 8px 0;">
            ${res.available} <span style="font-size: 14px; font-weight: 400; color: var(--text-secondary)">/ ${res.total} Free</span>
          </div>
          <div class="resource-progress-bar">
            <div class="resource-progress ${barClass}" style="width: ${availPct}%"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-light)">
            <span>Availability: ${availPct}%</span>
            <span>Capacity in use: ${res.total - res.available}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Update Citizen Alerts panel
  const activeAlertsGrid = document.getElementById('citizen-active-alerts');
  if (activeAlertsGrid) {
    activeAlertsGrid.innerHTML = `
      <div class="alert-strip">
        <span class="material-icons-round alert-strip-icon">warning</span>
        <div>
          <h4 style="font-weight: 700;">Cyclone Warning - Red Alert</h4>
          <p style="font-size: 12px; opacity: 0.9;">Severe cyclonic wind speeds on Southern East Coast. Emergency agencies mobilized.</p>
        </div>
      </div>
      <div class="alert-strip warning">
        <span class="material-icons-round alert-strip-icon">error_outline</span>
        <div>
          <h4 style="font-weight: 700;">Localized Waterlogging (Yamuna River Basin)</h4>
          <p style="font-size: 12px; opacity: 0.9;">Low-lying bridge crossings closed. Use detours marked by traffic authorities.</p>
        </div>
      </div>
    `;
  }
}

// Render incident feed on Operator portal
function renderAuthorityFeed() {
  const feed = document.getElementById('authority-incident-feed');
  const detailsBox = document.getElementById('authority-incident-details');
  
  if (!feed) return;

  const role = state.currentRole;
  
  // Filter incidents list based on current service role
  let filteredIncidents = state.incidents;
  let deptName = "National Dispatch Queue";
  let alertTitle = "";
  let alertDesc = "";
  
  // Metric configurations
  let statTime = "6.2 Min";
  let statActive = "3 Active";
  let statAvail = "42 Units";
  let statBusy = "18 Units";
  
  if (role === 'police') {
    filteredIncidents = state.incidents.filter(inc => inc.type === 'Road Accident' || inc.type === 'Crime / Security');
    deptName = "Police Dispatch Feed";
    alertTitle = "TRAFFIC CONTROL ADVISORY";
    alertDesc = "Highway Patrol units dispatched to NH-48 Sector 15. Expect traffic congestion on northbound lanes.";
    statTime = "5.1 Min";
    statActive = "2 Accidents";
    statAvail = "180 Officers";
    statBusy = "42 Units";
  } else if (role === 'ambulance') {
    filteredIncidents = state.incidents.filter(inc => inc.type === 'Medical Emergency' || inc.type === 'Road Accident');
    deptName = "Medical Trauma Dispatch Feed";
    alertTitle = "ICU BEDS ADVISORY";
    alertDesc = "Civil Hospital Sector 5 ICU capacity is at 90%. Reroute critical cardiac cases to Sector 21 Base.";
    statTime = "7.4 Min";
    statActive = "2 Medical Cases";
    statAvail = "18 Free ICU Beds";
    statBusy = "32 Ambulances";
  } else if (role === 'fire_brigade') {
    filteredIncidents = state.incidents.filter(inc => inc.type === 'Fire Emergency' || inc.type === 'Gas Leak');
    deptName = "Fire & HAZMAT Control Feed";
    alertTitle = "HAZMAT WARNING";
    alertDesc = "Toxic vapor pressure alert on Industrial Area Phase II. Check chemical safety masks and fire engine allocations.";
    statTime = "6.8 Min";
    statActive = "2 Active Fires";
    statAvail = "12 Stations Active";
    statBusy = "8 Trucks Out";
  } else if (role === 'disaster_authority') {
    filteredIncidents = state.incidents.filter(inc => inc.type === 'Flood Emergency' || inc.type === 'Earthquake');
    deptName = "NDRF Disaster Relief Feed";
    alertTitle = "RIVER WATER LEVEL ADVISORY";
    alertDesc = "Tejpur Outer Suburbs river water levels exceeded danger line by 1.2 meters. Alert coastal NDRF battalions.";
    statTime = "18.2 Min";
    statActive = "1 Flood Outbreak";
    statAvail = "4 Battalions Free";
    statBusy = "6 NDRF Teams";
  } else {
    // operator (Unified Hub)
    deptName = "Central Operator Hub Feed";
    alertTitle = "SYSTEM NETWORK NOTICE";
    alertDesc = "CCTV Feed channel CP-C8 is experiencing latency. Use sensor telemetry overlays as primary tracking source.";
    statTime = "6.2 Min";
    statActive = "6 Active Logs";
    statAvail = "42 Dispatchers";
    statBusy = "18 Teams busy";
  }

  // Update Advisory alert strip if elements exist
  const alertStrip = document.getElementById('authority-dept-alert');
  if (alertStrip) {
    if (alertTitle) {
      alertStrip.style.display = 'flex';
      alertStrip.querySelector('h4').textContent = alertTitle;
      alertStrip.querySelector('p').textContent = alertDesc;
    } else {
      alertStrip.style.display = 'none';
    }
  }

  // Update statistics values
  document.getElementById('auth-stat-time-val').textContent = statTime;
  document.getElementById('auth-stat-active-val').textContent = statActive;
  document.getElementById('auth-stat-avail-val').textContent = statAvail;
  document.getElementById('auth-stat-busy-val').textContent = statBusy;

  // Update feed header text
  const headerText = document.querySelector('#authority-dashboard .incident-sidebar-feed').previousElementSibling.querySelector('h3');
  if (headerText) {
    headerText.textContent = deptName;
  }

  // Safeguard index selection
  if (state.activeIncidentIndex >= filteredIncidents.length) {
    state.activeIncidentIndex = 0;
  }

  // Render filtered incidents list
  feed.innerHTML = filteredIncidents.map((inc, index) => {
    const isActive = index === state.activeIncidentIndex ? 'active' : '';
    return `
      <div class="incident-mini-card ${isActive}" onclick="setActiveIncident(${index})">
        <div class="incident-card-header">
          <span style="font-weight: 700; color: var(--primary-color)">${inc.id}</span>
          <span class="severity-badge ${inc.severity}">${inc.severity}</span>
        </div>
        <div class="incident-card-body">
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 2px;">${inc.type}</div>
          <div>${inc.location}</div>
        </div>
        <div class="incident-card-footer">
          <span>AI Conf: ${inc.confidence}%</span>
          <span>${inc.timestamp}</span>
        </div>
      </div>
    `;
  }).join('');

  const activeInc = filteredIncidents[state.activeIncidentIndex];
  if (activeInc && detailsBox) {
    const showMediaHtml = activeInc.evidence.img ? `
      <div class="details-media-gallery">
        <div class="main-media-placeholder">
          <img src="${activeInc.evidence.img}" alt="Evidence">
          <div style="position: absolute; bottom: 8px; left: 8px; background: rgba(0,0,0,0.6); color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px;">Multimodal Evidence #1</div>
        </div>
        <div class="side-media-placeholders">
          <div class="side-media-item">
            <span class="material-icons-round" style="font-size: 32px;">play_circle</span>
            <div style="position: absolute; bottom: 4px; left: 4px; font-size: 9px; color: white;">CCTV CCTV-881</div>
          </div>
          <div class="side-media-item">
            <span class="material-icons-round" style="font-size: 32px;">mic</span>
            <div style="position: absolute; bottom: 4px; left: 4px; font-size: 9px; color: white;">Voice Rec</div>
          </div>
        </div>
      </div>
    ` : '<div style="background-color: var(--bg-primary); padding: 16px; border-radius: 8px; text-align: center; color: var(--text-light);">No multimodal evidence files attached.</div>';

    detailsBox.innerHTML = `
      <div class="details-header">
        <div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <h2 style="font-size: 24px; font-weight: 700;">${activeInc.type}</h2>
            <span class="severity-badge ${activeInc.severity}">${activeInc.severity}</span>
          </div>
          <p style="color: var(--text-secondary); margin-top: 4px;"><span class="material-icons-round" style="font-size: 14px; vertical-align: middle; margin-right: 4px;">pin_drop</span>${activeInc.location}</p>
        </div>
        <div style="text-align: right;">
          <h3 style="color: var(--primary-color); font-weight: 700;">${activeInc.id}</h3>
          <span style="font-size: 12px; color: var(--text-light);">${activeInc.timestamp}</span>
        </div>
      </div>
      
      <div class="details-grid">
        <div>
          <h4 style="font-weight: 700; margin-bottom: 8px;">Incident Evidence Files</h4>
          ${showMediaHtml}

          <div style="margin-top: 20px;">
            <h4 style="font-weight: 700; margin-bottom: 6px;">AI Summary & Intelligence</h4>
            <div style="background-color: var(--bg-primary); padding: 16px; border-radius: var(--border-radius-md); border: 1px solid var(--border-color); font-size: 14px; line-height: 1.6;">
              ${activeInc.aiSummary}
              <div style="display: flex; gap: 16px; margin-top: 12px; border-top: 1px solid var(--border-color); padding-top: 8px; font-size: 12px; color: var(--text-secondary);">
                <span><strong>AI Confidence:</strong> ${activeInc.confidence}%</span>
                <span><strong>Predicted Victims:</strong> ${activeInc.victimCount}</span>
                <span><strong>Status:</strong> ${activeInc.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 style="font-weight: 700; margin-bottom: 12px;">Nearest Emergency Resources</h4>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="background-color: var(--bg-primary); padding: 12px; border-radius: var(--border-radius-sm); font-size: 13px; display: flex; justify-content: space-between;">
              <span><strong>Civil Hospital Trauma Unit</strong></span>
              <span style="color: var(--success-color);">1.2 km away</span>
            </div>
            <div style="background-color: var(--bg-primary); padding: 12px; border-radius: var(--border-radius-sm); font-size: 13px; display: flex; justify-content: space-between;">
              <span><strong>Police Station Sector 5</strong></span>
              <span style="color: var(--success-color);">2.5 km away</span>
            </div>
            <div style="background-color: var(--bg-primary); padding: 12px; border-radius: var(--border-radius-sm); font-size: 13px; display: flex; justify-content: space-between;">
              <span><strong>Fire Headquarters CP</strong></span>
              <span style="color: var(--warning-color);">4.1 km away</span>
            </div>
          </div>

          <div style="margin-top: 24px;">
            <h4 style="font-weight: 700; margin-bottom: 12px;">Operational Controls</h4>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <button class="btn btn-primary" onclick="dispatchOperatorIncident('${activeInc.id}')" style="width: 100%;">
                <span class="material-icons-round">local_shipping</span> Dispatch Assigned Units
              </button>
              <div style="display: flex; gap: 12px;">
                <button class="btn btn-secondary" onclick="rejectOperatorIncident('${activeInc.id}')" style="flex: 1; border-color: var(--danger-color); color: var(--danger-color);">
                  Reject Fraud Alert
                </button>
                <button class="btn btn-secondary" onclick="alert('Backup alert sent to NDRF command.')" style="flex: 1;">
                  Request Backup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (detailsBox) {
    detailsBox.innerHTML = '<div style="background-color: var(--bg-secondary); padding: 32px; border-radius: 12px; text-align: center; border: 1px solid var(--border-color); color: var(--text-light); font-weight: 600;">No active incidents matching your service profile are currently in queue.</div>';
  }
}

function setActiveIncident(index) {
  state.activeIncidentIndex = index;
  renderAuthorityFeed();
}

// Action triggers from Operator dashboard
window.setActiveIncident = setActiveIncident;
window.dispatchOperatorIncident = (id) => {
  const inc = state.incidents.find(i => i.id === id);
  if (inc) {
    inc.status = 'En Route';
    inc.assignedUnit = 'Ambulance Unit G-5 dispatched';
    logSystem(`Operator Dispatch approved for: ${id}`);
    renderAuthorityFeed();
    alert(`Resource dispatch orders transmitted for incident ${id}`);
  }
};
window.rejectOperatorIncident = (id) => {
  const inc = state.incidents.find(i => i.id === id);
  if (inc) {
    inc.status = 'Rejected (Fraud Alert)';
    logSystem(`Operator flagged incident ${id} as Fraud.`);
    renderAuthorityFeed();
    alert(`Incident ${id} flag updated to FRAUD.`);
  }
};

// Map simulation engine using HTML5 canvas
const mapIntervals = {};
function initMapSimulators() {
  // Draw maps once loaded
  setTimeout(() => {
    startTrackingMap('hero-live-map');
  }, 100);
}

function startTrackingMap(canvasId, animateVehicle = false) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  
  // Clear any existing map update loop for this canvas
  if (mapIntervals[canvasId]) {
    cancelAnimationFrame(mapIntervals[canvasId]);
  }

  // Map settings
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;
  canvas.width = width;
  canvas.height = height;

  // Grid points
  const points = [];
  for (let i = 0; i < 20; i++) {
    points.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 2 + Math.random() * 4,
      color: state.theme === 'dark' ? '#1E293B' : '#E2E8F0'
    });
  }

  // Active units positions
  const units = [
    { x: width * 0.25, y: height * 0.4, type: 'ambulance', label: 'AMB-108' },
    { x: width * 0.7, y: height * 0.3, type: 'police', label: 'POL-112' },
    { x: width * 0.45, y: height * 0.8, type: 'fire', label: 'FR-101' }
  ];

  // Route calculation for animated vehicles
  let routeProgress = 0;
  const startX = width * 0.15;
  const startY = height * 0.85;
  const destX = width * 0.55;
  const destY = height * 0.35;

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw grid background
    ctx.fillStyle = state.theme === 'dark' ? '#0F172A' : '#E2E8F0';
    ctx.fillRect(0, 0, width, height);

    // Draw decorative map roads
    ctx.strokeStyle = state.theme === 'dark' ? '#1E293B' : '#F1F5F9';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    
    // Horizontal highway
    ctx.beginPath();
    ctx.moveTo(0, height * 0.5);
    ctx.lineTo(width, height * 0.55);
    ctx.stroke();

    // Cross roads
    ctx.beginPath();
    ctx.moveTo(width * 0.3, 0);
    ctx.lineTo(width * 0.35, height);
    ctx.moveTo(width * 0.75, 0);
    ctx.lineTo(width * 0.7, height);
    ctx.stroke();

    // Inner roads
    ctx.lineWidth = 6;
    ctx.strokeStyle = state.theme === 'dark' ? '#334155' : '#CBD5E1';
    ctx.beginPath();
    ctx.moveTo(width * 0.1, height * 0.2);
    ctx.lineTo(width * 0.9, height * 0.85);
    ctx.stroke();

    // Draw topographic nodes
    points.forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fillStyle = pt.color;
      ctx.fill();
    });

    // Draw active incident markers
    state.incidents.forEach(inc => {
      // Map local coords to canvas sizes
      const mapX = (inc.coords.x / 400) * width;
      const mapY = (inc.coords.y / 400) * height;

      // Pulse circle
      const pulseRadius = 12 + Math.sin(Date.now() / 200) * 4;
      ctx.beginPath();
      ctx.arc(mapX, mapY, pulseRadius, 0, Math.PI * 2);
      ctx.fillStyle = inc.severity === 'critical' ? 'rgba(234, 67, 53, 0.15)' : 'rgba(251, 188, 5, 0.15)';
      ctx.fill();

      // Core incident pin
      ctx.beginPath();
      ctx.arc(mapX, mapY, 6, 0, Math.PI * 2);
      ctx.fillStyle = inc.severity === 'critical' ? 'var(--danger-color)' : 'var(--warning-color)';
      ctx.fill();
    });

    // Render emergency static resources (Hospitals, Police Station markers)
    units.forEach(unit => {
      ctx.beginPath();
      ctx.arc(unit.x, unit.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = unit.type === 'ambulance' ? 'var(--primary-color)' : 'var(--success-color)';
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(unit.label, unit.x, unit.y - 14);
    });

    // Draw dispatch line & animated vehicle (Live Tracking state)
    if (animateVehicle) {
      // Draw route path
      ctx.strokeStyle = 'var(--primary-color)';
      ctx.lineWidth = 4;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(destX, destY);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // Calculate position
      routeProgress += 0.005;
      if (routeProgress > 1) routeProgress = 0; // Loop route driving
      
      const currentX = startX + (destX - startX) * routeProgress;
      const currentY = startY + (destY - startY) * routeProgress;

      // Draw ambulance vehicle representation
      ctx.fillStyle = 'var(--danger-color)';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.rect(currentX - 6, currentY - 3, 12, 6);
      ctx.fill();

      // Blinking siren light
      const sirenColor = Math.floor(Date.now() / 150) % 2 === 0 ? 'var(--primary-color)' : 'var(--danger-color)';
      ctx.beginPath();
      ctx.arc(currentX, currentY - 8, 4, 0, Math.PI * 2);
      ctx.fillStyle = sirenColor;
      ctx.fill();
    }

    mapIntervals[canvasId] = requestAnimationFrame(draw);
  }

  draw();
}

// Chart Engine using canvas for modern clean graphs
function initAnalyticsCharts() {
  // Handled inside navigateTo hook for redraw accuracy
}

function drawAnalytics() {
  const lineCanvas = document.getElementById('analytics-line-chart');
  const barCanvas = document.getElementById('analytics-bar-chart');

  if (lineCanvas) {
    const ctx = lineCanvas.getContext('2d');
    const w = lineCanvas.offsetWidth;
    const h = lineCanvas.offsetHeight;
    lineCanvas.width = w;
    lineCanvas.height = h;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'var(--primary-color)';
    ctx.lineWidth = 3;
    
    // Draw Daily Alerts line chart
    const data = [45, 62, 55, 90, 80, 110, 95];
    const steps = w / (data.length - 1);
    
    ctx.beginPath();
    data.forEach((val, idx) => {
      const x = idx * steps;
      const y = h - (val / 150) * h * 0.7 - 20;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Chart grid label mock
    ctx.fillStyle = 'var(--text-secondary)';
    ctx.font = '10px var(--font-body)';
    ctx.fillText("Mon", 10, h - 5);
    ctx.fillText("Wed", w/2 - 10, h - 5);
    ctx.fillText("Sun", w - 30, h - 5);
  }

  if (barCanvas) {
    const ctx = barCanvas.getContext('2d');
    const w = barCanvas.offsetWidth;
    const h = barCanvas.offsetHeight;
    barCanvas.width = w;
    barCanvas.height = h;

    ctx.clearRect(0, 0, w, h);
    
    // Draw Category Bar Chart (Accident, Fire, Medical, Flood)
    const data = [
      { name: "Accident", val: 120, color: 'var(--primary-color)' },
      { name: "Fire", val: 80, color: 'var(--danger-color)' },
      { name: "Medical", val: 150, color: 'var(--success-color)' },
      { name: "Disaster", val: 40, color: 'var(--warning-color)' }
    ];

    const barWidth = w / 6;
    const spacing = w / 5;

    data.forEach((item, idx) => {
      const barHeight = (item.val / 200) * h * 0.7;
      const x = spacing * idx + 20;
      const y = h - barHeight - 20;

      ctx.fillStyle = item.color;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Label text
      ctx.fillStyle = 'var(--text-secondary)';
      ctx.font = '10px var(--font-body)';
      ctx.fillText(item.name, x, h - 5);
    });
  }
}

// Live Audio Recording & Simulation Manager
let mediaRecorder = null;
let audioChunks = [];
let recordTimer = null;
let recordSeconds = 0;

function toggleAudioRecording() {
  const statusDot = document.getElementById('record-status-dot');
  const statusText = document.getElementById('record-status-text');
  const waveContainer = document.getElementById('voice-wave-container');
  const startBtn = document.getElementById('btn-start-record');
  const stopBtn = document.getElementById('btn-stop-record');
  
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        audioChunks = [];
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = event => {
          audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
          const audioUrl = URL.createObjectURL(audioBlob);
          
          const audioPlayback = document.getElementById('recorded-audio-playback');
          const audioContainer = document.getElementById('attached-audio-container');
          
          audioPlayback.src = audioUrl;
          audioContainer.style.display = 'block';
          
          // Add visual item to upload list
          const previewBox = document.getElementById('upload-preview-box');
          if (previewBox) {
            const thumb = document.createElement('div');
            thumb.className = 'upload-thumb-audio';
            thumb.style.cssText = 'background: var(--danger-light); color: var(--danger-color); padding: 8px; border-radius: var(--border-radius-sm); font-size: 11px; font-weight: 700; border: 1px solid rgba(234, 67, 53, 0.2); display: flex; align-items: center; gap: 6px; height: 80px; width: 80px; text-align: center; justify-content: center; flex-direction: column; cursor: pointer;';
            thumb.innerHTML = '<span class="material-icons-round">mic</span><span>Voice.mp3</span>';
            thumb.onclick = () => {
              if (confirm("Delete this audio attachment?")) {
                thumb.remove();
                audioContainer.style.display = 'none';
                audioPlayback.src = '';
              }
            };
            previewBox.appendChild(thumb);
          }
          
          logSystem("Voice recording attached as evidence.");
        };

        mediaRecorder.start();
        
        // Start visual animations
        statusDot.style.display = 'inline-block';
        statusDot.classList.add('pulsing');
        waveContainer.style.display = 'flex';
        waveContainer.classList.add('recording');
        
        startBtn.disabled = true;
        startBtn.style.opacity = '0.5';
        startBtn.style.cursor = 'not-allowed';
        
        stopBtn.disabled = false;
        stopBtn.style.opacity = '1';
        stopBtn.style.cursor = 'pointer';
        
        playBeep(600, 0.1, 'sine');
        
        recordSeconds = 0;
        statusText.textContent = 'REC: 00:00';
        recordTimer = setInterval(() => {
          recordSeconds++;
          const mins = String(Math.floor(recordSeconds / 60)).padStart(2, '0');
          const secs = String(recordSeconds % 60).padStart(2, '0');
          statusText.textContent = `REC: ${mins}:${secs}`;
          
          if (recordSeconds % 5 === 0) {
            playBeep(880, 0.05, 'sine');
          }
        }, 1000);
        
        logSystem("Voice recording started.");
      })
      .catch(err => {
        console.warn("Audio recording permission denied or unavailable, using simulation", err);
        simulateAudioRecording();
      });
  } else {
    simulateAudioRecording();
  }
}

function simulateAudioRecording() {
  const statusDot = document.getElementById('record-status-dot');
  const statusText = document.getElementById('record-status-text');
  const waveContainer = document.getElementById('voice-wave-container');
  const startBtn = document.getElementById('btn-start-record');
  const stopBtn = document.getElementById('btn-stop-record');
  
  statusDot.style.display = 'inline-block';
  statusDot.classList.add('pulsing');
  waveContainer.style.display = 'flex';
  waveContainer.classList.add('recording');
  
  startBtn.disabled = true;
  startBtn.style.opacity = '0.5';
  startBtn.style.cursor = 'not-allowed';
  
  stopBtn.disabled = false;
  stopBtn.style.opacity = '1';
  stopBtn.style.cursor = 'pointer';
  
  playBeep(600, 0.1, 'sine');
  
  recordSeconds = 0;
  statusText.textContent = 'REC: 00:00';
  recordTimer = setInterval(() => {
    recordSeconds++;
    const mins = String(Math.floor(recordSeconds / 60)).padStart(2, '0');
    const secs = String(recordSeconds % 60).padStart(2, '0');
    statusText.textContent = `REC: ${mins}:${secs}`;
    if (recordSeconds % 5 === 0) {
      playBeep(880, 0.05, 'sine');
    }
  }, 1000);
  
  logSystem("Simulated voice recording started (Mic fallback).");
}

function stopAudioRecording() {
  const statusDot = document.getElementById('record-status-dot');
  const statusText = document.getElementById('record-status-text');
  const waveContainer = document.getElementById('voice-wave-container');
  const startBtn = document.getElementById('btn-start-record');
  const stopBtn = document.getElementById('btn-stop-record');
  
  if (recordTimer) {
    clearInterval(recordTimer);
  }
  
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
  } else {
    const audioContainer = document.getElementById('attached-audio-container');
    const audioPlayback = document.getElementById('recorded-audio-playback');
    
    // Simulate attaching a mock audio file
    audioPlayback.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    audioContainer.style.display = 'block';
    
    // Add visual item to upload list
    const previewBox = document.getElementById('upload-preview-box');
    if (previewBox) {
      const thumb = document.createElement('div');
      thumb.className = 'upload-thumb-audio';
      thumb.style.cssText = 'background: var(--danger-light); color: var(--danger-color); padding: 8px; border-radius: var(--border-radius-sm); font-size: 11px; font-weight: 700; border: 1px solid rgba(234, 67, 53, 0.2); display: flex; align-items: center; gap: 6px; height: 80px; width: 80px; text-align: center; justify-content: center; flex-direction: column; cursor: pointer;';
      thumb.innerHTML = '<span class="material-icons-round">mic</span><span>Voice.mp3</span>';
      thumb.onclick = () => {
        if (confirm("Delete this audio attachment?")) {
          thumb.remove();
          audioContainer.style.display = 'none';
          audioPlayback.src = '';
        }
      };
      previewBox.appendChild(thumb);
    }
    
    logSystem("Simulated voice recording attached.");
  }
  
  playBeep(400, 0.25, 'sine');
  
  statusDot.style.display = 'none';
  statusDot.classList.remove('pulsing');
  waveContainer.style.display = 'none';
  waveContainer.classList.remove('recording');
  statusText.textContent = 'Idle';
  
  startBtn.disabled = false;
  startBtn.style.opacity = '1';
  startBtn.style.cursor = 'pointer';
  
  stopBtn.disabled = true;
  stopBtn.style.opacity = '0.5';
  stopBtn.style.cursor = 'not-allowed';
}

function deleteAudioRecording() {
  if (confirm("Are you sure you want to delete this recorded voice note?")) {
    const audioContainer = document.getElementById('attached-audio-container');
    const audioPlayback = document.getElementById('recorded-audio-playback');
    
    // Clear audio source
    audioPlayback.src = '';
    audioContainer.style.display = 'none';
    
    // Remove the thumbnail in the preview list
    const previewBox = document.getElementById('upload-preview-box');
    if (previewBox) {
      const audioThumbs = previewBox.querySelectorAll('.upload-thumb-audio');
      audioThumbs.forEach(thumb => thumb.remove());
    }
    
    logSystem("Voice recording deleted.");
  }
}

function toggleMobileSidebar(event) {
  if (event) {
    event.stopPropagation();
  }
  const sidebar = document.getElementById('app-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar && backdrop) {
    const isOpen = sidebar.classList.toggle('mobile-open');
    if (isOpen) {
      backdrop.classList.add('active');
    } else {
      backdrop.classList.remove('active');
    }
  }
}

// Global scope bindings
window.switchRole = switchRole;
window.navigateTo = navigateTo;
window.toggleAudioRecording = toggleAudioRecording;
window.stopAudioRecording = stopAudioRecording;
window.deleteAudioRecording = deleteAudioRecording;
window.toggleMobileSidebar = toggleMobileSidebar;
