/* ============================================
   PIXEL PINK — script.js
   Smooth scroll, scroll reveal, stat bar animation,
   love meter, floating hearts, secret button.
   ============================================ */

(function () {
  'use strict';

  // ---- START BUTTON: Smooth scroll to profile ----
  var startBtn = document.getElementById('startBtn');
  if (startBtn) {
    startBtn.addEventListener('click', function () {
      var profile = document.getElementById('profile');
      if (profile) {
        profile.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ---- SCROLL REVEAL ----
  var revealElements = document.querySelectorAll('.reveal');

  function checkReveal() {
    var windowHeight = window.innerHeight;
    revealElements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < windowHeight * 0.88) {
        el.classList.add('visible');
      }
    });
  }

  // Use IntersectionObserver if available, fallback to scroll event
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    window.addEventListener('scroll', checkReveal, { passive: true });
    checkReveal();
  }

  // ---- STAT BAR ANIMATION ----
  var statFills = document.querySelectorAll('.stat-fill');
  var statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    var profileSection = document.getElementById('profile');
    if (!profileSection) return;

    var rect = profileSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.7) {
      statsAnimated = true;
      statFills.forEach(function (fill) {
        var width = fill.getAttribute('data-width');
        if (width) {
          fill.style.width = width + '%';
        }
      });
    }
  }

  if ('IntersectionObserver' in window) {
    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            statFills.forEach(function (fill) {
              var width = fill.getAttribute('data-width');
              if (width) {
                fill.style.width = width + '%';
              }
            });
            statsObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    var profileEl = document.getElementById('profile');
    if (profileEl) {
      statsObserver.observe(profileEl);
    }
  } else {
    window.addEventListener('scroll', animateStats, { passive: true });
    animateStats();
  }

  // ---- LOVE METER ANIMATION ----
  var loveMeterFill = document.getElementById('loveMeterFill');

  if (loveMeterFill) {
    if ('IntersectionObserver' in window) {
      var loveObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              loveMeterFill.style.width = '38%';
              loveObserver.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );
      loveObserver.observe(loveMeterFill.parentElement);
    } else {
      setTimeout(function () {
        loveMeterFill.style.width = '38%';
      }, 2000);
    }
  }

  // ---- FLOATING PIXEL HEARTS ----
  var heartsContainer = document.getElementById('floatingHearts');

  // Check for reduced motion preference
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heartsContainer && !prefersReducedMotion) {
    function createHeart() {
      var heart = document.createElement('div');
      heart.className = 'pixel-heart';
      heart.setAttribute('aria-hidden', 'true');

      var size = 0.3 + Math.random() * 0.5;
      var left = Math.random() * 100;
      var duration = 15 + Math.random() * 20;
      var delay = Math.random() * 10;

      heart.style.left = left + '%';
      heart.style.transform = 'scale(' + size + ')';
      heart.style.animationDuration = duration + 's';
      heart.style.animationDelay = delay + 's';

      heartsContainer.appendChild(heart);

      // Remove old hearts if too many
      if (heartsContainer.children.length > 8) {
        heartsContainer.removeChild(heartsContainer.firstChild);
      }
    }

    // Create initial hearts
    for (var i = 0; i < 5; i++) {
      createHeart();
    }

    // Add a new heart periodically
    setInterval(function () {
      if (heartsContainer.children.length < 8) {
        createHeart();
      }
    }, 6000);
  }

  // ---- SECRET BUTTON ----
  var secretBtn = document.getElementById('secretBtn');
  var secretPopup = document.getElementById('secretPopup');
  var secretClose = document.getElementById('secretClose');

  if (secretBtn && secretPopup && secretClose) {
    secretBtn.addEventListener('click', function () {
      secretPopup.classList.add('active');
      secretClose.focus();
    });

    secretClose.addEventListener('click', function () {
      secretPopup.classList.remove('active');
      secretBtn.focus();
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && secretPopup.classList.contains('active')) {
        secretPopup.classList.remove('active');
        secretBtn.focus();
      }
    });

    // Close on outside click
    secretPopup.addEventListener('click', function (e) {
      if (e.target === secretPopup) {
        secretPopup.classList.remove('active');
        secretBtn.focus();
      }
    });
  }
})();
