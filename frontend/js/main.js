/* ============================================================
   PORTFOLIO — Main JavaScript
   ============================================================ */

const API_BASE = '/api';

// ── DOM Ready ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollProgress();
  initHeroTyping();
  initFadeIn();
  initFilters();
  loadProjects();
  initContactForm();
  initBackToTop();
});

// ═══════════════════════════════════
// NAVBAR
// ═══════════════════════════════════
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Hamburger menu
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close on nav link click (mobile)
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      navLinks?.classList.remove('open');
    });
  });
}

// ═══════════════════════════════════
// SCROLL PROGRESS BAR
// ═══════════════════════════════════
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    bar.style.width = `${(window.scrollY / total) * 100}%`;
  }, { passive: true });
}

// ═══════════════════════════════════
// HERO — Typewriter effect for role
// ═══════════════════════════════════
function initHeroTyping() {
  const el = document.getElementById('hero-role');
  if (!el) return;

  const roles = [
    'Full Stack Developer',
    'UI/UX Enthusiast',
    'Open Source Contributor',
    'Problem Solver',
  ];
  let roleIdx = 0, charIdx = 0, isDeleting = false;

  function type() {
    const current = roles[roleIdx];
    el.textContent = isDeleting
      ? current.substring(0, charIdx--)
      : current.substring(0, charIdx++);

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIdx > current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 300;
    }
    setTimeout(type, delay);
  }
  setTimeout(type, 800);
}

// ═══════════════════════════════════
// FADE-IN ON SCROLL
// ═══════════════════════════════════
function initFadeIn() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ═══════════════════════════════════
// PROJECTS — Filters + API Load
// ═══════════════════════════════════
let allProjects = [];

function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.dataset.filter);
    });
  });
}

async function loadProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  try {
    const res = await fetch(`${API_BASE}/projects`);
    const json = await res.json();
    if (json.success) {
      allProjects = json.data;
      renderProjects('all');
    }
  } catch {
    // Fallback to demo projects if API unavailable
    allProjects = getDemoProjects();
    renderProjects('all');
  }
}

function renderProjects(filter = 'all') {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const filtered = filter === 'all'
    ? allProjects
    : allProjects.filter(p => p.category === filter);

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="projects-empty">
      <p style="color:var(--text3); font-size:13px;">No projects in this category yet.</p>
    </div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => createProjectCard(p)).join('');

  // Re-init fade-in for new cards
  grid.querySelectorAll('.fade-in').forEach(el => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
    }, { threshold: 0.1 });
    observer.observe(el);
  });
}

function createProjectCard(p) {
  const liveLink = p.liveUrl ? `
    <a href="${p.liveUrl}" target="_blank" rel="noopener" class="project-link">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/>
      </svg>Live
    </a>` : '';

  const githubLink = p.githubUrl ? `
    <a href="${p.githubUrl}" target="_blank" rel="noopener" class="project-link">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
      </svg>GitHub
    </a>` : '';

  const techPills = (p.techStack || []).map(t => `<span class="tech-pill">${t}</span>`).join('');
  const featuredBadge = p.featured ? `<span class="project-featured-badge">⭐ Featured</span>` : '';

  return `
    <article class="project-card fade-in">
      <div class="project-card-top">
        <span class="project-category-badge">${p.category || 'web'}</span>
        ${featuredBadge}
      </div>
      <div class="project-body">
        <h3 class="project-title">${escapeHtml(p.title)}</h3>
        <p class="project-desc">${escapeHtml(p.description)}</p>
        <div class="project-tech">${techPills}</div>
        <div class="project-links">${liveLink}${githubLink}</div>
      </div>
    </article>`;
}

// ═══════════════════════════════════
// CONTACT FORM
// ═══════════════════════════════════
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    const msgEl = document.getElementById('form-message');

    const data = {
      name: form.querySelector('[name=name]').value.trim(),
      email: form.querySelector('[name=email]').value.trim(),
      subject: form.querySelector('[name=subject]').value.trim(),
      message: form.querySelector('[name=message]').value.trim(),
    };

    // Client validation
    if (!data.name || !data.email || !data.subject || !data.message) {
      showFormMessage('Please fill in all fields.', 'error', msgEl);
      return;
    }

    btn.classList.add('loading');
    btn.disabled = true;
    msgEl.className = 'form-message';
    msgEl.textContent = '';

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();

      if (json.success) {
        showFormMessage('✓ Message sent! I\'ll get back to you soon.', 'success', msgEl);
        form.reset();
      } else {
        showFormMessage(json.message || 'Failed to send. Please try again.', 'error', msgEl);
      }
    } catch {
      showFormMessage('Network error. Please try again.', 'error', msgEl);
    } finally {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  });
}

function showFormMessage(text, type, el) {
  el.textContent = text;
  el.className = `form-message ${type}`;
}

// ═══════════════════════════════════
// BACK TO TOP
// ═══════════════════════════════════
function initBackToTop() {
  const btn = document.getElementById('back-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ═══════════════════════════════════
// UTILITIES
// ═══════════════════════════════════
function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(str).replace(/[&<>"']/g, m => map[m]);
}

// Demo projects for when backend is unavailable
function getDemoProjects() {
  return [
    { title: 'E-Commerce Platform', description: 'A full-featured online store with cart, payments, and admin dashboard.', techStack: ['React', 'Node.js', 'MongoDB', 'Stripe'], category: 'web', liveUrl: '#', githubUrl: '#', featured: true },
    { title: 'AI Chat Assistant', description: 'Conversational AI powered by LLMs with multi-turn context and memory.', techStack: ['Python', 'FastAPI', 'React', 'Claude API'], category: 'ai', liveUrl: '#', githubUrl: '#', featured: true },
    { title: 'Task Manager App', description: 'Productivity app with real-time collaboration and Kanban boards.', techStack: ['Vue.js', 'Express', 'Socket.io', 'PostgreSQL'], category: 'web', liveUrl: '#', githubUrl: '#', featured: false },
    { title: 'Weather Dashboard', description: 'Beautiful real-time weather dashboard with forecasts and charts.', techStack: ['React', 'Node.js', 'MongoDB', 'Chart.js'], category: 'web', liveUrl: '#', githubUrl: '#', featured: false },
    { title: 'REST API Boilerplate', description: 'Production-ready Node.js REST API with auth, docs, and CI/CD.', techStack: ['Node.js', 'Express', 'MongoDB', 'JWT'], category: 'backend', liveUrl: '', githubUrl: '#', featured: false },
    { title: 'Mobile Fitness Tracker', description: 'Cross-platform mobile app for tracking workouts and nutrition.', techStack: ['React Native', 'Expo', 'Firebase'], category: 'mobile', liveUrl: '', githubUrl: '#', featured: true },
  ];
}
