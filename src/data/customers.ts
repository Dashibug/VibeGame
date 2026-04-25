import type { DestinationDefinition, PassengerCaseType, PassengerProfile } from '../types';

interface CultureProfile {
  id: string;
  homeCode: string;
  language: string;
  givenNames: string[];
  surnames: string[];
  speechSamples: string[];
  emblem: string;
  mark: string;
  accentColor: string;
}

const REGION_NAMES = new Intl.DisplayNames(['en'], { type: 'region' });

const DESTINATION_CODES: string[] = [
  'AF', 'AL', 'DZ', 'AD', 'AO', 'AG', 'AR', 'AM', 'AU', 'AT', 'AZ',
  'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BT', 'BO', 'BA',
  'BW', 'BR', 'BN', 'BG', 'BF', 'BI', 'CV', 'KH', 'CM', 'CA', 'CF',
  'TD', 'CL', 'CN', 'CO', 'KM', 'CG', 'CD', 'CR', 'CI', 'HR', 'CU',
  'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER',
  'EE', 'SZ', 'ET', 'FJ', 'FI', 'FR', 'GA', 'GM', 'GE', 'DE', 'GH',
  'GR', 'GD', 'GT', 'GN', 'GW', 'GY', 'HT', 'HN', 'HU', 'IS', 'IN',
  'ID', 'IR', 'IQ', 'IE', 'IL', 'IT', 'JM', 'JP', 'JO', 'KZ', 'KE',
  'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY',
  'LI', 'LT', 'LU', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MR',
  'MU', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MA', 'MZ', 'MM', 'NA',
  'NR', 'NP', 'NL', 'NZ', 'NI', 'NE', 'NG', 'MK', 'NO', 'OM', 'PK',
  'PW', 'PA', 'PG', 'PY', 'PE', 'PH', 'PL', 'PT', 'QA', 'RO', 'RU',
  'RW', 'KN', 'LC', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC',
  'SL', 'SG', 'SK', 'SI', 'SB', 'SO', 'ZA', 'SS', 'ES', 'LK', 'SD',
  'SR', 'SE', 'CH', 'SY', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TO', 'TT',
  'TN', 'TR', 'TM', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UY', 'UZ',
  'VU', 'VE', 'VN', 'YE', 'ZM', 'ZW', 'PS', 'VA'
];

