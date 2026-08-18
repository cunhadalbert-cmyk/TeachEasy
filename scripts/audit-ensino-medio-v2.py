#!/usr/bin/env python3
import json
import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'data' / 'atividades' / 'ensino-medio'
REPORT = ROOT / 'docs' / 'auditoria-ensino-medio-v2.md'
SERIES = ['1-serie', '2-serie', '3-serie']
BIMESTRES = [1, 2, 3, 4]
DISCIPLINES = {
    'lingua-portuguesa': ('Língua Portuguesa', 'LP'),
    'matematica': ('Matemática', 'MAT'),
    'ciencias': ('Ciências', 'CNT'),
    'historia': ('História', 'CHS'),
    'geografia': ('Geografia', 'CHS'),
}
CODE_RE = re.compile(r'\bEM13(?:LP\d{2}|MAT\d{3}|CNT\d{3}|CHS\d{3})\b')
BAD_TEXT = [
    (re.compile(r'\ba habilidade\s+a habilidade\b', re.I), 'expressão "a habilidade" duplicada'),
    (re.compile(r'\bà\s+a\s+habilidade\b', re.I), 'crase/artigo duplicado antes de "habilidade"'),
    (re.compile(r'\.{2,}'), 'pontuação com pontos duplicados'),
    (re.compile(r'\(\s*\.'), 'resíduo "(."'),
    (re.compile(r'\)\s*\.'), 'resíduo ")."'),
    (re.compile(r'Ã.|Â.|â€|�'), 'possível texto corrompido/mojibake'),
    (re.compile(r'\b(a|o|de|da|do|e|em|para|com|por|que)\s+\1\b', re.I), 'palavra funcional duplicada'),
]
GENERIC_ANSWERS = [
    re.compile(r'^resposta\s+(pessoal|autoral)', re.I),
    re.compile(r'^resposta\s+deve\s+ser\s+fundamentada', re.I),
    re.compile(r'^espera-se\s+uma\s+resposta', re.I),
    re.compile(r'conforme\s+a\s+estratégia\s+do\s+estudante', re.I),
]
STOPWORDS = set('a o as os um uma uns umas de da do das dos e em no na nos nas para por com sem que se ao aos à às como ou sua seu suas seus esta este essa esse isso sobre entre mais menos muito muita muitos muitas ser estar foi são tem têm deve devem pode podem'.split())


def norm(text):
    text = str(text or '').lower()
    text = re.sub(r'[^a-záàâãéêíóôõúç0-9]+', ' ', text)
    return re.sub(r'\s+', ' ', text).strip()


def words(text):
    return {w for w in norm(text).split() if len(w) >= 4 and w not in STOPWORDS}


def add_issue(bucket, path, aid, field, message, excerpt=''):
    bucket.append((str(path), aid, field, message, excerpt[:180].replace('\n', ' ')))


def all_text_fields(activity):
    yield 'titulo', activity.get('titulo', '')
    yield 'tema', activity.get('tema', '')
    yield 'objetivo', activity.get('objetivo', '')
    apoio = activity.get('textoApoio') or {}
    if isinstance(apoio, dict):
        yield 'textoApoio.titulo', apoio.get('titulo', '')
        yield 'textoApoio.conteudo', apoio.get('conteudo', '')
    for q in activity.get('questoes') or []:
        yield f"questao.{q.get('numero')}", q.get('enunciado', '')
    for a in activity.get('gabarito') or []:
        yield f"gabarito.{a.get('numero')}", a.get('resposta', '')
        yield f"justificativa.{a.get('numero')}", a.get('justificativa', '')


