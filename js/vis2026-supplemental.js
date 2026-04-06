(function () {
  'use strict';

  var STORAGE_KEY = 'earthvue-vis2026-theme';

  function getPreferredTheme() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  function initTheme() {
    applyTheme(getPreferredTheme());
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
      });
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem(STORAGE_KEY)) applyTheme(e.matches ? 'dark' : 'light');
    });
  }

  var PIPELINE = {
    1: {
      title: 'Query',
      body:
        'The analyst expresses an intent in natural language. EarthVue treats this as the root of a traceable workflow rather than a one-off prompt.',
      bullets: ['Grounded in user goals and session context', 'Linked downstream to evidence and artifacts'],
    },
    2: {
      title: 'Evidence retrieval',
      body:
        'Retrieval-grounded models pull relevant dataset metadata, passages, and context so users can see what informed downstream reasoning.',
      bullets: ['Transparent provenance for retrieved material', 'Supports inspection before code generation'],
    },
    3: {
      title: 'Code generation',
      body:
        'The system can produce executable analysis code. Users can review generated code before it runs in the sandboxed executor.',
      bullets: ['Review step before execution', 'Tied to provenance nodes for reproducibility'],
    },
    4: {
      title: 'Execution',
      body:
        'Sandboxed execution runs analysis and captures outputs, errors, and plots as first-class artifacts in the provenance graph.',
      bullets: ['Isolated execution environment', 'Outputs linked back to queries and evidence'],
    },
    5: {
      title: 'Evaluation',
      body:
        'Reasoning traces, uncertainty cues, bias indicators, and qualitative checks help users assess reliability of AI-assisted results.',
      bullets: ['Coordinated with reasoning and provenance views', 'Benchmarked on climate analytics tasks'],
    },
  };

  function setPipelineDetail(step) {
    var data = PIPELINE[step];
    if (!data) return;
    var root = document.getElementById('pipeline-detail');
    if (!root) return;
    var bullets = data.bullets
      .map(function (b) {
        return '<li>' + escapeHtml(b) + '</li>';
      })
      .join('');
    root.innerHTML =
      '<h3>' +
      escapeHtml(data.title) +
      '</h3><p>' +
      escapeHtml(data.body) +
      '</p><ul>' +
      bullets +
      '</ul>';
  }

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function initPipeline() {
    var buttons = document.querySelectorAll('.pipeline-step');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var step = parseInt(btn.getAttribute('data-step'), 10);
        buttons.forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        setPipelineDetail(step);
      });
    });
    var first = document.querySelector('.pipeline-step[data-step="1"]');
    if (first) setPipelineDetail(1);
  }

  function initScrollNav() {
    var links = document.querySelectorAll('.nav-links a[href^="#"]');
    var sections = document.querySelectorAll('section[id]');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        window.setTimeout(updateCurrentNav, 0);
      });
    });
    function updateCurrentNav() {
      var scrollPos = window.scrollY + 120;
      sections.forEach(function (sec) {
        var top = sec.offsetTop;
        var bottom = top + sec.offsetHeight;
        var id = sec.getAttribute('id');
        if (!id) return;
        if (scrollPos >= top && scrollPos < bottom) {
          links.forEach(function (a) {
            a.setAttribute('aria-current', a.getAttribute('href') === '#' + id ? 'true' : 'false');
          });
        }
      });
    }
    window.addEventListener('scroll', function () {
      updateCurrentNav();
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
      var bar = document.getElementById('read-progress');
      if (bar) bar.style.width = pct + '%';
    });
    updateCurrentNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initTheme();
      initPipeline();
      initScrollNav();
    });
  } else {
    initTheme();
    initPipeline();
    initScrollNav();
  }
})();
