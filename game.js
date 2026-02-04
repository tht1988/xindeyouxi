// RPG刷宝游戏主文件
class RPGGame {
  constructor() {
    this.items = {
      weapons: [],
      armors: [],
      accessories: []
    };
    this.affixes = {
      prefixes: [],
      suffixes: [],
      uniques: []
    };
    this.characters = {
      classes: [],
      attributes: {
        strength: { name: '力量', description: '影响攻击力' },
        agility: { name: '敏捷', description: '影响闪避' },
        precision: { name: '精准', description: '影响暴击' },
        vitality: { name: '体力', description: '影响血量' },
        endurance: { name: '耐力', description: '影响防御' }
      }
    };
    this.enemies = [];
    this.lootSystem = {};
    this.coreMechanics = {};
    this.config = {};
    this.inscriptions = [];
    this.enchantmentSystem = {
      maxAffixes: 6,
      baseSuccessRate: 0.8
    };
    this.durabilitySystem = {
      baseDurability: {
        common: 100,
        uncommon: 150,
        rare: 200,
        epic: 250,
        ancient: 300
      },
      recoveryRate: 0.1 // 每秒钟恢复的耐久度
    };
  }

  async loadGameData() {
    try {
      console.log('开始加载游戏数据...');
      
      // 并行加载所有数据文件
      const [
        weaponsData,
        armorsData,
        accessoriesData,
        prefixesData,
        suffixesData,
        uniquesData,
        classesData,
        attributesData,
        enemiesData,
        lootSystemData,
        coreMechanicsData,
        configData
      ] = await Promise.all([
        this.loadJSON('items/weapons.json'),
        this.loadJSON('items/armors.json'),
        this.loadJSON('items/accessories.json'),
        this.loadJSON('affixes/prefixes.json'),
        this.loadJSON('affixes/suffixes.json'),
        this.loadJSON('affixes/uniques.json'),
        this.loadJSON('characters/classes.json'),
        this.loadJSON('characters/attributes.json'),
        this.loadJSON('enemies/enemies.json'),
        this.loadJSON('loot/loot_system.json'),
        this.loadJSON('mechanics/core_mechanics.json'),
        this.loadJSON('config.json')
      ]);

      // 处理加载的数据
      this.items.weapons = weaponsData.weapons;
      this.items.armors = armorsData.armors;
      this.items.accessories = accessoriesData.accessories;
      
      this.affixes.prefixes = prefixesData.prefixes;
      this.affixes.suffixes = suffixesData.suffixes;
      this.affixes.uniques = uniquesData.uniques;
      
      this.characters.classes = classesData.classes;
      this.characters.attributes = attributesData.attributes;
      
      this.enemies = enemiesData.enemies;
      this.lootSystem = lootSystemData;
      this.coreMechanics = coreMechanicsData;
      this.config = configData;

      console.log('游戏数据加载完成！');
      console.log('加载的文件数量:', [
        weaponsData, armorsData, accessoriesData, 
        prefixesData, suffixesData, uniquesData, 
        classesData, attributesData, enemiesData, 
        lootSystemData, coreMechanicsData, configData
      ].length);
      console.log('敌人数据数量:', this.enemies.length);
      
      // 通知HTML页面加载完成
      if (typeof window !== 'undefined' && window.gameLoaded) {
        window.gameLoaded();
      }
    } catch (error) {
      console.error('游戏数据加载失败:', error);
      
      // 通知HTML页面加载失败
      if (typeof window !== 'undefined' && window.gameLoadFailed) {
        window.gameLoadFailed(error.message);
      }
    }
  }

