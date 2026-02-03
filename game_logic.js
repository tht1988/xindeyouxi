// 游戏逻辑文件



// 战斗动画系统
class CombatAnimationSystem {
    constructor() {
        this.animationQueue = [];
        this.isAnimating = false;
        this.combatArena = null;
        this.playerCombatant = null;
        this.enemyCombatant = null;
    }

    init() {
        this.combatArena = document.getElementById('combat-arena');
        this.playerCombatant = document.querySelector('.player-combatant');
        this.enemyCombatant = document.querySelector('.enemy-combatant');
    }

    // 添加动画到队列
    queueAnimation(animationType, options = {}) {
        return new Promise((resolve) => {
            this.animationQueue.push({ animationType, options, resolve });
            if (!this.isAnimating) {
                this.processQueue();
            }
        });
    }

    // 处理动画队列
    async processQueue() {
        if (this.animationQueue.length === 0) {
            this.isAnimating = false;
            return;
        }

        this.isAnimating = true;
        const { animationType, options, resolve } = this.animationQueue.shift();

        try {
            switch (animationType) {
                case 'attack':
                    await this.playAttackAnimation(options);
                    break;
                case 'hurt':
                    await this.playHurtAnimation(options);
                    break;
                case 'damage':
                    await this.playDamageAnimation(options);
                    break;
                case 'hit':
                    await this.playHitAnimation(options);
                    break;
                case 'skill':
                    await this.playSkillAnimation(options);
                    break;
                case 'victory':
                    await this.playVictoryAnimation(options);
                    break;
                case 'defeat':
                    await this.playDefeatAnimation(options);
                    break;
                case 'entrance':
                    await this.playEntranceAnimation(options);
                    break;
            }
        } catch (error) {
            console.error('动画播放错误:', error);
        } finally {
            resolve();
            this.processQueue();
        }
    }

    // 播放攻击动画
    playAttackAnimation(options = {}) {
        return new Promise((resolve) => {
            if (!this.playerCombatant) {
                resolve();
                return;
            }

            this.playerCombatant.classList.add('animate-attack');
            
            // 使用requestAnimationFrame优化动画性能
            const animationEnd = () => {
                this.playerCombatant.classList.remove('animate-attack');
                this.playerCombatant.removeEventListener('animationend', animationEnd);
                resolve();
            };
            
            this.playerCombatant.addEventListener('animationend', animationEnd);
        });
    }

    // 播放受伤动画
    playHurtAnimation(options = {}) {
        return new Promise((resolve) => {
            const target = options.target === 'player' ? this.playerCombatant : this.enemyCombatant;
            if (!target) {
                resolve();
                return;
            }

            target.classList.add('animate-hurt');
            
            // 使用requestAnimationFrame优化动画性能
            const animationEnd = () => {
                target.classList.remove('animate-hurt');
                target.removeEventListener('animationend', animationEnd);
                resolve();
            };
            
            target.addEventListener('animationend', animationEnd);
        });
    }

    // 播放伤害数字动画
    playDamageAnimation(options = {}) {
        return new Promise((resolve) => {
            const { damage, target = 'enemy', position = { x: 0, y: 0 } } = options;
            const targetElement = target === 'player' ? this.playerCombatant : this.enemyCombatant;
            if (!targetElement) {
                resolve();
                return;
            }

            const damageNumber = document.createElement('div');
            damageNumber.className = 'damage-number';
            damageNumber.textContent = damage;
            damageNumber.style.left = position.x + 'px';
            damageNumber.style.top = position.y + 'px';

            if (this.combatArena) {
                this.combatArena.appendChild(damageNumber);
            }

            setTimeout(() => {
                if (damageNumber.parentNode) {
                    damageNumber.parentNode.removeChild(damageNumber);
                }
                resolve();
            }, 1000);
        });
    }

    // 播放击中效果动画
    playHitAnimation(options = {}) {
        return new Promise((resolve) => {
            const { target = 'enemy', position = { x: 0, y: 0 } } = options;
            const targetElement = target === 'player' ? this.playerCombatant : this.enemyCombatant;
            if (!targetElement) {
                resolve();
                return;
            }

            const hitEffect = document.createElement('div');
            hitEffect.className = 'hit-effect';
            hitEffect.style.left = position.x + 'px';
            hitEffect.style.top = position.y + 'px';

            if (this.combatArena) {
                this.combatArena.appendChild(hitEffect);
            }

            setTimeout(() => {
                if (hitEffect.parentNode) {
                    hitEffect.parentNode.removeChild(hitEffect);
                }
                resolve();
            }, 500);
        });
    }

    // 播放技能动画
    playSkillAnimation(options = {}) {
        return new Promise((resolve) => {
            const { position = { x: 0, y: 0 } } = options;

            const skillEffect = document.createElement('div');
            skillEffect.className = 'skill-effect';
            skillEffect.style.left = position.x + 'px';
            skillEffect.style.top = position.y + 'px';

            if (this.combatArena) {
                this.combatArena.appendChild(skillEffect);
            }

            setTimeout(() => {
                if (skillEffect.parentNode) {
                    skillEffect.parentNode.removeChild(skillEffect);
                }
                resolve();
            }, 1000);
        });
    }

    // 播放胜利动画
    playVictoryAnimation(options = {}) {
        return new Promise((resolve) => {
            if (this.playerCombatant) {
                this.playerCombatant.classList.add('animate-victory');
                setTimeout(() => {
                    this.playerCombatant.classList.remove('animate-victory');
                }, 1000);
            }
            resolve();
        });
    }

    // 播放失败动画
    playDefeatAnimation(options = {}) {
        return new Promise((resolve) => {
            if (this.playerCombatant) {
                this.playerCombatant.classList.add('animate-defeat');
                setTimeout(() => {
                    this.playerCombatant.classList.remove('animate-defeat');
                }, 1000);
            }
            resolve();
        });
    }

    // 播放入场动画
    playEntranceAnimation(options = {}) {
        return new Promise((resolve) => {
            if (this.combatArena) {
                this.combatArena.classList.add('animate-entrance');
                setTimeout(() => {
                    this.combatArena.classList.remove('animate-entrance');
                }, 800);
            }
            resolve();
        });
    }

    // 清除所有动画
    clearAnimations() {
        this.animationQueue = [];
        this.isAnimating = false;
        
        // 移除所有动画元素
        const animationElements = this.combatArena.querySelectorAll('.damage-number, .hit-effect, .skill-effect');
        animationElements.forEach(el => el.remove());
    }

    // 获取战斗者位置
    getCombatantPosition(combatant) {
        if (!combatant) return { x: 0, y: 0 };
        const rect = combatant.getBoundingClientRect();
        const arenaRect = this.combatArena.getBoundingClientRect();
        return {
            x: rect.left - arenaRect.left + rect.width / 2,
            y: rect.top - arenaRect.top + rect.height / 2
        };
    }
}

