// SkillTrace AI — Main Application
// ─────────────────────────────────────────────────────────────────────────────
// Single-file SPA. No build tools required — runs directly in the browser.
// All navigation, quiz engine, mastery tracking, voice, and gamification logic.
// ─────────────────────────────────────────────────────────────────────────────
'use strict';

// ════════════════════════════════════════════════════════════════════════════
// 1. GLOBAL APP STATE
// ════════════════════════════════════════════════════════════════════════════
let STATE = SkillTraceStore.load();
// Check / reset daily goal
STATE = SkillTraceStore.checkDailyReset(STATE);
// Update streak for today's visit
STATE = SkillTraceStore.updateStreak(STATE);
SkillTraceStore.save(STATE);

// Current quiz session
let QUIZ = {
  questions:    [],
  current:      0,
  score:        0,
  hintsUsedTotal:  0,   // cumulative across session (for summary message)
  hintsThisQuestion: 0, // per-question (for mastery/XP accuracy)
  hintLevel:    0,
  answered:     false,
  topicId:      null,
  langId:       null,
  mode:         'learn'   // 'learn' | 'practice' | 'revision'
};

// Current topic being viewed
let CURRENT_TOPIC_ID   = null;
let CURRENT_LANG_ID    = null;
let LAST_QUIZ_ORIGIN   = 'learn'; // which page to return to after quiz

// ════════════════════════════════════════════════════════════════════════════
// 2. UTILITY HELPERS
// ════════════════════════════════════════════════════════════════════════════
function qs(sel, ctx = document)  { return ctx.querySelector(sel); }
function qsa(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }
function el(tag, cls = '', attrs = {}) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'html') e.innerHTML = v;
    else if (k === 'text') e.textContent = v;
    else e.setAttribute(k, v);
  }
  return e;
}

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function masteryColour(score) {
  if (score >= 80) return '#16a34a';
  if (score >= 50) return '#d97706';
  return '#dc2626';
}

function masteryClass(score) {
  if (score >= 80) return 'high';
  if (score >= 50) return 'mid';
  return 'low';
}

function difficultyTag(d) {
  const map = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
  return `<span class="topic-card-diff level-tag ${d}">${map[d] || d}</span>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ════════════════════════════════════════════════════════════════════════════
// 3. TOAST NOTIFICATIONS
// ════════════════════════════════════════════════════════════════════════════
function showToast(msg, type = 'info', duration = 3500) {
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const container = qs('#toast-container');
  const toast = el('div', `toast ${type}`);
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('out');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, duration);
}

// ════════════════════════════════════════════════════════════════════════════
// 4. CONFETTI
// ════════════════════════════════════════════════════════════════════════════
function launchConfetti(duration = 2500) {
  if (STATE.settings.reducedMotion) return;
  const canvas  = qs('#confetti-canvas');
  const ctx     = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const colours = ['#4f46e5','#7c3aed','#16a34a','#d97706','#e11d48','#0ea5e9'];
  const pieces  = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: -10,
    r: Math.random() * 6 + 4,
    c: colours[Math.floor(Math.random() * colours.length)],
    vx: (Math.random() - .5) * 4,
    vy: Math.random() * 4 + 2,
    a: Math.random() * Math.PI * 2
  }));

  const start = Date.now();
  function draw() {
    const elapsed = Date.now() - start;
    if (elapsed > duration) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of pieces) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.a);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r);
      ctx.restore();
      p.x  += p.vx;
      p.y  += p.vy;
      p.a  += 0.05;
      p.vy += 0.05;
      if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// ════════════════════════════════════════════════════════════════════════════
// 5. ACHIEVEMENT POPUP
// ════════════════════════════════════════════════════════════════════════════
let achQueue = [];

function showAchievementPopup(ach) {
  const popup = qs('#achievement-popup');
  qs('#ach-popup-icon').textContent = ach.icon;
  qs('#ach-popup-name').textContent = ach.title;
  qs('#ach-popup-desc').textContent = ach.desc;
  popup.classList.add('open');
  popup.setAttribute('aria-hidden', 'false');
  if (VoiceFeedback.isEnabled() && VoiceFeedback.isSupported()) {
    VoiceFeedback.speakText(`Achievement unlocked! ${ach.title}. ${ach.desc}`);
  }
  launchConfetti(3000);
}

qs('#ach-popup-close').addEventListener('click', () => {
  qs('#achievement-popup').classList.remove('open');
  qs('#achievement-popup').setAttribute('aria-hidden', 'true');
  VoiceFeedback.stop();
  if (achQueue.length > 0) {
    setTimeout(() => showAchievementPopup(achQueue.shift()), 400);
  }
});

function checkAndAward() {
  const { state: newState, newlyUnlocked } = SkillTraceStore.checkAchievements(STATE);
  if (newlyUnlocked.length > 0) {
    STATE = newState;
    SkillTraceStore.save(STATE);
    for (const ach of newlyUnlocked) achQueue.push(ach);
    if (!qs('#achievement-popup').classList.contains('open')) {
      showAchievementPopup(achQueue.shift());
    }
  }
}

// ════════════════════════════════════════════════════════════════════════════
// 6. NAVIGATION
// ════════════════════════════════════════════════════════════════════════════
function navigate(pageId) {
  // Hide all pages
  qsa('.page').forEach(p => p.classList.remove('active'));
  // Show target
  const target = qs(`#page-${pageId}`);
  if (target) {
    target.classList.add('active');
  }
  // Scroll to top reliably (scrollIntoView can jump on dynamic-height pages)
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Update nav active state
  qsa('.nav-link, .mobile-nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.nav === pageId);
    if (l.dataset.nav === pageId) l.setAttribute('aria-current', 'page');
    else l.removeAttribute('aria-current');
  });

  // Render page content
  // NOTE: 'topics', 'lesson', and 'quiz' are rendered by their own dedicated
  // functions (renderTopicsPage / openLesson / renderQuestion) which receive
  // parameters — they are NOT in this map.
  const renders = {
    home:         renderHome,
    explore:      renderExplore,
    learn:        renderLearn,
    practice:     renderPractice,
    revision:     renderRevision,
    progress:     renderProgress,
    achievements: renderAchievements,
    settings:     renderSettings
  };
  if (renders[pageId]) renders[pageId]();

  // Close mobile menu
  qs('#mobile-menu').classList.remove('open');
  qs('#hamburger').setAttribute('aria-expanded', 'false');
  qs('#mobile-menu').setAttribute('aria-hidden', 'true');

  // Update nav XP
  updateNavXP();
}

// Wire all data-nav links
document.addEventListener('click', e => {
  const link = e.target.closest('[data-nav]');
  if (!link) return;
  e.preventDefault();
  navigate(link.dataset.nav);
});

// Hamburger
qs('#hamburger').addEventListener('click', () => {
  const menu = qs('#mobile-menu');
  const open = menu.classList.toggle('open');
  qs('#hamburger').setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-hidden', String(!open));
});

function updateNavXP() {
  qs('#nav-xp').textContent = `⚡ ${STATE.xp} XP`;
}

