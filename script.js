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

document.addEventListener("DOMContentLoaded", function () {
    setupMobileMenuToggle();
    setupWhatsAppRobot();
    highlightActiveLink();
});
