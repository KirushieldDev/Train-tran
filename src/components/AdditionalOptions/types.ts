import {Option, OptionID} from "@traintran/lib/options";
import {Ticket} from "@traintran/context/CartContext";

export interface OptionCardProps {
    option: Option;
    isSelected: boolean;
    onToggle: (id: OptionID) => void;
}

export interface OptionsListProps {
    selectedOptions: OptionID[];
    onOptionToggle: (id: OptionID) => void;
}

export interface OrderSummaryProps {
    ticket: Ticket;
    selectedOptions: OptionID[];
    showButton?: boolean;
    reduce?: boolean;
}
