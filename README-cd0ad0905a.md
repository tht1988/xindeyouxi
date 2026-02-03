# 挖矿游戏模块化文件说明

## 📁 文件结构说明

### 核心文件
- **index.html** - 游戏主页面（已修改为模块化版本）
- **style.css** - 游戏样式文件
- **main.js** - 游戏主入口，负责初始化和事件绑定
- **config.js** - 游戏配置（常量、矿物数据、背包扩充配置）
- **items.js** - 物品配置（价格表、配方、堆叠设置）
- **functions.js** - 游戏功能函数库

### 备份文件
- **game.js** - 原始游戏文件（建议保留作为参考）
- **新建文本文档.txt** - 原始HTML文件内容（建议保留作为参考）

## 🚀 如何运行游戏

### 方法一：使用本地服务器（推荐）

#### VSCode + Live Server
1. 安装 VSCode 扩展：Live Server
2. 右键点击 `index.html`
3. 选择 "Open with Live Server"
4. 游戏将在浏览器中自动打开

#### Python 简单服务器
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
然后访问：`http://localhost:8000`

#### Node.js 服务器
```bash
# 全局安装 http-server
npm install -g http-server

# 运行
http-server -p 8000
```
然后访问：`http://localhost:8000`

### 方法二：直接打开（有功能限制）
⚠️ **注意**：由于使用了 ES6 模块（`import/export`），直接双击 HTML 文件可能会因为 CORS 策略导致功能异常。

## 📋 模块功能说明

### config.js - 配置文件
```javascript
// 主要内容：
- GAME_CONSTANTS: 游戏常量（最大等级、存档间隔等）
- minerals: 矿物配置数据（石矿、煤矿、铁矿等）
- backpackExpansions: 背包扩充配置
```

### items.js - 物品配置文件
```javascript
// 主要内容：
- itemPrices: 物品价格表
- smeltRecipes: 熔炼配方
- alloyRecipes: 合金配方
- craftingRecipes: 工具制作配方
- itemStackSizes: 物品堆叠数量
- 工具函数：getItemPrice(), getItemStackSize(), getItemType()
```

### functions.js - 函数库文件
```javascript
// 主要内容：
工具函数：
- showMessage(): 显示消息
- hasEnoughItem(): 检查物品数量
- consumeItem(): 消耗物品
- addToBackpack(): 添加物品到背包

核心功能：
- mineMineral(): 采矿功能
- startContinuousMining(): 连续采矿
- upgradeTool(): 升级工具
- startSmelting(): 开始熔炼
- generateBackpackSlots(): 生成背包格子
- sellItem(): 出售物品
- saveGame(): 保存游戏
- loadGame(): 加载游戏

UI更新：
- updateUI(): 更新所有界面
- updatePlayerInfo(): 更新玩家信息
- updateMineralUI(): 更新矿物界面
- updateShopUI(): 更新商店界面
```

### main.js - 主入口文件
```javascript
// 主要内容：
- gameData: 游戏全局数据
- 导入配置和函数模块
- 初始化游戏 initGame()
- 绑定各种事件监听器
- 扩展功能函数（熔炼、合金、背包制作等）
```

## 🎮 修改指南

### 如何添加新矿物
编辑 `config.js`：
```javascript
const minerals = [
    // ... 现有矿物
    {
        name: "新矿物",
        minLevel: 10,
        maxLevel: 20,
        baseTime: 10,
        exp: 15,
        price: 8,
        drops: [
            { name: "物品名", chance: 0.2 }
        ]
    }
];
```

### 如何修改物品价格
编辑 `items.js`：
```javascript
const itemPrices = {
    '石矿': 2,
    '煤矿': 5,
    '新矿物': 10  // 添加新物品价格
};
```

### 如何添加新配方
编辑 `items.js`：
```javascript
const alloyRecipes = {
    '新合金': {
        name: '新合金',
        input: { '材料1': 2, '材料2': 1 },
        output: '新合金',
        outputAmount: 1,
        time: 10,
        minLevel: 15
    }
};
```

### 如何添加新功能
1. 在 `functions.js` 中添加新函数
2. 在 `main.js` 中导入并绑定事件
3. 在 `config.js` 或 `items.js` 中添加相关配置数据

## 🔧 常见问题

### Q1: 游戏无法运行，控制台报错
**A**: 确保使用本地服务器运行，而不是直接打开 HTML 文件。查看浏览器控制台的错误信息进行排查。

### Q2: 模块导入失败
**A**: 检查：
- 文件路径是否正确
- 是否使用了 `type="module"` 属性
- 是否使用了本地服务器

### Q3: 修改了配置文件但没有效果
**A**: 清除浏览器缓存或使用硬刷新（Ctrl+Shift+R）

### Q4: 如何恢复到原始版本
**A**: 保留的 `game.js` 和 `新建文本文档.txt` 包含原始代码，可以恢复使用。

## 📝 开发建议

1. **备份文件**: 修改前先备份当前文件
2. **逐步测试**: 每次修改后立即测试相关功能
3. **版本控制**: 建议使用 Git 进行版本管理
4. **代码注释**: 为复杂的函数添加详细注释
5. **性能优化**: 注意避免重复计算和内存泄漏

## 🎯 扩展方向

1. **添加新功能模块**（如：成就系统、任务系统）
2. **优化 UI 界面**（如：动画效果、音效）
3. **数据持久化**（如：云存储、多设备同步）
4. **多人互动**（如：排行榜、交易系统）
5. **移动端适配**（如：触摸操作、响应式设计）

---

**注意事项**：
- 模块化版本使用了 ES6 语法，需要现代浏览器支持
- 修改配置文件后，游戏会自动读取新配置（无需重启）
- 存档文件保存在浏览器的 localStorage 中
- 清除浏览器缓存会删除所有游戏进度