// ════════════════════════════════════════════════════════════════════════════
// 7. HOME PAGE
// ════════════════════════════════════════════════════════════════════════════
function renderHome() {
  // Hero
  qs('#hero-name').textContent = STATE.profile.name;
  qs('#hero-xp').textContent   = STATE.xp;
  qs('#hero-streak').textContent = STATE.streak.count;
  qs('#hero-topics').textContent = STATE.completedTopics.length;
  qs('#hero-badges').textContent = STATE.achievements.length;

  // Daily goal
  const goal  = STATE.dailyGoal;
  const pct   = Math.min(100, (goal.completedToday / goal.target) * 100);
  qs('#daily-goal-text').textContent = `${goal.completedToday} / ${goal.target} activities`;
  qs('#daily-goal-bar').style.width  = `${pct}%`;
  qs('#daily-goal-bar-wrap').setAttribute('aria-valuenow', goal.completedToday);

  // Language chips
  const chips = qs('#home-lang-chips');
  chips.innerHTML = '';
  for (const lang of LANGUAGES) {
    const chip = el('button', 'lang-chip', { 'aria-label': lang.name });
    chip.dataset.langId = lang.id;
    chip.innerHTML = `<span class="lang-chip-icon">${lang.icon}</span>${lang.name}`;
    chip.addEventListener('click', () => {
      CURRENT_LANG_ID = lang.id;
      navigate('topics');
      renderTopicsPage(lang.id);
    });
    chips.appendChild(chip);
  }

  // Recommendation
  const recDiv = qs('#recommendation-card');
  const rec = SkillTraceStore.getNextRecommendation(STATE, TOPICS);
  if (rec) {
    recDiv.innerHTML = `
      <div class="rec-card">
        <div class="rec-topic-name">${rec.topic.icon} ${rec.topic.title}</div>
        <div class="rec-reason">${rec.reason}</div>
        <button class="btn-primary" id="rec-go-btn">Start Now →</button>
      </div>`;
    qs('#rec-go-btn').addEventListener('click', () => {
      openLesson(rec.topic.id);
    });
  } else {
    recDiv.innerHTML = '<div class="empty-state">No recommendation yet — start learning!</div>';
  }

  // Weak concepts
  const weakDiv = qs('#weak-concepts-list');
  const weak = SkillTraceStore.getWeakTopics(STATE, 5);
  if (weak.length > 0) {
    weakDiv.innerHTML = '';
    for (const id of weak) {
      const t = TOPICS.find(t => t.id === id);
      if (!t) continue;
      const score = SkillTraceStore.getMastery(STATE, id);
      const item = el('div', 'weak-item');
      item.innerHTML = `
        <span class="weak-name">${t.icon} ${t.title}</span>
        <span class="mastery-badge ${masteryClass(score)}">${score}%</span>`;
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => openLesson(id));
      weakDiv.appendChild(item);
    }
  } else {
    weakDiv.innerHTML = '<div class="empty-state">Complete a quiz to discover your weak areas.</div>';
  }

  // Recent activity
  const actDiv = qs('#recent-activity');
  const recent = [...STATE.quizAttempts, ...STATE.lessonViews]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 8);

  if (recent.length > 0) {
    actDiv.innerHTML = '';
    for (const act of recent) {
      const t = TOPICS.find(t => t.id === act.topicId);
      if (!t) continue;
      const item = el('div', 'activity-item');
      const isQuiz = 'correct' in act;
      item.innerHTML = `
        <span class="activity-icon">${isQuiz ? (act.correct ? '✅' : '❌') : '📖'}</span>
        <span class="activity-text">${isQuiz ? `Quiz: ${t.title}` : `Read: ${t.title}`}</span>
        <span class="activity-time">${timeAgo(act.timestamp)}</span>`;
      actDiv.appendChild(item);
    }
  } else {
    actDiv.innerHTML = '<div class="empty-state">No activity yet — start learning to see your history here.</div>';
  }
}

// ════════════════════════════════════════════════════════════════════════════
// 8. GLOBAL SEARCH
// ════════════════════════════════════════════════════════════════════════════
qs('#global-search').addEventListener('input', function () {
  const q   = this.value.trim().toLowerCase();
  const res = qs('#search-results');
  if (!q) { res.classList.remove('open'); res.innerHTML = ''; return; }

  const matches = TOPICS.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.langId.toLowerCase().includes(q)
  ).slice(0, 8);

  if (matches.length === 0) {
    res.innerHTML = '<div class="search-result-item" style="color:var(--text-3)">No results found.</div>';
  } else {
    res.innerHTML = '';
    for (const t of matches) {
      const lang = LANGUAGES.find(l => l.id === t.langId);
      const item = el('div', 'search-result-item', { role: 'option', tabindex: '0' });
      item.innerHTML = `
        <span style="font-size:1.3rem">${t.icon}</span>
        <div>
          <div style="font-weight:600;font-size:.9rem">${t.title}</div>
          <div class="search-result-lang">${lang ? lang.icon + ' ' + lang.name : ''} · ${t.difficulty}</div>
        </div>`;
      item.addEventListener('click', () => {
        qs('#global-search').value = '';
        res.classList.remove('open');
        openLesson(t.id);
      });
      item.addEventListener('keydown', e => { if (e.key === 'Enter') item.click(); });
      res.appendChild(item);
    }
  }
  res.classList.add('open');
});

document.addEventListener('click', e => {
  if (!e.target.closest('.search-box')) {
    qs('#search-results').classList.remove('open');
  }
});

// ════════════════════════════════════════════════════════════════════════════
// 9. EXPLORE PAGE
// ════════════════════════════════════════════════════════════════════════════
function renderExplore() {
  buildExploreGrid('all', '');
}

function buildExploreGrid(filter, search) {
  const grid = qs('#explore-lang-grid');
  grid.innerHTML = '';

  let langs = LANGUAGES;
  if (filter !== 'all') {
    langs = langs.filter(l => l.level.toLowerCase().includes(filter));
  }
  if (search) {
    langs = langs.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));
  }

  if (langs.length === 0) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1">No languages match your search.</div>';
    return;
  }

  for (const lang of langs) {
    const mastery = computeLangMastery(lang.id);
    const card = el('div', 'lang-card', { role: 'listitem', tabindex: '0', 'aria-label': lang.name });
    card.innerHTML = `
      <div class="lang-card-top">
        <div class="lang-card-icon" style="background:${lang.bgColor}">${lang.icon}</div>
        <div>
          <div class="lang-card-name">${lang.name}</div>
          <span class="lang-card-badge">${lang.badge}</span>
        </div>
      </div>
      <p class="lang-card-desc">${lang.description}</p>
      <div class="lang-card-footer">
        <span class="level-tag ${lang.level.toLowerCase().split('-')[0]}">${lang.level}</span>
        <span>${lang.topicCount} topics</span>
        ${mastery > 0 ? `<span style="color:${masteryColour(mastery)};font-weight:700">${mastery}% mastery</span>` : ''}
      </div>`;
    card.addEventListener('click',   () => { CURRENT_LANG_ID = lang.id; navigate('topics'); renderTopicsPage(lang.id); });
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') card.click(); });
    grid.appendChild(card);
  }
}

function computeLangMastery(langId) {
  const topics = TOPICS.filter(t => t.langId === langId);
  if (!topics.length) return 0;
  const scores = topics.map(t => SkillTraceStore.getMastery(STATE, t.id));
  const total  = scores.reduce((a, b) => a + b, 0);
  return Math.round(total / topics.length);
}

// Filter buttons
document.addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn[data-filter]');
  if (!btn || !btn.closest('#page-explore')) return;
  qsa('.filter-btn', qs('#page-explore')).forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  buildExploreGrid(btn.dataset.filter, qs('#explore-search').value);
});

qs('#explore-search').addEventListener('input', function () {
  const active = qs('.filter-btn.active', qs('#page-explore'));
  buildExploreGrid(active ? active.dataset.filter : 'all', this.value);
});

