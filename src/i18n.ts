export type SupportedLanguage = 'en' | 'ru' | 'de';

const LANGUAGE_STORAGE_KEY = 'vibegame-language';
const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'ru', 'de'];

type TranslationValue = string | string[];

const translations: Record<SupportedLanguage, Record<string, TranslationValue>> = {
  en: {
    'menu.title': 'TERMINAL CLASSIFICATION CONSOLE',
    'menu.subtitle': 'Transit supervisory channel 04',
    'menu.statusLabel': 'SYSTEM STATUS',
    'menu.status.online': 'AUTO CLASSIFICATION: ONLINE',
    'menu.status.unstable': 'AUTO CLASSIFICATION: UNSTABLE',
    'menu.status.offline': 'AUTO CLASSIFICATION: OFFLINE',
    'menu.boardTitle': 'ARRIVAL BOARD',
    'menu.board.online': [
      'A1  EAST CORRIDOR         CLEARED',
      'B2  CENTRAL PLATFORM      CLEARED',
      'C1  ISLAND TRANSFER       CLEARED',
      'D4  DIPLOMATIC LANE       CLEARED'
    ],
    'menu.board.unstable': [
      'A1  EAST CORRIDOR         VERIFY',
      'B2  CENTRAL PLATFORM      VERIFY',
      'C1  ISLAND TRANSFER       HOLD',
      'D4  DIPLOMATIC LANE       VERIFY'
    ],
    'menu.board.failure': [
      'A1  EAST CORRIDOR         DESYNC',
      'B2  CENTRAL PLATFORM      DESYNC',
      'C1  ISLAND TRANSFER       ERROR',
      'D4  DIPLOMATIC LANE       ERROR'
    ],
    'menu.ambient.stable': [
      'terminal hum stable',
      'route board synchronized',
      'classifier latency nominal',
      'inbound queue within threshold'
    ],
    'menu.ambient.drift': 'classifier drift detected',
    'menu.ambient.signal': 'signal integrity unstable',
    'menu.ambient.failure': 'classification fault escalating',
    'menu.ambient.manual': 'manual override required',
    'menu.failureTitle': 'CLASSIFICATION SYSTEM FAILURE',
    'menu.failureSubtitle': 'MANUAL ROUTING REQUIRED',
    'menu.authorization': 'Temporary controller authorization granted',
    'menu.queueRisk': 'Queue overflow risk detected',
    'menu.startButton': 'BEGIN MANUAL ROUTING',
    'menu.language': 'LANG',
    'menu.briefingTitle': 'Manual Routing Briefing',
    'menu.briefingBody':
      'The terminal classifier has failed. You will inspect speech, documents, symbols and route marks, then manually send each passenger to the correct country desk.',
    'menu.briefingHint': 'Select a language, read the briefing, then start the incident sequence.',
    'menu.briefingStart': 'START',

    'kiosk.windowTitle': 'Transit Window',
    'kiosk.consoleTitle': 'Routing Console',
    'kiosk.arrivalSide': 'arrival side',
    'kiosk.controlSide': 'control side',
    'kiosk.caseFile': 'Case {caseId}',
    'kiosk.routingInstructions': 'Compare speech, card, symbol and mark. Choose the correct country desk.',
    'kiosk.alertManual': 'MANUAL ROUTING ACTIVE',
    'kiosk.alertQueue': 'QUEUE OVERLOAD',
    'kiosk.documentsTitle': 'Passenger File',
    'kiosk.cluesTitle': 'Cross-check Signals',
    'kiosk.routeStatus': 'Route Status',
    'kiosk.bottomHint': 'Check every clue carefully before confirming the route.',
    'kiosk.selectedRouteNone': 'Selected route: -',
    'kiosk.selectedRouteValue': 'Selected route: {route} ({code})',
    'kiosk.dispatchButton': 'Dispatch',
    'kiosk.routingNote': 'Routing note: compare all clues before choosing a country',
    'kiosk.chooseBeforeDispatch': 'Choose a destination before dispatching.',
    'kiosk.successFeedback': 'Cleared for {route}. +{reward} credits',
    'kiosk.failFeedback': 'Wrong route: {route}. -{penalty} credits and +{strike} strike',
    'kiosk.timeoutFeedback': 'Passenger lost patience. -{penalty} credits and +{strike} strike',
    'kiosk.hud': 'Time: {time}s   Money: {money}   Routed: {correct}/{processed}   Strikes: {strikes}/{max}',
    'kiosk.ambient': [
      'scanner glitch',
      'glass hum',
      'distant boarding call',
      'crowd movement',
      'intercom static'
    ],
    'kiosk.routeUnknown': 'unknown',
    'kiosk.targetRoute': 'target route',

    'end.title': 'Transit Shift Complete',
    'end.subtitle': 'Manual routing desk summary',
    'end.creditsEarned': 'Credits Earned: {money}',
    'end.passengersProcessed': 'Passengers Processed: {count}',
    'end.correctRoutes': 'Correct Routes: {count}',
    'end.strikes': 'Strikes: {count}',
    'end.routingAccuracy': 'Routing Accuracy: {accuracy}%',
    'end.restartShift': 'Restart Shift',
    'end.backToMenu': 'Back To Menu',

    'destinations.japan': 'Japan',
    'destinations.germany': 'Germany',
    'destinations.mongolia': 'Mongolia',
    'destinations.turkey': 'Turkey',
    'destinations.spain': 'Spain',
    'destinations.france': 'France'
  },
  ru: {
    'menu.title': 'КОНСОЛЬ КЛАССИФИКАЦИИ ТЕРМИНАЛА',
    'menu.subtitle': 'Надзорный транзитный канал 04',
    'menu.statusLabel': 'СТАТУС СИСТЕМЫ',
    'menu.status.online': 'АВТОКЛАССИФИКАЦИЯ: В СЕТИ',
    'menu.status.unstable': 'АВТОКЛАССИФИКАЦИЯ: НЕСТАБИЛЬНА',
    'menu.status.offline': 'АВТОКЛАССИФИКАЦИЯ: ОТКЛЮЧЕНА',
    'menu.boardTitle': 'ТАБЛО ПРИБЫТИЯ',
    'menu.board.online': [
      'A1  ВОСТОЧНЫЙ КОРИДОР     ДОПУЩЕН',
      'B2  ЦЕНТРАЛЬНАЯ ПЛАТФОРМА ДОПУЩЕН',
      'C1  ОСТРОВНОЙ ТРАНСФЕР    ДОПУЩЕН',
      'D4  ДИПЛОМАТИЧЕСКИЙ КАНАЛ ДОПУЩЕН'
    ],
    'menu.board.unstable': [
      'A1  ВОСТОЧНЫЙ КОРИДОР     ПРОВЕРИТЬ',
      'B2  ЦЕНТРАЛЬНАЯ ПЛАТФОРМА ПРОВЕРИТЬ',
      'C1  ОСТРОВНОЙ ТРАНСФЕР    УДЕРЖАН',
      'D4  ДИПЛОМАТИЧЕСКИЙ КАНАЛ ПРОВЕРИТЬ'
    ],
    'menu.board.failure': [
      'A1  ВОСТОЧНЫЙ КОРИДОР     РАССИНХР',
      'B2  ЦЕНТРАЛЬНАЯ ПЛАТФОРМА РАССИНХР',
      'C1  ОСТРОВНОЙ ТРАНСФЕР    ОШИБКА',
      'D4  ДИПЛОМАТИЧЕСКИЙ КАНАЛ ОШИБКА'
    ],
    'menu.ambient.stable': [
      'гул терминала стабилен',
      'табло маршрутов синхронизировано',
      'задержка классификатора в норме',
      'входящая очередь в пределах нормы'
    ],
    'menu.ambient.drift': 'обнаружен дрейф классификатора',
    'menu.ambient.signal': 'нестабильность сигнала',
    'menu.ambient.failure': 'сбой классификации нарастает',
    'menu.ambient.manual': 'требуется ручной режим',
    'menu.failureTitle': 'СБОЙ СИСТЕМЫ КЛАССИФИКАЦИИ',
    'menu.failureSubtitle': 'ТРЕБУЕТСЯ РУЧНАЯ МАРШРУТИЗАЦИЯ',
    'menu.authorization': 'Временный допуск контролера выдан',
    'menu.queueRisk': 'Обнаружен риск переполнения очереди',
    'menu.startButton': 'НАЧАТЬ РУЧНУЮ МАРШРУТИЗАЦИЮ',
    'menu.language': 'ЯЗЫК',
    'menu.briefingTitle': 'Инструктаж По Ручной Маршрутизации',
    'menu.briefingBody':
      'Система классификации терминала вышла из строя. Вам нужно анализировать речь, документы, символы и маршрутные отметки, а затем вручную направлять пассажиров в нужную страну.',
    'menu.briefingHint': 'Выберите язык, прочитайте бриф и запустите аварийную последовательность.',
    'menu.briefingStart': 'СТАРТ',

    'kiosk.windowTitle': 'Транзитное окно',
    'kiosk.consoleTitle': 'Консоль маршрутизации',
    'kiosk.arrivalSide': 'сторона прибытия',
    'kiosk.controlSide': 'сторона контроля',
    'kiosk.caseFile': 'Дело {caseId}',
    'kiosk.routingInstructions': 'Сверьте речь, карточку, символ и отметку. Выберите правильную страну назначения.',
    'kiosk.alertManual': 'РУЧНАЯ МАРШРУТИЗАЦИЯ АКТИВНА',
    'kiosk.alertQueue': 'ПЕРЕГРУЗКА ОЧЕРЕДИ',
    'kiosk.documentsTitle': 'Досье Пассажира',
    'kiosk.cluesTitle': 'Сверка Сигналов',
    'kiosk.routeStatus': 'Статус Маршрута',
    'kiosk.bottomHint': 'Тщательно проверьте все улики перед подтверждением маршрута.',
    'kiosk.selectedRouteNone': 'Выбранный маршрут: -',
    'kiosk.selectedRouteValue': 'Выбранный маршрут: {route} ({code})',
    'kiosk.dispatchButton': 'Направить',
    'kiosk.routingNote': 'Примечание: сравните все улики перед выбором страны',
    'kiosk.chooseBeforeDispatch': 'Сначала выберите направление.',
    'kiosk.successFeedback': 'Направлен в {route}. +{reward} кредитов',
    'kiosk.failFeedback': 'Неверный маршрут: {route}. -{penalty} кредитов и +{strike} страйк',
    'kiosk.timeoutFeedback': 'Пассажир потерял терпение. -{penalty} кредитов и +{strike} страйк',
    'kiosk.hud': 'Время: {time}с   Деньги: {money}   Верно: {correct}/{processed}   Страйки: {strikes}/{max}',
    'kiosk.ambient': [
      'сбой сканера',
      'гул стекла',
      'дальний вызов на посадку',
      'движение толпы',
      'помехи интеркома'
    ],
    'kiosk.routeUnknown': 'неизвестно',
    'kiosk.targetRoute': 'нужный маршрут',

    'end.title': 'Смена Завершена',
    'end.subtitle': 'Сводка ручного маршрутизатора',
    'end.creditsEarned': 'Заработано кредитов: {money}',
    'end.passengersProcessed': 'Обработано пассажиров: {count}',
    'end.correctRoutes': 'Верных маршрутов: {count}',
    'end.strikes': 'Страйки: {count}',
    'end.routingAccuracy': 'Точность маршрутизации: {accuracy}%',
    'end.restartShift': 'Начать Смену Снова',
    'end.backToMenu': 'Назад В Меню',

    'destinations.japan': 'Япония',
    'destinations.germany': 'Германия',
    'destinations.mongolia': 'Монголия',
    'destinations.turkey': 'Турция',
    'destinations.spain': 'Испания',
    'destinations.france': 'Франция'
  },
  de: {
    'menu.title': 'KONSOLE DER TERMINALKLASSIFIZIERUNG',
    'menu.subtitle': 'Transit-Aufsichtskanal 04',
    'menu.statusLabel': 'SYSTEMSTATUS',
    'menu.status.online': 'AUTOKLASSIFIZIERUNG: ONLINE',
    'menu.status.unstable': 'AUTOKLASSIFIZIERUNG: INSTABIL',
    'menu.status.offline': 'AUTOKLASSIFIZIERUNG: OFFLINE',
    'menu.boardTitle': 'ANKUNFTSTAFEL',
    'menu.board.online': [
      'A1  OSTKORRIDOR           FREIGEGEBEN',
      'B2  ZENTRALPLATTFORM      FREIGEGEBEN',
      'C1  INSELTRANSFER         FREIGEGEBEN',
      'D4  DIPLOMATISCHE SPUR    FREIGEGEBEN'
    ],
    'menu.board.unstable': [
      'A1  OSTKORRIDOR           PRUEFEN',
      'B2  ZENTRALPLATTFORM      PRUEFEN',
      'C1  INSELTRANSFER         HALT',
      'D4  DIPLOMATISCHE SPUR    PRUEFEN'
    ],
    'menu.board.failure': [
      'A1  OSTKORRIDOR           DESYNC',
      'B2  ZENTRALPLATTFORM      DESYNC',
      'C1  INSELTRANSFER         FEHLER',
      'D4  DIPLOMATISCHE SPUR    FEHLER'
    ],
    'menu.ambient.stable': [
      'terminalsummen stabil',
      'routentafel synchronisiert',
      'klassifizierer-latenz nominal',
      'eingangsqueue im grenzwert'
    ],
    'menu.ambient.drift': 'klassifizierer-drift erkannt',
    'menu.ambient.signal': 'signalinstabilitaet erkannt',
    'menu.ambient.failure': 'klassifizierungsfehler eskaliert',
    'menu.ambient.manual': 'manuelle uebersteuerung erforderlich',
    'menu.failureTitle': 'AUSFALL DES KLASSIFIZIERUNGSSYSTEMS',
    'menu.failureSubtitle': 'MANUELLE ROUTENZUWEISUNG ERFORDERLICH',
    'menu.authorization': 'Temporare Controller-Autorisierung erteilt',
    'menu.queueRisk': 'Risiko einer Queue-Ueberlastung erkannt',
    'menu.startButton': 'MANUELLE ROUTUNG STARTEN',
    'menu.language': 'SPRACHE',
    'menu.briefingTitle': 'Briefing Zur Manuellen Routung',
    'menu.briefingBody':
      'Das Klassifizierungssystem des Terminals ist ausgefallen. Du pruefst Sprache, Dokumente, Symbole und Routenmarken und leitest dann jeden Passagier manuell zum richtigen Laenderschalter.',
    'menu.briefingHint': 'Waehle eine Sprache, lies das Briefing und starte dann die Stoerungssequenz.',
    'menu.briefingStart': 'START',

    'kiosk.windowTitle': 'Transitfenster',
    'kiosk.consoleTitle': 'Routing-Konsole',
    'kiosk.arrivalSide': 'ankunftsseite',
    'kiosk.controlSide': 'kontrollseite',
    'kiosk.caseFile': 'Fall {caseId}',
    'kiosk.routingInstructions': 'Vergleiche Sprache, Karte, Symbol und Markierung. Waehle das richtige Zielland.',
    'kiosk.alertManual': 'MANUELLE ROUTUNG AKTIV',
    'kiosk.alertQueue': 'QUEUE-UEBERLASTUNG',
    'kiosk.documentsTitle': 'Passagierakte',
    'kiosk.cluesTitle': 'Signalabgleich',
    'kiosk.routeStatus': 'Routenstatus',
    'kiosk.bottomHint': 'Pruefe alle Hinweise sorgfaeltig, bevor du die Route bestaetigst.',
    'kiosk.selectedRouteNone': 'Gewaehlte Route: -',
    'kiosk.selectedRouteValue': 'Gewaehlte Route: {route} ({code})',
    'kiosk.dispatchButton': 'Zuweisen',
    'kiosk.routingNote': 'Hinweis: Vergleiche alle Indizien vor der Laenderwahl',
    'kiosk.chooseBeforeDispatch': 'Waehle zuerst ein Ziel.',
    'kiosk.successFeedback': 'Fuer {route} freigegeben. +{reward} Credits',
    'kiosk.failFeedback': 'Falsche Route: {route}. -{penalty} Credits und +{strike} Strike',
    'kiosk.timeoutFeedback': 'Der Passagier hat die Geduld verloren. -{penalty} Credits und +{strike} Strike',
    'kiosk.hud': 'Zeit: {time}s   Geld: {money}   Korrekt: {correct}/{processed}   Strikes: {strikes}/{max}',
    'kiosk.ambient': [
      'scannerstoerung',
      'glasbrummen',
      'entfernter boarding-ruf',
      'mengenbewegung',
      'intercom-stoerung'
    ],
    'kiosk.routeUnknown': 'unbekannt',
    'kiosk.targetRoute': 'zielroute',

    'end.title': 'Transitschicht Abgeschlossen',
    'end.subtitle': 'Zusammenfassung des manuellen Routings',
    'end.creditsEarned': 'Verdiente Credits: {money}',
    'end.passengersProcessed': 'Bearbeitete Passagiere: {count}',
    'end.correctRoutes': 'Korrekte Routen: {count}',
    'end.strikes': 'Strikes: {count}',
    'end.routingAccuracy': 'Routing-Genauigkeit: {accuracy}%',
    'end.restartShift': 'Schicht Neustarten',
    'end.backToMenu': 'Zurueck Zum Menue',

    'destinations.japan': 'Japan',
    'destinations.germany': 'Deutschland',
    'destinations.mongolia': 'Mongolei',
    'destinations.turkey': 'Tuerkei',
    'destinations.spain': 'Spanien',
    'destinations.france': 'Frankreich'
  }
};