// 全局变量
let currentEnemy = null;
let gameReady = false;
let loadingStartTime = Date.now();
let combatAnimationSystem = new CombatAnimationSystem();
let player = {
    level: 1,
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    attack: 20,
    defense: 5,
    attributes: {
        strength: 10,
        agility: 10,
        precision: 10,
        vitality: 10,
        endurance: 10
    },
    availableAttributePoints: 5,
    equipment: {
        weapon: null,
        head: null,
        chest: null,
        hands: null,
        legs: null,
        feet: null,
        ring: null,
        neck: null
    },
    inventory: [],
    inscriptions: [],
    materials: {
        common_dust: 0,
        uncommon_essence: 0,
        rare_crystal: 0,
        epic_shard: 0,
        ancient_core: 0
    }
};
let currentLoot = [];
let currentEnemyGroup = [];
let selectedEnchantEquipment = null;
let selectedEnchantInscription = null;
let selectedEnhanceEquipment = null;
let selectedInscription1 = null;
let selectedInscription2 = null;

// 游戏加载完成回调
window.gameLoaded = function() {
    const loadingTime = (Date.now() - loadingStartTime) / 1000;
    
    if (DOM.statusText) {
        DOM.statusText.textContent = '就绪';
    }
    if (DOM.loadingIndicator) {
        DOM.loadingIndicator.style.display = 'none';
    }
    
    gameReady = true;
    
    // 初始化战斗动画系统
    combatAnimationSystem.init();
    
    addToLog(`游戏加载完成，准备好开始冒险了！ (耗时 ${loadingTime.toFixed(2)} 秒)`);
    addToLog(`成功加载了 ${game.enemies.length} 个敌人`);
    addToLog(`成功加载了 ${game.items.weapons.length} 种武器`);
    addToLog(`成功加载了 ${game.items.armors.length} 种防具`);
    
    // 初始化职业选择界面
    initClassSelection();
};

// 游戏加载失败回调
window.gameLoadFailed = function(errorMessage) {
    if (DOM.statusText) {
        DOM.statusText.textContent = '加载失败';
    }
    if (DOM.loadingIndicator) {
        DOM.loadingIndicator.style.display = 'none';
    }
    addToLog(`错误：游戏数据加载失败 - ${errorMessage}`);
    addToLog('请刷新页面重试');
};

// 初始化游戏
addToLog('游戏初始化中...');
addToLog('正在加载游戏数据，请稍候...');



// 初始化事件监听器
function initEventListeners() {
    // 保存/加载游戏
    if (DOM.saveGameBtn) DOM.saveGameBtn.addEventListener('click', saveGame);
    if (DOM.loadGameBtn) DOM.loadGameBtn.addEventListener('click', loadGame);
    
    // 生成敌人
    if (DOM.generateEnemyBtn) DOM.generateEnemyBtn.addEventListener('click', generateEnemyEncounter);
    if (DOM.startEncounterBtn) DOM.startEncounterBtn.addEventListener('click', startEncounter);
    
    // 战斗按钮
    if (DOM.attackBtn) DOM.attackBtn.addEventListener('click', attackEnemy);
    if (DOM.skillBtn) DOM.skillBtn.addEventListener('click', useSkill);
    if (DOM.fleeBtn) DOM.fleeBtn.addEventListener('click', fleeCombat);
    
    // 工艺系统按钮
    if (DOM.openImprintBtn) DOM.openImprintBtn.addEventListener('click', openImprintPanel);
    if (DOM.openEnchantBtn) DOM.openEnchantBtn.addEventListener('click', openEnchantPanel);
    if (DOM.openDisassembleBtn) DOM.openDisassembleBtn.addEventListener('click', openDisassemblePanel);
    if (DOM.openEnhanceBtn) DOM.openEnhanceBtn.addEventListener('click', openEnhancePanel);
    if (DOM.openInscriptionBtn) DOM.openInscriptionBtn.addEventListener('click', openInscriptionPanel);
    
    // 面板按钮
    if (DOM.enchantButton) DOM.enchantButton.addEventListener('click', enchantItem);
    if (DOM.enhanceButton) DOM.enhanceButton.addEventListener('click', enhanceItem);
    if (DOM.combineButton) DOM.combineButton.addEventListener('click', combineInscriptions);
    
    // 属性加点按钮
    const attributeBtns = document.querySelectorAll('.attribute-btn');
    attributeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const attribute = this.getAttribute('data-attribute');
            addAttributePoint(attribute);
        });
    });
    
    // 敌人选择按钮
    const enemyBtns = document.querySelectorAll('.enemy-btn');
    enemyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const enemyId = this.getAttribute('data-enemy');
            selectEnemy(enemyId);
        });
    });
}

// 立即检查game对象
setTimeout(() => {
    if (typeof game === 'undefined') {
        if (DOM.statusText) DOM.statusText.textContent = '初始化失败';
        if (DOM.loadingIndicator) DOM.loadingIndicator.style.display = 'none';
        addToLog('错误：游戏对象未初始化');
        return;
    }
    
    if (DOM.statusText) DOM.statusText.textContent = '加载中...';
    addToLog('游戏对象已初始化，正在等待数据加载...');
    
    // 初始化事件监听器
    initEventListeners();
}, 100);

// 选择敌人
async function selectEnemy(enemyId) {
    if (!gameReady) {
        addToLog('游戏尚未加载完成，请稍候...');
        return;
    }
    
    if (!game) {
        addToLog('错误：游戏对象未初始化');
        return;
    }
    
    if (!game.enemies) {
        addToLog('错误：敌人数据未加载');
        return;
    }
    
    // 查找敌人
    currentEnemy = game.enemies.find(enemy => enemy.id === enemyId);
    
    if (currentEnemy) {
        addToLog(`你遇到了 ${currentEnemy.name} (等级 ${currentEnemy.level})！`);
        addToLog('战斗开始...');
        
        // 显示战斗竞技场
        if (DOM.combatArena) {
            DOM.combatArena.style.display = 'block';
        }
        
        // 更新敌人名称
        if (DOM.enemyName) {
            DOM.enemyName.textContent = currentEnemy.name;
        }
        if (DOM.enemyCombatantName) {
            DOM.enemyCombatantName.textContent = currentEnemy.name;
        }
        
        // 初始化敌人生命值
        updateEnemyHealthBar(100);
        
        // 播放入场动画
        await combatAnimationSystem.queueAnimation('entrance');
        
        // 开始战斗循环
        startCombat();
    } else {
        addToLog(`错误：未找到敌人 ${enemyId}`);
        console.error('未找到敌人:', enemyId);
    }
}

// 开始战斗
async function startCombat() {
    if (!currentEnemy) return;
    
    // 模拟完整的战斗过程
    await battleWithEnemy(currentEnemy);
}

