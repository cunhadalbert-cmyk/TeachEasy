(() => {
  'use strict';

  const BLUE = '#245B9B';
  const GREEN = '#4D8B63';
  const SKY = '#DDF2FF';
  const CREAM = '#FFF8E8';

  const clean = (value = '') => String(value).replace(/\s+/g, ' ').trim();
  const esc = (value = '') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const dataUrl = svg => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  function topicFrom(root) {
    return clean(root?.querySelector('.te-final-subtitle, .generated-material h2, .photo-preview-heading h3')?.textContent || 'atividade escolar');
  }

  function subjectFrom(root) {
    const title = clean(root?.querySelector('.te-final-title')?.textContent || '');
    if (title) return title.replace(/^ATIVIDADE DE\s+/i, '');
    return clean(document.querySelector('#ai-content-form [name="subject"]')?.value || 'Atividade Escolar');
  }

  function sceneSvg(subject, topic) {
    const key = `${subject} ${topic}`.toLowerCase();
    const math = /matem|número|adição|subtração|multiplica|divis|fraç|geometr/.test(key);
    const language = /portugu|língua|leitura|interpreta|texto|alfabet|ingl/.test(key);
    const science = /ciên|nature|mistura|planta|animal|ambiente|água|solo|corpo|sistema solar/.test(key);
    const geo = /geograf|mapa|região|paisagem|território|população/.test(key);
    const history = /hist|brasil colônia|fonte histórica|tempo histórico/.test(key);

    let board = `<rect x="428" y="82" width="270" height="150" rx="14" fill="#fff" stroke="${BLUE}" stroke-width="6"/>`;
    let objects = '';
    if (math) {
      board += `<g font-family="Arial" font-weight="700" fill="${BLUE}"><text x="470" y="142" font-size="44">1 000</text><text x="505" y="196" font-size="36">+ 250</text></g>`;
      objects = `<g transform="translate(445 270)"><rect width="210" height="92" rx="15" fill="#FFF4C7" stroke="#E6B43C" stroke-width="4"/><g fill="#E76F51"><circle cx="38" cy="34" r="17"/><circle cx="80" cy="34" r="17"/><circle cx="122" cy="34" r="17"/></g><g fill="#58A6E7"><circle cx="59" cy="67" r="17"/><circle cx="101" cy="67" r="17"/><circle cx="143" cy="67" r="17"/></g><rect x="167" y="23" width="14" height="52" rx="7" fill="${GREEN}"/></g>`;
    } else if (language) {
      board += `<g stroke="#9CB9D4" stroke-width="5"><path d="M460 124h205M460 159h180M460 194h215"/></g>`;
      objects = `<g transform="translate(455 270)"><path d="M0 10q88-25 176 0v102q-88-25-176 0z" fill="#fff" stroke="${BLUE}" stroke-width="5"/><path d="M88 4v112" stroke="${GREEN}" stroke-width="5"/><g stroke="#C4D5E5" stroke-width="4"><path d="M20 40h52M20 64h52M104 40h52M104 64h52"/></g></g>`;
    } else if (science) {
      board += `<circle cx="562" cy="155" r="52" fill="#7CCB8C" stroke="${GREEN}" stroke-width="5"/><path d="M562 105v100M512 155h100" stroke="#fff" stroke-width="4"/>`;
      objects = `<g transform="translate(470 270)"><rect x="25" y="48" width="55" height="70" rx="10" fill="#A9D8FF" stroke="${BLUE}" stroke-width="4"/><path d="M40 48V18h25v30" fill="none" stroke="${BLUE}" stroke-width="5"/><path d="M145 16c-50 65-25 118 15 118s65-53 15-118l-15-24z" fill="#7CCB8C" stroke="${GREEN}" stroke-width="5"/></g>`;
    } else if (geo) {
      board += `<circle cx="563" cy="157" r="66" fill="#7CCBFF" stroke="${BLUE}" stroke-width="5"/><path d="M530 115c32-20 64-10 72 12 8 23-14 37-7 54 9 20 39 12 49 31-21 18-48 29-79 29-38 0-72-18-93-46 19-16 42-24 58-41 13-14-7-22 0-39z" fill="#7BCB87"/>`;
      objects = `<g transform="translate(466 280)"><path d="M0 82l55-72 55 72 55-58 55 58" fill="none" stroke="${GREEN}" stroke-width="10" stroke-linecap="round"/><circle cx="55" cy="10" r="10" fill="#E76F51"/></g>`;
    } else if (history) {
      board += `<path d="M470 108h186l-18 98H488z" fill="#F4D9A0" stroke="#8D6A3D" stroke-width="5"/><g stroke="#8D6A3D" stroke-width="5"><path d="M500 137h125M500 165h125M500 193h92"/></g>`;
      objects = `<g transform="translate(494 280)"><circle cx="58" cy="52" r="50" fill="#E76F51"/><path d="M58 24v32l22 16" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/><rect x="130" y="12" width="62" height="86" rx="8" fill="#F5DFB6" stroke="#8D6A3D" stroke-width="4"/></g>`;
    } else {
      board += `<path d="M460 190c60-80 125-80 200 0" fill="none" stroke="${GREEN}" stroke-width="14" stroke-linecap="round"/><circle cx="560" cy="138" r="32" fill="#FFD35C"/>`;
      objects = `<g transform="translate(470 280)"><rect width="190" height="88" rx="18" fill="#DDEEFF"/><circle cx="48" cy="44" r="24" fill="#E76F51"/><circle cx="96" cy="44" r="24" fill="#FFD35C"/><circle cx="144" cy="44" r="24" fill="#7CCB8C"/></g>`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 500" role="img" aria-label="Ilustração pedagógica colorida sobre ${esc(topic)}">
      <rect width="760" height="500" rx="24" fill="${SKY}"/>
      <rect y="365" width="760" height="135" fill="#D9E9C9"/>
      <circle cx="85" cy="75" r="36" fill="#FFD35C" opacity=".9"/>
      <g fill="#fff" opacity=".92"><ellipse cx="185" cy="70" rx="58" ry="20"/><ellipse cx="230" cy="80" rx="48" ry="18"/></g>
      <g transform="translate(70 82)">
        <rect x="0" y="105" width="330" height="190" rx="18" fill="${CREAM}" stroke="${BLUE}" stroke-width="6"/>
        <polygon points="-20,112 165,8 350,112" fill="#E88755" stroke="#A85C3B" stroke-width="6"/>
        <rect x="130" y="165" width="80" height="130" rx="10" fill="#8DC8F2" stroke="${BLUE}" stroke-width="5"/>
        <rect x="35" y="160" width="62" height="58" fill="#D8EEFF" stroke="${BLUE}" stroke-width="5"/>
        <rect x="235" y="160" width="62" height="58" fill="#D8EEFF" stroke="${BLUE}" stroke-width="5"/>
        <rect x="116" y="80" width="98" height="42" rx="8" fill="#FFF4C7" stroke="#B98630" stroke-width="4"/><text x="165" y="108" text-anchor="middle" font-family="Arial" font-weight="700" font-size="22" fill="#6D5426">ESCOLA</text>
      </g>
      <g transform="translate(145 295)">
        <circle cx="0" cy="0" r="35" fill="#F4B183"/><path d="M-34-4q8-48 68 0v-19q-28-35-65-10z" fill="#5B372B"/><rect x="-32" y="34" width="64" height="90" rx="22" fill="#E76F51"/><path d="M-22 58l-48 44M22 58l48 44" stroke="#F4B183" stroke-width="16" stroke-linecap="round"/>
      </g>
      <g transform="translate(265 300)">
        <circle cx="0" cy="0" r="35" fill="#9B5F3F"/><path d="M-36-4q10-52 72 0v-18q-29-34-65-12z" fill="#33241E"/><rect x="-32" y="34" width="64" height="90" rx="22" fill="#7D7BEA"/><path d="M-22 58l-42 46M22 58l42 46" stroke="#9B5F3F" stroke-width="16" stroke-linecap="round"/>
      </g>
      <g transform="translate(365 294)">
        <circle cx="0" cy="0" r="35" fill="#F0B07B"/><path d="M-36-4q18-55 72 0v-18q-30-38-66-10z" fill="#B95732"/><rect x="-32" y="34" width="64" height="90" rx="22" fill="#58A6E7"/><path d="M-22 58l-40 42M22 58l40 42" stroke="#F0B07B" stroke-width="16" stroke-linecap="round"/>
      </g>
      ${board}${objects}
      <g transform="translate(690 315)"><rect x="-12" y="0" width="24" height="88" fill="#8B5A36"/><circle cy="-18" r="62" fill="#6DBD72"/><circle cx="-38" cy="4" r="38" fill="#79C77E"/><circle cx="35" cy="2" r="42" fill="#62B86A"/></g>
    </svg>`;
  }

  function replaceFallbacks(root = document) {
    root.querySelectorAll('.te-final-page').forEach(page => {
      const image = page.querySelector('.te-final-visual img');
      if (!image || image.dataset.teReferenceApplied === 'true') return;
      if (!/^data:image\/svg\+xml/i.test(image.src)) return;
      image.src = dataUrl(sceneSvg(subjectFrom(page), topicFrom(page)));
      image.dataset.teReferenceApplied = 'true';
      image.alt = `Ilustração pedagógica colorida sobre ${topicFrom(page)}`;
    });

    root.querySelectorAll('#ai-preview-document, #photo-preview-content').forEach(preview => {
      const figure = preview.querySelector('.generated-figure, .photo-generated-figure');
      const requested = document.querySelector('#ai-content-form [name="figures"]')?.checked || preview.id === 'photo-preview-content';
      if (!requested || figure?.querySelector('img')) return;
      const container = figure || document.createElement('figure');
      if (!figure) {
        container.className = preview.id === 'photo-preview-content' ? 'photo-generated-figure' : 'generated-figure';
        const target = preview.querySelector('.generated-material, .photo-preview-heading');
        target?.insertAdjacentElement('afterend', container);
      }
      container.innerHTML = `<img class="generated-illustration-image" src="${dataUrl(sceneSvg(subjectFrom(preview), topicFrom(preview)))}" alt="Ilustração pedagógica colorida sobre ${esc(topicFrom(preview))}">`;
    });
  }

  function moveBnccToAnswerKey(root = document) {
    const ai = root.querySelector('#ai-preview-document');
    if (!ai) return;
    const studentBncc = ai.querySelector('.generated-bncc');
    if (!studentBncc) return;
    const bnccText = clean(studentBncc.textContent).replace(/^BNCC:\s*/i, '');
    const answerKey = ai.querySelector('.generated-answer-key-page');
    studentBncc.remove();
    if (!answerKey || !bnccText || answerKey.querySelector('[data-reference-bncc]')) return;
    const block = document.createElement('div');
    block.dataset.referenceBncc = 'true';
    block.className = 'generated-bncc';
    block.innerHTML = `<strong>BNCC:</strong> ${esc(bnccText)}`;
    answerKey.appendChild(block);
  }

  function apply() {
    replaceFallbacks(document);
    moveBnccToAnswerKey(document);
  }

  const observer = new MutationObserver(apply);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, { once: true });
  else apply();
})();
