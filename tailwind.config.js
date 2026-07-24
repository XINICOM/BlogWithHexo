/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./themes/XNCst/layout/**/*.{ejs,html}",
        "./themes/XNCst/source/js/**/*.js",
    ],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                serif: ["宋体", "SimSun", "Songti SC", "serif"],
                monospace: [],
                mono: [
                    "Consolas",
                    "ui-monospace",
                    "SFMono-Regular",
                    "Menlo",
                    "Monaco",
                    "Liberation Mono",
                    "Courier New",
                    "monospace",
                    "ui-sans-serif",
                    "system-ui",
                    "sans-serif",
                    "Apple Color Emoji",
                    "Segoe UI Emoji",
                    "Segoe UI Symbol",
                    "Noto Color Emoji",
                ],
            },
            colors: {
                code: "#2C2C2C",
                border: {
                    light: "#E0E0E0",
                    dark: "#404040",
                },
                textPrimary: {
                    light: "#000000",
                    dark: "#F3F3F3",
                },
                textContent: {
                    light: "#121212",
                    dark: "#D4D4D4",
                },
                textSecondary: {
                    light: "#666666",
                    dark: "#ABABAB",
                },
                bg0: {
                    light: "#FFFFFF",
                    dark: "#1E1E1E",
                },
                bg1: {
                    dark: "#383838",
                },
            },
        },
    },
    plugins: [],
};
