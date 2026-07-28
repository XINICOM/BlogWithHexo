"use strict";

const cheerio = require("cheerio");
const shiki = require("shiki");

// 配置：从主题配置中读取，方便以后调整
const themeConfig = hexo.theme.config.shiki || {};

// 默认配置
const DEFAULT_CONFIG = {
    // theme: "github-dark", // 默认主题
    theme: "dark-plus", // 默认主题
    langs: [
        // 默认支持的语言
        "javascript",
        "typescript",
        "python",
        "bash",
        "shell",
        "html",
        "css",
        "json",
        "yaml",
        "markdown",
        "java",
        "c",
        "cpp",
        "csharp",
        "go",
        "rust",
        "php",
        "ruby",
        "swift",
        "kotlin",
        "sql",
        "powershell",
        "xml",
        // "svg",
    ],
    line_number: false, // 是否显示行号
    wrap: true, // 是否自动换行
};

// 合并配置
const config = Object.assign({}, DEFAULT_CONFIG, themeConfig);

// 创建单例高亮器（只初始化一次，提高性能）
let highlighter = null;

// 异步初始化高亮器
async function getHighlighter() {
    if (!highlighter) {
        try {
            highlighter = await shiki.createHighlighter({
                themes: [config.theme],
                langs: config.langs,
            });
            console.log(`✅ Shiki 高亮器初始化成功 (主题: ${config.theme})`);
        } catch (error) {
            console.error("❌ Shiki 高亮器初始化失败:", error);
            throw error;
        }
    }
    return highlighter;
}

// 注册 Hexo 过滤器
hexo.extend.filter.register("after_post_render", async function (data) {
    if (!data.content) return data;

    try {
        const highlighterInstance = await getHighlighter();
        const $ = cheerio.load(data.content);

        // 查找所有代码块
        const codeBlocks = $("pre code");
        if (codeBlocks.length === 0) return data;

        let highlightCount = 0;

        codeBlocks.each((index, element) => {
            const $code = $(element);

            // 获取语言
            // let lang = "text";
            let lang;
            const classAttr = $code.attr("class") || "";
            lang = classAttr.trim().split(/\s+/)[1] || "text";
            // const langMatch = classAttr.match(/language-([^\s]+)/);
            // if (langMatch) {
            //     lang = langMatch[1];
            // }

            // 获取代码内容
            const code = $code.text();
            // console.log(code);

            try {
                // 使用 Shiki 高亮
                let highlighted = highlighterInstance.codeToHtml(code, {
                    lang: lang,
                    theme: config.theme,
                });

                // 如果启用行号，给高亮结果添加额外配置
                // if (config.line_number) {
                //     // Shiki 默认支持行号，需要额外配置
                //     // 这里是一个简化的行号实现方式
                //     const lines = code.split("\n").length;
                //     let lineNumbersHtml = '<div class="line-numbers">';
                //     for (let i = 1; i <= lines; i++) {
                //         lineNumbersHtml += `<span class="line-number">${i}</span>`;
                //     }
                //     lineNumbersHtml += "</div>";

                //     // 将行号包裹在 pre 内部
                //     const $highlighted = cheerio.load(highlighted);
                //     const $pre = $highlighted("pre");
                //     $pre.prepend(lineNumbersHtml);
                //     $pre.addClass("line-numbers-enabled");
                //     highlighted = $highlighted.html();
                // }

                // 替换原有的 <pre> 标签
                const $after = cheerio.load(highlighted);
                $code.parent("pre").addClass($after("pre").attr("class"));
                $code.replaceWith("<code>" + $after("code").html() + "</code>");
                // $code.parent("pre").replaceWith(highlighted);
                // console.log("================================");
                // console.log(highlighted);
                // console.warn(highlighted);
                highlightCount++;
            } catch (error) {
                console.warn(
                    `⚠️ Shiki 高亮失败 (语言: ${lang}):`,
                    error.message,
                );
                // 如果高亮失败，保留原始代码块，避免文章破损
            }
        });

        if (highlightCount > 0) {
            console.log(`🔹 Shiki 高亮了 ${highlightCount} 个代码块`);
        }

        data.content = $.html();
        return data;
    } catch (error) {
        console.error("❌ Shiki 处理失败:", error);
        // 出错时返回原始内容，不影响文章生成
        return data;
    }
});

// 如果有需要，也可以注册一个辅助函数，供模板使用
hexo.extend.helper.register("shiki_theme", function () {
    return config.theme;
});

console.log("🔹 Shiki 高亮插件已加载");
