// Project Deployment Guide JavaScript - Fixed Version
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functionality
  initThemeToggle();
  initMobileMenu();
  initCopyToClipboard();
  initSmoothScrolling();
  initActiveNavigation();
  initTroubleshootingSearch();
  initBackToTop();
  initKeyboardNavigation();
  initPerformanceOptimizations();

  console.log("🚀 Deployment Guide loaded successfully!");
});

// Theme Toggle Functionality - FIXED
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  const mobileThemeToggle = document.getElementById("mobile-theme-toggle");
  const nav = document.getElementById("nav");
  const hero = document.getElementById("hero");
  const html = document.documentElement;

  // Get saved theme or default to dark
  const savedTheme = localStorage.getItem("theme") || "dark";

  // Apply initial theme
  setTheme(savedTheme);

  // Desktop theme toggle
  if (themeToggle) {
    themeToggle.addEventListener("click", function (e) {
      e.preventDefault();
      const currentTheme = html.getAttribute("data-color-scheme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(newTheme);
    });
  }

  // Mobile theme toggle
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener("click", function (e) {
      e.preventDefault();
      const currentTheme = html.getAttribute("data-color-scheme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(newTheme);
    });
  }

  function setTheme(theme) {
    html.setAttribute("data-color-scheme", theme);
    document.body.setAttribute("data-color-scheme", theme);
    localStorage.setItem("theme", theme);
    updateThemeIcons(theme);

    // Apply theme to body classes for better compatibility
    if (theme === "light") {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");

      // Nav → plain white
      nav.classList.remove(
        "bg-gray-800/95",
        "backdrop-blur-sm",
        "border-gray-700"
      );
      nav.classList.add("bg-white", "border-b", "border-gray-200");

      // Hero → plain cream surface (or white)
      hero.classList.remove(
        "bg-gradient-to-br",
        "from-gray-900",
        "via-gray-800",
        "to-gray-900"
      );
      hero.classList.add("bg-white");
    } else {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");

      // Nav → dark gradient back
      nav.classList.remove("bg-white", "border-gray-200");
      nav.classList.add(
        "bg-gray-800/95",
        "backdrop-blur-sm",
        "border-gray-700"
      );

      // Hero → dark gradient back
      hero.classList.remove("bg-white");
      hero.classList.add(
        "bg-gradient-to-br",
        "from-gray-900",
        "via-gray-800",
        "to-gray-900"
      );
    }

    // Dispatch custom event for theme change
    window.dispatchEvent(
      new CustomEvent("themeChanged", { detail: { theme } })
    );

    console.log("Theme changed to:", theme);
  }

  function updateThemeIcons(theme) {
    const isDark = theme === "dark";

    // Desktop icons
    const themeIconDark = document.getElementById("theme-icon-dark");
    const themeIconLight = document.getElementById("theme-icon-light");
    const themeText = document.getElementById("theme-text");

    if (themeIconDark && themeIconLight && themeText) {
      if (isDark) {
        themeIconDark.classList.remove("hidden");
        themeIconLight.classList.add("hidden");
        themeText.textContent = "Light";
      } else {
        themeIconDark.classList.add("hidden");
        themeIconLight.classList.remove("hidden");
        themeText.textContent = "Dark";
      }
    }

    // Mobile icons
    const mobileThemeIconDark = document.getElementById(
      "mobile-theme-icon-dark"
    );
    const mobileThemeIconLight = document.getElementById(
      "mobile-theme-icon-light"
    );

    if (mobileThemeIconDark && mobileThemeIconLight) {
      if (isDark) {
        mobileThemeIconDark.classList.remove("hidden");
        mobileThemeIconLight.classList.add("hidden");
      } else {
        mobileThemeIconDark.classList.add("hidden");
        mobileThemeIconLight.classList.remove("hidden");
      }
    }
  }
}

// Mobile Menu Toggle
function initMobileMenu() {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", function (e) {
      e.preventDefault();
      const isOpen = !mobileMenu.classList.contains("hidden");
      toggleMobileMenu(!isOpen);
    });

    // Close mobile menu when clicking on links
    const mobileMenuLinks = mobileMenu.querySelectorAll("a");
    mobileMenuLinks.forEach((link) => {
      link.addEventListener("click", function () {
        toggleMobileMenu(false);
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (event) {
      if (
        !mobileMenuButton.contains(event.target) &&
        !mobileMenu.contains(event.target)
      ) {
        toggleMobileMenu(false);
      }
    });

    // Close mobile menu on escape key
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !mobileMenu.classList.contains("hidden")) {
        toggleMobileMenu(false);
      }
    });
  }

  function toggleMobileMenu(open) {
    const icon = mobileMenuButton.querySelector("svg path");

    if (open) {
      mobileMenu.classList.remove("hidden");
      icon.setAttribute("d", "M6 18L18 6M6 6l12 12");
      mobileMenuButton.setAttribute("aria-expanded", "true");
    } else {
      mobileMenu.classList.add("hidden");
      icon.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
      mobileMenuButton.setAttribute("aria-expanded", "false");
    }
  }
}