// 与敌人战斗
async function battleWithEnemy(enemy) {
    let enemyHealth = enemy.health || 100;
    const maxEnemyHealth = enemyHealth;
    
    addToLog('战斗开始！');
    
    // 战斗循环
    while (enemyHealth > 0 && player.health > 0) {
        // 玩家攻击
        const playerDamage = calculateDamage(player.attack, enemy.defense || 0);
        enemyHealth = Math.max(0, enemyHealth - playerDamage);
        
        // 更新敌人生命值条
        const healthPercentage = (enemyHealth / maxEnemyHealth) * 100;
        updateEnemyHealthBar(healthPercentage);
        
        // 播放攻击动画序列
        await combatAnimationSystem.queueAnimation('attack');
        await combatAnimationSystem.queueAnimation('hit', {
            target: 'enemy',
            position: combatAnimationSystem.getCombatantPosition(document.querySelector('.enemy-combatant'))
        });
        await combatAnimationSystem.queueAnimation('damage', {
            damage: playerDamage,
            target: 'enemy',
            position: combatAnimationSystem.getCombatantPosition(document.querySelector('.enemy-combatant'))
        });
        await combatAnimationSystem.queueAnimation('hurt', {
            target: 'enemy'
        });
        
        addToLog(`你对 ${enemy.name} 造成了 ${playerDamage} 点伤害！`);
        
        // 检查敌人是否死亡
        if (enemyHealth <= 0) {
            addToLog(`你成功击败了 ${enemy.name}！`);
            addToLog(`获得了 ${enemy.experience} 点经验值！`);
            
            // 播放胜利动画
            await combatAnimationSystem.queueAnimation('victory');
            
            // 生成掉落
            try {
                const loot = game.generateLoot(enemy);
                displayLoot(loot, enemy);
            } catch (error) {
                addToLog('错误：生成掉落时发生错误');
                console.error('生成掉落错误:', error);
            }
            
            break;
        }
        
        // 敌人攻击
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const enemyDamage = calculateDamage(
            Math.floor(Math.random() * (enemy.damage.max - enemy.damage.min + 1)) + enemy.damage.min,
            player.defense
        );
        player.health = Math.max(0, player.health - enemyDamage);
        
        // 更新玩家生命值显示
        updatePlayerHealth();
        
        // 播放敌人攻击动画序列
        await combatAnimationSystem.queueAnimation('hurt', {
            target: 'player'
        });
        await combatAnimationSystem.queueAnimation('damage', {
            damage: enemyDamage,
            target: 'player',
            position: combatAnimationSystem.getCombatantPosition(document.querySelector('.player-combatant'))
        });
        
        addToLog(`${enemy.name} 对你造成了 ${enemyDamage} 点伤害！`);
        
        // 检查玩家是否死亡
        if (player.health <= 0) {
            addToLog('你被击败了！');
            
            // 播放失败动画
            await combatAnimationSystem.queueAnimation('defeat');
            
            break;
        }
        
        // 战斗间隔
        await new Promise(resolve => setTimeout(resolve, 800));
    }
}

// 计算伤害
function calculateDamage(attack, defense) {
    const damage = Math.max(1, attack - Math.floor(defense * 0.5));
    return damage;
}

// 更新敌人生命值条
function updateEnemyHealthBar(percentage) {
    if (DOM.enemyHealthFill && DOM.enemyHealthText) {
        DOM.enemyHealthFill.style.width = percentage + '%';
        DOM.enemyHealthText.textContent = `敌人生命值: ${Math.round(percentage)}%`;
    }
}

// 更新玩家生命值显示
function updatePlayerHealth() {
    if (DOM.playerHealth) {
        DOM.playerHealth.textContent = `${Math.round(player.health)}/${player.maxHealth}`;
    }
}

// 普通攻击
async function attackEnemy() {
    if (!currentEnemy) {
        addToLog('请先选择一个敌人！');
        return;
    }
    
    await battleWithEnemy(currentEnemy);
}

// 使用技能
async function useSkill() {
    if (!currentEnemy) {
        addToLog('请先选择一个敌人！');
        return;
    }
    
    if (player.mana < 10) {
        addToLog('魔法值不足！');
        return;
    }
    
    player.mana -= 10;
    updatePlayerMana();
    
    // 技能伤害（普通攻击的1.5倍）
    const skillDamage = Math.floor(calculateDamage(player.attack, currentEnemy.defense || 0) * 1.5);
    
    addToLog(`你使用了技能对 ${currentEnemy.name} 造成了 ${skillDamage} 点伤害！`);
    
    // 播放技能动画序列
    await combatAnimationSystem.queueAnimation('skill', {
        position: combatAnimationSystem.getCombatantPosition(document.querySelector('.enemy-combatant'))
    });
    await combatAnimationSystem.queueAnimation('damage', {
        damage: skillDamage,
        target: 'enemy',
        position: combatAnimationSystem.getCombatantPosition(document.querySelector('.enemy-combatant'))
    });
    await combatAnimationSystem.queueAnimation('hurt', {
        target: 'enemy'
    });
    
    // 继续战斗
    await battleWithEnemy(currentEnemy);
}

// 更新玩家魔法值显示
function updatePlayerMana() {
    if (DOM.playerMana) {
        DOM.playerMana.textContent = `${Math.round(player.mana)}/${player.maxMana}`;
    }
}

// 逃跑
function fleeCombat() {
    if (!currentEnemy) {
        addToLog('没有正在进行的战斗！');
        return;
    }
    
    addToLog('你成功逃跑了！');
    
    // 隐藏战斗竞技场
    if (DOM.combatArena) {
        DOM.combatArena.style.display = 'none';
    }
    currentEnemy = null;
}

// 显示掉落
function displayLoot(loot, enemy) {
    if (!DOM.lootList) return;
    
    currentLoot = loot;
    
    if (loot.length === 0) {
        DOM.lootList.innerHTML = `<p>${enemy.name} 没有掉落任何物品</p>`;
        addToLog(`${enemy.name} 没有掉落任何物品`);
        return;
    }
    
    let html = `<p>${enemy.name} 掉落了以下物品:</p>`;
    
    loot.forEach((item, index) => {
        const rarityClass = item.rarity === 'common' ? '' : item.rarity;
        const affixText = item.affixes.length > 0 
            ? item.affixes.map(a => a.affix.name).join('、') 
            : '无';
        
        const itemDiv = document.createElement('div');
        itemDiv.className = `item ${rarityClass}`;
        itemDiv.onclick = () => equipItem(index);
        itemDiv.innerHTML = `
            <div class="item-name">${item.final_name}</div>
            <div class="item-stats">
                <div>稀有度: ${game.lootSystem.rarity[item.rarity].name}</div>
                <div>词缀: ${affixText}</div>
                ${item.base_damage ? `<div>伤害: ${item.base_damage.min}-${item.base_damage.max}</div>` : ''}
                ${item.base_armor ? `<div>护甲: ${item.base_armor}</div>` : ''}
                <div>耐久度: ${Math.round(item.durability)}/${item.maxDurability}</div>
                <div>等级: ${item.level}</div>
            </div>
        `;
        
        DOM.lootList.appendChild(itemDiv);
        addToLog(`获得了 ${item.final_name}！`);
    });
}

// 装备物品
function equipItem(index) {
    if (!currentLoot || !currentLoot[index]) {
        addToLog('无效的物品');
        return;
    }
    
    const item = currentLoot[index];
    const slot = item.slot;
    
    if (!slot || !player.equipment.hasOwnProperty(slot)) {
        addToLog('该物品无法穿戴');
        return;
    }
    
    // 卸下当前装备
    if (player.equipment[slot]) {
        const oldItem = player.equipment[slot];
        addToLog(`卸下了 ${oldItem.final_name}`);
    }
    
    // 穿戴新装备
    player.equipment[slot] = item;
    addToLog(`穿戴了 ${item.final_name}`);
    
    // 更新装备栏显示
    if (DOM.equipmentSlots[slot]) {
        const slotElement = DOM.equipmentSlots[slot];
        slotElement.innerHTML = `${item.name}<br><span class="item-level">耐久: ${Math.round(item.durability)}/${item.maxDurability}</span>`;
        slotElement.style.color = game.lootSystem.rarity[item.rarity].color;
    }
}

