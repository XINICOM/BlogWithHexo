const fs = require("fs");
const path = require("node:path");

let categoryTopNodes = null;
const rootPath = "categories/index.html";

hexo.extend.filter.register("template_locals", function (locals) {
    if (!categoryTopNodes)
        categoryTopNodes = categoriesToNode(locals.categories);

    if (locals.page && locals.page.category) {
        locals.page.allCategories = categoryTopNodes;
        locals.page.rootPath = rootPath;
    }
    return locals;
});

hexo.extend.generator.register("category-index", function (locals) {
    const posts = locals.posts.toArray();

    if (!categoryTopNodes)
        categoryTopNodes = categoriesToNode(locals.categories);

    const result = {
        path: rootPath,
        data: {
            categoryTopNodes: categoryTopNodes,
        },
        layout: ["category-index", "category", "index"],
    };
    return result;
});

function categoriesToNode(sc) {
    const originData = sc?.data.slice() || null;
    if (!originData) return null;

    var topNodes = [];
    originData.forEach((c) => {
        if (!c.parent) {
            const node = new CategoryNode(
                c.name,
                c._id,
                c.slug,
                c.path,
                c.permalink,
                c.posts,
                c.length,
                getCatIntro(tryGetCatSlug(c.name) + ".md"),
            );
            topNodes.push(node);
        }
    });

    originData.forEach((c) => {
        if (c.parent) {
            let targetParent;
            const thisNode = new CategoryNode(
                c.name,
                c._id,
                c.slug,
                c.path,
                c.permalink,
                c.posts,
                c.length,
                getCatIntro(tryGetCatSlug(c.name) + ".md"),
            );
            if (topNodes.length > 0)
                topNodes.forEach((n) => {
                    const result = n.getNodeWithId(c.parent);
                    if (result) {
                        result.addChild(thisNode);
                        thisNode.setParent(result);
                    }
                });
        }
    });

    return topNodes;
}

class CategoryNode {
    constructor(name, _id, slug, path, permalink, posts, length, intro = null) {
        this.name = name;
        this._id = _id;
        this.slug = slug;
        this.path = path;
        this.permalink = permalink;
        this.posts = posts;
        this.length = length;
        this.intro = intro;
        this.children = [];
    }
    addChild(o) {
        this.children.push(o);
        return this;
    }
    setParent(o) {
        this.parent = o;
        return this;
    }
    getParents() {
        if (this.parent) {
            const parentResults = this.parent.getParents() || [];
            return [this.parent, ...parentResults];
        }
        return null;
    }
    getNodeWithId(id) {
        if (this._id === id) return this;
        if (this.children && this.children.length > 0)
            for (const child of this.children) {
                const result = child.getNodeWithId(id);
                if (result) return result;
            }
        return null;
    }
    getNodeWithName(name) {
        if (this.name === name) return this;
        if (this.children && this.children.length > 0)
            for (const child of this.children) {
                const result = child.getNodeWithName(name);
                if (result) return result;
            }
        return null;
    }
    toJSON() {
        return {
            name: this.name,
            id: this._id,
            children: this.children,
        };
    }
}

function tryGetCatSlug(originCatName) {
    if (hexo.config?.category_map)
        return hexo.config?.category_map[originCatName] || originCatName;
    else return originCatName;
}

function getCatIntro(fileName) {
    const introDir = path.join(
        hexo.source_dir,
        hexo.config?.introduction_folder?.category || "_category-intros",
    );
    const filePath = path.join(introDir, fileName);
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, "utf8");
            const contentWithoutFrontmatter = content.replace(
                /^---\n[\s\S]*?\n---\n/,
                "",
            );
            const renderedContent = hexo.render.renderSync({
                text: contentWithoutFrontmatter,
                engine: "markdown",
            });
            return renderedContent;
        } else logWarning(`NO CATEGORY Introduction File named of ${fileName}`);
    } catch (err) {
        logError(`NO CATEGORY Introduction File named of ${fileName}`);
    }
    return null;
}
const colors = {
    white: "\x1b[37m",
    black: "\x1b[30m",
    yellow: "\x1b[33m",
    bgRed: "\x1b[41m",
    bgYellow: "\x1b[43m",
    bold: "\x1b[1m",
    reset: "\x1b[0m",
};
function logError(message) {
    console.log(
        `${colors.bgRed}${colors.white} ERROR ${colors.reset} ${colors.white}${message}${colors.reset}`,
    );
}
function logWarning(message) {
    console.log(
        `${colors.bgYellow}${colors.black} WARNING ${colors.reset} ${colors.yellow}${message}${colors.reset}`,
    );
}
