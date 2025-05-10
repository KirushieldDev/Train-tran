import {Option, OptionID} from "@traintran/lib/options";

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
    selectedOptions: OptionID[];
    showButton?: boolean;
}
