"use client";
import { CalendarHeader } from "./CalendarHeader";
import { WeekDayLabels } from "./WeekDayLabels";
import { DateCell } from "./DateCell";
import { PricingSummary } from "./PricingSummary";

export default function CalendarPricing() {
    return (
        <section className="flex flex-col gap-6 items-start p-6 mt-5 w-full bg-white rounded-lg border-[0px_solid_#E5E7EB]">
            <CalendarHeader month="Mars 2025" />

            <div className="flex flex-wrap gap-2 w-full">
                <WeekDayLabels />
                <DateCell day={1} price={89} />
                <DateCell day={2} price={92} />
                <DateCell day={3} price={85} isSelected={true} />
            </div>

            <PricingSummary lowestPrice={85} averagePrice={88} highestPrice={92} />
        </section>
    );
}
