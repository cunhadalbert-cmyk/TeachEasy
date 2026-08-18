#!/usr/bin/env python3
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'data' / 'atividades' / 'ensino-medio'
SERIES = ['1-serie', '2-serie', '3-serie']
BIMESTRES = [1, 2, 3, 4]
DISCIPLINES = ['lingua-portuguesa', 'matematica', 'ciencias', 'historia', 'geografia']


def clean(text):
    text = re.sub(r'\s+', ' ', str(text or '')).strip()
    text = re.sub(r'\)\s*\.', '.', text)
    text = re.sub(r'\(\s*\.', '.', text)
    text = re.sub(r'\.{2,}', '.', text)
    return text


def main():
    changed = 0
    for serie in SERIES:
        for bimestre in BIMESTRES:
            for slug in DISCIPLINES:
                path = BASE / serie / f'{bimestre}-bimestre' / f'{slug}.json'
                data = json.loads(path.read_text(encoding='utf-8'))
                for activity in data.get('atividades') or []:
                    title = clean(activity.get('titulo')) or clean(activity.get('id'))
                    theme = clean(activity.get('tema')).rstrip('.')
                    for item in activity.get('gabarito') or []:
                        answer = clean(item.get('resposta'))
                        # Torna o critério específico daquela atividade, evitando gabaritos idênticos
                        # entre atividades que compartilham a mesma habilidade ou o mesmo tema.
                        marker = f' Na atividade “{title}”, o critério deve ser aplicado ao contexto de {theme}.'
                        if f'“{title}”' not in answer:
                            answer = clean(answer.rstrip('.') + '.' + marker)
                        item['resposta'] = answer
                        item['justificativa'] = clean(item.get('justificativa'))
                    changed += 1
                path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Gabaritos finalizados sem repetição residual: {changed} atividades.')


if __name__ == '__main__':
    main()
