export interface WeekPattern {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
}

export interface StopTime {
    utc_departure_time?: string;
    utc_arrival_time?: string;
}

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
    [key: string]: any;
}

export interface Trip {
    id: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price: string;
    departureTimeValue?: number;
}

export interface DateWithJourneys {
    date: Date;
    journeys: Journey[];
}
