(() => {
  'use strict';

  const { parties } = window.senateData;
  const model = window.senateModel;
  const { partyIds, axes, axisLabels, constituencies, socialClasses, laws, policies, bureaus, crises, sum } = model;
  const saves = window.senateSaves;
  const byId = id => document.getElementById(id);
  const all = (root, query) => [...root.querySelectorAll(query)];
  const entries = Object.entries;
  const format = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }).format;
  const formatPercent = value => format(value) + '%';
  const signed = value => value > 0 ? '+' + format(value) : format(value);
  const html = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const labels = { yes: 'За', no: 'Против', abstain: 'Воздержались' };
  const statusText = { passed: 'Принят', rejected: 'Отклонён', second: 'Направлен на второе чтение' };
  const screen = byId('screen');
  const notice = byId('notice');
  let archive;
  let storageReadable = true;
  let selectedBill = null;
  let partyFilter = '';
  let campaignDraft = {};
  try {
    archive = saves.read(localStorage);
  } catch {
    storageReadable = false;
    archive = saves.create();
  }
  let state = archive.active.state;
  let storageAvailable = persist();

  function persist() {
    try {
      if (storageReadable) {
        saves.write(localStorage, archive);
        return true;
      }
    } catch {
      // The in-memory session and file export are still available.
    }
    return false;
  }

  function showNotice(message) {
    notice.textContent = message;
    notice.hidden = false;
  }

  function announceSave(message) {
    storageAvailable = persist();
    showNotice(storageAvailable ? message : message + ' Изменения доступны до закрытия страницы. Скачайте файл для копии.');
    render();
  }

  function save(message, newConvocation = false) {
    saves.commit(archive, state, newConvocation);
    announceSave(message);
  }

  function useActiveSave(message) {
    state = archive.active.state;
    selectedBill = null;
    partyFilter = '';
    campaignDraft = {};
    announceSave(message);
  }

  function downloadSave() {
    const contents = new Blob([saves.exportState(state)], { type: 'application/json' });
    const url = URL.createObjectURL(contents);
    const link = document.createElement('a');
    link.href = url;
    link.download = `senate-save-${state.convocation}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function loadSaveFile(event) {
    const input = event.target;
    const [file] = input.files;
    input.value = '';
    if (!file) return;
    let imported;
    try {
      imported = saves.importState(await file.text());
    } catch {
      showNotice('Не удалось открыть файл. Выберите JSON-сохранение этой версии игры.');
      return;
    }
    if (window.confirm(`Загрузить созыв № ${imported.convocation} из файла? Текущая игра будет заменена.`)) {
      saves.start(archive, imported);
      useActiveSave('Игра загружена из файла.');
    }
  }

  const dot = id => `<span class="party-dot" style="--party:${parties[id].color}" aria-hidden="true"></span>`;
  const party = id => dot(id) + html(parties[id].name);
  const options = ids => ids.map(id => `<option value="${id}">${html(parties[id].name)}</option>`).join('');
  const signs = value => value ? (value > 0 ? '+' : '−').repeat(Math.abs(value)) : '0';
  const scaleLabel = value => Math.abs(value) > 6 ? signed(value) : signs(value);
  const signClass = value => value > 0 ? 'yes' : value < 0 ? 'no' : '';
  const readout = (effects, number = false) => entries(effects).filter(([, value]) => value).map(([id, value]) =>
    `<span class="chip">${axisLabels[id] ?? 'По всей Республике'} <strong class="${signClass(value)}">${number ? signed(value) : scaleLabel(value)}</strong></span>`).join('');
  const effectsReadout = effects => readout(effects) || '<span class="muted">Без изменений показателей</span>';
  const changesReadout = changes => effectsReadout(Object.fromEntries(entries(changes).map(([id, { before, after }]) => [id, after - before])));
  const total = () => sum(Object.values(state.seats));
  const heading = (title, text) => `<div class="page-title"><h2>${title}</h2><p>${text}</p></div>`;
  const fullPolicy = policy => policy.balance
    ? '<span class="chip">Бюджет к нулю и благосостояние: по текущему балансу</span>'
    : effectsReadout(Object.fromEntries(entries(policy.effects).map(([key, value]) => [key, value * 2])));

  function metrics() {
    byId('session').innerHTML = `<span>СОЗЫВ</span><b>${state.convocation}</b>`;
    const metrics = ['budget', 'army', 'authority', 'welfare', 'autonomy'];
    byId('indicators').innerHTML = metrics.map(id => {
      const value = state.indicators[id];
      return `<article class="metric"><span>${axisLabels[id]}</span>
        <strong class="${signClass(value)}">${scaleLabel(value)}</strong></article>`;
    }).join('');
  }

  function renderBoard() {
    const titles = { republic: 'Республика', sector: 'Секторы', audience: 'Группы населения' };
    screen.innerHTML = heading('Показатели Республики',
      'Отсчёт от начала игры. Знак показывает рост или снижение самого показателя.') +
      `<div class="board-grid">${entries(axes).map(([group, list]) =>
        `<section class="panel"><h3>${titles[group]}</h3>
          <dl class="axis-list">${entries(list).map(([id, label]) => {
            const value = state.indicators[id];
            return `<div><dt>${label}</dt><dd class="${signClass(value)}">${scaleLabel(value)}</dd></div>`;
          }).join('')}</dl></section>`).join('')}</div>`;
  }

  function drawChamber() {
    const canvas = byId('chamber');
    const ctx = canvas.getContext('2d');
    const rows = 14;
    const radii = Array.from({ length: rows }, (_, i) => 83 + i * 13.3);
    const rowTotal = sum(radii);
    const cumulative = radii.map((_, i) => Math.round(sum(radii.slice(0, i + 1)) / rowTotal * total()));
    const points = radii.flatMap((radius, i) => {
      const count = cumulative[i] - (cumulative[i - 1] ?? 0);
      return Array.from({ length: count }, (_, j) => ({ radius, angle: Math.PI - Math.PI * (j + .5) / count }));
    }).sort((a, b) => b.angle - a.angle);
    let position = 0;
    for (const id of partyIds) {
      ctx.fillStyle = parties[id].color;
      for (let i = 0; i < state.seats[id]; i++) {
        const { radius, angle } = points[position++];
        ctx.beginPath();
        ctx.arc((300 + Math.cos(angle) * radius) * 2, (280 - Math.sin(angle) * radius) * 2, 6, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }

  function chamber() {
    return `<section class="panel chamber-panel">
      <div class="panel-head"><div><h3>Места в Сенате</h3><p>Созыв № ${state.convocation}</p></div>
      <span class="tag">${Math.floor(total() * 2 / 3) + 1} голосов для принятия</span></div>
      <div class="chamber"><canvas id="chamber" width="1200" height="580" aria-label="Распределение мандатов полукругом"></canvas>
      <div class="chamber-total"><strong>${format(total())}</strong><span>МАНДАТОВ</span></div></div>
      <ul class="legend">${partyIds.map(id =>
        `<li><span>${party(id)}</span><b>${state.seats[id]}</b></li>`).join('')}</ul>
    </section>`;
  }

  function billSearch(law) {
    return `<section class="panel law-search" aria-label="Поиск законопроекта">
      <label>Партия<select id="party-filter"><option value="">Все партии</option>${options(partyIds)}</select></label>
      <div class="law-completion"><label>Название законопроекта
        <input id="law-query" type="text" value="${html(law?.name ?? '')}" autocomplete="off"
          role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="law-suggestions"
          placeholder="Начните вводить название"></label>
        <ul id="law-suggestions" class="law-suggestions" role="listbox" aria-label="Найденные законопроекты" hidden></ul>
        <p id="law-search-status" class="muted" role="status" hidden></p>
      </div>
    </section>`;
  }

  function setupBillSearch(openLaw) {
    const filter = byId('party-filter');
    const input = byId('law-query');
    const list = byId('law-suggestions');
    const hint = byId('law-search-status');
    let matches = [];
    let active = -1;
    filter.value = partyFilter;
    const normalize = value => value.toLocaleLowerCase('ru').replaceAll('ё', 'е').trim();
    function close() {
      list.hidden = true;
      hint.hidden = true;
      active = -1;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
    }
    function suggest() {
      const query = normalize(input.value);
      const words = query.split(/\s+/).filter(Boolean);
      matches = laws.filter(law => {
        const status = state.bills[law.id];
        return (!partyFilter || law.author === partyFilter) && status !== 'passed' && status !== 'rejected' &&
          words.every(word => normalize(law.name).includes(word));
      }).sort((a, b) => Number(normalize(b.name).startsWith(query)) - Number(normalize(a.name).startsWith(query)));
      active = -1;
      input.removeAttribute('aria-activedescendant');
      list.innerHTML = matches.map((law, index) => `<li id="law-match-${index}" role="option" aria-selected="false" data-law="${law.id}">
        <strong>${html(law.name)}</strong><small>${party(law.author)} · ${state.bills[law.id] === 'second' ? 'II' : 'I'} чтение</small>
      </li>`).join('');
      list.hidden = matches.length === 0;
      hint.hidden = !list.hidden;
      hint.textContent = list.hidden ? 'В повестке нет подходящих законопроектов.' : '';
      input.setAttribute('aria-expanded', String(!list.hidden));
    }
    filter.addEventListener('change', () => {
      partyFilter = filter.value;
      input.value = '';
      input.focus();
      suggest();
    });
    input.addEventListener('input', suggest);
    input.addEventListener('focus', () => {
      input.select();
      suggest();
    });
    input.addEventListener('blur', close);
    list.addEventListener('pointerdown', event => event.preventDefault());
    list.addEventListener('click', event => {
      const option = event.target.closest('[data-law]');
      if (option) openLaw(option.dataset.law);
    });
    input.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        close();
      } else if (event.key === 'Enter' && !list.hidden) {
        event.preventDefault();
        openLaw(matches[Math.max(0, active)].id);
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (list.hidden) suggest();
        if (!matches.length) return;
        const step = event.key === 'ArrowDown' ? 1 : -1;
        active = active < 0 && step < 0 ? matches.length - 1 : (active + step + matches.length) % matches.length;
        const option = list.children[active];
        for (const item of list.children) item.setAttribute('aria-selected', String(item === option));
        input.setAttribute('aria-activedescendant', option.id);
        option.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  const flagLabels = { yes: 'За', no: 'Против', abstain: 'Воздержалась' };
  const flagCycle = { abstain: 'yes', yes: 'no', no: 'abstain' };

  function updateFlag(button, position) {
    const id = button.dataset.party;
    button.dataset.position = position;
    button.querySelector('.flag-position').textContent = flagLabels[position];
    button.setAttribute('aria-label', `${parties[id].name}. ${flagLabels[position]}. Следующий голос: ${flagLabels[flagCycle[position]]}`);
  }

  function voteForm(law) {
    const reading = state.bills[law.id] === 'second' ? 2 : 1;
    return `<form id="vote-form" class="panel" data-law-id="${law.id}">
      <div class="panel-head"><div><h3 id="current-bill" tabindex="-1">${html(law.name)}</h3>
      <p>${party(law.author)} · ${reading === 1 ? 'Первое' : 'Второе'} чтение</p></div></div>
      <div class="stack">
        <p class="bill-summary">${html(law.description)}</p>
        <div class="chips">${effectsReadout(law.effects)}</div>
        <details id="ballot" open><summary>Голоса партий</summary>
          <p class="muted">Нажатие меняет позицию по кругу: воздержалась, за, против.</p>
          <div class="vote-list flag-list">${partyIds.map(id =>
            `<button type="button" class="vote-flag" data-party="${id}" data-position="abstain">
              <span class="flag-banner" style="--party:${parties[id].color}" aria-hidden="true">${id === 'СГ' ? 'Г' : id}</span>
              <span class="flag-party">${html(parties[id].name)}</span>
              <span class="flag-seats">${state.seats[id]}</span>
              <strong class="flag-position">${flagLabels.abstain}</strong>
            </button>`).join('')}</div>
        </details>
        <div class="tally" id="tally" aria-live="polite"></div>
        ${reading === 2 ? '<p class="muted">Во втором чтении у каждой партии должен быть голос за или против.</p>' : ''}
        <button class="primary" type="submit">Зафиксировать голосование</button>
      </div>
    </form>`;
  }

  function renderSenate() {
    const law = laws.find(item => item.id === selectedBill);
    const title = heading('Зал Сената', 'Найдите законопроект и отметьте позиции партий на голосовании.');
    const noVote = '<section class="panel empty">Выберите законопроект из подсказок, чтобы открыть голосование.</section>';
    if (state.snapElection) {
      screen.innerHTML = title + '<div class="notice">Назначены досрочные выборы. Перейдите к избирательной кампании.</div>' + chamber();
      drawChamber();
      return;
    }
    screen.innerHTML = title + billSearch(law) + `<div class="split senate-layout">${chamber()}${law ? voteForm(law) : noVote}</div>`;
    drawChamber();
    function openLaw(id) {
      if (selectedBill !== id) {
        selectedBill = id;
        notice.hidden = true;
        renderSenate();
      } else {
        byId('law-query').blur();
      }
      byId('current-bill').focus();
    }
    setupBillSearch(openLaw);
    if (!law) return;
    const form = byId('vote-form');
    const flags = all(form, '.vote-flag');
    const positions = () => Object.fromEntries(flags.map(flag => [flag.dataset.party, flag.dataset.position]));
    function updateTally() {
      const totals = model.tally(state.seats, positions());
      const secondReading = state.bills[law.id] === 'second';
      byId('tally').innerHTML = Object.keys(labels).map(key =>
        `<span class="${key}">${secondReading && key === 'abstain' ? 'Не определились' : labels[key]} <b>${totals[key]}</b></span>`).join('');
      form.querySelector('button[type="submit"]').disabled = secondReading && totals.abstain > 0;
    }
    for (const flag of flags) updateFlag(flag, 'abstain');
    updateTally();
    byId('ballot').addEventListener('click', event => {
      const flag = event.target.closest('.vote-flag');
      if (!flag) return;
      updateFlag(flag, flagCycle[flag.dataset.position]);
      updateTally();
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      const result = model.recordVote(state, law, positions());
      if (!result) return;
      selectedBill = null;
      save(`«${law.name}» · ${statusText[result]}.`);
    });
  }

  function memberChecks(members, name) {
    return `<div class="party-checks">${members.map(id =>
      `<label><input type="checkbox" name="${name}" value="${id}"><span>${party(id)}</span><b>${state.seats[id]}</b></label>`).join('')}</div>`;
  }

  function policyCatalog() {
    return `<details class="panel catalog"><summary>Каталог политик всех партий</summary>
      <div class="table-wrap"><table class="catalog-table"><thead><tr><th scope="col">Бюро</th><th scope="col">Партия</th>
      <th scope="col">Политика</th><th scope="col">Эффекты на полной силе</th></tr></thead>
      <tbody>${[...policies].sort((a, b) => a.bureau - b.bureau).map(policy => `<tr><th scope="row">${bureaus[policy.bureau]}</th>
        <td>${party(policy.author)}</td><td><details class="catalog-description"><summary>${html(policy.name)}</summary>
        <p>${html(policy.description)}</p><a href="${policy.source}" target="_blank" rel="noopener">Квента партии</a></details></td>
        <td><div class="chips">${fullPolicy(policy)}</div></td></tr>`).join('')}</tbody></table></div></details>`;
  }

  function renderBureaus() {
    const title = heading('Коалиция и Бюро', 'Отметьте участников коалиции и распределите Бюро. Одна партия даёт два знака на эффект, две партии дают по одному знаку каждая.');
    if (state.snapElection) {
      screen.innerHTML = title + '<div class="panel empty">Правительство распущено. Назначены досрочные выборы.</div>' + policyCatalog();
      return;
    }
    if (state.government) {
      const { members, policies: enacted, changes } = state.government;
      screen.innerHTML = title + `<div class="panel government-summary"><h3>Правящая коалиция</h3>
        <p>${members.map(id => html(parties[id].name)).join(', ')} · ${sum(members.map(id => state.seats[id]))} мандатов</p>
        <div class="chips">${changesReadout(changes)}</div>
        ${partyIds.some(id => !members.includes(id)) ?
          `<p class="muted">В оппозиции ${partyIds.filter(id => !members.includes(id)).map(id => html(parties[id].name)).join(', ')}</p>` : ''}
        </div><div class="card-grid">${bureaus.map((name, index) =>
          `<article class="panel"><h3>${name}</h3>${enacted[index].map(policy =>
            `<div class="policy-summary"><p>${party(policy.id)} · ${enacted[index].length === 2 ? '½ силы' : 'полная сила'}</p>
            <strong>${html(policy.name)}</strong><div class="chips">${effectsReadout(policy.effects)}</div></div>`).join('')}</article>`).join('')}</div>` + policyCatalog();
      return;
    }
    screen.innerHTML = title + `<form id="coalition">
      <section class="panel government-summary"><h3>Участники коалиции</h3>
        <p class="muted">Для формирования правительства нужно больше половины мест.</p>
        ${memberChecks(partyIds, 'member')}<p id="coalition-total" class="coalition-total">0 из ${total()} мандатов</p>
      </section>
      <div class="card-grid">${bureaus.map((name, index) => `<section class="panel bureau" data-bureau="${index}">
        <h3>${name}</h3>
        ${[0, 1].map(slot => `<div class="policy">
          <label>${slot ? 'Вторая партия' : 'Руководящая партия'}<select data-owner ${slot ? '' : 'required'}>
          <option value="">${slot ? 'Совместное управление не выбрано' : 'Выберите участников коалиции'}</option></select></label>
          <div class="policy-fields" hidden></div></div>`).join('')}
        </section>`).join('')}</div>
      <div class="actions"><button class="primary" type="submit">Утвердить коалицию и политику</button></div>
    </form>` + policyCatalog();
    const form = byId('coalition');
    const selectedMembers = () => all(form, '[name="member"]:checked').map(input => input.value);
    const policyFor = (select, bureau) => policies.find(item => item.bureau === Number(bureau.dataset.bureau) && item.author === select.value);
    function updateOwners() {
      const members = selectedMembers();
      const count = sum(members.map(id => state.seats[id]));
      byId('coalition-total').textContent = `${count} из ${total()} мандатов · ${count * 2 > total() ? 'большинство' : 'нужно ' + (Math.floor(total() / 2) + 1)}`;
      for (const bureau of all(form, '.bureau')) {
        const [first, second] = all(bureau, '[data-owner]');
        const available = members.filter(id => policies.some(item => item.bureau === Number(bureau.dataset.bureau) && item.author === id));
        function setOptions(select, allowed, placeholder) {
          const previous = select.value;
          select.innerHTML = `<option value="">${placeholder}</option>` + options(allowed);
          select.value = allowed.includes(previous) ? previous : '';
        }
        setOptions(first, available, 'Выберите партию');
        setOptions(second, available.filter(id => id !== first.value), 'Совместное управление не выбрано');
        for (const select of [first, second]) {
          const preview = select.closest('.policy').querySelector('.policy-fields');
          const policy = policyFor(select, bureau);
          preview.hidden = !policy;
          if (!policy) continue;
          const effects = policy.balance ? fullPolicy(policy) :
            second.value ? effectsReadout(policy.effects) : fullPolicy(policy);
          preview.innerHTML = `<strong>${html(policy.name)}</strong><p>${html(policy.description)}</p><div class="chips">${effects}</div>`;
        }
      }
    }
    form.addEventListener('change', event => {
      if (event.target.matches('[name="member"], [data-owner]')) updateOwners();
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      const distribution = all(form, '.bureau').map(bureau =>
        all(bureau, '[data-owner]').map(select => policyFor(select, bureau)).filter(Boolean));
      if (!model.acceptGovernment(state, selectedMembers(), distribution)) {
        notice.textContent = 'У коалиции должно быть больше половины мест.';
        notice.hidden = false;
        return;
      }
      save('Коалиция утверждена. Политика Бюро вступила в силу.');
    });
  }

  function renderCrisis() {
    const stage = crises[state.crisisStage];
    const title = heading('Кризисы', 'Зафиксируйте решения по текущему акту.');
    const resolved = new Map(state.crisisLog.filter(item => item.stage === state.crisisStage).map(item => [item.question, item]));
    const open = !state.snapElection && !resolved.size && stage.questions.some(question => question.options.length);
    const threshold = Math.ceil(total() * 2 / 3);
    const accession = resolved.get('accession');
    const summary = state.snapElection
      ? '<div class="notice">Правительство распущено. Перейдите к <a href="#campaign">досрочной кампании</a>.</div>'
      : '';
    screen.innerHTML = title + summary + `<section class="panel crisis-news">
      <h3>${html(stage.title)}</h3>
      <p class="lead">${html(stage.news ?? 'Для этой ветки в материалах пока есть только название.')}</p>
      ${stage.video ? `<a href="${stage.video}" target="_blank" rel="noopener">Видео новостей</a>` : ''}
    </section><form id="crisis-form">
      <div class="crisis-grid">${stage.questions.map(question => {
        const decision = resolved.get(question.id);
        return `<section class="panel crisis-question">
          <h3>${html(question.name)}</h3>
          ${question.options.length ? `<fieldset ${open ? '' : 'disabled'}><legend>Варианты решения</legend>
            <div class="choice-grid">${question.options.map(option => `<label class="choice">
              <input required type="radio" name="${question.id}" value="${option.id}" ${decision?.option === option.id ? 'checked' : ''}>
              <b>${html(option.name)}</b>
            </label>`).join('')}</div>
          </fieldset>` : '<p class="lead">В материале пока нет вариантов ответа.</p>'}
          ${question.id === 'accession' && open ? `<label id="senate-vote-field" hidden>Голосов Сената за переговоры
            <input id="senate-votes" type="number" min="0" max="${total()}" step="1" aria-describedby="senate-threshold" disabled>
            <span id="senate-threshold">Для начала переговоров нужно ${threshold} голосов.</span></label>` : ''}
          ${question.id === 'accession' && accession?.senateVotes !== undefined ? `<p class="lead">За переговоры ${accession.senateVotes} из ${total()}.
            ${accession.passed ? 'Переговоры одобрены.' : 'Порог голосов не достигнут.'}</p>` : ''}
        </section>`;
      }).join('')}</div>
      <div class="actions crisis-actions">
        ${state.snapElection ? '' : '<button class="danger" type="button" id="dissolve">Правительство распущено и назначены досрочные выборы</button>'}
        ${open ? '<button class="primary" type="submit">Зафиксировать решения</button>' : ''}
      </div>
    </form>`;
    const form = byId('crisis-form');
    const senateBallot = byId('senate-votes');
    if (senateBallot) {
      form.addEventListener('change', () => {
        const voteRequired = form.querySelector('[name="accession"]:checked')?.value === 'negotiate';
        byId('senate-vote-field').hidden = !voteRequired;
        senateBallot.disabled = !voteRequired;
        senateBallot.required = voteRequired;
      });
    }
    form.addEventListener('submit', event => {
      event.preventDefault();
      const decisions = Object.fromEntries(new FormData(form));
      if (model.resolveCrises(state, decisions, senateBallot?.valueAsNumber)) save('Решения по кризисам вступили в силу.');
    });
    byId('dissolve')?.addEventListener('click', () => {
      model.dissolveGovernment(state);
      save('Правительство распущено. Назначены досрочные выборы.');
    });
  }

  function renderCampaign() {
    const before = model.electionProjection(state).popularity;
    const groups = socialClasses.map(id => `<option value="${id}">${constituencies[id]}</option>`).join('');
    screen.innerHTML = heading(state.snapElection ? 'Досрочная кампания' : 'Кампания и выборы',
      'Внесите три тайных ответа каждой партии. Показанные доли учитывают законы, политику Бюро и кризисы этого созыва.') +
      `<form id="campaign-form" class="panel">
        <div class="table-wrap"><table class="campaign-table">
          <thead><tr><th scope="col">Партия</th><th scope="col">Кого винит</th><th scope="col">Основная группа</th>
            <th scope="col">Побочная группа</th><th scope="col">Поддержка</th><th scope="col">Мандаты</th></tr></thead>
          <tbody>${partyIds.map(id => `<tr data-campaign="${id}"><th scope="row">${party(id)}</th>
            <td><select required aria-label="Кого винит партия ${html(parties[id].name)}" data-answer="target"><option value="">Выбрать</option>
              <option value="none">Никого</option>${options(partyIds.filter(other => other !== id))}</select></td>
            <td><select required aria-label="Основная группа партии ${html(parties[id].name)}" data-answer="main"><option value="">Выбрать</option>${groups}</select></td>
            <td><select required aria-label="Побочная группа партии ${html(parties[id].name)}" data-answer="secondary"><option value="">Выбрать</option>${groups}</select></td>
            <td id="share-${id}"></td><td id="next-${id}"></td></tr>`).join('')}</tbody>
        </table></div>
        <p class="muted">Основная группа даёт +2 к рейтингу в группе, побочная +1. Каждое обвинение даёт цели −0,5 к рейтингу по всем группам. Доли и мандаты пересчитываются по мере ввода.</p>
        <label class="confirm"><input type="checkbox" required> Завершить текущий созыв и сформировать новый по итогам выборов</label>
        <div class="actions"><button class="primary">Зафиксировать итоги выборов</button></div>
      </form>`;
    const form = byId('campaign-form');
    for (const row of all(form, '[data-campaign]')) {
      for (const select of all(row, 'select')) {
        select.value = campaignDraft[row.dataset.campaign]?.[select.dataset.answer] ?? '';
      }
    }
    const answers = () => Object.fromEntries(all(form, '[data-campaign]').map(row => [
      row.dataset.campaign, Object.fromEntries(all(row, 'select').map(select => [
        select.dataset.answer, select.value === 'none' ? '' : select.value
      ]))
    ]));
    function updateProjection() {
      for (const row of all(form, '[data-campaign]')) {
        const main = row.querySelector('[data-answer="main"]').value;
        const secondary = row.querySelector('[data-answer="secondary"]');
        for (const option of secondary.options) option.disabled = option.value !== '' && option.value === main;
        if (main && main === secondary.value) secondary.value = '';
      }
      const projection = model.electionProjection(state, answers());
      for (const id of partyIds) {
        const share = projection.popularity[id];
        const delta = Math.round((share - before[id]) * 10) / 10;
        byId('share-' + id).textContent = `${formatPercent(share)} (${signed(delta)} п. п.)`;
        byId('next-' + id).textContent = `${projection.seats[id]} (${signed(projection.seats[id] - state.seats[id])})`;
      }
    }
    form.addEventListener('change', () => {
      updateProjection();
      campaignDraft = Object.fromEntries(all(form, '[data-campaign]').map(row => [
        row.dataset.campaign, Object.fromEntries(all(row, 'select').map(select => [select.dataset.answer, select.value]))
      ]));
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      model.finishElection(state, answers());
      campaignDraft = {};
      selectedBill = null;
      save(`Созыв № ${state.convocation} сформирован.`, true);
      location.hash = 'statistics';
    });
    updateProjection();
  }

  function electionBreakdown(name, groups, label) {
    return `<details class="panel report"><summary>${name}</summary>
      <div class="table-wrap"><table class="breakdown"><thead><tr><th scope="col">Разрез</th>
      ${partyIds.map(id => `<th scope="col" title="${html(parties[id].name)}">${dot(id)}${id === 'СГ' ? 'Гармония' : id}</th>`).join('')}</tr></thead>
      <tbody>${entries(groups).map(([group, values]) => `<tr><th scope="row">${label(group)}</th>
      ${partyIds.map(id => `<td>${formatPercent(values[id])}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div></details>`;
  }

  function renderStatistics() {
    const last = state.votes.at(-1);
    const election = state.lastElection;
    const current = model.electionProjection(state);
    const breakdown = election ?? current;
    const intro = heading('Статистика', 'Итоги последнего голосования и результаты выборов.');
    const count = last ? sum(Object.values(last.seats)) : 0;
    const vote = last ? `<section class="panel">
      <div class="panel-head"><div><h3>${html(last.name)}</h3>
        <p>Созыв № ${last.convocation} · ${last.reading === 1 ? 'I' : 'II'} чтение · ${html(parties[last.author].name)}</p></div>
        <span class="tag ${last.status}">${statusText[last.status]}</span>
      </div>
      <div class="results-bar" aria-hidden="true">${entries(last.totals).map(([key, value]) =>
        `<i class="${key}" style="width:${value / count * 100}%"></i>`).join('')}</div>
      <div class="tally">${entries(last.totals).map(([key, value]) =>
        `<span class="${key}">${labels[key]} <b>${value} · ${formatPercent(value / count * 100)}</b></span>`).join('')}</div>
      <h4>${last.status === 'passed' ? 'Применённые изменения' : 'Предложенные изменения'}</h4>
      <div class="chips">${last.status === 'passed' ? changesReadout(last.changes) : effectsReadout(last.proposed)}</div>
      <div class="table-wrap"><table><thead><tr><th scope="col">Партия</th><th scope="col">Мандаты</th><th scope="col">Позиция</th><th scope="col">Изменение рейтинга</th></tr></thead>
      <tbody>${entries(last.seats).map(([id, seats]) => `<tr><th scope="row">${party(id)}</th><td>${seats}</td>
        <td>${last.positions[id] === 'abstain' ? 'Воздержалась' : labels[last.positions[id]]}</td>
        <td><div class="chips">${readout(last.popularity[id] ?? {}, true) || '—'}</div></td></tr>`).join('')}</tbody>
      </table></div></section>` : '<div class="panel empty">После первого голосования здесь появятся итог и позиции партий.</div>';
    const electionReport = election ? `<section class="panel report"><h3>Выборы в созыв № ${election.convocation}</h3>
      <div class="table-wrap"><table><thead><tr><th scope="col">Партия</th><th scope="col">Поддержка</th><th scope="col">Мандаты</th><th scope="col">Изменение мест</th><th scope="col">Получено обвинений</th></tr></thead>
      <tbody>${partyIds.map(id => `<tr><th scope="row">${party(id)}</th><td>${formatPercent(election.popularity[id])}</td>
        <td>${election.seats[id]}</td><td>${signed(election.seats[id] - election.oldSeats[id])}</td><td>${election.blame[id]}</td></tr>`).join('')}</tbody>
      </table></div></section>` : '';
    const scope = election ? 'последних выборов' : 'до следующих выборов';
    screen.innerHTML = intro + vote + electionReport +
      electionBreakdown('Поддержка по секторам ' + scope, breakdown.bySector, label => html(label)) +
      electionBreakdown('Поддержка по классам ' + scope, breakdown.byClass, key => constituencies[key]);
  }

  function renderSaves() {
    const date = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short', timeStyle: 'short' });
    const details = entry => `Игра № ${entry.run} · созыв № ${entry.state.convocation} · ${date.format(entry.savedAt)}`;
    const active = archive.active;
    const intro = heading('Сохранения', `Текущая игра № ${active.run} · созыв № ${active.state.convocation}`);
    screen.innerHTML = intro + `<section class="panel save-panel">
      <h3>Текущая игра</h3>
      ${storageAvailable ? '' : '<p class="notice">Хранилище браузера недоступно. Скачайте файл сохранения.</p>'}
      <p class="muted">Скачайте файл, чтобы перенести эту партию в другой браузер или на другой компьютер.</p>
      <div class="save-toolbar">
        <button class="danger" type="button" id="new-game">Новая игра</button>
        <button class="quiet" type="button" id="download-save">Скачать сохранение</button>
        <button class="quiet" type="button" id="open-save">Загрузить файл</button>
        <input id="save-file" type="file" accept=".json,application/json" hidden>
      </div>
    </section>
    <section class="panel save-panel">
      <h3>Ручные сохранения</h3>
      <ol class="save-list">${archive.slots.map((entry, index) => `<li>
        <div><strong>Слот ${index + 1}</strong><span class="muted">${entry ? details(entry) : 'Пусто'}</span></div>
        <div class="save-row-actions"><button class="quiet" type="button" data-save-slot="${index}">Сохранить</button>
          ${entry ? `<button class="quiet" type="button" data-load-slot="${index}">Загрузить</button>` : ''}
        </div></li>`).join('')}</ol>
    </section>
    <section class="panel save-panel">
      <h3>Автосохранения</h3>
      <p class="muted">Снимок создаётся при открытии каждого созыва.</p>
      <ul class="save-list">${archive.autos.map((entry, index) => `<li>
        <div><strong>Созыв № ${entry.state.convocation}</strong>
          <span class="muted">Игра № ${entry.run} · ${date.format(entry.savedAt)}</span></div>
        <button class="quiet" type="button" data-load-auto="${index}">Загрузить</button>
      </li>`).join('')}</ul>
    </section>`;

    byId('new-game').addEventListener('click', () => {
      if (!window.confirm('Начать новую игру? Текущее состояние будет заменено. Слоты и автосохранения останутся доступны.')) return;
      saves.start(archive);
      useActiveSave('Новая игра началась. Можно перейти в зал Сената.');
    });
    byId('download-save').addEventListener('click', downloadSave);
    byId('open-save').addEventListener('click', () => byId('save-file').click());
    byId('save-file').addEventListener('change', loadSaveFile);
    for (const button of all(screen, '[data-save-slot]')) {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.saveSlot);
        if (archive.slots[index] && !window.confirm(`Перезаписать слот ${index + 1}?`)) return;
        saves.saveSlot(archive, index);
        announceSave(`Слот ${index + 1} обновлён.`);
      });
    }
    for (const button of all(screen, '[data-load-slot], [data-load-auto]')) {
      button.addEventListener('click', () => {
        const entry = button.dataset.loadSlot !== undefined
          ? archive.slots[Number(button.dataset.loadSlot)] : archive.autos[Number(button.dataset.loadAuto)];
        if (!window.confirm(`Загрузить сохранение? Текущая игра будет заменена.\n${details(entry)}`)) return;
        if (saves.restore(archive, entry)) useActiveSave('Сохранение загружено.');
        else showNotice('Не удалось открыть сохранение.');
      });
    }
  }

  const views = { senate: renderSenate, bureaus: renderBureaus, crisis: renderCrisis, campaign: renderCampaign, board: renderBoard, statistics: renderStatistics, saves: renderSaves };
  function render() {
    const hash = location.hash.slice(1);
    const page = Object.hasOwn(views, hash) ? hash : 'senate';
    for (const link of all(document, '.navigation a, .saves-link')) {
      if (link.hash === '#' + page) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    metrics();
    views[page]();
  }

  window.addEventListener('hashchange', () => {
    notice.hidden = true;
    render();
  });
  render();
})();
