// 游戏逻辑文件

// DOM元素引用对象 - 使用延迟初始化避免页面加载时元素不存在
const DOM = {
    get statusText() { return document.getElementById('status-text'); },
    get loadingIndicator() { return document.getElementById('loading-indicator'); },
    get logContent() { return document.getElementById('log-content'); },
    get saveGameBtn() { return document.getElementById('save-game-btn'); },
    get loadGameBtn() { return document.getElementById('load-game-btn'); },
    get exportSaveBtn() { return document.getElementById('export-save-btn'); },
    get importSaveBtn() { return document.getElementById('import-save-btn'); },
    get generateEnemyBtn() { return document.getElementById('generate-enemy-btn'); },
    get startEncounterBtn() { return document.getElementById('start-encounter-btn'); },
    get attackBtn() { return document.getElementById('attack-btn'); },
    get skillBtn() { return document.getElementById('skill-btn'); },
    get fleeBtn() { return document.getElementById('flee-btn'); },
    get openImprintBtn() { return document.getElementById('open-imprint-btn'); },
    get openEnchantBtn() { return document.getElementById('open-enchant-btn'); },
    get openDisassembleBtn() { return document.getElementById('open-disassemble-btn'); },
    get openEnhanceBtn() { return document.getElementById('open-enhance-btn'); },
    get openInscriptionBtn() { return document.getElementById('open-inscription-btn'); },
    get enchantButton() { return document.getElementById('enchant-button'); },
    get enhanceButton() { return document.getElementById('enhance-button'); },
    get combineButton() { return document.getElementById('combine-button'); },
    get combatArena() { return document.getElementById('combat-arena'); },
    get enemyName() { return document.getElementById('enemy-name'); },
    get enemyCombatantName() { return document.querySelector('.enemy-combatant-name'); },
    get enemyHealthFill() { return document.getElementById('enemy-health-fill'); },
    get enemyHealthText() { return document.getElementById('enemy-health-text'); },
    get playerHealth() { return document.getElementById('player-health'); },
    get playerMana() { return document.getElementById('player-mana'); },
    get lootList() { return document.getElementById('loot-list'); },
    get classSelection() { return document.getElementById('class-selection'); },
    get enemyGroup() { return document.getElementById('enemy-group'); },
    get enemyEncounter() { return document.getElementById('enemy-encounter'); },
    get attributes() {
        return {
            strength: document.getElementById('attr-strength'),
            agility: document.getElementById('attr-agility'),
            precision: document.getElementById('attr-precision'),
            vitality: document.getElementById('attr-vitality'),
            endurance: document.getElementById('attr-endurance')
        };
    },
    get availablePoints() { return document.getElementById('available-points'); },
    get equipmentSlots() {
        return {
            weapon: document.getElementById('slot-weapon'),
            head: document.getElementById('slot-head'),
            chest: document.getElementById('slot-chest'),
            hands: document.getElementById('slot-hands'),
            legs: document.getElementById('slot-legs'),
            feet: document.getElementById('slot-feet'),
            ring: document.getElementById('slot-ring'),
            neck: document.getElementById('slot-neck')
        };
    }
};

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
    experience: 0,
    maxExperience: 100,
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
    },
    // 新手引导进度
    guide_progress: {
        current_node: "node_1",
        completed_nodes: [],
        tutorial_completed: false,
        flags: {
            class_selected: false,
            movement_used: false,
            skill_used: false,
            first_enemy_defeated: false,
            item_equipped: false,
            attribute_point_used: false,
            skill_upgraded: false,
            map_explored: false,
            elite_enemy_defeated: false,
            equipment_enhanced: false,
            boss_defeated: false
        }
    }
};
let currentLoot = [];
let currentEnemyGroup = [];
let selectedEnchantEquipment = null;
let selectedEnchantInscription = null;
let selectedEnhanceEquipment = null;
let selectedInscription1 = null;
let selectedInscription2 = null;
// 新手引导配置
let newbieGuideConfig = null;

// 游戏加载完成回调
window.gameLoaded = function() {
    const loadingTime = (Date.now() - loadingStartTime) / 1000;
    
    if (DOM && DOM.statusText) {
        DOM.statusText.textContent = '就绪';
    }
    if (DOM && DOM.loadingIndicator) {
        DOM.loadingIndicator.style.display = 'none';
    }
    
    gameReady = true;
    
    // 初始化战斗动画系统
    combatAnimationSystem.init();
    
    addToLog(`游戏加载完成，准备好开始冒险了！ (耗时 ${loadingTime.toFixed(2)} 秒)`);
    addToLog(`成功加载了 ${game.enemies.length} 个敌人`);
    addToLog(`成功加载了 ${game.items.weapons.length} 种武器`);
    addToLog(`成功加载了 ${game.items.armors.length} 种防具`);
    
    // 加载游戏配置
    loadGameConfigs();
    
    // 初始化职业选择界面
    initClassSelection();
    
    // 显示初始新手引导
    showNewbieGuide();
};