// ════════════════════════════════════════════════════════════════════════════
// 10. TOPICS PAGE
// ════════════════════════════════════════════════════════════════════════════
function renderTopicsPage(langId) {
  const lang   = LANGUAGES.find(l => l.id === langId);
  const topics = TOPICS.filter(t => t.langId === langId);

  qs('#topics-lang-hero').innerHTML = lang ? `${lang.icon} <span style="font-size:1rem;font-weight:800">${lang.name}</span>` : '';
  qs('#topics-page-title').textContent = lang ? `${lang.name} Topics` : 'Topics';
  qs('#lesson-back-btn').dataset.langId = langId;

  const grid = qs('#topic-grid');
  grid.innerHTML = '';

  if (topics.length === 0) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1">No topics available yet for this language.</div>';
    return;
  }

  for (const t of topics) {
    const mastery   = SkillTraceStore.getMastery(STATE, t.id);
    const completed = STATE.completedTopics.includes(t.id);
    const card = el('div', `topic-card ${completed ? 'completed' : ''}`, { role: 'listitem', tabindex: '0', 'aria-label': t.title });
    card.innerHTML = `
      ${completed ? '<span class="topic-completed-badge">✅</span>' : ''}
      <div class="topic-card-top">
        <span class="topic-card-icon">${t.icon}</span>
        ${difficultyTag(t.difficulty)}
      </div>
      <div class="topic-card-title">${t.title}</div>
      <div class="topic-card-meta">⏱️ ${t.estimatedMinutes} min · ⚡ ${t.xpReward} XP</div>
      <div class="topic-card-mastery">
        <div class="topic-card-mastery-fill" style="width:${mastery}%;background:${masteryColour(mastery)}"></div>
      </div>
      <div style="font-size:.75rem;color:var(--text-3)">Mastery: ${mastery}%</div>`;
    card.addEventListener('click',   () => openLesson(t.id));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') card.click(); });
    grid.appendChild(card);
  }
}

// Back from topics → explore (preserves which language was being viewed)
qs('#lesson-back-btn').addEventListener('click', () => {
  if (CURRENT_LANG_ID) {
    navigate('topics');
    renderTopicsPage(CURRENT_LANG_ID);
  } else {
    navigate('explore');
  }
});

// ════════════════════════════════════════════════════════════════════════════
// 11. LESSON PAGE
// ════════════════════════════════════════════════════════════════════════════
function openLesson(topicId) {
  CURRENT_TOPIC_ID = topicId;
  const topic  = TOPICS.find(t => t.id === topicId);
  const lesson = LESSONS[topicId];

  if (!topic) { showToast('Topic not found.', 'error'); return; }

  // Record view
  STATE.lessonViews.push({ topicId, timestamp: new Date().toISOString() });
  STATE = SkillTraceStore.updateStreak(STATE);
  SkillTraceStore.save(STATE);

  navigate('lesson');

  const content = qs('#lesson-content');
  const lang    = LANGUAGES.find(l => l.id === topic.langId);

  if (!lesson) {
    content.innerHTML = `
      <div class="lesson-header">
        <div class="lesson-label">${lang ? lang.name : topic.langId}</div>
        <h1 class="lesson-title">${topic.icon} ${topic.title}</h1>
        <div class="lesson-meta">
          <span>⏱️ ${topic.estimatedMinutes} min</span>
          <span>⚡ ${topic.xpReward} XP</span>
          <span>${topic.difficulty}</span>
        </div>
      </div>
      <div class="card" style="text-align:center;padding:3rem">
        <div style="font-size:3rem;margin-bottom:1rem">📝</div>
        <h3>Lesson content coming soon</h3>
        <p style="color:var(--text-2);margin-top:.5rem">Full lesson content for <strong>${topic.title}</strong> is being prepared.</p>
        <div style="margin-top:1.5rem;display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap">
          <button class="btn-primary" id="lesson-start-quiz">Take Quiz Now ➡</button>
          <button class="btn-secondary" id="lesson-back-explore">← Back</button>
        </div>
      </div>`;  } else {
    let sectionsHtml = '';
    for (const s of lesson.sections) {
      sectionsHtml += `
        <div class="lesson-section">
          <h3 class="lesson-section-heading">📌 ${s.heading}</h3>
          <p class="lesson-section-content">${escapeHtml(s.content)}</p>
          ${s.code ? buildCodeBlock(s.code, s.language) : ''}
          ${s.output ? `
            <div class="output-block">
              <div class="output-label">Output</div>
              ${escapeHtml(s.output)}
            </div>` : ''}
        </div>`;
    }

    const mistakesHtml = lesson.commonMistakes && lesson.commonMistakes.length > 0 ? `
      <div class="lesson-section">
        <h3 class="lesson-section-heading">⚠️ Common Mistakes</h3>
        <ul class="mistakes-list">
          ${lesson.commonMistakes.map(m => `<li>${escapeHtml(m)}</li>`).join('')}
        </ul>
      </div>` : '';

    const tryItHtml = lesson.tryIt ? `
      <div class="try-it-section">
        <div class="try-it-title">✏️ Try It Yourself</div>
        <div class="demo-editor-label">⚠️ Demo Mode — Code editor is for practice only. No code is executed on a server.</div>
        <p style="font-size:.9rem;color:var(--text-2);margin-bottom:.75rem">${escapeHtml(lesson.tryIt.prompt)}</p>
        <textarea class="try-it-code" id="try-it-editor" rows="8" aria-label="Code editor" spellcheck="false">${escapeHtml(lesson.tryIt.starterCode)}</textarea>
        <div style="display:flex;gap:.75rem;flex-wrap:wrap">
          <button class="btn-outline" id="show-hint-btn">💡 Show Hint</button>
          <button class="btn-outline" id="show-solution-btn">👁️ Show Solution</button>
        </div>
        <div id="try-it-hint" style="display:none;margin-top:.75rem" class="hint-section">
          <div class="hint-level-label">Hint</div>
          <div class="hint-text">${escapeHtml(lesson.tryIt.hint)}</div>
        </div>
        <div id="try-it-solution" style="display:none;margin-top:.75rem">
          ${buildCodeBlock(lesson.tryIt.solutionCode, topic.langId)}
        </div>
      </div>` : '';

    content.innerHTML = `
      <div class="lesson-header">
        ${lesson.label ? `<div class="lesson-label">⚠️ ${lesson.label}</div>` : ''}
        <h1 class="lesson-title">${topic.icon} ${lesson.title}</h1>
        <div class="lesson-meta">
          <span>⏱️ ${topic.estimatedMinutes} min</span>
          <span>⚡ ${topic.xpReward} XP</span>
          <span>${lang ? lang.name : ''}</span>
          <span>${topic.difficulty}</span>
        </div>
      </div>

      <div class="lesson-objectives">
        <h3>🎯 Learning Objectives</h3>
        <ul>${topic.objectives.map(o => `<li>${escapeHtml(o)}</li>`).join('')}</ul>
      </div>

      <div class="lesson-section">
        <h3 class="lesson-section-heading">📋 Overview</h3>
        <p class="lesson-section-content">${escapeHtml(lesson.overview)}</p>
      </div>

      ${sectionsHtml}
      ${mistakesHtml}
      ${tryItHtml}

      <div class="lesson-actions" id="lesson-actions">
        <button class="btn-primary" id="lesson-quiz-btn">📝 Take Quiz</button>
        <button class="btn-secondary" id="lesson-complete-btn">✅ Mark as Completed</button>
        <button class="btn-outline" id="lesson-back-btn2">← Back to Topics</button>
      </div>`;
  }

  // Highlight all code blocks
  setTimeout(() => {
    qsa('pre code', content).forEach(b => hljs.highlightElement(b));
  }, 50);

  // Bind buttons
  const quizBtn = qs('#lesson-quiz-btn') || qs('#lesson-start-quiz');
  if (quizBtn) {
    quizBtn.addEventListener('click', () => {
      LAST_QUIZ_ORIGIN = 'learn';
      startQuiz(topicId, 'learn');
    });
  }

  const completeBtn = qs('#lesson-complete-btn');
  if (completeBtn) {
    completeBtn.addEventListener('click', () => markTopicComplete(topicId));
  }

  const backBtn2 = qs('#lesson-back-btn2') || qs('#lesson-back-explore');
  if (backBtn2) {
    backBtn2.addEventListener('click', () => {
      navigate('topics');
      renderTopicsPage(topic.langId);
    });
  }

  const hintBtn = qs('#show-hint-btn');
  if (hintBtn) {
    hintBtn.addEventListener('click', () => {
      const h = qs('#try-it-hint');
      h.style.display = h.style.display === 'none' ? 'block' : 'none';
    });
  }

  const solBtn = qs('#show-solution-btn');
  if (solBtn) {
    solBtn.addEventListener('click', () => {
      const s = qs('#try-it-solution');
      s.style.display = s.style.display === 'none' ? 'block' : 'none';
      setTimeout(() => {
        qsa('pre code', qs('#try-it-solution')).forEach(b => hljs.highlightElement(b));
      }, 50);
    });
  }
}