const dataTranslations: Record<SupportedLanguage, Record<string, string>> = {
  en: {},
  ru: {
    'Transit Card': 'Транзитная карта',
    'Arrival Slip': 'Карта прибытия',
    'Passenger Permit': 'Разрешение пассажира',
    'Transfer Docket': 'Трансферный талон',
    'Boarding Summary': 'Сводка посадки',
    'Diplomatic Transit Card': 'Дипломатическая транзитная карта',
    Document: 'Документ',
    'Declared route': 'Заявленный маршрут',
    'Language tag': 'Языковая пометка',
    Symbol: 'Символ',
    Mark: 'Отметка',
    'Passport JP-44182': 'Паспорт JP-44182',
    'Passport DE-18457': 'Паспорт DE-18457',
    'Passport MN-90311': 'Паспорт MN-90311',
    'Passport TR-55241': 'Паспорт TR-55241',
    'Passport ES-76108': 'Паспорт ES-76108',
    'Passport FR-22894': 'Паспорт FR-22894',
    'Passport JP-62017': 'Паспорт JP-62017',
    'Passport DE-77502': 'Паспорт DE-77502',
    'Island connection': 'Островной маршрут',
    'Central rail-air transfer': 'Центральный ж/д-авиа трансфер',
    'Steppe regional line': 'Степная региональная линия',
    'Southern transfer hall': 'Южный трансферный зал',
    'West concourse': 'Западный конкорс',
    'Blue corridor': 'Синий коридор',
    'East departures': 'Восточные вылеты',
    'Central desk B2': 'Центральная стойка B2',
    Japanese: 'Японский',
    German: 'Немецкий',
    Mongolian: 'Монгольский',
    Turkish: 'Турецкий',
    Spanish: 'Испанский',
    French: 'Французский',
    'Red crane emblem': 'Эмблема красного журавля',
    'Black eagle seal': 'Печать черного орла',
    'Blue soyombo icon': 'Синий знак соембо',
    'White crescent token': 'Белый жетон полумесяца',
    'Gold sunburst badge': 'Золотой знак солнца',
    'Blue iris medallion': 'Синий медальон ириса',
    'C1 east transfer stamp': 'Штамп восточного трансфера C1',
    'B2 customs mark': 'Таможенная отметка B2',
    'Dust-yellow border stamp': 'Пыльно-желтый пограничный штамп',
    'S3 customs stripe': 'Таможенная полоса S3',
    'W5 transit stamp': 'Транзитный штамп W5',
    'D1 embassy clearance': 'Посольский допуск D1',
    'C1 priority stripe': 'Приоритетная полоса C1',
    'Steel-blue platform mark': 'Стально-синяя отметка платформы'
  },
  de: {
    'Transit Card': 'Transitkarte',
    'Arrival Slip': 'Ankunftsschein',
    'Passenger Permit': 'Passagiergenehmigung',
    'Transfer Docket': 'Transferbeleg',
    'Boarding Summary': 'Boarding-Uebersicht',
    'Diplomatic Transit Card': 'Diplomatische Transitkarte',
    Document: 'Dokument',
    'Declared route': 'Gemeldete Route',
    'Language tag': 'Sprachhinweis',
    Symbol: 'Symbol',
    Mark: 'Markierung',
    'Passport JP-44182': 'Reisepass JP-44182',
    'Passport DE-18457': 'Reisepass DE-18457',
    'Passport MN-90311': 'Reisepass MN-90311',
    'Passport TR-55241': 'Reisepass TR-55241',
    'Passport ES-76108': 'Reisepass ES-76108',
    'Passport FR-22894': 'Reisepass FR-22894',
    'Passport JP-62017': 'Reisepass JP-62017',
    'Passport DE-77502': 'Reisepass DE-77502',
    'Island connection': 'Inselverbindung',
    'Central rail-air transfer': 'Zentraler Bahn-Luft-Transfer',
    'Steppe regional line': 'Regionale Steppenlinie',
    'Southern transfer hall': 'Suedeuropaeische Transferhalle',
    'West concourse': 'Westlicher Korridor',
    'Blue corridor': 'Blauer Korridor',
    'East departures': 'Ost-Abfluege',
    'Central desk B2': 'Zentralschalter B2',
    Japanese: 'Japanisch',
    German: 'Deutsch',
    Mongolian: 'Mongolisch',
    Turkish: 'Tuerkisch',
    Spanish: 'Spanisch',
    French: 'Franzoesisch',
    'Red crane emblem': 'Emblem des roten Kranichs',
    'Black eagle seal': 'Siegel des schwarzen Adlers',
    'Blue soyombo icon': 'Blaues Soyombo-Symbol',
    'White crescent token': 'Weisser Halbmond-Marker',
    'Gold sunburst badge': 'Goldenes Sonnenabzeichen',
    'Blue iris medallion': 'Blaues Iris-Medaillon',
    'C1 east transfer stamp': 'Osttransfer-Stempel C1',
    'B2 customs mark': 'Zollmarke B2',
    'Dust-yellow border stamp': 'Staubgelber Grenzstempel',
    'S3 customs stripe': 'Zollstreifen S3',
    'W5 transit stamp': 'Transitstempel W5',
    'D1 embassy clearance': 'Botschaftsfreigabe D1',
    'C1 priority stripe': 'Prioritaetsstreifen C1',
    'Steel-blue platform mark': 'Stahlblaue Plattformmarke'
  }
};

function readStoredLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
    return stored as SupportedLanguage;
  }

  return 'en';
}

let currentLanguage: SupportedLanguage = readStoredLanguage();

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`));
}

function getRawValue(key: string): TranslationValue | undefined {
  return translations[currentLanguage][key] ?? translations.en[key];
}

export function getCurrentLanguage(): SupportedLanguage {
  return currentLanguage;
}

export function getSupportedLanguages(): SupportedLanguage[] {
  return [...SUPPORTED_LANGUAGES];
}

export function setCurrentLanguage(language: SupportedLanguage): void {
  currentLanguage = language;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }
}

export function t(key: string, params?: Record<string, string | number>): string {
  const value = getRawValue(key);
  if (typeof value !== 'string') {
    return key;
  }

  return interpolate(value, params);
}

export function tList(key: string): string[] {
  const value = getRawValue(key);
  return Array.isArray(value) ? value : [String(value ?? key)];
}

export function translateDestination(id: string, fallback: string): string {
  const value = getRawValue(`destinations.${id}`);
  return typeof value === 'string' ? value : fallback;
}

export function translateDataText(text: string): string {
  return dataTranslations[currentLanguage][text] ?? text;
}
