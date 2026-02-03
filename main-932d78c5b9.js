// 游戏主入口文件 - 负责初始化和事件绑定

// 导入配置和函数
import { minerals, backpackExpansions, GAME_CONSTANTS } from './config.js';
import { getItemPrice, getItemStackSize, itemPrices } from './items.js';

// 游戏全局数据
let gameData = {
    player: {
        level: 1,
        exp: 0,
        nextExp: 50,
        gold: 0
    },
    gainedInfo: {
        exp: 0,
        gold: 0,
        minerals: 0,
        cloth: 0
    },
    messages: [],
    activeEffects: {},
    tools: {
        pickaxe: {
            level: 0,
            exp: 0,
            nextExp: 50
        },
        cart: {
            crafted: false,
            level: 0,
            exp: 0,
            fuelTank: false,
            optimized: false
        },
        headlight: {
            crafted: false,
            level: 0,
            exp: 0,
            batterySlot: false,
            optimized: false
        }
    },
    furnace: {
        crafted: false,
        level: 0
    },
    backpack: {
        capacity: 10,
        baseCapacity: 10,
        items: {},
        expansionSlots: [],
        maxExpansionSlots: 12,
        baseStackSize: 20,
        currentStackSize: 20
    },
    tempBackpack: {
        items: {}
    },
    unlockedRecipes: {},
    miningCount: {},
    selectedMineral: null,
    filterSettings: {},
    shop: {
        unlocked: false,
        level: 0,
        upgradeCosts: [100000, 500000, 1000000],
        freeRefreshes: 0,
        maxFreeRefreshes: 50,
        lastFreeRefreshTime: Date.now(),
        neededItem: null,
        autoPurchaseItems: [],
        autoPurchaseDiscounts: false,
        refreshTime: 180,
        currentTime: 0,
        items: [],
        lastRefresh: Date.now(),
        manualRefreshCost: 1000,
        unlockedBlueprints: {
            '加工台图纸': false,
            '电池图纸': false,
            '燃料配方': false
        },
        lastHadTravelBackpack: false
    },
    workshop: {
        unlocked: false,
        batterySlot: 0,
        batteryEnergy: 0,
        maxBatteryEnergy: 50,
        itemsCrafted: 0
    }
};

// 导入函数
import './functions.js';

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    
    // 绑定保存按钮
    document.getElementById('save-btn').addEventListener('click', () => {
        saveGame('save1');
    });
    
    // 绑定加载按钮
    document.getElementById('load-btn').addEventListener('click', () => {
        loadGame('save1');
    });
    
    // 绑定升级采矿锄按钮
    document.getElementById('upgrade-pickaxe').addEventListener('click', () => {
        upgradeTool('pickaxe');
    });
    
    // 初始化熔炼配方下拉菜单
    const smeltRecipeSelect = document.getElementById('smelt-recipe');
    smeltRecipeSelect.addEventListener('change', () => {
        updateSmeltInfo();
    });
    
    // 初始化合金下拉菜单
    const alloyTypeSelect = document.getElementById('alloy-type');
    Object.keys(alloyRecipes).forEach(alloyName => {
        const option = document.createElement('option');
        option.value = alloyName;
        option.textContent = alloyName;
        alloyTypeSelect.appendChild(option);
    });
    
    alloyTypeSelect.addEventListener('change', () => {
        updateAlloyInfo();
    });
    
    // 初始化背包扩充下拉菜单
    const backpackTypeSelect = document.getElementById('backpack-type');
    Object.keys(backpackExpansions).forEach(backpackName => {
        const option = document.createElement('option');
        option.value = backpackName;
        option.textContent = backpackName;
        backpackTypeSelect.appendChild(option);
    });
    
    backpackTypeSelect.addEventListener('change', () => {
        updateBackpackInfo();
    });
    
    // 绑定熔炼确认按钮
    document.getElementById('confirm-smelt').addEventListener('click', () => {
        const recipeName = document.getElementById('smelt-recipe').value;
        const amount = parseInt(document.getElementById('smelt-amount').value) || 1;
        
        for (let i = 0; i < amount; i++) {
            startSmelting(recipeName);
        }
    });
    
    // 绑定合金制作确认按钮
    document.getElementById('confirm-alloy').addEventListener('click', () => {
        const alloyName = document.getElementById('alloy-type').value;
        const amount = parseInt(document.getElementById('alloy-amount').value) || 1;
        
        for (let i = 0; i < amount; i++) {
            startAlloyCrafting(alloyName);
        }
    });
    
    // 绑定背包扩充制作确认按钮
    document.getElementById('confirm-craft-backpack').addEventListener('click', () => {
        const backpackName = document.getElementById('backpack-type').value;
        craftBackpackExpansion(backpackName);
    });
    
    // 绑定刷新商店按钮
    document.getElementById('refresh-shop').addEventListener('click', () => {
        if (gameData.player.gold >= 1000) {
            gameData.player.gold -= 1000;
            refreshShop();
        } else {
            showMessage('金币不足', 'error');
        }
    });
});

