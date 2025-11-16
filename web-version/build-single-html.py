#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
像素地牢 Web版 - HTML/CSS/JS 聚合脚本 (Python版本)

功能：将分离的 HTML, CSS, JS 文件合并成一个单独的 HTML 文件
使用方法：
    python3 build-single-html.py

输入文件：
    - src/index.html (HTML 结构)
    - src/style.css (样式)
    - src/game.js (游戏逻辑)

输出文件：
    - dist/pixel-dungeon-single.html (合并后的单文件)
"""

import os
import re
from pathlib import Path

# 配置
SRC_DIR = Path(__file__).parent / 'src'
DIST_DIR = Path(__file__).parent / 'dist'
FILES = {
    'html': 'index.html',
    'css': 'style.css',
    'js': 'game.js'
}
OUTPUT = 'pixel-dungeon-single.html'

def read_file(filename):
    """读取文件内容"""
    filepath = SRC_DIR / filename
    if not filepath.exists():
        print(f'警告: 文件 {filename} 不存在，跳过...')
        return ''

    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def build_single_html():
    """构建单文件 HTML"""
    print('开始构建单文件 HTML...\n')

    # 创建输出目录
    DIST_DIR.mkdir(parents=True, exist_ok=True)

    # 读取源文件
    html = read_file(FILES['html'])
    css = read_file(FILES['css'])
    js = read_file(FILES['js'])

    # 如果没有 HTML 文件，使用默认模板
    if not html:
        print('错误: 找不到 HTML 文件，使用默认模板')
        html = '''<!DOCTYPE html>
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
</html>'''

    # 注入 CSS
    if css:
        style_tag = f'<style>\n{css}\n    </style>'

        # 尝试替换占位符
        if '<!-- CSS_PLACEHOLDER -->' in html:
            html = html.replace('<!-- CSS_PLACEHOLDER -->', style_tag)
        elif '<link rel="stylesheet"' in html:
            # 替换 link 标签
            html = re.sub(r'<link[^>]*rel="stylesheet"[^>]*>', style_tag, html)
        else:
            # 在 head 结束标签前插入
            html = html.replace('</head>', f'    {style_tag}\n</head>')
        print('✓ CSS 已注入')

    # 注入 JS
    if js:
        script_tag = f'<script>\n{js}\n    </script>'

        # 尝试替换占位符
        if '<!-- JS_PLACEHOLDER -->' in html:
            html = html.replace('<!-- JS_PLACEHOLDER -->', script_tag)
        elif '<script src=' in html:
            # 替换 script 标签
            html = re.sub(r'<script[^>]*src=[^>]*></script>', script_tag, html)
        else:
            # 在 body 结束标签前插入
            html = html.replace('</body>', f'    {script_tag}\n</body>')
        print('✓ JavaScript 已注入')

    # 写入输出文件
    output_path = DIST_DIR / OUTPUT
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)

    # 统计信息
    size_kb = output_path.stat().st_size / 1024

    print('\n构建完成！')
    print(f'输出文件: {output_path}')
    print(f'文件大小: {size_kb:.2f} KB')
    print('\n可以直接在浏览器中打开该文件运行游戏。')

if __name__ == '__main__':
    try:
        build_single_html()
    except Exception as e:
        print(f'构建失败: {e}')
        exit(1)
