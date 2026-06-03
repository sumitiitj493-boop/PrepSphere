console.log("PrepSphere Feedback System initialized. v3");

(function () {
  if (document.getElementById("ps-feedback-root")) return;

  const style = document.createElement("style");
  style.textContent = `
    .ps-feedback-launcher {
      position: fixed;
      right: 20px;
      bottom: 80px; 
      z-index: 99999;
      border: 1px solid rgba(255, 100, 100, 0.35);
      border-radius: 999px;
      background: rgba(15, 15, 24, 0.92);
      color: #ff6b6b;
      font: 700 13px/1 system-ui, -apple-system, sans-serif;
      padding: 12px 18px;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
      backdrop-filter: blur(14px);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }
    .ps-feedback-launcher:hover {
      color: #fff;
      border-color: rgba(255, 100, 100, 0.75);
      transform: translateY(-2px);
    }
    
    .ps-feedback-root {
      position: fixed;
      inset: 0;
      z-index: 999999;
      display: none;
      align-items: center;
      justify-content: center;
      background: rgba(3, 2, 10, 0.75);
      backdrop-filter: blur(8px);
      padding: 20px;
    }
    .ps-feedback-root.open {
      display: flex;
      animation: psFsFadeIn 0.2s ease forwards;
    }
    @keyframes psFsFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .ps-feedback-modal {
      width: 100%;
      max-width: 450px;
      background: #0f1016;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      box-shadow: 0 40px 100px rgba(0,0,0,0.8);
      overflow: hidden;
      transform: translateY(20px);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .ps-feedback-root.open .ps-feedback-modal {
      transform: translateY(0);
    }

    .ps-feedback-header {
      padding: 18px 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .ps-feedback-header h3 {
      font: 700 18px system-ui, -apple-system, sans-serif;
      color: #fff;
      margin: 0;
    }
    .ps-feedback-close {
      background: transparent;
      border: 0;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      font-size: 24px;
      line-height: 1;
      padding: 0;
      margin: 0;
    }
    .ps-feedback-close:hover {
      color: #fff;
    }

    .ps-feedback-body {
      padding: 24px;
    }
    
    .ps-feedback-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .ps-feedback-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    
    .ps-feedback-group label {
      font: 600 12px system-ui, sans-serif;
      color: rgba(255,255,255,0.7);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .ps-feedback-input, .ps-feedback-select {
      width: 100%;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 12px 14px;
      color: #fff;
      font: 400 14px system-ui, sans-serif;
      outline: none;
      transition: border-color 0.2s;
    }
    
    .ps-feedback-input:focus, .ps-feedback-select:focus {
      border-color: #ff6b6b;
      background: rgba(255, 255, 255, 0.06);
    }

    .ps-feedback-select {
      appearance: none;
      cursor: pointer;
    }

    textarea.ps-feedback-input {
      resize: vertical;
      min-height: 100px;
      font-family: inherit;
    }

    .ps-feedback-submit {
      margin-top: 8px;
      background: #ff6b6b;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 14px;
      font: 700 15px system-ui, sans-serif;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
    }
    
    .ps-feedback-submit:hover {
      background: #ff5252;
    }
    .ps-feedback-submit:active {
      transform: scale(0.98);
    }
    .ps-feedback-submit:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .ps-feedback-status {
      text-align: center;
      font-size: 14px;
      margin-top: 10px;
      font-weight: 600;
      min-height: 20px;
    }
    
    @media (max-width: 600px) {
      .ps-feedback-launcher {
        bottom: 80px; 
        right: 14px;
        padding: 10px 14px;
      }
      .ps-feedback-launcher span {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);

  // 1) Launcher Button
  const launcher = document.createElement("button");
  launcher.className = "ps-feedback-launcher";
  launcher.type = "button";
  launcher.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
    <span>Feedback</span>
  `;
  document.body.appendChild(launcher);

  // 2) Modal Root
  const root = document.createElement("div");
  root.className = "ps-feedback-root";
  root.id = "ps-feedback-root";

  root.innerHTML = `
    <div class="ps-feedback-modal">
      <div class="ps-feedback-header">
        <h3>Send Feedback</h3>
        <button type="button" class="ps-feedback-close">&times;</button>
      </div>
      <div class="ps-feedback-body">
        <form class="ps-feedback-form" id="ps-feedback-form" action="https://api.web3forms.com/submit" method="POST">
          <input type="hidden" name="access_key" value="721d917e-03e2-45de-bb75-3772c97f9fc4">
          <input type="hidden" name="subject" value="New Submission from PrepSphere Feedback Form">
          
          <div class="ps-feedback-group">
            <label>Topic / Page</label>
            <input type="text" class="ps-feedback-input" name="page" id="fb-page" readonly value="${document.title}" />
          </div>

          <div class="ps-feedback-group">
            <label>What's on your mind?</label>
            <select class="ps-feedback-select" name="type" id="fb-type" required>
              <option value="Mistake / Correction">Found a mistake or typo</option>
              <option value="Feature Request">Request a new feature</option>
              <option value="General Confusion">Something is confusing</option>
              <option value="Other">Other feedback</option>
            </select>
          </div>

          <div class="ps-feedback-group">
            <label>Message</label>
            <textarea class="ps-feedback-input" name="message" id="fb-message" placeholder="Describe the issue or feature here..." required></textarea>
          </div>
          
          <button type="submit" class="ps-feedback-submit" id="fb-submit-btn">Submit Feedback</button>
          <div class="ps-feedback-status" id="fb-status"></div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  // 3) Logic
  const closeBtn = root.querySelector(".ps-feedback-close");
  const form = document.getElementById("ps-feedback-form");
  const submitBtn = document.getElementById("fb-submit-btn");
  const statusBox = document.getElementById("fb-status");

  function openFeedback() {
    root.classList.add("open");
  }

  function closeFeedback() {
    root.classList.remove("open");
    setTimeout(() => {
        statusBox.innerHTML = "";
        form.reset();
    }, 300);
  }

  launcher.addEventListener("click", openFeedback);
  closeBtn.addEventListener("click", closeFeedback);
  
  root.addEventListener("click", (e) => {
    if (e.target === root) closeFeedback();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
    statusBox.innerHTML = "";

    const formData = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            statusBox.innerHTML = "✅ Feedback sent successfully!";
            statusBox.style.color = "#10b981"; 
            form.reset();
            setTimeout(closeFeedback, 2500);
        } else {
            const data = await response.json();
            statusBox.innerHTML = data.message || "❌ Oops! Something went wrong.";
            statusBox.style.color = "#ef4444"; 
        }
    } catch (error) {
        statusBox.innerHTML = "❌ Network error. Please try again.";
        statusBox.style.color = "#ef4444";
    } finally {
        submitBtn.textContent = "Submit Feedback";
        submitBtn.disabled = false;
    }
  });
})();