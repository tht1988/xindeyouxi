// 物品配置文件 - 存放所有物品信息

// 基础物品价格表
const itemPrices = {
    // 矿物类
    '石矿': 2,
    '煤矿': 5,
    '铁矿': 7,
    '铜矿': 11,
    '钴矿': 15,
    '镍矿': 18,
    '银矿': 21,
    '白金矿': 25,
    '金矿': 44,
    '水晶矿': 53,
    
    // 布料类
    '棉布': 1,
    '织布': 3,
    '粗麻布': 8,
    '尼龙布': 15,
    '硫磺': 10,
    
    // 合金类
    '铜铁合金': 50,
    '铜钴合金': 100,
    '铜镍合金': 200,
    '铜银合金': 500,
    
    // 配方类
    '铜铁合金配方': 0,
    '铜钴合金配方': 0,
    '铜镍合金配方': 0,
    '铜银合金配方': 0,
    
    // 燃料类
    '燃料': 5,
    '电池': 20,
    
    // 背包扩充类
    '棉布包': 0,
    '织布包': 0,
    '粗麻布包': 0,
    '尼龙布包': 0,
    '旅行背包': 0
};

// 融石配方
const smeltRecipes = {
    '石灰': {
        name: '石灰',
        input: { '石矿': 2 },
        output: '石灰',
        outputAmount: 1,
        time: 3
    },
    '煤炭': {
        name: '煤炭',
        input: { '煤矿': 2 },
        output: '煤炭',
        outputAmount: 1,
        time: 5
    }
};

// 合金配方
const alloyRecipes = {
    '铜铁合金': {
        name: '铜铁合金',
        input: { '铜矿': 2, '铁矿': 1 },
        output: '铜铁合金',
        outputAmount: 1,
        time: 8,
        minLevel: 10
    },
    '铜钴合金': {
        name: '铜钴合金',
        input: { '铜矿': 2, '钴矿': 1 },
        output: '铜钴合金',
        outputAmount: 1,
        time: 10,
        minLevel: 20
    },
    '铜镍合金': {
        name: '铜镍合金',
        input: { '铜矿': 2, '镍矿': 1 },
        output: '铜镍合金',
        outputAmount: 1,
        time: 12,
        minLevel: 25
    },
    '铜银合金': {
        name: '铜银合金',
        input: { '铜矿': 2, '银矿': 1 },
        output: '铜银合金',
        outputAmount: 1,
        time: 15,
        minLevel: 30
    }
};

// 工具制作配方
const craftingRecipes = {
    '矿车': {
        name: '矿车',
        materials: { '铁矿': 20 },
        gold: 50,
        requirements: {}
    },
    '头灯': {
        name: '头灯',
        materials: { '铁矿': 100, '铜矿': 10 },
        gold: 1000,
        requirements: {}
    },
    '熔炉': {
        name: '熔炉',
        materials: { '石矿': 20 },
        gold: 0,
        requirements: {}
    }
};

// 物品堆叠数量
const itemStackSizes = {
    // 矿物类默认堆叠
    '石矿': 20,
    '煤矿': 20,
    '铁矿': 20,
    '铜矿': 20,
    '钴矿': 20,
    '镍矿': 20,
    '银矿': 20,
    '白金矿': 20,
    '金矿': 20,
    '水晶矿': 20,
    
    // 布料类堆叠
    '棉布': 50,
    '织布': 30,
    '粗麻布': 20,
    '尼龙布': 10,
    '硫磺': 30,
    
    // 合金类堆叠
    '铜铁合金': 50,
    '铜钴合金': 30,
    '铜镍合金': 20,
    '铜银合金': 10,
    
    // 燃料类堆叠
    '燃料': 99,
    '电池': 50,
    
    // 配方类不可堆叠
    '铜铁合金配方': 1,
    '铜钴合金配方': 1,
    '铜镍合金配方': 1,
    '铜银合金配方': 1
};

// 获取物品价格
function getItemPrice(itemName) {
    return itemPrices[itemName] || 0;
}

// 获取物品堆叠数量
function getItemStackSize(itemName) {
    return itemStackSizes[itemName] || 20;
}

// 检查是否为可堆叠物品
function isStackable(itemName) {
    return getItemStackSize(itemName) > 1;
}

// 获取物品类型
function getItemType(itemName) {
    if (itemName.includes('矿')) return 'mineral';
    if (itemName.includes('布') || itemName === '硫磺') return 'material';
    if (itemName.includes('合金')) return 'alloy';
    if (itemName.includes('配方')) return 'recipe';
    if (itemName === '燃料' || itemName === '电池') return 'fuel';
    if (itemName.includes('包')) return 'expansion';
    return 'other';
}