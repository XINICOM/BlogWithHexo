const navBtn = document.getElementById('navbtn');
const navBar = document.getElementById('navbar');
const navMenu = document.getElementById('navmenu');
const navIcon = document.getElementById('navicon');
const navComponent = document.getElementById('navcomponent');
const main = document.querySelector('main');

let isNavMenuOpen = false;

function toggleMenu() {
    if (!isNavMenuOpen) {
        navMenu.classList.remove('hidden');
        navMenu.classList.add('flex');
        navComponent.classList.add('min-h-screen');

        navBar.classList.remove('color-transparent');
        navBar.classList.add('color-solid');

        navIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M6 18L18 6M6 6l12 12"/>';

        document.body.classList.remove('overflow-auto');
        document.body.classList.add('overflow-hidden');
    } else {
        navMenu.classList.remove('flex');
        navMenu.classList.add('hidden');
        navComponent.classList.remove('min-h-screen');

        navBar.classList.remove('color-solid');
        navBar.classList.add('color-transparent');

        navIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4" d="M4 6h16M4 12h16M4 18h16" />';
        document.body.classList.remove('overflow-hidden');
        document.body.classList.add('overflow-auto');
    }
    isNavMenuOpen = !isNavMenuOpen;
}

function closeMenu() {
    if (isNavMenuOpen) toggleMenu();
}

navBtn.addEventListener('click', toggleMenu);

document.querySelectorAll('#navmenu a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
});

window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && isNavMenuOpen) {
        closeMenu();
    }
});