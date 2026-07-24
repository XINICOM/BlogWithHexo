const key = "site-theme";
const htmlElement = document.documentElement;
document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
        document
            .querySelectorAll(".theme-btn")
            .forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        const theme = this.dataset.theme;
        applyTheme(theme);
        localStorage.setItem(key, theme);
    });
});
(function initTheme() {
    const saved = localStorage.getItem(key);
    if (saved) {
        applyTheme(saved);
        document
            .querySelectorAll(".theme-btn")
            .forEach((b) => b.classList.remove("active"));
        document.querySelectorAll(".theme-btn").forEach((b) => {
            if (b.dataset.theme === saved) b.classList.add("active");
        });
        return;
    }
    const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
    localStorage.setItem(key, "system");
})();
function applyTheme(theme) {
    if (theme === "dark") {
        htmlElement.classList.add("dark");
    } else if (theme === "light") {
        htmlElement.classList.remove("dark");
    } else {
        const prefersDark =
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches;
        applyTheme(prefersDark ? "dark" : "light");
    }
}
const mq = window.matchMedia("(prefers-color-scheme: dark)");
mq.addEventListener?.("change", (e) => {
    if (!localStorage.getItem(key) || localStorage.getItem(key) === "system")
        applyTheme(e.matches ? "dark" : "light");
});
