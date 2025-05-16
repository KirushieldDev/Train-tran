import React, {useState, useEffect} from "react";
import DatePicker from "react-datepicker";
import {fr} from "date-fns/locale";
import {format} from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "@traintran/style/calendar.css";
import {calculatePriceWithDayAdjustment, getDayOfWeek, isJourneyAvailableOnDay} from "@traintran/utils/travel";
import {Journey} from "@traintran/components/Calendar/types";

interface CalendarProps {
    onChange?: (date: Date | null, journeys?: Journey[], type?: "outbound" | "inbound") => void;
    distanceKm: number;
    selectedDate?: Date | null;
    departure?: string;
    arrival?: string;
    type?: "outbound" | "inbound"; // Type de date (aller ou retour)
    minDate?: Date; // Date minimale pour le calendrier (utile pour le retour)
    title?: string; // Titre du calendrier
}

const Calendar: React.FC<CalendarProps> = ({onChange, distanceKm, selectedDate, departure, arrival, type = "outbound", minDate, title}) => {
    const [currentDate, setCurrentDate] = useState<Date | null>(selectedDate || new Date());
    const [availableJourneyDates, setAvailableJourneyDates] = useState<{[key: string]: Journey[]}>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    // Mettre à jour l'état local si selectedDate change
    useEffect(() => {
        if (selectedDate) {
            setCurrentDate(selectedDate);
        }
    }, [selectedDate]);

    // Charger les trajets disponibles pour le mois en cours
    useEffect(() => {
        const fetchJourneysForMonth = async () => {
            if (!departure || !arrival) return;

            setLoading(true);
            try {
                // Construire l'URL avec URLSearchParams
                const params = new URLSearchParams({from: departure, to: arrival});

                // Récupérer les trajets pour chaque jour du mois
                const response = await fetch(`/api/journey/trip?${params.toString()}`);
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des trajets");
                }

                // Organiser les trajets par date
                const data = await response.json();

                const journeysByDate: {[key: string]: Journey[]} = {};

                data.journeys.forEach((journey: Journey) => {
                    // Vérifier que journey.day est défini avant de l'utiliser comme index
                    if (journey.day) {
                        if (!journeysByDate[journey.day]) {
                            journeysByDate[journey.day] = [];
                        }
                        journeysByDate[journey.day].push(journey);
                    }
                });

                setAvailableJourneyDates(journeysByDate);
            } catch (error) {
                console.error("Erreur lors du chargement des trajets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJourneysForMonth();
    }, [currentMonth, departure, arrival]);

    const handleDateChange = (date: Date | null) => {
        // Vérifier si la date est dans le passé ou avant la date minimale
        const currentMinDate = minDate || new Date();
        if (date && date < currentMinDate) {
            console.error("Impossible de sélectionner cette date");
            return;
        }

        setCurrentDate(date);
        if (onChange) {
            const journeys = getJourneysForDate(date);
            onChange(date, journeys, type);
        }
    };

    const handleMonthChange = (date: Date) => {
        setCurrentMonth(date);
    };

    // On récupère les trajets pour la date
    const getJourneysForDate = (date: Date | null): Journey[] => {
        if (!date) return [];
        const dateStr = format(date, "yyyy-MM-dd");
        return availableJourneyDates[dateStr] || [];
    };

    // Vérifier si une date a des trajets disponibles
    const hasJourneysForDayOfWeek = (date: Date): boolean => {
        const dayOfWeek = getDayOfWeek(date);

        // Parcourir toutes les dates disponibles pour voir si un trajet est disponible pour ce jour de la semaine
        for (const dateStr in availableJourneyDates) {
            const journeys = availableJourneyDates[dateStr];
            const hasJourney = journeys.some(journey => isJourneyAvailableOnDay(dayOfWeek, journey.weekPattern));

            if (hasJourney) return true;
        }

        return false;
    };

    return (
        <div>
            {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
            {loading && <div className="text-center py-2 text-primary">Chargement des trajets...</div>}
            <DatePicker
                selected={currentDate}
                onChange={handleDateChange}
                onMonthChange={handleMonthChange}
                inline
                locale={fr}
                minDate={minDate || new Date()}
                calendarClassName="custom-calendar"
                dayClassName={date => (hasJourneysForDayOfWeek(date) ? "calendar-day available" : "calendar-day")}
                renderDayContents={(day, date) => {
                    if (!date) return <span>{day}</span>;

                    // Calcul du prix en fonction de la distance et du jour
                    const dayOfWeek = getDayOfWeek(date);
                    const price = calculatePriceWithDayAdjustment(distanceKm, dayOfWeek);

                    // Vérifier si cette date a des trajets disponibles
                    const hasJourneys = hasJourneysForDayOfWeek(date);

                    return (
                        <div className="day-cell">
                            <div className="day-content">
                                <span className="day-number">{day}</span>
                                <span className="day-price">{price}€</span>
                                {!hasJourneys && (
                                    <span className="day-unavailable" style={{fontSize: "10px", color: "#999"}}>
                                        Indisponible
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                }}
            />
        </div>
    );
};

export default Calendar;
