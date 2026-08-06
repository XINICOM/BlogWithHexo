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
updated: 2026-08-06 18:19:15
---

# 简介

若安装 markdown 的 lsp 可能在编辑 md 文件时会出现 `error MD025` 字样的报错，其由于不允许出现多个一级标题而产生
（YAML Front Matter 中的 title 属性可能也会被解析成一个一级标题）

本文介绍如何避免在编辑 markdown 文件时出现缓冲区中之前输入过的文本进入自动补全提示框中

# 步骤

在 `$env:LOCALAPPDATA\nvim\lua\plugins\lint.lua` 中添加：

```lua lint.lua | lang:lua
return {
	{
		"mfussenegger/nvim-lint",
		opts = {
			linters = {
				["markdownlint-cli2"] = {
					args = { "--disable", "MD025", "--" },
				},
			},
		},
	},
}
```

> [!WRNING] 可能错误
> 由于在使用这个方法后似乎所有的错误检查都消失了，
> 该方法可能是错误的，可能会导致插件无法正确加载
