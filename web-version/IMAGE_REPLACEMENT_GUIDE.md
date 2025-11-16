# 图片资源替换指南

本文档详细说明如何将游戏中的纯色方块替换为真实的像素艺术图片。

## 📋 准备工作

### 1. 提取原始资源

从项目的 `/assets/` 目录中，你需要以下图片：

**必需资源：**
- `warrior.png` - 战士角色
- `rat.png` - 老鼠怪物
- `crab.png` - 螃蟹怪物
- `goo.png` - Boss（粘液怪）
- `tiles0.png` - 地图图块
- `items.png` - 物品图集

**可选资源（增强效果）：**
- `hp_bar.png` - 生命值条
- `icons.png` - UI图标
- `effects.png` - 特效
- 音效文件 (`snd_*.mp3`)

### 2. 上传到图床

将图片上传到任意图床服务：
- [ImgBB](https://imgbb.com/) - 免费，支持直链
- [Imgur](https://imgur.com/) - 老牌图床
- [SM.MS](https://sm.ms/) - 国内访问快
- [路过图床](https://imgse.com/) - 国内服务

**上传后保存每个图片的直链 URL！**

## 🎨 替换方法

### 方法 1: 简单替换（推荐新手）

1. 打开 `pixel-dungeon.html` 文件
2. 找到 `CONFIG.COLORS` 部分（约在第 200 行）
3. 按照下面的对照表替换

#### 替换对照表

```javascript
// 原配置（使用颜色）
const CONFIG = {
    COLORS: {
        PLAYER: '#0f0',      // 玩家 - 替换为 warrior.png
        RAT: '#8b4513',      // 老鼠 - 替换为 rat.png
        CRAB: '#ff6347',     // 螃蟹 - 替换为 crab.png
        BOSS: '#f00',        // Boss - 替换为 goo.png
        ITEM: '#ffd700',     // 物品 - 替换为 items.png
        // ... 其他配置
    }
};

// 新配置（使用图片URL）
const CONFIG = {
    IMAGES: {
        PLAYER: 'https://你的图床.com/warrior.png',
        RAT: 'https://你的图床.com/rat.png',
        CRAB: 'https://你的图床.com/crab.png',
        BOSS: 'https://你的图床.com/goo.png',
        ITEM: 'https://你的图床.com/items.png',
        // 地形图块
        TILES: 'https://你的图床.com/tiles0.png',
    },
    // 保留COLORS作为后备
    COLORS: { /* ... */ }
};
```

### 方法 2: 完整图片渲染系统

如果你想要完整的图片支持，需要修改渲染代码。

#### Step 1: 添加图片加载器

在 `<script>` 标签开始处添加：

```javascript
// ==================== 图片资源管理器 ====================
class AssetLoader {
    constructor() {
        this.images = {};
        this.loaded = false;
        this.totalImages = 0;
        this.loadedImages = 0;
    }

    addImage(name, url) {
        const img = new Image();
        img.src = url;
        this.totalImages++;

        img.onload = () => {
            this.loadedImages++;
            if (this.loadedImages === this.totalImages) {
                this.loaded = true;
                console.log('所有图片加载完成！');
            }
        };

        img.onerror = () => {
            console.error(`图片加载失败: ${url}`);
            this.loadedImages++;
        };

        this.images[name] = img;
    }

    get(name) {
        return this.images[name];
    }
}

// 创建资源加载器实例
const assets = new AssetLoader();

// 加载所有图片资源
assets.addImage('warrior', 'https://你的图床.com/warrior.png');
assets.addImage('rat', 'https://你的图床.com/rat.png');
assets.addImage('crab', 'https://你的图床.com/crab.png');
assets.addImage('goo', 'https://你的图床.com/goo.png');
assets.addImage('potion', 'https://你的图床.com/items.png');
assets.addImage('tiles', 'https://你的图床.com/tiles0.png');
```

#### Step 2: 修改渲染代码

找到 `render()` 方法中的玩家渲染部分（约在第 900 行）：

```javascript
// 原代码（渲染纯色方块）
ctx.fillStyle = this.player.sprite;
ctx.fillRect(
    playerScreenX + 4,
    playerScreenY + 4,
    CONFIG.TILE_SIZE - 8,
    CONFIG.TILE_SIZE - 8
);

// 新代码（渲染图片）
if (assets.loaded && assets.get('warrior')) {
    ctx.drawImage(
        assets.get('warrior'),
        playerScreenX,
        playerScreenY,
        CONFIG.TILE_SIZE,
        CONFIG.TILE_SIZE
    );
} else {
    // 图片未加载时的后备方案
    ctx.fillStyle = this.player.sprite;
    ctx.fillRect(
        playerScreenX + 4,
        playerScreenY + 4,
        CONFIG.TILE_SIZE - 8,
        CONFIG.TILE_SIZE - 8
    );
}
```

#### Step 3: 修改怪物渲染

在怪物渲染部分（约在第 880 行）：

```javascript
// 渲染怪物
for (const monster of this.monsters) {
    if (monster.alive) {
        const dist = Utils.distance(this.player.x, this.player.y, monster.x, monster.y);
        if (dist <= CONFIG.VIEW_RADIUS) {
            const screenX = (monster.x - cameraX) * CONFIG.TILE_SIZE;
            const screenY = (monster.y - cameraY) * CONFIG.TILE_SIZE;

            // 根据怪物类型选择图片
            let imageName = 'rat'; // 默认
            if (monster.name.includes('螃蟹')) imageName = 'crab';
            if (monster.name.includes('BOSS')) imageName = 'goo';

            if (assets.loaded && assets.get(imageName)) {
                ctx.drawImage(
                    assets.get(imageName),
                    screenX,
                    screenY,
                    CONFIG.TILE_SIZE,
                    CONFIG.TILE_SIZE
                );
            } else {
                // 后备方案
                ctx.fillStyle = monster.sprite;
                ctx.fillRect(
                    screenX + 3,
                    screenY + 3,
                    CONFIG.TILE_SIZE - 6,
                    CONFIG.TILE_SIZE - 6
                );
            }

            // 血条渲染保持不变
            // ...
        }
    }
}
```

### 方法 3: 使用精灵图集（高级）

原版 Pixel Dungeon 使用精灵图集（sprite sheet）来存储多个精灵。

#### 精灵图集结构

例如 `warrior.png` 包含多个动画帧，排列如下：
```
[站立] [行走1] [行走2] [攻击1] [攻击2] [死亡]
```

#### 渲染精灵图集

```javascript
/**
 * 从精灵图集中绘制特定帧
 * @param {Image} spriteSheet - 精灵图集
 * @param {number} frameX - 帧的X索引
 * @param {number} frameY - 帧的Y索引
 * @param {number} frameWidth - 每帧宽度
 * @param {number} frameHeight - 每帧高度
 * @param {number} x - 绘制位置X
 * @param {number} y - 绘制位置Y
 * @param {number} width - 绘制宽度
 * @param {number} height - 绘制高度
 */
function drawSprite(spriteSheet, frameX, frameY, frameWidth, frameHeight, x, y, width, height) {
    ctx.drawImage(
        spriteSheet,
        frameX * frameWidth,      // 源图X
        frameY * frameHeight,     // 源图Y
        frameWidth,               // 源图宽度
        frameHeight,              // 源图高度
        x,                        // 目标X
        y,                        // 目标Y
        width,                    // 目标宽度
        height                    // 目标高度
    );
}

// 使用示例
drawSprite(
    assets.get('warrior'),  // 精灵图集
    0, 0,                   // 第0帧（站立）
    12, 15,                 // 每帧尺寸（原始尺寸）
    playerScreenX,          // 绘制位置
    playerScreenY,
    CONFIG.TILE_SIZE,       // 绘制尺寸
    CONFIG.TILE_SIZE
);
```

## 🎵 添加音效

### 加载音效

```javascript
class SoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
    }

    load(name, url) {
        const audio = new Audio(url);
        audio.preload = 'auto';
        this.sounds[name] = audio;
    }

    play(name) {
        if (!this.enabled || !this.sounds[name]) return;

        const sound = this.sounds[name].cloneNode();
        sound.volume = 0.5;
        sound.play().catch(e => console.log('音效播放失败:', e));
    }
}

// 创建音效管理器
const soundManager = new SoundManager();

// 加载音效
soundManager.load('step', 'https://你的图床.com/snd_step.mp3');
soundManager.load('hit', 'https://你的图床.com/snd_hit.mp3');
soundManager.load('death', 'https://你的图床.com/snd_death.mp3');
soundManager.load('levelup', 'https://你的图床.com/snd_levelup.mp3');
```

### 在游戏中使用

```javascript
// 移动时
movePlayer(dx, dy) {
    // ... 移动逻辑
    soundManager.play('step');
}

// 攻击时
attack(target) {
    const damage = this.player.attack(target);
    soundManager.play('hit');
    // ...
}

// 升级时
levelUp() {
    // ... 升级逻辑
    soundManager.play('levelup');
}
```

## 📝 资源URL清单模板

创建这个清单，填入你的图床URL：

```javascript
const ASSET_URLS = {
    // 角色
    warrior: 'https://your-imagehost.com/warrior.png',

    // 怪物
    rat: 'https://your-imagehost.com/rat.png',
    crab: 'https://your-imagehost.com/crab.png',
    goo: 'https://your-imagehost.com/goo.png',

    // 地形
    tiles0: 'https://your-imagehost.com/tiles0.png',

    // 物品
    items: 'https://your-imagehost.com/items.png',

    // UI
    hp_bar: 'https://your-imagehost.com/hp_bar.png',
    icons: 'https://your-imagehost.com/icons.png',

    // 音效
    snd_step: 'https://your-imagehost.com/snd_step.mp3',
    snd_hit: 'https://your-imagehost.com/snd_hit.mp3',
    snd_death: 'https://your-imagehost.com/snd_death.mp3',
    snd_levelup: 'https://your-imagehost.com/snd_levelup.mp3',
};
```

## ⚠️ 注意事项

1. **CORS 问题**: 某些图床可能有跨域限制，选择支持直链的图床
2. **文件大小**: 注意图片文件大小，太大会影响加载速度
3. **加载等待**: 添加加载进度条，等待所有资源加载完成后再开始游戏
4. **错误处理**: 图片加载失败时使用颜色方块作为后备方案
5. **缓存**: 浏览器会缓存图片，修改后可能需要强制刷新（Ctrl+F5）

## 🔍 测试检查清单

- [ ] 所有图片URL都正确无误
- [ ] 图片都能正常加载（检查浏览器控制台）
- [ ] 精灵尺寸匹配（不拉伸变形）
- [ ] 动画流畅（如果实现了动画）
- [ ] 音效能正常播放
- [ ] 移动端也能正常显示
- [ ] 没有CORS错误

## 💡 优化建议

1. **使用CDN**: 将资源上传到CDN，提高加载速度
2. **图片压缩**: 使用工具压缩PNG文件（如TinyPNG）
3. **Base64内嵌**: 对于小图标，可以转换为Base64直接内嵌在HTML中
4. **懒加载**: 只加载当前需要的资源
5. **雪碧图优化**: 将多个小图合并为一张大图减少请求

## 🆘 常见问题

**Q: 图片显示不出来？**
A: 检查URL是否正确，浏览器控制台是否有CORS错误

**Q: 图片拉伸变形？**
A: 检查原始图片尺寸和目标渲染尺寸是否匹配

**Q: 音效不播放？**
A: 现代浏览器需要用户交互后才能播放音频，添加一个"开启声音"按钮

**Q: 加载太慢？**
A: 压缩图片，使用CDN，或减少资源数量

---

完成资源替换后，你将拥有一个具有完整像素艺术风格的Web版像素地牢！🎮✨
