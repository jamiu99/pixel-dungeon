# 像素地牢 Web版 (Pixel Dungeon Web)

一个基于原版 **Pixel Dungeon** 的网页版复刻，使用纯 HTML5 Canvas 实现。

## 🎮 游戏简介

像素地牢是一款经典的 Roguelike 地牢探险游戏。在这个 Web 版本中，你将：
- 探索随机生成的地牢
- 击败各种怪物
- 收集装备和道具
- 不断升级你的角色
- 挑战强大的 Boss

## ✨ 特性

- ✅ **完整汉化** - 所有界面和文本都是中文
- ✅ **单文件运行** - 可以直接在浏览器中打开 HTML 文件运行
- ✅ **随机地图生成** - 每次游戏都有不同的地图布局
- ✅ **完整战斗系统** - 回合制战斗，伤害计算，经验升级
- ✅ **物品系统** - 生命药水等可用物品
- ✅ **怪物 AI** - 怪物会追踪并攻击玩家
- ✅ **视野系统** - 战争迷雾效果
- ✅ **响应式设计** - 支持桌面和移动设备

## 📁 文件说明

```
web-version/
├── pixel-dungeon.html          # 完整单文件版本（推荐使用）
├── ASSETS_LIST.md              # 游戏资源清单（所有素材来源）
├── README.md                   # 本文档
├── build-single-html.js        # Node.js 版本的聚合脚本
├── build-single-html.py        # Python 版本的聚合脚本
├── src/                        # 源代码分离版本（可选）
│   ├── index.html             # HTML 结构
│   ├── style.css              # 样式表
│   └── game.js                # 游戏逻辑
└── dist/                       # 构建输出目录
    └── pixel-dungeon-single.html
```

## 🚀 快速开始

### 方式 1: 直接运行（推荐）

1. 直接用浏览器打开 `pixel-dungeon.html` 文件
2. 点击"开始游戏"按钮
3. 享受游戏！

### 方式 2: 从源代码构建

如果你想从分离的 HTML/CSS/JS 文件构建单文件版本：

**使用 Python:**
```bash
python3 build-single-html.py
```

**使用 Node.js:**
```bash
node build-single-html.js
```

构建后的文件在 `dist/pixel-dungeon-single.html`

## 🎯 游戏操作

### 键盘操作
- **方向键** 或 **WASD** - 移动角色
- **空格键** - 等待一回合
- **数字键 1-9** - 使用背包中的物品

### 鼠标/触摸操作
- 点击屏幕右下角的方向按钮移动
- 点击背包中的物品使用

### 游戏规则
- 移动到怪物位置会自动发起攻击
- 移动到物品位置会自动拾取
- 移动到金色楼梯可以进入下一层
- 击败怪物获得经验值升级
- 到达第 5 层击败 Boss 即可获胜

## 🎨 资源替换指南

当前版本使用纯色方块代替原始像素艺术。如需使用原始素材：

1. 参考 `ASSETS_LIST.md` 查看所需的所有资源
2. 将图片上传到图床（如 imgur, imgbb 等）
3. 在 HTML 文件中查找 `CONFIG.COLORS` 配置
4. 将颜色值替换为图片 URL
5. 修改渲染代码以使用图片而非纯色

### 示例：替换玩家精灵

```javascript
// 原代码（使用颜色）
ctx.fillStyle = CONFIG.COLORS.PLAYER;
ctx.fillRect(x, y, size, size);

// 修改后（使用图片）
const playerImg = new Image();
playerImg.src = 'https://your-image-host.com/warrior.png';
ctx.drawImage(playerImg, x, y, size, size);
```

## 🛠️ 技术栈

- **HTML5 Canvas** - 游戏渲染
- **原生 JavaScript (ES6+)** - 游戏逻辑
- **CSS3** - 界面样式
- **无依赖** - 不需要任何外部库

## 📊 游戏数据

### 角色属性
- **初始生命值**: 20 HP
- **初始攻击**: 2-6
- **初始防御**: 0
- **升级成长**: 每级 +5 HP, +1-2 攻击, +1 防御

### 怪物类型
- **老鼠** - 初级怪物，血少攻低
- **螃蟹** - 中级怪物，有一定防御
- **BOSS-粘液怪** - 第 5 层 Boss，高血高攻

### 道具
- **生命药水** - 恢复 10 点生命值

## 🗺️ 关卡设计

| 楼层 | 描述 | 怪物 | Boss |
|------|------|------|------|
| 1-4层 | 下水道 | 老鼠、螃蟹 | - |
| 5层 | Boss层 | 精英怪 | 粘液怪 |

## 📝 开发说明

### 主要类结构

```
Game                 # 游戏主类
├── MapGenerator    # 地图生成器
├── Player          # 玩家角色
├── Monster         # 怪物
├── Item            # 物品
└── Utils           # 工具函数
```

### 添加新怪物

```javascript
class NewMonster extends Monster {
    constructor(x, y) {
        super(
            x, y,
            '新怪物',      // 名称
            15,            // HP
            3,             // 攻击力
            1,             // 防御力
            '#color',      // 颜色
            5              // 经验值
        );
    }
}
```

### 添加新物品

```javascript
class NewItem extends Item {
    constructor(x, y) {
        super(x, y, '新物品', 'type');
    }

    use(player) {
        // 物品效果逻辑
        game.addMessage('使用了新物品', 'info');
    }
}
```

## 🔧 自定义配置

在 `CONFIG` 对象中可以修改以下参数：

```javascript
const CONFIG = {
    TILE_SIZE: 24,        // 地图格子大小
    MAP_WIDTH: 32,        // 地图宽度
    MAP_HEIGHT: 32,       // 地图高度
    VIEW_RADIUS: 6,       // 视野半径
    // ... 更多配置
};
```

## 📜 许可证

本项目基于原版 **Pixel Dungeon** (GPL v3) 开发。

- 原作者: Oleg Dolya (watabou)
- 原项目: https://github.com/watabou/pixel-dungeon
- 许可证: GNU General Public License v3.0

所有游戏素材（图片、音效等）版权归原作者所有。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

改进建议：
- [ ] 添加音效和背景音乐
- [ ] 使用原始像素艺术资源
- [ ] 增加更多楼层和怪物类型
- [ ] 添加装备系统
- [ ] 实现商店和 NPC
- [ ] 添加更多物品和技能
- [ ] 优化移动端体验
- [ ] 添加存档功能

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 GitHub Issue
- 查看原版游戏: https://github.com/watabou/pixel-dungeon

## 🎉 致谢

感谢 Oleg Dolya 创造了这款经典的 Roguelike 游戏！

---

**享受游戏，探索地牢！** 🗡️🛡️✨
