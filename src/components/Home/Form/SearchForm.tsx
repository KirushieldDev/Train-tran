"use client";

import React, {useState} from "react";
import {FormInput} from "@traintran/components/Home/Form/FormInput";
import TrainSVG from "@traintran/assets/Home/TrainSVG";
import {SearchButton} from "@traintran/components/Home/Form/SearchButton";
import {useRouter, useSearchParams} from "next/navigation";

export const SearchForm: React.FC = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // Récupérer les paramètres de l'URL
    const departureParam = searchParams?.get("departure") || "";
    const arrivalParam = searchParams?.get("arrival") || "";
    const departureDateParam = searchParams?.get("departure_date") || new Date().toISOString().split("T")[0];
    const returnDateParam = searchParams?.get("return_date") || "";
    
    const [stations, setStations] = useState<string[]>([]);
    const [from, setFrom] = useState(departureParam);
    const [to, setTo] = useState(arrivalParam);
    const [departureDate, setDepartureDate] = useState(departureDateParam);
    const [returnDate, setReturnDate] = useState(returnDateParam);
    

    React.useEffect(() => {
        fetch("/api/journey/stations-name")
            .then(res => {
                if (!res.ok) throw new Error(res.statusText);
                return res.json() as Promise<string[]>;
            })
            .then(names => setStations(names))
            .catch(() => setStations([]));
    }, []);

    const filter = (q: string) => {
        const lower = q.toLowerCase();
        return stations.filter(n => n.toLowerCase().startsWith(lower));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams({
            departure: from,
            arrival: to,
            departure_date: departureDate,
        });
        if (returnDate) {
            params.set("return_date", returnDate);
        }
        router.push(`/calendrier?${params.toString()}`);
    };

    return (
        <form onSubmit={onSubmit} className="flex flex-col items-center w-full">
            <div className="flex flex-wrap gap-6 items-start w-full">
                <FormInput
                    label="Gare de départ"
                    name="departure"
                    placeholder="Saisissez une gare de départ"
                    icon={<TrainSVG />}
                    required
                    value={from}
                    onChange={e => setFrom(e.currentTarget.value)}
                    suggestions={filter(from)}
                />
                <FormInput
                    label="Gare d'arrivée"
                    name="arrival"
                    placeholder="Saisissez une gare d'arrivée"
                    icon={<TrainSVG />}
                    required
                    value={to}
                    onChange={e => setTo(e.currentTarget.value)}
                    suggestions={filter(to)}
                />
                <FormInput
                    label="Date de départ"
                    name="departure_date"
                    placeholder="mm/dd/yyyy"
                    type="date"
                    required
                    value={departureDate}
                    onChange={e => setDepartureDate(e.currentTarget.value)}
                />
                <FormInput
                    label="Date de retour"
                    name="return_date"
                    placeholder="mm/dd/yyyy"
                    type="date"
                    value={returnDate}
                    onChange={e => setReturnDate(e.currentTarget.value)}
                />
            </div>
            <SearchButton />
        </form>
    );
};
