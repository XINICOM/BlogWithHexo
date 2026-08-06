---
title: 关闭 MD025 报错
date: 2026-08-06 18:18:41
tags:
    - NeoVim
    - LazyVim
    - Windows
    - markdown
categories:
    - 编程
    - 工具
column:
    title: LazyVim 使用记录
updated: 2026-08-06 21:16:50
---

# 简介

若安装 markdown 的 lsp 可能在编辑 md 文件时会出现 `error MD025` 字样的报错，其由于不允许出现多个一级标题而产生
（YAML Front Matter 中的 title 属性可能也会被解析成一个一级标题）

本文介绍如何避免在编辑 markdown 文件时出现缓冲区中之前输入过的文本进入自动补全提示框中

# 步骤

在你项目的根目录处添加 `.markdwonlint-cli2.jsonc` 文件：

```json .markdwonlint-cli2.jsonc | lang:jsonc
{
    "config": {
        "default": true,
        "MD025": false
    }
}
```
