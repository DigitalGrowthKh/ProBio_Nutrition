console.log("script.js loaded");

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

document.addEventListener("DOMContentLoaded", function () {
    setupMobileMenuToggle();
    setupWhatsAppRobot();
    highlightActiveLink();
    renderFaqFromSchema();
});
