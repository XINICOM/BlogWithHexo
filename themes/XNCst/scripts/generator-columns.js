"use strict";

const { slugize } = require("hexo-util");
// const fs = require("fs");
const path = require("path");
const mfr = require("./markdown-file-reader");

hexo.extend.filter.register("before_post_render", function (data) {
    const column = data.column;
    if (!column || !column.title) {
        return data;
    }

    const URL_Slug = getColumnURLSlug(column.title);

    data.column.slug = URL_Slug;
    data.column.path = "columns/" + URL_Slug + "/";

    const allPosts = hexo.locals.get("posts").toArray();
    const sameColumnPosts = allPosts
        .filter(
            (p) => p.column && getColumnURLSlug(p.column.title) === URL_Slug,
        )
        .sort((a, b) => sortArticlesUnderColumn(a, b));

    const currentIndex = sameColumnPosts.findIndex((p) => p.path === data.path);

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

    data.column.allPosts = [];
    sameColumnPosts.forEach((p) => {
        data.column.allPosts.push({
            title: p.title,
            path: p.path,
        });
    });

    return data;
});

hexo.extend.generator.register("columns", function (locals) {
    const posts = locals.posts.toArray();

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

    var results = [];
    var columnTitles = Object.keys(columnGroups);

    var allColumns = [];
    columnTitles.forEach((originTitle) => {
        const URL_slug = getColumnURLSlug(originTitle);
        const introContent = getColumnIntro(URL_slug + ".md");
        var articles = columnGroups[originTitle].sort((a, b) =>
            sortArticlesUnderColumn(a, b),
        );

        const path = "columns/" + URL_slug + "/index.html";
        results.push({
            path: path,
            data: {
                column: {
                    title: originTitle,
                    slug: URL_slug,
                    intro: introContent,
                },
                articles: articles,
                layout: ["column", "index"],
            },
            layout: ["column", "index"],
        });

        const latestPost = [...columnGroups[originTitle]].sort(
            (a, b) => (b.updated || b.date) - (a.updated || a.data),
        )[0];
        allColumns.push({
            path: path,
            title: originTitle,
            slug: URL_slug,
            postsCount: articles.length,
            updatedTime: latestPost
                ? latestPost.updated || latestPost.date
                : null,
            intro: introContent,
        });
    });

    allColumns.sort((a, b) => (b.updatedTime || 0) - (a.updatedTime || 0));
    results.push({
        path: "columns/index.html",
        data: {
            columns: allColumns,

            layout: ["column-index", "index"],
        },
        layout: ["column-index", "index"],
    });

    return results;
});

function getColumnURLSlug(originTitle) {
    const columnTitleMapping = hexo.config.column_map || {};
    const Title_slug = slugize(originTitle);
    const Title_map_slug = columnTitleMapping[originTitle];
    return Title_map_slug || Title_slug;
}
exports.getColumnURLSlug = getColumnURLSlug;

function sortArticlesUnderColumn(a, b) {
    const orderA = a.column.order !== undefined ? a.column.order : Infinity;
    const orderB = b.column.order !== undefined ? b.column.order : Infinity;

    if (orderA !== orderB) {
        return orderA - orderB;
    }

    const timeA = a.updated
        ? new Date(a.updated).getTime()
        : new Date(a.date).getTime();
    const timeB = b.updated
        ? new Date(b.updated).getTime()
        : new Date(b.date).getTime();
    return timeA - timeB;
}
exports.sortArticlesUnderColumn = sortArticlesUnderColumn;

function getColumnIntro(fileName) {
    const introDir = path.join(
        hexo.source_dir,
        hexo.config?.introduction_folder?.column || "_column-intros",
    );

    return mfr.mdFileToHTML(hexo, introDir, fileName);
}