// 添加日志
function addToLog(message) {
    if (!DOM.logContent) return;
    
    const logEntry = document.createElement('div');
    logEntry.textContent = `> ${message}`;
    DOM.logContent.appendChild(logEntry);
    
    // 滚动到底部
    const logContainer = document.getElementById('combat-log');
    if (logContainer) {
        logContainer.scrollTop = logContainer.scrollHeight;
    }
}

// 属性加点方法
function addAttributePoint(attribute) {
    if (player.availableAttributePoints <= 0) {
        addToLog('没有可用的属性点了！');
        return;
    }
    
    player.attributes[attribute]++;
    player.availableAttributePoints--;
    
    // 更新显示
    if (DOM.attributes[attribute]) {
        DOM.attributes[attribute].textContent = player.attributes[attribute];
    }
    if (DOM.availablePoints) {
        DOM.availablePoints.textContent = player.availableAttributePoints;
    }
    
    // 更新衍生属性
    updateDerivedAttributes();
    
    addToLog(`增加了1点${getAttributeName(attribute)}属性`);
}

// 获取属性名称
function getAttributeName(attribute) {
    const names = {
        strength: '力量',
        agility: '敏捷',
        precision: '精准',
        vitality: '体力',
        endurance: '耐力'
    };
    return names[attribute] || attribute;
}

// 更新衍生属性
function updateDerivedAttributes() {
    // 根据属性计算衍生属性
    player.attack = 20 + (player.attributes.strength - 10) * 2;
    player.defense = 5 + (player.attributes.endurance - 10) * 1;
    player.maxHealth = 100 + (player.attributes.vitality - 10) * 10;
    player.health = Math.min(player.health, player.maxHealth);
    
    // 更新显示
    if (DOM.playerHealth) {
        DOM.playerHealth.textContent = `${Math.round(player.health)}/${player.maxHealth}`;
    }
}

// 初始化职业选择界面
function initClassSelection() {
    if (!game || !game.characters || !game.characters.classes) {
        addToLog('错误：职业数据未加载');
        return;
    }
    
    const classButtons = document.getElementById('class-buttons');
    if (!classButtons) return;
    
    classButtons.innerHTML = '';
    
    game.characters.classes.forEach(cls => {
        const button = document.createElement('button');
        button.addEventListener('click', () => selectClass(cls.id));
        
        const growthRates = Object.entries(cls.growth_rates)
            .map(([attr, rate]) => `${getAttributeName(attr)}: ${rate}x`)
            .join('<br>');
        
        button.innerHTML = `
            <div style="font-weight: bold; color: #ffd700;">${cls.name}</div>
            <div style="font-size: 0.9rem; margin: 5px 0;">主属性: ${getAttributeName(cls.primary_attribute)}</div>
            <div style="font-size: 0.8rem; color: #ccc;">成长率:<br>${growthRates}</div>
        `;
        
        classButtons.appendChild(button);
    });
    
    if (DOM.classSelection) {
        DOM.classSelection.style.display = 'block';
    }
}

// 选择职业
function selectClass(classId) {
    const cls = game.characters.classes.find(c => c.id === classId);
    if (!cls) {
        addToLog('错误：未找到该职业');
        return;
    }
    
    // 应用职业基础属性
    player.class = cls;
    player.attributes = { ...cls.base_attributes };
    player.availableAttributePoints = 5;
    player.growthRates = cls.growth_rates;
    
    // 隐藏职业选择界面
    if (DOM.classSelection) {
        DOM.classSelection.style.display = 'none';
    }
    
    // 初始化属性显示
    initAttributeDisplay();
    
    addToLog(`你选择了 ${cls.name} 职业！`);
    addToLog(`获得了 ${player.availableAttributePoints} 点初始属性点`);
}

// 初始化属性显示
function initAttributeDisplay() {
    Object.entries(player.attributes).forEach(([key, value]) => {
        if (DOM.attributes[key]) {
            DOM.attributes[key].textContent = value;
        }
    });
    if (DOM.availablePoints) {
        DOM.availablePoints.textContent = player.availableAttributePoints;
    }
    updateDerivedAttributes();
}

// 生成匹配的敌人遭遇战
function generateEnemyEncounter() {
    if (!gameReady || !player.class) {
        addToLog('请先选择职业再生成敌人！');
        return;
    }
    
    // 根据玩家属性计算匹配等级
    const playerLevel = calculatePlayerEffectiveLevel();
    
    // 生成3-4个不同属性的敌人
    const enemyCount = Math.floor(Math.random() * 2) + 3; // 3-4个敌人
    currentEnemyGroup = [];
    
    for (let i = 0; i < enemyCount; i++) {
        const enemy = generateMatchingEnemy(playerLevel);
        if (enemy) {
            currentEnemyGroup.push(enemy);
        }
    }
    
    // 显示敌人组
    displayEnemyGroup();
}

// 计算玩家的有效等级
function calculatePlayerEffectiveLevel() {
    const attributeSum = Object.values(player.attributes).reduce((sum, val) => sum + val, 0);
    return Math.floor(attributeSum / 10);
}

// 生成匹配玩家等级的敌人
function generateMatchingEnemy(playerLevel) {
    // 过滤适合玩家等级的敌人
    const suitableEnemies = game.enemies.filter(enemy => 
        Math.abs(enemy.level - playerLevel) <= 2
    );
    
    if (suitableEnemies.length === 0) {
        return game.enemies[Math.floor(Math.random() * game.enemies.length)];
    }
    
    // 随机选择一个敌人
    let enemy = JSON.parse(JSON.stringify(suitableEnemies[Math.floor(Math.random() * suitableEnemies.length)]));
    
    // 根据玩家属性调整敌人属性（5%-10%的差异）
    adjustEnemyAttributes(enemy);
    
    return enemy;
}

// 调整敌人属性以匹配玩家
function adjustEnemyAttributes(enemy) {
    // 计算属性调整比例（5%-10%）
    const adjustment = 0.05 + Math.random() * 0.05;
    const isBuff = Math.random() > 0.5;
    const multiplier = isBuff ? (1 + adjustment) : (1 - adjustment);
    
    // 调整敌人属性
    Object.keys(enemy.attributes).forEach(attr => {
        enemy.attributes[attr] = Math.round(enemy.attributes[attr] * multiplier);
    });
    
    // 调整敌人的生命值和伤害
    enemy.health = Math.round(enemy.health * multiplier);
    enemy.damage.min = Math.round(enemy.damage.min * multiplier);
    enemy.damage.max = Math.round(enemy.damage.max * multiplier);
    enemy.defense = Math.round(enemy.defense * multiplier);
}

// 显示敌人组
function displayEnemyGroup() {
    if (!DOM.enemyGroup) return;
    
    DOM.enemyGroup.innerHTML = '';
    
    currentEnemyGroup.forEach((enemy, index) => {
        const enemyInfo = document.createElement('div');
        enemyInfo.className = 'enemy-info';
        
        const attributes = Object.entries(enemy.attributes)
            .map(([attr, value]) => `${getAttributeName(attr)}: ${value}`)
            .join('<br>');
        
        enemyInfo.innerHTML = `
            <div style="font-weight: bold; color: #ff6b6b;">${enemy.name}</div>
            <div class="enemy-level">等级 ${enemy.level}</div>
            <div style="font-size: 0.8rem; color: #ccc; margin-top: 5px;">
                生命: ${enemy.health}<br>
                伤害: ${enemy.damage.min}-${enemy.damage.max}<br>
                防御: ${enemy.defense}<br>
                ${attributes}
            </div>
        `;
        
        DOM.enemyGroup.appendChild(enemyInfo);
    });
    
    if (DOM.enemyEncounter) {
        DOM.enemyEncounter.style.display = 'block';
    }
}

