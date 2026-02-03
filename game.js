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
    // 加载物品数据
    this.items.weapons = await this.loadJSON('items/weapons.json').weapons;
    this.items.armors = await this.loadJSON('items/armors.json').armors;
    this.items.accessories = await this.loadJSON('items/accessories.json').accessories;

    // 加载词缀数据
    this.affixes.prefixes = await this.loadJSON('affixes/prefixes.json').prefixes;
    this.affixes.suffixes = await this.loadJSON('affixes/suffixes.json').suffixes;
    this.affixes.uniques = await this.loadJSON('affixes/uniques.json').uniques;

    // 加载角色数据
    const classesData = await this.loadJSON('characters/classes.json');
    this.characters.classes = classesData.classes;
    this.characters.attributes = await this.loadJSON('characters/attributes.json').attributes;

    // 加载敌人数据
    this.enemies = await this.loadJSON('enemies/enemies.json').enemies;

    // 加载掉落系统
    this.lootSystem = await this.loadJSON('loot/loot_system.json');

    // 加载核心机制
    this.coreMechanics = await this.loadJSON('mechanics/core_mechanics.json');

    // 加载配置
    this.config = await this.loadJSON('config.json');

    console.log('游戏数据加载完成！');
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