  async loadJSON(path) {
    const response = await fetch(path);
    let text = await response.text();
    
    // 移除JSON中的注释
    // 1. 移除多行注释 /* ... */
    text = text.replace(/\/\*[\s\S]*?\*\//g, '');
    // 2. 移除单行注释 // ...
    text = text.replace(/\/\/.*$/gm, '');
    // 3. 移除多余的空白行
    text = text.replace(/^\s*$/gm, '');
    // 4. 合并连续的空白字符为单个空格
    text = text.replace(/\s+/g, ' ');
    // 5. 移除冒号、逗号前后的空格（确保标准JSON格式）
    text = text.replace(/\s*:\s*/g, ':').replace(/\s*,\s*/g, ',');
    // 6. 移除括号前后的空格
    text = text.replace(/\s*\{\s*/g, '{').replace(/\s*\}\s*/g, '}');
    text = text.replace(/\s*\[\s*/g, '[').replace(/\s*\]\s*/g, ']');
    
    return JSON.parse(text);
  }

  generateLoot(enemy) {
    // 生成掉落物品的逻辑
    const loot = [];
    const dropChance = Math.random() * 100;

    // 生成金币掉落
    if (enemy.gold_drop) {
      const goldAmount = Math.floor(Math.random() * (enemy.gold_drop.max - enemy.gold_drop.min + 1)) + enemy.gold_drop.min;
      loot.push({
        type: 'gold',
        name: '金币',
        amount: goldAmount,
        description: `获得了 ${goldAmount} 枚金币`,
        icon: '💰'
      });
    }

    // 生成物品掉落
    if (dropChance <= enemy.loot_chance) {
      // 确定稀有度
      const rarity = this.determineRarity(enemy.drop_table);
      
      // 生成基础物品
      const baseItem = this.generateBaseItem(enemy);
      
      // 应用词缀
      let finalItem = this.applyAffixes(baseItem, rarity);
      
      // 根据怪物等级调整物品等级
      finalItem.level = enemy.level;
      
      // 根据怪物类型调整物品稀有度（增加精英和BOSS的稀有度掉落概率）
      if (enemy.enemy_type === 'elite' || enemy.enemy_type === 'boss') {
        const rarityRoll = Math.random();
        if (rarityRoll > 0.7 && rarity !== 'ancient') {
          // 精英和BOSS有30%概率获得更高稀有度
          const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'ancient'];
          const currentIndex = rarityOrder.indexOf(rarity);
          if (currentIndex < rarityOrder.length - 1) {
            const higherRarity = rarityOrder[currentIndex + 1];
            finalItem = this.applyAffixes(baseItem, higherRarity);
            finalItem.level = enemy.level;
          }
        }
      }
      
      loot.push(finalItem);
    }

    return loot;
  }

  determineRarity(dropTable) {
    const roll = Math.random() * 100;
    let cumulative = 0;

    for (const [rarity, chance] of Object.entries(dropTable)) {
      cumulative += chance;
      if (roll <= cumulative) {
        return rarity;
      }
    }

    return 'common';
  }

  generateBaseItem(enemy) {
    // 从敌人偏好的物品中选择
    const itemTypes = enemy.preferred_items || [];
    if (itemTypes.length === 0) {
      // 默认选择武器
      itemTypes.push('sword');
    }
    const randomType = itemTypes[Math.floor(Math.random() * itemTypes.length)];

    // 根据类型选择物品
    let itemPool = [];
    if (['sword', 'axe', 'bow', 'staff'].includes(randomType)) {
      itemPool = this.items.weapons;
    } else if (['helmet', 'chest', 'gloves', 'pants', 'boots'].includes(randomType)) {
      itemPool = this.items.armors;
    } else {
      itemPool = this.items.accessories;
    }

    // 确保itemPool不为空
    if (itemPool.length === 0) {
      // 如果所有物品池都为空，默认返回一个基础武器
      return { 
        name: '基础武器', 
        type: 'melee', 
        level: 1 
      };
    }

    return itemPool[Math.floor(Math.random() * itemPool.length)];
  }

