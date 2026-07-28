"use strict";

const mfr = require("./markdown-file-reader");

hexo.extend.filter.register("template_locals", function (locals) {
    if (locals?.page?.layout === "post" && locals?.page?.header_callout) {
        const callouts = [...locals.page.header_callout];

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