// 游戏加载失败回调
window.gameLoadFailed = function(errorMessage) {
    if (DOM && DOM.statusText) {
        DOM.statusText.textContent = '加载失败';
    }
    if (DOM && DOM.loadingIndicator) {
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
    if (DOM && DOM.saveGameBtn) DOM.saveGameBtn.addEventListener('click', saveGame);
    if (DOM && DOM.loadGameBtn) DOM.loadGameBtn.addEventListener('click', loadGame);
    if (DOM && DOM.exportSaveBtn) DOM.exportSaveBtn.addEventListener('click', exportSave);
    if (DOM && DOM.importSaveBtn) DOM.importSaveBtn.addEventListener('change', importSave);
    
    // 生成敌人
    if (DOM && DOM.generateEnemyBtn) DOM.generateEnemyBtn.addEventListener('click', generateEnemyEncounter);
    if (DOM && DOM.startEncounterBtn) DOM.startEncounterBtn.addEventListener('click', startEncounter);
    
    // 战斗按钮
    if (DOM && DOM.attackBtn) DOM.attackBtn.addEventListener('click', attackEnemy);
    if (DOM && DOM.skillBtn) DOM.skillBtn.addEventListener('click', useSkill);
    if (DOM && DOM.fleeBtn) DOM.fleeBtn.addEventListener('click', fleeCombat);
    
    // 工艺系统按钮
    if (DOM && DOM.openImprintBtn) DOM.openImprintBtn.addEventListener('click', openImprintPanel);
    if (DOM && DOM.openEnchantBtn) DOM.openEnchantBtn.addEventListener('click', openEnchantPanel);
    if (DOM && DOM.openDisassembleBtn) DOM.openDisassembleBtn.addEventListener('click', openDisassemblePanel);
    if (DOM && DOM.openEnhanceBtn) DOM.openEnhanceBtn.addEventListener('click', openEnhancePanel);
    if (DOM && DOM.openInscriptionBtn) DOM.openInscriptionBtn.addEventListener('click', openInscriptionPanel);
    
    // 面板按钮
    if (DOM && DOM.enchantButton) DOM.enchantButton.addEventListener('click', enchantItem);
    if (DOM && DOM.enhanceButton) DOM.enhanceButton.addEventListener('click', enhanceItem);
    if (DOM && DOM.combineButton) DOM.combineButton.addEventListener('click', combineInscriptions);
    
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
        if (DOM && DOM.statusText) DOM.statusText.textContent = '初始化失败';
        if (DOM && DOM.loadingIndicator) DOM.loadingIndicator.style.display = 'none';
        addToLog('错误：游戏对象未初始化');
        return;
    }
    
    if (DOM && DOM.statusText) DOM.statusText.textContent = '加载中...';
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
        if (DOM && DOM.combatArena) {
            DOM.combatArena.style.display = 'block';
        }
        
        // 更新敌人名称
        if (DOM && DOM.enemyName) {
            DOM.enemyName.textContent = currentEnemy.name;
        }
        if (DOM && DOM.enemyCombatantName) {
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
        // 假设玩家当前武器的伤害类型，默认物理
        let playerDamageType = 'physical';
        if (player.equipment.weapon && player.equipment.weapon.damage_type) {
            playerDamageType = player.equipment.weapon.damage_type;
        }
        
        const attackResult = calculateDamage({
            attacker: player,
            defender: enemy,
            baseDamage: player.attack,
            damageType: playerDamageType,
            source: 'player_attack'
        });
        
        enemyHealth = Math.max(0, enemyHealth - attackResult.damage);
        
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
            damage: attackResult.damage,
            target: 'enemy',
            position: combatAnimationSystem.getCombatantPosition(document.querySelector('.enemy-combatant'))
        });
        await combatAnimationSystem.queueAnimation('hurt', {
            target: 'enemy'
        });
        
        // 显示攻击结果
        if (!attackResult.isHit) {
            addToLog(`你攻击 ${enemy.name} 未命中！`);
        } else if (attackResult.isDodged) {
            addToLog(`你攻击 ${enemy.name} 被闪避了！`);
        } else {
            const damageText = attackResult.isCrit ? `暴击！你对 ${enemy.name} 造成了 ${attackResult.damage} 点伤害！` : `你对 ${enemy.name} 造成了 ${attackResult.damage} 点伤害！`;
            addToLog(damageText);
            
            // 显示状态效果
            if (attackResult.statusEffects && attackResult.statusEffects.length > 0) {
                attackResult.statusEffects.forEach(effect => {
                    addToLog(`${enemy.name} 被${effect.name}了！${effect.description}`);
                });
            }
        }
        
        // 检查敌人是否死亡
        if (enemyHealth <= 0) {
            addToLog(`你成功击败了 ${enemy.name}！`);
            
            // 获得经验值
            gainExperience(enemy.experience);
            
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
            
            // 更新第一次敌人击败标记
            updateFirstEnemyDefeatedFlag();
            
            break;
        }
        
        // 敌人攻击
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 敌人攻击
        const enemyBaseDamage = Math.floor(Math.random() * (enemy.damage.max - enemy.damage.min + 1)) + enemy.damage.min;
        const enemyDamageType = enemy.damage.type || 'physical';
        
        const enemyAttackResult = calculateDamage({
            attacker: enemy,
            defender: player,
            baseDamage: enemyBaseDamage,
            damageType: enemyDamageType,
            source: 'enemy_attack'
        });
        
        player.health = Math.max(0, player.health - enemyAttackResult.damage);
        
        // 更新玩家生命值显示
        updatePlayerHealth();
        
        // 播放敌人攻击动画序列
        await combatAnimationSystem.queueAnimation('hurt', {
            target: 'player'
        });
        await combatAnimationSystem.queueAnimation('damage', {
            damage: enemyAttackResult.damage,
            target: 'player',
            position: combatAnimationSystem.getCombatantPosition(document.querySelector('.player-combatant'))
        });
        
        // 显示敌人攻击结果
        if (!enemyAttackResult.isHit) {
            addToLog(`${enemy.name} 攻击你未命中！`);
        } else if (enemyAttackResult.isDodged) {
            addToLog(`${enemy.name} 攻击你被闪避了！`);
        } else {
            const damageText = enemyAttackResult.isCrit ? `${enemy.name} 对你暴击了！造成了 ${enemyAttackResult.damage} 点伤害！` : `${enemy.name} 对你造成了 ${enemyAttackResult.damage} 点伤害！`;
            addToLog(damageText);
            
            // 显示状态效果
            if (enemyAttackResult.statusEffects && enemyAttackResult.statusEffects.length > 0) {
                enemyAttackResult.statusEffects.forEach(effect => {
                    addToLog(`你被${effect.name}了！${effect.description}`);
                });
            }
        }
        
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
    
    // 战斗结束后，恢复生命值和法力值
    player.health = player.maxHealth;
    player.mana = player.maxMana;
    
    // 更新显示
    updatePlayerHealth();
    updatePlayerMana();
    
    addToLog('战斗结束，你的生命值和法力值已完全恢复！');
}

// 计算伤害（包含完整的战斗机制）
function calculateDamage(attackParams) {
    const {
        attacker = player,
        defender = {},
        baseDamage,
        damageType = 'physical',
        source = 'attack'
    } = attackParams;
    
    // 1. 命中判定
    const hitRate = attacker.hitRate || 95;
    if (Math.random() * 100 > hitRate) {
        return { damage: 0, isHit: false, isCrit: false, message: '攻击未命中！' };
    }
    
    // 2. 闪避判定
    const dodgeRate = defender.dodgeRate || 0;
    if (Math.random() * 100 <= dodgeRate) {
        return { damage: 0, isHit: true, isDodged: true, isCrit: false, message: '攻击被闪避！' };
    }
    
    // 3. 暴击判定
    const critChance = attacker.critChance || 5;
    const isCrit = Math.random() * 100 <= critChance;
    const critDamage = attacker.critDamage || 150;
    const critMultiplier = isCrit ? (critDamage / 100) : 1;
    
    // 4. 获取目标抗性
    const defaultResistances = {
        physical: 0,
        fire: 0,
        ice: 0,
        lightning: 0,
        poison: 0,
        electric: 0,
        paralysis: 0
    };
    const targetResistances = defender.resistances || {};
    const resistances = { ...defaultResistances, ...targetResistances };
    const resistance = Math.min(resistances[damageType] || 0, 75); // 抗性上限75%
    
    // 5. 获取目标防御和穿透率
    let defense = defender.defense || 0;
    const penetrationRate = attacker.penetrationRate || 0;
    
    // 6. 应用穿透效果
    const effectiveDefense = defense * (1 - penetrationRate / 100);
    
    // 7. 防御减免：物理伤害全额减免，属性伤害减半减免
    const defenseReductionFactor = damageType === 'physical' ? 1 : 0.5;
    const defenseReduction = effectiveDefense * defenseReductionFactor;
    
    // 8. 计算抗性减免后的伤害
    let resistanceReducedDamage = baseDamage * (1 - resistance / 100);
    
    // 9. 应用暴击倍率
    let finalDamage = resistanceReducedDamage * critMultiplier;
    
    // 10. 应用防御减免
    finalDamage = Math.max(1, finalDamage - defenseReduction);
    
    // 11. 计算属性伤害的持续效果（如果有）
    const statusEffects = calculateStatusEffects(damageType, baseDamage, defender);
    
    return {
        damage: Math.floor(finalDamage),
        isHit: true,
        isDodged: false,
        isCrit: isCrit,
        critMultiplier: critMultiplier,
        resistance: resistance,
        penetration: penetrationRate,
        defenseReduction: defenseReduction,
        statusEffects: statusEffects,
        message: isCrit ? '暴击！' : '命中！'
    };
}

