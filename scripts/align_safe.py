import os
import re

targets = [
    r"c:\Users\brand\OneDrive\Documents\GitHub\dream-net\server",
    r"c:\Users\brand\OneDrive\Documents\GitHub\dream-net\client\src",
]

# Add all packages
packages_dir = r"c:\Users\brand\OneDrive\Documents\GitHub\dream-net\packages"
for d in os.listdir(packages_dir):
    full_path = os.path.join(packages_dir, d)
    if os.path.isdir(full_path):
        targets.append(full_path)


# Regex to match relative paths to shared
pattern = re.compile(r'from\s+[\'"](\.\./)+shared/([^"\']+)[\'"]')
replacement = r"from '@dreamnet/shared'"

print("Starting safe alignment...")
for target in targets:
    if os.path.exists(target):
        for root, dirs, files in os.walk(target):
            # Safer: explicit exclusion just in case
            if "node_modules" in dirs:
                dirs.remove("node_modules")
                
            for file in files:
                if file.endswith(".tsx") or file.endswith(".ts"):
                    path = os.path.join(root, file)
                    try:
                        with open(path, "r", encoding="utf-8") as f:
                            content = f.read()
                        
                        new_content = pattern.sub(replacement, content)
                        new_content = new_content.replace("'@shared/", "'@dreamnet/shared/")
                        new_content = new_content.replace('"@shared/', '"@dreamnet/shared/')

                        if new_content != content:
                            print(f"Aligning {path}")
                            with open(path, "w", encoding="utf-8") as f:
                                f.write(new_content)
                    except Exception as e:
                        print(f"Error processing {path}: {e}")
    else:
        print(f"Target not found: {target}")

print("Safe alignment complete.")
