#!/usr/bin/env python3
import json
import os
import re
import sys
import urllib.request
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "data" / "atividades" / "ensino-medio"
DISCIPLINES = {
    "lingua-portuguesa": "Língua Portuguesa",
    "matematica": "Matemática",
    "ciencias": "Ciências",
    "historia": "História",
    "geografia": "Geografia",
}
SERIES = ["1-serie", "2-serie", "3-serie"]
BIMESTRES = [1, 2, 3, 4]
BNCC_URL = "https://cdn.mec.gov.br/basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal_site.pdf"
BNCC_PDF = Path(os.environ.get("BNCC_PDF", ROOT / ".cache" / "bncc.pdf"))
SOURCE_SHA256 = "ad623d7b33986a4e87e1441a4e675064cd30db3650b86a75caefa476e802272b"
CODE_RE = re.compile(r"\bEM13(?:LP\d{2}|MAT\d{3}|CNT\d{3}|CHS\d{3})\b")


def normalize_space(value):
    return re.sub(r"\s+", " ", str(value or "")).strip()


def strip_bncc_codes(text):
    return normalize_space(CODE_RE.sub("a habilidade trabalhada", str(text or "")))


def ensure_pdf():
    if BNCC_PDF.exists() and BNCC_PDF.stat().st_size > 1000000:
        return
    BNCC_PDF.parent.mkdir(parents=True, exist_ok=True)
    print(f"Baixando BNCC oficial: {BNCC_URL}")
    urllib.request.urlretrieve(BNCC_URL, BNCC_PDF)


def extract_bncc_skills():
    if PdfReader is None:
        raise RuntimeError("pypdf não está instalado")
    ensure_pdf()
    reader = PdfReader(str(BNCC_PDF))
    # A etapa do Ensino Médio começa por volta da página 461. Ler dali em diante
    # reduz falsos positivos oriundos do sumário e referências anteriores.
    pages = []
    for idx, page in enumerate(reader.pages):
        if idx < 455:
            continue
        text = page.extract_text() or ""
        if text:
            pages.append(text)
    raw = "\n".join(pages)
    raw = raw.replace("\u00ad", "").replace("￾", " ")
    raw = re.sub(r"[ \t]+", " ", raw)
    matches = list(CODE_RE.finditer(raw))
    mapping = {}
    for i, match in enumerate(matches):
        code = match.group(0)
        if code in mapping:
            continue
        end = matches[i + 1].start() if i + 1 < len(matches) else min(len(raw), match.end() + 2200)
        segment = raw[match.end():end]
        segment = re.sub(r"\n+", " ", segment)
        segment = normalize_space(segment)
        # Cortes conservadores para evitar engolir cabeçalhos de tabela/página.
        segment = re.split(r"\bCompetência específica\b|\bHABILIDADES\b|\bENSINO MÉDIO\b", segment, maxsplit=1, flags=re.I)[0]
        segment = normalize_space(segment)
        if len(segment) > 30:
            mapping[code] = segment
    return mapping


def code_from_activity(activity):
    bncc = activity.get("bncc") or []
    if isinstance(bncc, list):
        for item in bncc:
            if isinstance(item, dict):
                code = normalize_space(item.get("codigo"))
                if CODE_RE.fullmatch(code):
                    return code
            elif CODE_RE.fullmatch(normalize_space(item)):
                return normalize_space(item)
    elif isinstance(bncc, dict):
        code = normalize_space(bncc.get("codigo"))
        if CODE_RE.fullmatch(code):
            return code
    for key in ("objetivo", "tema", "textoApoio"):
        value = activity.get(key)
        if isinstance(value, dict):
            value = " ".join(str(v) for v in value.values())
        m = CODE_RE.search(str(value or ""))
        if m:
            return m.group(0)
    return None


