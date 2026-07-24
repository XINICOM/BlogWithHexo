const CopyIcon =
    '<svg width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

const CopiedIcon =
    '<svg width="1rem" height="1rem" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.0498 3.92579L8.49512 12.3818C8.25774 12.6881 8.04517 12.9645 7.84668 13.1689C7.63957 13.3823 7.38732 13.5841 7.04492 13.6719C6.86373 13.7183 6.6757 13.7346 6.48926 13.7197C6.13666 13.6915 5.8528 13.5355 5.6123 13.3604C5.38201 13.1926 5.12573 12.9567 4.83984 12.6953L1.03125 9.21289L1.96875 8.1875L5.77734 11.6699C6.08684 11.9529 6.27773 12.1249 6.43066 12.2363C6.50183 12.2882 6.54699 12.3135 6.57324 12.3252C6.58525 12.3305 6.59269 12.3322 6.5957 12.333C6.59802 12.3336 6.59961 12.334 6.59961 12.334C6.63317 12.3367 6.66758 12.3335 6.7002 12.3252C6.7002 12.3252 6.70211 12.3251 6.7041 12.3242C6.70698 12.3229 6.71348 12.319 6.72461 12.3115C6.74849 12.2956 6.78843 12.2642 6.84961 12.2012C6.98138 12.0654 7.13957 11.8628 7.39648 11.5313L13.9502 3.07422L15.0498 3.92579Z" fill="currentColor"></path></svg>';

const CopyErrorIcon =
    '<svg width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4L20 20M20 4L4 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

document.querySelectorAll('pre[need-line-numbers="true"]').forEach((pre) => {
    const codeSection = document.createElement("section");
    codeSection.classList.add("code-section");
    // FRAME > VIEW
    const code = pre.querySelector("code");
    if (!code) return;
    const lines = code.innerHTML.split("\n");
    if (lines[lines.length - 1] === "") lines.pop();
    const codeFrame = document.createElement("div");
    codeFrame.classList.add("code-frame");
    const codeView = document.createElement("div");
    codeView.classList.add("code-view");
    const codeLineNumbers = document.createElement("div");
    codeLineNumbers.classList.add("code-numbders");
    const codeContent = document.createElement("div");
    codeContent.classList.add("code-content");
    const codeContentPre = document.createElement("pre");
    codeContentPre.classList.add("code-content-pre");
    const codeContentCode = document.createElement("code");
    codeContentCode.classList = code.classList;
    codeContentCode.classList.add("code-content-code");
    const hlLines = pre.getAttribute("highlight-lines");
    let hlLineIndexs;
    if (hlLines) {
        const hlArgs = hlLines.split(" ");
        if (hlArgs[hlArgs.length - 1 === ""]) hlArgs.pop();
        hlLineIndexs = hlArgs.map(Number);
    }
    lines.forEach((line, index) => {
        const span = document.createElement("div");
        span.classList.add("code-content-line");
        span.innerHTML = line;
        const num = document.createElement("div");
        num.classList.add("code-numbers-num");
        num.textContent = index + 1;
        if (hlLineIndexs.includes(index + 1)) {
            span.classList.add("code-line-highlight");
            num.classList.add("code-line-highlight");
        }
        codeContentCode.appendChild(span);
        codeLineNumbers.appendChild(num);
    });
    codeContentPre.appendChild(codeContentCode);
    codeContent.appendChild(codeContentPre);
    codeView.appendChild(codeLineNumbers);
    codeView.appendChild(codeContent);
    codeFrame.appendChild(codeView);
    // HEADER
    const codeHeader = document.createElement("header");
    codeHeader.classList.add("code-header");
    const codeHeaderLeft = document.createElement("div");
    codeHeaderLeft.classList.add("code-header-left");
    const codeHeaderRight = document.createElement("div");
    codeHeaderRight.classList.add("code-header-right");
    // LEFT: FILENAME
    if (pre.hasAttribute("file-name")) {
        const fn = pre.getAttribute("file-name");
        if (fn && fn.trim() !== "") {
            const codeHL_Filename = document.createElement("div");
            codeHL_Filename.classList.add("code-header-filename");
            codeHL_Filename.textContent = fn;
            codeHeaderLeft.appendChild(codeHL_Filename);
        }
    }

    // RIGHT: LANG
    const codeHR_Language = document.createElement("div");
    codeHR_Language.classList.add("code-header-language");
    const _langClass = Array.from(code.classList).find((x) =>
        x.startsWith("language-"),
    );
    let language = _langClass
        ? _langClass.replace("language-", "")
        : "Plain Text";
    // if (language.toLowerCase() === "csharp") language = "C#";
    codeHR_Language.textContent = language;
    // RIGHT: COPY-BTN
    const codeHR_CopyBtn = document.createElement("button");
    codeHR_CopyBtn.classList.add("code-header-copy-btn");
    codeHR_CopyBtn.innerHTML = CopyIcon;
    codeHR_CopyBtn.addEventListener("click", async function () {
        try {
            await navigator.clipboard.writeText(code.textContent);
            codeHR_CopyBtn.innerHTML = CopiedIcon;
            setTimeout(() => {
                codeHR_CopyBtn.innerHTML = CopyIcon;
            }, 2000);
        } catch (ex) {
            console.error("ERROR IN COPY THE CODE", ex);
            codeHR_CopyBtn.innerHTML = CopyErrorIcon;
            setTimeout(() => {
                codeHR_CopyBtn.innerHTML = CopyIcon;
            }, 2000);
        }
    });

    codeHeaderRight.appendChild(codeHR_Language);
    codeHeaderRight.appendChild(codeHR_CopyBtn);

    codeHeader.appendChild(codeHeaderLeft);
    codeHeader.appendChild(codeHeaderRight);
    // SECTION
    codeSection.appendChild(codeHeader);
    codeSection.appendChild(codeFrame);
    pre.replaceWith(codeSection);
});
