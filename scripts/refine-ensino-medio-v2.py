#!/usr/bin/env python3
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'data' / 'atividades' / 'ensino-medio'
SERIES = ['1-serie', '2-serie', '3-serie']
BIMESTRES = [1, 2, 3, 4]
DISCIPLINES = {
    'lingua-portuguesa': 'Língua Portuguesa',
    'matematica': 'Matemática',
    'ciencias': 'Ciências',
    'historia': 'História',
    'geografia': 'Geografia',
}


def clean(text):
    text = re.sub(r'\s+', ' ', str(text or '')).strip()
    text = re.sub(r'\)\s*\.', '.', text)
    text = re.sub(r'\(\s*\.', '.', text)
    text = re.sub(r'\.{2,}', '.', text)
    text = re.sub(r'\ba habilidade\s+a habilidade\b', 'a habilidade', text, flags=re.I)
    text = re.sub(r'\b([A-Za-zÀ-ÖØ-öø-ÿ]+)\s+\1\b', r'\1', text, flags=re.I)
    return text.strip()


def short_theme(activity):
    theme = clean(activity.get('tema')) or clean(activity.get('titulo')) or 'o tema estudado'
    return theme.rstrip('. ')


def qset(discipline, title, theme, skill):
    # Cada enunciado incorpora título/tema para manter vínculo explícito com o material.
    if discipline == 'Língua Portuguesa':
        qs = [
            ('compreensao', f'Em “{title}”, qual é a ideia central relacionada a {theme} e que trecho do material de apoio sustenta essa leitura?'),
            ('contexto', f'Considerando {theme}, identifique o gênero ou situação comunicativa de “{title}” e explique como finalidade e público influenciam as escolhas de linguagem.'),
            ('analise', f'Em “{title}”, analise duas escolhas linguísticas ou multissemióticas ligadas a {theme} e explique os efeitos de sentido produzidos.'),
            ('comparacao', f'Compare dois pontos de vista ou modos de dizer presentes no estudo de {theme} em “{title}” e indique uma diferença relevante entre eles.'),
            ('argumentacao', f'Formule uma interpretação sobre {theme} em “{title}” e sustente-a com duas evidências do material de apoio.'),
            ('aplicacao', f'Reescreva uma ideia de “{title}” para outro público ou suporte, mantendo o foco em {theme}, e justifique duas adaptações realizadas.'),
            ('producao', f'Produza um parágrafo sobre {theme} a partir de “{title}”, adequado ao gênero, ao público e à finalidade trabalhados.'),
            ('revisao', f'Revise sua produção sobre {theme} em “{title}” e registre duas mudanças que melhorem clareza, coesão ou adequação comunicativa.'),
        ]
        ans = [
            f'A resposta deve indicar a ideia central de {theme} em “{title}” e citar uma evidência textual pertinente que a sustente.',
            f'O estudante deve identificar a situação comunicativa de “{title}” e relacionar finalidade, público e escolhas de linguagem ao tema {theme}.',
            f'A resposta deve explicar duas escolhas linguísticas ou multissemióticas de “{title}” e seus efeitos de sentido no tratamento de {theme}.',
            f'Espera-se comparação objetiva entre dois pontos de vista ou formas de expressão ligados a {theme}, com uma diferença explicitada e justificada.',
            f'A interpretação sobre {theme} deve ser coerente e sustentada por duas evidências específicas do material de “{title}”.',
            f'A reescrita deve conservar a ideia central de {theme} e apresentar duas adaptações coerentes com o novo público ou suporte.',
            f'O parágrafo deve desenvolver {theme} com organização, pertinência ao gênero e adequação ao público e à finalidade de “{title}”.',
            f'A resposta deve registrar duas revisões concretas na produção sobre {theme} e explicar como melhoram clareza, coesão ou adequação.',
        ]
    elif discipline == 'Matemática':
        qs = [
            ('compreensao', f'Em “{title}”, identifique os dados, as incógnitas e a relação matemática principal envolvida em {theme}.'),
            ('representacao', f'Represente a situação de {theme} em “{title}” por expressão, equação, tabela, gráfico ou esquema adequado e explique sua escolha.'),
            ('resolucao', f'Resolva o problema central de “{title}” relacionado a {theme}, apresentando as etapas do procedimento e o resultado com unidade quando necessário.'),
            ('verificacao', f'Verifique o resultado obtido em “{title}” para {theme} usando uma estratégia diferente ou uma estimativa e explique por que ele é plausível.'),
            ('interpretacao', f'Interprete o resultado de “{title}” no contexto de {theme} e explique o que ele significa para a situação apresentada.'),
            ('comparacao', f'Compare dois procedimentos possíveis para trabalhar {theme} em “{title}” e indique uma vantagem ou limitação de cada um.'),
            ('variacao', f'Crie uma variação de “{title}” sobre {theme}, alterando um dado relevante, e resolva a nova situação de forma completa.'),
            ('generalizacao', f'A partir de “{title}”, escreva uma regra, relação ou conclusão geral válida para o tipo de problema envolvendo {theme} e apresente um exemplo.'),
        ]
        ans = [
            f'A resposta deve listar corretamente os dados e incógnitas de “{title}” e explicitar a relação matemática central associada a {theme}.',
            f'A representação escolhida deve corresponder aos dados de “{title}”, modelar {theme} de forma consistente e vir acompanhada de explicação adequada.',
            f'O gabarito aceita procedimentos matematicamente válidos que conduzam a resultado coerente com “{title}” e com as condições de {theme}, com etapas registradas.',
            f'A verificação deve usar estimativa, substituição, cálculo inverso ou outro método válido e mostrar que o resultado de “{title}” é compatível com {theme}.',
            f'A interpretação deve traduzir o resultado matemático para o contexto de “{title}”, explicando seu significado em relação a {theme}.',
            f'A comparação deve apresentar dois métodos válidos para {theme}, destacando ao menos uma vantagem ou limitação de cada procedimento em “{title}”.',
            f'A nova situação deve manter coerência com {theme}, alterar um dado de “{title}” e trazer resolução completa e resultado compatível.',
            f'A generalização deve expressar uma relação matemática válida para {theme} e incluir um exemplo consistente derivado de “{title}”.',
        ]
    elif discipline == 'Ciências':
        qs = [
            ('fenomeno', f'Em “{title}”, descreva o fenômeno central associado a {theme} e identifique duas evidências observáveis mencionadas ou sugeridas no material.'),
            ('hipotese', f'Formule uma hipótese explicativa para {theme} a partir de “{title}” e indique um resultado que apoiaria essa hipótese.'),
            ('variaveis', f'Para investigar {theme} em “{title}”, indique uma variável a modificar, uma variável a observar e um fator que deveria ser controlado.'),
            ('dados', f'Explique que tipo de dado seria necessário para analisar {theme} em “{title}” e como esse dado poderia ser registrado ou comparado.'),
            ('modelo', f'Use um modelo científico pertinente para explicar {theme} em “{title}” e indique uma limitação desse modelo.'),
            ('cts', f'Relacione {theme} em “{title}” a uma consequência para tecnologia, ambiente, saúde ou sociedade e justifique a relação com evidências.'),
            ('investigacao', f'Proponha uma investigação simples sobre {theme} inspirada em “{title}”, indicando hipótese, procedimento, evidência esperada e critério de conclusão.'),
            ('avaliacao', f'Avalie uma conclusão possível sobre {theme} em “{title}”: que evidências seriam suficientes e que limitação precisaria ser considerada?'),
        ]
        ans = [
            f'A resposta deve caracterizar corretamente o fenômeno de {theme} em “{title}” e apontar duas evidências observáveis coerentes com o material.',
            f'A hipótese deve ser testável, relacionada a {theme} e acompanhada de um resultado observável que, em “{title}”, seria compatível com essa explicação.',
            f'Espera-se identificação coerente de variável independente, variável dependente e controle experimental aplicáveis ao estudo de {theme} em “{title}”.',
            f'O estudante deve indicar dados pertinentes a {theme}, como medidas, frequências, comparações ou registros, e explicar uma forma válida de organizá-los.',
            f'O modelo deve explicar aspectos relevantes de {theme} em “{title}” e a resposta deve reconhecer ao menos uma limitação de alcance ou simplificação.',
            f'A relação com tecnologia, ambiente, saúde ou sociedade deve ser causalmente plausível e sustentada por evidências ligadas a {theme} em “{title}”.',
            f'A investigação deve conter hipótese verificável, procedimento viável, evidência observável e critério de conclusão diretamente ligados a {theme}.',
            f'A avaliação deve indicar evidências adequadas para sustentar a conclusão sobre {theme} e reconhecer uma limitação de dados, método, escala ou interpretação.',
        ]
    elif discipline == 'História':
        qs = [
            ('contexto', f'Em “{title}”, situe {theme} no tempo e no espaço e identifique dois agentes sociais relevantes para o processo estudado.'),
            ('fontes', f'Indique duas fontes históricas úteis para investigar {theme} em “{title}” e explique que informação cada fonte poderia oferecer.'),
            ('causalidade', f'Explique duas causas e duas consequências relacionadas a {theme} em “{title}”, distinguindo fatores imediatos de processos de longa duração.'),
            ('comparacao', f'Compare duas perspectivas sobre {theme} em “{title}” e mostre como posição social, contexto ou interesse pode influenciar cada narrativa.'),
            ('mudancas', f'Identifique uma permanência e uma mudança no processo de {theme} abordado em “{title}” e justifique com evidências históricas.'),
            ('argumentacao', f'Construa uma explicação histórica para {theme} em “{title}”, articulando contexto, agentes, relações de poder e pelo menos duas evidências.'),
            ('critica-fontes', f'Escolha uma fonte possível para “{title}” e avalie sua utilidade e seus limites para compreender {theme}.'),
            ('sintese', f'Escreva uma síntese interpretativa sobre {theme} a partir de “{title}”, evitando anacronismos e relacionando o processo a seu contexto histórico.'),
        ]
        ans = [
            f'A resposta deve situar {theme} em período e espaço coerentes com “{title}” e identificar dois agentes sociais efetivamente relacionados ao processo.',
            f'As duas fontes devem ser pertinentes a {theme}; para cada uma, o estudante deve explicar que tipo de evidência ela permite obter em “{title}”.',
            f'A resposta deve apresentar causas e consequências de {theme}, distinguindo eventos imediatos de condições estruturais ou de longa duração.',
            f'A comparação deve reconhecer duas perspectivas sobre {theme} e explicar como contexto, posição social ou interesse influencia as narrativas analisadas.',
            f'A permanência e a mudança devem ser historicamente plausíveis e justificadas com evidências ligadas ao processo de {theme} em “{title}”.',
            f'A explicação deve articular {theme}, contexto, agentes sociais, relações de poder e duas evidências em um argumento historicamente coerente.',
            f'A avaliação deve apontar o que a fonte escolhida revela sobre {theme} e também seus limites de autoria, contexto, finalidade, alcance ou preservação.',
            f'A síntese deve interpretar {theme} em seu contexto, evitar anacronismos e apresentar relações coerentes entre processos, agentes e evidências de “{title}”.',
        ]
    else:
        qs = [
            ('localizacao', f'Em “{title}”, localize o processo de {theme} em uma escala geográfica adequada e identifique dois elementos espaciais relevantes.'),
            ('representacao', f'Indique um mapa, gráfico, tabela ou imagem útil para analisar {theme} em “{title}” e explique quais informações essa representação deveria mostrar.'),
            ('processos', f'Explique dois processos que ajudam a compreender {theme} em “{title}” e mostre como eles se relacionam no espaço geográfico.'),
            ('escalas', f'Compare {theme} em “{title}” em duas escalas geográficas diferentes e indique o que muda entre elas.'),
            ('desigualdades', f'Analise como {theme} em “{title}” pode produzir efeitos diferentes entre grupos sociais ou lugares e apresente uma evidência ou exemplo.'),
            ('redes', f'Explique como fluxos, redes, território ou paisagem ajudam a interpretar {theme} em “{title}”.'),
            ('decisao', f'Proponha uma ação territorial relacionada a {theme} em “{title}” e justifique-a considerando efeitos sociais e ambientais.'),
            ('sintese', f'Elabore uma síntese geográfica de “{title}” relacionando {theme} a localização, escala, agentes e consequências espaciais.'),
        ]
        ans = [
            f'A resposta deve situar {theme} em escala coerente com “{title}” e identificar dois elementos espaciais pertinentes, como território, rede, paisagem, fluxo ou distribuição.',
            f'A representação proposta deve ser adequada a {theme} e indicar informações espaciais relevantes, como localização, distribuição, intensidade, comparação ou evolução.',
            f'Os dois processos devem ser geograficamente pertinentes a {theme} e a resposta deve explicar sua relação espacial no contexto de “{title}”.',
            f'A comparação deve usar duas escalas adequadas e mostrar diferenças de intensidade, agentes, distribuição, causas ou consequências de {theme}.',
            f'A análise deve mostrar efeitos desiguais de {theme} entre grupos ou lugares e apresentar exemplo ou evidência coerente com “{title}”.',
            f'A resposta deve usar corretamente ao menos um conceito de fluxos, redes, território ou paisagem para explicar {theme} no contexto de “{title}”.',
            f'A ação territorial deve ser viável, relacionada a {theme} e justificada por efeitos sociais e ambientais relevantes para “{title}”.',
            f'A síntese deve articular {theme}, localização, escala, agentes e consequências espaciais em uma interpretação coerente de “{title}”.',
        ]
    return qs, ans


