window.senateCrises = {
  "I": {
    "title": "I. Родия на перепутье",
    "onset": {
      "effects": {
        "Farmer": -2,
        "Sys_Танааб": -2,
        "Sys_Ондерон": -2
      }
    },
    "news": "Проимперские офицеры свергли избранного губернатора аграрной Родии. Они действуют независимо от Трауна, но экзоты из Родии и соседних систем бегут в Республику, опасаясь возвращения имперской политики. Переворот нарушил поставки продовольствия. Республиканские фермеры теряют рынок сбыта и возможность покупать родианскую продукцию. Сенат собирается на чрезвычайную сессию.",
    "source": "https://docs.google.com/document/d/1pXbyiNGlOrrs5lwlRtDNRjc3m43upznt0F0b5LsVzrU/edit",
    "video": "https://drive.google.com/file/d/1E6IP2WLbINXdc5Cm1snPdkf-FyeYGFER/view",
    "questions": [
      {
        "id": "fleet",
        "name": "Что делать с проимперским режимом на Родии?",
        "options": [
          {
            "id": "wait",
            "name": "Ничего",
            "effects": {
              "image": -1
            }
          },
          {
            "id": "send",
            "name": "Отправить флот Республики на освобождение Родии",
            "effects": {
              "budget": -1
            }
          }
        ]
      },
      {
        "id": "refugees",
        "name": "Что делать с беженцами-экзотами?",
        "options": [
          {
            "id": "wait",
            "name": "Ничего",
            "effects": {
              "welfare": -1
            },
            "alienGrowth": 0.1
          },
          {
            "id": "help",
            "name": "Помочь социальными выплатами",
            "effects": {
              "budget": -1,
              "welfare": 1,
              "Bonus_Alien": 1
            },
            "alienGrowth": 0.1
          },
          {
            "id": "restrict",
            "name": "Ограничить миграцию",
            "effects": {
              "image": -1,
              "Bonus_Alien": -1
            }
          }
        ]
      },
      {
        "id": "farms",
        "name": "Что делать с потерями на аграрных рынках?",
        "options": [
          {
            "id": "wait",
            "name": "Ничего",
            "effects": {
              "Farmer": -1,
              "Sys_Танааб": -1,
              "Sys_Ондерон": -1
            }
          },
          {
            "id": "compensate",
            "name": "Финансово компенсировать потери фермеров",
            "effects": {
              "budget": -1,
              "Farmer": 1,
              "Sys_Танааб": 1,
              "Sys_Ондерон": 1
            }
          }
        ]
      }
    ]
  },
  "II-A": {
    "title": "II-А. Родианский референдум",
    "news": "Демократическое правительство Родии восстановлено и просит Сенат начать переговоры о вступлении в Республику. Нейтральные секторы, опасаясь экспансии обеих сторон, объединились в Содружество Нейтральных Миров. Его совет на Мандалоре ввёл эмбарго на республиканское вооружение и тяжёлую промышленность. На биржах Республики началась паника.",
    "source": "https://docs.google.com/document/d/1uKcu0bD3nVYldf3D8uhCzsEbWgMvnNp3YyRlBtN_828/edit",
    "questions": [
      {
        "id": "accession",
        "name": "Начать переговоры о вхождении Родии в состав Республики?",
        "options": [
          {
            "id": "decline",
            "name": "Не начинать переговоры",
            "effects": {}
          },
          {
            "id": "negotiate",
            "name": "Начать переговоры при поддержке двух третей Сената",
            "senateVote": true,
            "effects": {
              "image": 1,
              "Bonus_Alien": 1
            }
          }
        ]
      },
      {
        "id": "commonwealth",
        "name": "Что делать с Содружеством Нейтральных Миров?",
        "options": [
          {
            "id": "wait",
            "name": "Ничего не делать",
            "effects": {}
          },
          {
            "id": "embargo",
            "name": "Ввести ответное эмбарго",
            "effects": {
              "image": -1,
              "Rich": -1,
              "Middle": -1
            }
          },
          {
            "id": "intervene",
            "name": "Вторгнуться",
            "effects": {
              "budget": -1,
              "image": -3,
              "authority": -1
            }
          }
        ]
      },
      {
        "id": "markets",
        "name": "Что делать с паникой на финансовых биржах?",
        "options": [
          {
            "id": "wait",
            "name": "Ничего не делать",
            "effects": {
              "Rich": -1
            }
          },
          {
            "id": "procure",
            "name": "Компенсировать убытки закупками продукции тяжёлой промышленности и вооружения",
            "effects": {
              "budget": -1,
              "Rich": 1,
              "army": 1
            }
          },
          {
            "id": "freeze",
            "name": "Временно заморозить торги",
            "effects": {
              "welfare": -1
            }
          }
        ]
      }
    ],
    "video": "https://drive.google.com/file/d/14w-6_uwz4Xlq_kLREVTmR31vUVEMaEfB/view",
    "onset": {
      "effects": {
        "Rich": -1,
        "welfare": -1,
        "army": -1
      }
    }
  },
  "II-B": {
    "title": "II-Б. Провокация Трауна",
    "onset": {
      "effects": {
        "authority": -2,
        "Sys_Ондерон": -2,
        "Middle": -2,
        "welfare": -2,
        "Sys_Неймодия": -2,
        "Sys_Корусант": -2
      }
    },
    "news": "Проимперские офицеры договорились с Трауном о присоединении Родии к Возрождённой Империи. Империя получила позицию на гиперпространственной магистрали к республиканским мирам. Биржи падают, банки теряют устойчивость, а торговые дома и корпорации выводят имущество из Республики. Волна безработицы уже дошла до крупных космопортов.",
    "source": "https://docs.google.com/document/d/11f6PA7t0YYnGoDY8NFSHelTrq-3gc109mQD3Ckh9ywk/edit",
    "questions": [
      {
        "id": "strike",
        "name": "Что делать с Империей на границе?",
        "options": [
          {
            "id": "wait",
            "name": "Ничего не делать",
            "effects": {}
          },
          {
            "id": "send",
            "name": "Отправить флот Республики на освобождение Родии",
            "effects": {
              "budget": -1
            }
          }
        ]
      },
      {
        "id": "banks",
        "name": "Что делать с финансовой паникой и падением банковской системы?",
        "options": [
          {
            "id": "wait",
            "name": "Ничего не делать",
            "effects": {
              "Rich": -1,
              "Middle": -1
            }
          },
          {
            "id": "bailout",
            "name": "Выкупить банки и передать их под контроль Бюро Финансов и Экономики",
            "effects": {
              "budget": -1,
              "welfare": 1
            }
          },
          {
            "id": "liquidity",
            "name": "Предоставить банкам ликвидность из резервов Бюро Финансов и Экономики",
            "effects": {
              "budget": -1,
              "Rich": 1,
              "Sys_Неймодия": 1,
              "welfare": 1
            }
          }
        ]
      },
      {
        "id": "jobs",
        "name": "Что делать с ростом безработицы?",
        "options": [
          {
            "id": "wait",
            "name": "Ничего не делать",
            "effects": {
              "welfare": -1,
              "Worker": -1
            }
          },
          {
            "id": "payments",
            "name": "Провести прямые выплаты безработным",
            "effects": {
              "budget": -1,
              "welfare": 1,
              "Worker": 1
            }
          },
          {
            "id": "buyouts",
            "name": "Проспонсировать выкуп предприятий их работниками",
            "effects": {
              "budget": -1,
              "Worker": 1,
              "Rich": -1
            }
          }
        ]
      }
    ],
    "video": "https://drive.google.com/file/d/1tmM5JwMb4yA15fDY2Gd4I0uJTY7KJvgx/view"
  },
  "III-A": {
    "title": "III-А. Переговоры",
    "questions": [],
    "news": "Империя Трауна напала на Содружество Нейтральных Миров и заняла узлы гипермаршрутов к Мандалору. Совет отверг капитуляцию и просит помощи. На Кореллии рабочие коммерческих верфей бастуют из-за задержек выплат по контрактам Содружества, поэтому конвои для эвакуации беженцев ждут кораблей. Траун предлагает отдельным мирам открыть свои маршруты в обмен на выход из Содружества.",
    "source": "https://docs.google.com/document/d/10vDlGMfi5m3lqZA1lv-iH3WpR1gdw4nbN-s_K2eGw28/edit",
    "onset": {
      "effects": {
        "Sys_Кореллия": -2,
        "Worker": -1,
        "welfare": -1
      }
    }
  },
  "III-B": {
    "title": "III-Б. Торговая война",
    "questions": [],
    "news": "Содружество расширяет эмбарго и вводит пошлины на все товары из Республики. На Танаабе и Орд-Мантеле растут преступность и теневой рынок. Синдикаты зарабатывают на обходе пошлин и усиливают влияние на местную власть. В центральных мирах протестующие обвиняют Республику в возвращении к торговым войнам и коррупции.",
    "source": "https://docs.google.com/document/d/13ygdrXJLyOIGndW5kDEA-EtDfxs0QcmL1ECSxnERC2E/edit",
    "onset": {
      "effects": {
        "crime": 2,
        "Sys_Танааб": -2,
        "Sys_ОрдМантел": -2,
        "authority": -1
      }
    }
  },
  "III-C": {
    "title": "III-В. Вторжение в Орд-Мантелл",
    "questions": [],
    "news": "Наступление Республики на Содружество застопорилось. Силы Содружества высадились на Орд-Мантеле и обещают уйти после перемирия. Местные синдикаты договорились с оккупационными властями о вывозе руды. Шахтёрам, отказывающимся работать, грозят увольнением и выселением. В центральных мирах протестующие требуют прекратить войну.",
    "source": "https://docs.google.com/document/d/1EKqSjVviTZJIOgub7ZENszuQd_VNfsXoTsUN2oP32z8/edit",
    "video": "https://drive.google.com/file/d/1PhUJl8GdQu0QqMYAP5fiEXP4a_fFWS8r/view",
    "onset": {
      "effects": {
        "Sys_ОрдМантел": -3,
        "Worker": -2,
        "crime": 2,
        "authority": -1
      }
    }
  },
  "III-D": {
    "title": "III-Г. Битва за Мандалор",
    "questions": [],
    "news": "Республиканский флот прорвал оборону Содружества, а десант занял столицу Мандалора. Совет бежал и призывает продолжать сопротивление. На планете введён комендантский час, а на Ондероне начались нападения на правительственные здания. Жители Мандалора требуют убрать блокпосты, в центральных мирах идут антивоенные демонстрации.",
    "source": "https://docs.google.com/document/d/1U-eyABBAUuLRyPSngWxIZC5lQwhwUcEG-u3aoalA7yM/edit",
    "video": "https://drive.google.com/file/d/1yXVITFXm2KqpqP1YYt46PqyHVposbeS9/view",
    "onset": {
      "effects": {
        "Sys_Ондерон": -2,
        "crime": 1,
        "authority": -2,
        "image": -2
      }
    }
  },
  "III-E": {
    "title": "III-Д. Империя наносит ответный удар!",
    "questions": [],
    "news": "Имперские звёздные разрушители вторглись в Республику и начали оккупацию миров. Первый удар пришёлся прежде всего на Кореллию, куда имперский флот вышел по гиперпространственным магистралям. Пока командование готовит оборону, местные силы ищут новые союзы на случай падения Республики. Сенат созывает чрезвычайную сессию.",
    "source": "https://docs.google.com/document/d/1gYFOIbETMrn9ERD34SX3Wur4VweQTqTdIW7nh9OZm3Y/edit",
    "video": "https://drive.google.com/file/d/1sJgkvr9wz7-AgQXz0B86LFoalNI8HKKH/view",
    "onset": {
      "effects": {
        "Sys_Кореллия": -3,
        "army": -2,
        "budget": -2,
        "authority": -2
      }
    }
  },
  "III-F": {
    "title": "III-Е. Республика ведёт войну",
    "questions": [],
    "news": "Война с Империей продолжается, Родия остаётся под её контролем, а приграничные миры ждут подкреплений. Кореллианские верфи стоят из-за забастовки: гильдии требуют выплатить задолженность и отменить обязательные ночные смены. Синдикаты заняли приграничные гипермаршруты и пользуются ростом чёрного рынка. Сенат обсуждает, как вернуть флоту ремонтные мощности и восстановить патрули.",
    "source": "https://docs.google.com/document/d/1--NIodgX2BcCpFg5BqEoOwMzdkYtGWjHPjav6OsbQgw/edit",
    "video": "https://drive.google.com/file/d/1H0g7xxqbatc35MxD8jc4iZ8agN6YkZWL/view",
    "onset": {
      "effects": {
        "Sys_Кореллия": -2,
        "army": -1,
        "crime": 2,
        "Worker": -1
      }
    }
  }
};
