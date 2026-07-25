"use strict";
// const { url_for } = require("hexo-util");
const { slugize } = require("hexo-util");

hexo.extend.filter.register("before_post_render", function (data) {
    // 1. 从文章 Front-matter 中读取 column 配置
    const column = data.column;
    if (!column || !column.title) {
        return data;
    }

    // // 2. 获取映射配置
    // const columnTitleMapping = hexo.config.column_map || {};
    // const originTitle = column.title;

    // // 3. 生成 URL Slug (逻辑与你的生成器保持一致)
    // const titleSlug = slugize(originTitle);
    // const mappedSlug = columnTitleMapping[originTitle];
    // // 如果映射值为空字符串，则使用自动生成的 slug；否则使用映射值
    const urlSlug = getColumnURLSlug(column.title);

    // 4. 将生成的 slug 挂载到文章对象上
    data.column.path = "columns/" + urlSlug + "/";

    return data;
});

hexo.extend.generator.register("columns", function (locals) {
    // console.log("columns generate");

    const posts = locals.posts.toArray();

    // 1. 按 column 字段分组
    var columnGroups = {};
    posts.forEach((p) => {
        if (p.column) {
            var columnTitle = p.column.title;
            if (!columnGroups[columnTitle]) {
                columnGroups[columnTitle] = [];
            }
            columnGroups[columnTitle].push(p);
        }
    });

    // 2. 为每个专栏生成一个页面
    var results = [];
    var columnTitles = Object.keys(columnGroups);

    columnTitles.forEach((originTitle) => {
        // 生成 URL 友好的 slug（将空格、特殊字符转为连字符）
        // console.log("🟢" + slugize(columnName));
        // const Title_slug = slugize(originTitle);
        // const Title_map_slug = columnTitleMapping[originTitle];
        // const URL_slug = Title_map_slug === "" ? Title_slug : Title_map_slug;
        const URL_slug = getColumnURLSlug(originTitle);

        // 获取该专栏下的所有文章，按 column.order 排序
        var articles = columnGroups[originTitle].sort(function (a, b) {
            // 如果有 column.order 字段，按它排序
            if (a.column.order && b.column.order) {
                return a.column.order - b.column.order;
            }
            // 否则按日期降序
            return b.date - a.date;
        });

        // 创建页面数据
        results.push({
            path: "columns/" + URL_slug + "/index.html", // 路径：columns/专栏名/
            data: {
                // title: originTitle + " - 专栏",
                // column: originTitle,
                column: {
                    title: originTitle,
                    slug: URL_slug,
                },
                articles: articles,
                total: articles.length,
                layout: ["column", "index"],
            },
            layout: ["column", "index"],
        });
    });

    // 3. 生成专栏汇总页（可选）
    results.push({
        path: "columns/index.html",
        data: {
            columns: columnGroups,
            columnNames: Object.keys(columnGroups),
            layout: ["column-home", "index"],
        },
        layout: ["column-home", "index"],
    });

    return results;
});

function getColumnURLSlug(originTitle) {
    const columnTitleMapping = hexo.config.column_map || {};
    const Title_slug = slugize(originTitle);
    const Title_map_slug = columnTitleMapping[originTitle];
    // console.log(originTitle, Title_map_slug);
    return Title_map_slug && Title_map_slug !== ""
        ? Title_map_slug
        : Title_slug;
}
