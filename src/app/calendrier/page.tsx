"use client";

import { useMemo } from 'react';
import Header from "@traintran/components/Header/Header";
import TrainJourneyDisplay from "@traintran/components/Calendar/Destination/TrainJourneyDisplay";
import Calendar, { Journey } from "@traintran/components/Calendar/Calendar";
import Departure from "@traintran/components/Calendar/Departure/Departure";
import Footer from "@traintran/components/Footer/Footer";
import journeyData from "@traintran/components/Calendar/journeys.json";

export default function CalendarPage() {
    const availableDates = useMemo(() => {
        return journeyData.journeys.map(item => ({
            date: new Date(item.date),
            journeys: item.journeys
        }));
    }, []);

    const handleDateChange = (date: Date | null, journeys?: Journey[]) => {
        console.log("Date sélectionnée:", date);
        console.log("Trajets disponibles:", journeys);
    };

    return (
        <>
            <Header />
            <div className="px-4 md:px-40 lg:px-40">
                <TrainJourneyDisplay />
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <Calendar
                        onChange={handleDateChange}
                        availableDates={availableDates}
                    />
                </div>
                <Departure />
            </div>
            <Footer />
        </>
    );
}
