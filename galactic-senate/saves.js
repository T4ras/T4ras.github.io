(() => {
  'use strict';

  const { partyIds, axisLabels, constituencies, socialClasses, laws, bureaus, crises, initialState, sum } = window.senateModel;
  const { systems, seats, convocation } = window.senateData;
  const { retiredAxes } = window.senateCatalog;
  const storageKey = 'new-republic-senate-v3';
  const previousKey = 'new-republic-senate-v2';
  const fileType = 'new-republic-senate';
  const fileVersion = 2;
  const slotCount = 3;
  const axisIds = Object.keys(axisLabels);
  const previousAxes = [...axisIds, ...Object.keys(retiredAxes)];
  const constituencyIds = [...Object.keys(constituencies), 'general'];
  const systemNames = systems.map(system => system.name);
  const statuses = ['passed', 'rejected', 'second'];
  const positions = ['yes', 'no', 'abstain'];
  const lawIds = laws.map(law => law.id);
  const seatCount = sum(Object.values(seats));
  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const integer = Number.isSafeInteger;
  const nonnegative = value => integer(value) && value >= 0;
  const roundNumber = value => integer(value) && value >= convocation && value < Number.MAX_SAFE_INTEGER;
  const name = value => typeof value === 'string' && value.trim().length > 0;
  const date = value => nonnegative(value) && value <= 8.64e15;
  const allowed = values => value => values.includes(value);

  function dictionary(value, keys, valid, required = false) {
    return object(value) && (!required || Object.keys(value).length === keys.length) &&
      Object.entries(value).every(([key, item]) => keys.includes(key) && valid(item));
  }

  const scores = value => dictionary(value, constituencyIds, score =>
    Number.isFinite(score) && Math.abs(score) <= Number.MAX_SAFE_INTEGER);
  const effects = value => dictionary(value, axisIds, integer);
  const isChange = change => object(change) && integer(change.before) && integer(change.after);
  const changes = value => dictionary(value, axisIds, isChange);
  const seatMap = value => dictionary(value, partyIds, nonnegative, true) && sum(Object.values(value)) === seatCount;
  const shares = value => dictionary(value, partyIds, percent => Number.isFinite(percent) && percent >= 0 && percent <= 100, true);

  function voteValid(vote) {
    return object(vote) && name(vote.name) && partyIds.includes(vote.author) && roundNumber(vote.convocation) &&
      [1, 2].includes(vote.reading) && statuses.includes(vote.status) && seatMap(vote.seats) &&
      dictionary(vote.positions, partyIds, allowed(positions), true) &&
      dictionary(vote.totals, positions, nonnegative, true) && sum(Object.values(vote.totals)) === seatCount &&
      changes(vote.changes) && effects(vote.proposed) && dictionary(vote.popularity, partyIds, scores);
  }

  function governmentValid(government) {
    if (government === null) return true;
    if (!object(government) || !Array.isArray(government.members) || !government.members.length ||
      !government.members.every(allowed(partyIds)) || !Array.isArray(government.policies) ||
      government.policies.length !== bureaus.length) return false;
    return changes(government.changes) && government.policies.every(bureau => Array.isArray(bureau) &&
      bureau.length >= 1 && bureau.length <= 2 && bureau.every(policy => object(policy) &&
        government.members.includes(policy.id) && name(policy.name) && effects(policy.effects)));
  }

  function electionValid(election) {
    return election === null || (object(election) &&
      roundNumber(election.convocation) && seatMap(election.oldSeats) && seatMap(election.seats) &&
      shares(election.popularity) && dictionary(election.blame, partyIds, nonnegative, true) &&
      dictionary(election.bySector, systemNames, shares, true) && dictionary(election.byClass, socialClasses, shares, true));
  }

  function stateValid(state) {
    return object(state) && roundNumber(state.convocation) && seatMap(state.seats) &&
      dictionary(state.indicators, axisIds, integer, true) && dictionary(state.modifiers, partyIds, scores, true) &&
      dictionary(state.bills, lawIds, allowed(statuses)) && Array.isArray(state.votes) && state.votes.every(voteValid) &&
      governmentValid(state.government) && typeof state.snapElection === 'boolean' && electionValid(state.lastElection) &&
      Array.isArray(state.crisisLog) && state.crisisLog.every(entry => object(entry) && nonnegative(entry.index) &&
        nonnegative(entry.optionIndex) && Boolean(crises[entry.index]?.options[entry.optionIndex]) && changes(entry.changes));
  }

  function mergeAxes(value, valid, combine) {
    if (!dictionary(value, previousAxes, valid)) return value;
    const merged = new Map();
    for (const [key, entry] of Object.entries(value)) {
      const target = Object.hasOwn(retiredAxes, key) ? retiredAxes[key] : key;
      merged.set(target, merged.has(target) ? combine(merged.get(target), entry) : entry);
    }
    return Object.fromEntries(merged);
  }

  const mergeValues = value => mergeAxes(value, integer, (a, b) => a + b);
  const mergeChanges = value => mergeAxes(value, isChange, (a, b) => ({
    before: a.before + b.before, after: a.after + b.after
  }));

  function upgradeState(state) {
    if (!object(state?.indicators) || !Object.keys(retiredAxes).some(key => Object.hasOwn(state.indicators, key))) return state;
    const { government, votes, crisisLog } = state;
    const upgradeChange = entry => object(entry) ? { ...entry, changes: mergeChanges(entry.changes) } : entry;
    return {
      ...state,
      indicators: mergeValues(state.indicators),
      votes: Array.isArray(votes) ? votes.map(vote =>
        object(vote) ? { ...upgradeChange(vote), proposed: mergeValues(vote.proposed) } : vote) : votes,
      crisisLog: Array.isArray(crisisLog) ? crisisLog.map(upgradeChange) : crisisLog,
      government: object(government) && Array.isArray(government.policies) ? {
        ...upgradeChange(government),
        policies: government.policies.map(bureau => Array.isArray(bureau) ? bureau.map(policy =>
          object(policy) ? { ...policy, effects: mergeValues(policy.effects) } : policy) : bureau)
      } : government
    };
  }

  const upgradeEntry = entry => object(entry) ? { ...entry, state: upgradeState(entry.state) } : entry;

  const timestamp = () => Date.now();
  const snapshot = active => ({ ...active, state: structuredClone(active.state) });
  const metadataValid = entry => object(entry) && integer(entry.run) && entry.run > 0 &&
    date(entry.savedAt) && roundNumber(entry.state?.convocation);
  const entryValid = entry => metadataValid(entry) && stateValid(entry.state);

  function checkpoint(store, replace = false) {
    const active = store.active;
    const index = store.autos.findIndex(saved => saved.run === active.run && saved.state.convocation === active.state.convocation);
    if (index >= 0 && !replace) return;
    if (index >= 0) store.autos.splice(index, 1);
    store.autos.unshift(snapshot(active));
  }

  function create(state = initialState()) {
    const store = { active: { state, run: 1, savedAt: timestamp() }, slots: Array(slotCount).fill(null), autos: [], nextRun: 2 };
    checkpoint(store);
    return store;
  }

  function read(storage) {
    const raw = storage.getItem(storageKey);
    if (raw !== null) {
      const store = JSON.parse(raw);
      if (!object(store) || !metadataValid(store.active) || !Array.isArray(store.slots) ||
        store.slots.length !== slotCount || !store.slots.every(entry => entry === null || metadataValid(entry)) ||
        !Array.isArray(store.autos) || !store.autos.every(metadataValid) ||
        !integer(store.nextRun) || ![store.active, ...store.slots.filter(Boolean), ...store.autos].every(entry => entry.run < store.nextRun)) {
        throw new Error('Неверная структура хранилища');
      }
      store.active = upgradeEntry(store.active);
      store.slots = store.slots.map(upgradeEntry);
      store.autos = store.autos.map(upgradeEntry);
      if (!entryValid(store.active)) throw new Error('Неверная структура текущего сохранения');
      return store;
    }
    const previous = storage.getItem(previousKey);
    const state = previous === null ? undefined : upgradeState(JSON.parse(previous));
    if (previous !== null && !stateValid(state)) throw new Error('Неверная структура прежнего сохранения');
    return create(state);
  }

  function commit(store, state, newConvocation) {
    store.active = { ...store.active, state, savedAt: timestamp() };
    if (newConvocation) checkpoint(store, true);
  }

  function saveSlot(store, index) {
    store.slots[index] = snapshot({ ...store.active, savedAt: timestamp() });
  }

  function start(store, state = initialState()) {
    store.active = { state, run: store.nextRun++, savedAt: timestamp() };
    checkpoint(store);
  }

  function restore(store, saved) {
    if (!entryValid(saved)) return false;
    store.active = snapshot({ ...saved, savedAt: timestamp() });
    checkpoint(store);
    return true;
  }

  function write(storage, store) {
    storage.setItem(storageKey, JSON.stringify(store));
  }

  function exportState(state) {
    return JSON.stringify({ game: fileType, version: fileVersion, state }, null, 2);
  }

  function importState(text) {
    const file = JSON.parse(text);
    if (!object(file) || file.game !== fileType || ![1, fileVersion].includes(file.version)) {
      throw new Error('Неверный формат сохранения');
    }
    const state = upgradeState(file.state);
    if (!stateValid(state)) throw new Error('Неверный формат сохранения');
    return state;
  }

  window.senateSaves = { create, read, write, commit, saveSlot, start, restore, exportState, importState };
})();
