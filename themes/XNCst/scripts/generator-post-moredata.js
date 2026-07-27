hexo.extend.filter.register("template_locals", function (locals) {
    if (locals?.page?.layout === "post" && locals?.page?.header_callout) {
        // if (typeof locals.page.tag === "string") {
        //     const tagName = locals.page.tag;
        //     locals.page.tag = {
        //         name: tagName,
        //         intro: getTagIntro(tryGetTagSlug(tagName) + ".md"),
        //     };
        // } else {
        //     locals.page.tag.intro = getTagIntro(
        //         tryGetTagSlug(locals.page.tag) + ".md",
        //     );
        // }

        const callouts = [...locals.page.header_callout];

        // const path = require("path");
        const mfr = require("./markdown-file-reader");

        for (var c of callouts) {
            const content = mfr.mdFileToHTML(
                hexo,
                hexo.source_dir,
                c.detailFilePath,
            );
            if (content) c.content = content;
            else c.content = null;
        }

        locals.page.header_callout = callouts;
    }
    return locals;
});