// 将 gameData 导出到全局作用域，以便函数模块可以访问
window.gameData = gameData;

// 导出一些常用函数到全局作用域
window.updateSmeltInfo = function() {
    const recipeName = document.getElementById('smelt-recipe').value;
    const recipe = smeltRecipes[recipeName];
    const infoBody = document.getElementById('smelt-info-body');
    
    if (recipe) {
        let materialsHtml = '';
        for (let material in recipe.input) {
            materialsHtml += `<div>${material}: ${recipe.input[material]}</div>`;
        }
        
        infoBody.innerHTML = `
            <p><strong>输出:</strong> ${recipe.output} x${recipe.outputAmount}</p>
            <p><strong>所需材料:</strong></p>
            ${materialsHtml}
            <p><strong>时间:</strong> ${recipe.time}秒</p>
        `;
    }
};

window.updateAlloyInfo = function() {
    const alloyName = document.getElementById('alloy-type').value;
    const recipe = alloyRecipes[alloyName];
    const infoBody = document.getElementById('alloy-info-body');
    
    if (recipe) {
        let materialsHtml = '';
        for (let material in recipe.input) {
            materialsHtml += `<div>${material}: ${recipe.input[material]}</div>`;
        }
        
        infoBody.innerHTML = `
            <p><strong>输出:</strong> ${recipe.output} x${recipe.outputAmount}</p>
            <p><strong>所需材料:</strong></p>
            ${materialsHtml}
            <p><strong>时间:</strong> ${recipe.time}秒</p>
            <p><strong>需要等级:</strong> ${recipe.minLevel}</p>
        `;
    }
};

window.updateBackpackInfo = function() {
    const backpackName = document.getElementById('backpack-type').value;
    const expansion = backpackExpansions[backpackName];
    const infoBody = document.getElementById('backpack-info-body');
    
    if (expansion) {
        let materialsHtml = '';
        for (let material in expansion.materials) {
            materialsHtml += `<div>${material}: ${expansion.materials[material]}</div>`;
        }
        
        let effectsHtml = '';
        if (expansion.effect.capacity) {
            effectsHtml += `<div>格数: +${expansion.effect.capacity}</div>`;
        }
        if (expansion.effect.stackSize) {
            effectsHtml += `<div>堆叠: +${expansion.effect.stackSize}</div>`;
        }
        
        infoBody.innerHTML = `
            <p><strong>描述:</strong> ${expansion.description}</p>
            <p><strong>所需材料:</strong></p>
            ${materialsHtml}
            <p><strong>效果:</strong></p>
            ${effectsHtml}
        `;
    }
};

window.startAlloyCrafting = function(alloyName) {
    const recipe = alloyRecipes[alloyName];
    if (!recipe) return;
    
    // 检查等级
    if (gameData.player.level < recipe.minLevel) {
        showMessage(`等级不足，需要等级${recipe.minLevel}`, 'error');
        return;
    }
    
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
    
    showMessage(`开始制作 ${alloyName}...`, 'info');
    
    setTimeout(() => {
        addToBackpack(recipe.output, recipe.outputAmount);
        showMessage(`制作完成: ${alloyName}`, 'success');
        updateUI();
    }, recipe.time * 1000);
};

window.craftBackpackExpansion = function(backpackName) {
    const expansion = backpackExpansions[backpackName];
    if (!expansion) return;
    
    // 检查材料
    for (let material in expansion.materials) {
        if (!hasEnoughItem(material, expansion.materials[material])) {
            showMessage(`材料不足: ${material}`, 'error');
            return;
        }
    }
    
    // 消耗材料
    for (let material in expansion.materials) {
        consumeItem(material, expansion.materials[material]);
    }
    
    // 应用效果
    if (expansion.effect.capacity) {
        gameData.backpack.capacity += expansion.effect.capacity;
    }
    if (expansion.effect.stackSize) {
        gameData.backpack.currentStackSize += expansion.effect.stackSize;
    }
    
    showMessage(`制作完成: ${backpackName}`, 'success');
    updateUI();
};