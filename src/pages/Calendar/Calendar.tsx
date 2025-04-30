import Header from "../../components/Header/Header.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import TrainJourneyDisplay from "../../components/Calendar/Destination/TrainJourneyDisplay.tsx";
import CalendarPricing from "../../components/Calendar/Calendar/CalendarPricing.tsx";
import Departure from "../../components/Calendar/Departure/Departure.tsx";

function Calendar() {
    return (
        <>
            <div className="bg-background">
                <Header />
                <div className="px-4 md:px-40 lg:px-40">
                    <TrainJourneyDisplay />
                    <CalendarPricing />
                    <Departure />
                </div>
                <Footer />
            </div>
        </>
    );
}

export default Calendar;
