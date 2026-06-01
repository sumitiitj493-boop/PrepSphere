(function () {
  const index = window.PREP_SEARCH_INDEX || [];
  if (!index.length || document.getElementById("ps-search-root")) return;

  const style = document.createElement("style");
  style.textContent = `
    .ps-search-launcher {
      position: fixed;
      right: 20px;
      bottom: 88px;
      z-index: 9991;
      border: 1px solid rgba(245, 166, 35, 0.35);
      border-radius: 999px;
      background: rgba(15, 15, 24, 0.92);
      color: #f5a623;
      font: 700 12px/1 system-ui, -apple-system, Segoe UI, sans-serif;
      padding: 11px 15px;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
      backdrop-filter: blur(14px);
    }
    .ps-search-launcher:hover,
    .ps-search-launcher:focus-visible {
      color: #fff;
      border-color: rgba(245, 166, 35, 0.75);
      outline: none;
    }
    .ps-search-root {
      position: fixed;
      inset: 0;
      z-index: 9992;
      display: none;
      align-items: flex-start;
      justify-content: center;
      padding: min(12vh, 92px) 18px 18px;
      background: rgba(3, 2, 10, 0.68);
      backdrop-filter: blur(10px);
      cursor: auto;
    }
    .ps-search-root.open {
      display: flex;
    }
    .ps-search-box {
      width: min(720px, 100%);
      overflow: hidden;
      border: 1px solid rgba(245, 166, 35, 0.3);
      border-radius: 16px;
      background: #101018;
      color: #fff;
      box-shadow: 0 30px 110px rgba(0, 0, 0, 0.58);
      cursor: auto;
    }
    .ps-search-head {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .ps-search-input {
      width: 100%;
      border: 0;
      outline: 0;
      background: transparent;
      color: #fff;
      font: 600 18px/1.4 system-ui, -apple-system, Segoe UI, sans-serif;
      cursor: text;
    }
    .ps-search-input::placeholder {
      color: rgba(255, 255, 255, 0.38);
    }
    .ps-search-key {
      flex: 0 0 auto;
      color: rgba(255, 255, 255, 0.36);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 7px;
      padding: 4px 7px;
      font: 700 11px/1 system-ui, -apple-system, Segoe UI, sans-serif;
    }
    .ps-search-results {
      max-height: min(58vh, 520px);
      overflow-y: auto;
      padding: 8px;
    }
    .ps-search-item {
      display: grid;
      gap: 4px;
      width: 100%;
      border: 0;
      border-radius: 10px;
      background: transparent;
      color: inherit;
      padding: 12px;
      text-align: left;
      cursor: pointer;
    }
    .ps-search-item:hover,
    .ps-search-item.active {
      background: rgba(245, 166, 35, 0.12);
    }
    .ps-search-title {
      color: #fff;
      font: 800 14px/1.3 system-ui, -apple-system, Segoe UI, sans-serif;
    }
    .ps-search-meta {
      color: rgba(255, 255, 255, 0.48);
      font: 600 11px/1.4 system-ui, -apple-system, Segoe UI, sans-serif;
      letter-spacing: 0.6px;
      text-transform: uppercase;
    }
    .ps-search-empty {
      padding: 28px 16px;
      color: rgba(255, 255, 255, 0.52);
      text-align: center;
      font: 600 13px/1.6 system-ui, -apple-system, Segoe UI, sans-serif;
    }
    @media (max-width: 700px) {
      .ps-search-launcher {
        right: 14px;
        bottom: 78px;
        padding: 10px 13px;
      }
      .ps-search-root {
        padding-top: 72px;
      }
      .ps-search-input {
        font-size: 16px;
      }
    }
  `;
  document.head.appendChild(style);

  const launcher = document.createElement("button");
  launcher.className = "ps-search-launcher";
  launcher.type = "button";
  launcher.textContent = "Search /";
  launcher.setAttribute("aria-label", "Open search");

  const root = document.createElement("div");
  root.className = "ps-search-root";
  root.id = "ps-search-root";
  root.innerHTML = `
    <div class="ps-search-box" role="dialog" aria-modal="true" aria-label="Search PrepSphere">
      <div class="ps-search-head">
        <input class="ps-search-input" type="search" placeholder="Search topics, concepts, keywords..." autocomplete="off" />
        <span class="ps-search-key">Esc</span>
      </div>
      <div class="ps-search-results" role="listbox"></div>
    </div>
  `;

  document.body.appendChild(launcher);
  document.body.appendChild(root);

  const input = root.querySelector(".ps-search-input");
  const resultsEl = root.querySelector(".ps-search-results");
  let results = [];
  let active = 0;

  function normalize(value) {
    return String(value || "").toLowerCase();
  }

  function scoreEntry(entry, terms) {
    const title = normalize(entry.title);
    const topic = normalize(entry.topic);
    const keywords = normalize(entry.keywords);
    let score = 0;

    for (const term of terms) {
      if (title === term) score += 80;
      if (title.includes(term)) score += 35;
      if (topic.includes(term)) score += 24;
      if (keywords.includes(term)) score += 12;
    }

    return score;
  }

  function search(query) {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    if (!terms.length) return index.slice(0, 8);

    return index
      .map((entry) => ({ entry, score: scoreEntry(entry, terms) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
      .slice(0, 10)
      .map((item) => item.entry);
  }

  function render() {
    resultsEl.innerHTML = "";
    if (!results.length) {
      resultsEl.innerHTML = '<div class="ps-search-empty">No matches found.</div>';
      return;
    }

    results.forEach((entry, index) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "ps-search-item" + (index === active ? " active" : "");
      item.setAttribute("role", "option");
      item.innerHTML = `
        <span class="ps-search-title">${entry.title}</span>
        <span class="ps-search-meta">${entry.topic} - ${entry.url}</span>
      `;
      item.addEventListener("click", () => go(entry));
      resultsEl.appendChild(item);
    });
  }

  function update() {
    results = search(input.value);
    active = 0;
    render();
  }

  function openSearch(prefill) {
    root.classList.add("open");
    input.value = prefill || "";
    update();
    setTimeout(() => input.focus(), 0);
  }

  function closeSearch() {
    root.classList.remove("open");
    input.blur();
  }

  function go(entry) {
    closeSearch();
    window.location.href = entry.url;
  }

  launcher.addEventListener("mousedown", (event) => event.stopPropagation());
  launcher.addEventListener("click", (event) => {
    event.stopPropagation();
    openSearch();
  });
  root.addEventListener("mousedown", (event) => event.stopPropagation());
  root.addEventListener("keydown", (event) => event.stopPropagation());
  root.addEventListener("click", (event) => {
    event.stopPropagation();
    if (event.target === root) closeSearch();
  });
  root.querySelector(".ps-search-box").addEventListener("click", (event) => {
    event.stopPropagation();
  });
  input.addEventListener("input", update);
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      active = Math.min(active + 1, results.length - 1);
      render();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      active = Math.max(active - 1, 0);
      render();
    } else if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      go(results[active]);
    } else if (event.key === "Escape") {
      closeSearch();
    }
  });

  document.addEventListener("keydown", (event) => {
    const tag = document.activeElement && document.activeElement.tagName;
    const typing = tag === "INPUT" || tag === "TEXTAREA" || document.activeElement.isContentEditable;

    if (event.key === "/" && !typing) {
      event.preventDefault();
      openSearch();
    } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openSearch();
    } else if (event.key === "Escape" && root.classList.contains("open")) {
      closeSearch();
    }
  });
})();

// Auto-fix quick-jump menu numbering across pages
(function () {
  try {
    const qm = document.getElementById('qm');
    if (!qm) return;
    const anchors = Array.from(qm.querySelectorAll('a'));
    let idx = 1;
    anchors.forEach((a) => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      const text = (a.textContent || '').replace(/^\s*\d+\.\s*/, '').trim();
      if (href === 'index.html' || text.toLowerCase() === 'home') {
        a.textContent = 'Home';
        return;
      }
      const label = (idx < 10 ? '0' + idx : idx) + '. ' + text;
      a.textContent = label;
      idx++;
    });
  } catch (e) {
    // fail silently
  }
})();
