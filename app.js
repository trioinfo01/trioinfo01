document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.setAttribute('data-theme', 'light');
  localStorage.setItem('trio_theme', 'light');
  initParticles();
  initAnnouncementBar();
  initNavigation();
  initSuiteTabs();
  initIndustryTabs();
  initRoiCalculator();
  initCounters();
  initModalsAndForms();
  setCurrentYear();
});

/* ==========================================================================
   1. HERO PARTICLE NETWORK CANVAS
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 70;
  const maxDistance = 140;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      const palette = ['#10b981', '#0f172a', '#f97316'];
      this.color = palette[Math.floor(Math.random() * palette.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59, 130, 246, ${1 - dist / maxDistance * 0.85})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. ANNOUNCEMENT BAR
   ========================================================================== */
function initAnnouncementBar() {
  const closeBtn = document.getElementById('closeAnnouncement');
  const bar = document.getElementById('announcementBar');
  if (closeBtn && bar) {
    closeBtn.addEventListener('click', () => {
      bar.style.display = 'none';
    });
  }
}

/* ==========================================================================
   4. NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileDrawer');
  const closeDrawer = document.getElementById('closeDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const drawerDemoBtn = document.getElementById('drawerDemoBtn');

  if (mobileToggle && drawer) {
    mobileToggle.addEventListener('click', () => {
      drawer.classList.add('open');
    });
  }

  if (closeDrawer && drawer) {
    closeDrawer.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  });

  if (drawerDemoBtn) {
    drawerDemoBtn.addEventListener('click', () => {
      drawer.classList.remove('open');
      openDemoModal();
    });
  }
}

/* ==========================================================================
   5. ZOHO-STYLE SUITE EXPLORER TABS
   ========================================================================== */
