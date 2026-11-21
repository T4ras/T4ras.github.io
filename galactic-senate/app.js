(() => {
  'use strict';

  const { parties, systems } = window.senateData;
  const model = window.senateModel;
  const { partyIds, axes, constituencies, socialClasses, laws, policies, bureaus, crises, sum } = model;
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
  const compositionParties = new Set();
  let compositionUnlocked = false;
  let indicatorsUnlocked = false;
  let showIndicatorHistory = false;
  const readingViews = {
    1: { bill: null, votes: {}, filter: '', selected: new Set() },
    2: { bill: null, votes: {}, filter: '', selected: new Set() }
  };
  let campaignDraft = {};
  let crisisExpanded = false;
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
    compositionParties.clear();
    compositionUnlocked = false;
    indicatorsUnlocked = false;
    showIndicatorHistory = false;
    clearReadings();
    campaignDraft = {};
    crisisExpanded = false;
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
  function indicatorRating(value) {
    if (value < -4) return ['Плачевно', 'dire'];
    if (value <= -2) return ['Печально', 'poor'];
    if (value <= 0) return ['Терпимо', 'fair'];
    if (value <= 2) return ['Неплохо', 'good'];
    if (value <= 4) return ['Отлично', 'great'];
    return ['Великолепно', 'excellent'];
  }
  const signClass = value => value > 0 ? 'yes' : value < 0 ? 'no' : '';
  const total = () => sum(Object.values(state.seats));
  const orderedParties = () => state.partyOrder ?? partyIds;

  function drawChamber(selected, canvas = byId('chamber')) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rows = 14;
    const radii = Array.from({ length: rows }, (_, i) => 83 + i * 13.3);
    const rowTotal = sum(radii);
    const cumulative = radii.map((_, i) => Math.round(sum(radii.slice(0, i + 1)) / rowTotal * total()));
    const points = radii.flatMap((radius, i) => {
      const count = cumulative[i] - (cumulative[i - 1] ?? 0);
      return Array.from({ length: count }, (_, j) => ({ radius, angle: Math.PI - Math.PI * (j + .5) / count }));
    }).sort((a, b) => b.angle - a.angle);
    let position = 0;
    for (const id of orderedParties()) {
      ctx.globalAlpha = !selected.size || selected.has(id) ? 1 : .16;
      ctx.fillStyle = parties[id].color;
      for (let i = 0; i < state.seats[id]; i++) {
        const { radius, angle } = points[position++];
        ctx.beginPath();
        ctx.arc((300 + Math.cos(angle) * radius) * 2, (280 - Math.sin(angle) * radius) * 2, 6, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }

  const ballotSuffix = reading => reading === 2 ? '-second' : '';

  function chamber(reorder = false, reading = 1) {
    const number = format(total());
    const counter = reorder
      ? `<button id="chamber-order-toggle" class="chamber-total-toggle" type="button"
          aria-label="Изменить порядок партий" aria-pressed="${compositionUnlocked}">${number}</button>`
      : `<strong>${number}</strong>`;
    return `<div class="chamber">
      <canvas id="chamber${ballotSuffix(reading)}" width="1200" height="580" aria-label="Распределение мандатов полукругом"></canvas>
      <div class="chamber-total">${counter}<span>МАНДАТОВ</span></div>
    </div>`;
  }

  function partyCalculator(selected, voting = false, reading = 1) {
    return `<div id="party-calculator${ballotSuffix(reading)}" class="party-calculator">
      <ul class="seat-list" aria-label="Партии и мандаты">${orderedParties().map(id => `<li>
        ${voting ? `<button type="button" class="vote-flag" data-party="${id}" data-position="abstain">
          <span class="vote-party-name">${party(id)}</span>
          <strong class="flag-position">${flagLabels.abstain}</strong>
        </button>` : ''}
        <button class="seat-choice${voting ? ' seat-count' : ''}" type="button" data-seat-party="${id}" aria-pressed="${selected.has(id)}"
          ${voting ? `aria-label="Места партии ${html(parties[id].name)} в калькуляторе · ${state.seats[id]}"` : ''}>
          ${voting ? '' : `<span>${party(id)}</span>`}<b>${state.seats[id]}</b>
        </button>
      </li>`).join('')}</ul>
      <div class="seat-total"><span>Сумма мест</span>
        <output id="seat-total${ballotSuffix(reading)}" aria-live="polite">${format(sum([...selected].map(id => state.seats[id])))}</output>
      </div>
    </div>`;
  }

  function setupCalculator(selected, selectParties = true, root = screen) {
    const canvas = root.querySelector('.chamber canvas');
    drawChamber(selected, canvas);
    if (!selectParties) return;
    root.querySelector('.party-calculator').addEventListener('click', event => {
      const button = event.target.closest('[data-seat-party]');
      if (!button) return;
      const id = button.dataset.seatParty;
      if (selected.has(id)) selected.delete(id);
      else selected.add(id);
      button.setAttribute('aria-pressed', String(selected.has(id)));
      root.querySelector('.seat-total output').value = format(sum([...selected].map(id => state.seats[id])));
      drawChamber(selected, canvas);
    });
  }

  function moveParty(from, to) {
    if (from === to) return;
    const order = [...orderedParties()];
    const destination = order.indexOf(to);
    order.splice(order.indexOf(from), 1);
    order.splice(destination, 0, from);
    state.partyOrder = order;
    saves.commit(archive, state, false);
    storageAvailable = persist();
    renderComposition();
    screen.querySelector(`[data-seat-party="${from}"]`).focus({ preventScroll: true });
    byId('party-order-status').textContent = `${parties[from].name} · позиция ${destination + 1} из ${order.length}.`;
    if (!storageAvailable) showNotice('Порядок мест изменён. Скачайте сохранение, чтобы сохранить его после закрытия страницы.');
  }

  function setupPartyDrag() {
    const list = screen.querySelector('.seat-list');
    let drag = null;

    const partyButton = target => {
      const button = target?.closest('[data-seat-party]');
      return list.contains(button) ? button : null;
    };

    function updateTarget(event) {
      const distance = Math.hypot(event.clientX - drag.x, event.clientY - drag.y);
      if (!drag.moved && distance < 5) return;
      drag.moved = true;
      drag.source.classList.add('drag-source');
      const candidate = partyButton(document.elementFromPoint(event.clientX, event.clientY));
      const target = candidate === drag.source ? null : candidate;
      if (target === drag.target) return;
      drag.target?.classList.remove('drag-target');
      drag.target = target;
      target?.classList.add('drag-target');
    }

    function finishDrag(event, drop = false) {
      if (drag?.pointerId !== event.pointerId) return;
      if (drop) updateTarget(event);
      const { source, target } = drag;
      drag = null;
      source.classList.remove('drag-source');
      target?.classList.remove('drag-target');
      if (drop && target) moveParty(source.dataset.seatParty, target.dataset.seatParty);
    }

    list.addEventListener('pointerdown', event => {
      const source = partyButton(event.target);
      if (!source || drag || event.button !== 0) return;
      event.preventDefault();
      source.focus({ preventScroll: true });
      drag = { source, pointerId: event.pointerId, x: event.clientX, y: event.clientY };
      list.setPointerCapture(event.pointerId);
    });
    list.addEventListener('pointermove', event => {
      if (drag?.pointerId === event.pointerId) updateTarget(event);
    });
    list.addEventListener('pointerup', event => finishDrag(event, true));
    list.addEventListener('pointercancel', finishDrag);
    list.addEventListener('lostpointercapture', finishDrag);
    list.addEventListener('keydown', event => {
      const source = partyButton(event.target);
      const step = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[event.key];
      if (!source || !step) return;
      event.preventDefault();
      const id = source.dataset.seatParty;
      const order = orderedParties();
      const target = order[order.indexOf(id) + step];
      if (target) moveParty(id, target);
    });
  }

  function renderComposition() {
    screen.innerHTML = `<section class="panel chamber-panel composition ${compositionUnlocked ? 'is-unlocked' : ''}"
      aria-label="Композиция Сената">
      ${chamber(true)}
      ${compositionUnlocked ? '<p class="muted drag-help">Перетащите плашку на новое место или переместите её стрелками на клавиатуре.</p>' : ''}
      ${partyCalculator(compositionParties)}
      <span class="screen-reader-text" id="party-order-status" role="status"></span>
    </section>`;
    byId('chamber-order-toggle').addEventListener('click', () => {
      compositionUnlocked = !compositionUnlocked;
      renderComposition();
      byId('chamber-order-toggle').focus({ preventScroll: true });
    });
    setupCalculator(compositionParties, !compositionUnlocked);
    if (compositionUnlocked) setupPartyDrag();
  }

  function billSearch(law, reading) {
    const suffix = ballotSuffix(reading);
    return `<section class="panel law-search" aria-label="Поиск законопроекта">
      <label>Партия<select id="party-filter${suffix}"><option value="">Все партии</option>${options(partyIds)}</select></label>
      <div class="law-completion"><label>Название законопроекта
        <input id="law-query${suffix}" type="text" value="${html(law?.name ?? '')}" autocomplete="off"
          role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="law-suggestions${suffix}"
          placeholder="Начните вводить название"></label>
        <ul id="law-suggestions${suffix}" class="law-suggestions" role="listbox" aria-label="Найденные законопроекты" hidden></ul>
        <p id="law-search-status${suffix}" class="muted" role="status" hidden></p>
      </div>
    </section>`;
  }

  function setupBillSearch(reading, openLaw) {
    const suffix = ballotSuffix(reading);
    const view = readingViews[reading];
    const filter = byId('party-filter' + suffix);
    const input = byId('law-query' + suffix);
    const list = byId('law-suggestions' + suffix);
    const hint = byId('law-search-status' + suffix);
    let matches = [];
    let active = -1;
    filter.value = view.filter;
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
        return (!view.filter || law.author === view.filter) && isEligible(law, reading) &&
          words.every(word => normalize(law.name).includes(word));
      }).sort((a, b) => Number(normalize(b.name).startsWith(query)) - Number(normalize(a.name).startsWith(query)));
      active = -1;
      input.removeAttribute('aria-activedescendant');
      list.innerHTML = matches.map((law, index) => `<li id="law-match${suffix}-${index}" role="option" aria-selected="false" data-law="${law.id}">
        <strong>${html(law.name)}</strong><small>${party(law.author)} · ${state.bills[law.id] === 'second' ? 'II' : 'I'} чтение</small>
      </li>`).join('');
      list.hidden = matches.length === 0;
      hint.hidden = !list.hidden;
      hint.textContent = list.hidden ? 'В повестке нет подходящих законопроектов.' : '';
      input.setAttribute('aria-expanded', String(!list.hidden));
    }
    filter.addEventListener('change', () => {
      view.filter = filter.value;
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

  const flagLabels = { yes: 'Да', no: 'Против', abstain: 'Воздержалась' };

  function updateFlag(button, position) {
    const id = button.dataset.party;
    button.dataset.position = position;
    button.querySelector('.flag-position').textContent = flagLabels[position];
    button.setAttribute('aria-label', `${parties[id].name}. ${flagLabels[position]}.`);
  }

  function clearReadings() {
    for (const view of Object.values(readingViews)) {
      view.bill = null;
      view.votes = {};
      view.filter = '';
      view.selected.clear();
    }
  }

  function isEligible(law, reading) {
    const status = state.bills[law.id];
    return reading === 2 ? status === 'second' : status === undefined;
  }

  function billCard(law, reading) {
    return `<section class="panel bill-card" aria-label="Законопроект на рассмотрении">
      <h2 id="current-bill${ballotSuffix(reading)}" tabindex="-1">${html(law.name)}</h2>
      <p>${party(law.author)} · ${reading === 2 ? 'Второе' : 'Первое'} чтение</p>
    </section>`;
  }

  function voteForm(reading) {
    const suffix = ballotSuffix(reading);
    return `<form id="vote-form${suffix}" class="panel stack">
      <p class="muted vote-controls">ЛКМ — да. ПКМ — против. Двойное нажатие — воздержаться.</p>
      ${partyCalculator(readingViews[reading].selected, true, reading)}
      <div class="tally" id="tally${suffix}" aria-live="polite"></div>
      ${reading === 2 ? '<p class="muted">Во втором чтении у каждой партии должен быть голос за или против.</p>' : ''}
      <button class="primary" type="submit">Зафиксировать голосование</button>
    </form>`;
  }

  function readingHistory() {
    const results = new Map();
    for (const vote of state.votes) {
      if (vote.convocation !== state.convocation) continue;
      const id = vote.billId ?? laws.find(law => law.name === vote.name && law.author === vote.author)?.id ??
        JSON.stringify([vote.author, vote.name]);
      const bill = results.get(id) ?? { name: vote.name, author: vote.author, readings: {} };
      bill.readings[vote.reading] = vote.status;
      results.set(id, bill);
    }
    return [...results.values()];
  }

  function billOutcomes(history, final = false) {
    const rows = history.flatMap(bill => {
      const reading = final && bill.readings[2] ? 2 : 1;
      const status = bill.readings[reading];
      if (!status || (final && status === 'second')) return [];
      const label = status === 'second' ? 'Направлен во второе чтение' :
        `${status === 'passed' ? 'Принят' : 'Отклонен'} ${reading === 1 ? 'в первом' : 'во втором'} чтении`;
      return [`<tr><th scope="row">${html(bill.name)}</th><td>${party(bill.author)}</td>
        <td><span class="tag ${status}">${label}</span></td></tr>`];
    }).join('');
    const title = final ? 'Судьба законопроектов' : 'Первое чтение';
    const empty = final ? 'Окончательных решений пока нет.' : 'В первом чтении ещё не голосовали.';
    return `<section class="panel bill-outcomes ${final ? 'final-outcomes' : 'first-outcomes'}"><h3>${title}</h3>
      ${rows ? `<div class="table-wrap"><table><thead><tr>
        <th scope="col">Законопроект</th><th scope="col">Партия</th><th scope="col">Итог</th>
      </tr></thead><tbody>${rows}</tbody></table></div>` : `<p class="muted">${empty}</p>`}
    </section>`;
  }

  function ballotStage(reading) {
    const view = readingViews[reading];
    const law = state.snapElection ? null : laws.find(item => item.id === view.bill && isEligible(item, reading));
    const search = state.snapElection ? '' : billSearch(law, reading);
    const chart = `<section class="panel chamber-panel">
      <p class="reading-threshold"><span class="tag">${Math.floor(total() * 2 / 3) + 1} голосов для принятия</span></p>
      ${chamber(false, reading)}
    </section>`;
    const calculator = law ? voteForm(reading) : `<section class="panel">${partyCalculator(view.selected, false, reading)}</section>`;
    return `<section data-reading="${reading}" aria-label="${reading === 2 ? 'Второе' : 'Первое'} чтение">
      ${search}${law ? billCard(law, reading) : ''}
      <div class="split senate-layout">${chart}${calculator}</div>
    </section>`;
  }

  function renderReading() {
    const history = readingHistory();
    const pending = !state.snapElection && laws.some(law => isEligible(law, 2));
    const noticeText = state.snapElection
      ? '<div class="notice">Назначены досрочные выборы. Перейдите к <a href="#campaign">избирательной кампании</a>.</div>'
      : '';
    screen.innerHTML = noticeText + ballotStage(1) + billOutcomes(history) +
      `<section class="second-reading"><h3>Второе чтение</h3>
        ${pending ? ballotStage(2) : '<div class="panel empty">Нет законопроектов на второе чтение.</div>'}
      </section>` + billOutcomes(history, true);
    setupReading(1);
    if (pending) setupReading(2);
  }

  function setupReading(reading) {
    const view = readingViews[reading];
    const suffix = ballotSuffix(reading);
    const root = screen.querySelector(`[data-reading="${reading}"]`);
    setupCalculator(view.selected, true, root);
    if (state.snapElection) return;
    setupBillSearch(reading, id => {
      if (view.bill !== id) {
        view.bill = id;
        view.votes = {};
        notice.hidden = true;
        renderReading();
      } else {
        byId('law-query' + suffix).blur();
      }
      byId('current-bill' + suffix).focus();
    });
    const form = byId('vote-form' + suffix);
    if (!form) return;
    const law = laws.find(item => item.id === view.bill);
    const flags = all(form, '.vote-flag');
    const positions = () => Object.fromEntries(flags.map(flag => [flag.dataset.party, flag.dataset.position]));
    function updateTally() {
      const totals = model.tally(state.seats, positions());
      const secondReading = reading === 2;
      byId('tally' + suffix).innerHTML = Object.keys(labels).map(key =>
        `<span class="${key}">${secondReading && key === 'abstain' ? 'Не определились' : labels[key]} <b>${totals[key]}</b></span>`).join('');
      form.querySelector('button[type="submit"]').disabled = secondReading && totals.abstain > 0;
    }
    for (const flag of flags) updateFlag(flag, view.votes[flag.dataset.party] ?? 'abstain');
    updateTally();
    let previousClick = null;
    const doubleClickWindow = 500;
    function applyVote(flag, position) {
      view.votes[flag.dataset.party] = position;
      updateFlag(flag, position);
      updateTally();
    }

    function pointerVote(event, position) {
      const flag = event.target.closest('.vote-flag');
      if (!flag) return;
      if (event.type === 'contextmenu') event.preventDefault();
      const id = flag.dataset.party;
      const double = previousClick?.id === id && previousClick.position === position &&
        event.timeStamp - previousClick.at <= doubleClickWindow;
      previousClick = double ? null : { id, position, at: event.timeStamp };
      applyVote(flag, double ? 'abstain' : position);
    }

    form.addEventListener('click', event => pointerVote(event, 'yes'));
    form.addEventListener('contextmenu', event => pointerVote(event, 'no'));
    form.addEventListener('keydown', event => {
      const flag = event.target.closest('.vote-flag');
      if (!flag || event.key !== 'Delete') return;
      event.preventDefault();
      previousClick = null;
      applyVote(flag, 'abstain');
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      const result = model.recordVote(state, law, positions());
      if (!result) return;
      view.bill = null;
      view.votes = {};
      save(`«${law.name}» · ${statusText[result]}.`);
    });
  }

  const partyCode = id => id === 'СГ' ? 'Г' : id;

  function bureauOwner(name, index, slot) {
    const second = slot === 2;
    return `<div class="bureau-owner" data-owner-slot="${slot}" ${second ? `id="second-owner-${index}" hidden` : ''}>
      <div class="bureau-owner-controls">
        <label class="bureau-select"><span class="owner-dot" aria-hidden="true"></span>
          <select data-owner aria-label="${name}. ${second ? 'Второй' : 'Первый'} владелец" ${second ? 'disabled' : 'required'}>
            <option value="">—</option>
          </select>
        </label>
        ${second ? '' : `<button type="button" class="add-owner" data-add-owner aria-controls="second-owner-${index}"
          aria-expanded="false" aria-label="Добавить второго владельца" disabled>+</button>`}
      </div>
      <p class="owner-policy" hidden></p>
    </div>`;
  }

  function renderBureaus() {
    if (state.snapElection) {
      screen.innerHTML = '';
      appendCrisis();
      return;
    }
    if (state.government) {
      const { policies: enacted } = state.government;
      screen.innerHTML = `<div class="bureau-grid">${bureaus.map((name, index) =>
        `<article class="panel bureau"><h3>${name}</h3>${enacted[index].map(policy =>
          `<div class="bureau-owner"><span class="bureau-owner-code" title="${html(parties[policy.id].name)}">${dot(policy.id)}${partyCode(policy.id)}</span>
          <p class="owner-policy">${html(policy.name)}</p></div>`).join('')}</article>`).join('')}</div>`;
      appendCrisis();
      return;
    }
    screen.innerHTML = `<form id="coalition">
      <div class="bureau-grid">${bureaus.map((name, index) => `<section class="panel bureau" data-bureau="${index}">
        <h3>${name}</h3>
        ${bureauOwner(name, index, 1)}
        ${bureauOwner(name, index, 2)}
      </section>`).join('')}</div>
      <div class="actions"><button class="primary" type="submit">Утвердить правительство</button></div>
    </form>`;
    const form = byId('coalition');
    const cards = all(form, '.bureau');
    const submit = form.querySelector('[type="submit"]');
    const policyFor = (id, bureau) => policies.find(item => item.bureau === Number(bureau.dataset.bureau) && item.author === id);

    function updateOwner(select, available, bureau) {
      const previous = select.value;
      select.innerHTML = '<option value="">—</option>' + available.map(id =>
        `<option value="${id}" title="${html(parties[id].name)}" style="color:${parties[id].color}">${partyCode(id)}</option>`).join('');
      select.value = available.includes(previous) ? previous : '';
      const owner = select.closest('.bureau-owner');
      owner.querySelector('.owner-dot').style.backgroundColor = parties[select.value]?.color ?? '';
      const policy = policyFor(select.value, bureau);
      const name = owner.querySelector('.owner-policy');
      name.hidden = !policy;
      name.textContent = policy?.name ?? '';
    }

    function updateOwners() {
      for (const card of cards) {
        const [first, second] = all(card, '[data-owner]');
        const secondRow = second.closest('.bureau-owner');
        const toggle = card.querySelector('[data-add-owner]');
        const available = orderedParties().filter(id => policyFor(id, card));
        updateOwner(first, available, card);
        if (!first.value) secondRow.hidden = true;
        const expanded = !secondRow.hidden;
        toggle.disabled = !first.value;
        toggle.textContent = expanded ? '−' : '+';
        toggle.setAttribute('aria-expanded', String(expanded));
        toggle.setAttribute('aria-label', expanded ? 'Убрать второго владельца' : 'Добавить второго владельца');
        second.required = expanded;
        second.disabled = !expanded;
        updateOwner(second, expanded ? available.filter(id => id !== first.value) : [], card);
      }
      submit.disabled = all(form, '[data-owner]:required').some(select => !select.value);
    }

    form.addEventListener('change', event => {
      if (event.target.matches('[data-owner]')) updateOwners();
    });
    form.addEventListener('click', event => {
      const toggle = event.target.closest('[data-add-owner]');
      if (!toggle) return;
      const secondRow = byId(toggle.getAttribute('aria-controls'));
      secondRow.hidden = !secondRow.hidden;
      updateOwners();
      if (!secondRow.hidden) secondRow.querySelector('select').focus();
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (submit.disabled) return;
      const distribution = cards.map(bureau =>
        all(bureau, '[data-owner]').map(select => policyFor(select.value, bureau)).filter(Boolean));
      if (model.acceptGovernment(state, distribution)) {
        save('Правительство утверждено. Политика Бюро вступила в силу.');
        byId('crisis-toggle')?.focus();
      }
    });
    updateOwners();
  }

  function appendCrisis() {
    const stage = crises[state.crisisStage];
    const resolved = new Map(state.crisisLog.filter(item => item.stage === state.crisisStage).map(item => [item.question, item]));
    const open = !state.snapElection && !resolved.size && stage.questions.some(question => question.options.length);
    const threshold = Math.ceil(total() * 2 / 3);
    const accession = resolved.get('accession');
    const summary = state.snapElection
      ? '<div class="notice">Правительство распущено. Перейдите к <a href="#campaign">досрочной кампании</a>.</div>'
      : '';
    screen.insertAdjacentHTML('beforeend', `<section class="crisis-phase" aria-label="Новости">
      ${summary}
      <div class="crisis-news-row">
        ${stage.video ? `<a href="${stage.video}" target="_blank" rel="noopener">Новости</a>` : '<span>Новости</span>'}
        <button type="button" id="crisis-toggle" class="crisis-toggle" aria-controls="crisis-body"></button>
      </div>
      <div id="crisis-body" class="crisis-body">
        <section class="panel crisis-news">
          <h3>${html(stage.title)}</h3>
          <p class="lead">${html(stage.news ?? 'Для этой ветки в материалах пока есть только название.')}</p>
        </section>
        <form id="crisis-form">
      ${stage.questions.length ? `<div class="crisis-grid" tabindex="0" role="group" aria-label="Вопросы кризиса">${stage.questions.map(question => {
        const decision = resolved.get(question.id);
        return `<section class="panel crisis-question">
          <h3 id="crisis-question-${question.id}">${html(question.name)}</h3>
          ${question.options.length ? `<fieldset aria-labelledby="crisis-question-${question.id}" ${open ? '' : 'disabled'}>
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
      }).join('')}</div>` : ''}
      <div class="actions crisis-actions">
        ${state.snapElection ? '' : '<button class="danger" type="button" id="dissolve">Правительство распущено и назначены досрочные выборы</button>'}
        ${open ? '<button class="primary" type="submit">Зафиксировать решения</button>' : ''}
      </div>
    </form></div></section>`);
    const toggle = byId('crisis-toggle');
    const body = byId('crisis-body');
    function updateCrisisVisibility() {
      toggle.textContent = crisisExpanded ? '−' : '+';
      toggle.setAttribute('aria-expanded', String(crisisExpanded));
      toggle.setAttribute('aria-label', crisisExpanded ? 'Свернуть кризис' : 'Раскрыть кризис');
      body.hidden = !crisisExpanded;
    }
    updateCrisisVisibility();
    toggle.addEventListener('click', () => {
      crisisExpanded = !crisisExpanded;
      updateCrisisVisibility();
    });
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

  function shareChange(value, baseline) {
    const delta = Math.round((value - baseline) * 10) / 10;
    return `<small class="${signClass(delta)}">${signed(delta)} п. п.</small>`;
  }

  function popularityCharts(groups, ceiling) {
    return groups.map(({ name, image, shares, baseline }) => {
      let zeroCount = 0;
      const ranked = partyIds.map(id => {
        const displayedShare = shares[id] < 0.05 ? (zeroCount++ % 3 + 1) / 10 : shares[id];
        return { id, displayedShare };
      }).sort((a, b) => b.displayedShare - a.displayedShare);
      return `<article class="panel popularity-chart ${baseline ? 'with-change' : ''}">
        <header class="popularity-chart-heading">
          <img class="popularity-image" src="${image}" width="64" height="64" alt="">
          <h3>${html(name)}</h3>
        </header>
        <div class="popularity-chart-plot" style="--grid-step:${1000 / ceiling}%">
          ${ranked.map(({ id, displayedShare }) => {
            const share = formatPercent(displayedShare);
            return `<div class="popularity-chart-column" style="--bar-height:${displayedShare / ceiling * 100}%;--party-color:${parties[id].color}"
              title="${html(parties[id].name)} — ${share}">
              <span class="popularity-chart-bar"><span class="popularity-chart-value">${share}${baseline ? shareChange(shares[id], baseline[id]) : ''}</span></span>
              <abbr class="popularity-chart-party" title="${html(parties[id].name)}">${html(id)}</abbr>
            </div>`;
          }).join('')}
        </div>
      </article>`;
    }).join('');
  }

  function electionResultsChart(popularity, baseline, coalition, adjustments) {
    const ranking = [...partyIds].sort((a, b) => popularity[b] - popularity[a]);
    const peak = Math.max(1, ...Object.values(popularity));
    const coalitionShare = sum(coalition.map(id => popularity[id]));
    const coalitionBaseline = sum(coalition.map(id => baseline[id]));
    return `<div class="table-wrap"><div class="election-results-chart">
        ${ranking.map(id => {
          const value = popularity[id];
          const steps = adjustments?.[id] ?? 0;
          return `<div class="election-result" title="${html(parties[id].name)}">
            <strong>${formatPercent(value)}</strong>
            ${shareChange(value, baseline[id])}
            <div class="election-result-track"><span style="height:${value / peak * 100}%;background:${parties[id].color}"></span></div>
            <span><abbr title="${html(parties[id].name)}">${html(id)}</abbr>${coalition.includes(id) ? ' <small class="no" title="Правительственная партия">(прав.)</small>' : ''}</span>
            ${adjustments ? `<div class="election-adjust">
              ${[-1, 1].map(direction => {
                const symbol = direction < 0 ? '−' : '+';
                const limit = direction < 0 && steps <= -10;
                return `<button type="button" data-adjust="${id}" data-direction="${direction}"
                  aria-label="${html(parties[id].name)} ${symbol}10% к положительным рейтингам" ${limit ? 'disabled' : ''}>${symbol}</button>`;
              }).join('')}
            </div>` : ''}
          </div>`;
        }).join('')}
      </div></div>
      <p><strong>Правящая коалиция</strong> ${coalition.length
        ? `${formatPercent(coalitionShare)} (${shareChange(coalitionShare, coalitionBaseline)})` : '— правительство не сформировано'}</p>`;
  }

  function electionPreview({ popularity, seats }, baseline, adjustments) {
    const replay = model.replayVotes(state, seats);
    const outcomes = [
      [1, 'passed', 'Принято в первом чтении'], [1, 'rejected', 'Отклонено в первом чтении'],
      [2, 'passed', 'Принято во втором чтении'], [2, 'rejected', 'Отклонено во втором чтении'],
      [1, 'second', 'Ожидает второго чтения']
    ];
    const count = (key, reading, status) => replay.filter(bill => bill[key].reading === reading && bill[key].status === status).length;
    const reversed = (from, to) => replay.filter(bill => bill.actual.status === from && bill.projected.status === to).length;
    return electionResultsChart(popularity, baseline, state.government?.members ?? [], adjustments) + `
      <h3>Судьба законопроектов при новом составе</h3>
      <div class="table-wrap"><table>
        <thead><tr><th scope="col">Статус</th><th scope="col">Было</th><th scope="col">Было бы</th></tr></thead>
        <tbody>${outcomes.map(([reading, status, label]) => `<tr><th scope="row">${label}</th>
          <td>${count('actual', reading, status)}</td><td>${count('projected', reading, status)}</td></tr>`).join('')}</tbody>
      </table></div>
      <p><strong>Итого</strong> ${reversed('passed', 'rejected')} принятых были бы отклонены,
        ${reversed('rejected', 'passed')} отклонённых были бы приняты.</p>`;
  }

  function renderPopularity(projection, prefix = '', baseline = {}) {
    const sectorGroups = systems.map(({ name }) => ({
      name, image: './assets/' + encodeURIComponent(name) + '.png', shares: projection.bySector[name], baseline: baseline.bySector?.[name]
    }));
    const classGroups = socialClasses.map(id => ({
      name: constituencies[id], image: './assets/classes/' + id + '.png', shares: projection.byClass[id], baseline: baseline.byClass?.[id]
    }));
    const peak = Math.max(...[...sectorGroups, ...classGroups].flatMap(group => Object.values(group.shares)));
    const ceiling = Math.max(10, Math.ceil(peak / 10) * 10);
    byId(prefix + 'sector-charts').innerHTML = popularityCharts(sectorGroups, ceiling);
    byId(prefix + 'class-charts').innerHTML = popularityCharts(classGroups, ceiling);
  }

  function renderElectionFinal(election) {
    const baseline = election.baseline?.popularity ??
      Object.fromEntries(partyIds.map(id => [id, election.oldSeats[id] / sum(Object.values(election.oldSeats)) * 100]));
    screen.innerHTML = `<section class="panel election-preview">
        <h2 tabindex="-1" id="final-election-title">Итоги выборов</h2>
        ${electionResultsChart(election.popularity, baseline, election.coalition ?? [])}
      </section>
      <section class="campaign-popularity" aria-labelledby="final-sector-title">
        <h2 id="final-sector-title">Итоги по секторам</h2>
        <div id="final-sector-charts" class="popularity-charts"></div>
      </section>
      <section class="campaign-popularity" aria-labelledby="final-class-title">
        <h2 id="final-class-title">Итоги по социальным слоям</h2>
        <div id="final-class-charts" class="popularity-charts"></div>
      </section>`;
    renderPopularity(election, 'final-', election.baseline);
  }

  function renderCampaign() {
    if (!model.canCampaign(state)) {
      if (state.lastElection) renderElectionFinal(state.lastElection);
      else screen.innerHTML = '<p class="notice">Кампания откроется после формирования правительства и выбора решений по кризису.</p>';
      return;
    }
    const groups = socialClasses.map(id => `<option value="${id}">${constituencies[id]}</option>`).join('');
    const electionNotice = state.snapElection ? '<div class="notice">Назначены досрочные выборы.</div>' : '';
    screen.innerHTML = electionNotice + `<section class="campaign-popularity" aria-labelledby="sector-popularity-title">
        <h2 id="sector-popularity-title">Популярность партий по секторам</h2>
        <div id="sector-charts" class="popularity-charts"></div>
      </section>
      <section class="campaign-popularity" aria-labelledby="class-popularity-title">
        <h2 id="class-popularity-title">Популярность партий по социальным слоям</h2>
        <div id="class-charts" class="popularity-charts"></div>
      </section>
      <form id="campaign-form" class="panel">
        <div class="table-wrap"><table class="campaign-table">
          <thead><tr><th scope="col">Партия</th><th scope="col">Кого винит</th><th scope="col">Основная группа</th>
            <th scope="col">Побочная группа</th></tr></thead>
          <tbody>${partyIds.map(id => `<tr data-campaign="${id}"><th scope="row">${party(id)}</th>
            <td><select required aria-label="Кого винит партия ${html(parties[id].name)}" data-answer="target"><option value="">Выбрать</option>
              <option value="none">Никого</option>${options(partyIds.filter(other => other !== id))}</select></td>
            <td><select required aria-label="Основная группа партии ${html(parties[id].name)}" data-answer="main"><option value="">Выбрать</option>${groups}</select></td>
            <td><select required aria-label="Побочная группа партии ${html(parties[id].name)}" data-answer="secondary"><option value="">Выбрать</option>${groups}</select></td></tr>`).join('')}</tbody>
        </table></div>
        <div class="actions"><button class="primary">Зафиксировать предварительные итоги выборов</button></div>
      </form>
      <section class="panel election-preview" id="election-preview" aria-labelledby="preliminary-title" hidden>
        <div class="panel-head">
          <h2 tabindex="-1" id="preliminary-title">Предварительные итоги выборов</h2>
          <button type="button" id="reset-election-adjustments" disabled>Отменить корректировки</button>
        </div>
        <div id="election-preview-results"></div>
        <section class="campaign-popularity" aria-labelledby="projected-sector-title">
          <h3 id="projected-sector-title">Популярность по секторам после кампании</h3>
          <div id="projected-sector-charts" class="popularity-charts"></div>
        </section>
        <section class="campaign-popularity" aria-labelledby="projected-class-title">
          <h3 id="projected-class-title">Популярность по социальным слоям после кампании</h3>
          <div id="projected-class-charts" class="popularity-charts"></div>
        </section>
        <form id="finish-election-form">
          <label class="confirm"><input type="checkbox" required> Завершить текущий созыв и сформировать новый по итогам выборов</label>
          <div class="actions"><button class="primary">Зафиксировать итоги выборов</button></div>
        </form>
      </section>`;
    const form = byId('campaign-form');
    const preview = byId('election-preview');
    const results = byId('election-preview-results');
    const finish = byId('finish-election-form');
    const baseline = model.electionBaseline(state);
    const reset = byId('reset-election-adjustments');
    let adjustments = {};
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
    function updateCampaignOptions() {
      for (const row of all(form, '[data-campaign]')) {
        const main = row.querySelector('[data-answer="main"]').value;
        const secondary = row.querySelector('[data-answer="secondary"]');
        for (const option of secondary.options) option.disabled = option.value !== '' && option.value === main;
        if (main && main === secondary.value) secondary.value = '';
      }
    }
    form.addEventListener('change', () => {
      preview.hidden = true;
      adjustments = {};
      updateCampaignOptions();
      campaignDraft = Object.fromEntries(all(form, '[data-campaign]').map(row => [
        row.dataset.campaign, Object.fromEntries(all(row, 'select').map(select => [select.dataset.answer, select.value]))
      ]));
    });
    function renderElectionPreview() {
      const projection = model.electionProjection(state, answers(), adjustments);
      renderPopularity(projection, 'projected-', baseline);
      results.innerHTML = electionPreview(projection, baseline.popularity, adjustments);
      reset.disabled = !Object.values(adjustments).some(Boolean);
    }
    reset.addEventListener('click', () => {
      adjustments = {};
      renderElectionPreview();
      byId('preliminary-title').focus();
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      adjustments = {};
      renderElectionPreview();
      finish.reset();
      preview.hidden = false;
      byId('preliminary-title').focus();
    });
    results.addEventListener('click', event => {
      const button = event.target.closest('[data-adjust]');
      if (!button || button.disabled || preview.hidden) return;
      const { adjust: id, direction } = button.dataset;
      adjustments[id] = (adjustments[id] ?? 0) + Number(direction);
      renderElectionPreview();
      all(results, 'button:enabled').find(next => next.dataset.adjust === id && next.dataset.direction === direction)?.focus();
    });
    finish.addEventListener('submit', event => {
      event.preventDefault();
      if (preview.hidden) return;
      model.finishElection(state, answers(), adjustments);
      campaignDraft = {};
      crisisExpanded = false;
      indicatorsUnlocked = false;
      compositionParties.clear();
      clearReadings();
      save(`Созыв № ${state.convocation} сформирован.`, true);
      byId('final-election-title')?.focus();
    });
    updateCampaignOptions();
    renderPopularity(model.electionProjection(state));
  }

  function renderIndicators() {
    const titles = { republic: 'Республика', sector: 'Секторы', audience: 'Группы населения' };
    const history = showIndicatorHistory ? model.indicatorHistory(state) : [];
    const types = { bill: 'Законопроект', policy: 'Политика Бюро', crisis: 'Кризис' };
    function historyFor(id) {
      if (!showIndicatorHistory) return '';
      const rows = history.filter(entry => entry.effects[id]).map(entry =>
        '<li><span>' + html(entry.name) + '<small>' + types[entry.type] + ' · ' +
        html(entry.source) + ' · созыв ' + entry.convocation + '</small></span><strong class="' +
        signClass(entry.effects[id]) + '">' + signed(entry.effects[id]) + '</strong></li>').join('');
      return '<dd class="axis-history">' + (rows ? '<ul>' + rows + '</ul>' :
        '<span class="muted">Нет записей</span>') + '</dd>';
    }
    screen.innerHTML = `<div class="board-toolbar">
      <button type="button" id="indicator-eye" class="quiet indicator-lock" aria-label="История изменений" aria-pressed="${showIndicatorHistory}" title="История изменений"><span aria-hidden="true">👁</span></button>
      <button type="button" id="indicator-lock" class="quiet indicator-lock" aria-label="Редактирование показателей"
        aria-pressed="${indicatorsUnlocked}" title="${indicatorsUnlocked ? 'Зафиксировать показатели' : 'Изменить показатели'}">
        <span aria-hidden="true">${indicatorsUnlocked ? '🔓' : '🔒'}</span>
      </button>
    </div><div class="board-grid" aria-label="Показатели Республики">${entries(axes).map(([group, indicators]) =>
      `<section class="panel"><h3>${titles[group]}</h3>
        <dl class="axis-list">${entries(indicators).map(([id, label]) => {
          const value = state.indicators[id];
          const [labelText, color] = indicatorsUnlocked || showIndicatorHistory
            ? [signed(value), signClass(value)] : indicatorRating(value);
          const controls = (step, text, name) => indicatorsUnlocked ? `<button type="button" class="axis-step"
            data-indicator-step="${step}" aria-label="${name} «${html(label)}»">${text}</button>` : '';
          return `<div data-axis="${id}"><dt>${html(label)}</dt><dd>
            ${controls(-1, '−', 'Уменьшить')}
            <output class="${color}" aria-live="polite">${labelText}</output>
            ${controls(1, '+', 'Увеличить')}
          </dd>${historyFor(id)}</div>`;
        }).join('')}</dl>
      </section>`).join('')}</div>`;

    byId('indicator-eye').addEventListener('click', () => {
      showIndicatorHistory = !showIndicatorHistory;
      renderIndicators();
      byId('indicator-eye').focus({ preventScroll: true });
    });
    byId('indicator-lock').addEventListener('click', () => {
      indicatorsUnlocked = !indicatorsUnlocked;
      renderIndicators();
      byId('indicator-lock').focus({ preventScroll: true });
    });
    if (!indicatorsUnlocked) return;

    screen.querySelector('.board-grid').addEventListener('click', event => {
      const button = event.target.closest('[data-indicator-step]');
      if (!button) return;
      const row = button.closest('[data-axis]');
      const id = row.dataset.axis;
      const value = state.indicators[id] + Number(button.dataset.indicatorStep);
      if (!Number.isSafeInteger(value)) return;
      state.indicators[id] = value;
      const output = row.querySelector('output');
      output.value = signed(value);
      output.className = signClass(value);
      saves.commit(archive, state, false);
      storageAvailable = persist();
      if (!storageAvailable) showNotice('Показатель изменён. Скачайте сохранение, чтобы сохранить изменение после закрытия страницы.');
    });
  }

  function renderSaves() {
    const date = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short', timeStyle: 'short' });
    const details = entry => `Игра № ${entry.run} · созыв № ${entry.state.convocation} · ${date.format(entry.savedAt)}`;
    const active = archive.active;
    screen.innerHTML = `<section class="panel save-panel">
      <h3>Текущая игра</h3><p class="muted">Игра № ${active.run} · созыв № ${active.state.convocation}</p>
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

  const views = { senate: renderComposition, reading: renderReading, bureaus: renderBureaus, campaign: renderCampaign, statistics: renderIndicators, saves: renderSaves };
  function render() {
    const hash = location.hash.slice(1);
    const aliases = { crisis: 'bureaus', board: 'statistics' };
    const route = Object.hasOwn(aliases, hash) ? aliases[hash] : hash;
    const page = Object.hasOwn(views, route) ? route : 'senate';
    for (const link of all(document, '.navigation a, .saves-link')) {
      if (link.hash === '#' + page) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    byId('session').innerHTML = `<span>СОЗЫВ</span><b>${state.convocation}</b>`;
    views[page]();
  }

  window.addEventListener('hashchange', () => {
    notice.hidden = true;
    render();
  });
  render();
})();
