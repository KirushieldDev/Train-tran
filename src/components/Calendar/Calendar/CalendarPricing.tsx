import {CalendarHeader} from "@traintran/components/Calendar/Calendar/CalendarHeader";
import {WeekDayLabels} from "@traintran/components/Calendar/Calendar/WeekDayLabels";
import {DateCell} from "@traintran/components/Calendar/Calendar/DateCell";
import {PricingSummary} from "@traintran/components/Calendar/Calendar/PricingSummary";

export default function CalendarPricing() {
    return (
        <section className="flex flex-col gap-6 items-start p-6 mt-5 w-full bg-white rounded-lg border-[0px_solid_#E5E7EB]">
            <CalendarHeader month="Mars 2025" />

            <div className="flex flex-col gap-2 w-full">
                {/* Ligne pour WeekDayLabels */}
                <div className="flex flex-row w-full">
                    <WeekDayLabels />
                </div>
                {/* Ligne pour les DateCells */}
                <div className="flex flex-row gap-2 w-full">
                    <DateCell day={1} price={89} />
                    <DateCell day={2} price={92} />
                    <DateCell day={3} price={85} isSelected={true} />
                    <DateCell day={4} price={99} />
                    <DateCell day={5} price={105} />
                    <DateCell day={6} price={120} />
                    <DateCell day={7} price={94} />
                </div>
            </div>

            <PricingSummary lowestPrice={85} averagePrice={88} highestPrice={120} />
        </section>
    );
}
