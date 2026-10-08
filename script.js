
"use strict";

// Add this class only when JavaScript is running.
// If JavaScript fails, content remains visible.
document.documentElement.classList.add("js-ready");

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // 1. Mobile navigation
  // =========================
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove("nav-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("nav-open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    navLinks.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuToggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        navLinks.classList.contains("nav-open") &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  // =========================
  // 2. Typing animation
  // =========================
  const typingElement = document.querySelector(".typing-text");

  if (typingElement) {
    const titles = [
      "AI Engineer",
      "GenAI Engineer",
      "Computer Vision Engineer",
      "RAG Developer",
      "Edge AI Enthusiast"
    ];

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      typingElement.textContent = titles[0];
    } else {
      let titleIndex = 0;
      let characterIndex = titles[0].length;
      let deleting = true;

      function typeTitle() {
        const currentTitle = titles[titleIndex];

        if (deleting) {
          characterIndex--;
        } else {
          characterIndex++;
        }

        typingElement.textContent = currentTitle.slice(
          0,
          Math.max(0, characterIndex)
        );

        let delay = deleting ? 45 : 85;

        if (!deleting && characterIndex === currentTitle.length) {
          deleting = true;
          delay = 1400;
        } else if (deleting && characterIndex === 0) {
          deleting = false;
          titleIndex = (titleIndex + 1) % titles.length;
          delay = 350;
        }

        window.setTimeout(typeTitle, delay);
      }

      window.setTimeout(typeTitle, 1400);
    }
  }

  // =========================
  // 3. Scroll reveal
  // =========================
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // =========================
  // 4. Active navigation link
  // =========================
  const sections = document.querySelectorAll("main section[id]");
  const navigationLinks = document.querySelectorAll(
    '.nav-links a[href^="#"]'
  );

  function setActiveLink(id) {
    navigationLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections.length > 0) {
          setActiveLink(visibleSections[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.1, 0.25, 0.5]
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // =========================
  // 5. Project filtering
  // =========================
  const filterButtons = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll("[data-category]");
  const noProjectsMessage = document.querySelector("#no-projects");

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selectedCategory = button.dataset.filter;
        let visibleCount = 0;

        filterButtons.forEach((filterButton) => {
          const isActive = filterButton === button;

          filterButton.classList.toggle("filter-active", isActive);
          filterButton.setAttribute("aria-pressed", String(isActive));
        });

        projectCards.forEach((card) => {
          const matches =
            selectedCategory === "all" ||
            card.dataset.category === selectedCategory;

          card.hidden = !matches;

          if (matches) {
            visibleCount++;
          }
        });

        if (noProjectsMessage) {
          noProjectsMessage.hidden = visibleCount !== 0;
        }
      });
    });
  }

  // =========================
  // 6. Automatic footer year
  // =========================
  const currentYear = document.querySelector("#current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // =========================
  // 7. Back-to-top button
  // =========================
  const backToTop = document.querySelector("#back-to-top");

  if (backToTop) {
    const updateBackToTop = () => {
      backToTop.hidden = window.scrollY < 400;
    };

    window.addEventListener("scroll", updateBackToTop, {
      passive: true
    });

    updateBackToTop();

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth"
      });
    });
  }
});