def refine_activity(activity, discipline):
    title = clean(activity.get('titulo')) or 'Atividade'
    theme = short_theme(activity)
    bncc = activity.get('bncc') or []
    skill = clean(bncc[0].get('habilidadeOficial')) if bncc and isinstance(bncc[0], dict) else ''

    # Limpeza de todos os campos textuais principais.
    activity['titulo'] = title
    activity['tema'] = clean(activity.get('tema'))
    activity['objetivo'] = clean(activity.get('objetivo'))
    apoio = activity.get('textoApoio') or {}
    if isinstance(apoio, dict):
        apoio['titulo'] = clean(apoio.get('titulo'))
        apoio['conteudo'] = clean(apoio.get('conteudo'))

    qs, ans = qset(discipline, title, theme, skill)
    activity['questoes'] = []
    activity['gabarito'] = []
    for i, ((qtype, prompt), answer) in enumerate(zip(qs, ans), 1):
        activity['questoes'].append({
            'numero': i,
            'tipo': qtype,
            'enunciado': clean(prompt),
            'alternativas': [],
            'espacoResposta': 'grande' if i >= 5 else 'medio',
            'figuraId': None,
        })
        activity['gabarito'].append({
            'numero': i,
            'resposta': clean(answer),
            'justificativa': clean(f'Critério de correção da questão {i} de “{title}”: a resposta deve permanecer coerente com {theme} e com o material de apoio.'),
        })
    activity['quantidadeQuestoes'] = 8


def main():
    collections = activities = 0
    for serie in SERIES:
        for bimestre in BIMESTRES:
            for slug, discipline in DISCIPLINES.items():
                path = BASE / serie / f'{bimestre}-bimestre' / f'{slug}.json'
                data = json.loads(path.read_text(encoding='utf-8'))
                for activity in data.get('atividades') or []:
                    refine_activity(activity, discipline)
                    activities += 1
                path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
                collections += 1
    print(f'Refinamento pedagógico concluído: {collections} coleções / {activities} atividades.')


if __name__ == '__main__':
    main()