def first_verb(skill):
    skill = normalize_space(skill)
    skill = re.sub(r"^[\(\[]?EM13(?:LP\d{2}|MAT\d{3}|CNT\d{3}|CHS\d{3})[\)\]]?\s*", "", skill)
    m = re.search(r"[A-Za-zÀ-ÖØ-öø-ÿ]+", skill)
    return m.group(0) if m else "Desenvolver"


def support_text(activity, discipline, serie_label, bimestre, official_skill):
    existing = activity.get("textoApoio") or {}
    if isinstance(existing, dict):
        title = normalize_space(existing.get("titulo"))
        content = normalize_space(existing.get("conteudo"))
    else:
        title = "Texto de apoio"
        content = normalize_space(existing)
    title = strip_bncc_codes(title)
    content = strip_bncc_codes(content)
    tema = strip_bncc_codes(activity.get("tema"))
    titulo = strip_bncc_codes(activity.get("titulo"))

    # Mantém material específico já existente quando há substância real.
    generic_markers = [
        "deve considerar", "adequada à habilidade", "habilidade bncc",
        "por meio da leitura, análise", "— 1ª série", "— 2ª série", "— 3ª série"
    ]
    generic = len(content) < 220 or any(marker in content.lower() for marker in generic_markers)
    if not generic:
        return {"titulo": title or titulo, "conteudo": content}

    context = {
        "Língua Portuguesa": (
            "Em uma situação de comunicação da escola e da comunidade, estudantes analisam textos de diferentes gêneros, "
            "observando autoria, finalidade, público, circulação, escolhas linguísticas e recursos multissemióticos. "
            "O trabalho exige localizar evidências, comparar pontos de vista e produzir uma resposta adequada ao gênero e ao contexto."
        ),
        "Matemática": (
            "Uma situação-problema reúne dados, relações entre grandezas, representações e decisões que podem ser modeladas matematicamente. "
            "Os estudantes devem identificar informações relevantes, escolher procedimentos, registrar cálculos, interpretar resultados e verificar se a resposta é coerente com o contexto."
        ),
        "Ciências": (
            "Uma investigação escolar parte de um fenômeno observável e combina hipótese, evidências, modelos explicativos e análise de dados. "
            "Os estudantes confrontam explicações, reconhecem limites das evidências e relacionam ciência, tecnologia, ambiente e sociedade antes de formular uma conclusão fundamentada."
        ),
        "História": (
            "A análise histórica parte de fontes, temporalidades, agentes sociais e relações de poder. Os estudantes comparam perspectivas, "
            "identificam permanências e mudanças e constroem interpretações que distinguem evidência, contexto e argumento, evitando anacronismos e generalizações."
        ),
        "Geografia": (
            "A situação geográfica envolve território, paisagem, redes, fluxos e diferentes escalas de análise. Os estudantes interpretam dados e representações espaciais, "
            "relacionam processos sociais e ambientais e avaliam consequências desiguais para grupos e lugares."
        ),
    }[discipline]
    skill_sentence = normalize_space(official_skill)
    return {
        "titulo": title or f"{titulo}: contexto e análise",
        "conteudo": f"{context} Nesta atividade, o foco temático é “{tema or titulo}”. A habilidade mobilizada orienta o estudante a {skill_sentence[:900].rstrip('.')}.",
    }


