const fs = require("fs");
const path = require("path");

function mdFileToHTML(hexo, dir, fileFullName) {
    const filePath = path.join(dir, fileFullName);
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, "utf8");
            const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, "");
            const renderedContent = hexo.render.renderSync({
                text: contentWithoutFrontmatter,
                engine: "markdown",
            });
            return renderedContent;
        } else
            // logWarning(`NO Introduction File named of ${fileFullName}`);
            hexo.log.warn(`NO Introduction File named of ${fileFullName}`);
    } catch (err) {
        // logError(err);
        hexo.log.error(`Something error when getting content of ${fileFullName}`, err);
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
    console.log(`${colors.bgRed}${colors.white} ERROR ${colors.reset} ${colors.white}${message}${colors.reset}`);
}
function logWarning(message) {
    console.log(`${colors.bgYellow}${colors.black} WARNING ${colors.reset} ${colors.yellow}${message}${colors.reset}`);
}

module.exports = {
    mdFileToHTML: mdFileToHTML,
    logError,
    logWarning,
};
