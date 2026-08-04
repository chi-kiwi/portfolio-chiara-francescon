import { projectsData, personalSkills } from './projects-data.js';

let audioEnabled = true;

/* ==========================================================================
   BULLETPROOF APP INITIALIZATION
   ========================================================================== */
function safeExec(fn, name) {
  try {
    fn();
  } catch (err) {
    console.error(`Error in ${name}:`, err);
  }
}

function initApp() {
  safeExec(initNavbar, 'initNavbar');
  safeExec(initAudioToggle, 'initAudioToggle');
  safeExec(initScrollReveal, 'initScrollReveal');
  safeExec(renderSkills, 'renderSkills');
  safeExec(() => renderProjects(projectsData), 'renderProjects');
  safeExec(initFilters, 'initFilters');
  safeExec(initModal, 'initModal');
  safeExec(initRoiCalculator, 'initRoiCalculator');
  safeExec(initProjectConfigurator, 'initProjectConfigurator');
  safeExec(initFaqAccordion, 'initFaqAccordion');
  safeExec(initPlaygroundQuiz, 'initPlaygroundQuiz');
  safeExec(initContactForm, 'initContactForm');
  safeExec(initInteractiveBadges, 'initInteractiveBadges');
  safeExec(initConfettiButton, 'initConfettiButton');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/* ==========================================================================
   WEB AUDIO API SOUND EFFECTS
   ========================================================================== */
function playSynthSound(freq = 523.25, type = 'sine', duration = 0.15) {
  if (!audioEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio fallback
  }
}

function playSuccessChime() {
  playSynthSound(523.25, 'sine', 0.12);
  setTimeout(() => playSynthSound(659.25, 'sine', 0.12), 80);
  setTimeout(() => playSynthSound(783.99, 'sine', 0.2), 160);
}

function playPop() {
  playSynthSound(440, 'triangle', 0.08);
}

function initAudioToggle() {
  const toggleBtn = document.getElementById('soundToggle');
  if (toggleBtn) {
    toggleBtn.onclick = () => {
      audioEnabled = !audioEnabled;
      if (audioEnabled) {
        toggleBtn.classList.remove('muted');
        toggleBtn.innerText = '🔊 Audio ON';
        playSuccessChime();
        showToast('Effetti Audio Attivati! 🎵');
      } else {
        toggleBtn.classList.add('muted');
        toggleBtn.innerText = '🔇 Audio OFF';
        showToast('Effetti Audio Disattivati 🔇');
      }
    };
  }
}

/* ==========================================================================
   CONFETTI PARTICLE ENGINE (BULLETPROOF & HIGH VISIBILITY)
   ========================================================================== */
export function fireConfetti() {
  try {
    playSuccessChime();
  } catch (e) {}

  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#2563eb', '#0d9488', '#f59e0b', '#ec4899', '#10b981', '#8b5cf6', '#ef4444'];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height * 0.35,
      vx: (Math.random() - 0.5) * 22,
      vy: (Math.random() - 0.7) * 22,
      size: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      spin: (Math.random() - 0.5) * 14
    });
  }

  let animationFrame;

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeParticles = 0;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.42;
      p.vx *= 0.98;
      p.alpha -= 0.012;
      p.rotation += p.spin;

      if (p.alpha > 0) {
        activeParticles++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (activeParticles > 0) {
      animationFrame = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  render();
}

window.fireConfetti = fireConfetti;

function initConfettiButton() {
  const funBtn = document.getElementById('heroBtnFun');
  if (funBtn) {
    funBtn.onclick = (e) => {
      if (e) e.preventDefault();
      fireConfetti();
      showToast('🎉 Che la festa dell\'efficienza abbia inizio!');
    };
  }
}

/* ==========================================================================
   TIME SAVED ROI CALCULATOR LOGIC
   ========================================================================== */
function initRoiCalculator() {
  const slider = document.getElementById('hoursSlider');
  const hoursVal = document.getElementById('hoursVal');
  const resWeeklyHours = document.getElementById('resWeeklyHours');
  const resYearlyHours = document.getElementById('resYearlyHours');
  const resMoneySaved = document.getElementById('resMoneySaved');

  if (!slider || !hoursVal || !resWeeklyHours || !resYearlyHours || !resMoneySaved) return;

  function updateCalculations() {
    const h = parseInt(slider.value);
    hoursVal.innerText = `${h} ${h === 1 ? 'Ora/Giorno' : 'Ore/Giorno'}`;

    const weekly = h * 5;
    const yearly = weekly * 48; // 48 working weeks
    const money = yearly * 20; // 20€/hr avg cost estimate

    resWeeklyHours.innerText = `${weekly} Ore`;
    resYearlyHours.innerText = `${yearly} Ore`;
    resMoneySaved.innerText = `€ ${money.toLocaleString('it-IT')}`;
  }

  slider.oninput = () => {
    playPop();
    updateCalculations();
  };

  updateCalculations();
}

/* ==========================================================================
   PROJECT CONFIGURATOR LOGIC
   ========================================================================== */
function initProjectConfigurator() {
  const typePills = document.querySelectorAll('#configTypePills .config-pill');
  const urgencyPills = document.querySelectorAll('#configUrgencyPills .config-pill');
  const applyBtn = document.getElementById('applyConfigBtn');
  const messageInput = document.getElementById('message');

  let selectedType = 'Piattaforma Web Cloud (Base44 / Antigravity 2)';
  let selectedUrgency = 'Entro 2 settimane (Priorità Alta)';

  typePills.forEach(pill => {
    pill.onclick = () => {
      playPop();
      typePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedType = pill.getAttribute('data-type');
    };
  });

  urgencyPills.forEach(pill => {
    pill.onclick = () => {
      playPop();
      urgencyPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedUrgency = pill.getAttribute('data-urgency');
    };
  });

  if (applyBtn && messageInput) {
    applyBtn.onclick = () => {
      fireConfetti();
      messageInput.value = `Buongiorno Chiara,\n\nVorrei richiedere maggiori informazioni per un progetto di tipo: "${selectedType}".\nTempistica richiesta: ${selectedUrgency}.\n\nResto in attesa di un tuo riscontro!`;
      showToast('Richiesta configurata! Ti abbiamo indirizzato al form contatti 🚀');
      
      const contactSection = document.getElementById('contatti');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    };
  }
}

/* ==========================================================================
   FAQ ACCORDION LOGIC
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (btn) {
      btn.onclick = () => {
        playPop();
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      };
    }
  });
}

/* ==========================================================================
   SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(rev => observer.observe(rev));
}

/* ==========================================================================
   TOAST MESSAGES
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toastMsg');
  if (!toast) return;

  toast.innerText = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* ==========================================================================
   INTERACTIVE BADGES
   ========================================================================== */
function initInteractiveBadges() {
  const b1 = document.getElementById('badge1');
  const b2 = document.getElementById('badge2');

  if (b1) {
    b1.onclick = () => {
      playPop();
      showToast('⚡ "Sviluppo di Web App Cloud ad alte prestazioni con Base44 & Antigravity 2!"');
    };
  }

  if (b2) {
    b2.onclick = () => {
      playPop();
      showToast('💡 "MandaloVia: la documentazione di cantiere in sicurezza e zero stress!"');
    };
  }
}

/* ==========================================================================
   MINI QUIZ LOGIC
   ========================================================================== */
function initPlaygroundQuiz() {
  let userScore = 0;
  const step1 = document.getElementById('quizStep1');
  const step2 = document.getElementById('quizStep2');
  const result = document.getElementById('quizResult');

  if (!step1 || !step2 || !result) return;

  step1.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.onclick = () => {
      playPop();
      userScore += parseInt(btn.getAttribute('data-score') || '1');
      step1.style.display = 'none';
      step2.style.display = 'block';
    };
  });

  step2.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.onclick = () => {
      playPop();
      userScore += parseInt(btn.getAttribute('data-score') || '1');
      step2.style.display = 'none';
      renderQuizResult(userScore);
    };
  });
}

