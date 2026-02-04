import json
import os

file_path = 'items/weapons.json'
full_path = os.path.abspath(file_path)

try:
    with open(full_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"✓ {file_path} 是有效的JSON文件")
    print(f"  包含 {len(data['weapons'])} 种武器")
except json.JSONDecodeError as e:
    print(f"✗ {file_path} 不是有效的JSON文件")
    print(f"  错误: {e}")
except Exception as e:
    print(f"✗ 读取 {file_path} 时出错")
    print(f"  错误: {e}")
