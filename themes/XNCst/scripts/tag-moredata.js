"use strict";

const fs = require("fs");
const path = require("path");

hexo.extend.filter.register("template_locals", function (locals) {
    if (locals.page && locals.page.tag) {
        if (typeof locals.page.tag === "string") {
            const tagName = locals.page.tag;
            locals.page.tag = {
                name: tagName,
                intro: getTagIntro(tryGetTagSlug(tagName) + ".md"),
            };
        } else {
            locals.page.tag.intro = getTagIntro(
                tryGetTagSlug(locals.page.tag) + ".md",
            );
        }
    }
    return locals;
});

function tryGetTagSlug(originTagName) {
    if (hexo.config.tag_map)
        return hexo.config?.tag_map[originTagName] || originTagName;
    else return originTagName;
}

function getTagIntro(fileName) {
    const introDir = path.join(
        hexo.source_dir,
        hexo.config?.introduction_folder?.tag || "_tag-intros",
    );
    const filePath = path.join(introDir, fileName);
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, "utf8");
            const contentWithoutFrontmatter = content.replace(
                /^---\n[\s\S]*?\n---\n/,
                "",
            );
            const renderedContent = hexo.render.renderSync({
                text: contentWithoutFrontmatter,
                engine: "markdown",
            });
            return renderedContent;
        } else logWarning(`NO TAG Introduction File named of ${fileName}`);
    } catch (err) {
        logError(`NO Tag Introduction File named of ${fileName}`);
    }
    return null;
}

const colors = {
    white: "\x1b[37m",
    black: "\x1b[30m",
    yellow: "\x1b[33m",
    bgRed: "\x1b[41m",
    bgYellow: "\x1b[43m",
    bold: "\x1b[1m",
    reset: "\x1b[0m",
};
function logError(message) {
    console.log(
        `${colors.bgRed}${colors.white} ERROR ${colors.reset} ${colors.white}${message}${colors.reset}`,
    );
}
function logWarning(message) {
    console.log(
        `${colors.bgYellow}${colors.black} WARNING ${colors.reset} ${colors.yellow}${message}${colors.reset}`,
    );
}
