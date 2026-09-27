import os, re, sys

sys.stdout.reconfigure(encoding='utf-8')
pattern = '}' + chr(96)
results = []

for root, dirs, files in os.walk(os.path.join('static', 'js')):
    for f in files:
        if f.endswith('.js') and not any(f.endswith(x) for x in ['.bak', '.bak_precise', '.postfix_fix_backup']):
            fpath = os.path.join(root, f)
            with open(fpath, 'r', encoding='utf-8') as fl:
                content = fl.read()
            idx = 0
            while True:
                pos = content.find(pattern, idx)
                if pos == -1: break
                prefix = content[max(0, pos-20):pos]
                suffix = content[pos+2:min(len(content), pos+22)]
                results.append((fpath, prefix, suffix))
                idx = pos + 1

print(f"Total occurrences: {len(results)}")
for fpath, prefix, suffix in results:
    # check whether prefix looks like the end of an interpolation e.g. ${foo}
    # In ${foo}`, prefix ends with the contents of foo inside { ... }
    # In corrupt ones, prefix ends with: ? , : , => , return , || 
    is_corrupt = any(prefix.rstrip().endswith(op) for op in ['?', ':', '=>', 'return', '||'])
    if is_corrupt:
        print(f"CORRUPT: {os.path.basename(fpath)} | ...{prefix!r} + '{pattern}' + {suffix!r}...")
    else:
        print(f"NORMAL:  {os.path.basename(fpath)} | ...{prefix!r} + '{pattern}' + {suffix!r}...")
