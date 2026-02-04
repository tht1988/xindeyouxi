// RPG游戏UI交互脚本

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化增强功能，确保与现有代码兼容
    try {
        // 首先初始化职业选择界面
        initClassSelection();
        
        // 初始化其他UI系统（这些将在职业选择后显示）
        initTabSystem();
        initMenuSystem();
        initItemDetails();
        initPlayerMovement();
        initMapInteractions();
        initSkillSystem();
        
        // 增强现有战斗系统
        enhanceCombatSystem();
        
        // 添加动画效果到现有UI元素
        addAnimationsToExistingUI();
        
        console.log('RPG UI增强功能初始化完成');
    } catch (error) {
        console.error('RPG UI增强功能初始化过程中出现错误:', error);
    }
});

// 初始化职业选择界面
function initClassSelection() {
    console.log('初始化职业选择界面...');
    
    // 等待游戏数据加载完成
    if (typeof window.game === 'undefined' || !window.game.characters || !window.game.characters.classes) {
        // 如果game对象尚未加载，尝试从classes.js获取职业数据
        setTimeout(() => {
            initClassSelectionFromClassesJS();
        }, 500);
        return;
    }
    
    // 从game对象获取职业数据
    const classes = window.game.characters.classes;
    renderClassSelection(classes);
}

// 从classes.js直接获取职业数据
function initClassSelectionFromClassesJS() {
    console.log('从classes.js获取职业数据...');
    
    let classes = [];
    
    // 检查classes.js是否已加载
    if (typeof window.game !== 'undefined' && window.game.classData) {
        classes = Object.values(window.game.classData);
    } else if (typeof window.game !== 'undefined' && window.game.characters && window.game.characters.classes) {
        classes = window.game.characters.classes;
    } else if (typeof Classes !== 'undefined') {
        // 直接从classes.js获取
        classes = Object.values(Classes);
    } else {
        // 手动创建职业数据作为后备
        classes = [
            {
                id: 'warrior',
                name: '战士',
                description: '攻高血厚，均衡的近战职业',
                specialization: 'melee_combat',
                base_attributes: {
                    strength: 19,
                    agility: 11,
                    precision: 11,
                    vitality: 16,
                    endurance: 15
                },
                starting_skills: ['bash', 'defend']
            },
            {
                id: 'assassin',
                name: '刺客',
                description: '高攻高暴击，高闪避，灵活的近战职业',
                specialization: 'stealth_combat',
                base_attributes: {
                    strength: 13,
                    agility: 21,
                    precision: 17,
                    vitality: 12,
                    endurance: 11
                },
                starting_skills: ['backstab', 'stealth']
            },
            {
                id: 'knight',
                name: '骑士',
                description: '高血高防，移速越快攻击越高',
                specialization: 'holy_combat',
                base_attributes: {
                    strength: 17,
                    agility: 13,
                    precision: 12,
                    vitality: 17,
                    endurance: 19
                },
                starting_skills: ['shield_bash', 'holy_aura']
            }
        ];
    }
    
    renderClassSelection(classes);
}

// 渲染职业选择界面
function renderClassSelection(classes) {
    const classesGrid = document.getElementById('classes-grid');
    if (!classesGrid) {
        console.error('无法初始化职业选择界面：缺少classes-grid元素');
        return;
    }
    
    console.log('渲染职业选择界面，职业数量：', classes.length);
    
    // 清空现有内容
    classesGrid.innerHTML = '';
    
    // 生成职业卡片
    classes.forEach(classData => {
        const classCard = document.createElement('div');
        classCard.className = 'class-card';
        classCard.dataset.classId = classData.id;
        
        // 构建职业卡片HTML
        classCard.innerHTML = `
            <div class="class-header">
                <h3 class="class-name">${classData.name}</h3>
                <span class="class-specialization">${getSpecializationName(classData.specialization)}</span>
            </div>
            <p class="class-description">${classData.description}</p>
            
            <div class="class-attributes">
                <h4>基础属性</h4>
                <div class="attribute-grid">
                    ${renderAttributes(classData.base_attributes)}
                </div>
            </div>
            
            <div class="class-skills">
                <h4>初始技能</h4>
                <ul class="skill-list">
                    ${renderSkills(classData.starting_skills || classData.traits || [])}
                </ul>
            </div>
            
            <button class="select-btn" onclick="selectClass('${classData.id}')">选择 ${classData.name}</button>
        `;
        
        // 添加悬停效果
        classCard.addEventListener('click', function() {
            // 移除其他卡片的选中状态
            document.querySelectorAll('.class-card').forEach(card => {
                card.classList.remove('selected');
            });
            // 添加当前卡片的选中状态
            this.classList.add('selected');
        });
        
        classesGrid.appendChild(classCard);
    });
}