def make_extra_questions(discipline, title):
    title = strip_bncc_codes(title)
    if discipline == "Língua Portuguesa":
        return [
            (7, "producao", f"A partir de “{title}”, produza um parágrafo adequado ao gênero, ao público e à finalidade trabalhados, usando evidências do material de apoio.", "grande",
             "A produção deve respeitar gênero, público e finalidade, apresentar organização coerente e mobilizar ao menos uma evidência pertinente do material."),
            (8, "revisao", f"Revise sua resposta em “{title}” e registre duas alterações que melhorem clareza, coesão, precisão ou adequação ao contexto.", "grande",
             "A resposta deve indicar duas alterações efetivas e explicar como elas melhoram clareza, coesão, precisão ou adequação comunicativa."),
        ]
    if discipline == "Matemática":
        return [
            (7, "resolucao", f"Crie uma variação do problema de “{title}” alterando um dado relevante e resolva-a, registrando o procedimento utilizado.", "grande",
             "A variação deve manter coerência matemática, apresentar o novo dado, um procedimento válido e um resultado compatível com as condições propostas."),
            (8, "validacao", f"Em “{title}”, explique como você verificaria se o resultado obtido é razoável e compare dois caminhos possíveis de resolução.", "grande",
             "A resposta deve apresentar um critério de verificação e comparar dois procedimentos matematicamente válidos, indicando vantagens, limites ou diferenças."),
        ]
    if discipline == "Ciências":
        return [
            (7, "investigacao", f"Com base em “{title}”, proponha uma investigação simples: formule uma hipótese, indique uma evidência a coletar e explique como ela poderia apoiar ou contrariar a hipótese.", "grande",
             "A resposta deve conter hipótese verificável, evidência pertinente e relação lógica entre o resultado possível e a hipótese formulada."),
            (8, "avaliacao", f"Em “{title}”, avalie uma possível conclusão: que evidências seriam necessárias para aceitá-la e que limitação deveria ser considerada?", "grande",
             "A resposta deve citar evidências relevantes e reconhecer pelo menos uma limitação metodológica, de dados, de escala ou de interpretação."),
        ]
    if discipline == "História":
        return [
            (7, "fontes", f"Em “{title}”, indique duas fontes históricas que poderiam aprofundar a análise e explique que informação cada uma permitiria investigar.", "grande",
             "A resposta deve indicar duas fontes pertinentes e relacionar cada uma a uma pergunta histórica ou tipo de evidência que ela pode oferecer."),
            (8, "argumentacao", f"A partir de “{title}”, formule uma interpretação histórica em um parágrafo, articulando contexto, agentes sociais e pelo menos duas evidências.", "grande",
             "O parágrafo deve apresentar uma interpretação situada no tempo, considerar agentes sociais e sustentar o argumento com pelo menos duas evidências pertinentes."),
        ]
    return [
        (7, "escalas", f"Em “{title}”, explique como o processo estudado pode ser analisado em duas escalas geográficas diferentes e indique o que muda entre elas.", "grande",
         "A resposta deve comparar duas escalas pertinentes e explicar diferenças de agentes, intensidade, distribuição, causas ou consequências observadas."),
        (8, "proposta", f"Com base em “{title}”, proponha uma ação ou decisão territorial possível e justifique-a considerando efeitos sociais e ambientais.", "grande",
         "A proposta deve ser coerente com o problema estudado e apresentar justificativa que considere ao menos um efeito social e um efeito ambiental."),
    ]


def sanitize_existing_questions(activity):
    questions = activity.get("questoes") or []
    result = []
    for idx, q in enumerate(questions[:6], 1):
        if not isinstance(q, dict):
            q = {"enunciado": str(q)}
        result.append({
            "numero": idx,
            "tipo": normalize_space(q.get("tipo")) or "analise",
            "enunciado": strip_bncc_codes(q.get("enunciado")),
            "alternativas": q.get("alternativas") if isinstance(q.get("alternativas"), list) else [],
            "espacoResposta": normalize_space(q.get("espacoResposta")) or ("grande" if idx >= 5 else "medio"),
            "figuraId": q.get("figuraId"),
        })
    return result


def sanitize_existing_answers(activity):
    answers = activity.get("gabarito") or []
    result = []
    for idx, a in enumerate(answers[:6], 1):
        if not isinstance(a, dict):
            a = {"resposta": str(a)}
        result.append({
            "numero": idx,
            "resposta": strip_bncc_codes(a.get("resposta")) or "Resposta deve ser fundamentada no material de apoio e no procedimento solicitado.",
            "justificativa": strip_bncc_codes(a.get("justificativa")) or f"Critério de correção correspondente ao comando da questão {idx}.",
        })
    return result