const CULTURE_PROFILES: CultureProfile[] = [
  {
    id: 'japanese',
    homeCode: 'JP',
    language: 'Japanese',
    givenNames: ['Aiko', 'Ren', 'Mika', 'Haru', 'Kaito', 'Yuna'],
    surnames: ['Sato', 'Tanaka', 'Kobayashi', 'Nakamura', 'Ito'],
    speechSamples: [
      'Sumimasen, doko ni ikeba ii desu ka?',
      'Kono tsugi no tenmatsu wa doko desu ka?',
      'Shorui wa koko de kakunin dekimasu ka?'
    ],
    emblem: 'red crane crest',
    mark: 'kanji gate stamp',
    accentColor: '#d4bb8a'
  },
  {
    id: 'korean',
    homeCode: 'KR',
    language: 'Korean',
    givenNames: ['Minseo', 'Jisoo', 'Hyejin', 'Junseo', 'Taemin', 'Seoyeon'],
    surnames: ['Kim', 'Lee', 'Park', 'Choi', 'Jung'],
    speechSamples: [
      'Annyeonghaseyo, eodiro ghamyeon doenaeyo?',
      'Je yeogwon daesin i geuljareul hwaginhae juseyo.',
      'Daum hwanseung seokteo gajeugo sipseumnida.'
    ],
    emblem: 'teal taegeuk sigil',
    mark: 'hangul transit stripe',
    accentColor: '#98c9cc'
  },
  {
    id: 'german',
    homeCode: 'DE',
    language: 'German',
    givenNames: ['Lukas', 'Jonas', 'Marta', 'Sophie', 'Felix', 'Leonie'],
    surnames: ['Weber', 'Hartmann', 'Schmidt', 'Klein', 'Fischer'],
    speechSamples: [
      'Guten Abend. Wohin muss ich jetzt gehen?',
      'Ich suche die richtige Umsteigelinie.',
      'Mein Anschluss ist dringend, bitte schnell.'
    ],
    emblem: 'black eagle seal',
    mark: 'steel platform mark',
    accentColor: '#b8c8d7'
  },
  {
    id: 'french',
    homeCode: 'FR',
    language: 'French',
    givenNames: ['Claire', 'Luc', 'Amelie', 'Julien', 'Nora', 'Theo'],
    surnames: ['Moreau', 'Dubois', 'Lefevre', 'Girard', 'Laurent'],
    speechSamples: [
      'Bonsoir, je cherche la bonne file.',
      'Pouvez-vous verifier cette correspondance?',
      'Je dois rejoindre une autre porte rapidement.'
    ],
    emblem: 'blue iris medallion',
    mark: 'embassy clearance ring',
    accentColor: '#cad4df'
  },
  {
    id: 'spanish',
    homeCode: 'ES',
    language: 'Spanish',
    givenNames: ['Carmen', 'Lucia', 'Mateo', 'Diego', 'Sara', 'Elena'],
    surnames: ['Ruiz', 'Garcia', 'Navarro', 'Torres', 'Santos'],
    speechSamples: [
      'Perdon, necesito la ruta correcta.',
      'Mi conexion cambia de terminal.',
      'Solo tengo esta tarjeta de transito.'
    ],
    emblem: 'sunburst transit badge',
    mark: 'gold corridor seal',
    accentColor: '#e0bd85'
  },
  {
    id: 'turkish',
    homeCode: 'TR',
    language: 'Turkish',
    givenNames: ['Emre', 'Aylin', 'Deniz', 'Selin', 'Baris', 'Mert'],
    surnames: ['Kaya', 'Demir', 'Yilmaz', 'Aydin', 'Arslan'],
    speechSamples: [
      'Merhaba, dogru yone gitmem gerekiyor.',
      'Baglanti kartim burada ama pasaport yok.',
      'Aktarma icin hangi hatta gitmeliyim?'
    ],
    emblem: 'white crescent token',
    mark: 'southern customs stripe',
    accentColor: '#d7a287'
  },
  {
    id: 'mongolian',
    homeCode: 'MN',
    language: 'Mongolian',
    givenNames: ['Naran', 'Bolor', 'Temuulen', 'Enkh', 'Saruul', 'Bat'],
    surnames: ['Erdene', 'Ganbaatar', 'Tumen', 'Munkh', 'Otgon'],
    speechSamples: [
      'Sain baina uu, bi hilees shuud irsen.',
      'Nadad zuvhun ene medeelel baina.',
      'Bi daraagiin chigleliig asuuj baina.'
    ],
    emblem: 'soyombo corridor icon',
    mark: 'dust border stamp',
    accentColor: '#ccb486'
  },
  {
    id: 'russian',
    homeCode: 'RU',
    language: 'Russian',
    givenNames: ['Nadya', 'Mikhail', 'Daria', 'Sergei', 'Olga', 'Timur'],
    surnames: ['Ivanov', 'Petrov', 'Sokolov', 'Smirnov', 'Orlov'],
    speechSamples: [
      'Dobryi vecher, mne nuzhen pravilnyi sektor.',
      'Pasport poteryan, ostalas tolko karta puti.',
      'Mozhete proverit otmetku na propuske?'
    ],
    emblem: 'northern registry eagle',
    mark: 'frost transfer mark',
    accentColor: '#bcc8d8'
  },
  {
    id: 'ukrainian',
    homeCode: 'UA',
    language: 'Ukrainian',
    givenNames: ['Oksana', 'Iryna', 'Taras', 'Mykola', 'Danylo', 'Yulia'],
    surnames: ['Shevchenko', 'Koval', 'Melnyk', 'Bondarenko', 'Tkachenko'],
    speechSamples: [
      'Dobryi den, meni potriben pravylnyi marshrut.',
      'Mii dokument ne povnyi, ale marshrut ye.',
      'Pidkazhit, kudy meni dalii?'
    ],
    emblem: 'trident route sigil',
    mark: 'blue customs band',
    accentColor: '#c7d1db'
  },
  {
    id: 'arabic',
    homeCode: 'JO',
    language: 'Arabic',
    givenNames: ['Layla', 'Omar', 'Nour', 'Yousef', 'Mariam', 'Samir'],
    surnames: ['Haddad', 'Nasser', 'Saleh', 'Khalil', 'Rahman'],
    speechSamples: [
      'Marhaban, ahtaj ila al-mamar al-sahih.',
      'Ladayya wathiqat murur faqat.',
      'Hal yumkinuka murajaat hadhihi al-ishara?'
    ],
    emblem: 'desert star stamp',
    mark: 'amber customs arc',
    accentColor: '#d4b28e'
  },
  {
    id: 'persian',
    homeCode: 'IR',
    language: 'Persian',
    givenNames: ['Sara', 'Arman', 'Nika', 'Pouya', 'Yasmin', 'Kian'],
    surnames: ['Rahimi', 'Karimi', 'Farhadi', 'Nouri', 'Kazemi'],
    speechSamples: [
      'Salaam, man be masir dorost niaz daram.',
      'Faghat in barge-ye tranzit ra daram.',
      'Mitavanid alamat ra barrasi konid?'
    ],
    emblem: 'cypress transit seal',
    mark: 'saffron gate mark',
    accentColor: '#c8b18c'
  },
  {
    id: 'hindi',
    homeCode: 'IN',
    language: 'Hindi',
    givenNames: ['Asha', 'Rohan', 'Priya', 'Kabir', 'Neha', 'Arjun'],
    surnames: ['Sharma', 'Patel', 'Mehta', 'Singh', 'Kapoor'],
    speechSamples: [
      'Namaste, mujhe sahi raasta chahiye.',
      'Mere paas sirf transit slip hai.',
      'Kripya is nishan ko dekh lijiye.'
    ],
    emblem: 'lotus corridor crest',
    mark: 'rail-air customs seal',
    accentColor: '#d8ba88'
  },
  {
    id: 'bengali',
    homeCode: 'BD',
    language: 'Bengali',
    givenNames: ['Amina', 'Rafi', 'Nabila', 'Sajid', 'Farah', 'Imran'],
    surnames: ['Ahmed', 'Khan', 'Rahman', 'Hossain', 'Karim'],
    speechSamples: [
      'Nomoskar, amake thik line dekhate hobe.',
      'Amar kache passport nei, sudhu card ache.',
      'Ei chinho ta dekhe bolben?'
    ],
    emblem: 'delta route stamp',
    mark: 'monsoon transfer stripe',
    accentColor: '#d6bc91'
  },
  {
    id: 'mandarin',
    homeCode: 'CN',
    language: 'Mandarin',
    givenNames: ['Li Wei', 'Mei Lin', 'Zhen', 'Xiao Yu', 'Lan', 'Jun'],
    surnames: ['Wang', 'Li', 'Chen', 'Zhao', 'Liu'],
    speechSamples: [
      'Ni hao, qing wen wo gai qu nar?',
      'Wo zhi you zhe zhang tongxing ka.',
      'Qing bang wo kan kan zhe ge biaoji.'
    ],
    emblem: 'jade route emblem',
    mark: 'customs red ring',
    accentColor: '#d0c0a0'
  },
  {
    id: 'vietnamese',
    homeCode: 'VN',
    language: 'Vietnamese',
    givenNames: ['Lan', 'Minh', 'Thao', 'Quang', 'Linh', 'Bao'],
    surnames: ['Nguyen', 'Tran', 'Le', 'Pham', 'Vo'],
    speechSamples: [
      'Xin chao, toi can den dung quoc gia.',
      'Toi chi con the trung chuyen nay.',
      'Lam on kiem tra dau moc nay giup toi.'
    ],
    emblem: 'lotus badge',
    mark: 'river customs stamp',
    accentColor: '#d1bb92'
  },
  {
    id: 'thai',
    homeCode: 'TH',
    language: 'Thai',
    givenNames: ['Anong', 'Niran', 'Kanya', 'Somchai', 'Mali', 'Preecha'],
    surnames: ['Sukhum', 'Rattan', 'Charoen', 'Boonmee', 'Sirisak'],
    speechSamples: [
      'Sawasdee, chan tong pai thang nai?',
      'Mi tae bai tranzit ni thao nan.',
      'Chuai du traa ni hai noi dai mai?'
    ],
    emblem: 'orchid transit crest',
    mark: 'gold lane stamp',
    accentColor: '#d8bb8f'
  },
  {
    id: 'indonesian',
    homeCode: 'ID',
    language: 'Indonesian',
    givenNames: ['Ayu', 'Bima', 'Rani', 'Dimas', 'Sinta', 'Raka'],
    surnames: ['Pratama', 'Saputra', 'Wijaya', 'Santoso', 'Putri'],
    speechSamples: [
      'Selamat malam, saya perlu jalur yang benar.',
      'Saya hanya membawa kartu transit ini.',
      'Tolong cek tanda ini untuk saya.'
    ],
    emblem: 'archipelago route seal',
    mark: 'harbor customs stripe',
    accentColor: '#d5b48a'
  },
  {
    id: 'swahili',
    homeCode: 'TZ',
    language: 'Swahili',
    givenNames: ['Amani', 'Zuri', 'Juma', 'Neema', 'Baraka', 'Kito'],
    surnames: ['Mwangi', 'Omari', 'Njoroge', 'Moses', 'Kamau'],
    speechSamples: [
      'Habari, nahitaji njia sahihi.',
      'Nina kadi hii tu ya usafiri.',
      'Unaweza kuangalia alama hii?'
    ],
    emblem: 'savanna route token',
    mark: 'coastal customs line',
    accentColor: '#d2b88e'
  },
  {
    id: 'amharic',
    homeCode: 'ET',
    language: 'Amharic',
    givenNames: ['Alem', 'Bekele', 'Selam', 'Meron', 'Tadesse', 'Kidist'],
    surnames: ['Tesfaye', 'Bekele', 'Haile', 'Wolde', 'Mekonnen'],
    speechSamples: [
      'Selam, wede yet new mehed alebign?',
      'Yih transit werket bichachin new.',
      'Meleketehin meqoyet tichilalachihu?'
    ],
    emblem: 'highland dispatch seal',
    mark: 'plateau gate stamp',
    accentColor: '#cdb690'
  },
  {
    id: 'greek',
    homeCode: 'GR',
    language: 'Greek',
    givenNames: ['Nikos', 'Eleni', 'Sofia', 'Dimitri', 'Anna', 'Yannis'],
    surnames: ['Papadopoulos', 'Nikolaou', 'Karras', 'Kostas', 'Georgiou'],
    speechSamples: [
      'Kalispera, pou prepei na pao tora?',
      'Echo mono afti tin karta diadromis.',
      'Mporeite na elegxete afto to simeio?'
    ],
    emblem: 'ionic route medallion',
    mark: 'marble customs stripe',
    accentColor: '#c7c0a0'
  },
  {
    id: 'italian',
    homeCode: 'IT',
    language: 'Italian',
    givenNames: ['Giulia', 'Marco', 'Elisa', 'Luca', 'Chiara', 'Paolo'],
    surnames: ['Rossi', 'Bianchi', 'Romano', 'Conti', 'Gallo'],
    speechSamples: [
      'Buonasera, cerco il corridoio corretto.',
      'Ho solo questo permesso di transito.',
      'Puoi controllare questo timbro?'
    ],
    emblem: 'laurel route seal',
    mark: 'amber corridor notch',
    accentColor: '#d3b892'
  },
  {
    id: 'polish',
    homeCode: 'PL',
    language: 'Polish',
    givenNames: ['Anna', 'Piotr', 'Marek', 'Kasia', 'Ola', 'Tomasz'],
    surnames: ['Kowalski', 'Nowak', 'Wisniewski', 'Mazur', 'Wojcik'],
    speechSamples: [
      'Dobry wieczor, potrzebuje dobrego kierunku.',
      'Mam tylko ta karte tranzytowa.',
      'Prosze sprawdzic ten znak.'
    ],
    emblem: 'white eagle route seal',
    mark: 'border rail stamp',
    accentColor: '#c6c3b2'
  },
  {
    id: 'serbian',
    homeCode: 'RS',
    language: 'Serbian',
    givenNames: ['Mila', 'Nikola', 'Jelena', 'Stefan', 'Ana', 'Marko'],
    surnames: ['Jovanovic', 'Petrovic', 'Nikolic', 'Markovic', 'Ilic'],
    speechSamples: [
      'Dobro vece, treba mi pravi prolaz.',
      'Imam samo ovu tranzitnu kartu.',
      'Mozete li proveriti ovu oznaku?'
    ],
    emblem: 'double-eagle lane crest',
    mark: 'border checkpoint ring',
    accentColor: '#cbb99a'
  },
  {
    id: 'portuguese',
    homeCode: 'PT',
    language: 'Portuguese',
    givenNames: ['Ines', 'Rui', 'Mariana', 'Tiago', 'Beatriz', 'Joao'],
    surnames: ['Silva', 'Costa', 'Oliveira', 'Martins', 'Pereira'],
    speechSamples: [
      'Boa noite, preciso do corredor correto.',
      'So tenho este documento de transito.',
      'Pode verificar este carimbo?'
    ],
    emblem: 'atlantic route crest',
    mark: 'harbor registry mark',
    accentColor: '#d5bf96'
  },
  {
    id: 'uzbek',
    homeCode: 'UZ',
    language: 'Uzbek',
    givenNames: ['Dilnoza', 'Bekzod', 'Aziza', 'Sherzod', 'Umid', 'Malika'],
    surnames: ['Karimov', 'Rakhimov', 'Tursunov', 'Abdullaev', 'Usmonov'],
    speechSamples: [
      'Assalomu alaykum, menga togri yonalish kerak.',
      'Menda faqat shu tranzit varaqasi bor.',
      'Iltimos, shu belgi tekshirib bering.'
    ],
    emblem: 'silk route badge',
    mark: 'steppe transfer stamp',
    accentColor: '#cfba8a'
  },
  {
    id: 'kazakh',
    homeCode: 'KZ',
    language: 'Kazakh',
    givenNames: ['Aruzhan', 'Nursultan', 'Ayan', 'Dana', 'Madi', 'Ainur'],
    surnames: ['Sarsenov', 'Akhmetov', 'Tulegenov', 'Nurgaliyev', 'Abilov'],
    speechSamples: [
      'Salem, magan durys bagyt kerek.',
      'Menin qolda tek osy kartam bar.',
      'Myna belgini tekserip beresiz be?'
    ],
    emblem: 'sky-steppe route crest',
    mark: 'customs wind seal',
    accentColor: '#cdb591'
  },
  {
    id: 'english',
    homeCode: 'GB',
    language: 'English',
    givenNames: ['Mason', 'Emily', 'Oliver', 'Grace', 'Noah', 'Ella'],
    surnames: ['Turner', 'Bennett', 'Carter', 'Morgan', 'Hughes'],
    speechSamples: [
      'Excuse me, I need the correct route.',
      'I only have this transit note with me.',
      'Can you verify this marker before I move on?'
    ],
    emblem: 'civic registry badge',
    mark: 'checkpoint clearance strip',
    accentColor: '#bfc7d6'
  }
];

