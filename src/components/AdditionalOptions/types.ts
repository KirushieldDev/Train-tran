import {ReactNode} from "react";

export interface Option {
    id: string;
    name: string;
    description: string;
    price: number;
    Icon?: ReactNode;
}

export interface OptionCardProps {
    option: Option;
    isSelected: boolean;
    onToggle: (id: string) => void;
}

export interface OptionsListProps {
    options: Option[];
    selectedOptions: string[];
    onOptionToggle: (id: string) => void;
}

export interface OrderSummaryProps {
    basePrice: number;
    selectedOptions: Option[];
    totalPrice: number;
    onContinue?: () => void;
    showButton?: boolean;
}
