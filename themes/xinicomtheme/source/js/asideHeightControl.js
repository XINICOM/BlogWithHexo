let targets = document.querySelectorAll(".aside-height-control-target");

if (targets.length > 0) {
    let topElement = document.querySelectorAll(".aside-resize-top");
    let bottomElement = document.querySelectorAll(".aside-resize-bottom");
    let ResizeTop =
        topElement.length > 0
            ? topElement[0].getBoundingClientRect().height
            : 0;

    let WindowHeight = window.innerHeight;

    window.addEventListener("scroll", TargetResize);
    window.addEventListener("load", () => {
        CalculateTargetAndRely();
        TargetResize();
    });
    window.addEventListener("resize", () => {
        CalculateTargetAndRely();
        TargetResize();
    });

    function CalculateTargetAndRely() {
        targets = document.querySelectorAll(".aside-height-control-target");

        topElement = document.querySelectorAll(".aside-resize-top");
        bottomElement = document.querySelectorAll(".aside-resize-bottom");
        ResizeTop =
            topElement.length > 0
                ? topElement[0].getBoundingClientRect().height
                : 0;

        WindowHeight = window.innerHeight;
    }
    function TargetResize() {
        const scrollY = window.pageYOffset;

        let setHeight = "calc(100vh - 5rem)";
        if (scrollY < ResizeTop) {
            setHeight = `calc(100vh - 5rem - ${ResizeTop}px + ${scrollY}px)`;
        }
        if (bottomElement.length > 0) {
            const bottomOffset = bottomElement[0].getBoundingClientRect().top;
            if (bottomOffset < WindowHeight) {
                setHeight = `calc(${bottomOffset}px - 5rem)`;
            }
        }

        targets.forEach((t) => (t.style.height = setHeight));
    }
}
