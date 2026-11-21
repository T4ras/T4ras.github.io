window.senateCatalog = {
  "axes": {
    "republic": {
      "budget": "Федеральный бюджет",
      "welfare": "Благосостояние",
      "crime": "Преступность",
      "army": "Армия",
      "autonomy": "Автономия секторов",
      "authority": "Вера в Республику",
      "image": "Имидж Республики"
    },
    "sector": {
      "Sys_Корусант": "Корусант",
      "Sys_Кореллия": "Кореллия",
      "Sys_Неймодия": "Неймодия",
      "Sys_Чандрила": "Чандрила",
      "Sys_Танааб": "Танааб",
      "Sys_Ондерон": "Ондерон",
      "Sys_ОрдМантел": "Орд-Мантел"
    },
    "audience": {
      "Rich": "Богатые и магнаты",
      "Worker": "Рабочие",
      "Middle": "Средний класс",
      "Farmer": "Фермеры и аграрии",
      "Relig": "Политически духовные",
      "Self": "Самовольные",
      "Bonus_Human": "Люди",
      "Bonus_Alien": "Экзоты"
    }
  },
  "items": [
    {
      "id": "СГ-1",
      "name": "Отмена налогообложения для духовных организаций",
      "description": "С духовных организаций не будут собираться налоги\n\nМы предсказываем, что это повысит благосостояние, но снизит поступления в федеральный бюджет.",
      "author": "СГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.d3nm5cazaz52",
      "effects": {
        "budget": -1,
        "Relig": 1
      }
    },
    {
      "id": "СГ-2",
      "name": "Акт об разоружении",
      "description": "Республика откажется от тяжелого вооружения пехоты, и пехота станет церемониальной.\n\nМы предсказываем, что это повысит миролюбивый имидж Республики, но снизит боеспособность.",
      "author": "СГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.d3nm5cazaz52",
      "effects": {
        "image": 1,
        "army": -1,
        "Relig": 1
      }
    },
    {
      "id": "СГ-3",
      "name": "Запрет игорных организаций",
      "description": "Игорные организации будут запрещены\n\nМы предсказываем, что это снизит преступность",
      "author": "СГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.d3nm5cazaz52",
      "effects": {
        "crime": -1,
        "Self": -1
      }
    },
    {
      "id": "СГ-4",
      "name": "Эмбарго на экспорт вооружений за пределы Республики",
      "description": "Полный запрет для государственных и частных верфей, оружейных заводов и торговых гильдий Республики на продажу бластеров, боевых дроидов, истребителей и боеприпасов в нейтральные секторы и миры Внешнего Кольца.\n\nМы предсказываем, что это снизит накал локальных конфликтов на Периферии и улучшит имидж Республики, но нанесёт серьёзный удар по доходам промышленности и налоговым поступлениям.",
      "author": "СГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.d3nm5cazaz52",
      "effects": {
        "image": 1,
        "budget": -1,
        "Rich": -1
      }
    },
    {
      "id": "СГ-5",
      "name": "Ритуально-экологические стандарты для промышленности.",
      "description": "Требует от компаний проводить консультации с духовными лидерами и местными общинами при освоении новых территорий, учитывать сакральные карты и традиционные знания о земле.\n\nМы предсказываем, что это улучшит имидж Республики, но уменьшит благосостояния.",
      "author": "СГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.d3nm5cazaz52",
      "effects": {
        "image": 1,
        "welfare": -1,
        "Relig": 1,
        "Rich": -1
      }
    },
    {
      "id": "СГ-6",
      "name": "Запрет на милитаризацию научных грантов и академий Республики",
      "description": "Запрет на финансирование оборонных разработок, создание нового оружия и в академиях, получающие федеральные гранты. \nМы предсказываем, что это повысит имидж Республики, но снизит боеспособность..",
      "author": "СГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.d3nm5cazaz52",
      "effects": {
        "image": 1,
        "army": -1,
        "Relig": 1
      }
    },
    {
      "id": "СГ-b1",
      "bureau": 0,
      "name": "Поддержка духовных организаций",
      "description": "Мы собираемся заняться поддержкой духовных организаций",
      "author": "СГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.d3nm5cazaz52",
      "effects": {
        "welfare": 1,
        "Relig": 1
      }
    },
    {
      "id": "СГ-b2",
      "bureau": 1,
      "name": "Милосердные тюрьмы",
      "description": "Тюрьмы как место отбытия должны не наказывать, а реабилитировать заключенных. Мы постараемся сделать всё, чтобы они смогли искупить вину и не допускать рецидив.",
      "author": "СГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.d3nm5cazaz52",
      "effects": {
        "crime": -1,
        "Self": 1
      }
    },
    {
      "id": "СГ-b3",
      "bureau": 2,
      "name": "Выравнивание бюджета",
      "description": "От баланса бюджета зависит общая экономическая ситуация, поэтому мы проведем оптимизацию бюджета. Где-то повысим налоги, где-то уменьшим финансирование",
      "author": "СГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.d3nm5cazaz52",
      "effects": {
        "budget": 1
      }
    },
    {
      "id": "СГ-b4",
      "bureau": 3,
      "name": "Политика архивации духовных мест",
      "description": "Мы собираемся отправлять экспедиции на поддержание состояния духовных мест в нейтральных системах",
      "author": "СГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.d3nm5cazaz52",
      "effects": {
        "image": 1,
        "Relig": 1
      }
    },
    {
      "id": "МГ-1",
      "name": "Квоты на представительство",
      "description": "Все муниципальные и региональные учреждения обязаны набирать среди новых служащих не меньшую долю экзотов, чем их доля среди совершеннолетних граждан соответствующей планеты по последней переписи.\n\nНаши прогнозы говорят, что это повысит мнение о Республике среди экзотов, но снизит у части людей.",
      "author": "МГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.3noq6p6k6lha",
      "effects": {
        "Bonus_Alien": 1,
        "Bonus_Human": -1,
        "image": 1
      }
    },
    {
      "id": "МГ-2",
      "name": "Аннуляция имперских дискриминационных регистров",
      "description": "Аннулирует и запрещает использовать оставшиеся имперские регистры, которые связаны с мелкими правами\n\nНаши прогнозы говорят, что это повысит мнение о Республике среди экзотов",
      "author": "МГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.3noq6p6k6lha",
      "effects": {
        "Bonus_Alien": 1
      }
    },
    {
      "id": "МГ-3",
      "name": "Фонд культурного возрождения",
      "description": "Фонд будет заниматься поддержкой и исследованием различных культур среди экзотов\n\nНаши прогнозы говорят, что это улучшит имидж Республики, но уменьшит налоговые поступления.",
      "author": "МГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.3noq6p6k6lha",
      "effects": {
        "image": 1,
        "budget": -1,
        "Bonus_Alien": 1
      }
    },
    {
      "id": "МГ-4",
      "name": "Акт о защите родовых угодий экзотов от агромонополий",
      "description": "Введение ограничения на промышленное монокультурное земледелие на планетах с коренным населением экзотов: агрокорпорациям запрещается скупать более трети плодородных земель и океанических шельфов сектора, а при истечении срока аренды преимущественное право выкупа земли переходит к местным кланам и общинам. \n\nНаши прогнозы говорят, что это улучшит мнение о Республике среди экзотов, но снизит таковые у магнатов.",
      "author": "МГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.3noq6p6k6lha",
      "effects": {
        "Bonus_Alien": 1,
        "Rich": -1,
        "Farmer": -1
      }
    },
    {
      "id": "МГ-5",
      "name": "Моновидовые экзотские батальоны",
      "description": "Текущая боевые подразделения Республики набираются без взгляда на вид. Это неправильно в случае с экзотами, так как многим экзотским видам нужны особые условия и было бы эффективнее собирать батальон из одного вида.\n\nНаши прогнозы говорят, что это улучшит боеспособность Республики",
      "author": "МГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.3noq6p6k6lha",
      "effects": {
        "army": 1,
        "Bonus_Alien": 1
      }
    },
    {
      "id": "МГ-6",
      "name": "Запрет на терраформирование населенных миров",
      "description": "Введение жёсткого моратория на изменение атмосферы и климата планет, имеющих коренное разумное население, даже если эти миры считаются малонаселёнными или непригодными для большинства существ.\n\nНаши прогнозы говорят, что повысит мнение экзотов о Республике, но не очень понравится магнатам.",
      "author": "МГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.3noq6p6k6lha",
      "effects": {
        "Bonus_Alien": 1,
        "Rich": -1
      }
    },
    {
      "id": "МГ-b1",
      "bureau": 0,
      "name": "Поддержка организаций культурного многообразия",
      "description": "Мы собираемся заняться поддержкой организаций культурного многообразия",
      "author": "МГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.3noq6p6k6lha",
      "effects": {
        "Bonus_Alien": 1,
        "image": 1
      }
    },
    {
      "id": "МГ-b2",
      "bureau": 1,
      "name": "Очистка Бюро от антропоцентричных предрассудков",
      "description": "Текущее Бюро хоть и прошло множество реформ, но антропоцентричные предрассудки никуда не делись.",
      "author": "МГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.3noq6p6k6lha",
      "effects": {
        "Bonus_Alien": 1,
        "image": 1,
      }
    },
    {
      "id": "МГ-b3",
      "bureau": 2,
      "name": "Экономика справедливости",
      "description": "Мы собираемся сделать налогообложение более прогрессивным чтобы сократить неравенство",
      "author": "МГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.3noq6p6k6lha",
      "effects": {
        "welfare": 1,
        "Worker": 1,
        "Rich": -1
      }
    },
    {
      "id": "МГ-b4",
      "bureau": 3,
      "name": "Контакты с экзотскими мирами",
      "description": "Мы собираемся налаживать контакты с нейтральными экзотскими мирами.",
      "author": "МГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.3noq6p6k6lha",
      "effects": {
        "image": 1,
        "Bonus_Alien": 1
      }
    },
    {
      "id": "ЛАГ-1",
      "name": "Перенос части ведомств из Корусанта в другие системы",
      "description": "Переносит некоторые Бюро и их филиалы из Корусанта в Танааб и Ондерон\n\nНаши аналитики предсказывают, что это улучшит финансовое положение Танааба и Ондерона, слегка снимет нагрузку с бюджета, но слегка ухудшит финансовое положение Корусанта.",
      "author": "ЛАГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.4q0imc9je728",
      "effects": {
        "Sys_Корусант": -1,
        "Sys_Танааб": 2,
        "Sys_Ондерон": 2,
        "budget": 1
      }
    },
    {
      "id": "ЛАГ-2",
      "name": "Квоты на долю локальных продуктов в государственных закупках",
      "description": "Вводит квоты на долю локальных продуктов в государственных закупках\n\nНаши прогнозы говорят, что это снизит общее благосостояние, но фермеры выиграют",
      "author": "ЛАГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.4q0imc9je728",
      "effects": {
        "welfare": -1,
        "Farmer": 1
      }
    },
    {
      "id": "ЛАГ-3",
      "name": "Акт о топливных и технических субсидиях для аграрных секторов",
      "description": "Установление фиксированного льготного тарифа на гиперпространственное топливо, реакторные стержни и стандартные узлы для грузовых барж и планетарной техники, зарегистрированных в аграрных секторах.\n\nНаши аналитики предсказывают, что это улучшит благосостояние фермеров, но станет бременем для бюджета.",
      "author": "ЛАГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.4q0imc9je728",
      "effects": {
        "Farmer": 1,
        "Sys_Танааб": 1,
        "Sys_Ондерон": 1,
        "budget": -1
      }
    },
    {
      "id": "ЛАГ-4",
      "name": "Планетарные Фонды Продовольственной Безопасности",
      "description": "Бюро Финансов и Экономики будет гарантировать приемлимую цену продажи для фермеров и агрокорпораций, и приемлимую цену покупки для рабочих гильдий.\n\nМы прогнозируем, что это увеличит благосостояние, но станет бременем для бюджета.",
      "author": "ЛАГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.4q0imc9je728",
      "effects": {
        "welfare": 1,
        "budget": -1,
        "Farmer": 1,
        "Worker": 1,
      }
    },
    {
      "id": "ЛАГ-5",
      "name": "Акт о запрете синтетического и клеточного мяса",
      "description": "Полный запрет на производство, импорт и продажу в Новой Республике мясных и молочных суррогатов, выращенных в биореакторах из клеточных культур, а также запрет на использование слов «мясо», «молоко» и «сыр» для растительных и химических имитаций.\n\nНаши аналитики предсказывают, что это защитит животноводческие секторы от демпинга со стороны биотех-корпораций, но повысит цены на белковые продукты в мегаполисах Ядра.",
      "author": "ЛАГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.4q0imc9je728",
      "effects": {
        "Farmer": 1,
        "Sys_Танааб": 1,
        "Sys_Ондерон": 1,
        "Sys_Корусант": -1,
        "Sys_Чандрила": 1,
        "Rich": -1
      }
    },
    {
      "id": "ЛАГ-6",
      "name": "Акт о защите земельного фонда от внешнего капитала",
      "description": "Полный запрет для граждан и корпораций из нейтральных систем на покупку или долгосрочную аренду сельскохозяйственных земель на планетах Новой Республики.\n\nНаши аналитики предсказывают, что это снизит приток капитала и создаст дыру в бюджете, ухудшит имидж Республики, но фермеры и богатые граждане Республики выиграют.",
      "author": "ЛАГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.4q0imc9je728",
      "effects": {
        "budget": -1,
        "image": -1,
        "Farmer": 1,
        "Rich": 1
      }
    },
    {
      "id": "ЛАГ-b1",
      "bureau": 0,
      "name": "Прикладное образование",
      "description": "Мы собираемся отойти от курса внедрения про-республиканских идей в образовательную систему.\nОбразовательная система станет более непредвзятой и будет больше времени тратить на прикладные навыки.",
      "author": "ЛАГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.4q0imc9je728",
      "effects": {
        "authority": -1,
        "Farmer": 1,
        "Middle": 1
      }
    },
    {
      "id": "ЛАГ-b2",
      "bureau": 1,
      "name": "Патрулирование торговых путей",
      "description": "Мы собираемся оптимизировать расписание полицейских миссий, чтобы те отдавали предпочтение защите торговых путей",
      "author": "ЛАГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.4q0imc9je728",
      "effects": {
        "crime": -1,
        "Farmer": 1
      }
    },
    {
      "id": "ЛАГ-b3",
      "bureau": 2,
      "name": "Выравнивание бюджета",
      "description": "Если есть излишек, мы снизим налоги и повысим финансирование федеральных программ\nЕсли есть дефицит, мы повысим налоги и снизим финансирование федеральных программ.",
      "author": "ЛАГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.4q0imc9je728",
      "effects": {},
      "balance": true
    },
    {
      "id": "ЛАГ-b4",
      "bureau": 3,
      "name": "Пошлины на продовольствие и агротовары из-за пределов Республики",
      "description": "Агрокорпорации из нейтральных систем создают лишнюю конкуренцию для наших фермеров, лишая их благосостояния.\nМы должны повысить пошлины на импорт продовольствия и агротоваров.",
      "author": "ЛАГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.4q0imc9je728",
      "effects": {
        "Farmer": 1,
        "budget": 1,
        "image": -1,
        "Worker": -1,
        "Self": -1,
        "Middle": -1
      }
    },
    {
      "id": "ВС-1",
      "name": "Акт о поддержке малого и среднего предпринимательства секторов",
      "description": "Снижение административной отчётности, упрощение лицензирования и введение льготной налоговой ставки для независимых торговых перевозчиков, семейных мастерских и кооперативов.\n\nНаши аналитики прогнозируют, что это укрепит средний класс и повысит деловую активность, но слегка сократит налоговые поступления в краткосрочной перспективе.",
      "author": "ВС",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.sm2jpgyz4f60",
      "effects": {
        "Middle": 1,
        "Self": 1,
        "budget": -1
      }
    },
    {
      "id": "ВС-2",
      "name": "Ограничение срока отраслевых субсидий",
      "description": "Любые субсидии отдельным отраслям автоматически прекращаются спустя несколько лет и требуют повторного подтверждения Бюро Финансов и Экономики для продолжения.\n\nНаши аналитики прогнозируют, что это улучшит положение бюджета, но сделает положение получателей субсидий менее предсказуемым.",
      "author": "ВС",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.sm2jpgyz4f60",
      "effects": {
        "budget": 1,
        "Farmer": -1,
        "Rich": -1,
        "Sys_Неймодия": -1
      }
    },
    {
      "id": "ВС-3",
      "name": "Открытый доступ к коммерческим космопортам",
      "description": "Владельцы крупных коммерческих космопортов обязаны обслуживать независимых перевозчиков по опубликованным тарифам. Запрещается резервировать всю пропускную способность исключительно для собственной торговой гильдии.",
      "author": "ВС",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.sm2jpgyz4f60",
      "effects": {
        "Self": 1,
        "Middle": 1,
        "Rich": -1
      }
    },
    {
      "name": "Планетарные патрули из республиканского резерва",
      "description": "Передача части лёгких республиканских кораблей планетарным службам безопасности. Миры оплачивают их содержание и используют против пиратов, но обязуются предоставить корабли для общей обороны при нападении на Республику.\n\nАналитики ожидают, что это слегка снизит боеспособность Республики, но улучшит ситуацию на торговых путях.",
      "author": "ВС",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.sm2jpgyz4f60",
      "id": "ВС-4",
      "effects": {
        "army": -1,
        "crime": -1,
        "autonomy": 1,
        "Self": 1
      }
    },
    {
      "name": "Плата за перемещение по гиперпространственным магистралям для внешних звездолётов",
      "description": "Вводится плата за пользование гиперпространственными магистралями для каждого корабля, не зарегистрированного в реестре кораблей Республики\n\nАналитики ожидают, что это улучшит ситуацию с бюджетом, но снизит имидж Республики",
      "author": "ВС",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.sm2jpgyz4f60",
      "id": "ВС-5",
      "effects": {
        "budget": 1,
        "image": -1,
        "Self": -1
      }
    },
    {
      "name": "Акт о гуманном регулировании оборота спайса и медицинской реабилитации",
      "description": "Хранение малых доз одурманивающих разновидностей спайса для личного употребления больше не наказывается тюремным заключением. Подобные случаи передаются в ведение планетарных медицинских комиссий, которые назначают программы помощи и административные взыскания. Нелегальная добыча, синтез и контрабандный сбыт по-прежнему караются как тяжкие преступления против Республики.\n\nАналитики ожидают, что это улучшит безопасность на торговых путях и будет популярно среди самовольных",
      "author": "ВС",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.sm2jpgyz4f60",
      "id": "ВС-6",
      "effects": {
        "crime": -1,
        "Self": 1
      }
    },
    {
      "id": "ВС-b1",
      "bureau": 0,
      "name": "Непредвзятые Социальные Службы",
      "description": "Мы создадим постоянные площадки для переговоров между планетарными работодателями, рабочими гильдиями и местными властями.",
      "author": "ВС",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.sm2jpgyz4f60",
      "effects": {
        "welfare": 1,
        "Middle": 1,
        "Worker": 1,
        "Rich": 1
      }
    },
    {
      "id": "ВС-b2",
      "bureau": 1,
      "name": "Уполномочивание планетарных служб безопасности",
      "description": "Мы заберем часть полномочий федеральных полицейских служб в пользу местных планетарных служб безопаности.",
      "author": "ВС",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.sm2jpgyz4f60",
      "effects": {
        "autonomy": 1,
        "Self": 1
      }
    },
    {
      "id": "ВС-b3",
      "bureau": 2,
      "name": "Выравнивание бюджета",
      "description": "Если есть излишек, мы снизим налоги и повысим финансирование федеральных программ\nЕсли есть дефицит, мы повысим налоги и снизим финансирование федеральных программ.",
      "author": "ВС",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.sm2jpgyz4f60",
      "effects": {},
      "balance": true
    },
    {
      "id": "ВС-b4",
      "bureau": 3,
      "name": "Сдержанная внешняя политика",
      "description": "Мы будем избегать как военных авантюр, так и каких-либо торговых переговоров, поддерживая текущий дипломатический баланс в Галактике.",
      "author": "ВС",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.sm2jpgyz4f60",
      "effects": {}
    },
    {
      "id": "ДУ-1",
      "name": "Всеобщий галактический чек на образование",
      "description": "Предоставление каждому гражданину Республики именных образовательных сертификатов, принимаемых Академиями и институтами любых секторов.\nНаши аналитики прогнозируют, что это повысит уровень благосостояния, но вызовет серьёзную нагрузку на республиканский бюджет.",
      "author": "ДУ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.iq7gtn2rws61",
      "effects": {
        "welfare": 1,
        "budget": -1,
        "Middle": 1
      }
    },
    {
      "id": "ДУ-2",
      "name": "Закон о демилитаризации гражданского и торгового судоходства",
      "description": "Запрет на установку тяжелых турболазеров, ионных орудий большого калибра и протонных торпед на частные и корпоративные корабли. \nНаши аналитики прогнозируют, что это улучшит миролюбивый имидж Республики, но оставит торговые суда уязвимыми перед хорошо вооружёнными пиратами.",
      "author": "ДУ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.iq7gtn2rws61",
      "effects": {
        "image": 1,
        "crime": 1,
        "Self": -1
      }
    },
    {
      "id": "ДУ-3",
      "name": "Акт о проведении политики разрядки",
      "description": "Учреждение специальной галактической программы разрядки, в рамках которой члены незаконных вооружённых формирований, наёмники и пираты могут добровольно сдать тяжёлое корабельное вооружение, бластеры и военную технику в пункты приёма. В обмен они получают единоразовую денежную компенсацию по фиксированному тарифу и иммунитет от преследования за прошлые ненасильственные преступления.\nМы прогнозируем что это снизит преступность, и улучшит миролюбивый имидж Республики.",
      "author": "ДУ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.iq7gtn2rws61",
      "effects": {
        "crime": -1,
        "image": 1,
        "Self": 1
      }
    },
    {
      "id": "ДУ-4",
      "name": "Акт о единой галактической инспекции и стандартизации межсистемной торговли",
      "description": "Учреждение централизованного сенатского органа для обязательной сертификации товаров, финансового аудита трансграничных сделок и ведения единого реестра коммерческих перевозчиков Новой Республики.\n\nНаши аналитики прогнозируют, что это улучшит благосостояние и уменьшит преступность.",
      "author": "ДУ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.iq7gtn2rws61",
      "effects": {
        "welfare": 1,
        "crime": -1,
        "Middle": 1
      }
    },
    {
      "id": "ДУ-5",
      "name": "Налоговые льготы за инвестиции в социальные проекты",
      "description": "Создание налоговых льгот для тех лиц, что регулярно и крупными суммами инвестируют в социальные проекты\n\nНаши аналитики прогнозируют, что это улучшит благосостояние и понравится богатым.",
      "author": "ДУ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.iq7gtn2rws61",
      "effects": {
        "welfare": 1,
        "Rich": 1
      }
    },
    {
      "id": "ДУ-6",
      "name": "Акт о защите интеллектуальной собственности и мирных инноваций",
      "description": "Введение единого на всей территории Новой Республики строгого патентного права, удлиняющего срок действия авторских прав и промышленных лицензий до пятидесяти лет с автоматическим взысканием крупных компенсаций за любое нелицензионное копирование технологий.\nНаши аналитики прогнозируют, что это увеличит благосостояние и понравится богатым и среднему классу.",
      "author": "ДУ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.iq7gtn2rws61",
      "effects": {
        "Rich": 1,
        "Middle": 1
      }
    },
    {
      "id": "ДУ-b1",
      "bureau": 0,
      "name": "Про-республиканское образование",
      "description": "Мы собираемся продолжать модернизацию учебных программ и внедрять в них Республиканские идеи.",
      "author": "ДУ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.iq7gtn2rws61",
      "effects": {
        "image": 1,
        "Middle": 1,
        "authority": 1
      }
    },
    {
      "id": "ДУ-b2",
      "bureau": 1,
      "name": "Беспристрастные бюрократические процедуры",
      "description": "Мы собираемся оставить всё как есть и продолжать текущий республиканский курс с упором на повышение доверия к республиканской системе.",
      "author": "ДУ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.iq7gtn2rws61",
      "effects": {
        "authority": 1,
        "Middle": 1
      }
    },
    {
      "id": "ДУ-b3",
      "bureau": 2,
      "name": "Выравнивание бюджета",
      "description": "Если есть излишек, мы снизим налоги и повысим финансирование федеральных программ\nЕсли есть дефицит, мы повысим налоги и снизим финансирование федеральных программ.",
      "author": "ДУ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.iq7gtn2rws61",
      "effects": {},
      "balance": true
    },
    {
      "id": "ДУ-b4",
      "bureau": 3,
      "name": "Политика разоружения и дипломатии",
      "description": "Мы собираемся проводить дипломатические форумы с руководствами нейтральных систем для убеждения того, что времена Империи прошли и текущая Республика - мирный и свободный проект.",
      "author": "ДУ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.iq7gtn2rws61",
      "effects": {
        "image": 1,
        "Relig": 1
      }
    },
    {
      "id": "ВН-1",
      "name": "Легализация боевых дроидов",
      "description": "Снятие запрета на производство и эксплуатацию боевых дроидов.\n\nНаши аналитики прогнозируют, что это кардинально обезопасит торговые маршруты и сделает Республику куда более вооруженной.",
      "author": "ВН",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.tyv7xprwv43z",
      "effects": {
        "crime": -1,
        "army": 1,
        "Sys_Неймодия": 1
      }
    },
    {
      "id": "ВН-2",
      "name": "Налоговые льготы для торговых домов",
      "description": "Введение специальных налоговых освобождений и нулевой ставки налога на выведенную прибыль для зарегистрированных межсекторных торговых гильдий.\n\nНаши аналитики прогнозируют, что это ускорит товарооборот и приумножит состояния магнатов, но снизит прямые поступления в бюджет Республики.",
      "author": "ВН",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.tyv7xprwv43z",
      "effects": {
        "Rich": 1,
        "Sys_Неймодия": 1,
        "budget": -1
      }
    },
    {
      "id": "ВН-3",
      "name": "Создание Независимой Арбитражной Палаты",
      "description": "Учреждение коммерческого суда на Неймодии для рассмотрения споров между корпорациями и секторами в обход судов общей юрисдикции Республики.\n\nНаши аналитики прогнозируют, что это приумножит состояние магнатов и сделать Республику более децентрализованной.",
      "author": "ВН",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.tyv7xprwv43z",
      "effects": {
        "autonomy": 1,
        "Rich": 1,
        "Sys_Неймодия": 1
      }
    },
    {
      "id": "ВН-4",
      "name": "Создание свободного регистра космических транспортных средств",
      "description": "Возможность регистрации торговых кораблей в реестре Республике по упрощенной схеме с минимальными требованиями к составу экипажа и техосмотру.\nНаши аналитики прогнозируют, что это выведет много самовольных из серой зоны, но вызовет опасения за безопасность судоходства.",
      "author": "ВН",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.tyv7xprwv43z",
      "effects": {
        "Self": 1,
        "crime": 1
      }
    },
    {
      "id": "ВН-5",
      "name": "Отмена обязательной отчетности для экспорта оружия",
      "description": "Ликвидирование требований к лицензированию и раскрытию конечных получателей при продаже оборонной продукции частными верфями и заводами за пределы Республики.\nНаши аналитики прогнозируют, что это принесёт колоссальные прибыли неймодианским оружейным концернам, но создаст риски попадания оружия к синдикатам и неоимперцам.",
      "author": "ВН",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.tyv7xprwv43z",
      "effects": {
        "Rich": 1,
        "Sys_Неймодия": 1,
        "crime": 1
      }
    },
    {
      "id": "ВН-6",
      "name": "Закон о стандартизации трудовых контрактов",
      "description": "Введение единого общереспубликанского стандарта трудовых договоров и условий труда без учёта видовых, культурных и религиозных особенностей экзотов.\nНаши аналитики прогнозируют, что это существенно снизит издержки корпораций, но снизит веру экзотов в Республику.",
      "author": "ВН",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.tyv7xprwv43z",
      "effects": {
        "Rich": 1,
        "Bonus_Alien": -1
      }
    },
    {
      "id": "ВН-b1",
      "bureau": 0,
      "name": "Про-экзотская социальная реклама",
      "description": "В общество всё ещё осталось предубеждение против экзотов с времён Империи. Мы хотим это исправить. Закажем сообщения Голонета о неймодианских изобретателях, врачах и торговцах.",
      "author": "ВН",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.tyv7xprwv43z",
      "effects": {
        "Bonus_Alien": 1,
        "Sys_Неймодия": 1
      }
    },
    {
      "id": "ВН-b2",
      "bureau": 1,
      "name": "Упрощение выдачи разрешений на работу",
      "description": "Мы собираемся ускорить выдачу разрешений на работу, чтобы увеличить предложение рабочей силы.",
      "author": "ВН",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.tyv7xprwv43z",
      "effects": {
        "Rich": 1
      }
    },
    {
      "id": "ВН-b3",
      "bureau": 2,
      "name": "Снижение налогов на роскошь",
      "description": "Мы собираемся снизить налоги на роскошь, благодаря чему её сбыт станет прибыльней.",
      "author": "ВН",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.tyv7xprwv43z",
      "effects": {
        "budget": -1,
        "Rich": 1
      }
    },
    {
      "id": "ВН-b4",
      "bureau": 3,
      "name": "Экспортно-ориентированная внешняя политика",
      "description": "Мы собираемся при помощи дипломатических мер открывать новые рынки сбыта и перестраивать внешнюю политику под торговые нужды",
      "author": "ВН",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.tyv7xprwv43z",
      "effects": {
        "image": 1,
        "Sys_Неймодия": 1,
        "Sys_Кореллия": 1,
        "Rich": 1
      }
    },
    {
      "id": "ФГП-1",
      "name": "Ограничение избирательных прав осужденных",
      "description": "Лица, осуждённые за убийство, работорговлю, пиратство с насилием и прочие тяжелые преступления, навсегда лишаются права голосовать и участвовать в сенатских выборах. \n\nНаши аналитики прогнозируют, что это очистит электорат то синдикатов.",
      "author": "ФГП",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.6cp3t0l83qig",
      "alienShareFactor": 0.9,
      "effects": {
        "Self": -1
      }
    },
    {
      "id": "ФГП-2",
      "name": "Акт о регистрации внереспубликанских торговых организаций",
      "description": "Обязательное лицензирование, финансовый аудит и аккредитация любых торговых предприятий и гильдий из независимых систем, работающих в пространстве Республики.\nНаши аналитики прогнозируют, что это поставит под контроль теневые финансовые потоки и поможет с преступностью, но скажется на благосостоянии.",
      "author": "ФГП",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.6cp3t0l83qig",
      "effects": {
        "crime": -1,
        "welfare": -1,
        "Self": -1
      }
    },
    {
      "id": "ФГП-3",
      "name": "Единый стандарт образования",
      "description": "Введение обязательной централизованной учебной программы во всех секторах с акцентом на историю Республики, правопорядок и гражданский долг.\nНаши аналитики прогнозируют, что это укрепит Республиканскую идентичность и уважение к закону, но экзотам и духовным очень не понравится.",
      "author": "ФГП",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.6cp3t0l83qig",
      "effects": {
        "welfare": 1,
        "authority": 1,
        "Bonus_Alien": -1,
        "Relig": -1
      }
    },
    {
      "id": "ФГП-4",
      "name": "Закон о защите Республиканских символов",
      "description": "Установление уголовной ответственности за публичные призывы к насильственному свержению институтов Республики и осквернение Республиканских символов.\nНаши аналитики прогнозируют, что это укрепит авторитет власти и государственных институтов.",
      "author": "ФГП",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.6cp3t0l83qig",
      "effects": {
        "authority": 1,
        "Bonus_Human": 1
      }
    },
    {
      "id": "ФГП-5",
      "name": "Централизация системы исполнения наказаний",
      "description": "Передача всех мест заключения, тюремных станций и исправительных колоний из ведения местных властей под прямое подчинение Бюро Внутренних Дел.\nНаши аналитики прогнозируют, что это позволит легче раскрывать преступные синдикаты, но снизит правовые полномочия автономий.",
      "author": "ФГП",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.6cp3t0l83qig",
      "effects": {
        "crime": -1,
        "autonomy": -1,
        "Self": -1
      }
    },
    {
      "id": "ФГП-6",
      "name": "Конфискация имущества за тяжелые преступления",
      "description": "По приговору за убийство по найму, работорговлю, пиратство с насилием, вооружённый мятеж и прочие тяжелые преступления, конфискуется всё имущество осуждённого. \n\nНаши аналитики прогнозируют, что это снизит преступность, но очень не понравится самовольным.",
      "author": "ФГП",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.6cp3t0l83qig",
      "effects": {
        "crime": -1,
        "Self": -1
      }
    },
    {
      "id": "ФГП-b1",
      "bureau": 0,
      "name": "Внедрять антропоцентрические идеи в систему образования",
      "description": "В учебных материалах, которые закупает Бюро, сделаем упор на человеческих деятелей и единые человеческие нормы жизни. Имперская идеология была не столь ужасной.",
      "author": "ФГП",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.6cp3t0l83qig",
      "effects": {
        "Bonus_Alien": -1,
        "Bonus_Human": 1
      }
    },
    {
      "id": "ФГП-b2",
      "bureau": 1,
      "name": "Укрупнение полицейской системы",
      "description": "Мы собираемся проводить политику укрупнения полицейской системы для безопасности граждан и торговых путей.",
      "author": "ФГП",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.6cp3t0l83qig",
      "effects": {
        "crime": -1,
        "autonomy": -1,
        "Bonus_Human": 1
      }
    },
    {
      "id": "ФГП-b3",
      "bureau": 2,
      "name": "Урезать финансирование программ, нацеленных на экзотов",
      "description": "Экзоты за нас не голосуют и нас не любят. Чем меньше будет их явка, тем больше на следующих выборах мы наберем.",
      "author": "ФГП",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.6cp3t0l83qig",
      "effects": {
        "budget": 1,
        "Bonus_Alien": -1
      }
    },
    {
      "id": "ФГП-b4",
      "bureau": 3,
      "name": "Укреплять флот и проводить учения",
      "description": "Мы должны повышать боеспособность Республики в такие темные времена.",
      "author": "ФГП",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.6cp3t0l83qig",
      "effects": {
        "army": 1,
        "budget": -1,
        "Bonus_Human": 1
      }
    },
    {
      "id": "ДДГ-1",
      "name": "Амнистия для конфедератов и имперцев в прошлом",
      "description": "Полное юридическое помилование и снятие ограничений с бывших деятелей КНС, гражданских служащих Империи и участников региональных ополчений.\nНаши аналитики прогнозируют, что это снизит градус социальной вражды и вернёт ценные кадры в экономику.",
      "author": "ДДГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.gd8dozedfw7g",
      "effects": {
        "Self": 1
      }
    },
    {
      "id": "ДДГ-2",
      "name": "Дерегуляция банковской системы",
      "description": "Ликвидация абсолютно всех существующих сейчас банковских регуляций, в том числе обязательного резервирования и ограничения на риск.\nНаши аналитики прогнозируют, что это привлечет частные инвестиции и закроет дыру в бюджете",
      "author": "ДДГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.gd8dozedfw7g",
      "effects": {
        "budget": 1,
        "Rich": 1
      }
    },
    {
      "id": "ДДГ-3",
      "name": "Легализация и лицензирование наёмнических гильдий",
      "description": "Создание прозрачного реестра для гильдий наёмников, охотников за головами и частных охранных предприятий с правом заключения прямых контрактов с системами.\nНаши аналитики прогнозируют, что это улучшит ситуацию с пиратством и закроет дыру в бюджете",
      "author": "ДДГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.gd8dozedfw7g",
      "effects": {
        "crime": -1,
        "budget": 1,
        "Self": 1
      }
    },
    {
      "id": "ДДГ-4",
      "name": "Акт о свободе инвестиций из независимых секторов",
      "description": "Снятие любых юридических барьеров и проверок происхождения капитала при инвестициях из не входящих в Республику систем в местную инфраструктуру.\nНаши аналитики прогнозируют, что это привлечет колоссальные частные средства, но создаст проблему с неотслеживаемой преступностью.",
      "author": "ДДГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.gd8dozedfw7g",
      "effects": {
        "crime": 1,
        "Rich": 1
      }
    },
    {
      "id": "ДДГ-5",
      "name": "Квота на возврат секторного налогообложения",
      "description": "Федеральная Канцелярия обязывается возвращать треть собранных налогов в секторы, из которых налоги были собраны.\n\nПрогнозируется, что это сделает секторы более автономными, но серьезно скажется на федеральном бюджете.",
      "author": "ДДГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.gd8dozedfw7g",
      "effects": {
        "autonomy": 1,
        "budget": -1,
        "Self": 1
      }
    },
    {
      "id": "ДДГ-6",
      "name": "Закон о Демилитаризации секторов",
      "description": "Ограничение права регулярного флота Республики находиться в системах автономий в мирное время\n\nПрогнозируется, что это сделает секторы более автономными и создаст Республике менее грозный имидж в галактике.",
      "author": "ДДГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.gd8dozedfw7g",
      "effects": {
        "autonomy": 1,
        "image": 1,
        "Self": 1
      }
    },
    {
      "id": "ДДГ-b1",
      "bureau": 0,
      "name": "Радикальная экономия",
      "description": "Мы закроем множество социальных служб среди тех, что не являются необходимыми.",
      "author": "ДДГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.gd8dozedfw7g",
      "effects": {
        "budget": 1,
        "welfare": -1,
        "Worker": -1
      }
    },
    {
      "id": "ДДГ-b2",
      "bureau": 1,
      "name": "Политика разрешения",
      "description": "Мы ослабим требования к любой бюрократии и намного чаще начнем выдавать положительные решения",
      "author": "ДДГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.gd8dozedfw7g",
      "effects": {
        "autonomy": 1,
        "Self": 1
      }
    },
    {
      "id": "ДДГ-b3",
      "bureau": 2,
      "name": "Поддержка небольших мастерских и торговых домов",
      "description": "Мы перенаправим налоговую нагрузку с небольших мастерских и торговых домов на крупные.",
      "author": "ДДГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.gd8dozedfw7g",
      "effects": {
        "Middle": 1,
        "Self": 1,
        "Rich": -1
      }
    },
    {
      "id": "ДДГ-b4",
      "bureau": 3,
      "name": "Соглашения об отмене пошлин",
      "description": "Множество нейтральных систем собирают таможенные пошлины с товаров наших производителей. Мы должны договариваться об беспошлинных соглашениях.",
      "author": "ДДГ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.gd8dozedfw7g",
      "effects": {
        "image": 1,
        "Rich": 1,
        "Self": 1
      }
    },
    {
      "id": "РРБ-1",
      "name": "Введение налога на сверхбогатство и элитную собственность",
      "description": "Установление прогрессивной шкалы налогообложения элитных поместий на мирах Ядра, частных яхт-шаттлов и гигантских личных капиталов, превышающих средний доход Республики в тысячу раз.\nНаши аналитики прогнозируют, что это пополнит бюджет за счёт магнатов, но вызовет отток частных инвестиций в независимые секторы.",
      "author": "РРБ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.jj74t9h2qcnx",
      "effects": {
        "budget": 1,
        "Rich": -1
      }
    },
    {
      "id": "РРБ-2",
      "name": "Национализация Кореллианских Доков",
      "description": "Передача активов Кореллианской машиностроительной корпорации под прямой контроль Галактического профсоюзного совета без выплаты компенсаций частным акционерам.\nНаши аналитики прогнозируют, что это устранит корпоративные наценки на транспорт, улучшит положение рабочих и позволит сделать Республику более вооруженной, но спровоцирует панику на финансовых биржах Ядра.",
      "author": "РРБ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.jj74t9h2qcnx",
      "effects": {
        "army": 1,
        "Worker": 1,
        "Sys_Кореллия": 1,
        "Rich": -1
      }
    },
    {
      "id": "РРБ-3",
      "name": "Закон о сокращенной рабочей неделе на опасных производствах",
      "description": "Принудительное сокращение рабочей смены для рудокопов, литейщиков и сборщиков тяжёлого машиностроения с сохранением полной заработной платы.\nНаши аналитики прогнозируют, что это улучшит положение рабочих, но снизит краткосрочные темпы выпуска продукции на верфях.",
      "author": "РРБ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.jj74t9h2qcnx",
      "effects": {
        "Worker": 1
      }
    },
    {
      "id": "РРБ-4",
      "name": "Обязательное создание Планетарных Советов Трудящихся",
      "description": "Законодательное закрепление права рабочих коллективов на всех предприятиях свыше 50 сотрудников ветировать решения администрации и участвовать в распределении доходов.\nНаши аналитики прогнозируют, что это ликвидирует самодурство директоров, но приведет к ожесточённому правовому сопротивлению собственников бизнеса.",
      "author": "РРБ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.jj74t9h2qcnx",
      "effects": {
        "Worker": 1,
        "Rich": -1
      }
    },
    {
      "id": "РРБ-5",
      "name": "Республиканский стандарт минимальной оплаты труда",
      "description": "Установление единого высокого минимального уровня оплаты труда во всех секторах Республики с привязкой к стоимости жизни в мирах Ядра.\nНаши аналитики прогнозируют, что это вытащит из нищеты многие семьи на Орд-Мантеле и Танаабе, но ударит по мелким агросемейным хозяйствам и мастерским.",
      "author": "РРБ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.jj74t9h2qcnx",
      "effects": {
        "welfare": 1,
        "Worker": 1,
        "Sys_ОрдМантел": 1,
        "Sys_Танааб": 1,
        "Farmer": -1,
        "Self": -1
      }
    },
    {
      "id": "РРБ-6",
      "name": "Акт о равном избирательном праве и запрете политических пожертвований",
      "description": "Полный запрет коммерческим компаниям, банкам, гильдиям и богатым частным лицам финансировать предвыборные кампании кандидатов и политических партий. Все кандидаты получают равный и скромный грант из бюджета Республики, а также одинаковое эфирное время в ГолоНете.\n\nНаши аналитики прогнозируют, что это не понравится богатым и вызовет их протест, который увеличит их долю в электорате, но повысит одобрение всех других социальных групп.",
      "author": "РРБ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.jj74t9h2qcnx",
      "effects": {
        "Rich": -1,
        "Worker": 1,
        "Farmer": 1,
        "Middle": 1,
        "Relig": 1,
        "Self": 1
      }
    },
    {
      "id": "РРБ-b1",
      "bureau": 0,
      "name": "Расширение социальных гарантий",
      "description": "Социальные гарантии, выплаты, права рабочих это хорошо и мы должны это расширять.",
      "author": "РРБ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.jj74t9h2qcnx",
      "effects": {
        "welfare": 1,
        "Worker": 1,
        "budget": -1
      }
    },
    {
      "id": "РРБ-b2",
      "bureau": 1,
      "name": "Безопасность собраний трудящихся",
      "description": "Сосредоточим полицейские патрули на предотвращении нападений частной охраны на законные собрания работников.",
      "author": "РРБ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.jj74t9h2qcnx",
      "effects": {
        "Worker": 1,
        "crime": -1
      }
    },
    {
      "id": "РРБ-b3",
      "bureau": 2,
      "name": "Стимулирование Социальной Экономики",
      "description": "Мы прибегнем к большей трате федерального бюджета на инфраструктурные и социальные программы.",
      "author": "РРБ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.jj74t9h2qcnx",
      "effects": {
        "welfare": 1,
        "Worker": 1,
        "budget": -1
      }
    },
    {
      "id": "РРБ-b4",
      "bureau": 3,
      "name": "Помощь повстанческим ячейкам по Галактике",
      "description": "Новая Республика существует только в нескольких центральных секторах, когда как по всей галактике остались ярые бойцы за свободу. Мы обязаны им помогать.",
      "author": "РРБ",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.jj74t9h2qcnx",
      "effects": {
        "budget": -1,
        "Worker": 1
      }
    },
    {
      "id": "СДК-1",
      "name": "Межсистемное Выравнивание",
      "description": "Перераспределение части налогов с богатых секторов (Корусант, Чандрила) на развитие инфраструктуры других миров.\nНаши аналитики прогнозируют, что таким образом, больше жителей бедных систем захотят иметь дело с Республиканской демократией.",
      "author": "СДК",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.ap1j07khzhuj",
      "effects": {
        "Sys_Корусант": -1,
        "Sys_Чандрила": -1,
        "Sys_Танааб": 1,
        "Sys_Ондерон": 1,
        "Sys_ОрдМантел": 1,
        "authority": 1
      }
    },
    {
      "id": "СДК-2",
      "name": "Санкционное давление на торговлю с имперскими остатками",
      "description": "Полное эмбарго на любые торговые операции с секторами, подконтрольными имперским губернаторам.\nНаши аналитики прогнозируют, что это перекроет финансовые артерии неоимперцев, но приведёт к убыткам торговых гильдий и росту контрабанды.",
      "author": "СДК",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.ap1j07khzhuj",
      "effects": {
        "crime": 1,
        "Rich": -1,
        "budget": -1
      }
    },
    {
      "id": "СДК-3",
      "name": "Центры Самообороны Республики",
      "description": "Создание республиканских центров базовой военной и тактической подготовки для незанятого населения с выплатой стипендии.\nПрогнозируем, что это снизит уровень уличной преступности, повысит Республиканскую вооруженность, но станет нагрузкой на бюджет",
      "author": "СДК",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.ap1j07khzhuj",
      "effects": {
        "crime": -1,
        "army": 1,
        "budget": -1,
        "Self": 1
      }
    },
    {
      "id": "СДК-4",
      "name": "Анти-рабовладельческие полицейские миссии в малых нейтральных мирах",
      "description": "Проведение силами Новой Республики полицейских операций против работорговцев на территориях, не входящих в состав Республики.\nНаши аналитики прогнозируют, что это нанесёт удар по синдикатам и освободит тысячи разумных существ, но вызовет обвинения в нарушении чужого суверенитета.",
      "author": "СДК",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.ap1j07khzhuj",
      "effects": {
        "crime": -1,
        "image": -1,
        "Bonus_Alien": 1,
        "authority": 1
      }
    },
    {
      "id": "СДК-5",
      "name": "Гарантированные пассажирские линии Республики",
      "description": "Бюро Социальных Служб учреждает сеть регулярных пассажирских перевозок между всеми столицами федеральных секторов с доступным базовым тарифом. Перевозчики получают компенсацию за обслуживание необходимых линий по низким тарифам.\nНаши аналитики прогнозируют, что это создаст значительную нагрузку на бюджет, но повысит благосостояние всех миров и бедной части населения.",
      "author": "СДК",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.ap1j07khzhuj",
      "effects": {
        "welfare": 1,
        "budget": -1,
        "Worker": 1,
        "Self": 1
      }
    },
    {
      "id": "СДК-6",
      "name": "Чрезвычайный трудовой режим на оборонных предприятиях",
      "description": "Введение обязательных сверхурочных смен и временного моратория на забастовки для стратегических верфей и заводов оборонного комплекса.\nНаши аналитики прогнозируют, что это повысит обороноспособность в условиях неоимперской угрозы, но спровоцирует массовые протесты рабочих гильдий.",
      "author": "СДК",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.ap1j07khzhuj",
      "effects": {
        "army": 1,
        "Worker": -1,
        "Sys_Кореллия": -1
      }
    },
    {
      "id": "СДК-b1",
      "bureau": 0,
      "name": "Анти-рабовладельческие механизмы",
      "description": "Мы должны внедрять в социальную систему как можно больше анти-рабовладельческих механизмов, чтобы избавиться от рабства в Галактике.",
      "author": "СДК",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.ap1j07khzhuj",
      "effects": {
        "Bonus_Alien": 1,
        "image": 1
      }
    },
    {
      "id": "СДК-b2",
      "bureau": 1,
      "name": "Давление на про-имперские общественные организации",
      "description": "Будем использовать доступные Бюро инструменты для создания проблем у про-имперских общественных организаций\nМы не должны позволять рушить Республику в такие темные времена.",
      "author": "СДК",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.ap1j07khzhuj",
      "effects": {
        "authority": 1,
        "Bonus_Human": -1,
        "Sys_Чандрила": -1
      }
    },
    {
      "id": "СДК-b3",
      "bureau": 2,
      "name": "Финансировать стратегические предприятия",
      "description": "Стратегические предприятия станут ключевым фактором в будущих конфликтах с осколками Империи.",
      "author": "СДК",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.ap1j07khzhuj",
      "effects": {
        "army": 1,
        "budget": -1,
        "Sys_Кореллия": 1,
        "Worker": 1
      }
    },
    {
      "id": "СДК-b4",
      "bureau": 3,
      "name": "Укреплять флот и проводить учения",
      "description": "Мы должны повышать боеспособность Республики в такие темные времена.",
      "author": "СДК",
      "source": "https://docs.google.com/document/d/1seHjIS8rdDilw1FypIyWwX-aItkrnx03ubgnaYjTJus/edit?tab=t.ap1j07khzhuj",
      "effects": {
        "army": 1,
        "budget": -1,
        "Sys_Кореллия": 1
      }
    }
  ],
  "retiredAxes": {
    "piracy": "crime",
    "social": "welfare",
    "education": "welfare",
    "peace": "image",
    "relations": "image",
    "economy": null,
    "environment": null,
    "food": null,
    "franchise": null,
    "identity": null,
    "imperial": null,
    "industry": null,
    "investment": null,
    "religion": null,
    "rights": null,
    "science": null,
    "slavery": null,
    "stability": null,
    "trade": null,
    "turnoutAlien": null,
    "turnoutRich": null
  }
};