function initSuiteTabs() {
  const tabBtns = document.querySelectorAll('.suite-tab-btn');
  const panels = document.querySelectorAll('.suite-panel');
  const megaItems = document.querySelectorAll('.mega-item');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      activateTab(targetId);
    });
  });

  megaItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const app = item.getAttribute('data-app');
      if (app) {
        const targetPanelId = `suite-${app}`;
        activateTab(targetPanelId);
      }
    });
  });

  function activateTab(targetId) {
    tabBtns.forEach(b => {
      if (b.getAttribute('data-target') === targetId) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    panels.forEach(p => {
      if (p.id === targetId) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   6. INDUSTRY BLUEPRINTS SWITCHER
   ========================================================================== */
const industryData = {
  fintech: {
    tag: 'FINANCIAL TECHNOLOGY',
    title: 'Bank-Grade FinTech & Payment Ecosystems',
    desc: 'Engineered for ultra-low latency transaction processing, sub-second fraud detection, ISO 20022 compliance, and automated AML sanctions screening.',
    highlights: [
      '100,000+ Transactions Per Second (TPS)',
      'PCI-DSS Level 1 Compliant Architecture',
      'Real-time ledger sync across global currency pairs'
    ],
    stats: [
      { val: '$12B+', lbl: 'Annual Transactions Handled' },
      { val: '99.999%', lbl: 'Payment Gateway Availability' },
      { val: '< 18ms', lbl: 'Avg. Auth Latency' }
    ]
  },
  health: {
    tag: 'HEALTHCARE & LIFE SCIENCES',
    title: 'HIPAA & HL7/FHIR Compliant Telehealth Networks',
    desc: 'End-to-end encrypted medical telemetry, AI radiology report parsing, patient portal orchestration, and EHR/EMR interoperability.',
    highlights: [
      '100% HIPAA & GDPR Protected Infrastructure',
      'Instant Diagnostic Imaging PACS Streaming',
      'AI Clinical Scribe & Automated Patient Follow-ups'
    ],
    stats: [
      { val: '4.8M+', lbl: 'Encrypted Patient Records' },
      { val: '65+', lbl: 'Hospital Networks Connected' },
      { val: '0', lbl: 'Security Breaches In 8 Years' }
    ]
  },
  retail: {
    tag: 'RETAIL & E-COMMERCE',
    title: 'Omnichannel Commerce & Real-Time Logistics',
    desc: 'Unified cart and checkout across web, mobile, POS, and social channels with automated warehouse fulfillment and drop-ship sync.',
    highlights: [
      'Sub-50ms Global Cart Checkout Experience',
      'AI Dynamic Pricing & Inventory Forecasting',
      'Unified Loyalty, Multi-Tier Discounts & Subscriptions'
    ],
    stats: [
      { val: '10x', lbl: 'Black Friday Peak Resilience' },
      { val: '140+', lbl: 'Stores Synced Real-Time' },
      { val: '+38%', lbl: 'Avg. Order Value Increase' }
    ]
  },
  mfg: {
    tag: 'MANUFACTURING & INDUSTRY 4.0',
    title: 'IoT Telemetry & Smart Supply Chain MES',
    desc: 'Real-time shop-floor sensor telemetry, predictive machine maintenance, RFID automated tracking, and BOM bill-of-materials optimization.',
    highlights: [
      'Edge Computing for Low-Latency Sensor Loops',
      'Automated Quality Control via Computer Vision',
      'ERP integration with Global Supplier Portals'
    ],
    stats: [
      { val: '84%', lbl: 'Reduction In Factory Downtime' },
      { val: '2.4M', lbl: 'IoT Sensor Messages / Sec' },
      { val: '99.8%', lbl: 'Production Quality Yield' }
    ]
  },
  edtech: {
    tag: 'EDTECH & HIGHER EDUCATION',
    title: 'Interactive Learning Management & Campus ERP',
    desc: 'Live high-concurrency video classrooms, AI auto-grading, student information systems (SIS), and automated university billing.',
    highlights: [
      '50,000+ Concurrent Live Video Streams',
      'AI Personalized Learning Path Tutor',
      'Multi-campus unified attendance & grade book'
    ],
    stats: [
      { val: '1.2M+', lbl: 'Active Students Enrolled' },
      { val: '40+', lbl: 'Universities & Institutes' },
      { val: '4.9/5', lbl: 'Faculty Satisfaction Score' }
    ]
  }
};

function initIndustryTabs() {
  const pills = document.querySelectorAll('.ind-pill');
  const tagEl = document.getElementById('indTag');
  const titleEl = document.getElementById('indTitle');
  const descEl = document.getElementById('indDesc');
  const highlightsEl = document.getElementById('indHighlights');
  const statsBox = document.querySelector('.ind-stats-box');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const indKey = pill.getAttribute('data-ind');
      const data = industryData[indKey];

      if (data && tagEl && titleEl && descEl && highlightsEl && statsBox) {
        tagEl.textContent = data.tag;
        titleEl.textContent = data.title;
        descEl.textContent = data.desc;

        highlightsEl.innerHTML = data.highlights
          .map(h => `<div class="ind-h-item"><i class="fa-solid fa-check-circle"></i> ${h}</div>`)
          .join('');

        statsBox.innerHTML = data.stats
          .map(s => `
            <div class="stat-card">
              <div class="stat-val">${s.val}</div>
              <div class="stat-lbl">${s.lbl}</div>
            </div>
          `)
          .join('');
      }
    });
  });
}

/* ==========================================================================
   7. LIVE REAL-TIME ROI & COST ESTIMATOR
   ========================================================================== */
function initRoiCalculator() {
  const userSlider = document.getElementById('userCount');
  const userVal = document.getElementById('userCountVal');
  const cloudSlider = document.getElementById('cloudSpend');
  const cloudVal = document.getElementById('cloudSpendVal');
  const aiCheckbox = document.getElementById('includeAI');

  const savingsAnnual = document.getElementById('savingsAnnual');
  const traditionalCost = document.getElementById('traditionalCost');
  const trioCost = document.getElementById('trioCost');
  const hoursSaved = document.getElementById('hoursSaved');
  const calcQuoteBtn = document.getElementById('calcGetQuoteBtn');

  function calculate() {
    if (!userSlider || !cloudSlider) return;

    const users = parseInt(userSlider.value);
    const monthlySpend = parseInt(cloudSlider.value);
    const hasAI = aiCheckbox ? aiCheckbox.checked : true;

    // Display labels
    userVal.textContent = `${users} Users`;
    cloudVal.textContent = `$${monthlySpend.toLocaleString()} / mo`;

    // Calculation logic
    const annualTraditional = (monthlySpend * 12) + (users * 60 * 12);
    const trioPerUser = hasAI ? 28 : 22;
    const trioAnnual = (users * trioPerUser * 12) + (monthlySpend * 12 * 0.45);
    const netSavings = Math.max(0, Math.round(annualTraditional - trioAnnual));
    const estimatedHours = Math.round(users * 36);

    // Update DOM
    if (savingsAnnual) savingsAnnual.textContent = `$${netSavings.toLocaleString()}`;
    if (traditionalCost) traditionalCost.textContent = `$${annualTraditional.toLocaleString()} / yr`;
    if (trioCost) trioCost.textContent = `$${Math.round(trioAnnual).toLocaleString()} / yr`;
    if (hoursSaved) hoursSaved.textContent = `${estimatedHours.toLocaleString()} hrs / yr`;
  }

  if (userSlider) userSlider.addEventListener('input', calculate);
  if (cloudSlider) cloudSlider.addEventListener('input', calculate);
  if (aiCheckbox) aiCheckbox.addEventListener('change', calculate);

  if (calcQuoteBtn) {
    calcQuoteBtn.addEventListener('click', () => {
      openDemoModal();
    });
  }

  calculate();
}

/* ==========================================================================
   8. ANIMATED STAT COUNTERS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.trust-number');
  let animated = false;

  function runCounters() {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isPercent = counter.textContent.includes('%');
      const isPlus = counter.textContent.includes('+');

      let count = 0;
      const duration = 2000;
      const stepTime = 30;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;

      const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
          count = target;
          clearInterval(timer);
        }

        let displayVal = count.toLocaleString(undefined, {
          minimumFractionDigits: target % 1 !== 0 ? 2 : 0,
          maximumFractionDigits: 2
        });

        if (isPercent) displayVal += '%';
        if (isPlus) displayVal += '+';

        counter.textContent = displayVal;
      }, stepTime);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        runCounters();
      }
    });
  }, { threshold: 0.5 });

  const heroTrust = document.querySelector('.hero-trust');
  if (heroTrust) observer.observe(heroTrust);
}

/* ==========================================================================
   9. MODALS & FORMS
   ========================================================================== */
function initModalsAndForms() {
  const demoModal = document.getElementById('demoModal');
  const openDemoBtn = document.getElementById('openDemoModal');
  const heroStartBtn = document.getElementById('heroStartBtn');
  const closeDemoBtn = document.getElementById('closeDemoModal');
  const demoForm = document.getElementById('demoForm');
  const contactForm = document.getElementById('contactForm');

  // Set default demo date to tomorrow
  const demoDateInput = document.getElementById('demoDate');
  if (demoDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    demoDateInput.value = tomorrow.toISOString().split('T')[0];
    demoDateInput.min = tomorrow.toISOString().split('T')[0];
  }

  if (openDemoBtn) openDemoBtn.addEventListener('click', openDemoModal);
  if (heroStartBtn) heroStartBtn.addEventListener('click', openDemoModal);
  if (closeDemoBtn) closeDemoBtn.addEventListener('click', closeDemoModalState);

  // Close modal when clicking outside container
  if (demoModal) {
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) {
        closeDemoModalState();
      }
    });
  }

  // Handle Demo Booking submission
  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('demoName').value;
      const product = document.getElementById('demoProduct').value;

      closeDemoModalState();
      demoForm.reset();
      showToast(`Thank you ${name}! Your demo for ${product} has been scheduled. Our executive will reach out shortly.`, 'success');
    });
  }

  // Handle Contact / RFP submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('fullName').value;
      const service = document.getElementById('interestService').value;

      contactForm.reset();
      showToast(`Request received! Our Solution Architect will contact you regarding "${service}" within 2 hours.`, 'success');
    });
  }
}