function buildCodeBlock(code, lang) {
  const langLabel = (lang || 'code').toUpperCase();
  return `
    <div class="code-block-wrap">
      <div class="code-block-header">
        <span class="code-block-lang">${langLabel}</span>
        <button class="copy-btn" onclick="copyCode(this)" aria-label="Copy code">📋 Copy</button>
      </div>
      <pre><code class="language-${lang || 'plaintext'}">${escapeHtml(code)}</code></pre>
    </div>`;
}

function copyCode(btn) {
  const code = btn.closest('.code-block-wrap').querySelector('code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = '✅ Copied';
    setTimeout(() => btn.textContent = '📋 Copy', 2000);
  }).catch(() => showToast('Could not copy to clipboard.', 'warning'));
}
window.copyCode = copyCode;

function markTopicComplete(topicId) {
  const topic = TOPICS.find(t => t.id === topicId);
  if (!topic) return;

  if (!STATE.completedTopics.includes(topicId)) {
    STATE.completedTopics.push(topicId);
    STATE = SkillTraceStore.addXP(STATE, Math.round(topic.xpReward * 0.5));
    STATE.dailyGoal.completedToday = Math.min(STATE.dailyGoal.target, STATE.dailyGoal.completedToday + 1);
    SkillTraceStore.save(STATE);
    showToast(`Marked "${topic.title}" as completed! +${Math.round(topic.xpReward * 0.5)} XP`, 'success');
    updateNavXP();
    checkAndAward();
  } else {
    showToast('Already completed!', 'info');
  }
}

// ════════════════════════════════════════════════════════════════════════════
// 12. LEARN PAGE
// ════════════════════════════════════════════════════════════════════════════
let learnFilterLang = 'all';

function renderLearn() {
  const filter = qs('#learn-lang-filter');
  filter.innerHTML = '';

  // All button
  const allBtn = el('button', `lang-chip ${learnFilterLang === 'all' ? 'active' : ''}`);
  allBtn.textContent = '🌍 All';
  allBtn.addEventListener('click', () => { learnFilterLang = 'all'; renderLearn(); });
  filter.appendChild(allBtn);

  for (const lang of LANGUAGES) {
    const btn = el('button', `lang-chip ${learnFilterLang === lang.id ? 'active' : ''}`);
    btn.innerHTML = `${lang.icon} ${lang.name}`;
    btn.addEventListener('click', () => { learnFilterLang = lang.id; renderLearn(); });
    filter.appendChild(btn);
  }

  const list = qs('#learn-topic-list');
  list.innerHTML = '';
  const topics = learnFilterLang === 'all'
    ? TOPICS
    : TOPICS.filter(t => t.langId === learnFilterLang);

  if (topics.length === 0) {
    list.innerHTML = '<div class="empty-state">No topics for this language yet.</div>';
    return;
  }

  for (const t of topics) {
    const mastery   = SkillTraceStore.getMastery(STATE, t.id);
    const completed = STATE.completedTopics.includes(t.id);
    const lang      = LANGUAGES.find(l => l.id === t.langId);
    const item = el('div', 'topic-list-item', { tabindex: '0', 'aria-label': t.title });
    item.innerHTML = `
      <div class="tli-left">
        <span class="tli-icon">${t.icon}</span>
        <div>
          <div class="tli-title">${t.title}</div>
          <div class="tli-meta">${lang ? lang.icon + ' ' + lang.name : ''} · ⏱️ ${t.estimatedMinutes} min · ${t.difficulty}</div>
        </div>
      </div>
      <div class="tli-right">
        ${completed ? '<span style="color:var(--success);font-weight:700">✅</span>' : ''}
        ${mastery > 0 ? `<span class="mastery-badge ${masteryClass(mastery)}">${mastery}%</span>` : ''}
        <span class="btn-primary" style="padding:.35rem .8rem;font-size:.8rem">Study →</span>
      </div>`;
    item.addEventListener('click',   () => { LAST_QUIZ_ORIGIN = 'learn'; openLesson(t.id); });
    item.addEventListener('keydown', e => { if (e.key === 'Enter') item.click(); });
    list.appendChild(item);
  }
}

// ════════════════════════════════════════════════════════════════════════════
// 13. QUIZ ENGINE
// ════════════════════════════════════════════════════════════════════════════
function startQuiz(topicId, mode = 'practice', filterLang = null, filterDiff = null, filterType = null) {
  LAST_QUIZ_ORIGIN = mode;

  let pool = QUESTIONS;
  if (topicId) {
    pool = pool.filter(q => q.topicId === topicId);
  } else {
    if (filterLang && filterLang !== 'all') pool = pool.filter(q => q.langId === filterLang);
    if (filterDiff && filterDiff !== 'all') pool = pool.filter(q => q.difficulty === filterDiff);
    if (filterType && filterType !== 'all') pool = pool.filter(q => q.type === filterType);
  }

  if (pool.length === 0) {
    showToast('No questions available for this selection.', 'warning');
    return;
  }

  // Adaptive selection: prioritise weak topics
  const weak = SkillTraceStore.getWeakTopics(STATE, 5);
  pool = pool.sort((a, b) => {
    const aWeak = weak.includes(a.topicId) ? -1 : 0;
    const bWeak = weak.includes(b.topicId) ? -1 : 0;
    return aWeak - bWeak;
  });

  QUIZ = {
    questions: shuffle(pool).slice(0, Math.min(10, pool.length)),
    current:   0,
    score:     0,
    hintsUsedTotal:    0,
    hintsThisQuestion: 0,
    hintLevel: 0,
    answered:  false,
    topicId:   topicId || null,
    langId:    filterLang || (topicId ? (TOPICS.find(t => t.id === topicId) || {}).langId : null),
    mode
  };

  navigate('quiz');
  renderQuestion();
}