// 计算属性伤害的持续效果
function calculateStatusEffects(damageType, baseDamage, target) {
    const statusEffects = [];
    const chance = Math.random() * 100;
    
    switch (damageType) {
        case 'fire':
            // 火焰伤害：持续燃烧效果
            if (chance <= 30) { // 30%几率触发
                statusEffects.push({
                    type: 'burn',
                    name: '燃烧',
                    duration: 3,
                    tickDamage: Math.floor(baseDamage * 0.1),
                    description: '每回合受到火焰伤害'
                });
            }
            break;
        case 'ice':
            // 冰冻伤害：减速效果
            if (chance <= 25) { // 25%几率触发
                statusEffects.push({
                    type: 'freeze',
                    name: '冰冻',
                    duration: 2,
                    slowAmount: 30,
                    description: '攻击速度和移动速度降低'
                });
            }
            break;
        case 'poison':
            // 毒伤：持续中毒效果
            if (chance <= 40) { // 40%几率触发
                statusEffects.push({
                    type: 'poison',
                    name: '中毒',
                    duration: 4,
                    tickDamage: Math.floor(baseDamage * 0.15),
                    description: '每回合受到毒素伤害'
                });
            }
            break;
        case 'lightning':
            // 闪电伤害：感电效果
            if (chance <= 20) { // 20%几率触发
                statusEffects.push({
                    type: 'electrify',
                    name: '感电',
                    duration: 2,
                    damageMultiplier: 1.2,
                    description: '受到的伤害增加'
                });
            }
            break;
        case 'electric':
            // 感电伤害：感电效果强化
            if (chance <= 25) { // 25%几率触发
                statusEffects.push({
                    type: 'electrify',
                    name: '强感电',
                    duration: 3,
                    damageMultiplier: 1.3,
                    description: '受到的伤害显著增加'
                });
            }
            break;
        case 'paralysis':
            // 麻痹伤害：麻痹效果
            if (chance <= 15) { // 15%几率触发
                statusEffects.push({
                    type: 'paralysis',
                    name: '麻痹',
                    duration: 1,
                    stunChance: 50,
                    description: '有几率无法行动'
                });
            }
            break;
    }
    
    return statusEffects;
}

// 更新敌人生命值条
function updateEnemyHealthBar(percentage) {
    if (DOM && DOM.enemyHealthFill && DOM.enemyHealthText) {
        DOM.enemyHealthFill.style.width = percentage + '%';
        DOM.enemyHealthText.textContent = `敌人生命值: ${Math.round(percentage)}%`;
    }
}

