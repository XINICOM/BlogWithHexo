---
title: XNCst 主题介绍
date: 2026-07-28 21:08:19
tags:
    - Welcome
    - Hexo
    - theme
column:
    title: "Welcome to My Blog"
    order: 1
---

# 前言

本主题作者是 XINICOM (YiCheng ZHOU)。

# 主要特色

## 代码块

1. 支持 `文件名` `高亮行` `语言显示`：

    ````markdown | lang:Markdown
    ```cs Program.cs | highlight-lines:2,5,8 | lang:C#
    using System;
    namespace HelloWorldApplication
    {
        /* 类名为 HelloWorld */
        class HelloWorld
        {
            /* main函数 */
            static void Main(string[] args)
            {
                /* 我的第一个 C# 程序 */
                Console.WriteLine("Hello World!");
                Console.ReadKey();
            }
        }
    }
    ```
    ````

    ```cs Program.cs | highlight-lines:2,5,8 | lang:C#
    using System;
    namespace HelloWorldApplication
    {
        /* 类名为 HelloWorld */
        class HelloWorld
        {
            /* main 函数 */
            static void Main(string[] args)
            {
                /* 我的第一个 C# 程序 */
                Console.WriteLine("Hello World!");
                Console.ReadKey();
            }
        }
    }
    ```

2. 由于使用 `shiki` 作为高亮器，故而可以提供比默认的 `highlight.js` 更加“生动”的高亮显示效果：

    ```py main.py | lang:Python
    # !/usr/bin/python
    print("Hello, World!")
    ```

    ```shell | lang:Shell
    hexo clean
    hexo g
    hexo s
    cls
    ```

## 专栏

1. 提供了专栏功能，可以在文章的 `YAML Front Matter` 输入以下内容，实现 专栏

    ```yaml postName.md | lang:YAML
    ---
    column:
        # 专栏名称
        title: "Welcome to My Blog"
        # 本文在该专栏的排序
        # 若没有本属性，则会按照更新先后顺序排在有 order
        order: 1
    ---
    ```

2. 可以在 `_config.yml` 中配置专栏名称的 mapping
    ```yaml _config.yml | lang:YAML
    # Column
    column_map:
        "专栏本名": "column-name-slug"
    ```
3. 每个专栏可以在 `source/_column-intros` 文件夹 中创建对应的 markdown 文件 已实现对专栏的介绍。

## 分类

1. 提供了分类树插件，将默认的分类转换成分类树，以在 `post.ejs` 内可以方便的寻找 父分类 和 子分类。
2. 每个分类可以在 `source/_category-intros` 文件夹 中创建对应的 markdown 文件 已实现对分类的介绍。

## 标签

1. 每个标签可以在 `source/_tag-intros` 文件夹 中创建对应的 markdown 文件 已实现对标签的介绍。

## Callout

### 文内 Callout

使用 `cheerio` 解析，实现把 `blockquote` 转成 `div.callout`，后用 css 提供样式

> [!note] Note 样式
> 内容1
>
> 内容2
> 内容3

> [!tip] Tip 样式
> 内容1
>
> 内容2
> 内容3

> [!important] Important 样式
> 内容1
>
> 内容2
> 内容3

> [!warning] Warning 样式
> 内容1
>
> 内容2
> 内容3

> [!caution] Caution 样式
> 内容1
>
> 内容2
> 内容3

文内 Callout 是可以叠加的：

> [!note] Note 样式
> 内容1
>
> > [!note] Note 样式
> > 内容1
> >
> > 内容2
> > 内容3
>
> 内容2
> 内容3

### 顶部 Callout

在文章的 `YAML Front Matter` 输入以下内容，实现 顶部 Callout 效果
但是 顶部 Callout 不可以叠加

```yaml postName.md | lang:YAML
---
header_callout:
    # 这是等级选择，可选的和 文内 Callout 提供的 5 种选择一致
    - level: "note"
      title: "这是标题"
      # 这是内容的文件路径
      detailFilePath: "_header-callout/xxx.md"
---
```
