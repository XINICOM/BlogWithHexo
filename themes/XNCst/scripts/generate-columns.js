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
    const URL_Slug = getColumnURLSlug(column.title);

    //
    data.column.slug = URL_Slug;
    data.column.path = "columns/" + URL_Slug + "/";

    //
    const allPosts = hexo.locals.get("posts").toArray();
    const sameColumnPosts = allPosts
        .filter(
            (p) => p.column && getColumnURLSlug(p.column.title) === URL_Slug,
        )
        .sort((a, b) => sortArticlesUnderColumn(a, b));
    // data.column.allPosts = sameColumnPosts;
    const currentIndex = sameColumnPosts.findIndex((p) => p.path === data.path);
    // console.log(URL_Slug, currentIndex);
    data.column.currentPostIndex = currentIndex;
    const prevPost =
        currentIndex > 0 ? sameColumnPosts[currentIndex - 1] : null;
    const nextPost =
        currentIndex < sameColumnPosts.length - 1
            ? sameColumnPosts[currentIndex + 1]
            : null;
    data.column.prevColumnPost = prevPost
        ? { title: prevPost.title, path: prevPost.path }
        : null;
    data.column.nextColumnPost = nextPost
        ? { title: nextPost.title, path: nextPost.path }
        : null;

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
    //
    var results = [];
    var columnTitles = Object.keys(columnGroups);

    var allColumns = [];
    columnTitles.forEach((originTitle) => {
        const URL_slug = getColumnURLSlug(originTitle);
        var articles = columnGroups[originTitle].sort((a, b) =>
            sortArticlesUnderColumn(a, b),
        );
        //
        const path = "columns/" + URL_slug + "/index.html";
        results.push({
            path: path,
            data: {
                column: {
                    title: originTitle,
                    slug: URL_slug,
                },
                articles: articles,
                layout: ["column", "index"],
            },
            layout: ["column", "index"],
        });
        // articles.forEach((a) => console.log(">>>", originTitle, a.title));

        //
        const latestPost = [...columnGroups[originTitle]].sort(
            (a, b) => b.updated - a.updated,
        )[0];
        allColumns.push({
            path: path,
            title: originTitle,
            slug: URL_slug,
            postsCount: articles.length,
            updateTime: latestPost
                ? latestPost.updated || latestPost.date
                : null,
        });
        // articles.forEach((a) => console.log("/>>", originTitle, a.title));
        // console.log(
        //     latestPost.title,
        //     latestPost ? latestPost.updated || latestPost.date : null,
        // );
    });
    //
    allColumns.sort((a, b) => b.updateTime - a.updateTime);
    results.push({
        path: "columns/index.html",
        data: {
            columns: allColumns,
            // columnNames: Object.keys(columnGroups),
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
    return Title_map_slug || Title_slug;
}

function sortArticlesUnderColumn(a, b) {
    // if (a.column.order && b.column.order)
    //     return a.column.order - b.column.order;
    // if (a.column.order !== undefined) {
    //     return -1;
    // }
    // if (b.column.order !== undefined) {
    //     return 1;
    // }
    // const timeA = a.updated
    //     ? new Date(a.updated).getTime()
    //     : new Date(a.date).getTime();
    // const timeB = b.updated
    //     ? new Date(b.updated).getTime()
    //     : new Date(b.date).getTime();
    // return timeA - timeB;
    // 获取 order 值，没有则设为 Infinity（排在最后）
    const orderA = a.column.order !== undefined ? a.column.order : Infinity;
    const orderB = b.column.order !== undefined ? b.column.order : Infinity;

    // 如果 order 不同，按 order 升序
    if (orderA !== orderB) {
        return orderA - orderB;
    }

    // order 相同或都没有 order，按日期升序（旧 → 新）
    const timeA = a.updated
        ? new Date(a.updated).getTime()
        : new Date(a.date).getTime();
    const timeB = b.updated
        ? new Date(b.updated).getTime()
        : new Date(b.date).getTime();
    return timeA - timeB;
}
