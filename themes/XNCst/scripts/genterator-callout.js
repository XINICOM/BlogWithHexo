// "use strict";

// const cheerio = require("cheerio");

// hexo.extend.filter.register("after_post_render", function (data) {
//     const $ = cheerio.load(data.content);

//     // 查找所有 blockquote 元素
//     $("blockquote").each(function () {
//         const $blockquote = $(this);
//         const text = $blockquote.text().trim();

//         // 匹配 Obsidian 风格的 Callout 语法
//         const match = text.match(
//             /^\[!(note|tip|important|warning|caution)\](.*)/,
//         );
//         if (match) {
//             const type = match[1];
//             const content = match[2].trim();

//             // 替换原有的 blockquote 内容
//             $blockquote.html(`
//         <div class="callout ${type}">
//           <div class="callout-title">${type.toUpperCase()}</div>
//           <div class="callout-content">${content}</div>
//         </div>
//       `);
//         }
//     });

//     data.content = $.html();
//     return data;
// });

// scripts/callout.js
"use strict";

const cheerio = require("cheerio");

// Callout 类型与样式映射
// const calloutStyles = {
//     note: { color: "#4a9eff", bg: "#e8f4fd" },
//     warning: { color: "#e67e22", bg: "#fdf0e0" },
//     tip: { color: "#2ecc71", bg: "#e8f8f0" },
//     info: { color: "#3498db", bg: "#e8f4fd" },
//     danger: { color: "#e74c3c", bg: "#fde8e8" },
//     success: { color: "#27ae60", bg: "#e8f8f0" },
//     question: { color: "#9b59b6", bg: "#f4e8f8" },
//     abstract: { color: "#1abc9c", bg: "#e8f8f5" },
//     quote: { color: "#7f8c8d", bg: "#f0f0f0" },
// };

hexo.extend.filter.register("after_post_render", function (data) {
    if (!data.content) return data;

    const $ = cheerio.load(data.content);

    $("blockquote").each(function () {
        const $blockquote = $(this);
        const html = $blockquote.html();

        // 获取第一个 <p> 标签
        const firstParagraph = $blockquote.find("p").first();
        if (firstParagraph.length === 0) return;

        // 获取第一个 <p> 的完整 HTML 内容
        const firstHtml = firstParagraph.html() || "";

        // 尝试匹配 [!type] 格式
        const match = firstHtml.match(
            /^\[!(note|tip|important|warning|caution)\]\s*/,
        );
        if (!match) return;

        const type = match[1];

        // ---- 核心：分离标题和内容 ----
        // 移除匹配到的 [!type] 部分
        const rest = firstHtml.replace(
            /^\[!(note|tip|important|warning|caution)\]\s*/,
            "",
        );

        // 查找 <br> 标签的位置，以此分离标题和正文
        const brIndex = rest.indexOf("<br>");
        let titleContent = "";
        let bodyContent = "";

        if (brIndex !== -1) {
            // 有 <br>：标题是 <br> 前面的部分
            titleContent = rest.substring(0, brIndex).trim();
            // 正文是 <br> 后面的部分
            bodyContent = rest.substring(brIndex + 4); // 4 = '<br>'.length
        } else {
            // 没有 <br>：整行都是标题
            titleContent = rest.trim();
            bodyContent = "";
        }

        // ---- 构建新的 blockquote 内部结构 ----
        // 1. 移除原来的第一个 <p> 标签
        firstParagraph.remove();

        // 2. 获取剩余内容的 HTML
        const remainingHtml = $blockquote.html() || "";

        // 3. 组装新的内容
        let newContent = "";

        // 如果有正文内容（来自第一个 <p> 的 <br> 后面部分），包装成 <p>
        if (bodyContent.trim()) {
            newContent += `<p>${bodyContent}</p>`;
        }

        // 剩余内容（原有的其他 <p>、<ul> 等）
        if (remainingHtml.trim()) {
            newContent += remainingHtml;
        }

        // 获取样式
        // const style = calloutStyles[type] || calloutStyles.note;

        // 构建最终的 Callout
        const calloutHtml = `
      <div class="callout ${type}">
        <div class="callout-title">
          ${titleContent || type.toUpperCase()}
        </div>
        <div class="callout-content">
          ${newContent}
        </div>
      </div>
    `;

        $blockquote.replaceWith(calloutHtml);
    });

    data.content = $.html();
    return data;
});
