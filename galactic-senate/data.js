window.senateData = {
  "parties": {
    "МГ": {
      "name": "Многоликая Галактика",
      "color": "#9b59b6"
    },
    "ФГП": {
      "name": "Фронт Галактического Порядка",
      "color": "#e74c3c"
    },
    "ДУ": {
      "name": "Демократия Участия",
      "color": "#3498db"
    },
    "ДДГ": {
      "name": "Движение Другой Галактики",
      "color": "#95a5a6"
    },
    "ВС": {
      "name": "Вольные Системы",
      "color": "#e67e22"
    },
    "РРБ": {
      "name": "Радикальный Рабочий Блок",
      "color": "#c0392b"
    },
    "ВН": {
      "name": "Вечная Неймодия",
      "color": "#27ae60"
    },
    "ЛАГ": {
      "name": "Лига Аграрных Голосов",
      "color": "#6FCB12BA"
    },
    "СГ": {
      "name": "Гармония",
      "color": "#ecf0f1"
    },
    "СДК": {
      "name": "Справедливость для Каждого",
      "color": "#f1c40f"
    }
  },
  "convocation": 5,
  "seats": {
    "МГ": 105,
    "ФГП": 124,
    "ДУ": 154,
    "ДДГ": 89,
    "ВС": 86,
    "РРБ": 115,
    "ВН": 88,
    "ЛАГ": 84,
    "СГ": 51,
    "СДК": 104
  },
  "systems": [
    {
      "name": "Корусант",
      "weight": 250,
      "human": 0.7,
      "classes": {
        "Rich": 0.3,
        "Relig": 0.05,
        "Worker": 0.1,
        "Farmer": 0.0,
        "Self": 0.15,
        "Middle": 0.4
      }
    },
    {
      "name": "Кореллия",
      "weight": 180,
      "human": 0.9,
      "classes": {
        "Rich": 0.15,
        "Relig": 0.05,
        "Worker": 0.7,
        "Farmer": 0.0,
        "Self": 0.05,
        "Middle": 0.05
      }
    },
    {
      "name": "Неймодия",
      "weight": 150,
      "human": 0.05,
      "classes": {
        "Rich": 0.3,
        "Relig": 0.1,
        "Worker": 0.3,
        "Farmer": 0.1,
        "Self": 0.1,
        "Middle": 0.1
      }
    },
    {
      "name": "Чандрила",
      "weight": 140,
      "human": 0.95,
      "classes": {
        "Rich": 0.35,
        "Relig": 0.5,
        "Worker": 0,
        "Farmer": 0.1,
        "Self": 0.0,
        "Middle": 0.05
      }
    },
    {
      "name": "Танааб",
      "weight": 100,
      "human": 0.6,
      "classes": {
        "Rich": 0.05,
        "Relig": 0.15,
        "Worker": 0.1,
        "Farmer": 0.5,
        "Self": 0.1,
        "Middle": 0.1
      }
    },
    {
      "name": "Ондерон",
      "weight": 100,
      "human": 0.5,
      "classes": {
        "Rich": 0.05,
        "Relig": 0.35,
        "Worker": 0.03,
        "Farmer": 0.5,
        "Self": 0.05,
        "Middle": 0.02
      }
    },
    {
      "name": "Орд-Мантел",
      "weight": 80,
      "human": 0.4,
      "classes": {
        "Rich": 0.1,
        "Relig": 0.05,
        "Worker": 0.4,
        "Farmer": 0,
        "Self": 0.4,
        "Middle": 0.05
      }
    }
  ],
  "bonuses": {
    "МГ": {
      "Rich": -2,
      "Relig": -1,
      "Worker": 0,
      "Farmer": 0,
      "Self": 1,
      "Middle": 0,
      "Sys_Корусант": 0,
      "Sys_Кореллия": 0,
      "Sys_Неймодия": 2,
      "Sys_Чандрила": -1,
      "Sys_Танааб": 0,
      "Sys_ОрдМантел": 2,
      "Bonus_Human": -3,
      "Bonus_Alien": 7,
      "Sys_Ондерон": 0,
      "Sys_Родия": 0
    },
    "ФГП": {
      "Rich": 2,
      "Relig": 1,
      "Worker": 1,
      "Farmer": -1,
      "Self": -2,
      "Middle": 2,
      "Sys_Корусант": -1,
      "Sys_Кореллия": 1,
      "Sys_Неймодия": -3,
      "Sys_Чандрила": 2,
      "Sys_Танааб": -1,
      "Sys_ОрдМантел": -2,
      "Bonus_Human": 5,
      "Bonus_Alien": -7,
      "Sys_Ондерон": 0,
      "Sys_Родия": 0
    },
    "ДУ": {
      "Rich": 3,
      "Relig": 0,
      "Worker": 1,
      "Farmer": 0,
      "Self": 0,
      "Middle": 3,
      "Sys_Корусант": 2,
      "Sys_Кореллия": 0,
      "Sys_Неймодия": -1,
      "Sys_Чандрила": 1,
      "Sys_Танааб": -1,
      "Sys_ОрдМантел": -2,
      "Bonus_Human": 1,
      "Bonus_Alien": 2,
      "Sys_Ондерон": -1,
      "Sys_Родия": 0
    },
    "ДДГ": {
      "Rich": 1,
      "Relig": 1,
      "Worker": 1,
      "Farmer": 0,
      "Self": 2,
      "Middle": 1,
      "Sys_Корусант": 1,
      "Sys_Кореллия": 0,
      "Sys_Неймодия": 1,
      "Sys_Чандрила": 0,
      "Sys_Танааб": 1,
      "Sys_ОрдМантел": 2,
      "Bonus_Human": 0,
      "Bonus_Alien": 0,
      "Sys_Ондерон": 0,
      "Sys_Родия": 0
    },
    "ВС": {
      "Rich": 1,
      "Relig": -2,
      "Worker": 1,
      "Farmer": 0,
      "Self": 5,
      "Middle": -1,
      "Sys_Корусант": 0,
      "Sys_Кореллия": 1,
      "Sys_Неймодия": 1,
      "Sys_Чандрила": -1,
      "Sys_Танааб": 0,
      "Sys_ОрдМантел": 4,
      "Bonus_Human": 0,
      "Bonus_Alien": 0,
      "Sys_Ондерон": -1,
      "Sys_Родия": 0
    },
    "РРБ": {
      "Rich": -2,
      "Relig": -1,
      "Worker": 7,
      "Farmer": 1,
      "Self": 0,
      "Middle": 0,
      "Sys_Корусант": -1,
      "Sys_Кореллия": 3,
      "Sys_Неймодия": 0,
      "Sys_Чандрила": -1,
      "Sys_Танааб": 0,
      "Sys_ОрдМантел": 0,
      "Bonus_Human": 1,
      "Bonus_Alien": 0,
      "Sys_Ондерон": 0,
      "Sys_Родия": 0
    },
    "ВН": {
      "Rich": 1,
      "Relig": 0,
      "Worker": 0,
      "Farmer": 0,
      "Self": 0,
      "Middle": 2,
      "Sys_Корусант": -1,
      "Sys_Кореллия": -2,
      "Sys_Неймодия": 5,
      "Sys_Чандрила": -2,
      "Sys_Танааб": -2,
      "Sys_ОрдМантел": -1,
      "Bonus_Human": -3,
      "Bonus_Alien": 5,
      "Sys_Ондерон": -2,
      "Sys_Родия": -5
    },
    "ЛАГ": {
      "Rich": 0,
      "Relig": 1,
      "Worker": 1,
      "Farmer": 5,
      "Self": 0,
      "Middle": 0,
      "Sys_Корусант": -1,
      "Sys_Кореллия": -1,
      "Sys_Неймодия": 0,
      "Sys_Чандрила": 1,
      "Sys_Танааб": 3,
      "Sys_ОрдМантел": -1,
      "Bonus_Human": 0,
      "Bonus_Alien": 0,
      "Sys_Ондерон": 2,
      "Sys_Родия": 0
    },
    "СГ": {
      "Rich": 2,
      "Relig": 5,
      "Worker": 0,
      "Farmer": 1,
      "Self": -2,
      "Middle": 0,
      "Sys_Корусант": 0,
      "Sys_Кореллия": -1,
      "Sys_Неймодия": -2,
      "Sys_Чандрила": 3,
      "Sys_Танааб": 0,
      "Sys_ОрдМантел": -2,
      "Bonus_Human": 0,
      "Bonus_Alien": 0,
      "Sys_Ондерон": 1,
      "Sys_Родия": 0
    },
    "СДК": {
      "Rich": 0,
      "Relig": 1,
      "Worker": 2,
      "Farmer": 3,
      "Self": 1,
      "Middle": 1,
      "Sys_Корусант": 0,
      "Sys_Кореллия": 0,
      "Sys_Неймодия": -1,
      "Sys_Чандрила": 0,
      "Sys_Танааб": 2,
      "Sys_ОрдМантел": 0,
      "Bonus_Human": 0,
      "Bonus_Alien": 0,
      "Sys_Ондерон": 2,
      "Sys_Родия": 0
    }
  }
};
