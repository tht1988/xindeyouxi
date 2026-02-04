import json
import os

# 要验证的文件列表
json_files = [
    'items/weapons.json',
    'items/armors.json',
    'items/accessories.json',
    'items/potions.json',
    'items/consumables.json'
]

print("验证JSON文件格式...")
print("=" * 50)

all_valid = True

for file_path in json_files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            json.load(f)
        print(f"✓ {file_path} - JSON格式正确")
    except json.JSONDecodeError as e:
        print(f"✗ {file_path} - JSON格式错误")
        print(f"  错误信息: {e}")
        all_valid = False
    except Exception as e:
        print(f"✗ {file_path} - 读取错误")
        print(f"  错误信息: {e}")
        all_valid = False

print("=" * 50)
if all_valid:
    print("✅ 所有文件JSON格式都正确！")
else:
    print("❌ 部分文件JSON格式错误，请检查！")
