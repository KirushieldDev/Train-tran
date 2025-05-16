// Représente les jours de la semaine activés pour un trajet
export interface WeekPattern {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
}

// Horaires d’arrivée et de départ pour une étape spécifique
export interface StopTime {
    utc_departure_time?: string;
    utc_arrival_time?: string;
}

// Détail complet d’un trajet, incluant horaires, jours d’opération, arrêts et infos complémentaires
export interface Journey {
    id_vehicle_journey: string;
    departure: string;
    arrival: string;
    day?: string;
    weekPattern?: WeekPattern;
    stop_times: Array<StopTime>;
    fromIndex: number;
    toIndex: number;
    departureTime?: string;
    arrivalTime?: string;
    duration?: string;
    fullDeparture?: string;
    fullArrival?: string;
    price?: number;
}

// Résumé simplifié d’un trajet utilisé pour affichage, avec horaires et prix formatés
export interface Trip {
    id: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price: string;
    departureTimeValue?: number;
}

// Association d’une date à une liste de trajets disponibles ce jour-là
export interface DateWithJourneys {
    date: Date;
    journeys: Journey[];
}