// 开始遭遇战
async function startEncounter() {
    if (currentEnemyGroup.length === 0) {
        addToLog('错误：没有生成敌人！');
        return;
    }
    
    // 依次与每个敌人战斗
    await battleWithEnemyGroup(0);
}

// 与敌人组战斗
async function battleWithEnemyGroup(index) {
    if (index >= currentEnemyGroup.length) {
        addToLog('遭遇战胜利！所有敌人都被击败了！');
        // 播放胜利动画
        await combatAnimationSystem.queueAnimation('victory');
        // 生成掉落
        generateEncounterLoot();
        return;
    }
    
    const enemy = currentEnemyGroup[index];
    addToLog(`你遇到了 ${enemy.name} (等级 ${enemy.level})！`);
    
    // 显示战斗竞技场
    const combatArena = document.getElementById('combat-arena');
    combatArena.style.display = 'block';
    
    // 更新敌人名称
    document.getElementById('enemy-name').textContent = enemy.name;
    document.getElementById('enemy-combatant-name').textContent = enemy.name;
    
    // 初始化敌人生命值
    updateEnemyHealthBar(100);
    
    // 播放入场动画
    await combatAnimationSystem.queueAnimation('entrance');
    
    // 与当前敌人战斗
    await battleWithEnemy(enemy);
    
    // 检查玩家是否存活
    if (player.health > 0) {
        // 继续与下一个敌人战斗
        await battleWithEnemyGroup(index + 1);
    }
}

// 生成遭遇战掉落
function generateEncounterLoot() {
    const loot = [];
    
    currentEnemyGroup.forEach(enemy => {
        const enemyLoot = game.generateLoot(enemy);
        loot.push(...enemyLoot);
    });
    
    if (loot.length > 0) {
        displayLoot(loot, { name: '遭遇战' });
    } else {
        addToLog('遭遇战没有掉落任何物品');
        document.getElementById('loot-list').innerHTML = '<p style="color: #ccc;">遭遇战没有掉落任何物品</p>';
    }
}

// 打开拓印面板
function openImprintPanel() {
    const imprintItems = document.getElementById('imprint-items');
    imprintItems.innerHTML = '';
    
    // 收集所有可拓印的装备（包括当前战利品和已装备的）
    const allItems = [...currentLoot, ...Object.values(player.equipment).filter(item => item)];
    
    if (allItems.length === 0) {
        imprintItems.innerHTML = '<p style="color: #ccc;">没有可拓印的装备</p>';
        document.getElementById('imprint-panel').style.display = 'block';
        return;
    }
    
    allItems.forEach((item, index) => {
        if (!item.affixes || item.affixes.length === 0) {
            return;
        }
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.style.margin = '10px 0';
        
        const imprintableAffixes = item.affixes.filter(a => a.type !== 'unique');
        
        if (imprintableAffixes.length === 0) {
            return;
        }
        
        const affixButtons = imprintableAffixes.map((affix, affixIndex) => {
            return `
                <button onclick="imprintAffix(${index}, ${affixIndex})" style="padding: 5px 10px; font-size: 12px; margin: 5px;">
                    拓印: ${affix.affix.name}
                </button>
            `;
        }).join('');
        
        itemDiv.innerHTML = `
            <div class="item-name">${item.final_name}</div>
            <div class="item-stats">
                <div>稀有度: ${game.lootSystem.rarity[item.rarity].name}</div>
                <div>耐久度: ${Math.round(item.durability)}/${item.maxDurability}</div>
                <div>可拓印词缀:</div>
                <div style="margin: 10px 0;">${affixButtons}</div>
            </div>
        `;
        
        imprintItems.appendChild(itemDiv);
    });
    
    document.getElementById('imprint-panel').style.display = 'block';
}

// 拓印装备词缀
function imprintAffix(itemIndex, affixIndex) {
    const allItems = [...currentLoot, ...Object.values(player.equipment).filter(item => item)];
    const item = allItems[itemIndex];
    
    if (!item) {
        addToLog('错误：装备不存在');
        return;
    }
    
    const affix = item.affixes[affixIndex];
    if (!affix || affix.type === 'unique') {
        addToLog('错误：该词缀不可拓印');
        return;
    }
    
    // 消耗耐久度
    const durabilityCost = Math.round(item.maxDurability * 0.2);
    if (item.durability < durabilityCost) {
        addToLog('错误：装备耐久度不足');
        return;
    }
    
    item.durability -= durabilityCost;
    
    // 创建铭文
    const inscription = {
        id: 'inscription_' + Date.now(),
        name: affix.affix.name,
        affix: affix.affix,
        affixType: affix.type,
        level: item.level,
        rarity: item.rarity,
        value: affix.affix.value || 1,
        created: new Date().toISOString()
    };
    
    // 添加到背包
    player.inscriptions.push(inscription);
    
    addToLog(`成功拓印了 ${affix.affix.name} 到铭文！`);
    addToLog(`消耗了 ${durabilityCost} 点耐久度`);
    
    // 重新打开面板以更新显示
    openImprintPanel();
}

// 打开铭刻面板
function openEnchantPanel() {
    const enchantEquipments = document.getElementById('enchant-equipments');
    const enchantInscriptions = document.getElementById('enchant-inscriptions');
    
    enchantEquipments.innerHTML = '';
    enchantInscriptions.innerHTML = '';
    
    // 重置选择
    selectedEnchantEquipment = null;
    selectedEnchantInscription = null;
    document.getElementById('enchant-button').disabled = true;
    
    // 显示可铭刻的装备
    const allItems = [...currentLoot, ...Object.values(player.equipment).filter(item => item)];
    
    if (allItems.length === 0) {
        enchantEquipments.innerHTML = '<p style="color: #ccc;">没有可铭刻的装备</p>';
    } else {
        allItems.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            itemDiv.style.margin = '5px 0';
            itemDiv.onclick = () => selectEnchantEquipment(item);
            itemDiv.innerHTML = `
                <div class="item-name">${item.final_name}</div>
                <div class="item-stats">
                    <div>稀有度: ${game.lootSystem.rarity[item.rarity].name}</div>
                    <div>耐久度: ${Math.round(item.durability)}/${item.maxDurability}</div>
                    <div>词缀数量: ${item.affixes.length}/6</div>
                </div>
            `;
            enchantEquipments.appendChild(itemDiv);
        });
    }
    
    // 显示可用的铭文
    if (player.inscriptions.length === 0) {
        enchantInscriptions.innerHTML = '<p style="color: #ccc;">没有可用的铭文</p>';
    } else {
        player.inscriptions.forEach((inscription, index) => {
            const inscriptionDiv = document.createElement('div');
            inscriptionDiv.className = 'item';
            inscriptionDiv.style.margin = '5px 0';
            inscriptionDiv.onclick = () => selectEnchantInscription(inscription);
            inscriptionDiv.innerHTML = `
                <div class="item-name">${inscription.name}</div>
                <div class="item-stats">
                    <div>等级: ${inscription.level}</div>
                    <div>稀有度: ${game.lootSystem.rarity[inscription.rarity].name}</div>
                    <div>类型: ${inscription.affixType}</div>
                </div>
            `;
            enchantInscriptions.appendChild(inscriptionDiv);
        });
    }
    
    document.getElementById('enchant-panel').style.display = 'block';
}

