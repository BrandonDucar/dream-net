import os
import re

targets = [
    r"c:\Users\brand\OneDrive\Documents\GitHub\dream-net\client\src\pages"
]

# Regex to match relative paths to lib, e.g., "../../../lib/..."
pattern = re.compile(r'from\s+[\'"](\.\./)+lib/([^"\']+)[\'"]')
replacement = r"from '@dreamnet/lib'"

print("Starting lib alignment...")
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
                        
                        # Also replace direct file refs if they used extensionless imports
                        # e.g., "../lib/dreamkeeperCore" -> "@dreamnet/lib"
                        
                        if new_content != content:
                            print(f"Aligning {path}")
                            with open(path, "w", encoding="utf-8") as f:
                                f.write(new_content)
                    except Exception as e:
                        print(f"Error processing {path}: {e}")
    else:
        print(f"Target not found: {target}")

print("Lib alignment complete.")
