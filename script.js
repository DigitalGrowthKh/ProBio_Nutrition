console.log("script.js loaded");

const THEME_STORAGE_KEY = "probio-theme";

function getStoredTheme() {
    try {
        return localStorage.getItem(THEME_STORAGE_KEY);
    } catch (error) {
        return null;
    }
}

function getPreferredTheme() {
    const storedTheme = getStoredTheme();

    if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
}

function updateThemeToggleButtons(theme) {
    const isDarkTheme = theme === "dark";
    const toggleButtons = document.querySelectorAll(".theme-toggle-btn");

    toggleButtons.forEach(function (button) {
        button.setAttribute("aria-pressed", String(isDarkTheme));
        button.setAttribute("aria-label", isDarkTheme ? "Switch to light mode" : "Switch to dark mode");

        const icon = button.querySelector("i");

        if (!icon) {
            return;
        }

        icon.classList.toggle("fa-moon", !isDarkTheme);
        icon.classList.toggle("fa-sun", isDarkTheme);
    });
}

function setTheme(theme, persistPreference) {
    applyTheme(theme);
    updateThemeToggleButtons(theme);

    if (!persistPreference) {
        return;
    }

    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
        // Ignore storage errors (private browsing, disabled storage, etc.).
    }
}

function setupThemeToggle() {
    const toggleButtons = document.querySelectorAll(".theme-toggle-btn");

    if (toggleButtons.length === 0) {
        return;
    }

    toggleButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
            const nextTheme = currentTheme === "dark" ? "light" : "dark";
            setTheme(nextTheme, true);
        });
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    mediaQuery.addEventListener("change", function (event) {
        const storedTheme = getStoredTheme();

        if (storedTheme === "light" || storedTheme === "dark") {
            return;
        }

        setTheme(event.matches ? "dark" : "light", false);
    });
}

function setupMobileMenuToggle() {
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const desktopNav = document.querySelector(".desktop-nav");
    const menuIcon = mobileMenuBtn ? mobileMenuBtn.querySelector("i") : null;

    if (!mobileMenuBtn || !desktopNav) {
        return;
    }

    mobileMenuBtn.addEventListener("click", function () {
        desktopNav.classList.toggle("active");

        if (!menuIcon) {
            return;
        }

        if (desktopNav.classList.contains("active")) {
            menuIcon.classList.remove("fa-bars");
            menuIcon.classList.add("fa-xmark");
        } else {
            menuIcon.classList.remove("fa-xmark");
            menuIcon.classList.add("fa-bars");
        }
    });
}

function setupWhatsAppRobot() {
    const whatsappRobot = document.getElementById("whatsapp-robot");

    if (!whatsappRobot) {
        return;
    }

    whatsappRobot.addEventListener("click", function () {
        window.open(
            "https://wa.me/27637720586?text=Hi%20Igor,%20I%20would%20like%20to%20book%20a%20consultation.",
            "_blank"
        );
    });
}

function setupStickyHeaderOnScroll() {
    const header = document.querySelector("header");

    if (!header) {
        return;
    }

    function updateHeaderState() {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", updateHeaderState, { passive: true });
    updateHeaderState();
}

function highlightActiveLink() {
    const desktopNavLinks = document.querySelectorAll(".desktop-nav a");
    const currentUrl = window.location.href.toLowerCase();
    const currentPath = window.location.pathname.toLowerCase();
    const currentFileName = currentPath.split("/").pop() || "index.html";

    desktopNavLinks.forEach(function (link) {
        const href = (link.getAttribute("href") || "").toLowerCase();

        if (!href || href.startsWith("http")) {
            return;
        }

        const hrefPath = href.split("#")[0].split("?")[0];
        const hrefFileName = hrefPath.split("/").pop();
        const isIncludedInUrl = currentUrl.includes(href);
        const isSameFile = hrefFileName && hrefFileName === currentFileName;

        if (isIncludedInUrl || isSameFile) {
            link.classList.add("active");
        }
    });
}

function renderFaqFromSchema() {
    const faqList = document.getElementById("faq-list");

    if (!faqList) {
        return;
    }

    const schemaScripts = document.querySelectorAll('script[type="application/ld+json"]');
    let faqSchema = null;

    schemaScripts.forEach(function (scriptElement) {
        if (faqSchema) {
            return;
        }

        try {
            const parsedSchema = JSON.parse(scriptElement.textContent);

            if (parsedSchema && parsedSchema["@type"] === "FAQPage" && Array.isArray(parsedSchema.mainEntity)) {
                faqSchema = parsedSchema;
            }
        } catch (error) {
            console.warn("Unable to parse JSON-LD schema.", error);
        }
    });

    if (!faqSchema) {
        return;
    }

    // Static HTML is already present — skip JS rendering to preserve it.
    if (faqList.children.length > 0) {
        return;
    }

    faqList.innerHTML = "";

    faqSchema.mainEntity.forEach(function (item) {
        const question = item && item.name;
        const answer = item && item.acceptedAnswer && item.acceptedAnswer.text;

        if (!question || !answer) {
            return;
        }

        const article = document.createElement("article");
        article.className = "service-card";

        const details = document.createElement("details");
        details.className = "faq-item";

        const summary = document.createElement("summary");
        summary.textContent = question;

        const paragraph = document.createElement("p");
        paragraph.textContent = answer;

        details.appendChild(summary);
        details.appendChild(paragraph);
        article.appendChild(details);
        faqList.appendChild(article);
    });
}

function setupScrollReveal() {
    const hiddenElements = document.querySelectorAll(".hidden");

    if (hiddenElements.length === 0) {
        return;
    }

    // Fallback: reveal immediately when IntersectionObserver is unavailable.
    if (!("IntersectionObserver" in window)) {
        hiddenElements.forEach(function (element) {
            element.classList.add("show");
        });
        return;
    }

    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -8% 0px"
    };

    // Reveal each element once, then stop observing for better performance.
    const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("show");
            observer.unobserve(entry.target);
        });
    }, observerOptions);

    hiddenElements.forEach(function (element) {
        revealObserver.observe(element);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    setTheme(getPreferredTheme(), false);
    setupThemeToggle();
    setupStickyHeaderOnScroll();
    setupMobileMenuToggle();
    setupWhatsAppRobot();
    highlightActiveLink();
    renderFaqFromSchema();
    setupScrollReveal();
});
