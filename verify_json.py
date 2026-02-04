import json
import os

# 验证单个JSON文件的函数
def verify_json_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return True, f"{file_path} 验证通过"
    except json.JSONDecodeError as e:
        return False, f"{file_path} 验证失败: JSON格式错误 - {e}"
    except Exception as e:
        return False, f"{file_path} 验证失败: 其他错误 - {e}"

# 要验证的文件列表
files_to_verify = [
    'items/weapons.json',
    'items/armors.json',
    'items/accessories.json',
    'items/potions.json',
    'items/consumables.json'
]

# 执行验证
print("JSON文件验证结果：")
print("-" * 60)

valid_count = 0
invalid_count = 0

for file in files_to_verify:
    is_valid, message = verify_json_file(file)
    print(message)
    if is_valid:
        valid_count += 1
    else:
        invalid_count += 1

print("-" * 60)
print(f"验证完成: {valid_count} 个文件有效, {invalid_count} 个文件无效")