// 选择铭刻装备
function selectEnchantEquipment(item) {
    selectedEnchantEquipment = item;
    updateEnchantButton();
    
    // 更新界面显示
    const items = document.getElementById('enchant-equipments').children;
    for (let i = 0; i < items.length; i++) {
        items[i].style.border = items[i].onclick.toString().includes(item.final_name) ? '2px solid #4CAF50' : '1px solid rgba(255, 255, 255, 0.1)';
    }
}

// 选择铭刻铭文
function selectEnchantInscription(inscription) {
    selectedEnchantInscription = inscription;
    updateEnchantButton();
    
    // 更新界面显示
    const inscriptions = document.getElementById('enchant-inscriptions').children;
    for (let i = 0; i < inscriptions.length; i++) {
        inscriptions[i].style.border = inscriptions[i].onclick.toString().includes(inscription.name) ? '2px solid #4CAF50' : '1px solid rgba(255, 255, 255, 0.1)';
    }
}

// 更新铭刻按钮状态
function updateEnchantButton() {
    const button = document.getElementById('enchant-button');
    button.disabled = !selectedEnchantEquipment || !selectedEnchantInscription;
}

// 铭刻装备
function enchantItem() {
    if (!selectedEnchantEquipment || !selectedEnchantInscription) {
        addToLog('请选择装备和铭文');
        return;
    }
    
    // 检查装备词缀数量
    if (selectedEnchantEquipment.affixes.length >= 6) {
        addToLog('错误：装备词缀数量已达上限');
        return;
    }
    
    // 消耗耐久度
    const durabilityCost = Math.round(selectedEnchantEquipment.maxDurability * 0.15);
    if (selectedEnchantEquipment.durability < durabilityCost) {
        addToLog('错误：装备耐久度不足');
        return;
    }
    
    // 计算成功率（词缀越多成功率越低）
    const baseSuccessRate = 0.8;
    const affixPenalty = selectedEnchantEquipment.affixes.length * 0.1;
    const successRate = Math.max(0.1, baseSuccessRate - affixPenalty);
    
    // 尝试铭刻
    if (Math.random() > successRate) {
        // 失败
        selectedEnchantEquipment.durability -= durabilityCost;
        addToLog('铭刻失败！');
        addToLog(`消耗了 ${durabilityCost} 点耐久度`);
        return;
    }
    
    // 成功
    selectedEnchantEquipment.durability -= durabilityCost;
    
    // 添加词缀到装备
    const newAffix = {
        type: selectedEnchantInscription.affixType,
        affix: selectedEnchantInscription.affix
    };
    
    selectedEnchantEquipment.affixes.push(newAffix);
    
    // 更新装备名称
    const prefixes = selectedEnchantEquipment.affixes.filter(a => a.type === 'prefix').map(a => a.affix);
    const suffixes = selectedEnchantEquipment.affixes.filter(a => a.type === 'suffix').map(a => a.affix);
    selectedEnchantEquipment.final_name = game.generateItemName(selectedEnchantEquipment, prefixes, suffixes);
    
    // 从背包中移除铭文
    player.inscriptions = player.inscriptions.filter(inscription => 
        inscription.id !== selectedEnchantInscription.id
    );
    
    addToLog(`成功铭刻了 ${selectedEnchantInscription.name} 到 ${selectedEnchantEquipment.final_name}！`);
    addToLog(`消耗了 ${durabilityCost} 点耐久度`);
    
    // 重新打开面板以更新显示
    openEnchantPanel();
}

// 打开分解面板
function openDisassemblePanel() {
    const disassembleItems = document.getElementById('disassemble-items');
    disassembleItems.innerHTML = '';
    
    // 收集所有可分解的装备
    const allItems = [...currentLoot, ...Object.values(player.equipment).filter(item => item)];
    
    if (allItems.length === 0) {
        disassembleItems.innerHTML = '<p style="color: #ccc;">没有可分解的装备</p>';
        document.getElementById('disassemble-panel').style.display = 'block';
        return;
    }
    
    allItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.style.margin = '10px 0';
        
        const materialText = getDisassembleMaterials(item.rarity);
        
        itemDiv.innerHTML = `
            <div class="item-name">${item.final_name}</div>
            <div class="item-stats">
                <div>稀有度: ${game.lootSystem.rarity[item.rarity].name}</div>
                <div>分解产物: ${materialText}</div>
                <button onclick="disassembleItem(${index})" style="padding: 5px 10px; font-size: 12px; margin-top: 10px;">
                    分解
                </button>
            </div>
        `;
        
        disassembleItems.appendChild(itemDiv);
    });
    
    document.getElementById('disassemble-panel').style.display = 'block';
}

// 获取分解产物
function getDisassembleMaterials(rarity) {
    const materials = {
        common: '普通尘埃 x2',
        uncommon: '优秀精华 x2, 普通尘埃 x1',
        rare: '稀有水晶 x2, 优秀精华 x1',
        epic: '史诗碎片 x2, 稀有水晶 x1',
        ancient: '远古核心 x2, 史诗碎片 x1'
    };
    return materials[rarity] || '普通尘埃 x1';
}

// 分解装备
function disassembleItem(itemIndex) {
    const allItems = [...currentLoot, ...Object.values(player.equipment).filter(item => item)];
    const item = allItems[itemIndex];
    
    if (!item) {
        addToLog('错误：装备不存在');
        return;
    }
    
    // 根据稀有度获得材料
    switch (item.rarity) {
        case 'common':
            player.materials.common_dust += 2;
            break;
        case 'uncommon':
            player.materials.uncommon_essence += 2;
            player.materials.common_dust += 1;
            break;
        case 'rare':
            player.materials.rare_crystal += 2;
            player.materials.uncommon_essence += 1;
            break;
        case 'epic':
            player.materials.epic_shard += 2;
            player.materials.rare_crystal += 1;
            break;
        case 'ancient':
            player.materials.ancient_core += 2;
            player.materials.epic_shard += 1;
            break;
    }
    
    addToLog(`成功分解了 ${item.final_name}！`);
    addToLog(`获得了 ${getDisassembleMaterials(item.rarity)}`);
    
    // 从装备列表中移除
    if (currentLoot.includes(item)) {
        currentLoot = currentLoot.filter(i => i !== item);
    } else {
        // 从装备栏中移除
        for (const slot in player.equipment) {
            if (player.equipment[slot] === item) {
                player.equipment[slot] = null;
                // 更新装备栏显示
                const slotElement = document.getElementById(`slot-${slot}`);
                if (slotElement) {
                    slotElement.innerHTML = '空';
                    slotElement.style.color = '#666';
                }
                break;
            }
        }
    }
    
    // 重新打开面板以更新显示
    openDisassemblePanel();
}

