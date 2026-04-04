/**
 * SOL AUDIO CAR V2 — Interactive Engine
 * Scroll reveal, parallax, counters, navbar, smooth scroll
 */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     1. NAVBAR — Auto-hide on scroll down, show on scroll up
  ------------------------------------------------------------------ */
  const nav = document.querySelector(".nav");
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  let lastScroll = 0;
  let ticking = false;

  function updateNav() {
    const y = window.scrollY;
    if (!nav) return;

    // Solid background after 60px
    nav.classList.toggle("solid", y > 60);

    // Auto-hide on scroll down, show on scroll up
    if (y > lastScroll && y > 200) {
      nav.classList.add("hidden");
    } else {
      nav.classList.remove("hidden");
    }

    lastScroll = y;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        requestAnimationFrame(updateNav);
        ticking = true;
      }
    },
    { passive: true },
  );

  // Mobile toggle
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      toggle.classList.toggle("active");
      menu.classList.toggle("open");
      var isOpen = menu.classList.contains("open");
      document.body.style.overflow = isOpen ? "hidden" : "";
      document.body.classList.toggle("menu-open", isOpen);
    });

    // Close on link click
    menu.querySelectorAll(".nav__link").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.classList.remove("active");
        menu.classList.remove("open");
        document.body.style.overflow = "";
        document.body.classList.remove("menu-open");
      });
    });
  }

  /* ------------------------------------------------------------------
     2. SCROLL REVEAL — IntersectionObserver with stagger
  ------------------------------------------------------------------ */
  const reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && reveals.length) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px",
      },
    );

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback
    reveals.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ------------------------------------------------------------------
     3. ANIMATED COUNTERS
  ------------------------------------------------------------------ */
  const counters = document.querySelectorAll("[data-count]");

  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 2000;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * ease);
      el.textContent = current.toLocaleString("es-AR") + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window && counters.length) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     4. SMOOTH SCROLL for anchor links
  ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var href = this.getAttribute("href");
      if (href && href.length > 1) {
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var offset = nav ? nav.offsetHeight : 0;
          var top =
            target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: "smooth" });
        }
      }
    });
  });

  /* ------------------------------------------------------------------
     5. PARALLAX — Hero subtle movement
  ------------------------------------------------------------------ */
  const heroContent = document.querySelector(".hero__content");

  if (heroContent) {
    window.addEventListener(
      "scroll",
      function () {
        var y = window.scrollY;
        if (y < window.innerHeight) {
          heroContent.style.transform = "translateY(" + y * 0.15 + "px)";
          heroContent.style.opacity = 1 - y / (window.innerHeight * 0.8);
        }
      },
      { passive: true },
    );
  }

  /* ------------------------------------------------------------------
     6. MAGNETIC BUTTONS — Subtle cursor follow
  ------------------------------------------------------------------ */
  const magneticBtns = document.querySelectorAll(".btn--gold, .btn--wa");

  magneticBtns.forEach(function (btn) {
    btn.addEventListener("mousemove", function (e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = "translate(" + x * 0.15 + "px, " + y * 0.15 + "px)";
    });

    btn.addEventListener("mouseleave", function () {
      btn.style.transform = "";
    });
  });

  /* ------------------------------------------------------------------
     7. CARD TILT — Subtle 3D on hover (desktop only)
  ------------------------------------------------------------------ */
  if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var rotateX = (y - 0.5) * -6;
        var rotateY = (x - 0.5) * 6;
        card.style.transform =
          "perspective(800px) rotateX(" +
          rotateX +
          "deg) rotateY(" +
          rotateY +
          "deg) translateY(-5px)";
      });

      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ------------------------------------------------------------------
     8. TERMINAL TYPING EFFECT
  ------------------------------------------------------------------ */
  const terminalText = document.querySelector(".terminal__typed");
  if (terminalText) {
    const fullText = terminalText.getAttribute("data-text");
    terminalText.textContent = "";
    let i = 0;

    function typeChar() {
      if (i < fullText.length) {
        terminalText.textContent += fullText.charAt(i);
        i++;
        setTimeout(typeChar, 25 + Math.random() * 35);
      }
    }

    const termObserver = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          setTimeout(typeChar, 400);
          termObserver.unobserve(terminalText);
        }
      },
      { threshold: 0.5 },
    );

    termObserver.observe(terminalText);
  }
})();
