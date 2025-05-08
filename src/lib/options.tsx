import {ReactNode} from "react";
import {IconVolume3, IconPlug, IconLuggage, IconMessagePause, IconShieldDollar} from "@tabler/icons-react";

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

export default function getOptionById(id: OptionID) {
    return optionsList.find(option => option.id === id);
}

export const optionsList: Option[] = [
    {
        id: OptionID.Quiet,
        name: "Place tranquille",
        description: "Voyagez dans une zone calme et silencieuse",
        price: 5,
        Icon: <IconVolume3 className="text-textSecondary" size={16} />,
    },
    {
        id: OptionID.Power,
        name: "Prise électrique",
        description: "Accès garanti à une prise électrique",
        price: 3,
        Icon: <IconPlug className="text-textSecondary" size={16} />,
    },
    {
        id: OptionID.Baggage,
        name: "Bagage supplémentaire",
        description: "Ajoutez un bagage supplémentaire à votre voyage (20kg max)",
        price: 15,
        Icon: <IconLuggage className="text-textSecondary" size={16} />,
    },
    {
        id: OptionID.Sms,
        name: "Information par SMS",
        description: "Recevez des notifications sur votre trajet",
        price: 0,
        Icon: <IconMessagePause className="text-textSecondary" size={16} />,
    },
    {
        id: OptionID.Insurance,
        name: "Garantie annulation",
        description: "Protection en cas d'annulation ou de perturbation",
        price: 10,
        Icon: <IconShieldDollar className="text-textSecondary" size={16} />,
    },
];