// 获取专精名称
function getSpecializationName(specialization) {
    const specializationMap = {
        'melee_combat': '近战战斗',
        'stealth_combat': '潜行战斗',
        'holy_combat': '神圣战斗',
        'magic_combat': '魔法战斗',
        'ranged_combat': '远程战斗'
    };
    return specializationMap[specialization] || specialization;
}

// 渲染属性列表
function renderAttributes(attributes) {
    let attributesHTML = '';
    const attributeNames = {
        'strength': '力量',
        'agility': '敏捷',
        'precision': '精准',
        'vitality': '体力',
        'endurance': '耐力',
        'dodge': '闪避',
        'critical_chance': '暴击率',
        'armor': '护甲',
        'movement_speed': '移动速度'
    };
    
    for (const [key, value] of Object.entries(attributes)) {
        const displayName = attributeNames[key] || key;
        attributesHTML += `<div class="attribute-item"><span class="attribute-name">${displayName}:</span><span class="attribute-value">${value}</span></div>`;
    }
    
    return attributesHTML;
}

// 渲染技能列表
function renderSkills(skills) {
    let skillsHTML = '';
    
    // 检查skills是数组还是对象
    if (Array.isArray(skills)) {
        // 如果是数组，直接渲染
        skills.forEach(skill => {
            skillsHTML += `<li class="skill-item">${skill}</li>`;
        });
    } else {
        // 如果是对象（比如traits），渲染键值对
        for (const [key, value] of Object.entries(skills)) {
            skillsHTML += `<li class="skill-item">${key}: ${value}</li>`;
        }
    }
    
    return skillsHTML;
}

// 选择职业
function selectClass(classId) {
    console.log('选择职业:', classId);
    
    // 获取选择的职业数据
    let selectedClass = null;
    if (typeof window.game !== 'undefined' && window.game.characters && window.game.characters.classes) {
        selectedClass = window.game.characters.classes.find(cls => cls.id === classId);
    } else if (typeof Classes !== 'undefined') {
        selectedClass = Classes[classId];
    }
    
    if (selectedClass) {
        console.log('已选择职业:', selectedClass.name);
        
        // 保存选择的职业（可以存储在localStorage或全局变量中）
        if (typeof window !== 'undefined') {
            window.selectedClass = selectedClass;
            localStorage.setItem('selectedClass', JSON.stringify(selectedClass));
        }
        
        // 更新游戏中的角色属性（这里需要根据游戏逻辑进行调整）
        updateCharacterAttributes(selectedClass);
        
        // 隐藏职业选择界面，显示游戏主界面
        const classSelection = document.getElementById('class-selection');
        const gameContainer = document.getElementById('game-container');
        
        if (classSelection && gameContainer) {
            classSelection.style.display = 'none';
            gameContainer.style.display = 'flex';
            
            // 显示选择职业的提示
            console.log(`欢迎，${selectedClass.name}！开始你的冒险之旅吧！`);
        }
    }
}

