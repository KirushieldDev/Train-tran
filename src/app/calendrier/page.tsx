import Header from "@traintran/components/Header/Header";
import TrainJourneyDisplay from "@traintran/components/Calendar/Destination/TrainJourneyDisplay";
import CalendarPricing from "@traintran/components/Calendar/Calendar/CalendarPricing";
import Departure from "@traintran/components/Calendar/Departure/Departure";
import Footer from "@traintran/components/Footer/Footer";
import {CalendrierProps} from "@traintran/app/calendrier/props";

export default async function Home(props: CalendrierProps) {
    return (
        <>
            <Header />
            <div className="px-4 md:px-40 lg:px-40">
                <TrainJourneyDisplay {...props} />
                <CalendarPricing />
                <Departure />
            </div>
            <Footer />
        </>
    );
}
