"use client";

import React, {ReactNode, useEffect, useState} from "react";
import {IconVolume3, IconPlug, IconLuggage, IconMessagePause, IconShieldDollar} from "@tabler/icons-react";
import dbConnect from "@traintran/utils/dbConnect";
import {Option as OptionModel, IOption} from "@traintran/database/models/options";

export enum OptionID {
    Quiet = "quiet",
    Power = "power",
    Baggage = "baggage",
    Sms = "sms",
    Insurance = "insurance",
}

export interface Option {
    id: OptionID;
    name: string;
    description: string;
    price: number;
    Icon?: ReactNode;
}

// Map des icônes par nom
const iconMap: Record<string, ReactNode> = {
    IconVolume3: <IconVolume3 color="var(--color-primary)" size={16} />,
    IconPlug: <IconPlug color="var(--color-primary)" size={16} />,
    IconLuggage: <IconLuggage color="var(--color-primary)" size={16} />,
    IconMessagePause: <IconMessagePause color="var(--color-primary)" size={16} />,
    IconShieldDollar: <IconShieldDollar color="var(--color-primary)" size={16} />,
};

// Version client avec état local et chargement des données
export function useOptionsList(): {
    options: Option[];
    loading: boolean;
    error: Error | null;
    getOptionById: (id: OptionID) => Option | undefined;
} {
    const [options, setOptions] = useState<Option[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchOptions() {
            try {
                const response = await fetch("/api/options");
                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des options");
                }
                const data: IOption[] = await response.json();

                // Transformer les données de la BD en objets Option avec icônes
                const optionsWithIcons = data
                    .filter(opt => opt.isActive)
                    .map(opt => ({
                        id: opt.id as OptionID,
                        name: opt.name,
                        description: opt.description,
                        price: opt.price,
                        Icon: iconMap[opt.iconName] || null,
                    }));

                setOptions(optionsWithIcons);
            } catch (err) {
                console.error("Erreur lors du chargement des options:", err);
                setError(err instanceof Error ? err : new Error(String(err)));
                // Utiliser les options par défaut en cas d'erreur
                setOptions(fallbackOptionsList);
            } finally {
                setLoading(false);
            }
        }

        fetchOptions();
    }, []);

    const getOptionById = (id: OptionID) => {
        return options.find(option => option.id === id);
    };

    return {options, loading, error, getOptionById};
}

// Options de secours en cas d'erreur de chargement
const fallbackOptionsList: Option[] = [
    {
        id: OptionID.Quiet,
        name: "Place tranquille",
        description: "Voyagez dans une zone calme et silencieuse",
        price: 5,
        Icon: <IconVolume3 color="var(--color-primary)" size={16} />,
    },
    {
        id: OptionID.Power,
        name: "Prise électrique",
        description: "Accès garanti à une prise électrique",
        price: 3,
        Icon: <IconPlug color="var(--color-primary)" size={16} />,
    },
    {
        id: OptionID.Baggage,
        name: "Bagage supplémentaire",
        description: "Ajoutez un bagage supplémentaire à votre voyage (20kg max)",
        price: 15,
        Icon: <IconLuggage color="var(--color-primary)" size={16} />,
    },
    {
        id: OptionID.Sms,
        name: "Information par SMS",
        description: "Recevez des notifications sur votre trajet",
        price: 0,
        Icon: <IconMessagePause color="var(--color-primary)" size={16} />,
    },
    {
        id: OptionID.Insurance,
        name: "Garantie annulation",
        description: "Protection en cas d'annulation ou de perturbation",
        price: 10,
        Icon: <IconShieldDollar color="var(--color-primary)" size={16} />,
    },
];

// Pour la rétrocompatibilité, on exporte une version statique
export const optionsList: Option[] = fallbackOptionsList;

// Pour la rétrocompatibilité, on exporte aussi la fonction getOptionById
export default function getOptionById(id: OptionID) {
    return optionsList.find(option => option.id === id);
}
