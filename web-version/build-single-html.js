#!/usr/bin/env node

/**
 * 像素地牢 Web版 - HTML/CSS/JS 聚合脚本
 *
 * 功能：将分离的 HTML, CSS, JS 文件合并成一个单独的 HTML 文件
 * 使用方法：
 *   node build-single-html.js
 *
 * 输入文件：
 *   - src/index.html (HTML 结构)
 *   - src/style.css (样式)
 *   - src/game.js (游戏逻辑)
 *
 * 输出文件：
 *   - dist/pixel-dungeon-single.html (合并后的单文件)
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
    srcDir: path.join(__dirname, 'src'),
    distDir: path.join(__dirname, 'dist'),
    files: {
        html: 'index.html',
        css: 'style.css',
        js: 'game.js'
    },
    output: 'pixel-dungeon-single.html'
};

// 创建输出目录
if (!fs.existsSync(CONFIG.distDir)) {
    fs.mkdirSync(CONFIG.distDir, { recursive: true });
}

// 读取文件
function readFile(filename) {
    const filepath = path.join(CONFIG.srcDir, filename);
    if (!fs.existsSync(filepath)) {
        console.warn(`警告: 文件 ${filename} 不存在，跳过...`);
        return '';
    }
    return fs.readFileSync(filepath, 'utf-8');
}

// 主函数
function buildSingleHTML() {
    console.log('开始构建单文件 HTML...\n');

    // 读取源文件
    let html = readFile(CONFIG.files.html);
    const css = readFile(CONFIG.files.css);
    const js = readFile(CONFIG.files.js);

    if (!html) {
        console.error('错误: 找不到 HTML 文件，使用默认模板');
        html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>像素地牢</title>
    <!-- CSS_PLACEHOLDER -->
</head>
<body>
    <div id="gameContainer">
        <canvas id="gameCanvas"></canvas>
        <div id="ui"></div>
    </div>
    <!-- JS_PLACEHOLDER -->
</body>
</html>`;
    }

    // 注入 CSS
    if (css) {
        const styleTag = `<style>\n${css}\n    </style>`;

        // 尝试替换占位符
        if (html.includes('<!-- CSS_PLACEHOLDER -->')) {
            html = html.replace('<!-- CSS_PLACEHOLDER -->', styleTag);
        } else if (html.includes('<link rel="stylesheet"')) {
            // 替换 link 标签
            html = html.replace(/<link[^>]*rel="stylesheet"[^>]*>/g, styleTag);
        } else {
            // 在 head 结束标签前插入
            html = html.replace('</head>', `    ${styleTag}\n</head>`);
        }
        console.log('✓ CSS 已注入');
    }

    // 注入 JS
    if (js) {
        const scriptTag = `<script>\n${js}\n    </script>`;

        // 尝试替换占位符
        if (html.includes('<!-- JS_PLACEHOLDER -->')) {
            html = html.replace('<!-- JS_PLACEHOLDER -->', scriptTag);
        } else if (html.includes('<script src=')) {
            // 替换 script 标签
            html = html.replace(/<script[^>]*src=[^>]*><\/script>/g, scriptTag);
        } else {
            // 在 body 结束标签前插入
            html = html.replace('</body>', `    ${scriptTag}\n</body>`);
        }
        console.log('✓ JavaScript 已注入');
    }

    // 写入输出文件
    const outputPath = path.join(CONFIG.distDir, CONFIG.output);
    fs.writeFileSync(outputPath, html, 'utf-8');

    // 统计信息
    const stats = fs.statSync(outputPath);
    const sizeKB = (stats.size / 1024).toFixed(2);

    console.log('\n构建完成！');
    console.log(`输出文件: ${outputPath}`);
    console.log(`文件大小: ${sizeKB} KB`);
    console.log('\n可以直接在浏览器中打开该文件运行游戏。');
}

// 执行构建
try {
    buildSingleHTML();
} catch (error) {
    console.error('构建失败:', error.message);
    process.exit(1);
}
