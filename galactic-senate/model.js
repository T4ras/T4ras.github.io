(() => {
  'use strict';

  const { parties, systems, bonuses, convocation, seats } = window.senateData;
  const { axes, items } = window.senateCatalog;
  const partyIds = Object.keys(parties);
  const axisLabels = Object.assign({}, ...Object.values(axes));
  const constituencies = { ...axes.audience, ...axes.sector };
  const socialClasses = Object.keys(systems[0].classes);
  const rodia = {
    name: 'Родия', weight: systems.find(system => system.name === 'Орд-Мантел').weight, human: .1,
    classes: { Middle: .3, Farmer: .3, Self: .2, Rich: .2 / 3, Relig: .2 / 3, Worker: .2 / 3 }
  };
  const rodiaAxis = 'Sys_Родия';
  const laws = items.filter(item => item.bureau === undefined);
  const policies = items.filter(item => item.bureau !== undefined);
  const bureaus = [
    'Бюро Социальных Служб', 'Бюро Внутренних Дел',
    'Бюро Финансов и Экономики', 'Бюро Галактических Отношений'
  ];
  const crises = window.senateCrises;
  const entries = Object.entries;
  const record = pairs => Object.fromEntries(pairs);
  const sum = values => values.reduce((total, value) => total + value, 0);
  const scale = (effects, factor) => record(entries(effects).map(([key, delta]) => [key, delta * factor]));
  const supportScale = { main: 2, secondary: 1, blame: -.5 };
  const bandwagon = 1.2;

  const startingIndicators = {
    budget: -1, welfare: 1, crime: -3, army: -4, autonomy: 0, authority: 1, image: 3,
    Sys_Корусант: 3, Sys_Кореллия: 3, Sys_Неймодия: 3, Sys_Чандрила: 3, Sys_Танааб: 0, Sys_Ондерон: 0,
    Rich: 3, Worker: 1, Middle: 3, Farmer: 1, Relig: 1, Self: 0, Bonus_Human: 1, Bonus_Alien: 1
  };

  function initialState() {
    return {
      convocation, seats: { ...seats }, indicators: record(Object.keys(axisLabels).map(key => [key, startingIndicators[key] ?? 0])),
      modifiers: record(partyIds.map(id => [id, {}])), bills: {}, votes: [],
      government: null, crisisStage: 'I', nextCrisisStage: null, crisisLog: [],
      snapElection: false, lastElection: null
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
      if (!sign || (!Object.hasOwn(constituencies, key) && key !== rodiaAxis)) continue;
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

  function voteOutcome(totals, total, reading) {
    if (3 * totals.yes > 2 * total) return 'passed';
    if (reading === 1 && 3 * totals.no < total) return 'second';
    return 'rejected';
  }

  function replayVotes(state, seats) {
    const total = sum(Object.values(seats));
    const bills = new Map();
    for (const vote of state.votes) {
      if (vote.convocation !== state.convocation) continue;
      const id = vote.billId ?? vote.author + ':' + vote.name;
      const bill = bills.get(id) ?? {};
      bill.actual = { reading: vote.reading, status: vote.status };
      if (vote.reading === 1 || !bill.projected || bill.projected.status === 'second') {
        bill.projected = { reading: vote.reading, status: voteOutcome(tally(seats, vote.positions), total, vote.reading) };
      }
      bills.set(id, bill);
    }
    return [...bills.values()];
  }

  function recordVote(state, law, positions) {
    const existing = state.bills[law.id];
    if (existing && existing !== 'second') return null;
    const reading = existing === 'second' ? 2 : 1;
    const allowed = reading === 2 ? ['yes', 'no'] : ['yes', 'no', 'abstain'];
    if (!partyIds.every(id => allowed.includes(positions[id]))) return null;
    const total = sum(Object.values(state.seats));
    const totals = tally(state.seats, positions);
    const status = voteOutcome(totals, total, reading);
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
      billId: law.id, name: law.name, author: law.author, convocation: state.convocation,
      reading, status, seats: { ...state.seats }, positions, totals, changes,
      proposed: { ...law.effects }, popularity
    });
    return status;
  }

  function policyEffects(policy, budget, strength) {
    if (!policy.balance) return scale(policy.effects, strength);
    return budget === 0 ? {} : { budget: -Math.sign(budget) * Math.min(strength, Math.abs(budget)), welfare: Math.sign(budget) * strength };
  }

  function governmentMembers(distribution) {
    return [...new Set(distribution.flatMap(bureau => bureau.map(policy => policy.id)))];
  }

  function acceptGovernment(state, distribution) {
    if (state.government || state.snapElection) return false;
    const validDistribution = distribution.length === bureaus.length && distribution.every((bureau, index) =>
      bureau.length >= 1 && bureau.length <= 2 &&
      new Set(bureau.map(policy => policy.author)).size === bureau.length &&
      bureau.every(policy => policy.bureau === index && partyIds.includes(policy.author)));
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
    state.government = {
      members: governmentMembers(policiesInForce),
      policies: policiesInForce,
      changes: applyEffects(state, effects)
    };
    startCrisis(state);
    return true;
  }

  function startCrisis(state) {
    const stage = crises[state.crisisStage];
    if (!state.government || !stage.onset || state.crisisOnsetConvocation === state.convocation) return false;
    state.crisisOnsetConvocation = state.convocation;
    state.alienMultiplier = (state.alienMultiplier ?? 1) * (1 + stage.onset.alienGrowth);
    const changes = applyEffects(state, stage.onset.effects);
    archiveImpacts(state, [{
      type: 'crisis', name: stage.title, source: 'Начало кризиса',
      convocation: state.convocation, effects: appliedDeltas(changes)
    }]);
    return true;
  }

  function nextStage(stage, decisions, army) {
    const fleetReady = army >= 2;
    switch (stage) {
      case 'I':
        return decisions.fleet === 'send' && fleetReady ? 'II-A' : 'II-B';
      case 'II-A':
        if (decisions.commonwealth === 'intervene') return fleetReady ? 'III-D' : 'III-C';
        return decisions.commonwealth === 'embargo' ? 'III-B' : 'III-A';
      case 'II-B':
        return decisions.strike === 'send' ? 'III-F' : 'III-E';
      default:
        return stage;
    }
  }

  function crisisBranches(state) {
    const act = state.crisisStage.split('-')[0];
    if (!state.government || state.snapElection || act === 'I' ||
        state.crisisLog.some(entry => entry.stage === state.crisisStage)) return [];
    return Object.keys(crises).filter(key => key.startsWith(act + '-'));
  }

  function chooseCrisis(state, branch) {
    if (branch === state.crisisStage || !crisisBranches(state).includes(branch)) return false;
    state.crisisStage = branch;
    state.nextCrisisStage = null;
    startCrisis(state);
    return true;
  }

  function resolveCrises(state, decisions, senateVotes) {
    const stage = state.crisisStage;
    const recorded = state.crisisLog.some(item => item.stage === stage);
    if (state.snapElection || recorded) return false;
    const questions = crises[stage].questions.filter(question => question.options.length);
    const selected = questions.map(question => question.options.find(option => option.id === decisions[question.id]));
    if (!questions.length || selected.some(option => !option)) return false;

    const total = sum(Object.values(state.seats));
    const requiresVote = selected.some(option => option.senateVote);
    if (requiresVote && (!Number.isInteger(senateVotes) || senateVotes < 0 || senateVotes > total)) return false;
    const army = state.indicators.army;
    state.nextCrisisStage = nextStage(stage, decisions, army);

    for (const [index, question] of questions.entries()) {
      const option = selected[index];
      const passed = !option.senateVote || 3 * senateVotes >= 2 * total;
      const effects = passed ? { ...option.effects } : {};
      if (stage === 'I' && question.id === 'fleet' && option.id === 'send') {
        state.rodiaLiberators = [...(state.government?.members ?? [])];
        effects.image = army >= 2 ? 1 : -1;
      }
      const changes = applyEffects(state, effects);
      for (const id of state.government?.members ?? []) updateSupport(state.modifiers, id, effects, 1);
      const vote = option.senateVote ? { senateVotes, passed } : {};
      state.crisisLog.push({ stage, question: question.id, option: option.id, changes, ...vote });
    }
    syncRodia(state);
    return true;
  }

  function syncRodia(state) {
    if (Object.hasOwn(state.indicators, rodiaAxis)) return false;
    const archive = state.indicatorArchive ?? [];
    const accession = crises['II-A'].questions.find(question => question.id === 'accession');
    const negotiate = accession.options.find(option => option.id === 'negotiate');
    const approved = state.crisisLog.some(entry => entry.stage === 'II-A' && entry.question === 'accession' &&
      entry.option === 'negotiate' && entry.passed) || archive.some(entry => entry.type === 'crisis' &&
      entry.name === negotiate.name && entry.effects.Bonus_Alien > 0);
    if (!approved) return false;

    const fleet = crises.I.questions.find(question => question.id === 'fleet');
    const send = fleet.options.find(option => option.id === 'send');
    const liberation = archive.find(entry => entry.type === 'crisis' && entry.name === send.name);
    // Earlier saves retained the crisis decision and cabinet policies in indicator history.
    const liberators = state.rodiaLiberators ?? partyIds.filter(id => archive.some(entry => entry.type === 'policy' &&
      entry.convocation === liberation?.convocation && entry.source.endsWith(' · ' + parties[id].name)));
    state.indicators[rodiaAxis] = 0;
    for (const id of liberators) state.modifiers[id][rodiaAxis] = (state.modifiers[id][rodiaAxis] ?? 0) + 2;
    return true;
  }

  const appliedDeltas = changes => record(entries(changes).map(([id, change]) => [id, change.after - change.before]));

  function governmentImpacts(state) {
    return (state.government?.policies ?? []).flatMap((bureau, index) => bureau.map(policy => ({
      type: 'policy', name: policy.name, source: bureaus[index] + ' · ' + parties[policy.id].name,
      convocation: state.convocation, effects: policy.effects
    })));
  }

  function crisisImpacts(state) {
    return state.crisisLog.map(decision => {
      const stage = crises[decision.stage];
      const question = stage?.questions.find(item => item.id === decision.question);
      const option = question?.options.find(item => item.id === decision.option);
      return {
        type: 'crisis', name: option?.name ?? 'Решение из старого сохранения',
        source: question ? stage.title + ' · ' + question.name : 'Кризис',
        convocation: state.convocation, effects: appliedDeltas(decision.changes)
      };
    });
  }

  function archiveImpacts(state, impacts) {
    if (impacts.length) (state.indicatorArchive ??= []).push(...impacts);
  }

  function indicatorHistory(state) {
    const bills = state.votes.filter(vote => vote.status === 'passed').map(vote => ({
      type: 'bill', name: vote.name, source: parties[vote.author].name,
      convocation: vote.convocation, effects: appliedDeltas(vote.changes)
    }));
    return [...bills, ...(state.indicatorArchive ?? []), ...governmentImpacts(state), ...crisisImpacts(state)]
      .sort((a, b) => b.convocation - a.convocation);
  }

  function electionCoalition(state) {
    return state.government?.members ?? state.dissolvedCoalition ?? [];
  }

  function dissolveGovernment(state) {
    if (state.snapElection) return false;
    if (state.government) {
      const defaults = record(crises[state.crisisStage].questions.filter(question => question.options.length)
        .map(question => [question.id, question.options[0].id]));
      resolveCrises(state, defaults);
      state.dissolvedGovernment = state.government;
      state.dissolvedCoalition = [...state.government.members];
    }
    archiveImpacts(state, governmentImpacts(state));
    state.government = null;
    state.snapElection = true;
    return true;
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

  function voteShares(modifiers, { indicators = {}, alienMultiplier = 1 } = {}) {
    const bySector = {};
    const classTotals = record(socialClasses.map(key => [key, record(partyIds.map(id => [id, 0]))]));
    const totals = record(partyIds.map(id => [id, 0]));
    const normalize = votes => {
      const total = sum(Object.values(votes));
      return record(entries(votes).map(([id, score]) => [id, total ? score / total * 100 : 0]));
    };
    const activeSystems = Object.hasOwn(indicators, rodiaAxis) ? [...systems, rodia] : systems;
    for (const system of activeSystems) {
      const alienShare = system === rodia ? 1 - rodia.human : Math.min(1, (1 - system.human) * alienMultiplier);
      const humanShare = 1 - alienShare;
      const sector = 'Sys_' + system.name.replace('-', '');
      const sectorVotes = {};
      for (const id of partyIds) {
        const base = bonuses[id];
        const bonus = key => (base[key] ?? 0) + (modifiers[id][key] ?? 0);
        const general = bonus(sector) + bonus('Bonus_Human') * humanShare +
          bonus('Bonus_Alien') * alienShare + (modifiers[id].general ?? 0);
        sectorVotes[id] = 0;
        for (const key of socialClasses) {
          const votes = Math.max(0, general + bonus(key)) * system.classes[key] * system.weight;
          sectorVotes[id] += votes;
          classTotals[key][id] += votes;
        }
        totals[id] += sectorVotes[id];
      }
      bySector[system.name] = normalize(sectorVotes);
    }
    return { popularity: normalize(totals), bySector, byClass: record(entries(classTotals).map(([key, scores]) => [key, normalize(scores)])) };
  }

  function electionProjection(state, answers = {}, adjustments = {}) {
    const { modifiers, blame } = campaignModifiers(state, answers);
    const keys = [...socialClasses, ...Object.keys(axes.sector)];
    if (Object.hasOwn(state.indicators, rodiaAxis)) keys.push(rodiaAxis);
    for (const [id, steps] of entries(adjustments)) {
      for (const key of keys) {
        const previous = modifiers[id][key] ?? 0;
        const rating = (bonuses[id][key] ?? 0) + previous;
        if (rating > 0 && steps) modifiers[id][key] = previous + rating * (Math.max(-10, steps) / 10);
      }
    }
    const support = voteShares(modifiers, state);
    return { ...support, blame, modifiers, seats: allocateSeats(state.seats, support.popularity) };
  }

  function allocateSeats(currentSeats, popularity) {
    const ranking = [...partyIds].sort((a, b) => popularity[b] - popularity[a]);
    const weights = record(ranking.map((id, rank) =>
      [id, popularity[id] * bandwagon ** (1 - Math.max(0, rank - 2) / (partyIds.length - 3))]));
    const totalSeats = sum(Object.values(currentSeats));
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
    return record(allocation.map(row => [row.id, row.seats]));
  }

  function electionBaseline(state) {
    if (state.lastElection?.convocation === state.convocation) {
      const { popularity, bySector, byClass } = state.lastElection;
      return { popularity, bySector, byClass };
    }
    const { bySector, byClass } = voteShares(initialState().modifiers);
    const total = sum(Object.values(state.seats));
    const popularity = record(partyIds.map(id => [id, state.seats[id] / total * 100]));
    return { popularity, bySector, byClass };
  }

  function canCampaign(state) {
    if (state.snapElection) return true;
    if (!state.government) return false;
    const questions = crises[state.crisisStage].questions.filter(question => question.options.length);
    return questions.every(question => state.crisisLog.some(entry =>
      entry.stage === state.crisisStage && entry.question === question.id));
  }

  function finishElection(state, answers, adjustments) {
    const { modifiers, ...result } = electionProjection(state, answers, adjustments);
    archiveImpacts(state, [...governmentImpacts(state), ...crisisImpacts(state)]);
    const baseline = electionBaseline(state);
    const coalition = electionCoalition(state);
    state.convocation++;
    state.lastElection = { oldSeats: state.seats, ...result, baseline, coalition, convocation: state.convocation };
    state.modifiers = modifiers;
    state.seats = result.seats;
    state.government = null;
    state.bills = {};
    state.crisisStage = state.nextCrisisStage ?? nextStage(state.crisisStage, {}, state.indicators.army);
    state.nextCrisisStage = null;
    state.crisisLog = [];
    state.snapElection = false;
    delete state.dissolvedCoalition;
    delete state.dissolvedGovernment;
  }

  window.senateModel = {
    rodia, rodiaAxis, syncRodia, partyIds, axes, axisLabels, constituencies, socialClasses, laws, policies, bureaus, crises, supportScale,
    initialState, tally, recordVote, governmentMembers, acceptGovernment, startCrisis, crisisBranches, chooseCrisis, resolveCrises, dissolveGovernment, electionCoalition, indicatorHistory, electionProjection, electionBaseline, canCampaign, replayVotes, finishElection, sum
  };
})();
