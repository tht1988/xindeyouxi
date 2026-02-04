import json

# 简单验证JSON文件
def check_file(file_name):
    try:
        with open(file_name, 'r', encoding='utf-8') as f:
            json.load(f)
        print(f"✓ {file_name} 有效")
        return True
    except Exception as e:
        print(f"✗ {file_name} 无效: {e}")
        return False

# 验证我们修改和创建的文件
files = [
    'items/armors.json',
    'items/accessories.json',
    'items/potions.json',
    'items/consumables.json'
]

print("验证结果：")
for f in files:
    check_file(f)