function renderQuestion() {
  // ── Reset per-question state FIRST so hintLevelsLeft() is correct ──────
  QUIZ.answered          = false;
  QUIZ.hintLevel         = 0;
  QUIZ.hintsThisQuestion = 0;

  const q   = QUIZ.questions[QUIZ.current];
  const num = QUIZ.current + 1;
  const tot = QUIZ.questions.length;
  const pct = Math.round((num - 1) / tot * 100);

  const topic = q ? TOPICS.find(t => t.id === q.topicId) : null;
  const content = qs('#quiz-content');

  content.innerHTML = `
    <div class="quiz-header">
      <div>
        <div class="quiz-progress-text">Question ${num} of ${tot}</div>
        <div class="quiz-score-text">Score: ${QUIZ.score} / ${QUIZ.current}</div>
      </div>
      <div style="display:flex;align-items:center;gap:.75rem">
        <button class="voice-toggle-quiz" id="quiz-voice-btn" aria-pressed="${VoiceFeedback.isEnabled()}" aria-label="Toggle voice feedback">
          ${VoiceFeedback.isEnabled() ? '🔊 Voice On' : '🔇 Voice Off'}
        </button>
        ${topic ? `<span style="font-size:.8rem;color:var(--text-3)">${topic.icon} ${topic.title}</span>` : ''}
      </div>
      <div class="quiz-progress-bar" style="width:100%">
        <div class="quiz-progress-bar-fill" style="width:${pct}%"></div>
      </div>
    </div>

    <div class="question-card" id="question-card">
      <div class="question-meta">
        <span class="question-badge ${q.type}">${labelType(q.type)}</span>
        <span class="question-badge">${q.difficulty}</span>
        ${topic ? `<span class="question-badge">${topic.icon} ${topic.title}</span>` : ''}
      </div>
      <p class="question-text">${escapeHtml(q.text)}</p>
      ${q.code ? `<div class="question-code"><pre><code class="language-${q.langId || 'plaintext'}">${escapeHtml(q.code)}</code></pre></div>` : ''}
      <div class="options-list" id="options-list" role="listbox" aria-label="Answer options">
        ${q.options.map(opt => `
          <button class="option-btn" data-opt="${opt.id}" role="option" aria-selected="false">
            <span class="option-letter">${opt.id.toUpperCase()}</span>
            <span>${escapeHtml(opt.text)}</span>
          </button>`).join('')}
      </div>
    </div>

    <div id="quiz-feedback-area"></div>

    <div class="quiz-actions" id="quiz-actions">
      <button class="btn-hint" id="hint-btn" aria-label="Get a hint">💡 Hint (${hintLevelsLeft()})</button>
      <div id="hint-display"></div>
    </div>`;

  // Highlight code
  setTimeout(() => {
    qsa('pre code', content).forEach(b => hljs.highlightElement(b));
  }, 50);

  // Wire options
  qsa('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!QUIZ.answered) selectAnswer(btn.dataset.opt);
    });
  });

  // Voice toggle in quiz
  qs('#quiz-voice-btn').addEventListener('click', () => {
    const newVal = !VoiceFeedback.isEnabled();
    VoiceFeedback.setEnabled(newVal);
    STATE.settings.voiceEnabled = newVal;
    SkillTraceStore.save(STATE);
    qs('#quiz-voice-btn').textContent = newVal ? '🔊 Voice On' : '🔇 Voice Off';
    qs('#quiz-voice-btn').setAttribute('aria-pressed', String(newVal));
    // Sync nav icon
    qs('#voice-toggle-nav').textContent = newVal ? '🔊' : '🔇';
  });

  // Hint button
  qs('#hint-btn').addEventListener('click', showHint);
}

function labelType(type) {
  const labels = { mcq: 'Multiple Choice', output: 'Output Prediction', bug: 'Find the Bug', fillin: 'Fill in the Blank' };
  return labels[type] || type;
}

function hintLevelsLeft() {
  const q = QUIZ.questions[QUIZ.current];
  if (!q) return '—';
  const hints     = HINTS[q.id] || [];
  const remaining = hints.length - QUIZ.hintLevel;
  return remaining > 0 ? remaining : '—';
}

function showHint() {
  const q     = QUIZ.questions[QUIZ.current];
  const hints = HINTS[q.id] || [];
  if (QUIZ.hintLevel >= hints.length) {
    showToast('No more hints available for this question.', 'info');
    qs('#hint-btn').disabled = true;
    return;
  }
  const hint = hints[QUIZ.hintLevel];
  QUIZ.hintsUsedTotal++;
  QUIZ.hintsThisQuestion++;
  QUIZ.hintLevel++;

  const display = qs('#hint-display');
  display.innerHTML = `
    <div class="hint-section" style="margin-top:.75rem">
      <div class="hint-level-label">💡 ${hint.type === 'nudge' ? 'Nudge' : hint.type === 'concept' ? 'Concept' : hint.type === 'pseudocode' ? 'Pseudocode' : 'Solution'} (Level ${hint.level})</div>
      <div class="hint-text">${escapeHtml(hint.text)}</div>
    </div>`;

  if (VoiceFeedback.isEnabled()) VoiceFeedback.speakHint();

  // Update remaining
  const remaining = hints.length - QUIZ.hintLevel;
  const hintBtn = qs('#hint-btn');
  if (hintBtn) hintBtn.textContent = remaining > 0 ? `💡 Hint (${remaining})` : '💡 No more hints';
  if (remaining === 0 && hintBtn) hintBtn.disabled = true;
}

function selectAnswer(selectedId) {
  if (QUIZ.answered) return;
  QUIZ.answered = true;

  const q       = QUIZ.questions[QUIZ.current];
  const correct = selectedId === q.correct;

  if (correct) QUIZ.score++;

  // Record attempt — store per-question hint count
  const attempt = {
    topicId:   q.topicId,
    questionId: q.id,
    type:      q.type,
    correct,
    hintsUsed: QUIZ.hintsThisQuestion,
    timestamp: new Date().toISOString()
  };
  STATE.quizAttempts.push(attempt);

  // Mastery update — use per-question hints for accuracy
  const masteryDelta = correct
    ? (QUIZ.hintsThisQuestion > 0 ? 5 : 10)
    : -8;
  STATE = SkillTraceStore.updateMastery(STATE, q.topicId, masteryDelta);

  // XP — use per-question hints
  if (correct && QUIZ.hintsThisQuestion === 0) STATE = SkillTraceStore.addXP(STATE, q.xp || 10);
  else if (correct)                            STATE = SkillTraceStore.addXP(STATE, Math.round((q.xp || 10) * 0.5));

  // Revision schedule
  STATE = SkillTraceStore.scheduleRevision(STATE, q.topicId, correct);

  SkillTraceStore.save(STATE);
  updateNavXP();
  checkAndAward();

  // Colour options
  qsa('.option-btn').forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.opt === q.correct)  btn.classList.add('correct');
    if (btn.dataset.opt === selectedId && !correct) btn.classList.add('incorrect');
  });

  // Show feedback
  let voiceMsg = '';
  if (correct) {
    voiceMsg = VoiceFeedback.speakCorrect();
  } else {
    voiceMsg = VoiceFeedback.speakIncorrect();
  }

  const feedbackArea = qs('#quiz-feedback-area');
  const xpAwarded = correct ? (QUIZ.hintsThisQuestion === 0 ? q.xp || 10 : Math.round((q.xp || 10) * 0.5)) : 0;
  feedbackArea.innerHTML = `
    <div class="quiz-feedback ${correct ? 'correct' : 'incorrect'}">
      <div class="feedback-header">
        <span class="feedback-icon">${correct ? '🎉' : '💙'}</span>
        <span>${correct ? 'Correct!' : 'Not quite right'}</span>
        ${correct ? `<span class="xp-award">+${xpAwarded} XP</span>` : ''}
      </div>
      <p class="feedback-explanation"><strong>Explanation:</strong> ${escapeHtml(q.explanation)}</p>
      ${!correct ? `<p class="feedback-explanation" style="margin-top:.4rem"><strong>Correct answer:</strong> ${escapeHtml(q.options.find(o => o.id === q.correct)?.text || '')}</p>` : ''}
      ${voiceMsg && VoiceFeedback.isEnabled() ? `<div class="feedback-voice-msg">🔊 "${escapeHtml(voiceMsg)}"</div>` : ''}
    </div>`;

  // Next / submit button
  const actions = qs('#quiz-actions');
  const nextBtn = el('button', 'btn-primary', { text: QUIZ.current < QUIZ.questions.length - 1 ? 'Next Question →' : 'See Results' });
  actions.appendChild(nextBtn);
  nextBtn.addEventListener('click', () => {
    if (QUIZ.current < QUIZ.questions.length - 1) {
      QUIZ.current++;
      renderQuestion(); // renderQuestion resets hintLevel, answered, hintsThisQuestion
    } else {
      showQuizSummary();
    }
  });
}