// Copy to Clipboard Functionality - FIXED
function initCopyToClipboard() {
  const copyButtons = document.querySelectorAll(".copy-btn");

  copyButtons.forEach((button) => {
    button.addEventListener("click", async function (e) {
      e.preventDefault();
      const code = this.getAttribute("data-code");

      if (!code) {
        console.warn("No code found for copy button");
        return;
      }

      try {
        await navigator.clipboard.writeText(code);
        showCopySuccess(this);
        trackEvent("code_copied", { snippet_length: code.length });
      } catch (err) {
        console.warn("Clipboard API failed, using fallback:", err);
        // Fallback for older browsers
        fallbackCopyTextToClipboard(code, this);
      }
    });

    // Add keyboard support
    button.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.click();
      }
    });
  });
}

function showCopySuccess(button) {
  const originalText = button.textContent;
  button.textContent = "Copied!";
  button.classList.add("copied");

  // Show visual feedback
  button.style.transform = "scale(0.95)";
  setTimeout(() => {
    button.style.transform = "";
  }, 150);

  setTimeout(() => {
    button.textContent = originalText;
    button.classList.remove("copied");
  }, 2000);

  console.log("Copy success feedback shown");
}

function fallbackCopyTextToClipboard(text, button) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      showCopySuccess(button);
    } else {
      throw new Error("Copy command failed");
    }
  } catch (err) {
    console.error("Fallback: Unable to copy", err);
    button.textContent = "Copy failed";
    button.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
    button.style.color = "#ef4444";

    setTimeout(() => {
      button.textContent = "Copy";
      button.style.backgroundColor = "";
      button.style.color = "";
    }, 2000);
  }

  document.body.removeChild(textArea);
}

// Smooth Scrolling Navigation
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Skip if it's just "#" or external link
      if (href === "#" || href.startsWith("http")) {
        return;
      }

      e.preventDefault();

      const targetSection = document.querySelector(href);

      if (targetSection) {
        const headerOffset = 80; // Account for fixed header
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Update URL without triggering scroll
        history.pushState(null, null, href);

        // Focus management for accessibility
        setTimeout(() => {
          targetSection.setAttribute("tabindex", "-1");
          targetSection.focus();
          targetSection.removeAttribute("tabindex");
        }, 500);

        trackEvent("navigation_used", { target: href });
      }
    });
  });
}

