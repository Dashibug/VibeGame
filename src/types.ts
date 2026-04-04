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

export interface PassengerProfile {
  id: string;
  name: string;
  speech: string;
  card: PassengerCard;
  symbol: PassengerIndicator;
  mark: PassengerIndicator;
  destinationId: string;
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
