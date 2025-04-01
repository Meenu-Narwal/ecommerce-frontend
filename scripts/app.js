document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav ul');

    hamburgerMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active'); // Toggle the active class
    });
});
