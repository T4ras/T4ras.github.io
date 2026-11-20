window.senateCrises = {
  'I': {
    title: 'I. Родия на перепутье',
    news: 'Аграрная Родия пережила переворот. Проимперские офицеры сместили избранного губернатора. Родианцы и другие экзоты бегут в Новую Республику. Аграрные поставки нарушены, и фермеры теряют рынки сбыта. Сенат созывает чрезвычайную сессию.',
    source: 'https://docs.google.com/document/d/1pXbyiNGlOrrs5lwlRtDNRjc3m43upznt0F0b5LsVzrU/edit',
    video: 'https://drive.google.com/file/d/1E6IP2WLbINXdc5Cm1snPdkf-FyeYGFER/view',
    questions: [
      { id: 'fleet', name: 'Что делать с проимперским режимом на Родии?', options: [
        { id: 'wait', name: 'Ничего', effects: { imperial: 1, image: -1 } },
        { id: 'send', name: 'Отправить флот Республики на освобождение Родии', effects: { budget: -1 } }
      ] },
      { id: 'refugees', name: 'Что делать с беженцами-экзотами?', options: [
        { id: 'wait', name: 'Ничего', effects: { welfare: -1 } },
        { id: 'help', name: 'Помочь социальными выплатами', effects: { budget: -1, welfare: 1, Bonus_Alien: 1, turnoutAlien: 1 } },
        { id: 'restrict', name: 'Ограничить миграцию', effects: { image: -1, rights: -1, Bonus_Alien: -1 } }
      ] },
      { id: 'farms', name: 'Что делать с потерями на аграрных рынках?', options: [
        { id: 'wait', name: 'Ничего', effects: { food: -1, Farmer: -1, Sys_Танааб: -1, Sys_Ондерон: -1 } },
        { id: 'compensate', name: 'Финансово компенсировать потери фермеров', effects: { budget: -1, Farmer: 1, Sys_Танааб: 1, Sys_Ондерон: 1 } }
      ] }
    ]
  },
  'II-A': {
    title: 'II-А. Родианский референдум',
    news: 'Демократическое правительство Родии восстановлено и предлагает начать переговоры о вступлении в Новую Республику. Нейтральные секторы созвали совет на Мандалоре и объединились в Содружество Нейтральных Миров. Эмбарго Содружества на вооружение и тяжёлую промышленность Республики вызвало панику на биржах.',
    source: 'https://docs.google.com/document/d/1uKcu0bD3nVYldf3D8uhCzsEbWgMvnNp3YyRlBtN_828/edit',
    questions: [
      { id: 'accession', name: 'Начать переговоры о вхождении Родии в состав Республики?', options: [
        { id: 'negotiate', name: 'Начать переговоры при поддержке двух третей Сената', senateVote: true,
          effects: { image: 1, Bonus_Alien: 1 } },
        { id: 'decline', name: 'Не начинать переговоры', effects: {} }
      ] },
      { id: 'commonwealth', name: 'Что делать с Содружеством Нейтральных Миров?', options: [
        { id: 'wait', name: 'Ничего не делать', effects: { industry: -1 } },
        { id: 'embargo', name: 'Ввести ответное эмбарго', effects: { trade: -1, investment: -1, image: -1, Rich: -1 } },
        { id: 'intervene', name: 'Вторгнуться', effects: { budget: -1, image: -1 } }
      ] }
    ]
  },
  'II-B': {
    title: 'II-Б. Провокация Трауна',
    news: 'Империя Трауна аннексировала Родию и вышла к границе Республики. На финансовых рынках паника, банки теряют устойчивость, растёт безработица.',
    source: 'https://docs.google.com/document/d/11f6PA7t0YYnGoDY8NFSHelTrq-3gc109mQD3Ckh9ywk/edit',
    questions: [
      { id: 'strike', name: 'Отправлять флот освобождать Родию?', options: [
        { id: 'wait', name: 'Воздержаться от первого удара', effects: { imperial: 1 } },
        { id: 'send', name: 'Отправить флот', effects: { budget: -1 } }
      ] },
      { id: 'banks', name: 'Спасать банковскую систему?', options: [
        { id: 'bailout', name: 'Спасать банковскую систему', effects: { budget: -1, investment: 1, Rich: 1 } },
        { id: 'wait', name: 'Не спасать банки', effects: { investment: -1, economy: -1, Rich: -1, Middle: -1 } }
      ] },
      { id: 'jobs', name: 'Что делать с ростом безработицы?', options: [] }
    ]
  },
  'III-A': { title: 'III-А. Переговоры', questions: [] },
  'III-B': { title: 'III-Б. Торговая война', questions: [] },
  'III-C': { title: 'III-В. Вторжение в Ондерон', questions: [] },
  'III-D': { title: 'III-Г. Битва за Мандалор', questions: [] },
  'III-E': { title: 'III-Д. Империя наносит ответный удар!', questions: [] },
  'III-F': { title: 'III-Е. Республика ведёт войну', questions: [] }
};