// Active Navigation Highlighting
function initActiveNavigation() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  // Create intersection observer for better performance
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -35% 0px",
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        updateActiveNav(id);
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });

  function updateActiveNav(activeId) {
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${activeId}`) {
        link.classList.add("active");
      }
    });
  }

  // Handle initial load with hash
  if (window.location.hash) {
    const initialSection = document.querySelector(window.location.hash);
    if (initialSection) {
      setTimeout(() => {
        initialSection.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }
}

// Troubleshooting Search Functionality - FIXED
function initTroubleshootingSearch() {
  const searchInput = document.getElementById("troubleshooting-search");
  const troubleshootingTable = document.getElementById("troubleshooting-table");

  if (searchInput && troubleshootingTable) {
    const troubleshootingRows = troubleshootingTable.querySelectorAll(
      "tr.troubleshooting-row"
    );
    let searchTimeout;

    console.log("Search initialized with", troubleshootingRows.length, "rows");

    searchInput.addEventListener("input", function (e) {
      const searchTerm = this.value.toLowerCase().trim();
      console.log("Searching for:", searchTerm);

      // Debounce search for better performance
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        performSearch(searchTerm, troubleshootingRows);
      }, 150);
    });

    // Clear search on escape key
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        this.value = "";
        performSearch("", troubleshootingRows);
        hideNoResultsMessage();
        this.blur();
      }
    });

    // Enhanced placeholder functionality
    searchInput.addEventListener("focus", function () {
      this.placeholder = "Type to search issues and solutions...";
    });

    searchInput.addEventListener("blur", function () {
      if (this.value === "") {
        this.placeholder = "Search for issues...";
      }
    });
  }

  function performSearch(searchTerm, rows) {
    let visibleCount = 0;

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length >= 2) {
        const issue = cells[0].textContent.toLowerCase();
        const resolution = cells[1].textContent.toLowerCase();

        const isMatch =
          searchTerm === "" ||
          issue.includes(searchTerm) ||
          resolution.includes(searchTerm);

        if (isMatch) {
          row.style.display = "";
          row.classList.remove("hidden");
          visibleCount++;

          // Highlight matching text
          if (searchTerm !== "") {
            highlightText(cells[0], searchTerm);
            highlightText(cells[1], searchTerm);
          } else {
            removeHighlight(cells[0]);
            removeHighlight(cells[1]);
          }
        } else {
          row.style.display = "none";
          row.classList.add("hidden");
        }
      }
    });

    console.log("Search results:", visibleCount, "visible rows");

    // Show/hide no results message
    if (visibleCount === 0 && searchTerm !== "") {
      showNoResultsMessage();
    } else {
      hideNoResultsMessage();
    }

    // Track search usage
    if (searchTerm !== "") {
      trackEvent("troubleshooting_searched", {
        search_term: searchTerm.substring(0, 20),
        results_count: visibleCount,
      });
    }
  }

  function highlightText(element, searchTerm) {
    // Store original text if not already stored
    if (!element.dataset.originalText) {
      element.dataset.originalText = element.textContent;
    }

    const originalText = element.dataset.originalText;
    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, "gi");
    const highlightedText = originalText.replace(
      regex,
      '<mark style="background-color: #fef08a; color: #92400e; padding: 2px 4px; border-radius: 3px;">$1</mark>'
    );
    element.innerHTML = highlightedText;
  }

  function removeHighlight(element) {
    if (element.dataset.originalText) {
      element.innerHTML = element.dataset.originalText;
    }
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

function showNoResultsMessage() {
  const troubleshootingTable = document.getElementById("troubleshooting-table");

  // Remove existing no results message
  hideNoResultsMessage();

  const noResultsRow = document.createElement("tr");
  noResultsRow.className = "no-results-row";
  noResultsRow.innerHTML = `
        <td colspan="2" class="px-6 py-8 text-center text-gray-400">
            <div class="flex flex-col items-center space-y-3">
                <svg class="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.39 0-4.5-1.043-5.966-2.709A7.962 7.962 0 014 9.5C4 5.358 7.358 2 11.5 2S19 5.358 19 9.5c0 1.793-.624 3.44-1.666 4.741L21.5 18.5 18.5 21.5l-4.25-4.25z"/>
                </svg>
                <div>
                    <p class="text-lg font-medium text-gray-300">No results found</p>
                    <p class="text-sm mt-1">Try searching with different keywords or <button class="text-teal-400 hover:text-teal-300 underline cursor-pointer" onclick="clearSearch()">clear your search</button></p>
                </div>
            </div>
        </td>
    `;
  troubleshootingTable.appendChild(noResultsRow);
}

function hideNoResultsMessage() {
  const existingMessage = document.querySelector(".no-results-row");
  if (existingMessage) {
    existingMessage.remove();
  }
}

function clearSearch() {
  const searchInput = document.getElementById("troubleshooting-search");
  if (searchInput) {
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("input"));
    searchInput.focus();
  }
}

// Back to Top Functionality - FIXED
function initBackToTop() {
  const backToTopButton = document.createElement("button");
  backToTopButton.innerHTML = `
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
        </svg>
    `;
  backToTopButton.className =
    "back-to-top fixed bottom-8 right-8 bg-teal-500 hover:bg-teal-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 pointer-events-none z-50 cursor-pointer";
  backToTopButton.setAttribute("aria-label", "Back to top");
  backToTopButton.setAttribute("title", "Back to top");
  backToTopButton.style.transform = "translateY(100px)";

  document.body.appendChild(backToTopButton);

  console.log("Back to top button created");

  // Show/hide back to top button on scroll
  let scrollTimeout;
  window.addEventListener("scroll", function () {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (window.pageYOffset > 300) {
        backToTopButton.style.opacity = "1";
        backToTopButton.style.pointerEvents = "auto";
        backToTopButton.style.transform = "translateY(0)";
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.style.opacity = "0";
        backToTopButton.style.pointerEvents = "none";
        backToTopButton.style.transform = "translateY(100px)";
        backToTopButton.classList.remove("visible");
      }
    }, 100);
  });

  // Scroll to top when clicked
  backToTopButton.addEventListener("click", function (e) {
    e.preventDefault();
    console.log("Back to top clicked");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Focus management
    setTimeout(() => {
      const firstFocusable = document.querySelector(
        'a, button, input, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }, 500);

    trackEvent("back_to_top_used");
  });

  // Keyboard support
  backToTopButton.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      backToTopButton.click();
    }
  });
}

// Keyboard Navigation Support
function initKeyboardNavigation() {
  // Navigate sections with arrow keys when focused on table of contents
  document.addEventListener("keydown", function (e) {
    if (e.target.classList.contains("toc-item")) {
      const tocItems = Array.from(document.querySelectorAll(".toc-item"));
      const currentIndex = tocItems.indexOf(e.target);

      if (e.key === "ArrowDown" && currentIndex < tocItems.length - 1) {
        e.preventDefault();
        tocItems[currentIndex + 1].focus();
      } else if (e.key === "ArrowUp" && currentIndex > 0) {
        e.preventDefault();
        tocItems[currentIndex - 1].focus();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.target.click();
      }
    }

    // Quick search shortcut (Ctrl/Cmd + K)
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      const searchInput = document.getElementById("troubleshooting-search");
      if (searchInput) {
        searchInput.focus();
        searchInput.select();

        // Scroll to troubleshooting section
        const troubleshootingSection =
          document.getElementById("troubleshooting");
        if (troubleshootingSection) {
          troubleshootingSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    }

    // Navigate between troubleshooting rows with arrow keys
    if (e.target.classList.contains("troubleshooting-row")) {
      const visibleRows = Array.from(
        document.querySelectorAll(".troubleshooting-row:not(.hidden)")
      );
      const currentIndex = visibleRows.indexOf(e.target);

      if (e.key === "ArrowDown" && currentIndex < visibleRows.length - 1) {
        e.preventDefault();
        visibleRows[currentIndex + 1].focus();
      } else if (e.key === "ArrowUp" && currentIndex > 0) {
        e.preventDefault();
        visibleRows[currentIndex - 1].focus();
      }
    }
  });

  // Make troubleshooting rows focusable
  const troubleshootingRows = document.querySelectorAll(".troubleshooting-row");
  troubleshootingRows.forEach((row) => {
    row.setAttribute("tabindex", "0");
    row.setAttribute("role", "button");
  });
}

// Performance Optimizations
function initPerformanceOptimizations() {
  // Lazy load images when they come into view
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
              imageObserver.unobserve(img);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    const lazyImages = document.querySelectorAll("img[data-src]");
    lazyImages.forEach((img) => imageObserver.observe(img));

    // Animate sections on scroll
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            sectionObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // Only animate sections if user prefers motion
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("section").forEach((section) => {
        section.classList.add("animate-in");
        sectionObserver.observe(section);
      });
    }
  }

  // Preload critical resources
  const criticalLinks = document.querySelectorAll('a[href^="#"]');
  criticalLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        // Preload any images in the target section
        const images = targetSection.querySelectorAll("img[data-src]");
        images.forEach((img) => {
          if (img.dataset.src) {
            const preloadImg = new Image();
            preloadImg.src = img.dataset.src;
          }
        });
      }
    });
  });
}

// Analytics and Tracking
function trackEvent(eventName, properties = {}) {
  // Enhanced tracking with more context
  const eventData = {
    event: eventName,
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
    userAgent: navigator.userAgent,
    theme: document.documentElement.getAttribute("data-color-scheme"),
    ...properties,
  };

  // Log to console in development
  console.log("📊 Event tracked:", eventData);
}

// Error Handling and Monitoring
window.addEventListener("error", function (e) {
  console.error("Application error:", e.error);
  trackEvent("javascript_error", {
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
    colno: e.colno,
  });
});

window.addEventListener("unhandledrejection", function (e) {
  console.error("Unhandled promise rejection:", e.reason);
  trackEvent("unhandled_promise_rejection", {
    reason: e.reason?.toString() || "Unknown",
  });
});

// Theme change listener for external integrations
window.addEventListener("themeChanged", function (e) {
  trackEvent("theme_changed", { new_theme: e.detail.theme });
});

// Page visibility API for performance monitoring
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    trackEvent("page_hidden");
  } else {
    trackEvent("page_visible");
  }
});

// Connection status monitoring
window.addEventListener("online", () => trackEvent("connection_online"));
window.addEventListener("offline", () => trackEvent("connection_offline"));

// Utility functions
const utils = {
  debounce: function (func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle: function (func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  isInViewport: function (element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
};

// Export utils for potential external use
window.DeploymentGuideUtils = utils;

// Make clearSearch globally available
window.clearSearch = clearSearch;