function showQuizSummary() {
  const total    = QUIZ.questions.length;
  const score    = QUIZ.score;
  const pct      = Math.round(score / total * 100);
  const topic    = QUIZ.topicId ? TOPICS.find(t => t.id === QUIZ.topicId) : null;
  const hintsMsg = QUIZ.hintsUsedTotal > 0
    ? `Used ${QUIZ.hintsUsedTotal} hint${QUIZ.hintsUsedTotal > 1 ? 's' : ''} across the quiz.`
    : 'No hints used — impressive!';

  let emoji = '🌟';
  let title = 'Great effort!';
  if (pct >= 90)      { emoji = '🏆'; title = 'Outstanding!'; }
  else if (pct >= 75) { emoji = '⭐'; title = 'Well done!'; }
  else if (pct >= 50) { emoji = '👍'; title = 'Good work!'; }
  else                { emoji = '💪'; title = 'Keep practising!'; }

  // XP earned this session — read from the attempts just pushed (last `total` entries)
  const sessionAttempts = STATE.quizAttempts.slice(-total);
  const xpInSession = QUIZ.questions.reduce((acc, q, i) => {
    const att = sessionAttempts[i];
    if (!att || !att.correct) return acc;
    return acc + (att.hintsUsed > 0 ? Math.round((q.xp || 10) * 0.5) : (q.xp || 10));
  }, 0);

  if (pct >= 75 && !STATE.settings.reducedMotion) launchConfetti(4000);

  const masteryNow = QUIZ.topicId ? SkillTraceStore.getMastery(STATE, QUIZ.topicId) : 0;

  let recommendation = '';
  if (pct < 60 && topic) {
    recommendation = `<div style="background:var(--warning-light);border:1px solid #fcd34d;border-radius:var(--r-lg);padding:1rem;margin-bottom:1.5rem;font-size:.9rem">
      📚 <strong>Recommendation:</strong> Your results suggest ${topic.title} needs more practice. Try the lesson again or use Revision mode.
    </div>`;
  } else if (pct >= 90 && topic) {
    recommendation = `<div style="background:var(--success-light);border:1px solid var(--success);border-radius:var(--r-lg);padding:1rem;margin-bottom:1.5rem;font-size:.9rem">
      🎯 <strong>Excellent mastery!</strong> You can move on to the next topic or try harder questions.
    </div>`;
  }

  const content = qs('#quiz-content');
  content.innerHTML = `
    <div class="quiz-summary">
      <div class="quiz-summary-icon">${emoji}</div>
      <h2 class="quiz-summary-title">${title}</h2>
      <p class="quiz-summary-subtitle">You completed ${total} question${total > 1 ? 's' : ''}. ${hintsMsg}</p>
      <div class="quiz-summary-stats">
        <div class="summary-stat">
          <div class="summary-stat-value">${score}/${total}</div>
          <div class="summary-stat-label">Score</div>
        </div>
        <div class="summary-stat">
          <div class="summary-stat-value">${pct}%</div>
          <div class="summary-stat-label">Accuracy</div>
        </div>
        <div class="summary-stat">
          <div class="summary-stat-value">+${xpInSession}</div>
          <div class="summary-stat-label">XP Earned</div>
        </div>
        ${topic ? `
        <div class="summary-stat">
          <div class="summary-stat-value" style="color:${masteryColour(masteryNow)}">${masteryNow}%</div>
          <div class="summary-stat-label">Topic Mastery</div>
        </div>` : ''}
      </div>
      ${recommendation}
      <div class="quiz-summary-actions">
        <button class="btn-primary" id="quiz-retake">🔄 Retake Quiz</button>
        ${topic ? `<button class="btn-secondary" id="quiz-lesson">📖 Review Lesson</button>` : ''}
        <button class="btn-outline" id="quiz-home">🏠 Home</button>
      </div>
    </div>`;

  qs('#quiz-retake').addEventListener('click', () => {
    if (QUIZ.topicId) startQuiz(QUIZ.topicId, QUIZ.mode);
    else              startQuiz(null, QUIZ.mode);
  });

  const lessonBtn = qs('#quiz-lesson');
  if (lessonBtn && QUIZ.topicId) {
    lessonBtn.addEventListener('click', () => openLesson(QUIZ.topicId));
  }

  qs('#quiz-home').addEventListener('click', () => navigate('home'));

  if (VoiceFeedback.isEnabled()) {
    VoiceFeedback.speakText(`Quiz complete! You scored ${score} out of ${total}, which is ${pct} percent.`);
  }

  // Mark daily goal progress
  STATE.dailyGoal.completedToday = Math.min(
    STATE.dailyGoal.target,
    STATE.dailyGoal.completedToday + 1
  );
  SkillTraceStore.save(STATE);
}

// Quiz back button
qs('#quiz-back-btn').addEventListener('click', () => navigate(LAST_QUIZ_ORIGIN || 'home'));

// ════════════════════════════════════════════════════════════════════════════
// 14. PRACTICE PAGE
// ════════════════════════════════════════════════════════════════════════════
function renderPractice() {
  // Language select
  const langSel = qs('#practice-lang-select');
  langSel.innerHTML = '<option value="all">All Languages</option>';
  LANGUAGES.forEach(l => {
    const opt = el('option', '', { value: l.id, text: `${l.icon} ${l.name}` });
    langSel.appendChild(opt);
  });

  // Daily challenge
  const dcContent = qs('#daily-challenge-content');
  const randQ = QUESTIONS[Math.floor(Date.now() / 86400000) % QUESTIONS.length];
  const randTopic = TOPICS.find(t => t.id === randQ.topicId);
  dcContent.innerHTML = `
    <p style="color:var(--text-2);font-size:.9rem;margin-bottom:1rem">
      Today's challenge: <strong>${randQ.text.substring(0, 80)}…</strong>
    </p>
    <div style="display:flex;gap:.75rem;flex-wrap:wrap">
      <button class="btn-primary" id="daily-challenge-btn">Start Daily Challenge</button>
      <span style="font-size:.8rem;color:var(--text-3);align-self:center">${randTopic ? randTopic.icon + ' ' + randTopic.title : ''}</span>
    </div>`;
  qs('#daily-challenge-btn').addEventListener('click', () => {
    LAST_QUIZ_ORIGIN = 'practice';
    startQuiz(randQ.topicId, 'practice');
  });

  // Practice topic grid
  const grid = qs('#practice-topic-grid');
  grid.innerHTML = '';
  for (const t of TOPICS) {
    const qCount = QUESTIONS.filter(q => q.topicId === t.id).length;
    if (qCount === 0) continue;
    const mastery = SkillTraceStore.getMastery(STATE, t.id);
    const lang    = LANGUAGES.find(l => l.id === t.langId);
    const card = el('div', 'topic-card', { tabindex: '0', 'aria-label': t.title });
    card.innerHTML = `
      <div class="topic-card-top">
        <span class="topic-card-icon">${t.icon}</span>
        ${difficultyTag(t.difficulty)}
      </div>
      <div class="topic-card-title">${t.title}</div>
      <div class="topic-card-meta">${lang ? lang.icon + ' ' + lang.name : ''} · ${qCount} questions</div>
      <div class="topic-card-mastery">
        <div class="topic-card-mastery-fill" style="width:${mastery}%;background:${masteryColour(mastery)}"></div>
      </div>`;
    card.addEventListener('click', () => { LAST_QUIZ_ORIGIN = 'practice'; startQuiz(t.id, 'practice'); });
    card.addEventListener('keydown', e => { if (e.key === 'Enter') card.click(); });
    grid.appendChild(card);
  }

  // Start practice session with filters
  qs('#start-practice-btn').onclick = () => {
    LAST_QUIZ_ORIGIN = 'practice';
    startQuiz(
      null, 'practice',
      qs('#practice-lang-select').value,
      qs('#practice-diff-select').value,
      qs('#practice-type-select').value
    );
  };
}

