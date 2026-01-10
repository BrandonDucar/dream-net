import os
import re

target_dir = r"c:\Users\brand\OneDrive\Documents\GitHub\dream-net\server"
# Regex to match relative paths to shared, e.g., "../shared/..." or "../../../shared/..."
pattern = re.compile(r'from\s+[\'"](\.\./)+shared/([^"\']+)[\'"]')
replacement = r"from '@dreamnet/shared'"

print("Starting server alignment...")
for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".ts"):
            path = os.path.join(root, file)
            try:
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                # Replace specific file imports with barrel import
                # e.g., "../shared/schema" -> "@dreamnet/shared"
                # But we need to check if the symbols are exported from index.ts
                # My shared/index.ts exports * from ./schema, etc. So yes.
                
                new_content = pattern.sub(replacement, content)
                
                # Also replace @shared alias if used
                new_content = new_content.replace("'@shared/", "'@dreamnet/shared/")
                new_content = new_content.replace('"@shared/', '"@dreamnet/shared/')

                if new_content != content:
                    print(f"Aligning {path}")
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(new_content)
            except Exception as e:
                print(f"Error processing {path}: {e}")
print("Server alignment complete.")
