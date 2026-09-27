import os
import re

BT = chr(96)  # backtick
pattern_c1 = re.compile(r'\}' + BT + r'\s*:\s*' + BT)
pattern_c2 = re.compile(r'\?\s*\}' + BT)
pattern_c3 = re.compile(r':\s*\}' + BT)
pattern_c4 = re.compile(r'=>\s*\}' + BT)
pattern_c5 = re.compile(r'return\s*\}' + BT)
pattern_c6 = re.compile(r'\|\|\s*\}' + BT)

files_changed = 0
total_replacements = 0

for root, dirs, files in os.walk(os.path.join('static', 'js')):
    for f in files:
        if f.endswith('.js') and not any(x in f for x in ['.bak', '.backup']):
            fpath = os.path.join(root, f)
            with open(fpath, 'r', encoding='utf-8') as fl:
                orig = fl.read()

            fixed = orig
            fixed, c1 = pattern_c1.subn(BT + ' : ' + BT, fixed)
            fixed, c2 = pattern_c2.subn('? ' + BT, fixed)
            fixed, c3 = pattern_c3.subn(': ' + BT, fixed)
            fixed, c4 = pattern_c4.subn('=> ' + BT, fixed)
            fixed, c5 = pattern_c5.subn('return ' + BT, fixed)
            fixed, c6 = pattern_c6.subn('|| ' + BT, fixed)

            subtotal = c1 + c2 + c3 + c4 + c5 + c6
            if subtotal > 0:
                print(f"{f}: {subtotal} fixes (c1={c1}, c2={c2}, c3={c3}, c4={c4}, c5={c5}, c6={c6})")
                with open(fpath, 'w', encoding='utf-8') as fl:
                    fl.write(fixed)
                total_replacements += subtotal
                files_changed += 1

print(f"\nDone! Updated {files_changed} files with {total_replacements} total fixes.")