// ════════════════════════════════════════════════════════════════════════════
// 15. REVISION PAGE
// ════════════════════════════════════════════════════════════════════════════
function renderRevision() {
  // Due for review
  const dueDiv = qs('#revision-due-list');
  const now = Date.now();
  const due = Object.entries(STATE.revisionSchedule)
    .filter(([, v]) => v.nextDate && new Date(v.nextDate).getTime() <= now)
    .map(([id]) => id);

  if (due.length > 0) {
    dueDiv.innerHTML = '';
    for (const id of due.slice(0, 6)) {
      const t = TOPICS.find(t => t.id === id);
      if (!t) continue;
      const item = el('div', 'revision-item');
      item.innerHTML = `
        <div>
          <div class="revision-item-text">${t.icon} ${t.title}</div>
          <div class="revision-item-meta">Due for review</div>
        </div>
        <button class="btn-primary" style="padding:.35rem .8rem;font-size:.8rem">Revise →</button>`;
      item.querySelector('button').addEventListener('click', () => { LAST_QUIZ_ORIGIN = 'revision'; startQuiz(id, 'revision'); });
      dueDiv.appendChild(item);
    }
  } else {
    dueDiv.innerHTML = '<div class="empty-state">All caught up! No topics due for review right now.</div>';
  }

  // Review mistakes
  const mistakesDiv = qs('#revision-mistakes-list');
  const mistakes = [...new Set(
    STATE.quizAttempts
      .filter(a => !a.correct)
      .map(a => a.topicId)
  )].slice(0, 6);

  if (mistakes.length > 0) {
    mistakesDiv.innerHTML = '';
    for (const id of mistakes) {
      const t = TOPICS.find(t => t.id === id);
      if (!t) continue;
      const wrongCount = STATE.quizAttempts.filter(a => a.topicId === id && !a.correct).length;
      const item = el('div', 'revision-item');
      item.innerHTML = `
        <div>
          <div class="revision-item-text">${t.icon} ${t.title}</div>
          <div class="revision-item-meta">${wrongCount} incorrect answer${wrongCount > 1 ? 's' : ''}</div>
        </div>
        <button class="btn-secondary" style="padding:.35rem .8rem;font-size:.8rem">Practise →</button>`;
      item.querySelector('button').addEventListener('click', () => { LAST_QUIZ_ORIGIN = 'revision'; startQuiz(id, 'revision'); });
      mistakesDiv.appendChild(item);
    }
  } else {
    mistakesDiv.innerHTML = '<div class="empty-state">No mistakes recorded yet — great work!</div>';
  }

  // Weak concepts
  const weakDiv = qs('#revision-weak-list');
  const weak    = SkillTraceStore.getWeakTopics(STATE, 6);
  if (weak.length > 0) {
    weakDiv.innerHTML = '';
    for (const id of weak) {
      const t     = TOPICS.find(t => t.id === id);
      const score = SkillTraceStore.getMastery(STATE, id);
      if (!t) continue;
      const item = el('div', 'revision-item');
      item.innerHTML = `
        <div>
          <div class="revision-item-text">${t.icon} ${t.title}</div>
          <div class="revision-item-meta">Mastery: ${score}%</div>
        </div>
        <button class="btn-outline" style="padding:.35rem .8rem;font-size:.8rem">Improve →</button>`;
      item.querySelector('button').addEventListener('click', () => openLesson(id));
      weakDiv.appendChild(item);
    }
  } else {
    weakDiv.innerHTML = '<div class="empty-state">No weak concepts yet. Keep learning!</div>';
  }
}

// ════════════════════════════════════════════════════════════════════════════
// 16. PROGRESS PAGE
// ════════════════════════════════════════════════════════════════════════════
function renderProgress() {
  // Summary stats
  const attempts = STATE.quizAttempts;
  const correct  = attempts.filter(a => a.correct).length;
  const accuracy = attempts.length ? Math.round(correct / attempts.length * 100) : 0;

  qs('#prog-xp').textContent       = STATE.xp;
  qs('#prog-streak').textContent   = STATE.streak.count;
  qs('#prog-topics').textContent   = STATE.completedTopics.length;
  qs('#prog-questions').textContent= attempts.length;
  qs('#prog-correct').textContent  = `${accuracy}%`;
  qs('#prog-badges').textContent   = STATE.achievements.length;

  // Mastery bars
  const barsDiv = qs('#mastery-bars');
  barsDiv.innerHTML = '';
  const scored = Object.entries(STATE.masteryScores)
    .sort(([, a], [, b]) => b - a);

  if (scored.length === 0) {
    barsDiv.innerHTML = '<div class="empty-state">No mastery data yet. Complete quizzes to track progress.</div>';
  } else {
    for (const [id, score] of scored) {
      const t = TOPICS.find(t => t.id === id);
      if (!t) continue;
      const row = el('div', 'mastery-bar-row');
      row.innerHTML = `
        <div class="mastery-bar-label">${t.icon} ${t.title}</div>
        <div class="mastery-bar-track">
          <div class="mastery-bar-fill" style="width:${score}%;background:${masteryColour(score)}"></div>
        </div>
        <div class="mastery-bar-value" style="color:${masteryColour(score)}">${score}%</div>`;
      barsDiv.appendChild(row);
    }
  }

  // Concept map
  renderConceptMap('python');

  const cmFilter = qs('#concept-map-lang-filter');
  cmFilter.innerHTML = '';
  for (const lang of LANGUAGES) {
    const topics = TOPICS.filter(t => t.langId === lang.id);
    if (topics.length === 0) continue;
    const btn = el('button', 'lang-chip');
    btn.innerHTML = `${lang.icon} ${lang.name}`;
    btn.addEventListener('click', () => {
      qsa('.lang-chip', cmFilter).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderConceptMap(lang.id);
    });
    cmFilter.appendChild(btn);
  }
  // Activate first
  const firstChip = qs('.lang-chip', cmFilter);
  if (firstChip) firstChip.classList.add('active');

  // Quiz history
  const histDiv = qs('#quiz-history-list');
  const recent = [...STATE.quizAttempts].reverse().slice(0, 20);
  if (recent.length > 0) {
    histDiv.innerHTML = '';
    for (const att of recent) {
      const t = TOPICS.find(t => t.id === att.topicId);
      const item = el('div', 'quiz-history-item');
      item.innerHTML = `
        <span class="qh-result">${att.correct ? '✅' : '❌'}</span>
        <div class="qh-text">
          <div class="qh-topic">${t ? t.icon + ' ' + t.title : att.topicId}</div>
          <div style="font-size:.75rem;color:var(--text-3)">${att.type} · ${att.hintsUsed > 0 ? att.hintsUsed + ' hint(s) used' : 'No hints'}</div>
        </div>
        <span class="qh-time">${timeAgo(att.timestamp)}</span>`;
      histDiv.appendChild(item);
    }
  } else {
    histDiv.innerHTML = '<div class="empty-state">No quiz history yet.</div>';
  }
}