  applyAffixes(item, rarity) {
    if (!item) {
      console.error('applyAffixes: item is undefined');
      return null;
    }

    const rarityConfig = this.lootSystem.rarity[rarity] || {
      min_prefixes: 0,
      max_prefixes: 0,
      min_suffixes: 0,
      max_suffixes: 0,
      unique_affixes: 0
    };
    
    let prefixesApplied = [];
    let suffixesApplied = [];
    let uniqueAffixesApplied = [];
    const itemType = this.getItemType(item);

    // 应用前缀
    const applicablePrefixes = this.affixes.prefixes.filter(p => 
      p && p.applicable_types && p.applicable_types.includes(itemType)
    );

    if (applicablePrefixes.length > 0) {
      const minPrefixes = rarityConfig.min_prefixes || 0;
      const maxPrefixes = rarityConfig.max_prefixes || 0;
      const prefixCount = Math.floor(Math.random() * (maxPrefixes - minPrefixes + 1)) + minPrefixes;

      for (let i = 0; i < prefixCount; i++) {
        if (applicablePrefixes.length > 0) {
          const randomIndex = Math.floor(Math.random() * applicablePrefixes.length);
          const prefix = applicablePrefixes[randomIndex];
          prefixesApplied.push(prefix);
          // 避免重复选择相同的前缀
          applicablePrefixes.splice(randomIndex, 1);
        }
      }
    }

    // 应用后缀
    const applicableSuffixes = this.affixes.suffixes.filter(s => 
      s && s.applicable_types && s.applicable_types.includes(itemType)
    );

    if (applicableSuffixes.length > 0) {
      const minSuffixes = rarityConfig.min_suffixes || 0;
      const maxSuffixes = rarityConfig.max_suffixes || 0;
      const suffixCount = Math.floor(Math.random() * (maxSuffixes - minSuffixes + 1)) + minSuffixes;

      for (let i = 0; i < suffixCount; i++) {
        if (applicableSuffixes.length > 0) {
          const randomIndex = Math.floor(Math.random() * applicableSuffixes.length);
          const suffix = applicableSuffixes[randomIndex];
          suffixesApplied.push(suffix);
          // 避免重复选择相同的后缀
          applicableSuffixes.splice(randomIndex, 1);
        }
      }
    }

    // 应用独特词缀（仅上古装备）
    if (rarity === 'ancient' && rarityConfig.unique_affixes > 0) {
      const applicableUniques = this.affixes.uniques.filter(u => 
        u && u.applicable_types && u.applicable_types.includes(itemType)
      );

      for (let i = 0; i < rarityConfig.unique_affixes; i++) {
        if (applicableUniques.length > 0) {
          const unique = applicableUniques[Math.floor(Math.random() * applicableUniques.length)];
          uniqueAffixesApplied.push(unique);
        }
      }
    }

    // 构建最终词缀数组
    const affixesApplied = [
      ...prefixesApplied.map(affix => ({ type: 'prefix', affix })),
      ...suffixesApplied.map(affix => ({ type: 'suffix', affix })),
      ...uniqueAffixesApplied.map(affix => ({ type: 'unique', affix }))
    ];

    // 计算装备耐久度
    const maxDurability = this.calculateMaxDurability(rarity, item.level || 1);

    return {
      ...item,
      rarity,
      affixes: affixesApplied,
      prefixes: prefixesApplied,
      suffixes: suffixesApplied,
      unique_affixes: uniqueAffixesApplied,
      final_name: this.generateItemName(item, prefixesApplied, suffixesApplied),
      equippable: true,
      equipped: false,
      slot: this.getItemSlot(item),
      durability: maxDurability,
      maxDurability: maxDurability,
      level: item.level || 1
    };
  }

  // 计算装备最大耐久度
  calculateMaxDurability(rarity, level) {
    const baseDurability = this.durabilitySystem.baseDurability[rarity] || 100;
    const levelMultiplier = 1 + (level - 1) * 0.1;
    return Math.round(baseDurability * levelMultiplier);
  }

  getItemType(item) {
    if (item.type === 'melee' || item.type === 'ranged' || item.type === 'magic') {
      return 'weapon';
    } else if (['head', 'chest', 'hands', 'legs', 'feet'].includes(item.type)) {
      return 'armor';
    } else {
      return 'accessory';
    }
  }

  getItemSlot(item) {
    if (item.type === 'melee' || item.type === 'ranged' || item.type === 'magic') {
      return 'weapon';
    } else if (item.type === 'head') {
      return 'head';
    } else if (item.type === 'chest') {
      return 'chest';
    } else if (item.type === 'hands') {
      return 'hands';
    } else if (item.type === 'legs') {
      return 'legs';
    } else if (item.type === 'feet') {
      return 'feet';
    } else if (item.type === 'finger') {
      return 'ring';
    } else if (item.type === 'neck') {
      return 'neck';
    } else if (item.type === 'waist') {
      return 'waist';
    } else {
      return 'unknown';
    }
  }

  generateItemName(item, prefixes, suffixes) {
    let name = item.name;
    
    // 构建前缀字符串
    const prefixText = prefixes.length > 0 ? prefixes.map(p => p.name.replace('的', '')).join('') : '';
    
    // 构建后缀字符串
    const suffixText = suffixes.length > 0 ? suffixes.map(s => s.name.replace('之', '')).join('') : '';
    
    // 统一格式：xx之xx的物品名
    if (prefixText && suffixText) {
      name = `${prefixText}之${suffixText}的${item.name}`;
    } else if (prefixText) {
      name = `${prefixText}的${item.name}`;
    } else if (suffixText) {
      name = `${suffixText}之${item.name}`;
    }

    return name;
  }
}

// 初始化游戏
const game = new RPGGame();
game.loadGameData();
