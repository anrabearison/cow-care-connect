export interface RecentEvent {
    id: string;
    type: string;
    description: string;
    cattleName: string;
    date: string;
}

export type EventType = 'vaccination' | 'traitement' | 'naissance' | 'vente' | 'autre';
