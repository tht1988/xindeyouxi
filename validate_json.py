import json
import os

# 要验证的文件列表
files_to_validate = [
    'mechanics/core_mechanics.json',
    'characters/attributes.json',
    'characters/classes.json',
    'enemies/enemies.json',
    'loot/loot_system.json',
    'items/weapons.json',
    'items/armors.json',
    'items/accessories.json',
    'items/potions.json',
    'items/consumables.json',
    'affixes/prefixes.json',
    'affixes/suffixes.json',
    'affixes/uniques.json'
]

print("开始验证JSON文件...")
all_valid = True

for file_path in files_to_validate:
    full_path = os.path.abspath(file_path)
    try:
        with open(full_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"✓ {file_path} 是有效的JSON文件")
    except json.JSONDecodeError as e:
        print(f"✗ {file_path} 不是有效的JSON文件")
        print(f"  错误: {e}")
        all_valid = False
    except Exception as e:
        print(f"✗ 读取 {file_path} 时出错")
        print(f"  错误: {e}")
        all_valid = False

if all_valid:
    print("\n所有JSON文件都有效！")
else:
    print("\n有些JSON文件无效，请检查上面的错误信息。")