function openDemoModal() {
  const modal = document.getElementById('demoModal');
  if (modal) modal.classList.add('open');
}

function closeDemoModalState() {
  const modal = document.getElementById('demoModal');
  if (modal) modal.classList.remove('open');
}

// Global helper for buttons with specific product pre-selection
window.openDemoWithProduct = function (productName) {
  const select = document.getElementById('demoProduct');
  if (select) {
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].text.includes(productName) || select.options[i].value.includes(productName)) {
        select.selectedIndex = i;
        break;
      }
    }
  }
  openDemoModal();
};

/* ==========================================================================
   10. CASE STUDY MODAL DEEP DIVE
   ========================================================================== */
window.openCaseStudyModal = function (id) {
  const caseStudies = {
    1: {
      title: "Apex Capital: Neo-Bank Modernization Case Study",
      content: "Apex Capital transitioned from a legacy monolithic stack to Trio Cloud Orchestrator and custom Go microservices on AWS EKS. The result was an immediate 800ms settlement latency, 99.999% SLA compliance, and $1.2M annual infrastructure savings."
    },
    2: {
      title: "Nova HealthTech: AI Diagnostic Patient Portal",
      content: "Deployed Trio Cortex AI across 65 hospital networks with private on-premise LLMs. Achieved 72% faster diagnostic report turnaround while strictly passing 100% of HIPAA and SOC-2 Type II regulatory compliance checks."
    },
    3: {
      title: "Omnistore Global: Enterprise Real-Time ERP",
      content: "Consolidated 12 legacy silos into Trio Nexus ERP across 140 physical locations and 4 e-commerce stores. Inventory discrepancies were eliminated (0.00% mismatch) and dead-stock write-downs dropped by $3.8M."
    }
  };

  const cs = caseStudies[id];
  if (cs) {
    showToast(`${cs.title}: ${cs.content}`, 'info', 7000);
  }
};

/* ==========================================================================
   11. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, type = 'success', duration = 4500) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';

  const iconClass = type === 'success' ? 'fa-solid fa-circle-check text-green' : 'fa-solid fa-circle-info text-blue';
  toast.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ==========================================================================
   12. CURRENT YEAR
   ========================================================================== */
function setCurrentYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
