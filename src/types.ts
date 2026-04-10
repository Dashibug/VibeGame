export interface ItemDefinition {
  id: string;
  label: string;
  price: number;
}

export interface CustomerRequest {
  name: string;
  line: string;
  order: string[];
}

export type DestinationKind = 'country' | 'sector' | 'gate';

export interface DestinationDefinition {
  id: string;
  label: string;
  code: string;
  kind: DestinationKind;
  description?: string;
}

export interface PassengerCardField {
  label: string;
  value: string;
}

export interface PassengerCard {
  title: string;
  accentColor?: string;
  fields: PassengerCardField[];
}

export interface PassengerIndicator {
  label: string;
  value: string;
  tone?: 'neutral' | 'warning' | 'alert' | 'safe';
}

export type PassengerCaseType = 'clean' | 'transit' | 'mixed-language' | 'missing-passport' | 'conflicting';

export interface PassengerPersonTraits {
  name: string;
  speech: string;
  originCountryId: string;
  passportCountryId: string | null;
  spokenLanguage: string;
}

export interface PassengerSummaryClues {
  originCountryId: string;
  passportCountryId: string | null;
  spokenLanguage: string;
}

export interface PassengerRoutingClues {
  documentText: string;
  declaredRoute: string;
  languageTag: string;
  symbol: string;
  mark: string;
}

export interface PassengerRouteCard {
  mode: 'flag' | 'hint';
  flagCountryCode?: string;
  hintLabel?: string;
  hintValue?: string;
}

export interface PassengerProfile {
  id: string;
  caseType: PassengerCaseType;
  destinationCountryId: string;
  person: PassengerPersonTraits;
  summary: PassengerSummaryClues;
  routing: PassengerRoutingClues;
  routeCard: PassengerRouteCard;
  accentColor?: string;
  reward: number;
  penalty: number;
  strikePenalty?: number;
}

export interface EndShiftData {
  score: number;
  servedCustomers: number;
  strikes: number;
  money?: number;
  processedPassengers?: number;
  correctRoutes?: number;
}
