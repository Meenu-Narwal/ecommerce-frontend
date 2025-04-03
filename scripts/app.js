document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.querySelector(".hamburger-menu img");
    const navMenu = document.querySelector(".nav-menu");

    menuIcon.addEventListener("click", () => {
        navMenu.style.display = navMenu.style.display === "flex" ? "none" : "flex";
    });
});
