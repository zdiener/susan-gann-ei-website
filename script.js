/* =========================================================
   Susan Gann — Emotional Intelligence
   Vanilla JS: nav toggle, scroll reveal, active-link tracking,
   and runtime email assembly (spam mitigation).
   ========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- Current year in footer ---------- */
    var yearEl = document.getElementById("year");
    if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

    /* ---------- Mobile nav toggle ---------- */
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("primaryNav");

    function closeNav() {
      if (!nav || !toggle) return;
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      // Close after choosing a destination (mobile)
      nav.addEventListener("click", function (e) {
        if (e.target.closest("a")) { closeNav(); }
      });
      // Close on Escape
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { closeNav(); }
      });
    }

    /* ---------- Scroll-reveal on section entry ---------- */
    var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      }, { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    }

    /* ---------- Active nav link tracking ---------- */
    var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.primary-nav a[href^="#"]'));
    var linkMap = {};
    navLinks.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      if (id) { linkMap[id] = a; }
    });

    if (sections.length && "IntersectionObserver" in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var link = linkMap[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.classList.remove("is-active"); });
            link.classList.add("is-active");
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
      sections.forEach(function (s) { spy.observe(s); });
    }

    /* ---------- Runtime email assembly (spam mitigation) ----------
       The full address never appears in the HTML/JS source as one
       string. It is reassembled from parts here, at runtime. */
    var emailBtn = document.getElementById("emailBtn");
    var fallback = document.getElementById("emailFallback");

    if (emailBtn) {
      try {
        var user = ["susan", "cgann"].join("");          // local part
        var domain = ["gmail", "com"].join(".");          // domain part
        var address = user + String.fromCharCode(64) + domain; // 64 = "@"

        var subject = emailBtn.getAttribute("data-subject") || "Website Inquiry";
        var body = "Hello Susan,\n\nI'd like to ask about your emotional intelligence training.\n\n";

        var href = "mailto:" + address +
                   "?subject=" + encodeURIComponent(subject) +
                   "&body=" + encodeURIComponent(body);

        emailBtn.setAttribute("href", href);
        emailBtn.setAttribute("aria-label", "Email Susan (opens your email app)");
      } catch (err) {
        // Degrade gracefully: leave the button inert, show a gentle hint.
        emailBtn.setAttribute("href", "#contact");
        if (fallback) { fallback.hidden = false; }
      }
    }

  });
})();
