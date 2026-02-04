import json

# 直接验证enemies.json文件
file_path = 'enemies/enemies.json'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"✓ {file_path} 是有效的JSON文件")
    print(f"  包含 {len(data['enemies'])} 个敌人")
    for enemy in data['enemies']:
        print(f"    - {enemy['name']} (等级 {enemy['level']}, 类型 {enemy['enemy_type']})")
except json.JSONDecodeError as e:
    print(f"✗ {file_path} 不是有效的JSON文件")
    print(f"  错误: {e}")
except Exception as e:
    print(f"✗ 读取 {file_path} 时出错")
    print(f"  错误: {e}")