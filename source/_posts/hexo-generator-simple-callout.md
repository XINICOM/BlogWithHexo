---
title: hexo-generator-simple_callout 插件介绍
date: 2026-07-29 18:27:08
tags:
    - Welcome
    - Hexo
    - theme
column:
    title: "Welcome to My Blog"
    order: 2
---
# 介绍

本插件让你可以在 hexo 的 markdown 文件中使用类似 obsidian 的 callout 语法，插件使用 cheerio 对 hexo 的生成内容后处理实现 callout 的 html。

本插件为我的自制 hexo 主题 [XNCst](https://github.com/XINICOM/BlogWithHexo/tree/main/themes/XNCst) 的产物。

# 配置

默认配置如下，你也可以在 `_config.yml` 中添加自定义属性实现更改。

```yaml
simple_callout:
    enable: true                     # 是否启用插件
    styleInjection: true             # 是否在 HTML 头部注入默认样式，
                                     # 并且复制 hgsc-callout-style.css（默认样式）文件到生成目录
    keywords:                        # Callout 样式的关键字
        - note
        - tip
        - important
        - warning
        - caution
    # 以下是使用 cheerio 生成的 Callout HTML 类名
    # 对它们更改可能可以更好的适配您的样式
    classPrefix: "callout"           # Callout 包裹容器类名
    titleClass: "callout-title"      # Callout 下标题容器类名
    contentClass: "callout-content"  # Callout 下内容容器类名
```

# 使用

markdown 文件中的语法：

```md
> [!note] 这是标题
> 这是内容
```

> [!note] 这是标题
> 这是内容

你也可以将他们嵌套：

```md
> [!note] 这是标题
>
> > [!tip] 这是标题
> > 这是内容
>
> 这是内容
```

> [!note] 这是标题
>
> > [!tip] 这是标题
> > 这是内容
>
> 这是内容

# 细节

## Callout 生成内容

```md
> [!note] 这是标题
>
> > [!tip] 这是标题
> > 这是内容
>
> 这是内容
```

以上 markdown 会生成：

```html
<div class="callout note">
  <div class="callout-title">这是标题</div>
  <div class="callout-content">
    <div class="callout tip">
      <div class="callout-title">这是标题</div>
      <div class="callout-content"><p>这是内容</p></div>
    </div>
    <p>这是内容</p>
  </div>
</div>
```

## 默认 CSS 注入

会在 HTML 头部添加：

```html
<head>
  <link rel="stylesheet" href="/css/hgsc-callout-style.css" />
</head>
```

## 默认 CSS 配色方案

您可以仿照以下样式添加自定义的 keywords 对应的样式：

```css
.callout.note .callout-title {
  --tw-border-opacity: 1;
  border-color: rgb(31 111 235 / var(--tw-border-opacity));
  --tw-text-opacity: 1;
  color: rgb(31 111 235 / var(--tw-text-opacity));
}

.callout.note {
  --tw-border-opacity: 1;
  border-color: rgb(31 111 235 / var(--tw-border-opacity));
  background-color: rgb(31 111 235 / 0.1);
}
```

另外本 CSS 使用 TailWind CSS 辅助生成，原始的 [input.css](https://github.com/XINICOM/BlogWithHexo/blob/main/themes/XNCst/source/css/input.css) 在我的博客仓库中

# 反馈和支持

- 遇到问题？推荐提交 [GitHub Issue](https://github.com/XINICOM/hexo-generator-simple_callout/issues)。
- 您可以通过 XINICOM.DEV@outlook.com 来[联系我](mailto:XINICOM.DEV@outlook.com)。