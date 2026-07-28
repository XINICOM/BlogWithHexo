"use strict";

const path = require("path");
const mfr = require("./markdown-file-reader");

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
    return mfr.mdFileToHTML(hexo, introDir, fileName);
}