// 更新玩家生命值显示
function updatePlayerHealth() {
    if (DOM && DOM.playerHealth) {
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
    const damageResult = calculateDamage({
        attacker: player,
        defender: currentEnemy,
        baseDamage: player.attack,
        damageType: 'physical'
    });
    const skillDamage = Math.floor(damageResult.damage * 1.5);
    
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
    
    // 更新技能使用标记
    updateSkillUsedFlag();
    
    // 直接更新敌人生命值，而不是重新开始完整战斗
    // 注意：这里需要修改battleWithEnemy函数，将敌人生命值作为参数传入，或者重构战斗逻辑
    // 暂时简单处理，直接调用battleWithEnemy继续战斗
    await battleWithEnemy(currentEnemy);
}

// 更新玩家魔法值显示
function updatePlayerMana() {
    if (DOM && DOM.playerMana) {
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
    if (DOM && DOM.combatArena) {
        DOM.combatArena.style.display = 'none';
    }
    currentEnemy = null;
}

// 测试伤害算法（旧版，已废弃）
function testDamageAlgorithm() {
    console.log('旧版测试函数已废弃，请使用 testNewCombatMechanics 函数');
    return {};
}

// 测试新的战斗机制
function testNewCombatMechanics() {
    console.log('=== 测试新的战斗机制 ===');
    
    // 测试用的攻击者
    const testAttacker = {
        hitRate: 95,
        critChance: 20,
        critDamage: 200,
        penetrationRate: 10
    };
    
    // 测试用的防御者
    const testDefender = {
        dodgeRate: 10,
        defense: 400,
        resistances: {
            physical: 50,
            fire: 30
        }
    };
    
    // 测试1：物理伤害基础测试
    console.log('\n1. 物理伤害基础测试:');
    const test1Result = calculateDamage({
        attacker: testAttacker,
        defender: testDefender,
        baseDamage: 1000,
        damageType: 'physical'
    });
    console.log('输入参数:', { baseDamage: 1000, damageType: 'physical' });
    console.log('结果:', test1Result);
    
    // 测试2：火焰伤害测试
    console.log('\n2. 火焰伤害测试:');
    const test2Result = calculateDamage({
        attacker: testAttacker,
        defender: testDefender,
        baseDamage: 500,
        damageType: 'fire'
    });
    console.log('输入参数:', { baseDamage: 500, damageType: 'fire' });
    console.log('结果:', test2Result);
    
    // 测试3：闪避测试（高闪避率）
    console.log('\n3. 闪避测试:');
    const dodgeTestDefender = {
        ...testDefender,
        dodgeRate: 90
    };
    const test3Result = calculateDamage({
        attacker: testAttacker,
        defender: dodgeTestDefender,
        baseDamage: 1000,
        damageType: 'physical'
    });
    console.log('输入参数:', { baseDamage: 1000, dodgeRate: 90 });
    console.log('结果:', test3Result);
    
    // 测试4：暴击测试（高暴击率）
    console.log('\n4. 暴击测试:');
    const critTestAttacker = {
        ...testAttacker,
        critChance: 90,
        critDamage: 300
    };
    const test4Result = calculateDamage({
        attacker: critTestAttacker,
        defender: testDefender,
        baseDamage: 500,
        damageType: 'physical'
    });
    console.log('输入参数:', { baseDamage: 500, critChance: 90, critDamage: 300 });
    console.log('结果:', test4Result);
    
    // 测试5：穿透测试
    console.log('\n5. 穿透测试:');
    const penetrationTestAttacker = {
        ...testAttacker,
        penetrationRate: 50
    };
    const test5Result = calculateDamage({
        attacker: penetrationTestAttacker,
        defender: testDefender,
        baseDamage: 1000,
        damageType: 'physical'
    });
    console.log('输入参数:', { baseDamage: 1000, penetrationRate: 50 });
    console.log('结果:', test5Result);
    
    console.log('\n=== 测试完成 ===');
    
    return {
        test1: test1Result,
        test2: test2Result,
        test3: test3Result,
        test4: test4Result,
        test5: test5Result
    };
}

// 显示掉落
function displayLoot(loot, enemy) {
    const lootList = DOM.lootList;
    if (!lootList) return;
    
    currentLoot = loot;
    
    // 清空现有内容，避免内存泄漏
    lootList.innerHTML = '';
    
    if (!loot || loot.length === 0) {
        lootList.innerHTML = `<p>${enemy.name} 没有掉落任何物品</p>`;
        addToLog(`${enemy.name} 没有掉落任何物品`);
        return;
    }
    
    lootList.innerHTML = `<p>${enemy.name} 掉落了以下物品:</p>`;
    
    loot.forEach((item, index) => {
        if (!item) return;
        
        const rarityClass = item.rarity === 'common' ? '' : item.rarity;
        const affixText = item.affixes && item.affixes.length > 0 
            ? item.affixes.map(a => a.affix && a.affix.name ? a.affix.name : '未知词缀').join('、') 
            : '无';
        
        const itemDiv = document.createElement('div');
        itemDiv.className = `item ${rarityClass}`;
        itemDiv.onclick = () => equipItem(index);
        
        // 安全获取稀有度名称
        const rarityName = game.lootSystem && game.lootSystem.rarity && game.lootSystem.rarity[item.rarity] 
            ? game.lootSystem.rarity[item.rarity].name 
            : item.rarity;
        
        itemDiv.innerHTML = `
            <div class="item-name">${item.final_name || item.name || '未知物品'}</div>
            <div class="item-stats">
                <div>稀有度: ${rarityName}</div>
                <div>词缀: ${affixText}</div>
                ${item.base_damage ? `<div>伤害: ${item.base_damage.min}-${item.base_damage.max}</div>` : ''}
                ${item.base_armor ? `<div>护甲: ${item.base_armor}</div>` : ''}
                <div>耐久度: ${Math.round(item.durability)}/${item.maxDurability}</div>
                <div>等级: ${item.level}</div>
            </div>
        `;
        
        lootList.appendChild(itemDiv);
        addToLog(`获得了 ${item.final_name || item.name || '未知物品'}！`);
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
    if (DOM && DOM.equipmentSlots && DOM.equipmentSlots[slot]) {
        const slotElement = DOM.equipmentSlots[slot];
        slotElement.innerHTML = `${item.name}<br><span class="item-level">耐久: ${Math.round(item.durability)}/${item.maxDurability}</span>`;
        slotElement.style.color = game.lootSystem.rarity[item.rarity].color;
    }
    
    // 更新物品装备标记
    updateItemEquippedFlag();
}

// 添加日志
function addToLog(message) {
    // 安全获取DOM元素
    const logContent = DOM.logContent;
    if (!logContent) {
        console.log(`游戏日志: ${message}`);
        return;
    }
    
    const logEntry = document.createElement('div');
    logEntry.textContent = `> ${message}`;
    logContent.appendChild(logEntry);
    
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
    if (DOM && DOM.attributes && DOM.attributes[attribute]) {
        DOM.attributes[attribute].textContent = player.attributes[attribute];
    }
    if (DOM && DOM.availablePoints) {
        DOM.availablePoints.textContent = player.availableAttributePoints;
    }
    
    // 更新衍生属性
    updateDerivedAttributes();
    
    addToLog(`增加了1点${getAttributeName(attribute)}属性`);
    
    // 更新属性点使用标记
    updateAttributePointUsedFlag();
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
    // 玩家属性基础值
    const strengthBaseDamage = (player.attributes.strength - 10) * 2;
    const enduranceBaseDefense = (player.attributes.endurance - 10) * 1;
    
    // 新的战斗属性基础值
    const agilityBaseDodge = (player.attributes.agility - 10) * 1.0; // 每点敏捷增加1.0%闪避
    const precisionBaseCrit = (player.attributes.precision - 10) * 0.5; // 每点精准增加0.5%暴击率
    const precisionBaseHit = (player.attributes.precision - 10) * 0.8; // 每点精准增加0.8%命中率
    
    // 初始化基础战斗属性
    let critChance = 5 + precisionBaseCrit; // 基础5%暴击率
    let critDamage = 150; // 基础150%暴击伤害
    let dodgeRate = 3 + agilityBaseDodge; // 基础3%闪避率
    let hitRate = 80 + precisionBaseHit; // 基础80%命中率
    let penetrationRate = 0; // 基础0%穿透率
    
    // 计算装备基础伤害和防御
    let totalEquipmentDamage = 0;
    let totalEquipmentDefense = 0;
    let totalDamageAffixBonus = 0;
    let totalDefenseAffixBonus = 0;
    
    // 遍历所有装备槽
    Object.values(player.equipment).forEach(item => {
        if (!item) return;
        
        // 计算装备基础伤害
        if (item.base_damage) {
            const weaponDamage = (item.base_damage.min + item.base_damage.max) / 2;
            totalEquipmentDamage += weaponDamage;
        }
        
        // 计算装备基础防御
        if (item.base_armor) {
            totalEquipmentDefense += item.base_armor;
        }
        
        // 计算词缀加成
        if (item.affixes) {
            item.affixes.forEach(affix => {
                const effects = affix.affix.effects;
                if (!effects) return;
                
                effects.forEach(effect => {
                    if (effect.stat === 'damage') {
                        if (effect.type === 'flat') {
                            totalDamageAffixBonus += effect.value;
                        } else if (effect.type === 'percentage') {
                            totalDamageAffixBonus += (strengthBaseDamage + totalEquipmentDamage) * (effect.value / 100);
                        }
                    } else if (effect.stat === 'defense') {
                        if (effect.type === 'flat') {
                            totalDefenseAffixBonus += effect.value;
                        } else if (effect.type === 'percentage') {
                            totalDefenseAffixBonus += (enduranceBaseDefense + totalEquipmentDefense) * (effect.value / 100);
                        }
                    } else if (effect.stat === 'critChance') {
                        critChance += effect.value;
                    } else if (effect.stat === 'critDamage') {
                        critDamage += effect.value;
                    } else if (effect.stat === 'dodgeRate') {
                        dodgeRate += effect.value;
                    } else if (effect.stat === 'hitRate') {
                        hitRate += effect.value;
                    } else if (effect.stat === 'penetrationRate') {
                        penetrationRate += effect.value;
                    }
                });
            });
        }
    });
    
    // 限制属性上限
    critChance = Math.min(critChance, 75); // 暴击率上限75%
    critDamage = Math.min(critDamage, 500); // 暴击伤害上限500%
    dodgeRate = Math.min(dodgeRate, 75); // 闪避率上限75%
    hitRate = Math.min(hitRate, 99); // 命中率上限99%
    penetrationRate = Math.min(penetrationRate, 75); // 穿透率上限75%
    
    // 计算最终伤害
    player.attack = Math.max(1, strengthBaseDamage + totalEquipmentDamage + totalDamageAffixBonus);
    
    // 计算最终防御（应用边际效益递减）
    const baseDefense = enduranceBaseDefense + totalEquipmentDefense + totalDefenseAffixBonus;
    // 防御边际效益递减：随着防御值增加，实际防御效果递减
    const diminishingDefense = baseDefense / (1 + baseDefense / 1000);
    player.defense = Math.max(1, diminishingDefense);
    
    // 计算生命值
    player.maxHealth = 100 + (player.attributes.vitality - 10) * 10;
    player.health = Math.min(player.health, player.maxHealth);
    
    // 初始化抗性系统
    if (!player.resistances) {
        player.resistances = {
            physical: 0,
            fire: 0,
            ice: 0,
            lightning: 0,
            poison: 0,
            electric: 0,
            paralysis: 0
        };
    }
    
    // 限制抗性上限
    Object.keys(player.resistances).forEach(resistanceType => {
        player.resistances[resistanceType] = Math.min(player.resistances[resistanceType], 75); // 抗性上限75%
    });
    
    // 更新战斗属性
    player.critChance = critChance;
    player.critDamage = critDamage;
    player.dodgeRate = dodgeRate;
    player.hitRate = hitRate;
    player.penetrationRate = penetrationRate;
    
    // 更新显示
    if (DOM && DOM.playerHealth) {
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
    
    if (DOM && DOM.classSelection) {
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
    
    // 初始化经验相关属性
    player.experience = 0;
    player.maxExperience = 100;
    
    // 隐藏职业选择界面
    if (DOM && DOM.classSelection) {
        DOM.classSelection.style.display = 'none';
    }
    
    // 初始化属性显示
    initAttributeDisplay();
    
    addToLog(`你选择了 ${cls.name} 职业！`);
    addToLog(`获得了 ${player.availableAttributePoints} 点初始属性点`);
    
    // 更新职业选择完成标记
    updateClassSelectedFlag();
}

// 获取经验
function gainExperience(amount) {
    player.experience += amount;
    addToLog(`获得了 ${amount} 点经验值！`);
    
    // 检查是否升级
    while (player.experience >= player.maxExperience) {
        levelUp();
    }
    
    // 更新经验显示
    updateExperienceDisplay();
}

// 升级处理
function levelUp() {
    player.level++;
    player.experience -= player.maxExperience;
    
    // 计算新的最大经验值（线性增长）
    player.maxExperience = Math.floor(player.maxExperience * 1.5);
    
    // 根据职业成长率增加属性
    Object.entries(player.growthRates).forEach(([attr, rate]) => {
        const growth = Math.floor(rate);
        player.attributes[attr] += growth;
    });
    
    // 增加自由属性点（每级5点）
    player.availableAttributePoints += 5;
    
    // 更新衍生属性
    updateDerivedAttributes();
    
    // 更新显示
    updatePlayerLevel();
    updateExperienceDisplay();
    initAttributeDisplay();
    
    addToLog(`恭喜！你升级到了 ${player.level} 级！`);
    addToLog(`获得了 5 点自由属性点！`);
    
    // 恢复满血满蓝
    player.health = player.maxHealth;
    player.mana = player.maxMana;
    updatePlayerHealth();
    updatePlayerMana();
}

// 更新玩家等级显示
function updatePlayerLevel() {
    const playerLevelElement = document.getElementById('player-level');
    if (playerLevelElement) {
        playerLevelElement.textContent = player.level;
    }
}

// 更新经验显示
function updateExperienceDisplay() {
    const experienceElement = document.getElementById('player-experience');
    if (experienceElement) {
        experienceElement.textContent = `${player.experience}/${player.maxExperience}`;
    }
}

// 初始化属性显示
function initAttributeDisplay() {
    Object.entries(player.attributes).forEach(([key, value]) => {
        if (DOM && DOM.attributes && DOM.attributes[key]) {
            DOM.attributes[key].textContent = value;
        }
    });
    if (DOM && DOM.availablePoints) {
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
    
    // 生成2-3个不同属性的敌人
    const enemyCount = Math.floor(Math.random() * 2) + 2; // 2-3个敌人
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
    // 过滤适合玩家等级的敌人（降低难度，敌人等级低于或等于玩家等级）
    const suitableEnemies = game.enemies.filter(enemy => 
        enemy.level <= playerLevel
    );
    
    if (suitableEnemies.length === 0) {
        // 如果没有适合的敌人，选择等级较低的敌人
        const lowLevelEnemies = game.enemies.filter(enemy => 
            enemy.level <= playerLevel + 1
        );
        if (lowLevelEnemies.length === 0) {
            return game.enemies[Math.floor(Math.random() * game.enemies.length)];
        }
        return JSON.parse(JSON.stringify(lowLevelEnemies[Math.floor(Math.random() * lowLevelEnemies.length)]));
    }
    
    // 随机选择一个敌人
    let enemy = JSON.parse(JSON.stringify(suitableEnemies[Math.floor(Math.random() * suitableEnemies.length)]));
    
    // 根据玩家属性调整敌人属性（降低难度，敌人属性较弱）
    adjustEnemyAttributes(enemy);
    
    return enemy;
}

// 调整敌人属性以匹配玩家
function adjustEnemyAttributes(enemy) {
    // 计算属性调整比例（降低难度，敌人属性最多比基础低15%）
    const adjustment = 0.05 + Math.random() * 0.1;
    const multiplier = 1 - adjustment; // 只降低敌人属性
    
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
    if (!DOM || !DOM.enemyGroup) return;
    
    DOM.enemyGroup.innerHTML = '';
    
    currentEnemyGroup.forEach((enemy, index) => {
        const enemyInfo = document.createElement('div');
        enemyInfo.className = 'enemy-info';
        enemyInfo.style.marginBottom = '20px';
        
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
            <button onclick="selectEnemyFromGroup(${index})" style="margin-top: 10px; padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                选择这个敌人
            </button>
        `;
        
        DOM.enemyGroup.appendChild(enemyInfo);
    });
    
    if (DOM && DOM.enemyEncounter) {
        DOM.enemyEncounter.style.display = 'block';
    }
}

// 从敌人组中选择一个敌人进行战斗
async function selectEnemyFromGroup(index) {
    if (!gameReady || !player.class) {
        addToLog('请先选择职业再选择敌人！');
        return;
    }
    
    if (currentEnemyGroup.length === 0 || !currentEnemyGroup[index]) {
        addToLog('错误：无效的敌人选择！');
        return;
    }
    
    // 获取选中的敌人
    const selectedEnemy = currentEnemyGroup[index];
    addToLog(`你选择了与 ${selectedEnemy.name} (等级 ${selectedEnemy.level}) 战斗！`);
    addToLog('战斗开始...');
    
    // 显示战斗竞技场
    if (DOM && DOM.combatArena) {
        DOM.combatArena.style.display = 'block';
    }
    
    // 更新敌人名称
    if (DOM && DOM.enemyName) {
        DOM.enemyName.textContent = selectedEnemy.name;
    }
    if (DOM && DOM.enemyCombatantName) {
        DOM.enemyCombatantName.textContent = selectedEnemy.name;
    }
    
    // 初始化敌人生命值
    updateEnemyHealthBar(100);
    
    // 播放入场动画
    await combatAnimationSystem.queueAnimation('entrance');
    
    // 与选中的敌人战斗
    await battleWithEnemy(selectedEnemy);
    
    // 战斗结束后，不继续与其他敌人战斗
    // 隐藏敌人遭遇界面
    if (DOM && DOM.enemyEncounter) {
        DOM.enemyEncounter.style.display = 'none';
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

// 游戏配置对象
let levelsConfig = null;

// 加载游戏配置
function loadGameConfigs() {
    // 加载新手引导配置
    loadNewbieGuideConfig();
    
    // 加载关卡配置
    loadLevelsConfig();
}

// 加载新手引导配置
function loadNewbieGuideConfig() {
    // 这里应该是从服务器加载配置，现在使用本地配置
    // 实际项目中应该通过fetch或XMLHttpRequest加载
    // 这里使用模拟数据
    newbieGuideConfig = {
        "guide_enabled": true,
        "progress_nodes": [
            {
                "id": "node_1",
                "name": "角色创建",
                "description": "选择你的职业，开始冒险",
                "completion_condition": "class_selected",
                "rewards": ["新手装备", "100金币", "50经验"],
                "next_node": "node_2"
            },
            {
                "id": "node_2",
                "name": "基础操作",
                "description": "学习如何移动和使用技能",
                "completion_condition": "movement_used && skill_used",
                "rewards": ["技能书", "50金币", "25经验"],
                "next_node": "node_3"
            },
            {
                "id": "node_3",
                "name": "第一次战斗",
                "description": "与第一个敌人战斗并获胜",
                "completion_condition": "first_enemy_defeated",
                "rewards": ["武器", "100金币", "100经验"],
                "next_node": "node_4"
            },
            {
                "id": "node_4",
                "name": "装备管理",
                "description": "学习如何装备物品和管理背包",
                "completion_condition": "item_equipped",
                "rewards": ["护甲", "50金币", "50经验"],
                "next_node": "node_5"
            },
            {
                "id": "node_5",
                "name": "属性加点",
                "description": "学习如何分配属性点",
                "completion_condition": "attribute_point_used",
                "rewards": ["属性药水", "50金币", "50经验"],
                "next_node": "node_6"
            },
            {
                "id": "node_6",
                "name": "技能升级",
                "description": "学习如何升级技能",
                "completion_condition": "skill_upgraded",
                "rewards": ["技能点", "100金币", "100经验"],
                "next_node": "node_7"
            },
            {
                "id": "node_7",
                "name": "探索地图",
                "description": "探索游戏世界，发现新区域",
                "completion_condition": "map_explored",
                "rewards": ["地图", "150金币", "150经验"],
                "next_node": "node_8"
            },
            {
                "id": "node_8",
                "name": "精英挑战",
                "description": "挑战第一个精英敌人",
                "completion_condition": "elite_enemy_defeated",
                "rewards": ["稀有装备", "200金币", "200经验"],
                "next_node": "node_9"
            },
            {
                "id": "node_9",
                "name": "装备强化",
                "description": "学习如何强化装备",
                "completion_condition": "equipment_enhanced",
                "rewards": ["强化石", "100金币", "100经验"],
                "next_node": "node_10"
            },
            {
                "id": "node_10",
                "name": "最终挑战",
                "description": "挑战第一个Boss",
                "completion_condition": "boss_defeated",
                "rewards": ["史诗装备", "500金币", "500经验"],
                "next_node": "null"
            }
        ],
        "tutorial_steps": [
            {
                "id": "tutorial_1",
                "node_id": "node_1",
                "title": "欢迎来到RPG世界",
                "content": "选择一个职业开始你的冒险。每个职业都有独特的优势和玩法。",
                "target_element": "class_selection",
                "highlight": true,
                "auto_advance": false
            },
            {
                "id": "tutorial_2",
                "node_id": "node_2",
                "title": "移动和探索",
                "content": "使用WASD或方向键移动角色，使用E键与物品交互。",
                "target_element": "game_map",
                "highlight": false,
                "auto_advance": false
            },
            {
                "id": "tutorial_3",
                "node_id": "node_2",
                "title": "使用技能",
                "content": "点击技能按钮或使用快捷键释放技能。技能需要消耗魔法值或体力。",
                "target_element": "skill_buttons",
                "highlight": true,
                "auto_advance": false
            },
            {
                "id": "tutorial_4",
                "node_id": "node_3",
                "title": "战斗技巧",
                "content": "攻击敌人时，注意你的生命值和敌人的状态。合理使用技能可以获得战斗优势。",
                "target_element": "combat_arena",
                "highlight": false,
                "auto_advance": false
            },
            {
                "id": "tutorial_5",
                "node_id": "node_4",
                "title": "装备管理",
                "content": "点击背包中的物品可以装备或使用它们。装备可以提升你的属性和战斗力。",
                "target_element": "inventory_panel",
                "highlight": true,
                "auto_advance": false
            },
            {
                "id": "tutorial_6",
                "node_id": "node_5",
                "title": "属性加点",
                "content": "升级后获得属性点，合理分配属性点可以提升你的战斗能力。",
                "target_element": "attribute_panel",
                "highlight": true,
                "auto_advance": false
            },
            {
                "id": "tutorial_7",
                "node_id": "node_6",
                "title": "技能升级",
                "content": "使用技能点升级你的技能，提升技能的伤害和效果。",
                "target_element": "skill_tree",
                "highlight": true,
                "auto_advance": false
            }
        ],
        "victory_conditions": {
            "battle": "enemy_health <= 0",
            "quest": "objectives_completed",
            "boss_fight": "boss_health <= 0 && time_remaining > 0"
        },
        "defeat_conditions": {
            "battle": "player_health <= 0",
            "quest": "time_remaining <= 0",
            "boss_fight": "player_health <= 0 || time_remaining <= 0"
        }
    };
    
    addToLog('新手引导配置加载完成');
}

// 加载关卡配置
function loadLevelsConfig() {
    // 实际项目中应该通过fetch或XMLHttpRequest加载
    // 这里使用本地配置文件
    try {
        // 假设我们已经有了levels.json文件，这里使用模拟数据
        levelsConfig = {
            "levels": [
                {
                    "id": "level_1",
                    "name": "新手村",
                    "description": "宁静的新手村，适合初学者练习基本技能",
                    "required_level": 1,
                    "enemies": [
                        {
                            "id": "goblin_1",
                            "count": 5,
                            "difficulty": "easy",
                            "position": "village_entrance"
                        },
                        {
                            "id": "rat_1",
                            "count": 3,
                            "difficulty": "easy",
                            "position": "village_backyard"
                        }
                    ],
                    "boss": null,
                    "objectives": [
                        {
                            "type": "kill_enemies",
                            "target": 5,
                            "description": "击败5个敌人"
                        },
                        {
                            "type": "explore_area",
                            "target": "village_center",
                            "description": "到达新手村中心"
                        }
                    ],
                    "victory_conditions": "kill_enemies && explore_area",
                    "defeat_conditions": "player_death",
                    "rewards": {
                        "experience": 200,
                        "gold": 150,
                        "items": ["新手武器", "新手护甲"]
                    }
                },
                {
                    "id": "level_2",
                    "name": "幽暗森林",
                    "description": "神秘的森林，隐藏着各种危险",
                    "required_level": 3,
                    "enemies": [
                        {
                            "id": "wolf_1",
                            "count": 4,
                            "difficulty": "normal",
                            "position": "forest_edge"
                        },
                        {
                            "id": "goblin_2",
                            "count": 3,
                            "difficulty": "normal",
                            "position": "forest_path"
                        }
                    ],
                    "boss": {
                        "id": "forest_goblin_chief",
                        "difficulty": "elite",
                        "position": "forest_clearing"
                    },
                    "objectives": [
                        {
                            "type": "kill_enemies",
                            "target": 7,
                            "description": "击败7个敌人"
                        },
                        {
                            "type": "defeat_boss",
                            "target": "forest_goblin_chief",
                            "description": "击败森林哥布林酋长"
                        }
                    ],
                    "victory_conditions": "kill_enemies && defeat_boss",
                    "defeat_conditions": "player_death || time_limit",
                    "time_limit": 300,
                    "rewards": {
                        "experience": 500,
                        "gold": 300,
                        "items": ["森林之刃", "自然护甲", "治疗药水 x 3"]
                    }
                },
                {
                    "id": "level_3",
                    "name": "废弃矿洞",
                    "description": "危险的矿洞，充满了邪恶的生物",
                    "required_level": 5,
                    "enemies": [
                        {
                            "id": "skeleton_1",
                            "count": 6,
                            "difficulty": "normal",
                            "position": "mine_entrance"
                        },
                        {
                            "id": "spider_1",
                            "count": 4,
                            "difficulty": "normal",
                            "position": "mine_tunnels"
                        },
                        {
                            "id": "goblin_miner",
                            "count": 3,
                            "difficulty": "hard",
                            "position": "mine_depths"
                        }
                    ],
                    "boss": {
                        "id": "mine_golem",
                        "difficulty": "boss",
                        "position": "mine_core"
                    },
                    "objectives": [
                        {
                            "type": "kill_enemies",
                            "target": 10,
                            "description": "击败10个敌人"
                        },
                        {
                            "type": "collect_item",
                            "target": "mine_core_crystal",
                            "description": "收集矿洞核心水晶"
                        },
                        {
                            "type": "defeat_boss",
                            "target": "mine_golem",
                            "description": "击败矿洞魔像"
                        }
                    ],
                    "victory_conditions": "kill_enemies && collect_item && defeat_boss",
                    "defeat_conditions": "player_death || time_limit",
                    "time_limit": 420,
                    "rewards": {
                        "experience": 1000,
                        "gold": 600,
                        "items": ["矿洞之锤", "石肤护甲", "力量药水 x 2", "魔法药水 x 2"]
                    }
                }
            ],
            "global_settings": {
                "max_level": 10,
                "difficulty_scaling": {
                    "easy": 0.8,
                    "normal": 1.0,
                    "hard": 1.2,
                    "elite": 1.5,
                    "boss": 2.0
                },
                "victory_conditions": {
                    "kill_enemies": "player has killed the required number of enemies",
                    "explore_area": "player has reached the target area",
                    "defeat_boss": "player has defeated the boss",
                    "collect_item": "player has collected the target item"
                },
                "defeat_conditions": {
                    "player_death": "player's health reaches 0",
                    "time_limit": "time runs out"
                }
            }
        };
        
        addToLog('关卡配置加载完成');
    } catch (error) {
        addToLog('错误：加载关卡配置失败 - ' + error.message);
        console.error('加载关卡配置失败:', error);
    }
}

// 获取当前可挑战的关卡
function getAvailableLevels() {
    if (!levelsConfig || !levelsConfig.levels) {
        return [];
    }
    
    return levelsConfig.levels.filter(level => level.required_level <= player.level);
}

// 获取当前关卡
function getCurrentLevel() {
    if (!levelsConfig || !levelsConfig.levels) {
        return null;
    }
    
    // 查找玩家当前等级可以挑战的最高级关卡
    const availableLevels = getAvailableLevels();
    if (availableLevels.length === 0) {
        return null;
    }
    
    // 按照等级要求排序，返回最高级的
    return availableLevels.sort((a, b) => b.required_level - a.required_level)[0];
}

// 检查关卡胜利条件
function checkLevelVictory(levelId) {
    if (!levelsConfig || !levelsConfig.levels) {
        return false;
    }
    
    const level = levelsConfig.levels.find(l => l.id === levelId);
    if (!level) {
        return false;
    }
    
    // 这里需要根据实际的游戏状态来检查胜利条件
    // 目前是模拟实现，实际项目中需要根据玩家的实际进度来判断
    const victoryConditions = level.victory_conditions.split(' && ');
    
    // 简单实现：检查所有条件是否都已完成
    // 实际项目中需要根据玩家的实际进度来判断
    return victoryConditions.every(condition => {
        // 这里可以根据不同的条件类型进行不同的检查
        switch (condition) {
            case 'kill_enemies':
                // 检查是否击败了足够的敌人
                return player.level > 0; // 简单模拟
            case 'explore_area':
                // 检查是否探索了目标区域
                return player.level > 0; // 简单模拟
            case 'defeat_boss':
                // 检查是否击败了Boss
                return player.level > 1; // 简单模拟
            case 'collect_item':
                // 检查是否收集了目标物品
                return player.level > 2; // 简单模拟
            default:
                return false;
        }
    });
}

// 检查关卡失败条件
function checkLevelDefeat(levelId) {
    if (!levelsConfig || !levelsConfig.levels) {
        return false;
    }
    
    const level = levelsConfig.levels.find(l => l.id === levelId);
    if (!level) {
        return false;
    }
    
    // 这里需要根据实际的游戏状态来检查失败条件
    const defeatConditions = level.defeat_conditions.split(' || ');
    
    // 简单实现：检查是否满足任何失败条件
    return defeatConditions.some(condition => {
        switch (condition) {
            case 'player_death':
                // 检查玩家是否死亡
                return player.health <= 0;
            case 'time_limit':
                // 检查时间是否耗尽
                // 实际项目中需要跟踪关卡计时器
                return false; // 简单模拟
            default:
                return false;
        }
    });
}

// 完成关卡
function completeLevel(levelId) {
    if (!levelsConfig || !levelsConfig.levels) {
        return;
    }
    
    const level = levelsConfig.levels.find(l => l.id === levelId);
    if (!level) {
        return;
    }
    
    addToLog(`恭喜完成关卡：${level.name}！`);
    
    // 发放奖励
    if (level.rewards) {
        if (level.rewards.experience) {
            gainExperience(level.rewards.experience);
        }
        
        if (level.rewards.gold) {
            addToLog(`获得了 ${level.rewards.gold} 金币！`);
            // 实际项目中需要添加金币到玩家背包
        }
        
        if (level.rewards.items) {
            level.rewards.items.forEach(item => {
                addToLog(`获得了 ${item}！`);
                // 实际项目中需要添加物品到玩家背包
            });
        }
    }
    
    // 更新玩家的关卡进度
    if (!player.level_progress) {
        player.level_progress = {
            completed_levels: [],
            current_level: null
        };
    }
    
    if (!player.level_progress.completed_levels.includes(levelId)) {
        player.level_progress.completed_levels.push(levelId);
    }
    
    // 更新当前关卡为下一个可挑战的关卡
    const nextLevel = levelsConfig.levels.find(l => l.required_level > level.required_level);
    if (nextLevel) {
        player.level_progress.current_level = nextLevel.id;
        addToLog(`解锁新关卡：${nextLevel.name}！`);
    }
}

// 显示新手引导
function showNewbieGuide() {
    if (!newbieGuideConfig || !newbieGuideConfig.guide_enabled || player.guide_progress.tutorial_completed) {
        return;
    }
    
    // 找到当前节点的引导内容
    const currentNode = newbieGuideConfig.progress_nodes.find(node => node.id === player.guide_progress.current_node);
    if (!currentNode) {
        return;
    }
    
    // 找到对应的教程步骤
    const tutorialStep = newbieGuideConfig.tutorial_steps.find(step => step.node_id === currentNode.id);
    if (!tutorialStep) {
        return;
    }
    
    // 显示引导信息
    showGuideMessage(tutorialStep.title, tutorialStep.content, tutorialStep.highlight, tutorialStep.target_element);
}

// 显示引导消息
function showGuideMessage(title, content, highlight, targetElement) {
    // 创建引导消息元素
    let guideElement = document.getElementById('newbie-guide');
    if (!guideElement) {
        guideElement = document.createElement('div');
        guideElement.id = 'newbie-guide';
        guideElement.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            max-width: 80%;
            z-index: 1000;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        `;
        document.body.appendChild(guideElement);
    }
    
    // 设置内容
    guideElement.innerHTML = `
        <h3 style="margin-top: 0; margin-bottom: 10px; color: #ffd700;">${title}</h3>
        <p style="margin: 0 0 15px 0;">${content}</p>
        <button id="guide-next" style="
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        ">下一步</button>
    `;
    
    // 添加下一步按钮事件
    const nextButton = document.getElementById('guide-next');
    nextButton.addEventListener('click', () => {
        guideElement.style.display = 'none';
        // 这里可以添加更多逻辑，比如自动引导到下一个步骤
    });
    
    // 高亮目标元素
    if (highlight && targetElement) {
        const target = document.getElementById(targetElement) || document.querySelector('.' + targetElement);
        if (target) {
            target.style.outline = '2px solid #ffd700';
            target.style.boxShadow = '0 0 10px #ffd700';
            // 一段时间后移除高亮
            setTimeout(() => {
                target.style.outline = '';
                target.style.boxShadow = '';
            }, 3000);
        }
    }
}

// 更新新手引导进度
function updateGuideProgress(flag) {
    if (!newbieGuideConfig || !newbieGuideConfig.guide_enabled || player.guide_progress.tutorial_completed) {
        return;
    }
    
    // 更新标记
    player.guide_progress.flags[flag] = true;
    
    // 检查当前节点是否完成
    const currentNode = newbieGuideConfig.progress_nodes.find(node => node.id === player.guide_progress.current_node);
    if (!currentNode) {
        return;
    }
    
    // 检查完成条件
    const completionCondition = currentNode.completion_condition;
    const isCompleted = evaluateCompletionCondition(completionCondition);
    
    if (isCompleted) {
        // 标记节点为完成
        if (!player.guide_progress.completed_nodes.includes(currentNode.id)) {
            player.guide_progress.completed_nodes.push(currentNode.id);
        }
        
        // 发放奖励
        addGuideRewards(currentNode.rewards);
        
        // 显示完成消息
        addToLog(`恭喜完成新手引导：${currentNode.name}`);
        
        // 检查是否是最后一个节点
        if (currentNode.next_node === "null") {
            player.guide_progress.tutorial_completed = true;
            addToLog('恭喜完成所有新手引导！');
            // 移除引导元素
            const guideElement = document.getElementById('newbie-guide');
            if (guideElement) {
                guideElement.remove();
            }
            return;
        }
        
        // 移动到下一个节点
        player.guide_progress.current_node = currentNode.next_node;
        
        // 显示下一个引导
        showNewbieGuide();
    }
}

// 评估完成条件
function evaluateCompletionCondition(condition) {
    // 简单的条件评估，支持 && 运算符
    const conditions = condition.split(' && ');
    return conditions.every(cond => player.guide_progress.flags[cond] === true);
}

// 添加引导奖励
function addGuideRewards(rewards) {
    rewards.forEach(reward => {
        addToLog(`获得奖励：${reward}`);
        // 这里可以添加实际的奖励逻辑，比如增加金币、经验、物品等
        switch (reward) {
            case '100金币':
                // 增加金币
                break;
            case '50经验':
                gainExperience(50);
                break;
            case '新手装备':
                // 给予新手装备
                break;
            // 其他奖励类型...
        }
    });
}

// 更新职业选择完成标记
function updateClassSelectedFlag() {
    player.guide_progress.flags.class_selected = true;
    updateGuideProgress('class_selected');
}

// 更新移动使用标记
function updateMovementUsedFlag() {
    player.guide_progress.flags.movement_used = true;
    updateGuideProgress('movement_used');
}

// 更新技能使用标记
function updateSkillUsedFlag() {
    player.guide_progress.flags.skill_used = true;
    updateGuideProgress('skill_used');
}

// 更新第一次敌人击败标记
function updateFirstEnemyDefeatedFlag() {
    player.guide_progress.flags.first_enemy_defeated = true;
    updateGuideProgress('first_enemy_defeated');
}

// 更新物品装备标记
function updateItemEquippedFlag() {
    player.guide_progress.flags.item_equipped = true;
    updateGuideProgress('item_equipped');
}

// 更新属性点使用标记
function updateAttributePointUsedFlag() {
    player.guide_progress.flags.attribute_point_used = true;
    updateGuideProgress('attribute_point_used');
}

// 更新技能升级标记
function updateSkillUpgradedFlag() {
    player.guide_progress.flags.skill_upgraded = true;
    updateGuideProgress('skill_upgraded');
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
        updatePlayerLevel();
        updateExperienceDisplay();
        updatePlayerHealth();
        updatePlayerMana();
        
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

// 导出存档为文件
function exportSave() {
    try {
        // 从localStorage获取存档数据
        const encryptedData = localStorage.getItem('gameSave');
        const saveFileName = localStorage.getItem('saveFileName');
        
        if (!encryptedData) {
            addToLog('错误：没有找到存档数据！');
            return;
        }
        
        // 创建存档对象
        const saveData = {
            data: encryptedData,
            fileName: saveFileName,
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
        
        // 转换为JSON字符串
        const jsonData = JSON.stringify(saveData);
        
        // 创建Blob对象
        const blob = new Blob([jsonData], { type: 'application/json' });
        
        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = saveFileName || `rpg_save_${Date.now()}.sav`;
        document.body.appendChild(a);
        
        // 触发下载
        a.click();
        
        // 清理
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        addToLog(`存档已导出为文件: ${a.download}`);
    } catch (error) {
        addToLog('错误：导出存档失败');
        console.error('导出错误:', error);
    }
}

// 导入存档文件
function importSave(event) {
    try {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        
        // 检查文件类型
        if (!file.name.endsWith('.sav')) {
            addToLog('错误：请选择 .sav 格式的存档文件！');
            return;
        }
        
        // 读取文件内容
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                // 解析文件内容
                const jsonData = e.target.result;
                const saveData = JSON.parse(jsonData);
                
                // 验证数据格式
                if (!saveData.data || !saveData.fileName) {
                    addToLog('错误：无效的存档文件格式！');
                    return;
                }
                
                // 保存到localStorage
                localStorage.setItem('gameSave', saveData.data);
                localStorage.setItem('saveFileName', saveData.fileName);
                
                // 加载游戏状态
                loadGame();
                
                addToLog(`存档已从文件导入: ${saveData.fileName}`);
            } catch (error) {
                addToLog('错误：解析存档文件失败');
                console.error('解析错误:', error);
            }
        };
        
        reader.onerror = function() {
            addToLog('错误：读取存档文件失败');
        };
        
        reader.readAsText(file);
    } catch (error) {
        addToLog('错误：导入存档失败');
        console.error('导入错误:', error);
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