function renderConceptMap(langId) {
  const container = qs('#concept-map-container');
  const topics = TOPICS.filter(t => t.langId === langId);
  if (topics.length === 0) {
    container.innerHTML = '<div class="empty-state">No topics for this language.</div>';
    return;
  }

  const map = el('div', 'concept-map');
  for (const t of topics) {
    const mastery = SkillTraceStore.getMastery(STATE, t.id);
    let statusClass = 'not-started';
    if (mastery >= 80)       statusClass = 'mastered';
    else if (mastery >= 40)  statusClass = 'practicing';
    else if (mastery > 0)    statusClass = 'learning';

    const statusLabel = {
      'not-started': 'Not started',
      'learning':    'Learning',
      'practicing':  'Practising',
      'mastered':    'Mastered'
    }[statusClass];

    const node = el('div', `concept-node ${statusClass}`, { tabindex: '0', 'aria-label': `${t.title}: ${statusLabel}` });
    node.innerHTML = `
      <div class="concept-node-circle" title="${statusLabel}">${t.icon}</div>
      <div class="concept-node-label">${t.title}</div>
      <div style="font-size:.65rem;color:var(--text-3)">${mastery > 0 ? mastery + '%' : statusLabel}</div>`;
    node.addEventListener('click', () => openLesson(t.id));
    node.addEventListener('keydown', e => { if (e.key === 'Enter') node.click(); });
    map.appendChild(node);
  }
  container.innerHTML = '';
  container.appendChild(map);

  // Legend
  const legend = el('div', '', { html: `
    <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1rem;font-size:.78rem">
      <span style="color:var(--text-3)">⬜ Not started</span>
      <span style="color:var(--warning)">🟡 Learning</span>
      <span style="color:var(--accent)">🟣 Practising</span>
      <span style="color:var(--success)">🟢 Mastered</span>
    </div>` });
  container.appendChild(legend);
}

// ════════════════════════════════════════════════════════════════════════════
// 17. ACHIEVEMENTS PAGE
// ════════════════════════════════════════════════════════════════════════════
function renderAchievements() {
  const grid = qs('#achievements-grid');
  grid.innerHTML = '';
  for (const def of SkillTraceStore.ACHIEVEMENT_DEFS) {
    const unlocked = STATE.achievements.includes(def.id);
    const card = el('div', `achievement-card ${unlocked ? 'unlocked' : 'locked'}`, { role: 'listitem', 'aria-label': `${def.title}: ${unlocked ? 'Unlocked' : 'Locked'}` });
    card.innerHTML = `
      <div class="achievement-icon">${def.icon}</div>
      <div class="achievement-name">${def.title}</div>
      <div class="achievement-desc">${def.desc}</div>
      ${!unlocked ? '<div class="achievement-locked-label">🔒 Not yet unlocked</div>' : ''}`;
    grid.appendChild(card);
  }
}

// ════════════════════════════════════════════════════════════════════════════
// 18. SETTINGS PAGE
// ════════════════════════════════════════════════════════════════════════════
function renderSettings() {
  qs('#setting-name').value = STATE.profile.name;

  // Avatar picker
  const avatarPicker = qs('#avatar-picker');
  const avatars = ['🎓', '🧑‍💻', '👩‍💻', '🧑‍🎓', '👨‍💻', '🦊', '🐼', '🐸', '🚀', '⭐'];
  avatarPicker.innerHTML = '';
  for (const a of avatars) {
    const opt = el('span', `avatar-option ${a === STATE.profile.avatar ? 'selected' : ''}`, { 'aria-label': a, role: 'option', tabindex: '0' });
    opt.textContent = a;
    opt.addEventListener('click', () => {
      qsa('.avatar-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      STATE.profile.avatar = a;
      SkillTraceStore.save(STATE);
    });
    opt.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') opt.click(); });
    avatarPicker.appendChild(opt);
  }

  // Toggles
  qs('#voice-toggle').checked       = STATE.settings.voiceEnabled;
  qs('#dark-mode-toggle').checked   = STATE.settings.darkMode;
  qs('#reduced-motion-toggle').checked = STATE.settings.reducedMotion;
  qs('#voice-rate').value           = STATE.settings.voiceRate;
  qs('#voice-rate-label').textContent = `${STATE.settings.voiceRate}×`;
  qs('#daily-goal-setting').value   = String(STATE.dailyGoal.target);

  qs('#voice-toggle').onchange = e => {
    STATE.settings.voiceEnabled = e.target.checked;
    VoiceFeedback.setEnabled(e.target.checked);
    qs('#voice-toggle-nav').textContent = e.target.checked ? '🔊' : '🔇';
    SkillTraceStore.save(STATE);
  };
  qs('#dark-mode-toggle').onchange = e => {
    STATE.settings.darkMode = e.target.checked;
    document.body.classList.toggle('dark-mode', e.target.checked);
    qs('#theme-toggle').textContent = e.target.checked ? '☀️' : '🌙';
    SkillTraceStore.save(STATE);
  };
  qs('#reduced-motion-toggle').onchange = e => {
    STATE.settings.reducedMotion = e.target.checked;
    document.body.classList.toggle('reduced-motion', e.target.checked);
    SkillTraceStore.save(STATE);
  };
  qs('#voice-rate').oninput = e => {
    STATE.settings.voiceRate = parseFloat(e.target.value);
    qs('#voice-rate-label').textContent = `${STATE.settings.voiceRate}×`;
    SkillTraceStore.save(STATE);
  };

  qs('#save-profile-btn').onclick = () => {
    const name = qs('#setting-name').value.trim();
    if (!name) { showToast('Please enter a name.', 'warning'); return; }
    STATE.profile.name = name;
    SkillTraceStore.save(STATE);
    showToast('Profile saved!', 'success');
    qs('#hero-name').textContent = name;
  };

  qs('#save-goal-btn').onclick = () => {
    STATE.dailyGoal.target = parseInt(qs('#daily-goal-setting').value, 10);
    SkillTraceStore.save(STATE);
    showToast('Daily goal updated!', 'success');
  };

  qs('#reset-data-btn').onclick = () => {
    if (confirm('Reset all learning progress? This cannot be undone.')) {
      localStorage.removeItem('skilltrace_v1');
      location.reload();
    }
  };
}

// ════════════════════════════════════════════════════════════════════════════
// 19. THEME TOGGLE
// ════════════════════════════════════════════════════════════════════════════
qs('#theme-toggle').addEventListener('click', () => {
  STATE.settings.darkMode = !STATE.settings.darkMode;
  document.body.classList.toggle('dark-mode', STATE.settings.darkMode);
  qs('#theme-toggle').textContent = STATE.settings.darkMode ? '☀️' : '🌙';
  SkillTraceStore.save(STATE);
});

qs('#voice-toggle-nav').addEventListener('click', () => {
  const newVal = !VoiceFeedback.isEnabled();
  VoiceFeedback.setEnabled(newVal);
  STATE.settings.voiceEnabled = newVal;
  qs('#voice-toggle-nav').textContent = newVal ? '🔊' : '🔇';
  SkillTraceStore.save(STATE);
  showToast(newVal ? 'Voice feedback enabled' : 'Voice feedback disabled', 'info');
});

// ════════════════════════════════════════════════════════════════════════════
// 20. INITIALISE
// ════════════════════════════════════════════════════════════════════════════
function init() {
  // Apply saved settings
  if (STATE.settings.darkMode) {
    document.body.classList.add('dark-mode');
    qs('#theme-toggle').textContent = '☀️';
  }
  if (STATE.settings.reducedMotion) {
    document.body.classList.add('reduced-motion');
  }
  VoiceFeedback.setEnabled(STATE.settings.voiceEnabled);
  qs('#voice-toggle-nav').textContent = STATE.settings.voiceEnabled ? '🔊' : '🔇';

  // Demo notice dismiss
  const demoNotice = qs('#demo-notice');
  const demoClose  = qs('#demo-notice-close');
  if (demoClose && demoNotice) {
    // Don't show again if dismissed this session
    if (sessionStorage.getItem('demo_dismissed') === '1') {
      demoNotice.classList.add('hidden');
    }
    demoClose.addEventListener('click', () => {
      demoNotice.classList.add('hidden');
      sessionStorage.setItem('demo_dismissed', '1');
    });
  }

  // Initial page
  navigate('home');

  // Save state on any page visibility change (tab close, etc.)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) SkillTraceStore.save(STATE);
  });

  console.log('✅ SkillTrace AI ready. Version 1.0.0');
  console.log('📦 Data stored in localStorage key: skilltrace_v1');
  console.log('⚠️  Code execution: Demo mode only — no external sandbox configured.');
}

init();