function renderQuizResult(score) {
  const result = document.getElementById('quizResult');
  if (!result) return;

  fireConfetti();

  let title = '';
  let desc = '';

  if (score <= 2) {
    title = '🧙‍♀️ Profilo: Ninja dell\'Automazione Digitale!';
    desc = 'Ami l\'efficienza pura! Proprio come Chiara, cerchi sempre la soluzione tecnologica più veloce ed elegante per azzerare le pratiche noiose.';
  } else if (score <= 4) {
    title = '📊 Profilo: Gestore Preciso & Ordinato!';
    desc = 'Ti piace l\'ordine e il controllo totale sui dati. Hai grandi potenzialità, ma puoi risparmiare il 60% del tempo con le automazioni ed i gestionali di Chiara!';
  } else {
    title = '🚀 Profilo: Hai Bisogno di Chiara Francescon ASAP!';
    desc = 'Mandi ancora troppe mail pesanti ed hai difficoltà a tracciare materiali e cantieri! È il momento perfetto per implementare MandaloVia e Gestione Magazzino!';
  }

  result.innerHTML = `
    <div class="quiz-result-card">
      <h3 style="color: var(--accent-primary); font-size: 1.4rem; margin-bottom: 0.6rem;">${title}</h3>
      <p style="color: var(--text-secondary); margin-bottom: 1.2rem; font-size: 0.95rem;">${desc}</p>
      <div style="display:flex; gap:0.6rem; justify-content:center; flex-wrap:wrap;">
        <a href="https://gestionemagazzino.base44.app/" target="_blank" class="btn btn-primary" style="font-size: 0.85rem;">Prova Gestione Magazzino 📦</a>
        <a href="https://mandalovia.vercel.app/" target="_blank" class="btn btn-primary" style="font-size: 0.85rem;">Prova MandaloVia Live 🚀</a>
      </div>
    </div>
  `;

  result.style.display = 'block';
}

