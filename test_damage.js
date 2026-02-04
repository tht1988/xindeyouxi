// 测试用的 calculateDamage 函数
function calculateDamage(attack, defense, damageType = 'physical', targetResistances = {}) {
    // 默认抗性为0
    const defaultResistances = {
        physical: 0,
        fire: 0,
        ice: 0,
        lightning: 0
    };
    
    // 合并默认抗性和目标抗性
    const resistances = { ...defaultResistances, ...targetResistances };
    
    // 获取对应伤害类型的抗性
    const resistance = resistances[damageType] || 0;
    
    // 计算抗性减免后的伤害
    let resistanceReducedDamage = attack * (1 - resistance / 100);
    
    // 防御减免：物理伤害全额减免，属性伤害减半减免
    let defenseReduction = damageType === 'physical' ? defense : defense * 0.5;
    
    // 最终伤害
    const finalDamage = Math.max(1, resistanceReducedDamage - defenseReduction);
    return finalDamage;
}

// 测试示例1：物理伤害
const test1 = {
    damage: 1000,
    defense: 400,
    damageType: 'physical',
    resistances: { physical: 50 }
};
const result1 = calculateDamage(test1.damage, test1.defense, test1.damageType, test1.resistances);
console.log('测试示例1 - 物理伤害:');
console.log('输入参数:', test1);
console.log('预期结果: 100');
console.log('实际结果:', result1);
console.log('测试通过:', result1 === 100);
console.log('-------------------------------');

// 测试示例2：冰伤+火伤
const iceDamage = 500;
const fireDamage = 400;
const test2_defense = 400;
const test2_resistances = {
    physical: 75,
    ice: 50,
    fire: 40
};

// 计算冰伤部分
const iceResult = calculateDamage(iceDamage, test2_defense, 'ice', test2_resistances);
// 计算火伤部分
const fireResult = calculateDamage(fireDamage, test2_defense, 'fire', test2_resistances);
// 总伤害
const totalResult = iceResult + fireResult;

console.log('测试示例2 - 冰伤+火伤:');
console.log('冰伤:', iceDamage, '火伤:', fireDamage, '防御:', test2_defense, '抗性:', test2_resistances);
console.log('冰伤结果:', iceResult);
console.log('火伤结果:', fireResult);
console.log('总伤害结果:', totalResult);
console.log('预期总结果: 210');
console.log('测试通过:', totalResult === 210);
console.log('-------------------------------');

// 更多测试用例
const test3 = {
    damage: 2000,
    defense: 500,
    damageType: 'physical',
    resistances: { physical: 30 }
};
const result3 = calculateDamage(test3.damage, test3.defense, test3.damageType, test3.resistances);
console.log('测试示例3 - 高物理伤害:');
console.log('输入参数:', test3);
console.log('预期结果: 2000*0.7 - 500 = 900');
console.log('实际结果:', result3);
console.log('测试通过:', result3 === 900);
console.log('-------------------------------');

const test4 = {
    damage: 1500,
    defense: 300,
    damageType: 'fire',
    resistances: { fire: 25 }
};
const result4 = calculateDamage(test4.damage, test4.defense, test4.damageType, test4.resistances);
console.log('测试示例4 - 火伤:');
console.log('输入参数:', test4);
console.log('预期结果: 1500*0.75 - 300*0.5 = 1125 - 150 = 975');
console.log('实际结果:', result4);
console.log('测试通过:', result4 === 975);