// 更新角色属性
function updateCharacterAttributes(selectedClass) {
    // 这里需要根据游戏逻辑更新角色属性
    // 示例：更新角色面板中的属性值
    const attributeElements = document.querySelectorAll('.attribute-value');
    if (attributeElements.length > 0 && selectedClass.base_attributes) {
        // 更新力量
        const strengthElement = document.querySelector('.attribute:nth-child(1) .attribute-value');
        if (strengthElement && selectedClass.base_attributes.strength) {
            strengthElement.textContent = selectedClass.base_attributes.strength;
        }
        
        // 更新敏捷
        const agilityElement = document.querySelector('.attribute:nth-child(2) .attribute-value');
        if (agilityElement && selectedClass.base_attributes.agility) {
            agilityElement.textContent = selectedClass.base_attributes.agility;
        }
        
        // 更新智力/精准
        const precisionElement = document.querySelector('.attribute:nth-child(3) .attribute-value');
        if (precisionElement) {
            if (selectedClass.base_attributes.precision) {
                precisionElement.textContent = selectedClass.base_attributes.precision;
            } else if (selectedClass.base_attributes.intelligence) {
                precisionElement.textContent = selectedClass.base_attributes.intelligence;
            }
        }
        
        // 更新体力
        const vitalityElement = document.querySelector('.attribute:nth-child(4) .attribute-value');
        if (vitalityElement && selectedClass.base_attributes.vitality) {
            vitalityElement.textContent = selectedClass.base_attributes.vitality;
        }
        
        // 更新耐力
        const enduranceElement = document.querySelector('.attribute:nth-child(5) .attribute-value');
        if (enduranceElement && selectedClass.base_attributes.endurance) {
            enduranceElement.textContent = selectedClass.base_attributes.endurance;
        }
    }
}

// 初始化标签切换系统
function initTabSystem() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有活跃状态
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // 添加当前活跃状态
            this.classList.add('active');
            const tabId = this.dataset.tab;
            const targetContent = document.querySelector(`#${tabId}-panel`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // 技能分类切换
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加技能分类切换逻辑
            const category = this.dataset.category;
            console.log('切换到技能分类:', category);
        });
    });
}

// 初始化菜单系统
function initMenuSystem() {
    const menuBtn = document.getElementById('menu-btn');
    const gameMenu = document.getElementById('game-menu');
    const menuClose = document.querySelector('.menu-close');
    const menuOptions = document.querySelectorAll('.menu-option');
    
    // 打开菜单
    menuBtn.addEventListener('click', function() {
        gameMenu.style.display = 'flex';
    });
    
    // 关闭菜单
    menuClose.addEventListener('click', function() {
        gameMenu.style.display = 'none';
    });
    
    // 点击菜单选项
    menuOptions.forEach(option => {
        option.addEventListener('click', function() {
            const optionText = this.textContent.trim();
            console.log('选择菜单选项:', optionText);
            
            // 根据选项执行不同操作
            switch(optionText) {
                case '继续游戏':
                    gameMenu.style.display = 'none';
                    break;
                case '保存游戏':
                    saveGame();
                    break;
                case '读取游戏':
                    loadGame();
                    break;
                case '设置':
                    openSettings();
                    break;
                case '退出游戏':
                    exitGame();
                    break;
            }
        });
    });
    
    // 点击遮罩层关闭菜单
    const menuOverlay = document.querySelector('.menu-overlay');
    menuOverlay.addEventListener('click', function() {
        gameMenu.style.display = 'none';
    });
}

