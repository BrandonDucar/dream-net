import os

target_dir = r"c:\Users\brand\OneDrive\Documents\GitHub\dream-net\client\src"
# Map legacy alias to new workspace package path
replacements = {
    "@shared/": "@dreamnet/shared/"
}

print("Starting alignment...")
for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".ts"):
            path = os.path.join(root, file)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                new_content = content
                for old, new in replacements.items():
                    new_content = new_content.replace(old, new)
                
                if new_content != content:
                    print(f"Aligning {path}")
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(new_content)
            except Exception as e:
                print(f"Error processing {path}: {e}")
print("Alignment complete.")
