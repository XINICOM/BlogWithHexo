"use strict";

const cheerio = require("cheerio");

hexo.extend.filter.register("after_post_render", function (data) {
    if (!data.content) return data;
    const $ = cheerio.load(data.content);
    $("blockquote").each((index, element) => {
        const $blockquote = $(element);
        const $firstP = $blockquote.find("p").first();
        if ($firstP.length === 0) return;
        const firstHtml = $firstP.html() || "";
        const match = firstHtml.match(
            /^\[!(note|tip|important|warning|caution)\]\s*/,
        );
        if (!match) return;
        const type = match[1];
        const rest = firstHtml.replace(
            /^\[!(note|tip|important|warning|caution)\]\s*/,
            "",
        );
        const brIndex = rest.indexOf("<br>");
        let titleContent = "";
        let bodyContent = "";
        if (brIndex !== -1) {
            titleContent = rest.substring(0, brIndex).trim();
            bodyContent = rest.substring(brIndex + 4);
        } else {
            titleContent = rest.trim();
            bodyContent = "";
        }
        $firstP.remove();
        const remainingHtml = $blockquote.html() || "";
        let newContent = "";
        if (bodyContent.trim()) {
            newContent += `<p>${bodyContent}</p>`;
        }
        if (remainingHtml.trim()) {
            newContent += remainingHtml;
        }
        const calloutHtml = `<div class="callout ${type}"><div class="callout-title">${titleContent || type.toUpperCase()}</div><div class="callout-content">${newContent}</div></div>`;
        $blockquote.replaceWith(calloutHtml);
    });
    data.content = $.html();
    return data;
});
