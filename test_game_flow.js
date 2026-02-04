// 游戏流程测试脚本
// 直接在Node.js环境中测试游戏逻辑

// 模拟浏览器环境
global.document = {
    getElementById: () => null,
    querySelector: () => null,
    createElement: () => {
        return {
            style: {},
            appendChild: () => {},
            remove: () => {},
            addEventListener: () => {}
        };
    },
    querySelectorAll: () => []
};

global.window = {
    addEventListener: () => {}
};

// 简单的日志函数
function addToLog(message) {
    console.log(`[LOG] ${message}`);
}

// 加载游戏逻辑
const fs = require('fs');
const path = require('path');

// 读取并执行game_logic.js
const gameLogicPath = path.join(__dirname, 'game_logic.js');
const gameLogicContent = fs.readFileSync(gameLogicPath, 'utf8');

try {
    // 执行游戏逻辑代码
    eval(gameLogicContent);
    console.log('✅ 游戏逻辑加载成功');
} catch (error) {
    console.error('❌ 游戏逻辑加载失败:', error.message);
    process.exit(1);
}

// 测试函数
function testGameFlow() {
    console.log('\n=== 开始测试游戏流程 ===\n');
    
    // 1. 测试新手引导
    console.log('1. 测试新手引导:');
    try {
        // 测试加载配置
        loadGameConfigs();
        console.log('   ✅ 加载配置成功');
        
        // 测试引导节点
        if (newbieGuideConfig && newbieGuideConfig.progress_nodes) {
            console.log(`   ✅ 共找到 ${newbieGuideConfig.progress_nodes.length} 个引导节点`);
            console.log('   节点列表:');
            newbieGuideConfig.progress_nodes.forEach((node, index) => {
                console.log(`      ${index + 1}. ${node.name} (${node.id}) - ${node.description}`);
            });
        } else {
            console.log('   ❌ 未找到新手引导配置');
        }
        
        // 测试引导进度更新
        updateMovementUsedFlag();
        updateSkillUsedFlag();
        console.log('   ✅ 引导进度更新成功');
        console.log('   当前引导标记:', player.guide_progress.flags);
        
    } catch (error) {
        console.error('   ❌ 新手引导测试失败:', error.message);
    }
    
    // 2. 测试关卡设计
    console.log('\n2. 测试关卡设计:');
    try {
        if (levelsConfig && levelsConfig.levels) {
            console.log(`   ✅ 共加载 ${levelsConfig.levels.length} 个关卡`);
            console.log('   关卡列表:');
            levelsConfig.levels.forEach((level, index) => {
                console.log(`      ${index + 1}. ${level.name} (${level.id}) - 需求等级: ${level.required_level}`);
                console.log(`         敌人: ${level.enemies.length} 种敌人`);
                console.log(`         Boss: ${level.boss ? level.boss.id : '无'}`);
                console.log(`         目标: ${level.objectives.length} 个目标`);
            });
        } else {
            console.log('   ❌ 未找到关卡配置');
        }
        
        // 测试可用关卡
        const availableLevels = getAvailableLevels();
        console.log(`   ✅ 当前等级可挑战 ${availableLevels.length} 个关卡`);
        
        // 测试当前关卡
        const currentLevel = getCurrentLevel();
        if (currentLevel) {
            console.log(`   ✅ 当前推荐关卡: ${currentLevel.name} (${currentLevel.id})`);
        } else {
            console.log('   ❌ 未找到当前关卡');
        }
        
    } catch (error) {
        console.error('   ❌ 关卡设计测试失败:', error.message);
    }
    
    // 3. 测试胜利/失败条件
    console.log('\n3. 测试胜利/失败条件:');
    try {
        // 测试关卡1胜利条件
        const level1Victory = checkLevelVictory('level_1');
        console.log(`   ✅ 关卡1胜利条件: ${level1Victory}`);
        
        // 测试关卡2胜利条件
        const level2Victory = checkLevelVictory('level_2');
        console.log(`   ✅ 关卡2胜利条件: ${level2Victory}`);
        
        // 测试关卡3胜利条件
        const level3Victory = checkLevelVictory('level_3');
        console.log(`   ✅ 关卡3胜利条件: ${level3Victory}`);
        
        // 测试失败条件
        const originalHealth = player.health;
        
        // 测试玩家死亡条件
        player.health = 0;
        const playerDeathDefeat = checkLevelDefeat('level_1');
        console.log(`   ✅ 玩家死亡失败条件: ${playerDeathDefeat}`);
        
        // 恢复玩家状态
        player.health = originalHealth;
        
        // 测试时间限制条件
        const timeLimitDefeat = checkLevelDefeat('level_2');
        console.log(`   ✅ 时间限制失败条件: ${timeLimitDefeat}`);
        
    } catch (error) {
        console.error('   ❌ 胜利/失败条件测试失败:', error.message);
    }
    
    // 4. 测试完成关卡
    console.log('\n4. 测试完成关卡:');
    try {
        // 完成关卡1
        completeLevel('level_1');
        console.log('   ✅ 完成关卡1成功');
        
        // 测试玩家进度
        console.log('   玩家关卡进度:', player.level_progress);
        
    } catch (error) {
        console.error('   ❌ 完成关卡测试失败:', error.message);
    }
    
    console.log('\n=== 游戏流程测试完成 ===');
}

// 执行测试
testGameFlow();
