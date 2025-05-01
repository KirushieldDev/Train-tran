"use client";

import React, {useState} from "react";
import {FormInput} from "@traintran/components/Home/Form/FormInput";
import TrainSVG from "@traintran/assets/Home/TrainSVG";
import {SearchButton} from "@traintran/components/Home/Form/SearchButton";

export const SearchForm: React.FC = () => {
    const [stations, setStations] = useState<string[]>([]);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    React.useEffect(() => {
        fetch("/api/stations-name")
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

    return (
        <form className="flex flex-col items-center w-full" action={"/calendrier"}>
            <div className="flex flex-wrap gap-6 items-start w-full">
                <FormInput
                    label="Gare de départ"
                    placeholder="Saisissez une gare de départ"
                    icon={<TrainSVG />}
                    required
                    value={from}
                    onChange={e => setFrom(e.currentTarget.value)}
                    suggestions={filter(from)}
                />
                <FormInput
                    label="Gare d'arrivée"
                    placeholder="Saisissez une gare d'arrivée"
                    icon={<TrainSVG />}
                    required
                    value={to}
                    onChange={e => setTo(e.currentTarget.value)}
                    suggestions={filter(to)}
                />
                <FormInput label="Date de départ" placeholder="mm/dd/yyyy" type="date" required autocompleteToday />
                <FormInput label="Date de retour" placeholder="mm/dd/yyyy" type="date" />
            </div>
            <SearchButton />
        </form>
    );
};
