#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "data" / "atividades" / "ensino-medio"
DISCIPLINES = ["lingua-portuguesa", "matematica", "ciencias", "historia", "geografia"]
SERIES = ["1-serie", "2-serie", "3-serie"]
CODE_RE = re.compile(r"\bEM13(?:LP\d{2}|MAT\d{3}|CNT\d{3}|CHS\d{3})\b")
SERIE_TERM_RE = re.compile(r"\s*[—-]\s*[123]ª\s+série,\s*[1234]º\s+bimestre\s*$", re.I)


def clean_space(value):
    return re.sub(r"\s+", " ", str(value or "")).strip()


def clean_theme(value):
    value = clean_space(value)
    return SERIE_TERM_RE.sub("", value).strip(" —-")


def clean_skill(value):
    value = clean_space(value)
    value = re.sub(r"^[\s\)\(\[\]:;,.\-–—]+", "", value)
    value = re.sub(r"\s+\d+\s*[\(\[]\s*$", "", value)
    value = re.sub(r"\s+[\(\[]\s*$", "", value)
    value = re.sub(r"\s+\d+\s*$", "", value)
    value = clean_space(value).strip(" ;")
    return value


def fix_punctuation(text):
    text = re.sub(r"\.{2,}", ".", text)
    text = text.replace("?.", "?").replace("!.", "!")
    text = text.replace(".”.", ".”").replace("?”.", "?”").replace("!.”", "!”")
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    return clean_space(text)


def replace_text(value, old_theme=None, new_theme=None):
    text = clean_space(value)
    text = text.replace("à a habilidade trabalhada", "à habilidade trabalhada")
    text = text.replace("à a habilidade", "à habilidade")
    text = text.replace("— a habilidade trabalhada", "")
    if old_theme and new_theme and old_theme != new_theme:
        text = text.replace(old_theme, new_theme)
    return fix_punctuation(text)


def clean_activity(activity):
    old_theme = clean_space(activity.get("tema"))
    new_theme = clean_theme(old_theme)
    activity["tema"] = fix_punctuation(new_theme)
    activity["titulo"] = replace_text(activity.get("titulo"), old_theme, new_theme)
    activity["objetivo"] = replace_text(activity.get("objetivo"), old_theme, new_theme)

    bncc = activity.get("bncc") or []
    if bncc and isinstance(bncc[0], dict):
        skill = clean_skill(bncc[0].get("habilidadeOficial"))
        bncc[0]["habilidadeOficial"] = skill
        code = bncc[0].get("codigo")
        if code:
            objective = activity["objetivo"]
            objective = re.sub(
                r"^Desenvolver\s+(?:a habilidade\s+)+(?:trabalhada\s+)?",
                f"Desenvolver a habilidade {code} ",
                objective,
                count=1,
                flags=re.I,
            )
            if not CODE_RE.search(objective):
                objective = f"Desenvolver a habilidade {code} por meio de análise, aplicação e argumentação sobre {new_theme.rstrip('.')} ."
            activity["objetivo"] = fix_punctuation(objective)
        first = re.search(r"[A-Za-zÀ-ÖØ-öø-ÿ]+", skill)
        if first:
            bncc[0]["verbo"] = first.group(0)

    apoio = activity.get("textoApoio")
    if isinstance(apoio, dict):
        apoio["titulo"] = replace_text(apoio.get("titulo"), old_theme, new_theme)
        apoio["conteudo"] = replace_text(apoio.get("conteudo"), old_theme, new_theme)
        content = apoio["conteudo"]
        content = re.sub(r"A habilidade mobilizada orienta o estudante a\s*[\)\(\s]*", "A habilidade mobilizada orienta o estudante a ", content)
        content = re.sub(r"\s+\d+\s*\(\.?$", ".", content)
        apoio["conteudo"] = fix_punctuation(content)

    for q in activity.get("questoes") or []:
        q["enunciado"] = replace_text(q.get("enunciado"), old_theme, new_theme)
    for a in activity.get("gabarito") or []:
        a["resposta"] = replace_text(a.get("resposta"), old_theme, new_theme)
        a["justificativa"] = replace_text(a.get("justificativa"), old_theme, new_theme)

    illustration = activity.get("ilustracao")
    if isinstance(illustration, dict):
        illustration["descricao"] = replace_text(illustration.get("descricao"), old_theme, new_theme)
        illustration["objetivoPedagogico"] = replace_text(illustration.get("objetivoPedagogico"), old_theme, new_theme)


def validate_activity(activity, path):
    problems = []
    aid = activity.get("id") or "sem-id"
    bncc = activity.get("bncc") or []
    skill = bncc[0].get("habilidadeOficial", "") if bncc and isinstance(bncc[0], dict) else ""
    if not skill or len(skill) < 30:
        problems.append(f"{path}: {aid}: habilidade oficial curta/ausente")
    if re.search(r"^\)|\d+\s*\($", skill):
        problems.append(f"{path}: {aid}: resíduo na habilidade oficial: {skill[:120]}")
    if len(activity.get("questoes") or []) != 8:
        problems.append(f"{path}: {aid}: não tem 8 questões")
    if len(activity.get("gabarito") or []) != 8:
        problems.append(f"{path}: {aid}: não tem 8 respostas")
    if SERIE_TERM_RE.search(activity.get("tema") or ""):
        problems.append(f"{path}: {aid}: tema ainda contém série/bimestre artificial")
    fields = [activity.get("objetivo", ""), (activity.get("textoApoio") or {}).get("conteudo", "")]
    fields += [q.get("enunciado", "") for q in activity.get("questoes") or []]
    fields += [a.get("resposta", "") for a in activity.get("gabarito") or []]
    if any(".." in str(field) for field in fields):
        problems.append(f"{path}: {aid}: pontuação duplicada")
    if "a habilidade a habilidade" in activity.get("objetivo", "").lower():
        problems.append(f"{path}: {aid}: objetivo duplicou expressão de habilidade")
    for q in activity.get("questoes") or []:
        if CODE_RE.search(q.get("enunciado") or ""):
            problems.append(f"{path}: {aid}: código BNCC exposto ao aluno")
    return problems


def main():
    total_collections = 0
    total_activities = 0
    problems = []
    for serie in SERIES:
        for bimestre in range(1, 5):
            for discipline in DISCIPLINES:
                path = BASE / serie / f"{bimestre}-bimestre" / f"{discipline}.json"
                data = json.loads(path.read_text(encoding="utf-8"))
                activities = data.get("atividades") or []
                if data.get("schemaVersion") != "2.0":
                    problems.append(f"{path}: schemaVersion != 2.0")
                if len(activities) != 50 or data.get("quantidadeAtividades") != 50:
                    problems.append(f"{path}: coleção não tem exatamente 50 atividades")
                for activity in activities:
                    clean_activity(activity)
                    problems.extend(validate_activity(activity, path.relative_to(ROOT)))
                path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                total_collections += 1
                total_activities += len(activities)

    if total_collections != 60 or total_activities != 3000:
        problems.append(f"contagem global incorreta: {total_collections} coleções / {total_activities} atividades")
    if problems:
        print("\n".join(problems[:200]), file=sys.stderr)
        print(f"Falhas editoriais: {len(problems)}", file=sys.stderr)
        raise SystemExit(1)
    print(f"Limpeza editorial concluída: {total_collections} coleções / {total_activities} atividades.")


if __name__ == "__main__":
    main()