def convert_activity(activity, discipline, serie_label, bimestre, skills):
    code = code_from_activity(activity)
    if not code:
        raise ValueError(f"atividade sem código BNCC: {activity.get('id')}")
    official = skills.get(code)
    if not official:
        raise ValueError(f"habilidade {code} não localizada no PDF oficial: {activity.get('id')}")
    official = normalize_space(official)
    title = strip_bncc_codes(activity.get("titulo")) or "Atividade"
    tema = strip_bncc_codes(activity.get("tema")) or title
    questions = sanitize_existing_questions(activity)
    answers = sanitize_existing_answers(activity)
    if len(questions) < 6 or len(answers) < 6:
        raise ValueError(f"atividade com menos de 6 questões/respostas legadas: {activity.get('id')}")
    for num, qtype, prompt, space, answer in make_extra_questions(discipline, title):
        questions.append({
            "numero": num,
            "tipo": qtype,
            "enunciado": prompt,
            "alternativas": [],
            "espacoResposta": space,
            "figuraId": None,
        })
        answers.append({
            "numero": num,
            "resposta": answer,
            "justificativa": f"Critério de correção correspondente ao comando da questão {num} e ao conteúdo trabalhado na atividade.",
        })

    objective = strip_bncc_codes(activity.get("objetivo"))
    if len(objective) < 45:
        objective = f"Desenvolver a habilidade {code} por meio de análise, aplicação e argumentação sobre {tema}."
    # O código pode aparecer nos metadados do professor, mas nunca no enunciado do aluno.
    support = support_text(activity, discipline, serie_label, bimestre, official)
    illustration = {
        "descricao": f"Cena pedagógica do elenco oficial TeachEasy interagindo ativamente com uma situação de {discipline} relacionada a “{tema}”, com elementos visuais úteis à compreensão e sem texto ilegível na imagem.",
        "objetivoPedagogico": f"Apoiar a compreensão de “{tema}” e oferecer pistas visuais coerentes com o conteúdo da {serie_label}.",
        "arquivo": None,
        "status": "producao-visual-pendente",
    }

    converted = dict(activity)
    converted.update({
        "titulo": title,
        "tema": tema,
        "dificuldade": "adequada-ensino-medio",
        "objetivo": objective,
        "bncc": [{
            "codigo": code,
            "habilidadeOficial": official,
            "verbo": first_verb(official),
            "fonte": BNCC_URL,
        }],
        "quantidadeQuestoes": 8,
        "questoes": questions,
        "gabarito": answers,
        "possuiGabarito": True,
        "instrucaoGeral": "Leia o material de apoio, responda às oito questões com clareza e fundamente suas conclusões nos dados, conceitos ou evidências apresentados.",
        "textoApoio": support,
        "bnccConferida": True,
        "padraoPedagogico": "teacheasy-v2",
        "ilustracao": illustration,
        "revisao": {
            "status": "revisao-pedagogica-humana-pendente",
            "bnccConferida": True,
            "conteudoConferido": False,
            "questoesConferidas": False,
            "gabaritoConferido": False,
            "ilustracaoConferida": False,
            "validacaoAutomatica": True,
            "fonteBncc": {
                "titulo": "Base Nacional Comum Curricular",
                "url": BNCC_URL,
                "sha256": SOURCE_SHA256,
            },
        },
    })
    return converted