/* ==========================================================================
   NAVBAR LOGIC
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  window.onscroll = () => {
    if (navbar) {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  };

  if (mobileToggle && navLinks) {
    mobileToggle.onclick = () => {
      navLinks.classList.toggle('active');
    };
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.onclick = () => {
      if (navLinks) navLinks.classList.remove('active');
    };
  });
}

/* ==========================================================================
   SKILLS RENDER
   ========================================================================== */
function renderSkills() {
  const skillsGrid = document.getElementById('skillsGrid');
  const pillsCloud = document.getElementById('pillsCloud');

  if (skillsGrid && personalSkills?.tecniche) {
    skillsGrid.innerHTML = personalSkills.tecniche.map(skill => `
      <div class="skill-item">
        <div class="skill-info">
          <span>${skill.icon} ${skill.name}</span>
          <span style="color: var(--accent-primary); font-weight: 700;">${skill.level}%</span>
        </div>
        <div class="skill-bar-bg">
          <div class="skill-bar-fill" style="width: ${skill.level}%;"></div>
        </div>
      </div>
    `).join('');
  }

  if (pillsCloud && personalSkills?.competenzeLavorative) {
    pillsCloud.innerHTML = personalSkills.competenzeLavorative.map(comp => `
      <div class="pill-item">✓ ${comp}</div>
    `).join('');
  }
}

/* ==========================================================================
   PROJECTS RENDER
   ========================================================================== */
function renderProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  if (!grid || !projects) return;

  grid.innerHTML = projects.map(proj => {
    const imageMap = {
      clickflow: '/clickflow.png',
      mandalovia: '/mandalovia.png',
      magazzino: '/magazzino.png',
      'excel-mail': '/email-marketing.png',
      eventi: '/eventi.png'
    };
    const hasImage = Boolean(imageMap[proj.image]);
    const imageSrc = imageMap[proj.image] || '';
    const hasLiveUrl = proj.liveUrl && proj.liveUrl !== '#';

    return `
      <div class="project-card" data-category="${proj.category}">
        <div class="project-thumbnail">
          ${hasImage ? `
            <img src="${imageSrc}" alt="${proj.title}" class="project-img">
          ` : `
            <div class="project-graphic-fallback">
              <span class="graphic-icon">
                ${proj.id === 'gestore-appuntamenti-whatsapp' ? '💬' : proj.id === 'excel-email-marketing' ? '📧' : proj.category === 'automations' ? '⚙️' : '⚡'}
              </span>
              <span class="graphic-label">${proj.categoryLabel}</span>
            </div>
          `}
          <span class="project-badge-top">${proj.badge}</span>
        </div>

        <div class="project-content">
          <span class="project-category-tag">${proj.categoryLabel}</span>
          <h3 class="project-title">${proj.title}</h3>
          <p class="project-desc">${proj.shortDesc}</p>

          <div class="project-tags">
            ${proj.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>

          <div class="project-footer" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
            <button class="btn-view-details" data-id="${proj.id}">
              Dettagli ➔
            </button>
            ${hasLiveUrl ? `
              <a href="${proj.liveUrl}" target="_blank" class="btn btn-primary" style="padding: 0.35rem 0.85rem; font-size: 0.8rem;">
                Apri Sito Live 🌐
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.btn-view-details').forEach(btn => {
    btn.onclick = (e) => {
      playPop();
      const projId = e.currentTarget.getAttribute('data-id');
      const project = projectsData.find(p => p.id === projId);
      if (project) openProjectModal(project);
    };
  });
}

