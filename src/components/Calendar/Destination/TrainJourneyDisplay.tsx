"use client";

import React from "react";
import {IconArrowRight, IconEdit} from "@tabler/icons-react";
import TrainSVG from "@traintran/assets/Calendar/TrainSVG";
import Link from "next/link";
import {useSearchParams} from "next/navigation";

export default function TrainJourneyDisplay() {
    const searchParams = useSearchParams();

    // Use the given searchParams from props
    const departure = searchParams?.get("departure");
    const arrival = searchParams?.get("arrival");
    const departure_date = searchParams?.get("departure_date");
    const return_date = searchParams?.get("return_date") || "";

    return (
        <article className="flex flex-col gap-2.5 items-start p-6 bg-white rounded-lg shadow-sm mt-5">
            <div className="flex justify-between items-center w-full">
                <div className="w-full flex gap-2.5 items-center">
                    <figure className="flex justify-center items-center w-8 h-[29px]">
                        <TrainSVG />
                    </figure>
                    <h2 className="w-full flex gap-4 py-3.5 text-xl font-bold leading-5 text-textPrimary">
                        {departure}
                        <IconArrowRight className="text-textPrimary" size="20" />
                        {arrival}
                    </h2>
                </div>
                <Link
                    href={`/?${new URLSearchParams({
                        departure: departure || "",
                        arrival: arrival || "",
                        ...(departure_date && {departure_date}),
                        ...(return_date && {return_date}),
                    }).toString()}`}
                    className="flex gap-2 items-center cursor-pointer max-sm:justify-end max-sm:w-full"
                    aria-label="Modifier le trajet">
                    <IconEdit className="text-primary" size="16" />
                    <span className="text-base text-primary">Modifier</span>
                </Link>
            </div>
        </article>
    );
}