def convert_collection(path, discipline_key, serie_num, bimestre, skills):
    data = json.loads(path.read_text(encoding="utf-8"))
    activities = data.get("atividades") or []
    if len(activities) != 50:
        raise ValueError(f"{path}: esperado 50 atividades, encontrado {len(activities)}")
    discipline = DISCIPLINES[discipline_key]
    serie_label = f"{serie_num}ª série"
    converted = [convert_activity(a, discipline, serie_label, bimestre, skills) for a in activities]
    ids = [a.get("id") for a in converted]
    if len(ids) != len(set(ids)):
        raise ValueError(f"{path}: IDs duplicados")
    data.update({
        "schemaVersion": "2.0",
        "colecao": re.sub(r"-v2$", "", normalize_space(data.get("colecao"))) + "-v2",
        "etapa": "Ensino Médio",
        "ano": serie_label,
        "bimestre": bimestre,
        "disciplina": discipline,
        "statusBimestre": "validacao-automatica-concluida-revisao-humana-pendente",
        "quantidadeAtividades": 50,
        "atividades": converted,
        "padraoPedagogico": "teacheasy-v2",
    })
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def validate_all():
    files = []
    errors = []
    for serie_num, serie in enumerate(SERIES, 1):
        for bimestre in BIMESTRES:
            for discipline_key in DISCIPLINES:
                path = BASE / serie / f"{bimestre}-bimestre" / f"{discipline_key}.json"
                files.append(path)
                if not path.exists():
                    errors.append(f"arquivo ausente: {path.relative_to(ROOT)}")
                    continue
                try:
                    data = json.loads(path.read_text(encoding="utf-8"))
                    if data.get("schemaVersion") != "2.0": errors.append(f"{path}: schemaVersion")
                    if data.get("quantidadeAtividades") != 50: errors.append(f"{path}: quantidadeAtividades")
                    acts = data.get("atividades") or []
                    if len(acts) != 50: errors.append(f"{path}: len atividades={len(acts)}")
                    for a in acts:
                        if a.get("padraoPedagogico") != "teacheasy-v2": errors.append(f"{path}: {a.get('id')} sem padrão V2")
                        if len(a.get("questoes") or []) != 8: errors.append(f"{path}: {a.get('id')} questões")
                        if len(a.get("gabarito") or []) != 8: errors.append(f"{path}: {a.get('id')} gabarito")
                        for q in a.get("questoes") or []:
                            if CODE_RE.search(str(q.get("enunciado") or "")):
                                errors.append(f"{path}: código BNCC exposto em pergunta de {a.get('id')}")
                        bncc = a.get("bncc") or []
                        if not bncc or not normalize_space(bncc[0].get("habilidadeOficial")):
                            errors.append(f"{path}: {a.get('id')} sem habilidade oficial")
                        if not a.get("ilustracao", {}).get("objetivoPedagogico"):
                            errors.append(f"{path}: {a.get('id')} sem ilustração V2")
                except Exception as exc:
                    errors.append(f"{path}: {exc}")
    if len(files) != 60:
        errors.append(f"esperado 60 coleções, obtido {len(files)}")
    if errors:
        print("\n".join(errors[:200]), file=sys.stderr)
        print(f"Falhas totais: {len(errors)}", file=sys.stderr)
        return False
    print("Validação Ensino Médio V2: 60 coleções, 3.000 atividades, 24.000 questões e 24.000 respostas.")
    return True


def main():
    skills = extract_bncc_skills()
    required_codes = set()
    for serie in SERIES:
        for bimestre in BIMESTRES:
            for discipline_key in DISCIPLINES:
                path = BASE / serie / f"{bimestre}-bimestre" / f"{discipline_key}.json"
                data = json.loads(path.read_text(encoding="utf-8"))
                for a in data.get("atividades") or []:
                    code = code_from_activity(a)
                    if code:
                        required_codes.add(code)
    missing = sorted(code for code in required_codes if code not in skills)
    if missing:
        raise SystemExit("Códigos não encontrados na BNCC oficial: " + ", ".join(missing))
    print(f"Habilidades oficiais localizadas no PDF: {len(required_codes)} códigos usados pelo Ensino Médio.")
    for serie_num, serie in enumerate(SERIES, 1):
        for bimestre in BIMESTRES:
            for discipline_key in DISCIPLINES:
                path = BASE / serie / f"{bimestre}-bimestre" / f"{discipline_key}.json"
                convert_collection(path, discipline_key, serie_num, bimestre, skills)
                print(f"OK {path.relative_to(ROOT)}")
    if not validate_all():
        raise SystemExit(1)


if __name__ == "__main__":
    main()
