const CONFIG = {
    tags: ["h1", "h2", "h3"],
    tocContainer_Class: "toc",
    content_Attribute: "tocSource",
    safety_scroll_offset: 1,
};

let baseIndent = 10;
CONFIG.tags.forEach((x) => {
    const tagIndent = parseInt(x.substring(1), 10);
    if (tagIndent < baseIndent) baseIndent = tagIndent;
});

const containers = document.querySelectorAll(`.${CONFIG.tocContainer_Class}`);
const content = document.querySelector(`article[${CONFIG.content_Attribute}]`);
if (containers.length > 0 && content) {
    const headers = content.querySelectorAll(CONFIG.tags.join(","));
    if (headers) {
        let tocHTML = "";
        headers.forEach((h, index) => {
            let id = h.id;
            if (!id) {
                id = h.textContent
                    .trim()
                    .toLowerCase()
                    .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
                    .replace(/^-+|-+$/g, "");
                if (!id) id = `section-${index}`;
                h.id = id;
            }
            const indent = parseInt(h.tagName.substring(1), 10) - baseIndent;
            tocHTML += `<a href="#${id}" class="toc-item level-${indent}" style="padding-left: ${indent * 1.2}rem">${h.textContent.trim()}</a>`;
        });

        containers.forEach((c) => {
            c.innerHTML = tocHTML;

            const tocLinks = c.querySelectorAll(".toc-item");
            tocLinks.forEach((a) => {
                a.addEventListener("click", function (e) {
                    e.preventDefault();
                    const targetId = a.getAttribute("href").substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (!targetElement) return;
                    const targetPosition =
                        targetElement.getBoundingClientRect().top +
                        window.pageYOffset -
                        (window.innerWidth > 1024 ? 80 : 64);

                    window.scrollTo({
                        top: targetPosition,
                        behavior: "smooth",
                    });
                    closeMenu();
                });
            });
        });

        window.addEventListener("scroll", OnScroll, { passive: true });
        window.addEventListener("load", () => {
            updateActiveLink(headers, containers);
        });
        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                updateActiveLink(headers, containers);
            }, 100);
        });
        let ticking = false;
        function OnScroll() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateActiveLink(headers, containers);
                    ticking = false;
                });
                ticking = true;
            }
        }
    }
}

function updateActiveLink(headers, containers) {
    containers.forEach((c) => {
        const links = c.querySelectorAll(".toc-item");

        let currentIndex = -1;
        const scrollY =
            window.pageYOffset +
            (window.innerWidth > 1024 ? 80 : 64) +
            CONFIG.safety_scroll_offset;

        if (!headers || links.length <= 0) return;
        for (let i = headers.length - 1; i >= 0; i--) {
            const h = headers[i];
            const rect = h.getBoundingClientRect();
            const top = rect.top + window.pageYOffset;
            if (top <= scrollY) {
                currentIndex = i;
                break;
            }
        }

        if (currentIndex === -1) currentIndex = 0;

        links.forEach((a, index) => {
            if (index === currentIndex) {
                a.classList.add("toc-active");
            } else {
                a.classList.remove("toc-active");
            }
        });
    });
}