const CARD_TITLES = [
  'Transit Card',
  'Arrival Slip',
  'Passenger Permit',
  'Transfer Docket',
  'Boarding Summary',
  'Routing Memo',
  'Corridor Permit'
];

const CASE_TYPE_POOL: PassengerCaseType[] = [
  'clean',
  'clean',
  'transit',
  'transit',
  'mixed-language',
  'mixed-language',
  'missing-passport',
  'conflicting'
];

const ROUTE_PATTERNS = [
  '{prefix}final transit corridor',
  '{prefix}priority transfer lane',
  '{prefix}arrival exchange route',
  '{prefix}manual routing corridor',
  '{prefix}international transfer desk'
];

const DESCRIPTION_PATTERNS = [
  'state arrivals registry',
  'cold-border transfer desk',
  'civil transit authority wing',
  'foreign routing checkpoint',
  'passport review corridor',
  'queue stabilization sector',
  'manual dispatch lane'
];

const DOCUMENT_PATTERNS = [
  'Passport {code}-{digits}',
  'Transit visa {code}-{digits}',
  'Crew booklet {code}-{digits}',
  'Embassy note {code}-{digits}'
];

const MISSING_DOCUMENT_PATTERNS = [
  'No passport attached',
  'Document missing, route note only',
  'Passport held by customs transfer desk',
  'Identity page unavailable, transit stub present'
];

