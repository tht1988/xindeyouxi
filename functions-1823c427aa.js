// 游戏函数库 - 存放所有游戏逻辑函数

// 导入配置和物品数据
import { GAME_CONSTANTS, minerals, backpackExpansions } from './config.js';
import { getItemPrice, getItemStackSize, smeltRecipes, alloyRecipes, craftingRecipes } from './items.js';

// ============ 工具函数 ============

/**
 * 显示消息
 */
function showMessage(msg, type = 'info') {
    gameData.messages.unshift({
        text: msg,
        type: type,
        time: new Date().toLocaleTimeString()
    });
    
    // 限制消息数量
    if (gameData.messages.length > GAME_CONSTANTS.MESSAGE_LIMIT) {
        gameData.messages.pop();
    }
    
    updateMessages();
}

/**
 * 计算采矿时间
 */
function calculateMiningTime(mineral, pickaxeLevel) {
    let time = mineral.baseTime;
    
    // 计算采矿锄加速效果
    if (pickaxeLevel < 40) {
        const stage = Math.min(8, Math.floor(pickaxeLevel / 5) + 1);
        time *= (1 - stage * 0.09);
    } else {
        const baseBonus = 0.72;
        const additionalBonus = (pickaxeLevel - 39) * 0.005;
        time *= (1 - (baseBonus + additionalBonus));
    }
    
    return Math.max(1, Math.round(time * 1000));
}

/**
 * 检查是否有足够物品
 */
function hasEnoughItem(itemName, amount) {
    let total = 0;
    
    // 检查主背包
    for (let name in gameData.backpack.items) {
        const baseName = name.split('_')[0];
        if (baseName === itemName) {
            total += gameData.backpack.items[name];
        }
    }
    
    // 检查临时背包
    for (let name in gameData.tempBackpack.items) {
        const baseName = name.split('_')[0];
        if (baseName === itemName) {
            total += gameData.tempBackpack.items[name];
        }
    }
    
    return total >= amount;
}

/**
 * 消耗物品
 */
function consumeItem(itemName, amount) {
    let remaining = amount;
    
    // 先从主背包消耗
    for (let name in gameData.backpack.items) {
        if (remaining <= 0) break;
        
        const baseName = name.split('_')[0];
        if (baseName === itemName) {
            const available = gameData.backpack.items[name];
            const consume = Math.min(available, remaining);
            
            gameData.backpack.items[name] -= consume;
            if (gameData.backpack.items[name] <= 0) {
                delete gameData.backpack.items[name];
            }
            
            remaining -= consume;
        }
    }
    
    // 再从临时背包消耗
    for (let name in gameData.tempBackpack.items) {
        if (remaining <= 0) break;
        
        const baseName = name.split('_')[0];
        if (baseName === itemName) {
            const available = gameData.tempBackpack.items[name];
            const consume = Math.min(available, remaining);
            
            gameData.tempBackpack.items[name] -= consume;
            if (gameData.tempBackpack.items[name] <= 0) {
                delete gameData.tempBackpack.items[name];
            }
            
            remaining -= consume;
        }
    }
    
    return remaining === 0;
}

/**
 * 添加物品到背包
 */
function addToBackpack(itemName, amount = 1) {
    const maxStack = gameData.backpack.currentStackSize;
    const items = gameData.backpack.items;
    
    // 尝试堆叠到现有物品
    let remaining = amount;
    
    for (let name in items) {
        if (remaining <= 0) break;
        
        const baseName = name.split('_')[0];
        if (baseName === itemName) {
            const currentCount = items[name];
            const canAdd = Math.min(maxStack - currentCount, remaining);
            
            items[name] += canAdd;
            remaining -= canAdd;
        }
    }
    
    // 创建新堆叠
    while (remaining > 0) {
        const canAdd = Math.min(maxStack, remaining);
        
        // 寻找下一个可用的堆叠名
        let stackName = itemName;
        let counter = 1;
        while (items[stackName] !== undefined) {
            stackName = `${itemName}_${counter}`;
            counter++;
        }
        
        items[stackName] = canAdd;
        remaining -= canAdd;
    }
    
    return true;
}

