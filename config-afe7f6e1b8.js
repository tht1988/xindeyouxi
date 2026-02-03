// 游戏配置文件 - 存放所有常量和配置数据

// 背包扩充配置
const backpackExpansions = {
    '棉布包': {
        name: '棉布包',
        description: '增加1堆叠数量',
        materials: { '棉布': 50 },
        effect: { stackSize: 1 },
        type: 'stack'
    },
    '织布包': {
        name: '织布包',
        description: '增加5堆叠数量',
        materials: { '棉布': 30, '织布': 30 },
        effect: { stackSize: 5 },
        type: 'stack'
    },
    '粗麻布包': {
        name: '粗麻布包',
        description: '增加15堆叠数量',
        materials: { '织布': 30, '粗麻布': 30 },
        effect: { stackSize: 15 },
        type: 'stack'
    },
    '尼龙布包': {
        name: '尼龙布包',
        description: '增加10格数和20堆叠数量',
        materials: { '尼龙布': 50, '棉布包': 3, '织布包': 3, '粗麻布包': 3 },
        effect: { capacity: 10, stackSize: 20 },
        type: 'both'
    },
    '旅行背包': {
        name: '旅行背包',
        description: '增加500堆叠数量',
        materials: {},
        effect: { stackSize: 500 },
        type: 'stack',
        isSpecial: true
    }
};

// 矿物配置
const minerals = [
    {
        name: "石矿",
        minLevel: 0,
        maxLevel: 5,
        baseTime: 5,
        exp: 5,
        price: 2,
        drops: [
            { name: "棉布", chance: 0.3 },
            { name: "织布", chance: 0.2 }
        ]
    },
    {
        name: "煤矿",
        minLevel: 5,
        maxLevel: 10,
        baseTime: 8,
        exp: 10,
        price: 5,
        drops: [
            { name: "织布", chance: 0.2 },
            { name: "粗麻布", chance: 0.2 }
        ]
    },
    {
        name: "铁矿",
        minLevel: 10,
        maxLevel: 15,
        baseTime: 10,
        exp: 20,
        price: 7,
        drops: [
            { name: "粗麻布", chance: 0.2 },
            { name: "尼龙布", chance: 0.2 }
        ]
    },
    {
        name: "铜矿",
        minLevel: 15,
        maxLevel: 20,
        baseTime: 15,
        exp: 30,
        price: 11,
        drops: [
            { name: "尼龙布", chance: 0.2 },
            { name: "硫磺", chance: 0.2 }
        ]
    },
    {
        name: "钴矿",
        minLevel: 20,
        maxLevel: 25,
        baseTime: 20,
        exp: 40,
        price: 15,
        toolReq: 5,
        drops: [
            { name: "硫磺", chance: 0.3 }
        ]
    },
    {
        name: "镍矿",
        minLevel: 25,
        maxLevel: 30,
        baseTime: 25,
        exp: 50,
        price: 18,
        toolReq: 15
    },
    {
        name: "银矿",
        minLevel: 30,
        maxLevel: 35,
        baseTime: 28,
        exp: 65,
        price: 21,
        toolReq: 15
    },
    {
        name: "白金矿",
        minLevel: 35,
        maxLevel: 40,
        baseTime: 33,
        exp: 80,
        price: 25,
        toolReq: 20
    },
    {
        name: "金矿",
        minLevel: 40,
        maxLevel: 45,
        baseTime: 38,
        exp: 100,
        price: 44,
        toolReq: 25
    },
    {
        name: "水晶矿",
        minLevel: 45,
        maxLevel: Infinity,
        baseTime: 41,
        exp: 130,
        price: 53,
        toolReq: 25
    }
];

// 游戏常量
const GAME_CONSTANTS = {
    MAX_TOOL_LEVEL: 50,
    SAVE_KEY_PREFIX: 'miningGame-',
    AUTO_SAVE_INTERVAL: 60000, // 60秒
    MESSAGE_LIMIT: 10,
    MAX_BACKPACK_SLOTS: 12
};