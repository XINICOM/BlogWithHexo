"use strict";

const cheerio = require("cheerio");
const CONFIG = hexo?.config?.simple_callout || {};
CONFIG.keywords = CONFIG?.keywords || [
    "note",
    "tip",
    "important",
    "warning",
    "caution",
];

hexo.extend.filter.register("after_post_render", function (data) {
    if (!data.content) return data;
    const $ = cheerio.load(data.content);
    $("blockquote").each((index, bq) => {
        const $blockquote = $(bq);
        const calloutHtml = calloutConverter($, $blockquote);
        if (calloutHtml) $blockquote.replaceWith(calloutHtml);
    });
    data.content = $.html();
    return data;
});

function calloutConverter($, $blockquote) {
    const $childBQs = $blockquote.find("blockquote");
    if ($childBQs?.length > 0)
        $childBQs.each((index, bq) => {
            const $cbq = $(bq);
            const calloutHtml = calloutConverter($, $cbq);
            if (calloutHtml) $cbq.replaceWith(calloutHtml);
        });

    const $firstP = $blockquote.find("p").first();
    if ($firstP.length === 0) return null;
    const firstHtml = $firstP.html() || "";
    const regex = new RegExp(`^\\[!(${CONFIG.keywords.join("|")})\\]\\s*`);
    const match = firstHtml.match(regex);
    if (!match) return null;
    const type = match[1];
    const rest = firstHtml.replace(regex, "");
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
    return calloutHtml;
}
