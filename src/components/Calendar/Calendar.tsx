"use client";

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import '@traintran/style/calendar.css';

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
}

const Calendar: React.FC<CalendarProps> = ({ onChange, availableDates = [] }) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        if (onChange) {
            const journeys = getJourneysForDate(date);
            onChange(date, journeys);
        }
    };

    // Function to get the journeys for a date
    const getJourneysForDate = (date: Date | null): Journey[] => {
        if (!date) return [];

        const dateStr = format(date, 'yyyy-MM-dd');
        const dateData = availableDates.find(item => format(item.date, 'yyyy-MM-dd') === dateStr);
        return dateData?.journeys || [];
    };

    // Function to get the minimum price for a date
    const getMinPrice = (date: Date): number | null => {
        const journeys = getJourneysForDate(date);
        if (journeys.length === 0) return null;

        return Math.min(...journeys.map(journey => journey.price));
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

                const minPrice = getMinPrice(date);
                const hasJourneys = minPrice !== null;

                return (
                    <div className="day-cell">
                        <div className="day-content">
                            <span className="day-number">{day}</span>
                            {hasJourneys && (
                                <span className="day-price">{minPrice}€</span>
                            )}
                        </div>
                    </div>
                );
            }}
        />
    );
};

export default Calendar;
