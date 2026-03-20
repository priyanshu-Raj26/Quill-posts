(function () {
  "use strict";

  /* 1. Staggered Post Card Entrance  */
  // Each .post starts opacity:0 via CSS; we add .visible with
  // a small delay so cards cascade in from top to bottom.
  function animateCards() {
    const cards = document.querySelectorAll(".post");
    if (!cards.length) return;

    cards.forEach((card, i) => {
      setTimeout(
        () => {
          card.classList.add("visible");
        },
        80 + i * 90,
      ); // stagger: 80ms base + 90ms per card
    });
  }

  /*  2. Toast Notification Utility */
  // showToast('Your message here', durationMs)
  let toastEl = null;
  let toastTimer = null;

  function showToast(msg, duration = 2800) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.id = "toast";
      document.body.appendChild(toastEl);
    }

    toastEl.textContent = msg;
    toastEl.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("show");
    }, duration);
  }

  /* 3. Custom Delete Confirmation */
  // Intercepts all delete forms and shows a styled inline
  // confirmation before submitting — avoids ugly browser dialogs.
  function initDeleteConfirm() {
    const deleteForms = document.querySelectorAll('form[action*="DELETE"]');

    deleteForms.forEach((form) => {
      const btn = form.querySelector("button");
      if (!btn) return;

      let confirmed = false;

      btn.addEventListener("click", function (e) {
        if (confirmed) return; // already confirmed, let submit through

        e.preventDefault();
        e.stopPropagation();

        // Visual feedback: change button to a confirm prompt
        const originalText = btn.textContent;
        btn.textContent = "Sure? Click again ✓";
        btn.style.background = "#b91c1c";
        btn.style.color = "#fff";
        btn.style.borderColor = "#b91c1c";

        // Auto-reset after 3 s if user changes their mind
        const resetTimer = setTimeout(() => {
          confirmed = false;
          btn.textContent = originalText;
          btn.style.cssText = "";
        }, 3000);

        // Second click confirms
        btn.addEventListener(
          "click",
          function secondClick(e2) {
            e2.preventDefault();
            clearTimeout(resetTimer);
            confirmed = true;
            showToast("Post deleted.");
            setTimeout(() => form.submit(), 400); // brief delay so toast shows
            btn.removeEventListener("click", secondClick);
          },
          { once: true },
        );
      });
    });
  }

  /* 4. Textarea Character Counter  */
  // Appends a live counter below every <textarea> so users
  // know how long their post is.
  const MAX_CHARS = 500;

  function initCharCounter() {
    const textareas = document.querySelectorAll("textarea");

    textareas.forEach((ta) => {
      // Create counter element
      const counter = document.createElement("div");
      counter.className = "char-counter";
      ta.insertAdjacentElement("afterend", counter);

      function update() {
        const len = ta.value.length;
        const remaining = MAX_CHARS - len;
        counter.textContent = `${len} / ${MAX_CHARS} characters`;

        counter.classList.remove("warn", "limit");
        if (remaining < 0) counter.classList.add("limit");
        else if (remaining < 80) counter.classList.add("warn");
      }

      ta.addEventListener("input", update);
      update(); // run once on load (edit page may have pre-filled text)
    });
  }

  /* 5. Auto-expand Textarea */
  // Makes textareas grow with their content so the user isn't
  // trapped in a tiny fixed-height box.
  function initAutoExpand() {
    const textareas = document.querySelectorAll("textarea");
    textareas.forEach((ta) => {
      function resize() {
        ta.style.height = "auto";
        ta.style.height = ta.scrollHeight + "px";
      }
      ta.addEventListener("input", resize);
      resize();
    });
  }

  /*  6. Smooth Page-Exit Transition */
  // Adds a fast fade-out when navigating away so page changes
  // feel intentional rather than abrupt.
  function initPageTransitions() {
    document.body.style.transition = "opacity 0.18s ease";

    document.querySelectorAll("a[href]").forEach((link) => {
      // Skip links that open new tabs or are anchors
      if (
        link.target === "_blank" ||
        link.href.startsWith("#") ||
        link.href.startsWith("javascript")
      )
        return;

      link.addEventListener("click", (e) => {
        const href = link.href;
        // Don't intercept if modifier key is held
        if (e.ctrlKey || e.metaKey || e.shiftKey) return;

        e.preventDefault();
        document.body.style.opacity = "0";
        setTimeout(() => {
          window.location.href = href;
        }, 180);
      });
    });

    // Fade in on arrival
    document.body.style.opacity = "0";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.style.opacity = "1";
      });
    });
  }

  /* 7. Input Focus Labels (floating-label feel) */
  // Highlights the parent wrapper when input/textarea is focused
  // for a polished form experience.
  function initInputHighlight() {
    const inputs = document.querySelectorAll("input, textarea");
    inputs.forEach((el) => {
      el.addEventListener("focus", () =>
        el.setAttribute("data-focused", "true"),
      );
      el.addEventListener("blur", () => el.removeAttribute("data-focused"));
    });
  }

  /*  8. Show a welcome toast on the posts index */
  function maybeWelcomeToast() {
    // Only on the posts listing page (has multiple .post cards)
    const cards = document.querySelectorAll(".post");
    if (cards.length > 0 && document.title.toLowerCase().includes("all")) {
      setTimeout(
        () =>
          showToast(
            `${cards.length} post${cards.length > 1 ? "s" : ""} loaded ✦`,
          ),
        700,
      );
    }
  }

  /* Init */
  function init() {
    animateCards();
    initDeleteConfirm();
    initCharCounter();
    initAutoExpand();
    initPageTransitions();
    initInputHighlight();
    maybeWelcomeToast();
  }

  // Run after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
