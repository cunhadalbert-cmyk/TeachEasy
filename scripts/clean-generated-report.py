#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / 'docs' / 'auditoria-ensino-medio-v2.md'

text = PATH.read_text(encoding='utf-8')
lines = [line.rstrip() for line in text.splitlines()]
PATH.write_text('\n'.join(lines) + '\n', encoding='utf-8')
print('Relatório da auditoria normalizado sem espaços finais.')
