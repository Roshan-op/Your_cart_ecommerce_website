#!/usr/bin/env python3
"""Simple checkpoint/save & restore utility for this repository.

Usage:
  python checkpoint.py save NAME    # create backups/NAME-<ts>.zip
  python checkpoint.py list         # list available checkpoints
  python checkpoint.py restore FILE --yes  # restore from backups/FILE (confirm with --yes)

The script excludes common large or env folders: backups, venv, node_modules, __pycache__, .git
"""
import os
import sys
import zipfile
import tempfile
import shutil
from datetime import datetime

ROOT = os.path.abspath(os.path.dirname(__file__))
BACKUPS = os.path.join(ROOT, "backups")
EXCLUDE_DIRS = {"backups", "venv", "node_modules", "__pycache__", ".git"}


def is_excluded(path):
    # path is absolute; check any path component against EXCLUDE_DIRS
    rel = os.path.relpath(path, ROOT)
    parts = rel.split(os.sep)
    return any(p in EXCLUDE_DIRS for p in parts)


def save(name: str):
    os.makedirs(BACKUPS, exist_ok=True)
    ts = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    fname = f"{name}-{ts}.zip" if name else f"checkpoint-{ts}.zip"
    dest = os.path.join(BACKUPS, fname)
    with zipfile.ZipFile(dest, "w", zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(ROOT):
            # avoid recursing into excluded dirs
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            if is_excluded(root):
                continue
            for f in files:
                full = os.path.join(root, f)
                if is_excluded(full):
                    continue
                arcname = os.path.relpath(full, ROOT)
                z.write(full, arcname)
    print(dest)


def list_checkpoints():
    if not os.path.isdir(BACKUPS):
        return []
    files = sorted([f for f in os.listdir(BACKUPS) if f.lower().endswith('.zip')])
    for f in files:
        print(f)
    return files


def restore(file_name: str, yes: bool = False):
    path = os.path.join(BACKUPS, file_name)
    if not os.path.isfile(path):
        print(f"Not found: {path}")
        sys.exit(1)
    if not yes:
        print("This will overwrite files in the repository. Re-run with --yes to confirm.")
        sys.exit(2)
    tmp = tempfile.mkdtemp(prefix="checkpoint_restore_")
    try:
        with zipfile.ZipFile(path, 'r') as z:
            z.extractall(tmp)
        # copy files from tmp into ROOT, overwriting
        for root, dirs, files in os.walk(tmp):
            rel_root = os.path.relpath(root, tmp)
            dest_root = os.path.join(ROOT, rel_root) if rel_root != os.curdir else ROOT
            os.makedirs(dest_root, exist_ok=True)
            for f in files:
                src = os.path.join(root, f)
                dst = os.path.join(dest_root, f)
                shutil.copy2(src, dst)
        print(f"Restored from {path}")
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def usage():
    print(__doc__)


def main(argv):
    if len(argv) < 2:
        usage(); return
    cmd = argv[1]
    if cmd == 'save':
        name = argv[2] if len(argv) > 2 else 'checkpoint'
        save(name)
    elif cmd == 'list':
        list_checkpoints()
    elif cmd == 'restore':
        if len(argv) < 3:
            print('missing file name'); sys.exit(1)
        fname = argv[2]
        yes = '--yes' in argv or '-y' in argv
        restore(fname, yes=yes)
    else:
        usage()


if __name__ == '__main__':
    main(sys.argv)
