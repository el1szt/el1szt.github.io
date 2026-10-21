---
title: Verilog Learning
date: 2026-09-23 20:02:00
tags:
---
**目录**
- [常量](#常量)
- [变量](#变量)
  - [wire型变量](#wire型变量)
  - [reg型变量](#reg型变量)
- [运算](#运算)
  - [有符号与无符号](#有符号与无符号)
  - [位运算](#位运算)
  - [四则运算](#四则运算)
  - [比较运算、逻辑运算](#比较运算逻辑运算)
  - [位拼接](#位拼接)
  - [三目运算符](#三目运算符)
- [组合逻辑与时序逻辑](#组合逻辑与时序逻辑)
  - [组合逻辑](#组合逻辑)
  - [时序逻辑](#时序逻辑)
    - [initial块](#initial块)
    - [always块](#always块)
      - [if-else case](#if-else-case)
      - [for](#for)
      - [同步复位与异步复位](#同步复位与异步复位)
- [输入输出](#输入输出)
- [有限状态机](#有限状态机)
***
# 常量
一般常量格式：`位宽 + ' + 进制 + 数据`  
字符串常量格式：`"字符串"` (本质上是使用8位二进制表示字符，然后拼起来) 

数据高于位宽时会被截断，小于位宽时会无符号扩展，最高位用0补齐
- b/B - 二进制
- o/O - 八进制
- d/D - 十进制
- h/H - 十六进制

数据中间可以使用下划线分位，无实际作用
如：`32'hffff_ffff`

# 变量
定义变量：`wire/reg [最左边位数:最右边位数] 变量名`  
定义数组：`wire/reg [最左边位数:最右边位数] 数组名 [0:数组最后一个位置]`  
n维数组(以4维5位reg数组reg1为例)：`reg [4:0] reg1 [0:3][0:63][0:15][0:255]`  
调用变量中某几位：`wire1[0] wire1[4] wire1[3:2]`  
使用 `[]` 截取变量的一位时，可以使用 `integer` 型变量 `i` ，如： `wire1[i]`  
截取多位时， `wire1[i + 15:i]` 违法因为 `i is not a constant` , 此时需要写成 `wire1[i +: 16]` ，表示从 `i` 位开始连续取出16位

## wire型变量
本质导线(wire)， wire型变量的值就是导线内部的值，不能自己赋值给自己  

`assign wire1 = wire1 + 5'b00001` 是错误的

`assign` 语句表示导线的连接关系，等号后的导线将自身内部的值传递给等号前面的导线，如：`assign wire2 = wire1` 将 `wire1` 导线的值传给 `wire2` 

导线间的运算 ~~好累啊不想写~~  

![alt text](图3.4.8：阻塞赋值7-1.png)

```verilog
wire [15:0] wire1;
wire [31:0] wire2;
wire [31:0] wire3;
wire [4:0] wire4;
wire [4:0] wire5;
wire [31:0] wire6;
wire wire7;

assign wire2 = (wire7 == 1'b0) ? 32'h00000000 :
               (wire1[15] == 1'b0) ? wire6 : (32'h00000000 + wire6);
assign wire3 = {{21{1'b0}}, 1'b1, wire1[9:0]};
assign wire4 = wire5 - 5'b01111;
assign wire5 = wire1[14:10];
assign wire6 = (wire4 < 5'b01010) ? (wire3 << (wire4 - 5'b01011)) : (wire3 >> (5'b01011 - wire4));
assign wire7 = (5'b01111 > wire5) & ~(5'b11111 > wire5);
```

## reg型变量

本质寄存器(register)，可以自己赋值给自己
`reg1 = reg1 + 5'b00001`  

# 运算

> **写在前面：请随时注意运算时的位宽，位宽不同可能导致问题**  
## 有符号与无符号
在 Verilog 中，所有的常量和变量默认都是无符号的，在运算时也默认遵循无符号的运算规则。  
标识符 `$signed()` 可以使包括的常量和变量被理解为有符号，但尽量不要用它包括一整个表达式  

“传染规则”：但凡整个表达式中有任何一个部分是无符号的，整个表达式都会被传染为无符号运算  
因此，尽量保证运算时分布进行，防止整个表达式中所有符号运算变成无符号运算，也方便debug  
## 位运算

按位与：`&`  
按位或：`|`  
按位异或：`^`  
按位取反：`~`  

除了常规运算外，`&` `|` `^`还可作为单目运算符，直接作用于一个常量或者变量之前，表示将变量/常量一位一位拆开，作该种运算，最终得到一个一位常量。如： `^5'b10101` 结果为 `1'b1`

左移：`<<` `32'h0000ffff << 5'b10000` $\rightarrow$ `32'hffff0000`  
逻辑右移：`>>` `32'hffff0000 >> 5'10000` $\rightarrow$ `32'h0000ffff`  
算数右移：`>>>` `$signed(32'hffff0000) >>> 5'10000 ` $\rightarrow$ `32'hffffffff`  
`32'hffff0000 >>> 5'10000 ` $\rightarrow$ `32'h0000ffff`  

## 四则运算

加减乘除：`+ - * /`  

## 比较运算、逻辑运算

常规符号：`<` `>` `<=` `>=` `==` `!=`  
特殊符号：`===` `!==`  
区别：当 `==` `!=` 的两端出现 `x` `z` 时，结果为不定值 `1'bx`  
而 `===` `!==` 会直接将 `x` `z` 进行比较

## 位拼接

使用 `{}` 可以将几个常量或者变量直接拼接在一起,如：`{5'b10101, 3'b111, 1'b0}` 结果为：`9'b101011110`  
在大括号左边写上数字，外层再套一层大括号，就可以重复大括号中的内容相应的次数，如：`{8{1'b1}}` 就是 `8'b11111111`, `{{8{1'b1}}, 1'b0} == 9'b111111110` <mark>注意有两层大括号！！！</mark>

CPU中常用的符号扩展`assign extended = {{16{imm[15]}}, imm};`  

## 三目运算符

`?:`  
作用：当问号前面的条件成立的时候，表达式的值为冒号前面的值，否则为冒号后面的值，如：`(5'b11111 == 5'b11111) ? 3'b111 : 3'b000` 显然结果是 `3'b111`  

常用结构：
```verilog
assign res = (cond == 2'b00) ? 1'b1 :  
             (cond == 2'b01) ? 1'b0 :  
             (cond == 2'b10) ? 1'b0 : 1'b1;
```
这个表达式就类似于一连串的 if - else if - else 结构，或者说 switch - case - default 结构：当 `cond` 为 `2'b00` 时，`res` 为 `1'b1` ；当 `cond` 为 `2'b01` 时，`res` 为 `1'b0` ；当 `cond` 为 `2'b10` 时，`res` 为 `1'b0` ；否则 `res` 为 `1'b1` 。注意这种连串的三目运算符表达式必须有结尾的 else（或者说 default ）部分！

```verilog
assign res = (op == 2'b00) ? (a << b) :
             (op == 2'b01) ? (a >> b) :
             (op == 2'b10) ? ($signed(a) >>> b) : 4'h0;
```
另外两个选项 `a << b` 和 `a >> b` 的无符号会传染给`$signed(a) >>> b$`，导致它也变成无符号运算，所以这里的算术右移就失效了！

正确做法是使用一个变量单独保存需要有符号计算的选项  
```verilog
assign temp = $signed(a) >>> b;
assign res = (op == 2'b00) ? (a << b) :
             (op == 2'b01) ? (a >> b) :
             (op == 2'b10) ? temp : 4'h0;
```

# 组合逻辑与时序逻辑

## 组合逻辑
特点：输出只有当前输入决定，不保存历史信息

常见两种写法：

```verilog
assign y = sel ? a : b;
```

或者：
```verilog
always @(*) begin
    if (sel)
        y = a;
    else
        y = b;
end
```
使用 `begin` 和 `end` 代替了 `{}`  
**组合逻辑通常使用阻塞赋值**

## 时序逻辑
特点：包含寄存器，需要保存历史信息

### initial块

```verilog
reg [4:0] reg1;

initial begin
    reg1 = 5'b10101;
end
```
用于初始化内容

### always块
`always @(...)` 是一种固定写法，括号中间的内容是 `always` 块的触发条件，也就是一旦出现了括号中的内容，`always` 块中的代码就会执行一次。  

```verilog
wire clk;
wire [4:0] wire1;
wire [4:0] wire2;
reg [4:0] reg1;

always @(posedge clk) begin
    reg1 <= wire1;
end

assign wire2 = reg1;
```
`posedge clk` 表示的就是 `clk` 处于上升沿，反之 `negedge clk` 表示的就是 `clk` 处于下降沿。所以 `always @(posedge clk)` 的意思就是每当 `clk` 处于上升沿，就执行一次 `always` 块中的内容，也就是 `reg1 <= wire1` 。这里的赋值是非阻塞赋值。  

Verilog 支持在同一个 `always` 块中给多个 `reg` 型变量赋值，也接受多个寄存器串联在一起的形式，就像这样：

![alt text](图3.4.11：非阻塞赋值3.png)

写成 Verilog 代码就是：

```verilog
wire clk;
wire [4:0] wire1;
wire [4:0] wire2;
wire [4:0] wire3;
wire [4:0] wire4;
reg [4:0] reg1;
reg [4:0] reg2;
reg [4:0] reg3;

always @(posedge clk) begin
    reg1 <= wire1;
    reg2 <= reg1;
    reg3 <= wire3;
end

assign wire2 = reg2;
assign wire4 = reg3;
```

从这里我们也可以发现一些非阻塞赋值符号的特点，那就是非阻塞赋值符号 `<=` 的赋值规则和寄存器是相同的。在上面的例子中，当 `clk` 处于上升沿时，执行了 `reg1 <= wire1` 和 `reg2 <= reg1` 这样两个赋值。如果从编程语言的角度来看，我们先将 `wire1` 的值赋给了 `reg1` ，又将 `reg1` 的值赋给了 `reg2` ，那么此时三者的值应该是相等的。

然而事实并非是这样，我们在 Logisim 中模拟一下上面的电路就可以很容易知道，此时 `wire1` 和 `reg1` 的值是相等的，但 `reg2` 的值却不一定与它们相等，而是等于上一个周期 `reg1` 的值。这是因为上面的两次赋值并不是先后进行的，而是同时进行的。也就是说，在 `wire1` 将值赋给 `reg1` 的同时，还没有接收到新值的 `reg1` 就已经将自身的值赋给了 `reg2` 。

当然，这也就呼应了非阻塞赋值的名字，上面代码中 `always` 块中的 3 条赋值语句之间并没有谁先谁后的阻塞关系，它们都是在 `clk` 到达上升沿的一瞬间同时进行的。 

相反的，若是阻塞赋值，那么在同一个过程块中，后一条语句能看到前一条语句赋值的结果。

**对同一个变量，尽量只在一个 `always` 块中对其赋值**

#### if-else case

在 `always` 块中，`if-else` 语句可以使用  
当 `reset` 为0时，寄存器正常更新；当 `reset` 为1时，寄存器值归零。

```verilog
wire clk;
wire reset;
reg [4:0] reg1;

always @(posedge clk) begin
    if (reset) begin
        reg1 <= 5'b00000;
    end
    else begin
        reg1 <= reg1 + 5'b00001;
    end
end
```
除了 `if-else` 语句外还有 `case` 语句  
```verilog
wire clk;
wire reset;
reg [4:0] reg1;

always @(posedge clk) begin
    case (reset)
        1'b1: begin
            reg1 <= 5'b00000;
        end
        1'b0: begin
            reg1 <= reg1 + 5'b00001;
        end
    endcase
end
```
`case` 开头， `endcase` 结尾，不需要 `break`  

#### for
```verilog
wire clk;
wire [31:0] num;
reg [5:0] sum;

integer i;

always @(posedge clk) begin
    sum = 6'b000000;
    for (i = 0; i < 32; i = i + 1) begin
        if (num[i] == 1'b1) begin
            sum = sum + 6'b000001;
        end
    end
end
```

循环变量 `i` 的类型是 `integer` ，Verilog中没有自增运算符 `++` ，所以不能写 `i++` ，要写成 `i = i + 1` ，想要进行多次赋值， `sum` 需要使用阻塞赋值。

笨办法：
```verilog
wire clk;
wire [31:0] num;
reg [5:0] sum;

always @(posedge clk) begin
    sum <= num[0] + num[1] + num[2] + num[3] +
           num[4] + num[5] + num[6] + num[7] +
           num[8] + num[9] + num[10] + num[11] +
           num[12] + num[13] + num[14] + num[15] +
           num[16] + num[17] + num[18] + num[19] +
           num[20] + num[21] + num[22] + num[23] +
           num[24] + num[25] + num[26] + num[27] +
           num[28] + num[29] + num[30] + num[31];
end
```

#### 同步复位与异步复位

像 `always @(posedge clk)` 只有在时钟上升沿才能进入块中的一个分支，才有可能 `reset` 的同步复位  
若想在 `reset` 变为1的同时触发 `always` 块，就需要写异步复位，像：`always @(posedge clk, posedge reset)` 触发条件之间使用 `,` 隔开

# 输入输出
在ISE中创建Verilog文件时可以设置输入输出端口，也可以直接在文件开头处修改
```verilog
module HelloVerilog(
    input a1,
    input [4:0] a2,
    input [31:0] a3,
    output b1,
    output [4:0] b2,
    output [31:0] b3
    );

endmodule
```

未修改变量类型时，默认时 `wire` 型变量

# 有限状态机
定义状态时建议使用 `localparam`  
如：
```verilog
localparam S_IDLE = 2'd0;
localparam S_A    = 2'd1;
localparam S_OK   = 2'd2;
```

Moore型和Mealy型的区别：

| 类型 | 输出取决于 |
|---|---|
| Moore 型 | 当前状态 |
| Mealy 型 | 当前状态和当前输入 |

编写状态机代码之前，应该先画出状态转移图，明确状态数量以及状态转移函数。下面是一个一段式的Moore型状态机，用于识别连续的 `ab` :

```verilog
module ab_checker(
    input        clk,
    input        reset,
    input  [7:0] char,
    output reg   out
);

    localparam S_IDLE = 2'd0;
    localparam S_A    = 2'd1;
    localparam S_OK   = 2'd2;

    reg [1:0] state;

    always @(posedge clk) begin
        if (reset) begin
            state <= S_IDLE;
            out   <= 1'b0;
        end
        else begin
            // 默认输出为 0，匹配成功时才置 1
            out <= 1'b0;

            case (state)
                S_IDLE: begin
                    if (char == "a")
                        state <= S_A;
                    else
                        state <= S_IDLE;
                end

                S_A: begin
                    if (char == "b") begin
                        state <= S_OK;
                        out   <= 1'b1;
                    end
                    else if (char == "a") begin
                        state <= S_A;
                    end
                    else begin
                        state <= S_IDLE;
                    end
                end

                S_OK: begin
                    // 成功后的当前字符仍需识别，
                    // 避免漏掉紧接着出现的新序列
                    if (char == "a")
                        state <= S_A;
                    else
                        state <= S_IDLE;
                end

                default: begin
                    state <= S_IDLE;
                end
            endcase
        end
    end

endmodule
```

当然也可以整理成两段式：

```verilog
module ab_checker(
    input        clk,
    input        reset,
    input  [7:0] char,
    output       out
);

    localparam S_IDLE = 2'd0;
    localparam S_A    = 2'd1;
    localparam S_OK   = 2'd2;

    reg [1:0] state;
    reg [1:0] next_state;

    // 状态寄存器
    always @(posedge clk) begin
        if (reset)
            state <= S_IDLE;
        else
            state <= next_state;
    end

    // 下一状态组合逻辑
    always @(*) begin
        next_state = S_IDLE;

        case (state)
            S_IDLE: begin
                if (char == "a")
                    next_state = S_A;
            end

            S_A: begin
                if (char == "b")
                    next_state = S_OK;
                else if (char == "a")
                    next_state = S_A;
            end

            S_OK: begin
                if (char == "a")
                    next_state = S_A;
            end

            default: begin
                next_state = S_IDLE;
            end
        endcase
    end

    // Moore 输出
    assign out = (state == S_OK);

endmodule
```

在上述两段式状态机中，组合逻辑部分使用阻塞赋值，时序逻辑部分使用非阻塞赋值，并且两个 `always` 块中赋值的变量是不同的。笔者更加中意前者。