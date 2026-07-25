"use strict";

console.log("🔵 test-generator.js 被加载了");

// module.exports = function (hexo) {
// console.log("🟢 test-generator 的 module.exports 执行了");

hexo.extend.generator.register("test-generator", function (locals) {
    console.log("🟡 test-generator 生成器被调用了！");
    console.log("🟡 文章总数:", locals.posts.length);

    return {
        path: "test.html",
        data: { title: "Test Page" },
        layout: "page",
    };
});

console.log("🟢 test-generator 注册完成");
// };
