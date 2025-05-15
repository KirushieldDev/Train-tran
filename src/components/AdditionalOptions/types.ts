import {Option, OptionID} from "@traintran/lib/options";
import {Ticket} from "@traintran/context/CartContext";

// Props pour la carte d'une option individuelle
export interface OptionCardProps {
    option: Option;
    isSelected: boolean;
    onToggle: (id: OptionID) => void;
}

// Props pour la liste des options sélectionnables
export interface OptionsListProps {
    selectedOptions: OptionID[];
    onOptionToggle: (id: OptionID) => void;
}

// Props pour le résumé de commande avec les options sélectionnées
export interface OrderSummaryProps {
    ticket: Ticket;
    selectedOptions: OptionID[];
    showButton?: boolean;
    reduce?: boolean;
}
