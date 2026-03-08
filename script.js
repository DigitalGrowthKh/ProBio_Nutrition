console.log("script.js loaded");

function setupMobileMenuToggle() {
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const desktopNav = document.querySelector(".desktop-nav");

    if (!mobileMenuBtn || !desktopNav) {
        return;
    }

    mobileMenuBtn.addEventListener("click", function () {
        desktopNav.classList.toggle("active");
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

document.addEventListener("DOMContentLoaded", function () {
    setupMobileMenuToggle();
    setupWhatsAppRobot();
});