/* ==========================================================================
   FILTERS LOGIC
   ========================================================================== */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.onclick = () => {
      playPop();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      if (filter === 'all') {
        renderProjects(projectsData);
      } else {
        const filtered = projectsData.filter(p => p.category === filter);
        renderProjects(filtered);
      }
    };
  });
}

/* ==========================================================================
   MODAL LOGIC
   ========================================================================== */
function initModal() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalClose');

  if (closeBtn && modal) {
    closeBtn.onclick = () => {
      playPop();
      modal.classList.remove('active');
    };

    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    };
  }
}

function openProjectModal(project) {
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  if (!modal || !modalBody || !project) return;

  const imageMap = {
    clickflow: '/clickflow.png',
    mandalovia: '/mandalovia.png',
    magazzino: '/magazzino.png',
    'excel-mail': '/email-marketing.png',
    eventi: '/eventi.png'
  };
  const hasImage = Boolean(imageMap[project.image]);
  const imageSrc = imageMap[project.image] || '';
  const hasLiveUrl = project.liveUrl && project.liveUrl !== '#';

  modalBody.innerHTML = `
    <span class="project-category-tag" style="font-size: 0.85rem;">${project.categoryLabel}</span>
    <h2 class="modal-title">${project.title}</h2>
    
    ${hasImage ? `
      <img src="${imageSrc}" alt="${project.title}" class="modal-preview-img">
    ` : `
      <div style="padding: 2.2rem; background: #f1f5f9; border-radius: var(--radius-md); text-align: center; margin: 1.2rem 0; border: 1px solid var(--border-color);">
        <span style="font-size: 3rem;">${project.id === 'gestore-appuntamenti-whatsapp' ? '💬' : project.id === 'excel-email-marketing' ? '📧' : '⚙️'}</span>
        <h4 style="margin-top: 0.4rem; color: var(--text-primary);">${project.title}</h4>
      </div>
    `}

    <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.6; margin-bottom: 1.2rem;">${project.fullDesc}</p>

    ${hasLiveUrl ? `
      <div style="margin-bottom: 1.5rem;">
        <a href="${project.liveUrl}" target="_blank" class="btn btn-primary" style="padding: 0.6rem 1.3rem; font-size: 0.9rem;">
          Apri ${project.title} Live 🌐 ➔
        </a>
      </div>
    ` : ''}

    <h4 style="margin-top: 1.5rem; margin-bottom: 0.6rem; font-size: 1.05rem; color: var(--accent-primary);">Punti di Forza:</h4>
    <ul class="modal-highlights-list">
      ${project.highlights.map(h => `<li>${h}</li>`).join('')}
    </ul>

    <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 1.2rem;">
      ${project.tags.map(t => `<span class="tech-tag" style="font-size: 0.8rem;">${t}</span>`).join('')}
    </div>
  `;

  modal.classList.add('active');
}

/* ==========================================================================
   CONTACT FORM LOGIC
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const copyBtn = document.getElementById('copyEmailBtn');

  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      fireConfetti();
      showToast('Messaggio inviato con successo! Chiara ti risponderà a breve 🚀');
      form.reset();
    };
  }

  if (copyBtn) {
    copyBtn.onclick = () => {
      playPop();
      try {
        navigator.clipboard.writeText('chiarafrancescon003@gmail.com');
      } catch (e) {}
      showToast('Email chiarafrancescon003@gmail.com copiata negli appunti! 📋');
    };
  }
}
