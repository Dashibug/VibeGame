import type { DestinationDefinition, PassengerProfile } from '../types';

export const DESTINATION_POOL: DestinationDefinition[] = [
  {
    id: 'japan',
    label: 'Japan',
    code: 'JP',
    kind: 'country',
    description: 'East departures and island transfer corridor'
  },
  {
    id: 'germany',
    label: 'Germany',
    code: 'DE',
    kind: 'country',
    description: 'Central European transit desks'
  },
  {
    id: 'mongolia',
    label: 'Mongolia',
    code: 'MN',
    kind: 'country',
    description: 'Steppe line checkpoint and regional gate cluster'
  },
  {
    id: 'turkey',
    label: 'Turkey',
    code: 'TR',
    kind: 'country',
    description: 'Southern transfer hall and customs branch'
  },
  {
    id: 'spain',
    label: 'Spain',
    code: 'ES',
    kind: 'country',
    description: 'Western concourse and multilingual assistance wing'
  },
  {
    id: 'france',
    label: 'France',
    code: 'FR',
    kind: 'country',
    description: 'Blue corridor with diplomatic document control'
  }
];

export const PASSENGER_PROFILES: PassengerProfile[] = [
  {
    id: 'pax-001',
    name: 'Aiko Tanaka',
    speech: 'Sumimasen, watashi no tsugi no bin wa doko desu ka?',
    card: {
      title: 'Transit Card',
      accentColor: '#ffcf99',
      fields: [
        { label: 'Document', value: 'Passport JP-44182' },
        { label: 'Declared route', value: 'Island connection' },
        { label: 'Language tag', value: 'Japanese' }
      ]
    },
    symbol: {
      label: 'Symbol',
      value: 'Red crane emblem',
      tone: 'safe'
    },
    mark: {
      label: 'Mark',
      value: 'C1 east transfer stamp',
      tone: 'neutral'
    },
    destinationId: 'japan',
    reward: 12,
    penalty: 5,
    strikePenalty: 1
  },
  {
    id: 'pax-002',
    name: 'Lukas Weber',
    speech: 'Guten Abend. Ich suche den Anschluss nach Berlin.',
    card: {
      title: 'Arrival Slip',
      accentColor: '#b9d8ff',
      fields: [
        { label: 'Document', value: 'Passport DE-18457' },
        { label: 'Declared route', value: 'Central rail-air transfer' },
        { label: 'Language tag', value: 'German' }
      ]
    },
    symbol: {
      label: 'Symbol',
      value: 'Black eagle seal',
      tone: 'neutral'
    },
    mark: {
      label: 'Mark',
      value: 'B2 customs mark',
      tone: 'safe'
    },
    destinationId: 'germany',
    reward: 14,
    penalty: 6,
    strikePenalty: 1
  },
  {
    id: 'pax-003',
    name: 'Naranbaatar Erdene',
    speech: 'Sain baina uu, bi Ulaanbaatar ruu yavna.',
    card: {
      title: 'Passenger Permit',
      accentColor: '#f3d99d',
      fields: [
        { label: 'Document', value: 'Passport MN-90311' },
        { label: 'Declared route', value: 'Steppe regional line' },
        { label: 'Language tag', value: 'Mongolian' }
      ]
    },
    symbol: {
      label: 'Symbol',
      value: 'Blue soyombo icon',
      tone: 'safe'
    },
    mark: {
      label: 'Mark',
      value: 'Dust-yellow border stamp',
      tone: 'warning'
    },
    destinationId: 'mongolia',
    reward: 11,
    penalty: 5,
    strikePenalty: 1
  },
  {
    id: 'pax-004',
    name: 'Emre Kaya',
    speech: 'Merhaba, Ankara aktarmasi icin hangi yone gitmeliyim?',
    card: {
      title: 'Transfer Docket',
      accentColor: '#ffd0b3',
      fields: [
        { label: 'Document', value: 'Passport TR-55241' },
        { label: 'Declared route', value: 'Southern transfer hall' },
        { label: 'Language tag', value: 'Turkish' }
      ]
    },
    symbol: {
      label: 'Symbol',
      value: 'White crescent token',
      tone: 'neutral'
    },
    mark: {
      label: 'Mark',
      value: 'S3 customs stripe',
      tone: 'alert'
    },
    destinationId: 'turkey',
    reward: 13,
    penalty: 6,
    strikePenalty: 1
  },
  {
    id: 'pax-005',
    name: 'Carmen Ruiz',
    speech: 'Perdon, mi vuelo de conexion sale para Madrid.',
    card: {
      title: 'Boarding Summary',
      accentColor: '#ffd7a8',
      fields: [
        { label: 'Document', value: 'Passport ES-76108' },
        { label: 'Declared route', value: 'West concourse' },
        { label: 'Language tag', value: 'Spanish' }
      ]
    },
    symbol: {
      label: 'Symbol',
      value: 'Gold sunburst badge',
      tone: 'safe'
    },
    mark: {
      label: 'Mark',
      value: 'W5 transit stamp',
      tone: 'neutral'
    },
    destinationId: 'spain',
    reward: 12,
    penalty: 5,
    strikePenalty: 1
  },
  {
    id: 'pax-006',
    name: 'Claire Moreau',
    speech: 'Bonsoir, je cherche la file pour Paris.',
    card: {
      title: 'Diplomatic Transit Card',
      accentColor: '#cfe2ff',
      fields: [
        { label: 'Document', value: 'Passport FR-22894' },
        { label: 'Declared route', value: 'Blue corridor' },
        { label: 'Language tag', value: 'French' }
      ]
    },
    symbol: {
      label: 'Symbol',
      value: 'Blue iris medallion',
      tone: 'safe'
    },
    mark: {
      label: 'Mark',
      value: 'D1 embassy clearance',
      tone: 'safe'
    },
    destinationId: 'france',
    reward: 15,
    penalty: 7,
    strikePenalty: 1
  },
  {
    id: 'pax-007',
    name: 'Mika Sato',
    speech: 'Kono kaado ni C1 to arimasu. Nihon yuki desu.',
    card: {
      title: 'Transit Card',
      accentColor: '#ffe0ba',
      fields: [
        { label: 'Document', value: 'Passport JP-62017' },
        { label: 'Declared route', value: 'East departures' },
        { label: 'Language tag', value: 'Japanese' }
      ]
    },
    symbol: {
      label: 'Symbol',
      value: 'Red crane emblem',
      tone: 'safe'
    },
    mark: {
      label: 'Mark',
      value: 'C1 priority stripe',
      tone: 'warning'
    },
    destinationId: 'japan',
    reward: 13,
    penalty: 5,
    strikePenalty: 1
  },
  {
    id: 'pax-008',
    name: 'Jonas Hartmann',
    speech: 'Entschuldigung, mein Dokument zeigt DE und B2.',
    card: {
      title: 'Transfer Docket',
      accentColor: '#d4e6ff',
      fields: [
        { label: 'Document', value: 'Passport DE-77502' },
        { label: 'Declared route', value: 'Central desk B2' },
        { label: 'Language tag', value: 'German' }
      ]
    },
    symbol: {
      label: 'Symbol',
      value: 'Black eagle seal',
      tone: 'neutral'
    },
    mark: {
      label: 'Mark',
      value: 'Steel-blue platform mark',
      tone: 'safe'
    },
    destinationId: 'germany',
    reward: 14,
    penalty: 6,
    strikePenalty: 1
  }
];

export const CUSTOMER_NAMES: string[] = PASSENGER_PROFILES.map((profile) => profile.name);

export const CUSTOMER_LINES: string[] = PASSENGER_PROFILES.map((profile) => profile.speech);