const SYMBOL_PATTERNS = [
  '{prefix}route symbol',
  '{prefix}corridor symbol',
  '{prefix}destination marker',
  '{prefix}transfer symbol'
];

const MARK_PATTERNS = [
  '{prefix}entry seal',
  '{prefix}transit stamp',
  '{prefix}clearance stamp',
  '{prefix}corridor stamp'
];

const ROUTE_CARD_GENERIC_HINTS = [
  {
    label: 'Terminal code',
    buildValue: (_code: string, seed: number) => `TERM-${String.fromCharCode(65 + (seed % 5))}${(seed % 8) + 1}`
  },
  {
    label: 'Corridor label',
    buildValue: (_code: string, seed: number) => `transfer corridor ${(seed % 4) + 1}`
  },
  {
    label: 'Region hint',
    buildValue: (_code: string, seed: number) => `dispatch zone ${(seed % 3) + 1}`
  },
  {
    label: 'Entry seal',
    buildValue: (_code: string, seed: number) => `inbound seal ${(seed % 6) + 1}`
  }
];

interface GeneratedCaseTruth {
  destination: DestinationDefinition;
  caseType: PassengerCaseType;
  nameCulture: CultureProfile;
  speechCulture: CultureProfile;
  originCountryId: string;
  passportCountryId: string | null;
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function pick<T>(items: T[], seed: number): T {
  return items[seed % items.length];
}

function pickDifferent<T>(items: T[], seed: number, current: T): T {
  let candidate = pick(items, seed);
  if (candidate === current) {
    candidate = pick(items, seed + 1);
  }
  return candidate;
}

function pickDifferentBy<T>(items: T[], seed: number, current: T, getKey: (item: T) => string): T {
  let candidate = pick(items, seed);
  if (getKey(candidate) === getKey(current)) {
    candidate = pick(items, seed + 1);
  }
  return candidate;
}

function makeDestinationId(code: string): string {
  return code.toLowerCase();
}

function formatPattern(pattern: string, params: Record<string, string | number>): string {
  return pattern.replace(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`));
}

function buildDestinationDescription(label: string, seed: number): string {
  return `${label} ${pick(DESCRIPTION_PATTERNS, seed)}`;
}

function getCultureByCountryCode(code: string, seed: number): CultureProfile {
  return CULTURE_PROFILES.find((culture) => culture.homeCode === code) ?? pick(CULTURE_PROFILES, seed);
}

function pickForeignCulture(excludedCodes: string[], seed: number): CultureProfile {
  const fallback = pick(CULTURE_PROFILES, seed);
  const candidate = CULTURE_PROFILES.find((culture, index) => !excludedCodes.includes(culture.homeCode) && (seed + index) % 3 === 0);
  return candidate ?? fallback;
}

function determineCaseType(seed: number): PassengerCaseType {
  return pick(CASE_TYPE_POOL, seed);
}

function createHiddenTruth(destination: DestinationDefinition, seed: number): GeneratedCaseTruth {
  const caseType = determineCaseType(seed);
  const destinationCulture = getCultureByCountryCode(destination.code, seed + 3);

  if (caseType === 'clean') {
    return {
      destination,
      caseType,
      nameCulture: destinationCulture,
      speechCulture: destinationCulture,
      originCountryId: destination.id,
      passportCountryId: destination.id
    };
  }

  if (caseType === 'transit') {
    const transitCulture = pickForeignCulture([destination.code], seed + 11);
    return {
      destination,
      caseType,
      nameCulture: transitCulture,
      speechCulture: transitCulture,
      originCountryId: makeDestinationId(transitCulture.homeCode),
      passportCountryId: makeDestinationId(transitCulture.homeCode)
    };
  }

  if (caseType === 'mixed-language') {
    const speechCulture = pickForeignCulture([destination.code], seed + 19);
    return {
      destination,
      caseType,
      nameCulture: destinationCulture,
      speechCulture,
      originCountryId: destination.id,
      passportCountryId: destination.id
    };
  }

  if (caseType === 'missing-passport') {
    const originCulture = pickForeignCulture([destination.code], seed + 29);
    return {
      destination,
      caseType,
      nameCulture: originCulture,
      speechCulture: pickDifferentBy(CULTURE_PROFILES, seed + 31, originCulture, (culture) => culture.homeCode),
      originCountryId: makeDestinationId(originCulture.homeCode),
      passportCountryId: null
    };
  }

  const originCulture = pickForeignCulture([destination.code], seed + 37);
  const speechCulture = pickForeignCulture([destination.code, originCulture.homeCode], seed + 41);
  const passportCulture = pickForeignCulture([destination.code, originCulture.homeCode, speechCulture.homeCode], seed + 47);
  return {
    destination,
    caseType,
    nameCulture: originCulture,
    speechCulture,
    originCountryId: makeDestinationId(originCulture.homeCode),
    passportCountryId: makeDestinationId(passportCulture.homeCode)
  };
}

function createName(culture: CultureProfile, seed: number): string {
  const given = pick(culture.givenNames, seed);
  const surname = pick(culture.surnames, seed + 11);
  return `${given} ${surname}`;
}

function createSpeech(culture: CultureProfile, variant: number, seed: number): string {
  const base = pick(culture.speechSamples, seed + 5);
  const endings = [
    'I was told to follow the final transfer line.',
    'My next connection should be in the manual routing queue.',
    'They said the last leg depends on the mark on this file.',
    'I only know that the final route matches the seal and stripe.'
  ];

  if (variant === 0) {
    return `${base} ${pick(endings, seed + 9)}`;
  }

  return `${base} ${pick(endings, seed + 13)} Please do not delay me.`;
}

function createDocumentValue(culture: CultureProfile, variant: number, seed: number): string {
  const digits = 10000 + (seed % 90000);
  if (variant === 1 && seed % 2 === 0) {
    return pick(MISSING_DOCUMENT_PATTERNS, seed);
  }

  return formatPattern(pick(DOCUMENT_PATTERNS, seed + 3), {
    code: culture.homeCode,
    digits
  });
}

function createDocumentText(passportCountryId: string | null, seed: number): string {
  if (!passportCountryId) {
    return pick(MISSING_DOCUMENT_PATTERNS, seed);
  }

  const digits = 10000 + (seed % 90000);
  return formatPattern(pick(DOCUMENT_PATTERNS, seed + 3), {
    code: passportCountryId.toUpperCase(),
    digits
  });
}

function createDeclaredRoute(destination: DestinationDefinition, seed: number, includeCountryCode: boolean): string {
  return formatPattern(pick(ROUTE_PATTERNS, seed + 7), {
    prefix: includeCountryCode ? `${destination.code} ` : ''
  });
}

function createIndicatorValue(
  patterns: string[],
  destination: DestinationDefinition,
  seed: number,
  includeCountryCode: boolean
): string {
  return formatPattern(pick(patterns, seed), {
    prefix: includeCountryCode ? `${destination.code} ` : ''
  });
}

function buildRouteCard(destination: DestinationDefinition, seed: number): PassengerProfile['routeCard'] {
  const showFlag = seed % 2 === 0;
  if (showFlag) {
    return {
      mode: 'flag',
      flagCountryCode: destination.code
    };
  }

  const hint = pick(ROUTE_CARD_GENERIC_HINTS, seed + 17);
  return {
    mode: 'hint',
    hintLabel: hint.label,
    hintValue: hint.buildValue(destination.code, seed + 23)
  };
}

function validateCaseSolvable(passenger: PassengerProfile): boolean {
  const destinationCode = passenger.destinationCountryId.toUpperCase();
  let strongClueCount = 0;

  if (passenger.routing.declaredRoute.includes(destinationCode)) {
    strongClueCount += 1;
  }
  if (passenger.routing.symbol.includes(destinationCode)) {
    strongClueCount += 1;
  }
  if (passenger.routing.mark.includes(destinationCode)) {
    strongClueCount += 1;
  }
  if (passenger.routeCard.mode === 'flag') {
    strongClueCount += 1;
  } else if (passenger.routeCard.hintValue?.includes(destinationCode)) {
    strongClueCount += 1;
  }

  return strongClueCount >= 2;
}

function buildPassenger(destination: DestinationDefinition, variant: number, destinationIndex: number): PassengerProfile {
  const seed = hashString(`${destination.code}-${variant}-${destinationIndex}`);
  const truth = createHiddenTruth(destination, seed + variant * 13);
  const cardTitle = pick(CARD_TITLES, seed + 23);
  const routeCard = buildRouteCard(destination, seed + 29);
  let includeRouteCountryCode = (seed + 31) % 2 === 0;
  let includeSymbolCountryCode = (seed + 37) % 2 === 0;
  let includeMarkCountryCode = (seed + 41) % 2 === 0;

  // If there is no flag on the route card, keep at least one strong routing clue tied to the destination code.
  if (routeCard.mode === 'hint' && !includeRouteCountryCode && !includeSymbolCountryCode && !includeMarkCountryCode) {
    includeRouteCountryCode = true;
  }

  const routing = {
    documentText: createDocumentText(truth.passportCountryId, seed + 5),
    declaredRoute: createDeclaredRoute(destination, seed + 7, includeRouteCountryCode),
    languageTag: truth.speechCulture.language,
    symbol: createIndicatorValue(SYMBOL_PATTERNS, destination, seed + 11, includeSymbolCountryCode),
    mark: createIndicatorValue(MARK_PATTERNS, destination, seed + 13, includeMarkCountryCode)
  };

  const passenger: PassengerProfile = {
    id: `pax-${destination.code.toLowerCase()}-${variant + 1}`,
    caseType: truth.caseType,
    destinationCountryId: destination.id,
    person: {
      name: createName(truth.nameCulture, seed),
      speech: createSpeech(truth.speechCulture, variant, seed),
      originCountryId: truth.originCountryId,
      passportCountryId: truth.passportCountryId,
      spokenLanguage: truth.speechCulture.language
    },
    summary: {
      originCountryId: truth.originCountryId,
      passportCountryId: truth.passportCountryId,
      spokenLanguage: truth.speechCulture.language
    },
    routing,
    routeCard,
    accentColor: variant === 0 ? truth.nameCulture.accentColor : truth.speechCulture.accentColor,
    reward: 11 + (seed % 6),
    penalty: 4 + (seed % 5),
    strikePenalty: 1
  };

  if (!validateCaseSolvable(passenger)) {
    passenger.routeCard = {
      mode: 'hint',
      hintLabel: 'Route code',
      hintValue: `${destination.code}-SAFE`
    };
  }

  return passenger;
}

function formatPassengerCard(passenger: PassengerProfile): PassengerProfile['routing'] {
  return {
    documentText: passenger.routing.documentText,
    declaredRoute: passenger.routing.declaredRoute,
    languageTag: passenger.routing.languageTag,
    symbol: passenger.routing.symbol,
    mark: passenger.routing.mark
  };
}

export const DESTINATION_POOL: DestinationDefinition[] = DESTINATION_CODES.map((code, index) => {
  const label = REGION_NAMES.of(code) ?? code;
  return {
    id: makeDestinationId(code),
    label,
    code,
    kind: 'country',
    description: buildDestinationDescription(label, index)
  };
});

export const PASSENGER_PROFILES: PassengerProfile[] = DESTINATION_POOL.flatMap((destination, index) => {
  const passengers = [
    buildPassenger(destination, 0, index),
    buildPassenger(destination, 1, index)
  ];

  return passengers.map((passenger) => ({
    ...passenger,
    routing: formatPassengerCard(passenger)
  }));
});

export const CUSTOMER_NAMES: string[] = PASSENGER_PROFILES.map((profile) => profile.person.name);

export const CUSTOMER_LINES: string[] = PASSENGER_PROFILES.map((profile) => profile.person.speech);
