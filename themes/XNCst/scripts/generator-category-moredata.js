let categoryTopNodes = null;

hexo.extend.filter.register("template_locals", function (locals) {
    // const categoryTopNodes = categoriesToNode(locals.categories);
    if (!categoryTopNodes)
        categoryTopNodes = categoriesToNode(locals.categories);
    // console.log(JSON.stringify(categoryTopNodes));
    if (locals.page && locals.page.category) {
        locals.page.allCategories = categoryTopNodes;
    }
    return locals;
});

hexo.extend.generator.register("category-index", function (locals) {
    const posts = locals.posts.toArray();
    const path = "categories/index.html";
    //
    // const categoryTopNodes = categoriesToNode(locals.categories);
    if (!categoryTopNodes)
        categoryTopNodes = categoriesToNode(locals.categories);
    // console.log(JSON.stringify(categoryTopNodes));
    //
    const result = {
        path: path,
        data: {
            categoryTopNodes: categoryTopNodes,
        },
        layout: ["category-index", "category", "index"],
    };
    return result;
});
// sc: site.categories
function categoriesToNode(sc) {
    //
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
            );
            if (topNodes.length > 0)
                topNodes.forEach((n) => {
                    const result = n.getNodeWithId(c.parent);
                    if (result) result.addChild(thisNode);
                });
        }
    });

    return topNodes;
}

class CategoryNode {
    constructor(name, _id, slug, path, permalink, posts, length) {
        this.name = name;
        this._id = _id;
        this.slug = slug;
        this.path = path;
        this.permalink = permalink;
        this.posts = posts;
        this.length = length;
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
    getNodeWithId(id) {
        if (this._id === id) return this;
        if (this.children && this.children.length > 0)
            this.children.forEach((child) => {
                const result = child.getNodeWithId(id);
                if (result) return result;
            });
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
