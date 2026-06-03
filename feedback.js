(function () {
  if (document.getElementById("ps-feedback-root")) return;

  const style = document.createElement("style");
  style.textContent = `
    :root {
      --ps-widget-right: 20px;
      --ps-widget-bottom: 22px;
      --ps-widget-size: 44px;
      --ps-widget-gap: 12px;
    }

    .ps-feedback-launcher {
      position: fixed;
      right: var(--ps-widget-right);
      bottom: calc(var(--ps-widget-bottom) + var(--ps-widget-size) + var(--ps-widget-gap));
      z-index: 9990;
      width: var(--ps-widget-size);
      height: var(--ps-widget-size);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(245, 166, 35, 0.28);
      border-radius: 999px;
      background: rgba(15, 15, 24, 0.9);
      color: #f5a623;
      cursor: pointer;
      box-shadow: 0 12px 34px rgba(0, 0, 0, 0.28);
      backdrop-filter: blur(14px);
      transition: transform 0.18s ease, border-color 0.18s ease, color 0.18s ease, opacity 0.18s ease;
    }

    .ps-feedback-launcher:hover,
    .ps-feedback-launcher:focus-visible {
      color: #fff;
      border-color: rgba(245, 166, 35, 0.72);
      outline: none;
      transform: translateY(-1px);
    }

    .ps-feedback-launcher svg {
      display: block;
    }

    .ps-feedback-root {
      position: fixed;
      right: var(--ps-widget-right);
      bottom: calc(var(--ps-widget-bottom) + var(--ps-widget-size) + var(--ps-widget-gap));
      z-index: 9993;
      width: min(360px, calc(100vw - 32px));
      display: none;
      color: #fff;
      font-family: system-ui, -apple-system, Segoe UI, sans-serif;
    }

    .ps-feedback-root.open {
      display: block;
    }

    .ps-feedback-card {
      overflow: hidden;
      border: 1px solid rgba(245, 166, 35, 0.28);
      border-radius: 14px;
      background: rgba(16, 16, 24, 0.98);
      box-shadow: 0 28px 90px rgba(0, 0, 0, 0.52);
      backdrop-filter: blur(18px);
    }

    .ps-feedback-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 14px 14px 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .ps-feedback-title {
      margin: 0;
      color: #fff;
      font: 800 14px/1.2 system-ui, -apple-system, Segoe UI, sans-serif;
    }

    .ps-feedback-subtitle {
      display: block;
      margin-top: 3px;
      color: rgba(255, 255, 255, 0.48);
      font: 600 11px/1.4 system-ui, -apple-system, Segoe UI, sans-serif;
    }

    .ps-feedback-close {
      width: 30px;
      height: 30px;
      flex: 0 0 auto;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.64);
      cursor: pointer;
      font: 800 18px/1 system-ui, -apple-system, Segoe UI, sans-serif;
    }

    .ps-feedback-close:hover,
    .ps-feedback-close:focus-visible {
      color: #fff;
      border-color: rgba(245, 166, 35, 0.48);
      outline: none;
    }

    .ps-feedback-body {
      display: grid;
      gap: 12px;
      padding: 14px;
    }

    .ps-feedback-label {
      display: grid;
      gap: 6px;
      color: rgba(255, 255, 255, 0.66);
      font: 700 11px/1.3 system-ui, -apple-system, Segoe UI, sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }

    .ps-feedback-input,
    .ps-feedback-select,
    .ps-feedback-textarea {
      width: 100%;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.055);
      color: #fff;
      font: 600 13px/1.45 system-ui, -apple-system, Segoe UI, sans-serif;
      padding: 10px 11px;
      outline: none;
    }

    .ps-feedback-select {
      appearance: none;
      cursor: pointer;
    }

    .ps-feedback-textarea {
      min-height: 92px;
      resize: vertical;
    }

    .ps-feedback-input:focus,
    .ps-feedback-select:focus,
    .ps-feedback-textarea:focus {
      border-color: rgba(245, 166, 35, 0.58);
      box-shadow: 0 0 0 3px rgba(245, 166, 35, 0.1);
    }

    .ps-feedback-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding-top: 2px;
    }

    .ps-feedback-send {
      border: 1px solid rgba(245, 166, 35, 0.45);
      border-radius: 999px;
      background: rgba(245, 166, 35, 0.14);
      color: #f5a623;
      cursor: pointer;
      font: 800 12px/1 system-ui, -apple-system, Segoe UI, sans-serif;
      padding: 11px 15px;
    }

    .ps-feedback-send:hover,
    .ps-feedback-send:focus-visible {
      color: #fff;
      border-color: rgba(245, 166, 35, 0.8);
      outline: none;
    }

    .ps-feedback-send:disabled {
      opacity: 0.64;
      cursor: progress;
    }

    .ps-feedback-note {
      min-height: 18px;
      color: rgba(255, 255, 255, 0.5);
      font: 600 12px/1.5 system-ui, -apple-system, Segoe UI, sans-serif;
    }

    body.ps-search-open .ps-feedback-launcher,
    body.ps-search-open .ps-feedback-root {
      opacity: 0;
      pointer-events: none;
    }

    @media (max-width: 700px) {
      :root {
        --ps-widget-right: 14px;
        --ps-widget-bottom: calc(14px + env(safe-area-inset-bottom));
        --ps-widget-size: 42px;
        --ps-widget-gap: 10px;
      }

      .ps-feedback-root {
        left: 14px;
        right: 14px;
        width: auto;
      }
    }
  `;
  document.head.appendChild(style);

  const launcher = document.createElement("button");
  launcher.className = "ps-feedback-launcher";
  launcher.type = "button";
  launcher.setAttribute("aria-label", "Open feedback");
  launcher.setAttribute("title", "Feedback");
  launcher.innerHTML = `
    <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 8.5h10M7 12h6M8 19l-4 2V5.8C4 4.8 4.8 4 5.8 4h12.4c1 0 1.8.8 1.8 1.8v9.4c0 1-.8 1.8-1.8 1.8H9.6L8 19z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  const root = document.createElement("div");
  root.id = "ps-feedback-root";
  root.className = "ps-feedback-root";
  root.innerHTML = `
    <section class="ps-feedback-card" role="dialog" aria-modal="false" aria-label="Feedback">
      <div class="ps-feedback-head">
        <div>
          <h2 class="ps-feedback-title">Feedback</h2>
          <span class="ps-feedback-subtitle">Quick notes for improving this page.</span>
        </div>
        <button class="ps-feedback-close" type="button" aria-label="Close feedback">&times;</button>
      </div>
      <form class="ps-feedback-body" action="https://api.web3forms.com/submit" method="POST">
        <input type="hidden" name="access_key" value="721d917e-03e2-45de-bb75-3772c97f9fc4" />
        <input type="hidden" name="subject" value="New Submission from PrepSphere Feedback Form" />
        <input type="hidden" name="url" />
        <label class="ps-feedback-label">
          Page
          <input class="ps-feedback-input" name="page" type="text" readonly />
        </label>
        <label class="ps-feedback-label">
          Type
          <select class="ps-feedback-select" name="type" required>
            <option value="Mistake / Correction">Found a mistake or typo</option>
            <option value="Feature Request">Request a new feature</option>
            <option value="General Confusion">Something is confusing</option>
            <option value="Other">Other feedback</option>
          </select>
        </label>
        <label class="ps-feedback-label">
          Message
          <textarea class="ps-feedback-textarea" name="message" placeholder="What should be fixed or improved?" required></textarea>
        </label>
        <div class="ps-feedback-actions">
          <button class="ps-feedback-send" type="submit">Submit Feedback</button>
        </div>
        <div class="ps-feedback-note" aria-live="polite"></div>
      </form>
    </section>
  `;

  document.body.appendChild(launcher);
  document.body.appendChild(root);

  const form = root.querySelector("form");
  const closeBtn = root.querySelector(".ps-feedback-close");
  const sendBtn = root.querySelector(".ps-feedback-send");
  const pageInput = root.querySelector("[name='page']");
  const urlInput = root.querySelector("[name='url']");
  const messageInput = root.querySelector("[name='message']");
  const note = root.querySelector(".ps-feedback-note");

  pageInput.value = document.title || window.location.pathname;
  urlInput.value = window.location.href;

  function openFeedback() {
    root.classList.add("open");
    launcher.setAttribute("aria-expanded", "true");
    note.textContent = "";
    note.style.color = "rgba(255, 255, 255, 0.5)";
    setTimeout(() => messageInput.focus(), 0);
  }

  function closeFeedback() {
    root.classList.remove("open");
    launcher.setAttribute("aria-expanded", "false");
  }

  launcher.addEventListener("click", (event) => {
    event.stopPropagation();
    root.classList.contains("open") ? closeFeedback() : openFeedback();
  });

  closeBtn.addEventListener("click", closeFeedback);

  root.addEventListener("click", (event) => event.stopPropagation());

  document.addEventListener("click", () => {
    if (root.classList.contains("open")) closeFeedback();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && root.classList.contains("open")) closeFeedback();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = messageInput.value.trim();

    if (!message) {
      note.textContent = "Write a short note first.";
      note.style.color = "#f5a623";
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = "Sending...";
    note.textContent = "";
    note.style.color = "rgba(255, 255, 255, 0.5)";

    try {
      urlInput.value = window.location.href;
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      let data = {};
      try {
        data = await response.json();
      } catch (error) {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.message || "Could not send feedback.");
      }

      note.textContent = "Feedback sent successfully.";
      note.style.color = "#10b981";
      form.reset();
      pageInput.value = document.title || window.location.pathname;
      urlInput.value = window.location.href;
      setTimeout(closeFeedback, 1800);
    } catch (error) {
      note.textContent = error.message || "Network error. Please try again.";
      note.style.color = "#ef4444";
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = "Submit Feedback";
    }
  });
})();