// ============ 采矿系统 ============

/**
 * 获取当前等级可采的矿物列表
 */
function getAvailableMinerals() {
    return minerals.filter(mineral => 
        mineral.minLevel <= gameData.player.level && 
        mineral.maxLevel >= gameData.player.level
    );
}

/**
 * 单次采矿
 */
function mineMineral(mineralName) {
    const mineral = minerals.find(m => m.name === mineralName);
    if (!mineral) {
        showMessage('未找到该矿物', 'error');
        return;
    }
    
    // 检查工具等级要求
    if (mineral.toolReq && mineral.toolReq > gameData.tools.pickaxe.level) {
        showMessage(`需要采矿锄等级${mineral.toolReq}`, 'error');
        return;
    }
    
    // 计算采矿时间
    const time = calculateMiningTime(mineral, gameData.tools.pickaxe.level);
    
    showMessage(`正在开采 ${mineralName}...`, 'info');
    
    setTimeout(() => {
        // 添加矿物到背包
        addToBackpack(mineralName, 1);
        
        // 检查掉落物品
        if (mineral.drops) {
            mineral.drops.forEach(drop => {
                if (Math.random() < drop.chance) {
                    addToBackpack(drop.name, 1);
                    showMessage(`获得额外掉落: ${drop.name}`, 'success');
                }
            });
        }
        
        // 增加经验
        gameData.tools.pickaxe.exp += mineral.exp;
        gameData.gainedInfo.minerals++;
        
        showMessage(`成功开采 ${mineralName}！`, 'success');
        updateUI();
    }, time);
}

/**
 * 连续采矿
 */
let continuousMiningInterval = null;

function startContinuousMining(mineralName) {
    if (continuousMiningInterval) {
        stopContinuousMining();
        return;
    }
    
    showMessage(`开始连续开采 ${mineralName}`, 'info');
    continuousMiningInterval = setInterval(() => {
        mineMineral(mineralName);
    }, 100);
}

function stopContinuousMining() {
    if (continuousMiningInterval) {
        clearInterval(continuousMiningInterval);
        continuousMiningInterval = null;
        showMessage('已停止连续采矿', 'info');
    }
}

// ============ 升级系统 ============

/**
 * 检查并处理升级
 */
function checkLevelUp(toolType) {
    const tool = gameData.tools[toolType];
    
    while (tool.exp >= tool.nextExp && tool.level < GAME_CONSTANTS.MAX_TOOL_LEVEL) {
        tool.exp -= tool.nextExp;
        tool.level++;
        tool.nextExp = Math.floor(tool.nextExp * 1.5);
        
        showMessage(`${toolType === 'pickaxe' ? '采矿锄' : toolType} 升级到 ${tool.level} 级！`, 'success');
    }
}

/**
 * 升级工具
 */
function upgradeTool(toolType) {
    const tool = gameData.tools[toolType];
    
    if (tool.level >= GAME_CONSTANTS.MAX_TOOL_LEVEL) {
        showMessage('已达到最高等级', 'error');
        return;
    }
    
    if (tool.exp < tool.nextExp) {
        showMessage(`经验不足，需要 ${tool.nextExp} 经验`, 'error');
        return;
    }
    
    checkLevelUp(toolType);
    updateUI();
}

// ============ 熔炉系统 ============

/**
 * 开始熔炼
 */
function startSmelting(recipeName) {
    const recipe = smeltRecipes[recipeName];
    if (!recipe) return;
    
    // 检查材料
    for (let material in recipe.input) {
        if (!hasEnoughItem(material, recipe.input[material])) {
            showMessage(`材料不足: ${material}`, 'error');
            return;
        }
    }
    
    // 消耗材料
    for (let material in recipe.input) {
        consumeItem(material, recipe.input[material]);
    }
    
    showMessage(`开始熔炼 ${recipe.name}...`, 'info');
    
    setTimeout(() => {
        addToBackpack(recipe.output, recipe.outputAmount);
        showMessage(`熔炼完成: ${recipe.name}`, 'success');
        gameData.furnace.level++;
        updateUI();
    }, recipe.time * 1000);
}