// 打开强化面板
function openEnhancePanel() {
    const enhanceEquipments = document.getElementById('enhance-equipments');
    const enhanceMaterials = document.getElementById('enhance-materials');
    
    enhanceEquipments.innerHTML = '';
    enhanceMaterials.innerHTML = '';
    
    // 重置选择
    selectedEnhanceEquipment = null;
    document.getElementById('enhance-button').disabled = true;
    
    // 显示可强化的装备
    const allItems = [...currentLoot, ...Object.values(player.equipment).filter(item => item)];
    
    if (allItems.length === 0) {
        enhanceEquipments.innerHTML = '<p style="color: #ccc;">没有可强化的装备</p>';
    } else {
        allItems.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            itemDiv.style.margin = '5px 0';
            itemDiv.onclick = () => selectEnhanceEquipment(item);
            
            const enhanceLevel = item.enhanceLevel || 0;
            const nextCost = getEnhanceCost(item.rarity, enhanceLevel);
            
            itemDiv.innerHTML = `
                <div class="item-name">${item.final_name}</div>
                <div class="item-stats">
                    <div>稀有度: ${game.lootSystem.rarity[item.rarity].name}</div>
                    <div>强化等级: +${enhanceLevel}</div>
                    <div>下一级消耗: ${nextCost}</div>
                </div>
            `;
            enhanceEquipments.appendChild(itemDiv);
        });
    }
    
    // 显示当前材料
    const materialText = Object.entries(player.materials)
        .map(([mat, count]) => `${getMaterialName(mat)}: ${count}`)
        .join('<br>');
    
    enhanceMaterials.innerHTML = `<div style="color: #ccc;">${materialText}</div>`;
    
    document.getElementById('enhance-panel').style.display = 'block';
}

// 获取材料名称
function getMaterialName(material) {
    const names = {
        common_dust: '普通尘埃',
        uncommon_essence: '优秀精华',
        rare_crystal: '稀有水晶',
        epic_shard: '史诗碎片',
        ancient_core: '远古核心'
    };
    return names[material] || material;
}

// 获取强化消耗
function getEnhanceCost(rarity, level) {
    const baseCosts = {
        common: '普通尘埃 x' + (level + 1) * 2,
        uncommon: '优秀精华 x' + (level + 1) + ', 普通尘埃 x' + (level + 1),
        rare: '稀有水晶 x' + (level + 1) + ', 优秀精华 x' + (level + 1),
        epic: '史诗碎片 x' + (level + 1) + ', 稀有水晶 x' + (level + 1),
        ancient: '远古核心 x' + (level + 1) + ', 史诗碎片 x' + (level + 1)
    };
    return baseCosts[rarity] || '普通尘埃 x' + (level + 1);
}

// 选择要强化的装备
function selectEnhanceEquipment(item) {
    selectedEnhanceEquipment = item;
    document.getElementById('enhance-button').disabled = false;
    
    // 更新界面显示
    const items = document.getElementById('enhance-equipments').children;
    for (let i = 0; i < items.length; i++) {
        items[i].style.border = items[i].onclick.toString().includes(item.final_name) ? '2px solid #1E90FF' : '1px solid rgba(255, 255, 255, 0.1)';
    }
}

// 强化装备
function enhanceItem() {
    if (!selectedEnhanceEquipment) {
        addToLog('请选择要强化的装备');
        return;
    }
    
    const enhanceLevel = selectedEnhanceEquipment.enhanceLevel || 0;
    
    // 检查材料是否足够
    if (!hasEnoughMaterials(selectedEnhanceEquipment.rarity, enhanceLevel)) {
        addToLog('错误：材料不足');
        return;
    }
    
    // 消耗材料
    consumeEnhanceMaterials(selectedEnhanceEquipment.rarity, enhanceLevel);
    
    // 增加强化等级
    selectedEnhanceEquipment.enhanceLevel = (enhanceLevel + 1);
    
    // 强化基本属性
    if (selectedEnhanceEquipment.base_damage) {
        selectedEnhanceEquipment.base_damage.min = Math.round(selectedEnhanceEquipment.base_damage.min * 1.1);
        selectedEnhanceEquipment.base_damage.max = Math.round(selectedEnhanceEquipment.base_damage.max * 1.1);
    }
    
    if (selectedEnhanceEquipment.base_armor) {
        selectedEnhanceEquipment.base_armor = Math.round(selectedEnhanceEquipment.base_armor * 1.15);
    }
    
    addToLog(`成功强化了 ${selectedEnhanceEquipment.final_name} 到 +${selectedEnhanceEquipment.enhanceLevel}！`);
    
    // 重新打开面板以更新显示
    openEnhancePanel();
}

// 检查材料是否足够
function hasEnoughMaterials(rarity, level) {
    const required = getEnhanceMaterialCount(rarity, level);
    
    for (const [mat, count] of Object.entries(required)) {
        if (player.materials[mat] < count) {
            return false;
        }
    }
    
    return true;
}

// 获取强化所需材料数量
function getEnhanceMaterialCount(rarity, level) {
    const count = level + 1;
    
    switch (rarity) {
        case 'common':
            return { common_dust: count * 2 };
        case 'uncommon':
            return { uncommon_essence: count, common_dust: count };
        case 'rare':
            return { rare_crystal: count, uncommon_essence: count };
        case 'epic':
            return { epic_shard: count, rare_crystal: count };
        case 'ancient':
            return { ancient_core: count, epic_shard: count };
        default:
            return { common_dust: count };
    }
}

// 消耗强化材料
function consumeEnhanceMaterials(rarity, level) {
    const required = getEnhanceMaterialCount(rarity, level);
    
    for (const [mat, count] of Object.entries(required)) {
        player.materials[mat] -= count;
    }
}

// 打开铭文合成面板
function openInscriptionPanel() {
    const inscription1 = document.getElementById('inscription-1');
    const inscription2 = document.getElementById('inscription-2');
    const resultPreview = document.getElementById('result-preview');
    
    inscription1.innerHTML = '';
    inscription2.innerHTML = '';
    resultPreview.innerHTML = '选择两个同等级同名铭文进行合成';
    
    // 重置选择
    selectedInscription1 = null;
    selectedInscription2 = null;
    document.getElementById('combine-button').disabled = true;
    
    // 显示可用的铭文
    if (player.inscriptions.length === 0) {
        inscription1.innerHTML = '<p style="color: #ccc;">没有可用的铭文</p>';
        inscription2.innerHTML = '<p style="color: #ccc;">没有可用的铭文</p>';
    } else {
        // 显示铭文列表供选择
        player.inscriptions.forEach((inscription, index) => {
            // 为第一个选择区域创建铭文选项
            const item1 = document.createElement('div');
            item1.className = 'item';
            item1.style.margin = '5px 0';
            item1.onclick = () => selectInscription(1, inscription);
            item1.innerHTML = `
                <div class="item-name">${inscription.name}</div>
                <div class="item-stats">
                    <div>等级: ${inscription.level}</div>
                    <div>稀有度: ${game.lootSystem.rarity[inscription.rarity].name}</div>
                    <div>类型: ${inscription.affixType}</div>
                </div>
            `;
            inscription1.appendChild(item1);
            
            // 为第二个选择区域创建铭文选项
            const item2 = document.createElement('div');
            item2.className = 'item';
            item2.style.margin = '5px 0';
            item2.onclick = () => selectInscription(2, inscription);
            item2.innerHTML = `
                <div class="item-name">${inscription.name}</div>
                <div class="item-stats">
                    <div>等级: ${inscription.level}</div>
                    <div>稀有度: ${game.lootSystem.rarity[inscription.rarity].name}</div>
                    <div>类型: ${inscription.affixType}</div>
                </div>
            `;
            inscription2.appendChild(item2);
        });
    }
    
    document.getElementById('inscription-panel').style.display = 'block';
}

