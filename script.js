/* ============================================================
   Faze — shared JS
   - Hamburger menu toggle
   - Smooth scroll for in-page anchors
   - Scroll reveal (Intersection Observer, MagicUI blur-fade)
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  var hamburger = document.querySelector(".hamburger");
  var navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Close menu after choosing a link
    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        navLinks.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });

    // Reset menu state when resizing up to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1023) {
        navLinks.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Smooth scroll for same-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ---------- Hero video: respect reduced motion ---------- */
  var heroVideo = document.querySelector(".hero-video-bg, .cine-video");
  if (
    heroVideo &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    heroVideo.removeAttribute("autoplay");
    heroVideo.pause();
  }

  /* ---------- Aspire rotator (cycle founder names) ---------- */
  var rotator = document.getElementById("aspire-rotator");
  if (rotator) {
    var founders = [
      {
        name: "Sam Altman",
        logo: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/e7/f6/e3/e7f6e3fb-8e24-ba31-03ff-aba23d60841f/AppIcon-0-0-1x_U007epad-0-0-0-1-0-P3-85-220.png/512x512bb.jpg"
      },
      {
        name: "Kevin Systrom",
        logo: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/68/cd/d6/68cdd6cf-a186-a0b0-b90b-cc98516c8404/Prod-0-0-1x_U007epad-0-1-0-sRGB-85-220.png/512x512bb.jpg"
      },
      {
        name: "Luis von Ahn",
        logo: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/5c/c7/d2/5cc7d2bd-a7dd-1a42-d768-a7b37bf4a20f/AppIcon-0-0-1x_U007epad-0-1-85-220.png/1024x1024bb.png"
      },
      {
        name: "Zach Yadegari",
        logo: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/88/89/c5/8889c56f-da19-4da0-117e-b7f15b000e02/AppIcon-0-1x_U007ephone-0-1-85-220-0.png/512x512bb.jpg"
      },
      {
        name: "Brian Chesky",
        logo: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/97/85/c7/9785c75f-ed54-ba29-4b28-bb0f5cc785e9/AppIcon-0-0-1x_U007epad-0-1-0-0-0-85-220.png/512x512bb.jpg"
      },
      {
        name: "Evan Spiegel",
        logo: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/da/f1/b5/daf1b5ab-5696-bf3a-380f-5ed4c5f286cf/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/512x512bb.jpg"
      }
    ];
    var avatarEl = rotator.querySelector(".aspire-avatar img");
    var nameEl = rotator.querySelector(".aspire-name");
    var idx = 0;
    var rotatorReduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (avatarEl && nameEl && !rotatorReduce) {
      setInterval(function () {
        rotator.classList.add("swap");
        setTimeout(function () {
          idx = (idx + 1) % founders.length;
          avatarEl.src = founders[idx].logo;
          nameEl.textContent = founders[idx].name;
          rotator.classList.remove("swap");
        }, 400);
      }, 2600);
    }
  }

  /* ---------- How it works — step carousel ---------- */
  var hiwCarousel = document.getElementById("hiw-carousel");
  if (hiwCarousel) {
    var hiwSlides = hiwCarousel.querySelectorAll(".hiw-slide");
    var hiwDots = document.querySelectorAll(".hiw-dot");
    var hiwCurrent = 0;

    var setHiwActive = function (i) {
      if (i === hiwCurrent) return;
      hiwCurrent = i;
      hiwDots.forEach(function (dot, idx) {
        var on = idx === i;
        dot.classList.toggle("is-active", on);
        dot.setAttribute("aria-selected", on ? "true" : "false");
      });
    };

    // Click a dot -> scroll the matching slide into view
    hiwDots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        hiwCarousel.scrollTo({
          left: i * hiwCarousel.clientWidth,
          behavior: "smooth"
        });
        setHiwActive(i);
      });
    });

    // Sync active dot to whichever slide is centered
    if ("IntersectionObserver" in window) {
      var hiwObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var idx = Array.prototype.indexOf.call(hiwSlides, entry.target);
              if (idx > -1) setHiwActive(idx);
            }
          });
        },
        { root: hiwCarousel, threshold: 0.6 }
      );
      hiwSlides.forEach(function (slide) {
        hiwObserver.observe(slide);
      });
    }
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el, i) {
      // small stagger for grouped cards
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      observer.observe(el);
    });
  }
})();
