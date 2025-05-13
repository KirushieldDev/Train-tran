"use client";

import React, {useEffect, useState} from "react";
import {useCart, Passenger} from "@traintran/context/CartContext";
import {useRouter} from "next/navigation";
import {IconPlus, IconTrash} from "@tabler/icons-react";
import {FormInput} from "@traintran/components/Inputs/Form/FormInput";

export default function PassengersForm() {
    const router = useRouter();
    const {cartTicket, setAllPassengers} = useCart();
    const [localPassengers, setLocalPassengers] = useState<Passenger[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!cartTicket) return;
        setLocalPassengers(cartTicket.passengers);
    }, [cartTicket]);

    const handleAdd = () => {
        setLocalPassengers([...localPassengers, {firstName: "", lastName: "", age: 0}]);
    };

    const handleChange = (idx: number, field: keyof Passenger, value: string | number) => {
        const copy = [...localPassengers];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        copy[idx][field] = value;
        setLocalPassengers(copy);
    };

    const handleRemove = (idx: number) => {
        setLocalPassengers(localPassengers.filter((_, i) => i !== idx));
    };

    const disableSubmit = () => {
        if (localPassengers.length < 1) {
            setErrorMsg("Aucun passager renseigné");
            return true;
        }
        if (localPassengers.some(({firstName, lastName, age}) => !firstName.trim() || !lastName.trim() || age <= 0)) {
            setErrorMsg("Passagers invalides");
            return true;
        }
    };

    const handleSubmit = () => {
        if (disableSubmit()) return;
        // Nettoyage des passagers du context si existants
        // Ajout de l'ensemble des nouveaux passagers
        setAllPassengers(localPassengers);
        router.push("/options");
    };

    if (!cartTicket) return;

    const handleBack = () => {
        const params = new URLSearchParams({
            departure: cartTicket.outbound.departureStation,
            arrival: cartTicket.outbound.arrivalStation,
            departure_date: cartTicket.outbound.departureTime.split("T")[0],
        });
        if (cartTicket.inbound) {
            params.set("return_date", cartTicket.inbound.arrivalTime.split("T")[0]);
        }
        router.push(`/calendrier?${params.toString()}`);
    };

    return (
        <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-sm space-y-4">
            <h2 className="w-full text-xl font-semibold text-textPrimary">Passagers</h2>
            {localPassengers.map((p, i) => (
                <div key={i} className="flex justify-center items-end gap-4">
                    <FormInput
                        label="Prénom"
                        name="firstname"
                        type="text"
                        value={p.firstName}
                        onChange={value => handleChange(i, "firstName", value)}
                        required
                    />

                    <FormInput label="Nom" name="lastname" type="text" value={p.lastName} onChange={value => handleChange(i, "lastName", value)} required />

                    <FormInput label="Âge" name="age" type="number" value={p.age.toString()} onChange={value => handleChange(i, "age", value)} required />

                    <button type="button" onClick={() => handleRemove(i)} className="p-2 pb-3 text-textSecondary hover:text-red-600">
                        <IconTrash size={20} />
                    </button>
                </div>
            ))}

            <button onClick={handleAdd} className="button-base button-variant-outline button-size-md mt-2 gap-2">
                <IconPlus size={20} />
                Ajouter un passager
            </button>

            {/* Affichage de l’erreur si besoin */}
            {errorMsg && <p className="mt-4 text-sm text-red-600">{errorMsg}</p>}

            <div className="flex flex-wrap gap-2.5 justify-center mt-8 mb-5 w-full text-base text-center max-md:max-w-full">
                <button onClick={handleBack} className="button-base button-variant-outline button-size-lg">
                    Retour
                </button>
                <button onClick={handleSubmit} className="button-base button-variant-secondary button-size-lg">
                    Continuer
                </button>
            </div>
        </div>
    );
}