// 初始化物品详情弹窗
function initItemDetails() {
    const itemSlots = document.querySelectorAll('.inventory-slot, .equipment-slot .slot-content');
    const itemDetails = document.getElementById('item-details');
    const detailsClose = document.querySelector('.details-close');
    
    // 检查必需的DOM元素是否存在
    if (!itemDetails || !detailsClose) {
        console.warn('无法初始化物品详情弹窗：缺少必需的DOM元素');
        return;
    }
    
    // 点击物品槽显示详情
    if (itemSlots && itemSlots.length > 0) {
        itemSlots.forEach(slot => {
            slot.addEventListener('click', function(e) {
                // 只有非空槽位才显示详情
                if (!this.classList.contains('empty') && this.textContent.trim() !== '空') {
                    itemDetails.style.display = 'flex';
                }
            });
        });
    }
    
    // 关闭详情弹窗
    detailsClose.addEventListener('click', function() {
        itemDetails.style.display = 'none';
    });
    
    // 点击遮罩层关闭详情弹窗
    const detailsOverlay = document.querySelector('.details-overlay');
    if (detailsOverlay) {
        detailsOverlay.addEventListener('click', function() {
            itemDetails.style.display = 'none';
        });
    }
    
    // 物品操作按钮
    const actionBtns = document.querySelectorAll('.details-actions .action-btn');
    if (actionBtns && actionBtns.length > 0) {
        actionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.textContent.trim();
                console.log('执行物品操作:', action);
                // 这里可以添加具体的物品操作逻辑
                itemDetails.style.display = 'none';
            });
        });
    }
}

// 初始化玩家移动
function initPlayerMovement() {
    const playerSprite = document.querySelector('.player-sprite');
    
    // 检查玩家精灵是否存在
    if (!playerSprite) {
        console.warn('无法初始化玩家移动：缺少玩家精灵元素');
        return;
    }
    
    let playerX = 50; // 百分比
    let playerY = 50; // 百分比
    const moveSpeed = 5; // 每次移动的百分比
    
    // 键盘控制
    document.addEventListener('keydown', function(e) {
        let newX = playerX;
        let newY = playerY;
        
        switch(e.key) {
            case 'w':
            case 'ArrowUp':
                newY = Math.max(10, playerY - moveSpeed);
                break;
            case 's':
            case 'ArrowDown':
                newY = Math.min(90, playerY + moveSpeed);
                break;
            case 'a':
            case 'ArrowLeft':
                newX = Math.max(10, playerX - moveSpeed);
                break;
            case 'd':
            case 'ArrowRight':
                newX = Math.min(90, playerX + moveSpeed);
                break;
            case 'e':
            case 'E':
                // 交互键
                checkInteractions();
                return;
            case 'Escape':
                // 打开菜单
                const gameMenu = document.getElementById('game-menu');
                if (gameMenu) {
                    gameMenu.style.display = gameMenu.style.display === 'flex' ? 'none' : 'flex';
                }
                return;
        }
        
        // 更新玩家位置
        updatePlayerPosition(newX, newY);
    });
    
    // 更新玩家位置
    function updatePlayerPosition(x, y) {
        playerX = x;
        playerY = y;
        playerSprite.style.left = `${x}%`;
        playerSprite.style.top = `${y}%`;
        
        // 添加移动动画
        playerSprite.style.animation = 'none';
        void playerSprite.offsetWidth; // 触发重排
        playerSprite.style.animation = 'playerIdle 1s ease-in-out infinite';
        
        // 检查碰撞
        checkCollisions();
        
        // 更新场景信息（示例）
        updateSceneInfo();
        
        // 更新移动使用标记（如果游戏逻辑文件已加载）
        if (typeof updateMovementUsedFlag === 'function') {
            updateMovementUsedFlag();
        }
    }
    
    // 检查交互
    function checkInteractions() {
        console.log('检查交互...');
        // 这里可以添加具体的交互逻辑
    }
    
    // 检查碰撞
    function checkCollisions() {
        // 这里可以添加碰撞检测逻辑
    }
    
    // 更新场景信息
    function updateSceneInfo() {
        // 示例：根据玩家位置更新场景信息
        const sceneName = document.querySelector('.scene-name');
        const sceneDesc = document.querySelector('.scene-description');
        
        // 这里可以添加根据玩家位置动态更新场景信息的逻辑
        console.log('玩家位置:', playerX, playerY);
    }
}

