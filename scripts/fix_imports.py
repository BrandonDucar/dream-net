import os

target_dir = r"c:\Users\brand\OneDrive\Documents\GitHub\dream-net\packages"
bad_string = "internal-ports/src/index.ts"
good_string = "internal-ports/src/index"

print(f"Scanning {target_dir} for bad imports...")
fixed_files = 0

for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith(".ts"):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if bad_string in content:
                    print(f"Fixing: {file}")
                    # Replace both single and double quote variations if they match exact string
                    new_content = content.replace(bad_string, good_string)
                    
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    fixed_files += 1
            except Exception as e:
                print(f"Skipping {file}: {e}")

print(f"Finished. Fixed {fixed_files} files.")