// ============ 背包系统 ============

/**
 * 生成背包格子
 */
function generateBackpackSlots() {
    const grid = document.getElementById('backpack-grid');
    grid.innerHTML = '';
    
    for (let i = 0; i < gameData.backpack.capacity; i++) {
        const slot = document.createElement('div');
        slot.className = 'backpack-slot';
        slot.dataset.index = i;
        grid.appendChild(slot);
    }
    
    // 填充物品
    renderBackpackItems();
}

/**
 * 渲染背包物品
 */
function renderBackpackItems() {
    const slots = document.querySelectorAll('.backpack-slot');
    let index = 0;
    
    for (let itemName in gameData.backpack.items) {
        if (index < slots.length) {
            const slot = slots[index];
            const count = gameData.backpack.items[itemName];
            const baseName = itemName.split('_')[0];
            
            slot.innerHTML = `
                <div class="item-icon">${baseName[0]}</div>
                <div class="item-count">${count}</div>
                <div class="item-name">${baseName}</div>
            `;
            
            slot.onclick = () => showItemDetails(itemName);
            index++;
        }
    }
}

/**
 * 显示物品详情
 */
function showItemDetails(itemName) {
    const baseName = itemName.split('_')[0];
    const price = getItemPrice(baseName);
    const stackSize = getItemStackSize(baseName);
    
    const details = `
        <h3>${baseName}</h3>
        <p>单价: ${price} 金币</p>
        <p>堆叠: ${stackSize}</p>
        <button onclick="sellItem('${itemName}')">出售</button>
    `;
    
    document.getElementById('item-details').innerHTML = details;
}

/**
 * 出售物品
 */
function sellItem(itemName) {
    const baseName = itemName.split('_')[0];
    const price = getItemPrice(baseName);
    const count = gameData.backpack.items[itemName];
    
    if (count > 0) {
        const total = price * count;
        gameData.player.gold += total;
        delete gameData.backpack.items[itemName];
        
        showMessage(`出售 ${baseName} x${count}，获得 ${total} 金币`, 'success');
        updateUI();
    }
}

// ============ 商店系统 ============

/**
 * 刷新商店
 */
function refreshShop() {
    gameData.shop.items = [];
    
    // 生成随机物品
    for (let i = 0; i < 6; i++) {
        const availableItems = Object.keys(itemPrices);
        const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
        const discount = Math.random() < 0.3 ? 0.8 : 1;
        
        gameData.shop.items.push({
            name: randomItem,
            discount: discount,
            price: Math.floor(getItemPrice(randomItem) * discount * 1.5)
        });
    }
    
    gameData.shop.lastRefresh = Date.now();
    updateShopUI();
}

/**
 * 购买物品
 */
function buyItem(index) {
    const item = gameData.shop.items[index];
    if (!item) return;
    
    if (gameData.player.gold < item.price) {
        showMessage('金币不足', 'error');
        return;
    }
    
    gameData.player.gold -= item.price;
    addToBackpack(item.name, 1);
    
    showMessage(`购买了 ${item.name}`, 'success');
    updateUI();
}

// ============ 存档系统 ============

/**
 * 保存游戏
 */
function saveGame(slot = 'save1') {
    const saveKey = `${GAME_CONSTANTS.SAVE_KEY_PREFIX}${slot}`;
    localStorage.setItem(saveKey, JSON.stringify(gameData));
    showMessage(`已保存到存档 ${slot}`, 'success');
}

/**
 * 加载游戏
 */
function loadGame(slot = 'save1') {
    const saveKey = `${GAME_CONSTANTS.SAVE_KEY_PREFIX}${slot}`;
    const savedData = localStorage.getItem(saveKey);
    
    if (savedData) {
        gameData = JSON.parse(savedData);
        showMessage(`已加载存档 ${slot}`, 'success');
        updateUI();
    } else {
        showMessage('存档不存在', 'error');
    }
}

/**
 * 删除存档
 */
