---
title: markdown learning
date: 2026-10-23 10:23:14
tags:
---
**目录**
- [标题](#标题)
- [文本格式](#文本格式)
- [列表](#列表)
- [引用块](#引用块)
- [代码块](#代码块)
- [链接](#链接)
- [图片](#图片)
- [表格](#表格)
- [高级技巧](#高级技巧)
- [数学公式](#数学公式)
# 标题

`# 一级标题`

`## 二级标题`

`### 三级标题`

`#### 四级标题`

# 文本格式

换行

两个空格+回车\
或者两个回车

***

这是分割线

~~这是删除线~~  被删除了

<u>这是下划线</u>

这是[^脚注]

[^脚注]: 注释

这是 *斜体*

这是 **粗体**

***粗斜体***

`printf`函数

``反引`printf`函数``

```包围``双反引号```

这是<mark>高亮</mark>

# 列表
1. 准备阶段
   1. 收集资料
   2. 制定计划
2. 执行阶段
   1. 开始实施
   2. 监控进度
3. 总结阶段
***
- 水果
  - 苹果
    - 红苹果
    - 绿苹果
  - 香蕉
  - 橙子
- 蔬菜
  - 胡萝卜
  - 白菜
***
* 第一项
  * 第一项的第一个元素
  * 第一项的第二个元素
1. 第二项
   1. 第二项的第一个元素
   2. 第二项的第二个元素
* 第三项
  1. 第三项的第一个元素
  2. 第三项的第二个元素

1. 第一项
   * 第一项的第一个元素
     换行

任务列表
* [ ] 完成测试文档攥写
* [x] 完成

- 这是一个很长的列表项，
  需要换行显示，注意第二行需要与第一行对齐
- 另一个列表项

# 引用块

> 这是一个引用
> 这是引用

> 这是一个长引用
> 这是一个长引用

> 引用中的列表
> 1. 1
> * 2

1. 列表中的引用
   > 引用

> 引用
>
> > 二重引用
> >
> > > 三重引用

> &#x1f4da; **推荐阅读**
> 
> 详细信息请参考 [官方文档](https://example.com)
> 
> ![示例图片](./images/example.png)

> "在软件开发中，最昂贵的错误就是构建正确的系统错误的方式，或者构建错误的系统正确的方式。"
> 
> — Barry Boehm，软件工程专家

> **本章要点**
> 
> - 了解项目背景和目标
> - 掌握核心功能特性
> - 熟悉技术架构设计


\&nbsp
# 代码块

`printf()` 函数

``使用 `反引号` 包围代码``

正常文本段落

    这是缩进式代码块
    每行前面有四个空格
    保持代码的原始格式
    
继续正常文本

`<div>`

三反引号代码块
```C
printf("Hello World!");
```

```
javascript / js - JavaScript
python / py - Python
html - HTML
css - CSS
sql - SQL
json - JSON
xml - XML
yaml / yml - YAML
bash / shell - Shell脚本
java - Java
cpp / c++ - C++
csharp / c# - C#
php - PHP
ruby / rb - Ruby
go - Go语言
rust - Rust
typescript / ts - TypeScript
```

# 链接

这是菜鸟教程的地址[菜鸟教程](https://www.runoob.com/markdown/md-link.html)

[菜鸟教程](https://www.runoob.com/markdown/md-link.html "菜鸟教程")

[Runoob](https://www.runoob.com/markdown/md-link.html)

<https://www.runoob.com/markdown/md-link.html>

[nihao][nihao]

[nihao]: https://www.runoob.com/markdown/md-link.html

同名时简化写法[nihao][]

[nihao]: https://www.runoob.com/markdown/md-link.html
<111@email.com>

<a id = "1"><del>很好</del>很不好</a>


在代码块中的显示应该为

[第一章：介绍](#一级标题) 这里的#不需要空格隔开

[很好](很不好)直接这样写这样跳转不了，需要自己创造锚点

[很好](#1)需要`<a id="custom-anchor"></a>`来自定义锚点位置

[回到顶部](#)

# 图片

![Araya](/images/markdown%20learning/Araya.jpg)

# 表格

基础款：
|  表头   | 表头  |
|  ----  | ----  |
| 单元格  | 单元格 |
| 单元格  | 单元格 |

对齐方式
我们可以设置表格的对齐方式：

---: 设置内容和标题栏居右对齐。
:--- 设置内容和标题栏居左对齐。
:---: 设置内容和标题栏居中对齐。
实例如下：

| 左对齐 | 右对齐 | 居中对齐 |
| :-----| ----: | :----: |
| 单元格 | 单元格 | 单元格 |
| 单元格 | 单元格 | 单元格 |

需要处理的内容过长时：
| 项目 | 详细说明 |
|------|----------|
| 需求分析 | 1. 收集用户需求<br>2. 分析业务场景<br>3. 确定功能范围 |
| 技术选型 | 前端：React + TypeScript<br>后端：Node.js + Express<br>数据库：MongoDB |

表格中的特殊字符
某些字符在表格中有特殊含义，需要转义：

| 字符 | 转义方法 | 示例 |
|------|----------|------|
| 竖线 | `\|` | 显示 \| 符号 |
| 反斜杠 | `\\` | 显示 \\ 符号 |
| HTML | 直接使用 | <code>&lt;div&gt;</code> |

表格美化建议
使用 Emoji 和符号

| 状态 | 图标 | 说明 |
|:----:|:----:|------|
| 完成 | &#x2705; | 任务已完成 |
| 进行中 | &#x1f504; | 正在处理 |
| 待处理 | &#x23f3; | 等待开始 |
| 错误 | &#x274c; | 出现问题 |
| 警告 | &#x26a0;&#xfe0f; | 需要注意 |

# 高级技巧

支持的 HTML 元素
不在 Markdown 涵盖范围之内的标签，都可以直接在文档里面用 HTML 撰写。

目前支持的 HTML 元素有：`<kbd> <b> <i> <em> <sup> <sub> <br>`等 ，如：

使用 <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Del</kbd> 重启电脑

Markdown 支持以下这些符号前面加上反斜杠来帮助插入普通的符号：

\\   反斜线  
\`   反引号  
\*   星号  
\_   下划线  
\{\}  花括号  
\[\]  方括号  
\(\)  小括号  
\#   井字号  
\+   加号  
\-   减号  
\.   英文句点  
\!   感叹号  

# 数学公式

常用 LaTeX 命令

基本语法结构  
命令：以反斜杠 \ 开头，如 \alpha、\sum  
参数：用花括号 {} 包围，如 \frac{a}{b}  
下标：使用 _，如 x_1  
上标：使用 ^，如 x^2  
分组：用花括号将多个字符组合，如 x_{i+1}

\alpha, \beta, \gamma  % 希腊字母  
\sum, \prod, \int      % 求和、乘积、积分  
\frac{分子}{分母}      % 分数  
\sqrt{表达式}          % 平方根  
\sqrt[n]{表达式}       % n次根  

行内公式  
行内公式使用单个美元符号 $ 包围

文本中的变量 $x = 5$ 和函数 $f(x) = x^2 + 2x + 1$。

块级公式  
块级公式使用双美元符号 $$ 包围，公式会独立成行并居中显示：

$$E = mc^2$$

$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$

多行公式  
使用 align 环境创建多行对齐公式：

$$
    \begin{align}
    f(x) &= ax^2 + bx + c \\
    f'(x)  &= 2ax + b \\
    f''(x)  &= 2a
    \end{align}
    $$

常用数学符号  
- 基本运算符号  
加减乘除：+, -, \times, \div  
分数：\frac{a}{b} → $\frac{a}{b}$  
根号：\sqrt{x}, \sqrt[n]{x} → $\sqrt{x}$, $\sqrt[n]{x}$  
指数：x^2, e^{i\pi} → $x^2$, $e^{i\pi}$  

- 比较符号  
等于：=, \neq, \equiv → $=$, $\neq$, $\equiv$  
大小：<, >, \leq, \geq → $<$, $>$, $\leq$, $\geq$  
约等于：\approx, \sim → $\approx$, $\sim$  

- 集合符号  
属于：\in, \notin → $\in$, $\notin$  
包含：\subset, \supset → $\subset$, $\supset$  
交并：\cap, \cup → $\cap$, $\cup$  
空集：\emptyset → $\emptyset$  

- 希腊字母  
常用希腊字母及其 LaTeX 表示：

|小写	|大写	|LaTeX|
|----|----|----|
|α|Α|$\alpha$|
|β|Β|$\beta$|
|γ|Γ|$\gamma$|
|δ|Δ|$\delta$|
|ε|Ε|$\epsilon$|
|θ|Θ|$\theta$|
|λ|Λ|$\lambda$|
|μ|Μ|$\mu$|
|ν|Ν|$\nu$|
|ο|Ο|o|
|π|Π|$\pi$|
|ρ|Ρ|$\rho$|
|σ|Σ|$\sigma$|
|τ|Τ|$\tau$|
|φ|Φ|$\phi$|
|ω|Ω|$\omega$|

- 特殊函数和符号  
三角函数：$\sin$, $\cos$, $\tan$  
对数：$\log$, $\ln$  
极限：$\lim_{x \to 0}$  
求和：$\sum_{i=1}^{n}$  
积分：$\int_{a}^{b}$  
无穷：$\infty$

- 矩阵表示
使用 matrix 环境：

$$
  \begin{pmatrix}
  a & b \\
  c & d
  \end{pmatrix}
$$

不同括号类型的矩阵：

pmatrix：圆括号 

$$
  \begin{pmatrix}
  a & b \\ 
  c & d 
  \end{pmatrix}
$$

bmatrix：方括号 

$$
  \begin{bmatrix} 
  a & b \\
  c & d 
  \end{bmatrix}
$$  

vmatrix：行列式 

$$
  \begin{vmatrix} 
  a & b \\
  c & d \end{vmatrix}
$$