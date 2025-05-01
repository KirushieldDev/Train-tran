import { useMemo, useState, useEffect } from 'react';
import Header from "../../components/Header/Header.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import Calendar, { Journey, DateWithJourneys } from "../../components/Calendar/Calendar.tsx";
import TrainJourneyDisplay from "../../components/Calendar/TrainJourneyDisplay.tsx";
import { JourneyDisplay } from "../../components/Calendar/JourneyDisplay";
import journeyData from "../../components/Calendar/journeys.json";
import { format } from 'date-fns';

function CalendarPage() {
    // State for selected date and available journeys
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableJourneys, setAvailableJourneys] = useState<Journey[]>([]);
    const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);

    // Convert JSON data to DateWithJourneys objects
    const availableDates = useMemo(() => {
        return journeyData.journeys.map(item => ({
            date: new Date(item.date),
            journeys: item.journeys
        }));
    }, []);

    // Find the closest date with available journeys
    const findClosestDateWithJourneys = (): DateWithJourneys | null => {
        const today = new Date();

        // First check if today has journeys
        const todayStr = format(today, 'yyyy-MM-dd');
        const todayData = availableDates.find(item => format(item.date, 'yyyy-MM-dd') === todayStr);
        if (todayData && todayData.journeys.length > 0) {
            return todayData;
        }

        // If not, find the next closest date with journeys
        const futureDates = availableDates
            .filter(item => item.date > today && item.journeys.length > 0)
            .sort((a, b) => a.date.getTime() - b.date.getTime());

        return futureDates.length > 0 ? futureDates[0] : null;
    };

    // Initialize with the current date and first available journey
    useEffect(() => {
        const closestDateWithJourneys = findClosestDateWithJourneys();
        if (closestDateWithJourneys) {
            setSelectedDate(closestDateWithJourneys.date);
            setAvailableJourneys(closestDateWithJourneys.journeys);

            // Select the first journey by default
            if (closestDateWithJourneys.journeys.length > 0) {
                setSelectedJourney(closestDateWithJourneys.journeys[0]);
            }
        }
    }, [availableDates]);

    const handleDateChange = (date: Date | null, journeys?: Journey[]) => {
        setSelectedDate(date);
        setAvailableJourneys(journeys || []);

        // Select the first journey by default when changing date
        if (journeys && journeys.length > 0) {
            setSelectedJourney(journeys[0]);
        } else {
            setSelectedJourney(null);
        }
    };

    const handleJourneySelect = (journey: Journey) => {
        setSelectedJourney(journey);
    };

    return (
        <>
            <div className="bg-background">
                <Header />
                <div className="px-4 md:px-40 lg:px-40 py-8">
                    <TrainJourneyDisplay />
                    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                        <Calendar
                            onChange={handleDateChange}
                            availableDates={availableDates}
                        />

                        {selectedDate && availableJourneys.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-xl font-semibold mb-4">Trajets disponibles pour le {selectedDate.toLocaleDateString('fr-FR')}</h2>
                                <div className="space-y-4">
                                    {availableJourneys.map((journey) => (
                                        <JourneyDisplay
                                            key={journey.id}
                                            journey={journey}
                                            onSelect={handleJourneySelect}
                                            isSelected={selectedJourney?.id === journey.id}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedDate && availableJourneys.length === 0 && (
                            <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center">
                                <p>Aucun trajet disponible pour cette date.</p>
                            </div>
                        )}

                        {/* Button that appears when a journey is selected */}
                        {selectedJourney && (
                            <div className="mt-8 flex justify-center">
                                <button
                                    className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-md"
                                    onClick={() => console.log('Trajet sélectionné:', selectedJourney)}
                                >
                                    Réserver ce trajet
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default CalendarPage;
