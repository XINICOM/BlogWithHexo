"use strict";
// const { url_for } = require("hexo-util");

// module.exports = function (hexo) {
// 注册一个生成器，名为 'columns'
hexo.extend.generator.register("columns", function (locals) {
    // console.log("columns generate");

    const CONFIG = hexo.config;
    const posts = locals.posts.toArray();

    // 1. 按 column 字段分组
    var columnGroups = {};
    posts.forEach((p) => {
        if (p.column) {
            var columnName = p.column.title;
            if (!columnGroups[columnName]) {
                columnGroups[columnName] = [];
            }
            columnGroups[columnName].push(p);
        }
    });

    // 2. 为每个专栏生成一个页面
    var results = [];
    var columnNames = Object.keys(columnGroups);

    columnNames.forEach((columnName) => {
        // 生成 URL 友好的 slug（将空格、特殊字符转为连字符）
        var columnSlug = hexo.util.slugize(columnName);

        // 获取该专栏下的所有文章，按 column.order 排序
        var articles = columnGroups[columnName].sort(function (a, b) {
            // 如果有 column.order 字段，按它排序
            if (a.column.order && b.column.order) {
                return a.column.order - b.column.order;
            }
            // 否则按日期降序
            return b.date - a.date;
        });

        // 创建页面数据
        results.push({
            path: url_for("columns/" + columnSlug + "/index.html"), // 路径：columns/专栏名/
            data: {
                title: columnName + " - 专栏",
                column: columnName, // 专栏名称
                slug: columnSlug, // URL slug
                articles: articles, // 该专栏下的所有文章
                total: articles.length, // 文章总数
                layout: ["column", "page", "index"], // 优先使用 column.ejs
            },
            layout: ["column", "page", "index"],
        });
    });

    // 3. 生成专栏汇总页（可选）
    results.push({
        path: url_for("columns/index.html"),
        data: {
            title: "所有专栏",
            columns: columnGroups,
            columnNames: Object.keys(columnGroups),
            layout: ["columns", "page", "index"],
        },
        layout: ["columns", "page", "index"],
    });

    return results;
});
// };
