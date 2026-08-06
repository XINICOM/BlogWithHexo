---
title: LazyVim 禁用缓冲区内容提示
date: 2026-08-06 17:07:44
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
updated: 2026-08-06
---

# 简介

本文介绍如何避免在编辑 markdown 文件时出现缓冲区中之前输入过的文本进入自动补全提示框中

# 步骤

在 `$env:LOCALAPPDATA\nvim\lua\plugins\blink.lua` 中添加：

```lua blink.lua | lang:lua
return {
	{
		"saghen/blink.cmp",
		opts = function(_, opts)
			opts.sources.default = function()
				if vim.bo.filetype == "markdown" then
					return { "lsp", "path", "snippets" }
				else
					return { "lsp", "path", "snippets", "buffer" }
				end
			end
		end,
	},
}
```