// 初始化地图交互
function initMapInteractions() {
    const mapObjects = document.querySelectorAll('.map-object');
    
    mapObjects.forEach(obj => {
        obj.addEventListener('click', function() {
            const objType = this.classList[1];
            console.log('点击地图对象:', objType);
            
            // 根据对象类型执行不同操作
            switch(objType) {
                case 'tree':
                    console.log('这是一棵树');
                    break;
                case 'rock':
                    console.log('这是一块石头');
                    break;
                case 'chest':
                    openChest(this);
                    break;
                case 'portal':
                    usePortal(this);
                    break;
            }
        });
    });
    
    // 打开宝箱
    function openChest(chest) {
        // 添加宝箱打开动画
        chest.style.animation = 'none';
        void chest.offsetWidth;
        chest.style.animation = 'slideIn 0.5s ease-out';
        
        console.log('打开宝箱！');
        // 这里可以添加宝箱打开逻辑
    }
    
    // 使用传送门
    function usePortal(portal) {
        // 添加传送门动画
        portal.style.animation = 'none';
        void portal.offsetWidth;
        portal.style.animation = 'portalPulse 2s ease-in-out infinite';
        
        console.log('使用传送门！');
        // 这里可以添加场景切换逻辑
    }
}

// 增强现有战斗系统
function enhanceCombatSystem() {
    const attackBtn = document.querySelector('.combat-btn.attack');
    const skillBtn = document.querySelector('.combat-btn.skill');
    const fleeBtn = document.querySelector('.combat-btn.flee');
    
    if (attackBtn) {
        attackBtn.addEventListener('click', function() {
            console.log('增强攻击按钮点击事件');
            // 为现有攻击按钮添加动画效果
            this.style.animation = 'none';
            void this.offsetWidth;
            this.style.animation = 'attack 0.5s ease-in-out';
        });
    }
    
    if (skillBtn) {
        skillBtn.addEventListener('click', function() {
            console.log('增强技能按钮点击事件');
            // 为现有技能按钮添加动画效果
            this.style.animation = 'none';
            void this.offsetWidth;
            this.style.animation = 'skillCast 0.8s ease-in-out';
        });
    }
    
    if (fleeBtn) {
        fleeBtn.addEventListener('click', function() {
            console.log('增强逃跑按钮点击事件');
        });
    }
    
    // 为现有战斗日志添加动画
    const logContent = document.querySelector('.combat-log');
    if (logContent) {
        // 监听日志内容变化并添加动画
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    const newNodes = mutation.addedNodes;
                    newNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // 元素节点
                            node.style.animation = 'logEntry 0.5s ease-out';
                        }
                    });
                }
            });
        });
        
        observer.observe(logContent, {
            childList: true
        });
    }
    
    console.log('战斗系统增强完成');
}

// 添加动画效果到现有UI元素
function addAnimationsToExistingUI() {
    // 为装备槽添加悬停效果
    const equipmentSlots = document.querySelectorAll('.equipment-slot');
    equipmentSlots.forEach(slot => {
        slot.style.transition = 'all 0.3s ease';
        slot.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 5px 15px rgba(100, 100, 255, 0.3)';
        });
        slot.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    // 为敌人按钮添加动画效果
    const enemyBtns = document.querySelectorAll('.enemy-btn');
    enemyBtns.forEach(btn => {
        btn.style.transition = 'all 0.3s ease';
        btn.addEventListener('click', function() {
            this.style.animation = 'none';
            void this.offsetWidth;
            this.style.animation = 'attack 0.5s ease-in-out';
        });
    });
    
    // 为属性按钮添加动画效果
    const attributeBtns = document.querySelectorAll('.attribute-btn');
    attributeBtns.forEach(btn => {
        btn.style.transition = 'all 0.3s ease';
        btn.addEventListener('click', function() {
            this.style.animation = 'none';
            void this.offsetWidth;
            this.style.animation = 'hitEffect 0.5s ease-in-out';
        });
    });
    
    // 为战利品项目添加动画效果
    const lootItems = document.querySelectorAll('.item');
    lootItems.forEach(item => {
        item.style.transition = 'all 0.3s ease';
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 5px 15px rgba(100, 100, 255, 0.3)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });
    
    console.log('现有UI动画添加完成');
}