def main():
    blockers = []
    warnings = []
    stats = Counter()
    code_usage = Counter()
    code_by_collection = defaultdict(Counter)
    repeated_questions = []
    repeated_answers = []

    for serie in SERIES:
        for bimestre in BIMESTRES:
            for slug, (discipline, expected_prefix) in DISCIPLINES.items():
                path = BASE / serie / f'{bimestre}-bimestre' / f'{slug}.json'
                data = json.loads(path.read_text(encoding='utf-8'))
                activities = data.get('atividades') or []
                stats['collections'] += 1
                stats['activities'] += len(activities)
                q_counter = Counter()
                a_counter = Counter()

                ids = set()
                for activity in activities:
                    aid = activity.get('id') or 'sem-id'
                    if aid in ids:
                        add_issue(blockers, path.relative_to(ROOT), aid, 'id', 'ID de atividade duplicado')
                    ids.add(aid)

                    bncc = activity.get('bncc') or []
                    codes = [item.get('codigo') for item in bncc if isinstance(item, dict) and item.get('codigo')]
                    if len(codes) != len(set(codes)):
                        add_issue(blockers, path.relative_to(ROOT), aid, 'bncc', 'mesmo código BNCC repetido dentro da atividade', ', '.join(codes))
                    if not codes:
                        add_issue(blockers, path.relative_to(ROOT), aid, 'bncc', 'atividade sem código BNCC')
                    for code in codes:
                        code_usage[code] += 1
                        code_by_collection[(serie, bimestre, discipline)][code] += 1
                        if not CODE_RE.fullmatch(code):
                            add_issue(blockers, path.relative_to(ROOT), aid, 'bncc', 'formato de código BNCC inválido', code)
                            continue
                        actual_prefix = re.match(r'EM13([A-Z]+)', code).group(1)
                        if actual_prefix != expected_prefix:
                            add_issue(blockers, path.relative_to(ROOT), aid, 'bncc', f'código BNCC incompatível com {discipline}', code)

                    for field, text in all_text_fields(activity):
                        for pattern, label in BAD_TEXT:
                            if pattern.search(str(text or '')):
                                add_issue(blockers, path.relative_to(ROOT), aid, field, label, str(text))

                    questions = activity.get('questoes') or []
                    answers = activity.get('gabarito') or []
                    if len(questions) != 8 or len(answers) != 8:
                        add_issue(blockers, path.relative_to(ROOT), aid, 'estrutura', 'atividade não possui exatamente 8 perguntas e 8 respostas')
                        continue

                    context = ' '.join([
                        str(activity.get('titulo') or ''), str(activity.get('tema') or ''),
                        str((activity.get('textoApoio') or {}).get('conteudo') or '')
                    ])
                    context_words = words(context)

                    for i, (q, a) in enumerate(zip(questions, answers), 1):
                        qtext = str(q.get('enunciado') or '').strip()
                        atext = str(a.get('resposta') or '').strip()
                        stats['questions'] += 1
                        stats['answers'] += 1
                        q_counter[norm(qtext)] += 1
                        a_counter[norm(atext)] += 1
                        if len(qtext) < 25:
                            add_issue(blockers, path.relative_to(ROOT), aid, f'questao.{i}', 'pergunta curta demais para ser pedagogicamente clara', qtext)
                        if len(atext) < 35:
                            add_issue(blockers, path.relative_to(ROOT), aid, f'gabarito.{i}', 'resposta curta demais para orientar correção', atext)
                        if any(p.search(atext) for p in GENERIC_ANSWERS):
                            add_issue(warnings, path.relative_to(ROOT), aid, f'gabarito.{i}', 'gabarito com formulação possivelmente genérica', atext)
                        if CODE_RE.search(qtext):
                            add_issue(blockers, path.relative_to(ROOT), aid, f'questao.{i}', 'código BNCC exposto na pergunta do aluno', qtext)
                        q_words = words(qtext)
                        if i <= 6 and len(q_words) >= 4 and context_words and len(q_words & context_words) == 0:
                            add_issue(warnings, path.relative_to(ROOT), aid, f'questao.{i}', 'pergunta sem conexão lexical evidente com título/tema/texto de apoio', qtext)
                        a_words = words(atext)
                        if i <= 6 and len(a_words) >= 4 and not ((a_words & q_words) or (a_words & context_words)):
                            add_issue(warnings, path.relative_to(ROOT), aid, f'gabarito.{i}', 'resposta sem conexão lexical evidente com pergunta/contexto', atext)

                for text, count in q_counter.items():
                    if text and count >= 5:
                        repeated_questions.append((str(path.relative_to(ROOT)), count, text[:180]))
                for text, count in a_counter.items():
                    if text and count >= 5:
                        repeated_answers.append((str(path.relative_to(ROOT)), count, text[:180]))

    stats['bncc_codes_distinct'] = len(code_usage)
    stats['blockers'] = len(blockers)
    stats['warnings'] = len(warnings)
    stats['repeated_question_patterns'] = len(repeated_questions)
    stats['repeated_answer_patterns'] = len(repeated_answers)

    blocker_types = Counter(item[3] for item in blockers)
    warning_types = Counter(item[3] for item in warnings)

    lines = ['# Auditoria do Ensino Médio V2', '', '## Resumo', '']
    for key in ['collections','activities','questions','answers','bncc_codes_distinct','blockers','warnings','repeated_question_patterns','repeated_answer_patterns']:
        lines.append(f'- **{key}:** {stats[key]}')
    lines += ['', '## Tipos de bloqueadores', '']
    for message, count in blocker_types.most_common():
        lines.append(f'- **{count}** — {message}')
    lines += ['', '## Tipos de alertas', '']
    for message, count in warning_types.most_common():
        lines.append(f'- **{count}** — {message}')
    lines += ['', '## Uso de habilidades BNCC', '']
    for code, count in sorted(code_usage.items()):
        lines.append(f'- `{code}`: {count} atividades')
    lines += ['', '## Bloqueadores', '']
    if blockers:
        for path, aid, field, message, excerpt in blockers[:500]:
            lines.append(f'- `{path}` — `{aid}` — **{field}**: {message}. {excerpt}')
    else:
        lines.append('- Nenhum bloqueador detectado.')
    lines += ['', '## Alertas de coerência/gabarito', '']
    if warnings:
        for path, aid, field, message, excerpt in warnings[:500]:
            lines.append(f'- `{path}` — `{aid}` — **{field}**: {message}. {excerpt}')
    else:
        lines.append('- Nenhum alerta detectado.')
    lines += ['', '## Perguntas repetidas dentro da mesma coleção (5+ ocorrências)', '']
    if repeated_questions:
        for path, count, text in sorted(repeated_questions, key=lambda x: (-x[1], x[0]))[:300]:
            lines.append(f'- `{path}` — {count}x — {text}')
    else:
        lines.append('- Nenhuma repetição relevante detectada.')
    lines += ['', '## Respostas repetidas dentro da mesma coleção (5+ ocorrências)', '']
    if repeated_answers:
        for path, count, text in sorted(repeated_answers, key=lambda x: (-x[1], x[0]))[:300]:
            lines.append(f'- `{path}` — {count}x — {text}')
    else:
        lines.append('- Nenhuma repetição relevante detectada.')
    REPORT.write_text('\n'.join(lines) + '\n', encoding='utf-8')

    print(json.dumps(stats, ensure_ascii=False, indent=2))
    print('TIPOS DE BLOQUEADORES:')
    for message, count in blocker_types.most_common():
        print(f'  {count}: {message}')
    print('TIPOS DE ALERTAS:')
    for message, count in warning_types.most_common():
        print(f'  {count}: {message}')
    print('PRIMEIROS BLOQUEADORES:')
    for path, aid, field, message, excerpt in blockers[:80]:
        print(f'  {path} | {aid} | {field} | {message} | {excerpt}')
    print(f'Relatório: {REPORT.relative_to(ROOT)}')
    if blockers:
        raise SystemExit(1)

if __name__ == '__main__':
    main()
