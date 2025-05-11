import React, {useState, useEffect} from "react";
import DatePicker from "react-datepicker";
import {fr} from "date-fns/locale";
import {format, addDays, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval} from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "@traintran/style/calendar.css";
import {calculatePriceWithDayAdjustment} from "@traintran/utils/travel";
import {useSearchParams} from "next/navigation";

export interface Journey {
    id_vehicle_journey: string;
    day: string;
    departureTime?: string;
    arrivalTime?: string;
    duration?: string;
    fullDeparture?: string;
    fullArrival?: string;
    departure?: string;
    arrival?: string;
    fromIndex?: number;
    toIndex?: number;
    stop_times?: any[];
    price?: number;
}

export interface DateWithJourneys {
    date: Date;
    journeys: Journey[];
}

interface CalendarProps {
    onChange?: (date: Date | null, journeys?: Journey[]) => void;
    availableDates?: DateWithJourneys[];
    distanceKm: number;
    selectedDate?: Date | null;
    departure?: string;
    arrival?: string;
}

const Calendar: React.FC<CalendarProps> = ({onChange, availableDates = [], distanceKm, selectedDate: propSelectedDate, departure, arrival}) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(propSelectedDate || new Date());
    const [availableJourneyDates, setAvailableJourneyDates] = useState<{[key: string]: Journey[]}>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const searchParams = useSearchParams();

    // Mettre à jour l'état local si propSelectedDate change
    useEffect(() => {
        if (propSelectedDate) {
            setSelectedDate(propSelectedDate);
        }
    }, [propSelectedDate]);

    // Charger les trajets disponibles pour le mois en cours
    useEffect(() => {
        const fetchJourneysForMonth = async () => {
            if (!departure || !arrival) return;
            
            setLoading(true);
            try {
                const start = startOfMonth(currentMonth);
                const end = endOfMonth(currentMonth);
                
                // Récupérer les trajets pour chaque jour du mois
                const response = await fetch(`/api/journey/trip?from=${encodeURIComponent(departure)}&to=${encodeURIComponent(arrival)}`);
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des trajets');
                }
                
                const data = await response.json();
                
                // Organiser les trajets par date
                const journeysByDate: {[key: string]: Journey[]} = {};
                
                data.journeys.forEach((journey: Journey) => {
                    if (!journeysByDate[journey.day]) {
                        journeysByDate[journey.day] = [];
                    }
                    journeysByDate[journey.day].push(journey);
                });
                
                setAvailableJourneyDates(journeysByDate);
            } catch (error) {
                console.error('Erreur lors du chargement des trajets:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchJourneysForMonth();
    }, [currentMonth, departure, arrival]);

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        if (onChange) {
            const journeys = getJourneysForDate(date);
            onChange(date, journeys);
        }
    };

    const handleMonthChange = (date: Date) => {
        setCurrentMonth(date);
    };

    // On récupere le jour de la semaine à partir de la date
    const getDayOfWeek = (date: Date): string => {
        // On mets en US pour avoir le nom du jour en anglais et long pour avoir le nom complet
        return date.toLocaleDateString("en-US", {weekday: "long"});
    };

    // On récupère les trajets pour la date
    const getJourneysForDate = (date: Date | null): Journey[] => {
        if (!date) return [];
        const dateStr = format(date, "yyyy-MM-dd");
        return availableJourneyDates[dateStr] || [];
    };
    
    // Vérifier si une date a des trajets disponibles
    const hasJourneysForDate = (date: Date): boolean => {
        const dateStr = format(date, "yyyy-MM-dd");
        return !!availableJourneyDates[dateStr] && availableJourneyDates[dateStr].length > 0;
    };

    return (
        <div>
            {loading && <div className="text-center py-2 text-primary">Chargement des trajets...</div>}
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                onMonthChange={handleMonthChange}
                inline
                locale={fr}
                calendarClassName="custom-calendar"
                dayClassName={() => "calendar-day"}
                monthClassName={() => "calendar-month"}
                renderDayContents={(day, date) => {
                    if (!date) return day;
                    // ON calcule le prix en fonction de la distance et du jour
                    const dayOfWeek = getDayOfWeek(date);
                    const price = calculatePriceWithDayAdjustment(distanceKm, dayOfWeek);
                    
                    // Vérifier si cette date a des trajets disponibles
                    const hasJourneys = hasJourneysForDate(date);
                    
                    return (
                        <div className="day-cell">
                            <div className="day-content">
                                <span className="day-number">{day}</span>
                                <span className="day-price">{price}€</span>
                            </div>
                        </div>
                    );
                }}
            />
        </div>
    );
};

export default Calendar;