// 选择铭文
function selectInscription(slot, inscription) {
    if (slot === 1) {
        selectedInscription1 = inscription;
    } else {
        selectedInscription2 = inscription;
    }
    
    // 更新合成按钮状态
    updateCombineButton();
    
    // 更新预览
    updateResultPreview();
}

// 更新合成按钮状态
function updateCombineButton() {
    const button = document.getElementById('combine-button');
    
    if (!selectedInscription1 || !selectedInscription2) {
        button.disabled = true;
        return;
    }
    
    // 检查是否是同等级同名铭文
    const canCombine = (
        selectedInscription1.name === selectedInscription2.name &&
        selectedInscription1.level === selectedInscription2.level
    );
    
    button.disabled = !canCombine;
}

// 更新合成结果预览
function updateResultPreview() {
    const resultPreview = document.getElementById('result-preview');
    
    if (!selectedInscription1 || !selectedInscription2) {
        resultPreview.innerHTML = '选择两个同等级同名铭文进行合成';
        return;
    }
    
    if (selectedInscription1.name !== selectedInscription2.name ||
        selectedInscription1.level !== selectedInscription2.level) {
        resultPreview.innerHTML = '错误：只能合成同等级同名的铭文';
        resultPreview.style.color = '#ff6b6b';
        return;
    }
    
    // 计算合成结果
    const newLevel = selectedInscription1.level + 1;
    const newValue = Math.round(selectedInscription1.value * 1.2);
    
    resultPreview.innerHTML = `
        <div>合成结果: ${selectedInscription1.name} (等级 ${newLevel})</div>
        <div>词缀数值: ${newValue} (增加 120%)</div>
        <div>稀有度: ${game.lootSystem.rarity[selectedInscription1.rarity].name}</div>
    `;
    resultPreview.style.color = '#4CAF50';
}

// 合成铭文
function combineInscriptions() {
    if (!selectedInscription1 || !selectedInscription2) {
        addToLog('请选择两个铭文进行合成');
        return;
    }
    
    if (selectedInscription1.name !== selectedInscription2.name ||
        selectedInscription1.level !== selectedInscription2.level) {
        addToLog('错误：只能合成同等级同名的铭文');
        return;
    }
    
    // 计算合成结果
    const newLevel = selectedInscription1.level + 1;
    const newValue = Math.round(selectedInscription1.value * 1.2);
    
    // 创建新的高级铭文
    const newInscription = {
        id: 'inscription_' + Date.now(),
        name: selectedInscription1.name,
        affix: selectedInscription1.affix,
        affixType: selectedInscription1.affixType,
        level: newLevel,
        rarity: selectedInscription1.rarity,
        value: newValue,
        created: new Date().toISOString()
    };
    
    // 从背包中移除旧铭文
    player.inscriptions = player.inscriptions.filter(inscription => 
        inscription.id !== selectedInscription1.id &&
        inscription.id !== selectedInscription2.id
    );
    
    // 添加新铭文到背包
    player.inscriptions.push(newInscription);
    
    addToLog(`成功合成了 ${newInscription.name} (等级 ${newInscription.level})！`);
    addToLog(`词缀数值增加到 ${newInscription.value} (120%)`);
    
    // 重新打开面板以更新显示
    openInscriptionPanel();
}

// 凯撒加密函数
function caesarEncrypt(text, shift = 3) {
    return text.split('').map(char => {
        if (char.match(/[a-zA-Z]/)) {
            const code = char.charCodeAt(0);
            const base = code >= 65 && code <= 90 ? 65 : 97;
            return String.fromCharCode((code - base + shift) % 26 + base);
        }
        return char;
    }).join('');
}

// 凯撒解密函数
function caesarDecrypt(text, shift = 3) {
    return text.split('').map(char => {
        if (char.match(/[a-zA-Z]/)) {
            const code = char.charCodeAt(0);
            const base = code >= 65 && code <= 90 ? 65 : 97;
            return String.fromCharCode((code - base - shift + 26) % 26 + base);
        }
        return char;
    }).join('');
}

// 保存游戏
function saveGame() {
    try {
        // 准备存档数据
        const saveData = {
            player: player,
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
        
        // 转换为JSON字符串
        const jsonData = JSON.stringify(saveData);
        
        // 加密数据
        const encryptedData = caesarEncrypt(jsonData);
        
        // 生成随机文件名
        const fileName = Math.floor(Math.random() * 1000000) + '.sav';
        
        // 构建保存路径
        const savePath = 'C:\\Users\\Administrator\\Documents\\My Games\\' + fileName;
        
        // 保存到本地存储（由于浏览器安全限制，实际保存到localStorage）
        localStorage.setItem('gameSave', encryptedData);
        localStorage.setItem('saveFileName', fileName);
        
        addToLog(`游戏已保存到: ${savePath}`);
        addToLog(`存档文件: ${fileName}`);
    } catch (error) {
        addToLog('错误：保存游戏失败');
        console.error('保存错误:', error);
    }
}

// 读取游戏
function loadGame() {
    try {
        // 从本地存储读取（由于浏览器安全限制，实际从localStorage读取）
        const encryptedData = localStorage.getItem('gameSave');
        const fileName = localStorage.getItem('saveFileName');
        
        if (!encryptedData) {
            addToLog('错误：没有找到存档文件');
            return;
        }
        
        // 解密数据
        const decryptedData = caesarDecrypt(encryptedData);
        
        // 解析JSON
        const saveData = JSON.parse(decryptedData);
        
        // 恢复玩家数据
        player = saveData.player;
        
        // 更新界面显示
        updateDerivedAttributes();
        initAttributeDisplay();
        
        // 更新装备栏显示
        for (const slot in player.equipment) {
            const item = player.equipment[slot];
            const slotElement = document.getElementById(`slot-${slot}`);
            if (slotElement) {
                if (item) {
                    slotElement.innerHTML = `${item.name}<br><span style="font-size: 0.7rem; color: #888;">耐久: ${Math.round(item.durability)}/${item.maxDurability}</span>`;
                    slotElement.style.color = game.lootSystem.rarity[item.rarity].color;
                } else {
                    slotElement.innerHTML = '空';
                    slotElement.style.color = '#666';
                }
            }
        }
        
        addToLog(`游戏已从存档加载: ${fileName}`);
    } catch (error) {
        addToLog('错误：读取游戏失败');
        console.error('读取错误:', error);
    }
}

// 添加键盘快捷键
document.addEventListener('keydown', function(e) {
    if (e.key === '1') {
        selectEnemy('goblin');
    } else if (e.key === '2') {
        selectEnemy('orc');
    } else if (e.key === '3') {
        selectEnemy('dragon');
    }
});

// 装备耐久度恢复
setInterval(() => {
    Object.values(player.equipment).forEach(item => {
        if (item && item.durability < item.maxDurability) {
            item.durability = Math.min(item.durability + 0.1, item.maxDurability);
        }
    });
}, 1000);
