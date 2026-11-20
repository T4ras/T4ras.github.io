(() => {
  'use strict';

  const { parties, systems, bonuses, convocation, seats } = window.senateData;
  const { axes, items } = window.senateCatalog;
  const partyIds = Object.keys(parties);
  const axisLabels = Object.assign({}, ...Object.values(axes));
  const constituencies = { ...axes.audience, ...axes.sector };
  const socialClasses = Object.keys(systems[0].classes);
  const laws = items.filter(item => item.bureau === undefined);
  const policies = items.filter(item => item.bureau !== undefined);
  const bureaus = [
    'Бюро Социальных Служб', 'Бюро Внутренних Дел',
    'Бюро Финансов и Экономики', 'Бюро Галактических Отношений'
  ];
  const crises = [
    {
      name: 'Перебои на торговых маршрутах',
      description: 'На маршрутах между Неймодией и центральными системами срываются поставки. Торговые дома требуют гарантий, а цены в секторах растут.',
      options: [
        { name: 'Компенсировать перевозчикам издержки', effects: { budget: -1, trade: 1, Self: 1 } },
        { name: 'Договориться с торговыми домами о едином графике', effects: { image: 1, trade: 1, Sys_Неймодия: 1 } },
        { name: 'Передать координацию поставок секторам', effects: { budget: 1, trade: -1, autonomy: 1, Self: 1 } }
      ]
    },
    {
      name: 'Неурожай на Танаабе',
      description: 'Гильдии предупреждают о нехватке продовольствия. Делегации спорят, кто оплатит поставки из других секторов.',
      options: [
        { name: 'Закупить продовольствие в других секторах', effects: { budget: -1, food: 1, Sys_Танааб: 1 } },
        { name: 'Дать хозяйствам льготные кредиты', effects: { budget: -1, Farmer: 1, Sys_Танааб: 1 } },
        { name: 'Открыть резерв по соглашению с секторами', effects: { budget: -1, food: 1, autonomy: 1 } }
      ]
    }
  ];
  const entries = Object.entries;
  const record = pairs => Object.fromEntries(pairs);
  const sum = values => values.reduce((total, value) => total + value, 0);
  const scale = (effects, factor) => record(entries(effects).map(([key, delta]) => [key, delta * factor]));
  const supportScale = { main: 2, secondary: 1, blame: -.5 };
  const bandwagon = 1.2;

  function initialState() {
    return {
      convocation, seats: { ...seats }, indicators: record(Object.keys(axisLabels).map(key => [key, 0])),
      modifiers: record(partyIds.map(id => [id, {}])), bills: {}, votes: [],
      government: null, crisisLog: [], snapElection: false, lastElection: null
    };
  }

  function applyEffects(state, effects) {
    const changes = {};
    for (const [key, delta] of entries(effects)) {
      if (!delta) continue;
      const before = state.indicators[key];
      const after = before + delta;
      state.indicators[key] = after;
      changes[key] = { before, after };
    }
    return changes;
  }

  function updateSupport(modifiers, id, effects, strength, allGroups = false) {
    const changes = {};
    for (const [key, sign] of entries(effects)) {
      if (!sign || !Object.hasOwn(constituencies, key)) continue;
      changes[key] = sign * strength;
    }
    if (allGroups) changes.general = strength;
    for (const [key, value] of entries(changes)) {
      modifiers[id][key] = (modifiers[id][key] ?? 0) + value;
    }
    return changes;
  }

  function tally(seats, positions) {
    const totals = { yes: 0, no: 0, abstain: 0 };
    for (const [id, count] of entries(seats)) {
      const position = positions[id];
      if (Object.hasOwn(totals, position)) totals[position] += count;
    }
    return totals;
  }

  function recordVote(state, law, positions) {
    const existing = state.bills[law.id];
    if (existing && existing !== 'second') return null;
    const reading = existing === 'second' ? 2 : 1;
    const allowed = reading === 2 ? ['yes', 'no'] : ['yes', 'no', 'abstain'];
    if (!partyIds.every(id => allowed.includes(positions[id]))) return null;
    const total = sum(Object.values(state.seats));
    const totals = tally(state.seats, positions);
    let status = 'rejected';
    if (3 * totals.yes > 2 * total) status = 'passed';
    else if (reading === 1 && 3 * totals.no < total) status = 'second';
    state.bills[law.id] = status;
    const changes = status === 'passed' ? applyEffects(state, law.effects) : {};
    const popularity = {};
    if (status !== 'second') {
      for (const [id, position] of entries(positions)) {
        const publicStance = { yes: 1, no: -1, abstain: 0 }[position];
        const authorBonus = id === law.author && status === 'passed' && position !== 'no' ? 1 : 0;
        const strength = publicStance + authorBonus;
        if (strength) popularity[id] = updateSupport(state.modifiers, id, law.effects, strength);
      }
    }
    state.votes.push({
      name: law.name, author: law.author, convocation: state.convocation,
      reading, status, seats: { ...state.seats }, positions, totals, changes,
      proposed: { ...law.effects }, popularity
    });
    return status;
  }

  function policyEffects(policy, budget, strength) {
    if (!policy.balance) return scale(policy.effects, strength);
    return budget === 0 ? {} : { budget: -Math.sign(budget) * Math.min(strength, Math.abs(budget)), welfare: Math.sign(budget) * strength };
  }

  function acceptGovernment(state, members, distribution) {
    const coalitionSeats = sum(members.map(id => state.seats[id]));
    if (state.government || state.snapElection || 2 * coalitionSeats <= sum(Object.values(state.seats))) return false;
    const validDistribution = distribution.length === bureaus.length && distribution.every((bureau, index) =>
      bureau.length >= 1 && bureau.length <= 2 &&
      new Set(bureau.map(policy => policy.author)).size === bureau.length &&
      bureau.every(policy => policy.bureau === index && members.includes(policy.author)));
    if (!validDistribution) return false;
    const effects = {};
    const policiesInForce = distribution.map(bureau => bureau.map(policy => {
      const strength = 2 / bureau.length;
      const budget = state.indicators.budget + (effects.budget ?? 0);
      const applied = policyEffects(policy, budget, strength);
      updateSupport(state.modifiers, policy.author, applied, 1);
      for (const [key, value] of entries(applied)) effects[key] = (effects[key] ?? 0) + value;
      return { id: policy.author, name: policy.name, effects: applied };
    }));
    state.government = { members, policies: policiesInForce, changes: applyEffects(state, effects) };
    return true;
  }

  function resolveCrises(state, decisions) {
    if (state.snapElection) return false;
    const recorded = new Set(state.crisisLog.filter(item => item.unanimous !== false).map(item => item.index));
    const pending = crises.map((crisis, index) => ({ crisis, index })).filter(item => !recorded.has(item.index));
    if (!pending.length || pending.some(({ crisis, index }) => !crisis.options[decisions[index]])) return false;
    for (const { crisis, index } of pending) {
      const optionIndex = decisions[index];
      const { effects } = crisis.options[optionIndex];
      const changes = applyEffects(state, effects);
      for (const id of state.government?.members ?? []) updateSupport(state.modifiers, id, effects, 1);
      state.crisisLog.push({ index, optionIndex, changes });
    }
    return true;
  }

  function dissolveGovernment(state) {
    state.government = null;
    state.snapElection = true;
  }

  function campaignModifiers(state, answers) {
    const modifiers = record(partyIds.map(id => [id, { ...state.modifiers[id] }]));
    const blame = record(partyIds.map(id => [id, 0]));
    for (const [id, { target, main, secondary }] of entries(answers)) {
      if (main) updateSupport(modifiers, id, { [main]: 1 }, supportScale.main);
      if (secondary && main !== secondary) updateSupport(modifiers, id, { [secondary]: 1 }, supportScale.secondary);
      if (target && target !== id) blame[target]++;
    }
    for (const [id, count] of entries(blame)) {
      if (count) updateSupport(modifiers, id, {}, supportScale.blame * count, true);
    }
    return { modifiers, blame };
  }

  function voteShares(modifiers, indicators) {
    const bySector = {};
    const classTotals = record(socialClasses.map(key => [key, record(partyIds.map(id => [id, 0]))]));
    const totals = record(partyIds.map(id => [id, 0]));
    const normalize = votes => {
      const total = sum(Object.values(votes));
      return record(entries(votes).map(([id, score]) => [id, total ? score / total * 100 : 0]));
    };
    const turnout = key => Math.max(.2, 1 + .05 * indicators[key]);
    for (const system of systems) {
      const humans = system.human;
      const exotics = (1 - humans) * turnout('turnoutAlien');
      const humanShare = humans / (humans + exotics);
      const weight = system.weight * (humans + exotics);
      const sector = 'Sys_' + system.name.replace('-', '');
      const sectorVotes = {};
      for (const id of partyIds) {
        const base = bonuses[id];
        const bonus = key => base[key] + (modifiers[id][key] ?? 0);
        const general = bonus(sector) + bonus('Bonus_Human') * humanShare +
          bonus('Bonus_Alien') * (1 - humanShare) + (modifiers[id].general ?? 0);
        sectorVotes[id] = 0;
        for (const key of socialClasses) {
          const classShare = system.classes[key] * (key === 'Rich' ? turnout('turnoutRich') : 1);
          const votes = Math.max(0, general + bonus(key)) * classShare * weight;
          sectorVotes[id] += votes;
          classTotals[key][id] += votes;
        }
        totals[id] += sectorVotes[id];
      }
      bySector[system.name] = normalize(sectorVotes);
    }
    return { popularity: normalize(totals), bySector, byClass: record(entries(classTotals).map(([key, scores]) => [key, normalize(scores)])) };
  }

  function electionProjection(state, answers = {}) {
    const { modifiers, blame } = campaignModifiers(state, answers);
    const support = voteShares(modifiers, state.indicators);
    const ranking = [...partyIds].sort((a, b) => support.popularity[b] - support.popularity[a]);
    const weights = record(ranking.map((id, rank) =>
      [id, support.popularity[id] * bandwagon ** (1 - Math.max(0, rank - 2) / (partyIds.length - 3))]));
    const totalSeats = sum(Object.values(state.seats));
    const minimum = Math.ceil(totalSeats * .05);
    const maximum = Math.floor(totalSeats * .333);

    // Preserve the notebook's minimum and maximum while rounding to an exact seat total.
    let low = 0;
    let high = totalSeats + 1;
    const bounded = (share, scale) => Math.min(maximum, Math.max(minimum, Math.max(share, .000001) * scale));
    while (sum(partyIds.map(id => bounded(weights[id], high))) < totalSeats) high *= 2;
    for (let i = 0; i < 64; i++) {
      const middle = (low + high) / 2;
      if (sum(partyIds.map(id => bounded(weights[id], middle))) < totalSeats) low = middle;
      else high = middle;
    }
    const allocation = partyIds.map(id => {
      const quota = bounded(weights[id], high);
      const count = Math.floor(quota);
      return { id, seats: count, remainder: quota - count };
    });
    const leftover = totalSeats - sum(allocation.map(row => row.seats));
    const priority = allocation.filter(row => row.seats < maximum).sort((a, b) => b.remainder - a.remainder);
    for (const row of priority.slice(0, leftover)) row.seats++;
    return { ...support, blame, modifiers, seats: record(allocation.map(row => [row.id, row.seats])) };
  }

  function finishElection(state, answers) {
    const { modifiers, ...result } = electionProjection(state, answers);
    state.convocation++;
    state.lastElection = { oldSeats: state.seats, ...result, convocation: state.convocation };
    state.modifiers = modifiers;
    state.seats = result.seats;
    state.government = null;
    state.bills = {};
    state.crisisLog = [];
    state.snapElection = false;
  }

  window.senateModel = {
    partyIds, axes, axisLabels, constituencies, socialClasses, laws, policies, bureaus, crises, supportScale,
    initialState, tally, recordVote, acceptGovernment, resolveCrises, dissolveGovernment, electionProjection, finishElection, sum
  };
})();
