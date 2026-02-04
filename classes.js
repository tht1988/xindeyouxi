// 职业系统文件
// 所有职业数据集中管理，方便后期扩展和优化

// 职业基础属性和成长率配置
const Classes = {
    // 战士：攻高血厚，闪避低
    warrior: {
        id: 'warrior',
        name: '战士',
        description: '攻高血厚，闪避低',
        primary_attribute: 'strength',
        base_attributes: {
            strength: 15,
            agility: 10,
            precision: 12,
            vitality: 14,
            endurance: 13
        },
        growth_rates: {
            strength: 2.0,
            agility: 1.0,
            precision: 1.2,
            vitality: 1.8,
            endurance: 1.5
        },
        traits: {
            attack: '高',
            defense: '中',
            health: '高',
            agility: '低',
            critical_chance: '中',
            dodge: '低'
        },
        // 职业专属属性或技能可以在这里扩展
        special: {
            name: '战士之怒',
            description: '攻击力提升20%，持续3回合'
        }
    },
    
    // 刺客：高攻高暴击，高闪避，血量低防御低
    assassin: {
        id: 'assassin',
        name: '刺客',
        description: '高攻高暴击，高闪避，血量低防御低',
        primary_attribute: 'agility',
        base_attributes: {
            strength: 14,
            agility: 18,
            precision: 16,
            vitality: 10,
            endurance: 10
        },
        growth_rates: {
            strength: 1.5,
            agility: 2.2,
            precision: 2.0,
            vitality: 1.0,
            endurance: 1.0
        },
        traits: {
            attack: '高',
            defense: '低',
            health: '低',
            agility: '高',
            critical_chance: '高',
            dodge: '高'
        },
        special: {
            name: '致命一击',
            description: '下一次攻击必定暴击，造成150%伤害'
        }
    },
    
    // 骑士：高血高防，移速越快攻击越高
    knight: {
        id: 'knight',
        name: '骑士',
        description: '高血高防，移速越快攻击越高',
        primary_attribute: 'endurance',
        base_attributes: {
            strength: 12,
            agility: 13,
            precision: 11,
            vitality: 16,
            endurance: 17
        },
        growth_rates: {
            strength: 1.2,
            agility: 1.3,
            precision: 1.1,
            vitality: 2.0,
            endurance: 2.1
        },
        traits: {
            attack: '中',
            defense: '高',
            health: '高',
            agility: '中',
            critical_chance: '低',
            dodge: '中'
        },
        special: {
            name: '冲锋',
            description: '向前冲锋，提升移动速度和攻击力，持续2回合'
        }
    }
};

// 将职业转换为数组格式，方便遍历
const classArray = Object.values(Classes);

// 导出职业数据
if (typeof module !== 'undefined' && module.exports) {
    // Node.js环境
    module.exports = { Classes, classArray };
} else {
    // 浏览器环境
    window.game = window.game || {};
    window.game.characters = window.game.characters || {};
    window.game.characters.classes = classArray;
    window.game.classData = Classes;
}
