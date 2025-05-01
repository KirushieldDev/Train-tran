interface DateCellProps {
    day: number;
    price: number;
    isSelected?: boolean;
}

export function DateCell({day, price, isSelected = false}: DateCellProps) {
    const baseClasses = "flex flex-col gap-1 p-3.5 rounded-lg border flex-1"; // flex-1 pour adapter la largeur
    const selectedClasses = isSelected ? "bg-emerald-50 border-2 border-primary" : "border border-gray-300";

    const dayClasses = `h-6 text-base text-center text-black ${isSelected ? "font-bold" : ""}`;
    const priceClasses = `h-6 text-base font-bold text-center ${isSelected ? "text-primary" : "text-black"}`;

    return (
        <article className={`${baseClasses} ${selectedClasses}`}>
            <div className={dayClasses}>{day}</div>
            <div className={priceClasses}>€{price}</div>
        </article>
    );
}
