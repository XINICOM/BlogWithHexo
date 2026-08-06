---
title: LazyVim 里使用 im-select.exe
date: 2026-08-06 17:07:44
tags:
    - NeoVim
    - LazyVim
    - Windows
categories:
    - 编程
    - 工具
column:
    title: LazyVim 使用记录
updated: 2026-08-06
---

# 简介

本文介绍如何在 LazyVim 中使用 im-select 这个软件：

1. 进入 LazyVim 时切换为英文输入法
2. 退出 LazyVim 时切换为中文输入法
3. 进入 INSERT 模式等输入模式时切换为中文输入法
4. 进入 INSERT 模式等输入模式时切换为英文输入法

# 步骤

## 开启多个输入法

1. 进入 Windows 的 `设置 > 时间和语言` 在语言选项卡中添加语言，使同时有简中和英语两个语言包
   （出现“您的 Windows 许可证仅支持一种显示语言”也无妨）
2. 在英语语言包右侧的 `···` 处点击 `语言选项`，滑动到底部添加键盘，确保**英语语言包有一套键盘配置**
3. `设置 > 时间和语言 > 输入 > 高级键盘设置` 勾选 `允许我为每个应用窗口使用不同的输入法`

如此当你按下 `<win><space>` 时应该会发现输入法改为了 `ENG`

## 安装 im-select.exe

在 [GitHub im-select 仓库](https://github.com/daipeihust/im-select) 处提供了 [下载连接](https://github.com/daipeihust/im-select/raw/master/win/out/x86/im-select.exe)，将下载下来的 im-select.exe 放在任何一个位置，并且记录这个位置

你可以在终端尝试调用：

```ps1 | lang:PowerShell
im-select

# 这会按照现在的输入法返回不同的值
# 一般来说中文为 2052；英文为 1033
# 若是你的返回值不同则需要更改下面的 lua 代码
```

通过调用 `im-select 1033` 或者 `im-select 2052` 则可以切换当前的输入法

## Lazyvim 配置

在 `$env:LOCALAPPDATA\nvim\lua\config\autocmds.lua` 文件中添加：

```lua autocmd.lua(partial) | lang:lua
-- 自动切换输入法
local imselect = "${输入你下载的 im-select.exe 的位置}"
-- 可能要按照你的 im-select 返回值更改下面的两个参数
local eng_im = "1033"
local ch_im = "2052"

vim.api.nvim_create_augroup("AutoSwitchIM", { clear = true })

vim.api.nvim_create_autocmd("InsertEnter", {
	group = "AutoSwitchIM",
	pattern = "*",
	callback = function()
		vim.fn.jobstart({ imselect, ch_im })
	end,
})

vim.api.nvim_create_autocmd("InsertLeave", {
	group = "AutoSwitchIM",
	pattern = "*",
	callback = function()
		vim.fn.jobstart({ imselect, eng_im })
	end,
})

vim.api.nvim_create_autocmd("VimEnter", {
	group = "AutoSwitchIM",
	pattern = "*",
	callback = function()
		vim.fn.jobstart({ imselect, eng_im })
	end,
})

vim.api.nvim_create_autocmd("VimLeave", {
	group = "AutoSwitchIM",
	pattern = "*",
	callback = function()
		vim.fn.jobstart({ imselect, ch_im })
	end,
})
```
