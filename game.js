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
      attributes: {}
    };
    this.enemies = [];
    this.lootSystem = {};
    this.coreMechanics = {};
    this.config = {};
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
      console.log('加载的文件数量:', 12);
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
    return await response.json();
  }

  generateLoot(enemy) {
    // 生成掉落物品的逻辑
    const loot = [];
    const dropChance = Math.random() * 100;

    if (dropChance <= enemy.loot_chance) {
      // 确定稀有度
      const rarity = this.determineRarity(enemy.drop_table);
      
      // 生成基础物品
      const baseItem = this.generateBaseItem(enemy);
      
      // 应用词缀
      const finalItem = this.applyAffixes(baseItem, rarity);
      
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
    const itemTypes = enemy.preferred_items;
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

    return itemPool[Math.floor(Math.random() * itemPool.length)];
  }

  applyAffixes(item, rarity) {
    const affixSlots = this.lootSystem.rarity[rarity].affix_slots;
    let affixesApplied = [];

    // 应用前缀
    if (affixSlots > 0) {
      const applicablePrefixes = this.affixes.prefixes.filter(p => 
        p.applicable_types.includes(this.getItemType(item))
      );
      
      if (applicablePrefixes.length > 0) {
        const prefix = applicablePrefixes[Math.floor(Math.random() * applicablePrefixes.length)];
        affixesApplied.push({ type: 'prefix', affix: prefix });
      }
    }

    // 应用后缀
    if (affixSlots > 1) {
      const applicableSuffixes = this.affixes.suffixes.filter(s => 
        s.applicable_types.includes(this.getItemType(item))
      );
      
      if (applicableSuffixes.length > 0) {
        const suffix = applicableSuffixes[Math.floor(Math.random() * applicableSuffixes.length)];
        affixesApplied.push({ type: 'suffix', affix: suffix });
      }
    }

    return {
      ...item,
      rarity,
      affixes: affixesApplied,
      final_name: this.generateItemName(item, affixesApplied)
    };
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

  generateItemName(item, affixes) {
    let name = item.name;
    
    affixes.forEach(({ type, affix }) => {
      if (type === 'prefix') {
        name = affix.name + name;
      } else if (type === 'suffix') {
        name += affix.name;
      }
    });

    return name;
  }
}

// 初始化游戏
const game = new RPGGame();
game.loadGameData();