function deleteSave(slot = 'save1') {
    const saveKey = `${GAME_CONSTANTS.SAVE_KEY_PREFIX}${slot}`;
    localStorage.removeItem(saveKey);
    showMessage(`已删除存档 ${slot}`, 'success');
}

// ============ UI更新函数 ============

/**
 * 更新所有UI
 */
function updateUI() {
    updatePlayerInfo();
    updateBackpackUI();
    updateMineralUI();
    updateShopUI();
    saveGame();
}

/**
 * 更新玩家信息
 */
function updatePlayerInfo() {
    document.getElementById('player-level').textContent = `Lv${gameData.player.level}`;
    document.getElementById('player-exp').textContent = `${gameData.tools.pickaxe.exp}/${gameData.tools.pickaxe.nextExp}`;
    document.getElementById('player-gold').textContent = gameData.player.gold;
}

/**
 * 更新背包UI
 */
function updateBackpackUI() {
    renderBackpackItems();
}

/**
 * 更新矿物UI
 */
function updateMineralUI() {
    const availableMinerals = getAvailableMinerals();
    const grid = document.getElementById('mineral-grid');
    
    if (grid) {
        grid.innerHTML = '';
        
        availableMinerals.forEach(mineral => {
            const card = document.createElement('div');
            card.className = 'mineral-card';
            card.innerHTML = `
                <h3>${mineral.name}</h3>
                <p>等级: ${mineral.minLevel}-${mineral.maxLevel === Infinity ? '∞' : mineral.maxLevel}</p>
                <p>时间: ${mineral.baseTime}秒</p>
                <p>经验: ${mineral.exp}</p>
                <button onclick="mineMineral('${mineral.name}')">开采</button>
                <button onclick="startContinuousMining('${mineral.name}')">连续</button>
            `;
            grid.appendChild(card);
        });
    }
}

/**
 * 更新商店UI
 */
function updateShopUI() {
    const shopContainer = document.getElementById('shop-items');
    
    if (shopContainer) {
        shopContainer.innerHTML = '';
        
        gameData.shop.items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'shop-item';
            card.innerHTML = `
                <h3>${item.name}</h3>
                <p>价格: ${item.price} 金币${item.discount < 1 ? ' (打折)' : ''}</p>
                <button onclick="buyItem(${index})">购买</button>
            `;
            shopContainer.appendChild(card);
        });
    }
}

/**
 * 更新消息显示
 */
function updateMessages() {
    const messageContainer = document.getElementById('messages');
    
    if (messageContainer) {
        messageContainer.innerHTML = '';
        
        gameData.messages.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message message-${msg.type}`;
            msgDiv.innerHTML = `
                <span class="msg-time">${msg.time}</span>
                <span class="msg-text">${msg.text}</span>
            `;
            messageContainer.appendChild(msgDiv);
        });
    }
}

// ============ 初始化函数 ============

/**
 * 初始化游戏
 */
function initGame() {
    // 加载存档
    const savedData = localStorage.getItem(`${GAME_CONSTANTS.SAVE_KEY_PREFIX}save1`);
    if (savedData) {
        gameData = JSON.parse(savedData);
    }
    
    // 初始化背包
    generateBackpackSlots();
    
    // 初始化商店
    if (gameData.shop.items.length === 0) {
        refreshShop();
    }
    
    // 更新UI
    updateUI();
    
    // 自动保存
    setInterval(() => {
        saveGame();
    }, GAME_CONSTANTS.AUTO_SAVE_INTERVAL);
    
    // 定期刷新商店
    setInterval(() => {
        const now = Date.now();
        if (now - gameData.shop.lastRefresh > gameData.shop.refreshTime * 1000) {
            refreshShop();
        }
    }, 10000);
}

// ============ 导出函数供外部调用 ============
window.gameFunctions = {
    mineMineral,
    startContinuousMining,
    stopContinuousMining,
    upgradeTool,
    startSmelting,
    sellItem,
    buyItem,
    refreshShop,
    saveGame,
    loadGame,
    deleteSave,
    checkLevelUp
};