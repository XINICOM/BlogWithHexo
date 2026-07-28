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

## 分类

1. 提供了分类树插件，将默认的分类转换成分类树，以在 `post.ejs` 内可以方便的寻找 父分类 和 子分类。
2. 每个分类可以在 `source/_category-intros` 文件夹 中创建对应的 markdown 文件 已实现对分类的介绍。

## 标签
