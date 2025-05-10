import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {fr} from "date-fns/locale";
import {format} from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "@traintran/style/calendar.css";
import {calculatePriceWithDayAdjustment} from "@traintran/utils/travel";

export interface Journey {
    id: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
}

export interface DateWithJourneys {
    date: Date;
    journeys: Journey[];
}

interface CalendarProps {
    onChange?: (date: Date | null, journeys?: Journey[]) => void;
    availableDates?: DateWithJourneys[];
    distanceKm: number;
}

const Calendar: React.FC<CalendarProps> = ({onChange, availableDates = [], distanceKm}) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        if (onChange) {
            const journeys = getJourneysForDate(date);
            onChange(date, journeys);
        }
    };

    // On récupere le jour de la semaine à partir de la date
    const getDayOfWeek = (date: Date): string => {
        // On mets en US pour avoir le nom du jour en anglais et long pour avoir le nom complet
        return date.toLocaleDateString("en-US", {weekday: "long"});
    };

    //On récupère les trajets pour la date
    const getJourneysForDate = (date: Date | null): Journey[] => {
        if (!date) return [];
        const dateStr = format(date, "yyyy-MM-dd");
        const dateData = availableDates.find(item => format(item.date, "yyyy-MM-dd") === dateStr);
        return dateData?.journeys || [];
    };

    return (
        <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
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
    );
};

export default Calendar;
