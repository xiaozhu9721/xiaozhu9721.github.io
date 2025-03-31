/**
 * Copyright (c) 2016 hustcc
 * License: MIT
 * Version: v1.0.1
 * GitHub: https://github.com/hustcc/canvas-nest.js
 **/

!function() {
    // 辅助函数：获取 DOM 元素的属性值，如果不存在则返回默认值
    function n(n, e, t) {
        return n.getAttribute(e) || t; // 获取元素的属性值，如果不存在则返回默认值
    }

    // 获取指定标签名的所有 DOM 元素
    function e(n) {
        return document.getElementsByTagName(n); // 返回指定标签名的 DOM 元素集合
    }

    // 获取配置参数：从最后一个 <script> 标签中提取参数
    function t() {
        var t = e("script"), // 获取所有 <script> 标签
            o = t.length,    // 获取 <script> 标签的数量
            i = t[o - 1];    // 获取最后一个 <script> 标签

        return {
            l: o,            // 脚本加载顺序
            z: n(i, "zIndex", -1), // 获取 zIndex 属性，默认值为 -1
            o: n(i, "opacity", .5), // 获取 opacity 属性，默认值为 0.5
            c: n(i, "color", "0,0,0"), // 获取 color 属性，默认值为 "0,0,0"
            n: n(i, "count", 99) // 获取 count 属性，默认值为 99
        };
    }

    // 设置 Canvas 的宽高
    function o() {
        a = m.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth, // 设置 Canvas 宽度为窗口宽度
        c = m.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; // 设置 Canvas 高度为窗口高度
    }

    // 动画循环：绘制粒子和连线
    function i() {
        r.clearRect(0, 0, a, c); // 清除 Canvas 上的绘图内容

        var n, e, t, o, m, l; // 定义变量用于计算和绘图

        s.forEach(function(i, x) { // 遍历粒子数组
            for (i.x += i.xa, i.y += i.ya, // 更新粒子的 x 和 y 坐标
                 i.xa *= i.x > a || i.x < 0 ? -1 : 1, // 如果粒子超出边界，则反转 x 方向
                 i.ya *= i.y > c || i.y < 0 ? -1 : 1, // 如果粒子超出边界，则反转 y 方向
                 r.fillRect(i.x - .5, i.y - .5, 1, 1); // 绘制粒子点
                 e = x + 1; e < u.length; e++) { // 遍历后续粒子
                n = u[e]; // 获取当前粒子

                if (null !== n.x && null !== n.y) { // 如果粒子存在
                    o = i.x - n.x, // 计算两个粒子的 x 距离
                    m = i.y - n.y, // 计算两个粒子的 y 距离
                    l = o * o + m * m; // 计算两个粒子之间的距离平方

                    if (l < n.max) { // 如果距离小于最大值
                        if (n === y && l >= n.max / 2) { // 如果是鼠标粒子且距离大于最大值的一半
                            i.x -= .03 * o, // 推动粒子远离鼠标
                            i.y -= .03 * m;
                        }

                        t = (n.max - l) / n.max; // 计算透明度因子
                        r.beginPath(), // 开始绘图
                        r.lineWidth = t / 2, // 设置连线宽度
                        r.strokeStyle = "rgba(" + d.c + "," + (t + .2) + ")", // 设置连线颜色和透明度
                        r.moveTo(i.x, i.y), // 从当前粒子开始
                        r.lineTo(n.x, n.y), // 连接到目标粒子
                        r.stroke(); // 绘制连线
                    }
                }
            }
        });

        x(i); // 调用动画循环
    }

    // 定义变量
    var a, c, u, // 定义全局变量
        m = document.createElement("canvas"), // 创建 Canvas 元素
        d = t(), // 获取配置参数
        l = "c_n" + d.l, // 生成 Canvas ID
        r = m.getContext("2d"), // 获取 Canvas 的 2D 绘图上下文
        x = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(n) {
            window.setTimeout(n, 1e3 / 45); // 如果不支持 requestAnimationFrame，则使用 setTimeout
        },
        w = Math.random, // 缓存 Math.random 函数
        y = {
            x: null,
            y: null,
            max: 2e4 // 鼠标粒子的最大距离平方
        };

    // 设置 Canvas 样式
    m.id = l, // 设置 Canvas ID
    m.style.cssText = "position:fixed;top:0;left:0;z-index:" + d.z + ";opacity:" + d.o, // 设置 Canvas 样式
    e("body")[0].appendChild(m); // 将 Canvas 添加到页面中

    // 设置窗口大小变化时的处理函数
    window.onresize = o;

    // 设置鼠标移动时的处理函数
    window.onmousemove = function(n) {
        n = n || window.event, // 获取事件对象
        y.x = n.clientX, // 更新鼠标 x 坐标
        y.y = n.clientY; // 更新鼠标 y 坐标
    };

    // 设置鼠标离开窗口时的处理函数
    window.onmouseout = function() {
        y.x = null, // 重置鼠标 x 坐标
        y.y = null; // 重置鼠标 y 坐标
    };

    // 初始化粒子数组
    for (var s = [], f = 0; d.n > f; f++) {
        var h = w() * a, // 随机生成 x 坐标
            g = w() * c, // 随机生成 y 坐标
            v = 2 * w() - 1, // 随机生成 x 方向速度
            p = 2 * w() - 1; // 随机生成 y 方向速度

        s.push({ // 添加粒子到数组
            x: h, // 粒子的 x 坐标
            y: g, // 粒子的 y 坐标
            xa: v, // 粒子的 x 方向速度
            ya: p, // 粒子的 y 方向速度
            max: 6e3 // 粒子的最大距离平方
        });
    }

    // 合并粒子数组和鼠标粒子
    u = s.concat([y]);

    // 延迟 100ms 后开始动画
    setTimeout(function() {
        i(); // 启动动画循环
    }, 100);
}();