// 初始化技能系统
function initSkillSystem() {
    const upgradeBtns = document.querySelectorAll('.upgrade-btn');
    
    upgradeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const skillItem = this.closest('.skill-item');
            const skillName = skillItem.querySelector('.skill-name').textContent;
            const skillLevel = skillItem.querySelector('.skill-level');
            
            // 更新技能等级
            const levelMatch = skillLevel.textContent.match(/(\d+)\/(\d+)/);
            if (levelMatch) {
                const currentLevel = parseInt(levelMatch[1]);
                const maxLevel = parseInt(levelMatch[2]);
                
                if (currentLevel < maxLevel) {
                    const newLevel = currentLevel + 1;
                    skillLevel.textContent = `等级: ${newLevel}/${maxLevel}`;
                    
                    // 减少技能点
                    const skillPoints = document.querySelector('.skill-points-value');
                    const currentPoints = parseInt(skillPoints.textContent);
                    skillPoints.textContent = currentPoints - 1;
                    
                    console.log(`升级技能: ${skillName} 到等级 ${newLevel}`);
                    
                    // 更新技能升级标记（如果游戏逻辑文件已加载）
                    if (typeof updateSkillUpgradedFlag === 'function') {
                        updateSkillUpgradedFlag();
                    }
                    
                    // 如果没有技能点了，禁用所有升级按钮
                    if (currentPoints - 1 <= 0) {
                        upgradeBtns.forEach(btn => btn.disabled = true);
                    }
                }
            }
        });
    });
}

// 保存游戏
function saveGame() {
    console.log('保存游戏...');
    // 这里可以添加保存游戏逻辑
}

// 读取游戏
function loadGame() {
    console.log('读取游戏...');
    // 这里可以添加读取游戏逻辑
}

// 打开设置
function openSettings() {
    console.log('打开设置...');
    // 这里可以添加打开设置逻辑
}

// 退出游戏
function exitGame() {
    console.log('退出游戏...');
    // 这里可以添加退出游戏逻辑
}

// 工具函数：随机生成整数
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 工具函数：添加闪烁效果
function addBlinkEffect(element, duration = 1000) {
    element.style.animation = 'none';
    void element.offsetWidth;
    element.style.animation = `blink ${duration}ms ease-in-out`;
}

// CSS动画：所有需要的动画
const blinkStyle = document.createElement('style');
blinkStyle.textContent = `
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    
    @keyframes playerIdle {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
    }
    
    @keyframes attack {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    @keyframes skillCast {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes logEntry {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideIn {
        0% { opacity: 0; transform: translateX(-20px); }
        100% { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes portalPulse {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.1); opacity: 1; }
    }
    
    @keyframes damagePop {
        0% { opacity: 1; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(-30px) scale(1.2); }
    }
    
    @keyframes entrance {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes hitEffect {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(blinkStyle);

// 工具函数：创建浮动文本
function createFloatingText(text, x, y, color = '#ff6b6b', duration = 1000) {
    const floatingText = document.createElement('div');
    floatingText.textContent = text;
    floatingText.style.position = 'absolute';
    floatingText.style.left = `${x}px`;
    floatingText.style.top = `${y}px`;
    floatingText.style.color = color;
    floatingText.style.fontWeight = 'bold';
    floatingText.style.fontSize = '16px';
    floatingText.style.pointerEvents = 'none';
    floatingText.style.zIndex = '1000';
    floatingText.style.animation = `damagePop ${duration}ms ease-out forwards`;
    
    document.body.appendChild(floatingText);
    
    // 动画结束后移除
    setTimeout(() => {
        floatingText.remove();
    }, duration);
}

// 响应式处理
window.addEventListener('resize', function() {
    console.log('窗口大小变化');
    // 这里可以添加响应式处理逻辑
});

// 初始化页面加载动画
window.addEventListener('load', function() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.style.animation = 'entrance 1s ease-out';
});